// =====================================================================
//  sc-code — hook, bit, byte (owner: sc-code agent).  All drawing in px at RES 270x480, PAL16 only.
//  hook: a "MENU" poster with the real QR (QR_M, m 4); the hero raises a phone, "?" on "lộn xộn", then on
//        "thật ra là chữ" the QR grows in whole-module steps (m 4 -> 8) to the big position (QX, QY).
//  bit:  QR_RAW (+ note); dark module (10, 3) -> callout "= 1"; light module (10, 14) -> callout "= 0";
//        row 10 gets its bits typed under it (1s on "một", 0s on "không").
//  byte: the 8 modules of 'C' (QR_CHAR_C, stream order) pop out and slide into a row of big cells:
//        0 1 0 0 0 0 1 1 = C; then they slide back -> calm big QR_RAW at the end (finder starts from it).
// =====================================================================

// ---- the poster (hook; the end scene reuses the same place/size): paper 98..214 x 116..256, QR m 4 at (114, 150)
const cd_PAPER = [98, 116, 116, 140];
const cd_PQ = [114, 150, 4];
const cd_NOTE = () => viText('(chưa phủ mặt nạ)', 235, 82, Q.grey, { size: 13, align: 'right' });
// redraw the floor (to hide things that sink "under" it)
const cd_floor = () => { prect(0, FLOOR_Y, 270, 480 - FLOOR_Y, Q.ink); prect(0, FLOOR_Y, 270, 1, Q.slate); };
const cd_hero = (o = {}) => heroAt(HERO_PX[0], HERO_PX[1], o);
// pixel corner brackets around a box (x, y, w, h), arm length a, thickness t
function cd_brackets(x, y, w, h, col, a = 8, t = 2) {
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
    prect(sx > 0 ? cx : cx - a, sy > 0 ? cy : cy - t, a, t, col);
    prect(sx > 0 ? cx : cx - t, sy > 0 ? cy : cy - a, t, a, col);
  }
}

// =====================================================================
//  HOOK 0 – 6.75
// =====================================================================
SCENES.hook = () => lowres(RES, () => {
  const T = TT;
  const tQR = VW('hook', 'QR'), tTrong = VW('hook', 'trông'), tLon = VW('hook', 'lộn'), tNhung = VW('hook', 'nhưng');
  const tThat = VW('hook', 'thật'), tChu = VW('hook', 'chữ');
  qrWorld();
  // zoom step: 0 (poster, m 4) .. 4 (big, m 8), one module size per step
  const zs = [tThat + 0.05, tThat + 0.3, tThat + 0.55, tThat + 0.8].filter((t) => T >= t).length;
  // the poster (until the QR has grown over it)
  if (zs < 3) {
    const [x, y, w, h] = cd_PAPER;
    prect(x - 2, y - 2, w + 4, h + 4, Q.slate);
    prect(x, y, w, h, Q.white);
    viText('MENU', x + w / 2, y + 8, Q.ink, { size: 16, align: 'center', count: clamp((T - 0.1) / 0.5) * 4 });
    prect(x + 30, y + h - 10, w - 60, 2, Q.grey);    // a little rule under the code
  }
  // the QR: poster size -> big, whole-module steps (centre moves on whole pixels)
  const m = 4 + zs, f = zs / 4;
  const cx = Math.round(156 + (125 - 156) * f), cy = Math.round(192 + (188 - 192) * f);
  drawQR(cx - Math.round(10.5 * m), cy - Math.round(10.5 * m), m);
  // the viewfinder lock-on around the poster QR ("trông")
  if (T >= tTrong && zs === 0) {
    const k = Math.max(0, 3 - Math.floor((T - tTrong) / 0.12)) * 4, pulse = Math.floor((T - tTrong) / 0.75) % 2;
    cd_brackets(108 - k - pulse, 144 - k - pulse, 96 + 2 * k + 2 * pulse, 96 + 2 * k + 2 * pulse, Q.grey, 10, 2);
  }
  // "lộn xộn": a grey scribbled "?" beside the poster (not the code: the code stays exact)
  if (T >= tLon && zs === 0) {
    const wob = Math.floor((T - tLon) / 0.375) % 2;
    viText('?', 224, 146 + wob, Q.grey, { size: 44 });
    viText('?', 224, 196 - wob, Q.grey, { size: 22 });
  }
  // the phone: rises, shows the code in its viewfinder, then is lowered (sinks behind the floor)
  const hx = Math.round(-14 + 44 * EZ.o2(seg(T, 0, 1.0)) + 22 * (EZ.io(seg(T, tTrong, tTrong + 0.6)) - EZ.io(seg(T, tLon + 0.2, tNhung - 0.05))));   // walks in, steps closer to look, steps back
  const walking = T < 1 || (T > tTrong && T < tTrong + 0.6) || (T > tLon + 0.2 && T < tNhung - 0.05);
  const up = EZ.o3(seg(T, 0.8, 1.25)), down = EZ.i2(seg(T, 5.45, 5.95));
  const aim = EZ.o3(seg(T, tTrong, tTrong + 0.4)) - EZ.o3(seg(T, tLon, tLon + 0.3));   // lifted to aim, dropped when puzzled
  const py = Math.round(318 - 60 * up + 60 * down - 20 * aim) + (T > 1.3 && T < 5.4 ? wig(1.5, 1) : 0);
  if (py < FLOOR_Y) {
    phone(hx + 13, py, 27, 36, {
      screen: (x, y, w, h) => {
        if (T < tQR) return;
        prect(x, y, w, h, Q.white);
        drawQR(x, y + 1, 1, { card: false });
        if (zs === 0 && T >= tTrong) {   // the phone sees: little grey corners
          prect(x, y, 3, 1, Q.grey); prect(x, y, 1, 3, Q.grey); prect(x + w - 3, y + h - 1, 3, 1, Q.grey); prect(x + w - 1, y + h - 3, 1, 3, Q.grey);
        }
      },
    });
  }
  cd_floor();
  // the hero: looks at the poster, puzzled on "lộn xộn", a small hop on "nhưng", wide eyes as it grows
  const hop = Math.round(4 * Math.sin(Math.PI * seg(T, tNhung, tNhung + 0.35)));
  const mood = T >= tThat && T < tChu + 0.6 ? 'wow' : T >= tChu + 0.6 ? 'happy' : 'smile';
  const look = T < tLon ? [1, -1] : T < tNhung ? [Math.floor(T / 0.375) % 2 ? 1 : -0.2, -1] : [1, -1];
  heroAt(hx, HERO_PX[1], { mood, look, hop: hop + (walking ? Math.floor(T * 8) % 2 : 0) });
  if (T >= tLon && T < tThat) pixBubble('?', hx, 285 - hop, { bg: Q.white, edge: Q.ink, fg: Q.ink });
  viCaption('chữ viết bằng ô vuông', { at: tChu, dur: 0.5 });
});

// =====================================================================
//  BIT 6.75 – 11   (and the part of it that carries into the start of byte)
// =====================================================================
const cd_TAG = 'đen = 1, trắng = 0';
const cd_DARK = [10, 3], cd_LIGHT = [10, 14], cd_ROW = 10;
// a callout for module (r, c): sky frame on the module, a panel above with a 3x copy and "= v"
function cd_callout(r, c, t0, px, py) {
  if (TT < t0) return;
  const v = QR_RAW[r][c], [mx, my] = qcell(r, c);
  pframe(mx - 2, my - 2, QM + 4, QM + 4, Q.sky, 2);
  const g = Math.min(3, 1 + Math.floor((TT - t0) / 0.08));     // pops 8 -> 16 -> 24 px
  pline(mx + 4, py + 32, mx + 4, my - 3, Q.sky); pline(mx + 3, py + 32, mx + 3, my - 3, Q.sky);
  pixBox(px, py, 66, 33, { bg: Q.night, edge: Q.sky });
  const s = 8 * g, sx = px + 5 + (24 - s) / 2, sy = py + 4 + (24 - s) / 2;
  prect(sx - 1, sy - 1, s + 2, s + 2, Q.white);
  prect(sx, sy, s, s, v ? Q.ink : Q.white);
  viText('= ' + v, px + 36, py + 9, Q.sky, { size: 18, count: clamp((TT - t0 - 0.15) / 0.3) * 3 });
}
// row 10 as bits: a band under the row, 1s typed from t1, 0s from t0
function cd_rowBits(t1, t0) {
  if (TT < t1) return;
  const [, ry] = qcell(cd_ROW, 0);
  pframe(QX - 2, ry - 2, 21 * QM + 4, QM + 4, Q.sky, 1);
  prect(QX - 2, ry + QM + 2, 21 * QM + 4, 16, Q.night);
  for (let c = 0; c < QR_N; c++) {
    const v = QR_RAW[cd_ROW][c], t = (v ? t1 : t0) + c * 0.02;
    if (TT >= t) viText(String(v), QX + c * QM + 4, ry + QM + 5, Q.sky, { size: 13, align: 'center' });
  }
}
const cd_bitLayer = () => {
  cd_callout(...cd_DARK, VW('bit', 'đen'), 40, 140);
  cd_callout(...cd_LIGHT, VW('bit', 'trắng'), 124, 140);
  cd_rowBits(VW('bit', 'một'), VW('bit', 'không'));
};
SCENES.bit = () => lowres(RES, () => {
  const T = TT;
  qrWorld();
  drawBigQR({ raw: true });
  cd_NOTE();
  cd_bitLayer();
  const tDen = VW('bit', 'đen'), tTrang = VW('bit', 'trắng'), tKhong = VW('bit', 'không');
  const look = T < tDen ? [1, -1] : T < tTrang ? [1, -1] : [1, -1];
  const hop = Math.round(3 * Math.sin(Math.PI * seg(T, VW('bit', 'một'), VW('bit', 'một') + 0.3)));
  cd_hero({ look, hop, mood: T >= tKhong ? 'happy' : 'smile' });
  viTag(cd_TAG);
  if (T < 8.2) viCaption('chữ viết bằng ô vuông', { at: -10 });
});

// =====================================================================
//  BYTE 11 – 15.75
// =====================================================================
const cd_P = [26, 128, 204, 60];                       // the ink panel across the QR
const cd_cellX = (k) => cd_P[0] + 9 + k * 15, cd_CELL_Y = 147, cd_CS = 14;
SCENES.byte = () => lowres(RES, () => {
  const T = TT, E = ET('byte');
  const tTam = VW('byte', 'tám'), tThanh = VW('byte', 'thành'), tChu = VW('byte', 'chữ'), tNhu = VW('byte', 'như');
  const tC = VW('byte', 'C'), tBack = 15.0, tCalm = 15.3;
  qrWorld();
  const k0 = tTam + 0.25, kd = 0.17, sd = 0.4;          // pop k at k0 + k*kd, slide for sd
  const out = (k) => T >= k0 + k * kd && T < tCalm;
  // the big QR (raw) with the C modules left out while they are away
  const idx = new Map(QR_CHAR_C.map(([r, c], k) => [r * 21 + c, k]));
  drawBigQR({ raw: true, show: (r, c) => !(idx.has(r * 21 + c) && out(idx.get(r * 21 + c))) });
  cd_NOTE();
  // carry-over from bit, cleared just before "tám"
  if (T < tTam - 0.15) { cd_bitLayer(); viTag(cd_TAG, { at: -10 }); }
  // the 2x4 block of 'C': sky frame on "tám ô"
  const [bx, by] = qcell(11, 19);
  if (T >= tTam && T < tCalm) pframe(bx - 2, by - 2, 2 * QM + 4, 4 * QM + 4, Q.sky, 2);
  // the panel (from the first pop until the cells go back)
  const panel = T >= k0 && T < tBack;
  if (panel) {
    const [x, y, w, h] = cd_P;
    pixBox(x, y, w, h, { bg: Q.night, edge: Q.sky });
  }
  // the 8 cells, stream order
  // "như chữ C này": a sky bar reads the 8 bits left -> right
  const rd = panel && T >= tNhu ? Math.min(8, Math.floor((T - tNhu) / ((tC - 0.05 - tNhu) / 8)) + 1) : 0;
  if (rd) prect(cd_cellX(0) - 2, cd_CELL_Y + 18, 15 * rd + 1, 15, Q.sky);
  QR_CHAR_C.forEach(([r, c], k) => {
    const t0 = k0 + k * kd; if (!out(k)) return;
    const v = QR_RAW[r][c], [sx, sy] = qcell(r, c);
    const p = T < tBack ? EZ.io(seg(T, t0, t0 + sd)) : 1 - EZ.io(seg(T, tBack, tCalm - 0.04));
    const s = Math.round(QM + (cd_CS - QM) * p), x = Math.round(sx + (cd_cellX(k) - sx) * p), y = Math.round(sy + (cd_CELL_Y - sy) * p);
    prect(x - 1, y - 1, s + 2, s + 2, Q.sky);
    prect(x, y, s, s, v ? Q.ink : Q.white);
    if (panel && T >= t0 + sd) {
      viText(String(k + 1), cd_cellX(k) + 7, cd_P[1] + 5, Q.grey, { size: 13, align: 'center' });
      viText(String(v), cd_cellX(k) + 7, cd_CELL_Y + 21, k < rd ? Q.night : Q.sky, { size: 14, align: 'center' });
    }
  });
  if (panel) {
    // "như chữ C này": a sky bar reads the 8 cells left -> right, then the C pops
    if (T >= tChu) {
      viText('=', cd_P[0] + 138, cd_CELL_Y - 2, Q.sky, { size: 18 });
      const big = T >= tC && T < tC + 0.25 ? 48 : 40;
      viText('C', cd_P[0] + 170 - (big - 40) / 4, cd_CELL_Y - 13 - (big - 40) / 2, Q.sky, { size: big });
    }
  }
  const hop = Math.round(4 * Math.sin(Math.PI * seg(T, tC, tC + 0.35)));
  cd_hero({ look: [1, -1], hop, mood: T >= tC && T < tBack ? 'wow' : 'smile' });
  if (T < 15.25) viCaption('8 ô = 1 chữ cái', { at: tThanh, dur: 0.5 });
});
