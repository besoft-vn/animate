// =====================================================================
//  sc-fix — ecc (33.5–39), payoff (39–44.5, SLAM), end (44.5–51.75).  Owner: sc-fix agent.
//  All drawing in ONE lowres(RES) per scene, PAL16 only, whole pixels.  Globals prefixed fx_.
// =====================================================================

// ---- small pixel sprites (string rows, X = on), drawn at integer scale s
const FX_CHECK = ['......XX', '.....XX.', 'XX..XX..', '.XXXX...', '..XX....'];
const FX_HEART = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
function fx_spr(rows, x, y, s, col) {
  for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) if (rows[j][i] === 'X') prect(x + i * s, y + j * s, s, s, col);
}
// an arrow with an ink outline so it reads on top of the QR modules
function fx_arrow(x0, y0, x1, y1, col) {
  const L = Math.hypot(x1 - x0, y1 - y0); if (L < 1) return;
  const ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, hl = Math.min(9, L);
  const bx = x1 - ux * hl, by = y1 - uy * hl;
  const head = (e) => [[Math.round(x1 + ux * e), Math.round(y1 + uy * e)], [Math.round(bx + nx * (6 + e) - ux * e), Math.round(by + ny * (6 + e) - uy * e)], [Math.round(bx - nx * (6 + e) - ux * e), Math.round(by - ny * (6 + e) - uy * e)]];
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (Math.abs(dx) + Math.abs(dy) <= 3) pline(Math.round(x0 + dx), Math.round(y0 + dy), Math.round(bx + dx), Math.round(by + dy), Q.ink);
  ppoly(head(2), Q.ink);
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (Math.abs(dx) + Math.abs(dy) <= 1) pline(Math.round(x0 + dx), Math.round(y0 + dy), Math.round(bx + dx), Math.round(by + dy), col);
  ppoly(head(0), col);
}
// ---- ecc timing (word cues)
const fx_E = {
  data0: () => VW('ecc', 'phần') + 0.2,       // data modules tint sky, in placement order
  ecc0: () => VW('ecc', 'mã'),                // EC modules light lime, in placement order
  dLab: () => VW('ecc', 'lại'),
  eLab: () => VE('ecc', 'lỗi'),
  cap: () => VW('ecc', 'những'),
  arr: () => [VW('ecc', 'tính'), VW('ecc', 'ra'), VW('ecc', 'chính')],
  stop: () => VE('ecc', 'liệu') + 0.05,       // pulses stop: the silence act holds
};
// the 3 "computed from the data" arrows: from the sky block (cols 15-20, rows 9-20) into the lime area
const FX_ARROWS = [[160, 196, 120, 196], [160, 244, 120, 244], [172, 176, 140, 144]];

function fx_eccCol(t) {
  const d0 = fx_E.data0(), e0 = fx_E.ecc0();
  return (r, c, v) => {
    const i = QR_IDX[r][c];
    if (i < 0) return null;
    if (QR_ISDATA(r, c)) return TT >= d0 + (i / 72) * 0.55 ? (v ? Q.blue : Q.ice) : null;
    if (QR_ISECC(r, c)) {
      if (TT < e0 + ((i - 72) / 136) * 0.9) return null;
      // "tính ra từ chính dữ liệu": a wave runs through the EC modules in placement order — each one is
      // being computed (flashes bright) and settles back to lime
      const w0 = fx_E.arr()[0], w = 72 + ((TT - w0) / (fx_E.stop() - w0)) * 160;
      if (TT >= w0 && TT < fx_E.stop() && i <= w && i > w - 26) return v ? Q.lime : Q.white;
      return v ? Q.green : Q.lime;
    }
    return null;
  };
}

SCENES.ecc = () => lowres(RES, () => {
  qrWorld();
  drawBigQR({ col: fx_eccCol() });
  // labels under the code, each with a small arrow up to its area
  const dl = fx_E.dLab(), el = fx_E.eLab();
  if (TT >= dl + 0.3) parrow(186, 283, 186, 276, Q.sky, 3);
  viLabel('dữ liệu', 160, 290, Q.sky, dl + 0.3);
  if (TT >= el) parrow(104, 286, 120, 276, Q.lime, 3);
  viLabel('sửa lỗi', 50, 290, Q.lime, el);
  // "tính ra từ chính dữ liệu": arrows from data into EC, a pulse (white block) travels each one
  const ta = fx_E.arr(), stop = fx_E.stop();
  FX_ARROWS.forEach(([x0, y0, x1, y1], k) => {
    if (TT < ta[k]) return;
    const u = seg(TT, ta[k], ta[k] + 0.25);
    const ex = Math.round(x0 + (x1 - x0) * u), ey = Math.round(y0 + (y1 - y0) * u);
    if (u > 0) fx_arrow(x0, y0, ex, ey, Q.lime);
    if (u >= 1 && TT < stop) {
      const p = ((TT - ta[k] - 0.25) / 0.6) % 1, px = Math.round(x0 + (x1 - x0) * p), py = Math.round(y0 + (y1 - y0) * p);
      prect(px - 2, py - 2, 5, 5, Q.ink); prect(px - 1, py - 1, 3, 3, Q.white);
    }
  });
  // the hero watches: looks up at the code, a small hop on "sửa lỗi", happy on "dữ liệu"
  const hop = Math.round(4 * Math.sin(Math.PI * seg(TT, VW('ecc', 'sửa'), VW('ecc', 'sửa') + 0.35)));
  const mood = TT >= VW('ecc', 'tính') && TT < VW('ecc', 'chính') ? 'wow' : 'smile';
  heroAt(HERO_PX[0], HERO_PX[1], { look: [1, -1], hop, mood });
  viTag('phần còn lại: mã sửa lỗi', { at: VW('ecc', 'sửa') });
  viCaption('ô dự phòng, tính từ dữ liệu', { at: fx_E.cap(), dur: 0.7 });
});

// ---- payoff: COMPLETE on its first frame (hard cut at SLAM)
// the damage patch: one solid irregular L-shape covering exactly the QR_HIT modules (cols 17-20 rows 9-20, cols
// 15-16 rows 13-20). Its inner edges sit on module boundaries (never over a healthy module); the torn outer edge
// (right / bottom) reaches into the quiet zone and flutters by 1 px.
function fx_patch(fl) {
  const [xa, ya] = qcell(9, 17), [xb, yb] = qcell(13, 15), xR = QX + 21 * QM, yB = QY + 21 * QM;
  const TEAR_R = [2, 4, 1, 3, 5, 2, 3, 1, 4, 2, 5, 3, 1, 4, 2, 3, 5, 1, 2, 4, 3, 1, 2, 5, 3];   // px per 4-row band
  const TEAR_B = [3, 1, 4, 2, 5, 2, 1, 3, 4, 1, 3, 5];
  const P = (e) => {
    const pts = [[xa + e, ya + e], [xR, ya + e]];
    for (let k = 0; k < (yB - ya) / 4; k++) { const d = TEAR_R[k % TEAR_R.length] + ((k + fl) % 3 === 0 ? 1 : 0) - e; pts.push([xR + d, ya + k * 4 + (k ? 0 : e)], [xR + d, ya + k * 4 + 4]); }
    for (let k = 0; k < (xR - xb) / 4; k++) { const d = TEAR_B[k % TEAR_B.length] + ((k + fl) % 3 === 1 ? 1 : 0) - e; const x = xR - k * 4; pts.push([x, yB + d], [x - 4 + (k === (xR - xb) / 4 - 1 ? e : 0), yB + d]); }
    pts.push([xb + e, yb + e], [xa + e, yb + e]);
    return pts;
  };
  ppoly(P(0), Q.red);
  ppoly(P(1), Q.brown);
  // torn cracks (solid red lines inside the patch, not specks)
  pline(xa + 6, ya + 10, xa + 20, ya + 30, Q.red); pline(xa + 20, ya + 30, xa + 14, ya + 46, Q.red);
  pline(xb + 6, yb + 20, xb + 22, yb + 40, Q.red); pline(xa + 26, ya + 58, xa + 18, ya + 80, Q.red);
}
const FX_PH = [43, 278, 27, 36];   // the payoff phone (below the code, held by the hero)
SCENES.payoff = () => lowres(RES, () => {
  qrWorld();
  // the phone keeps scanning: a 2-row sky reading band sweeps the code (period 1.3 s) until "đủ";
  // the covered modules stay covered (the patch is drawn on top)
  const du0 = VW('payoff', 'đủ'), band = TT < du0 ? Math.floor((((TT - SLAM) / 1.3) % 1) * 23) - 1 : -9;
  drawBigQR({ col: (r, c, v) => (r === band || r === band + 1 ? (v ? Q.blue : Q.ice) : null) });
  const beat = Math.floor((TT - SLAM) / BEAT + 1e-6);
  const che = VW('payoff', 'che'), ba = VW('payoff', 'ba'), doc = VW('payoff', 'đọc'), du = VW('payoff', 'đủ');
  fx_patch(beat % 2);
  // "mã bị che": the red edge flashes thick; "gần ba mươi phần trăm": a red bracket around the hit area blinks
  if (TT >= che && TT < che + 0.5 && Math.floor((TT - che) / E16) % 2 === 0) { const [xa, ya] = qcell(9, 17); pframe(xa - 2, ya - 2, QX + 21 * QM - xa + 10, QY + 21 * QM - ya + 10, Q.red, 2); }
  const textOn = TT < ET('end') - 0.5;
  // hero + phone (raised in front of him), its screen shows the damaged code and a scan line
  const hop = Math.round(8 * Math.sin(Math.PI * seg(TT, du - 0.15, du + 0.2)));
  const [px, py, pw, ph] = FX_PH;
  heroAt(HERO_PX[0], HERO_PX[1], { look: [1, -1], hop, mood: TT >= du ? 'wow' : TT >= doc ? 'happy' : 'smile' });
  phone(px, py - hop, pw, ph, { screen: (sx, sy, sw, sh) => {
    prect(sx, sy, sw, sh, Q.white);
    drawQR(sx, sy + 1, 1, { card: false, col: (r, c) => (QR_ISHIT(r, c) ? Q.brown : null) });
    prect(sx, sy + ((B % 12) * 2) % sh, sw, 1, Q.sky);
  } });
  if (!textOn) return;
  // the result: "CHAO! ✓" (the real content) — lime check pops bigger on "đủ"
  const big = TT >= du ? 2 : 1;
  const [bx, by, bw] = viPanel('CHAO!', 99, 296, { fg: Q.sky, bg: Q.ink, edge: Q.sky, size: 14 });
  if (big === 1) fx_spr(FX_CHECK, bx + bw + 3, by + 9, 1, Q.lime);
  else { prect(bx + bw + 2, by - 1, 19, 14, Q.ink); fx_spr(FX_CHECK, bx + bw + 3, by + 1, 2, Q.lime); }
  // the damage label, under the patch
  const lb = TT >= ba && TT < ba + 0.6 && Math.floor((TT - ba) / E16) % 2 === 0;
  { // "hỏng": the hook above the o is drawn by hand (Pangolin's hook rasterises like a grave accent at this size)
    const lc = lb ? Q.white : Q.red, x0 = 233 - viTextW('hỏng ≈ 30%', 16), ox = x0 + Math.round((viTextW('h', 16) + viTextW('ho', 16)) / 2);
    viText('hong ≈ 30%', x0, 289, lc, { size: 16 });
    prect(ox - 4, 286, 3, 1, lc); prect(ox - 2, 287, 1, 1, lc); prect(ox - 3, 288, 1, 1, lc);
  }
  viTag('mức H: sửa ~30%', { at: -10 });
  viCaption('che gần 30% vẫn đọc được', { at: -10 });
});

// ---- end: the hook's poster again, now with a logo in the middle; the phone scans it: "CHAO!"
// (poster geometry must match the hook in sc-code.js)
const FX_POSTER = { x: 98, y: 116, w: 116, h: 140, m: 4, qx: 114, qy: 150 };   // = sc-code's cd_PAPER / cd_PQ
function fx_poster(logoY, col) {
  const P = FX_POSTER;
  prect(P.x - 2, P.y - 2, P.w + 4, P.h + 4, Q.slate);
  prect(P.x, P.y, P.w, P.h, Q.white);
  viText('MENU', P.x + P.w / 2, P.y + 8, Q.ink, { size: 16, align: 'center' });
  prect(P.x + 30, P.y + P.h - 10, P.w - 60, 2, Q.grey);
  drawQR(P.qx, P.qy, P.m, { col });
  if (logoY != null) fx_logo(P.qx + QR_LOGO[1] * P.m, logoY, QR_LOGO[3] * P.m);
}
function fx_brackets(x, y, w, h, col, a = 10, t = 2) {
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
    prect(sx > 0 ? cx : cx - a, sy > 0 ? cy : cy - t, a, t, col);
    prect(sx > 0 ? cx : cx - t, sy > 0 ? cy : cy - a, t, a, col);
  }
}
function fx_logo(x, y, s) {   // white square with a red 1-px frame and a red pixel heart
  prect(x, y, s, s, Q.white); pframe(x, y, s, s, Q.red);
  fx_spr(FX_HEART, x + Math.floor((s - 14) / 2), y + Math.floor((s - 12) / 2) + 1, 2, Q.red);
}
SCENES.end = () => lowres(RES, () => {
  qrWorld();
  const P = FX_POSTER, logoX = P.qx + QR_LOGO[1] * P.m, logoHome = P.qy + QR_LOGO[0] * P.m, ls = QR_LOGO[2] * P.m;
  const tl = VW('end', 'logo'), td = VW('end', 'dán'), tg = VW('end', 'giữa');
  // the logo sticker falls in on "logo" and sticks on "dán" (whole px)
  let ly = null;
  if (TT >= tl) ly = Math.round(40 + (logoHome - 40) * EZ.i2(seg(TT, tl, td)));
  const tp0 = VW('end', 'điện'), tq0 = VW('end', 'quét'), tc0 = VW('end', 'lời');
  // "quét": a 2-row sky reading band sweeps the poster code (two passes) until "lời chào"
  const band = TT >= tq0 - 0.15 && TT < tc0 ? Math.floor((((TT - tq0 + 0.15) / 0.45) % 1) * 22) - 1 : -9;
  fx_poster(ly, (r, c, v) => (r >= band && r <= band + 2 ? (v ? Q.blue : Q.ice) : null));
  if (band > -9) { const by = 150 + 4 * clamp(band, 0, 21); prect(100, by - 2, 112, 2, Q.sky); prect(100, Math.min(150 + 84, by + 12), 112, 2, Q.sky); }
  // the phone locks on (grey corner brackets snap in, as in the hook) once it is raised
  if (TT >= tp0 + 0.3 && TT < tc0) { const k = Math.max(0, 3 - Math.floor((TT - tp0 - 0.3) / 0.12)) * 4; fx_brackets(108 - k, 144 - k, 96 + 2 * k, 96 + 2 * k, Q.grey); }
  // "lời chào": read! a sky square ring pings out from the code, three times
  for (const p0 of [tc0, tc0 + 0.85, tc0 + 1.65]) if (TT >= p0 && TT < p0 + 0.5) { const g = 5 + 5 * Math.floor((TT - p0) / (1 / 12)); pframe(96 - g, 114 - g, 120 + 2 * g, 144 + 2 * g, Q.sky, 2); }
  // red frame blink round the logo on "giữa"
  if (TT >= tg && TT < tg + 0.75 && Math.floor((TT - tg) / E8) % 2 === 0) pframe(logoX - 3, logoHome - 3, ls + 6, ls + 6, Q.red, 2);
  // the phone: low at first, raised on "điện thoại", scans on "quét", says "CHAO!" on "lời chào"
  const tp = VW('end', 'điện'), tq = VW('end', 'quét'), tc = VW('end', 'lời');
  const hops = [[tq + 0.3, 6], [tc, 10], [tc + 0.85, 7], [tc + 1.65, 7]];
  let hop = 0; for (const [h0, a] of hops) hop = Math.max(hop, Math.round(a * Math.sin(Math.PI * seg(TT, h0, h0 + 0.42))));
  const px = 43, pw = 27, ph = 36, py = 318 - Math.round(60 * EZ.o3(seg(TT, tp, tp + 0.45))) - hop + (TT > tp + 0.5 ? wig(1.5, 1) : 0);
  if (py < FLOOR_Y) phone(px, py, pw, ph, { screen: (sx, sy, sw, sh) => {
    prect(sx, sy, sw, sh, Q.white);
    drawQR(sx, sy + 1, 1, { card: false });
    if (ly != null && TT >= td) { prect(sx + 7, sy + 8, 7, 7, Q.white); pframe(sx + 7, sy + 8, 7, 7, Q.red); }
    if (TT >= tq && TT < tc) prect(sx, sy + Math.round(seg(TT, tq, tq + 0.6) * (sh - 1)), sw, 1, Q.sky);
    if (TT >= tc) pframe(sx, sy, sw, sh, Q.sky);
  } });
  // the scan: two sky lines from the phone's camera to the reading band on the poster
  if (TT >= tq && TT < tc) { const yb = 150 + 4 * clamp(Math.floor((((TT - tq + 0.15) / 0.45) % 1) * 22), 0, 21); pline(px + 13, py, 112, yb, Q.sky); pline(px + 14, py, 200, yb, Q.sky); }
  prect(0, FLOOR_Y, 270, 480 - FLOOR_Y, Q.ink); prect(0, FLOOR_Y, 270, 1, Q.slate);   // the phone rises from behind the floor
  heroAt(HERO_PX[0], HERO_PX[1], { look: [1, -1], hop, mood: TT >= tc ? 'happy' : TT >= tq ? 'wow' : 'smile' });
  // "CHAO!" bubble from the phone
  if (TT >= tc) {
    const s = TT < tc + 0.08 ? 14 : 18;
    const [bx, by, bw, bh] = viPanel('CHAO!', 112, 277, { fg: Q.sky, bg: Q.ink, edge: Q.sky, size: s });
    prect(px + pw, py + 14, bx - px - pw + 1, 2, Q.sky);   // the tail to the phone
    if (TT >= tc + 0.3) fx_spr(FX_CHECK, bx + bw + 3, by + Math.floor(bh / 2) - 5, 2, Q.lime);
  }
  viCaption('logo giữa mã vẫn quét được', { at: Math.max(ET('end') + 0.6, VW('end', 'mã')), dur: 0.7 });
});
