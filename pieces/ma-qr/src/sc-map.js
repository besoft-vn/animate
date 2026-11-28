// =====================================================================
//  sc-map — finder (3 corner squares: where + which way up), zigzag (the 2-column snake from the bottom-right,
//  going UP first), mask (pink stripes flip the data modules on even rows: QR_RAW -> QR_M).  Owner: sc-map agent.
//  Everything drawn in one lowres(RES) pass per scene, PAL16 only, whole pixels.
// =====================================================================

// ---- shared helpers (mp_ prefix) --------------------------------------------------------------------------
const mp_NOTE = () => viText('(chưa phủ mặt nạ)', 235, 82, Q.grey, { size: 13, align: 'right' });
// rotation by quarter turns clockwise: module (r, c) shows at display (c, 20 - r)
const mp_rot = (r, c, q) => { for (let k = 0; k < q; k++) [r, c] = [c, 20 - r]; return [r, c]; };
// the big QR card + modules, each module coloured by col(r, c) (source coords) -> colour | null (= light/white),
// drawn rotated by q quarter turns
function mp_grid(col, q = 0) {
  drawBigQR({ show: () => false });                       // the white card + slate rim only
  for (let r = 0; r < QR_N; r++) for (let c = 0; c < QR_N; c++) {
    const k = col(r, c); if (!k) continue;
    const [R, C] = mp_rot(r, c, q), [x, y] = qcell(R, C);
    prect(x, y, QM, QM, k);
  }
}
// a source-coords module rect (r0, c0, nr x nc) -> display px rect [x, y, w, h] after q quarter turns
function mp_rect(r0, c0, nr, nc, q = 0) {
  const a = mp_rot(r0, c0, q), b = mp_rot(r0 + nr - 1, c0 + nc - 1, q);
  const R = Math.min(a[0], b[0]), C = Math.min(a[1], b[1]), [x, y] = qcell(R, C);
  return [x, y, (Math.abs(a[1] - b[1]) + 1) * QM, (Math.abs(a[0] - b[0]) + 1) * QM];
}
// a bold frame around a px rect: ink / col / col / ink rings at distance 1..4 px outside
function mp_bold(x, y, w, h, col) {
  pframe(x - 4, y - 4, w + 8, h + 8, Q.ink, 1);
  pframe(x - 3, y - 3, w + 6, h + 6, col, 2);
  pframe(x - 1, y - 1, w + 2, h + 2, Q.ink, 1);
}
// a dashed 2-px frame
function mp_dash(x, y, w, h, col) {
  for (let i = 0; i < w; i += 8) { const n = Math.min(4, w - i); prect(x + i, y, n, 2, col); prect(x + i, y + h - 2, n, 2, col); }
  for (let j = 0; j < h; j += 8) { const n = Math.min(4, h - j); prect(x, y + j, 2, n, col); prect(x + w - 2, y + j, 2, n, col); }
}
// a small pixel arrowhead (with an ink rim) pointing dir ('u' | 'd' | 'l' | 'r'), tip at (tx, ty)
function mp_tri(tx, ty, dir, col) {
  const draw = (n, c, o) => {
    for (let k = 0; k < n; k++) {
      const w = 2 + 2 * k;
      if (dir === 'u') prect(tx - 1 - k, ty + k + o, w, 1, c);
      else if (dir === 'd') prect(tx - 1 - k, ty - k - o, w, 1, c);
      else if (dir === 'l') prect(tx + k + o, ty - 1 - k, 1, w, c);
      else prect(tx - k - o, ty - 1 - k, 1, w, c);
    }
  };
  // rim: a one-pixel-larger ink triangle behind
  for (let k = 0; k < 5; k++) {
    const w = 4 + 2 * k;
    if (dir === 'u') prect(tx - 2 - k, ty - 1 + k, w, 1, Q.ink);
    else if (dir === 'd') prect(tx - 2 - k, ty + 1 - k, w, 1, Q.ink);
    else if (dir === 'l') prect(tx - 1 + k, ty - 2 - k, 1, w, Q.ink);
    else prect(tx + 1 - k, ty - 2 - k, 1, w, Q.ink);
  }
  draw(4, col, 0);
}
// a tag that leaves 0.5 s before the era ends (so it never hangs over a bridge)
const mp_tag = (id, s, o) => { if (TT < EE(id) - 0.5) viTag(s, o); };
// step a value on the 12 fps grid (whole-pixel motion, on 2s)
const mp_q = (t) => Math.floor(t * 12 + 1e-6) / 12;

// =====================================================================
//  FINDER 15.75–21: "Ba ô vuông lớn ở ba góc giúp điện thoại biết mã nằm đâu, quay chiều nào."
// =====================================================================
const MP_FINDERS = [[0, 0], [0, 14], [14, 0]];   // TL, TR, BL (source coords, 7x7)
SCENES.finder = () => lowres(RES, () => {
  const t = TT, tEnd = EE('finder');
  const tBig = VW('finder', 'vuông'), tGoc = VW('finder', 'góc') + 0.1, tPhone = VW('finder', 'điện');
  const tLock = VW('finder', 'nằm'), tTurn = VW('finder', 'quay'), tBack = Math.max(VE('finder', 'nào') - 0.1, tTurn + 0.45);
  const tClear = tEnd - 0.45;
  const q = t >= tTurn && t < tBack ? 1 : 0;                      // one discrete 90° turn, then back
  qrWorld();
  // the finders light up yellow one by one on "Ba ô vuông lớn" (modules keep their 1/0; yellow = position)
  const lit = (i) => t >= tBig - 0.25 + i * 0.25 && t < tClear;
  mp_grid((r, c) => {
    return QR_RAW[r][c] ? Q.ink : null;
  }, q);
  // yellow frames (ink-rimmed) around each finder, one per chime on "ở ba góc"; they turn with the code
  MP_FINDERS.forEach(([r0, c0], i) => {
    if (!lit(i)) return;
    const [x, y, w, h] = mp_rect(r0, c0, 7, 7, q);
    const on = t >= tGoc + i * 0.3;
    if (on) {
      const pop = t < tGoc + i * 0.3 + 1 / 12 ? 1 : 0;              // one boil one pixel bigger: a pop
      mp_bold(x - pop, y - pop, w + 2 * pop, h + 2 * pop, Q.yellow);
    } else {
      // before its chime: the 7x7 square shows as a thin yellow corner glint (the "big square" being named)
      pframe(x - 1, y - 1, w + 2, h + 2, Q.yellow, 1);
    }
  });
  // the 4th corner: empty -> a grey dashed square + "trống"
  const tEmpty = tGoc + 0.95;
  if (t >= tEmpty && t < tClear) {
    const [x, y, w, h] = mp_rect(14, 14, 7, 7, q);
    mp_dash(x - 2, y - 2, w + 4, h + 4, Q.grey);
    if (t < tTurn - 0.05) {
      const s = 'trống', tw = viTextW(s, 13);
      pixBox(x + w / 2 - tw / 2 - 5, y + h / 2 - 10, tw + 10, 20, { bg: Q.ink, edge: Q.grey });
      viLabel(s, x + w / 2 - tw / 2, y + h / 2 - 5, Q.grey, tEmpty, null, { size: 13 });
    }
  }
  // the phone "locks on": yellow corner brackets snap in from outside to the code's outer corners
  if (t >= tLock - 0.15 && t < tClear) {
    const k = Math.round(14 * (1 - EZ.o3(seg(mp_q(t), tLock - 0.15, tLock + 0.2))));
    const off = 6 + k, L = 14, x0 = QX - off, y0 = QY - off, x1 = QX + 21 * QM + off, y1 = QY + 21 * QM + off;
    for (const [cx, cy, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) {
      const ax = sx > 0 ? cx : cx - L, ay = sy > 0 ? cy : cy - 3, bx = sx > 0 ? cx : cx - 3, by = sy > 0 ? cy : cy - L;
      prect(ax - 1, ay - 1, L + 2, 5, Q.ink); prect(bx - 1, by - 1, 5, L + 2, Q.ink);
      prect(ax, ay, L, 3, Q.yellow); prect(bx, by, 3, L, Q.yellow);
    }
  }
  // label under the card: "3 góc → biết chiều"
  viLabel('3 góc → biết chiều', 62, 287, Q.yellow, VW('finder', 'thoại'), tEnd - 0.5);
  mp_NOTE();
  mp_tag('finder', '3 ô định vị');
  // the hero: looks up at the corners, raises a phone that shows the lock; 'wow' on the turn
  const hx = HERO_PX[0], hy = HERO_PX[1];
  const look = t < tGoc ? [1, -1] : t < tGoc + 0.3 ? [-1, -1] : t < tGoc + 0.6 ? [1, -1] : t < tGoc + 0.9 ? [-1, 1] : [1, -1];
  const hop = t >= tTurn && t < tTurn + 0.35 ? Math.round(4 * Math.sin(Math.PI * seg(mp_q(t), tTurn, tTurn + 0.35))) : 0;
  heroAt(hx, hy, { look, mood: q ? 'wow' : t >= tLock && t < tTurn ? 'happy' : undefined, hop });
  if (t >= tPhone && t < tClear) {
    const up = Math.round(6 * EZ.o2(seg(mp_q(t), tPhone, tPhone + 0.25)));
    const px = hx + 12, py = hy - 6 - up;
    phone(px, py, 14, 22, { screen: (sx, sy, sw, sh) => {
      if (t < tLock) { if (B % 4 < 2) prect(sx + 3, sy + 4, 2, 2, Q.grey); return; }
      prect(sx, sy, 2, 1, Q.yellow); prect(sx, sy, 1, 2, Q.yellow);
      prect(sx + sw - 2, sy, 2, 1, Q.yellow); prect(sx + sw - 1, sy, 1, 2, Q.yellow);
      prect(sx, sy + sh - 1, 2, 1, Q.yellow); prect(sx, sy + sh - 2, 1, 2, Q.yellow);
      prect(sx + 2, sy + 2, sw - 4, sh - 4, q ? Q.slate : Q.white);
    } });
  }
});

// =====================================================================
//  ZIGZAG 21–26.75: "Các chữ được xếp ngoằn ngoèo theo từng cặp cột, từ góc dưới bên phải đi lên."
// =====================================================================
// the right column of the column pair a data module belongs to (pairs (19,20) (17,18) … (7,8) | (4,5) (2,3) (0,1))
const mp_pairR = (c) => (c >= 7 ? (c % 2 === 0 ? c : c + 1) : (c % 2 === 1 ? c : c + 1));
const MP_PAIR_ROWS = (() => { const m = {}; for (const [r, c] of QR_ORDER) { const p = mp_pairR(c); m[p] = m[p] || [99, -1]; m[p][0] = Math.min(m[p][0], r); m[p][1] = Math.max(m[p][1], r); } return m; })();
// direction of travel at index i: look a few modules ahead (vertical along the pair, or left at a turn)
function mp_dir(i) {
  const [r, c] = QR_ORDER[i], [r2, c2] = QR_ORDER[Math.min(QR_ORDER.length - 1, i + 2)];
  if (i >= QR_ORDER.length - 1) return 'u';
  if (mp_pairR(c2) !== mp_pairR(c)) return 'l';
  return r2 > r ? 'd' : 'u';
}
// the snake head: a bright sky module with an ink rim + an arrow in its direction of travel
function mp_head(i) {
  const [r, c] = QR_ORDER[i], [x, y] = qcell(r, c), d = mp_dir(i);
  prect(x - 1, y - 1, QM + 2, QM + 2, Q.ink); prect(x, y, QM, QM, Q.sky);
  if (d === 'u') mp_tri(x + 4, y - 6, 'u', Q.sky);
  else if (d === 'd') mp_tri(x + 4, y + QM + 5, 'd', Q.sky);
  else mp_tri(x - 6, y + 4, 'l', Q.sky);
}
SCENES.zigzag = () => lowres(RES, () => {
  const t = TT, tEnd = EE('zigzag');
  const tDim = VW('zigzag', 'được'), tGo = VW('zigzag', 'ngoằn'), tPair = VW('zigzag', 'cặp'), tCorner = VW('zigzag', 'góc');
  const tUp = VW('zigzag', 'đi'), tUndo = tEnd - 0.4;
  const N = QR_ORDER.length;
  // progress (modules visited): first pair slowly (24 modules, going UP), the second pair a bit faster, then the rest
  const tA = tGo + 0.8, tB = tA + 0.55, tC = tCorner + 0.75;
  const tq = mp_q(t);
  const n = tq < tGo ? 0 : tq < tA ? 1 + Math.floor(23 * seg(tq, tGo, tA)) : tq < tB ? 24 + Math.floor(24 * seg(tq, tA, tB)) : tq < tC ? 48 + Math.floor(160 * seg(tq, tB, tC)) : N;
  // a second, quick run up the first pair on "đi lên"
  const n2 = tq >= tUp && tq < tUp + 0.5 ? Math.floor(24 * seg(tq, tUp, tUp + 0.42)) : -1;
  const dim = t >= tDim && t < tUndo;
  qrWorld();
  mp_grid((r, c) => {
    const v = QR_RAW[r][c], i = QR_IDX[r][c];
    if (QR_KIND(r, c) !== 'data') return v ? (dim ? Q.grey : Q.ink) : null;
    // only the real data part (bits 0-71: mode, count, C H A O !, padding) is "letters" = sky; the path keeps
    // running through the error-correction part (72+), which gets a neutral slate mark (it becomes lime in ecc)
    if (i >= 0 && i < n && t < tUndo) return i < QR_DATA_BITS ? (v ? Q.blue : Q.ice) : v ? Q.slate : null;
    return v ? Q.ink : null;
  });
  // the 2-column frame around the pair the head is in (from "cặp cột")
  if (t >= tPair && n > 0 && n < N) {
    const p = mp_pairR(QR_ORDER[n - 1][1]), [r0, r1] = MP_PAIR_ROWS[p], [x, y] = qcell(r0, p - 1);
    pframe(x - 2, y - 2, 2 * QM + 4, (r1 - r0 + 1) * QM + 4, Q.ink, 1);
    pframe(x - 1, y - 1, 2 * QM + 2, (r1 - r0 + 1) * QM + 2, Q.sky, 1);
  }
  if (n > 0 && n < N) mp_head(n - 1);
  if (n2 >= 0) mp_head(Math.min(23, n2));
  // the start marker: bottom-right corner, arrow pointing UP (the first direction of travel)
  if (t >= tGo && t < tEnd - 0.5) {
    const bob = t >= tCorner && t < tCorner + 1.2 ? (Math.floor((t - tCorner) / E8) % 2 ? -2 : 0) : 0;
    const ax = QX + 21 * QM + 3;
    prect(ax, QY + 20 * QM + bob, 2, 24, Q.sky);                  // shaft from below the card up along the right edge
    mp_tri(ax + 1, QY + 19 * QM + 2 + bob, 'u', Q.sky);
    viLabel('bắt đầu', 210, 287, Q.sky, tGo + 0.1, null, { align: 'right' });
    if (t >= tCorner && t < tCorner + 1.2 && B % 2 === 0) { const [x, y] = qcell(20, 20); pframe(x - 2, y - 2, QM + 4, QM + 4, Q.sky, 1); }
  }
  mp_NOTE();
  mp_tag('zigzag', 'ngoằn ngoèo');
  // the hero watches the head (eyes follow it), then glances at the start on "góc dưới bên phải"
  const hi = n2 >= 0 ? Math.min(23, n2) : n > 0 && n < N ? n - 1 : -1;
  const look = t >= tCorner && t < tCorner + 1.2 ? [1, 1] : hi >= 0 ? [1, QR_ORDER[hi][0] < 14 ? -1 : 0] : [1, -1];
  const hop = t >= tUp && t < tUp + 0.4 ? Math.round(3 * Math.sin(Math.PI * seg(mp_q(t), tUp, tUp + 0.4))) : 0;
  // the hero takes a few steps toward the code while the snake starts, and walks back before the corner cue
  const hx = HERO_PX[0] + Math.round(10 * seg(tq, tGo, tGo + 0.8)) - Math.round(10 * seg(tq, tCorner - 0.5, tCorner + 0.3));
  heroAt(hx, HERO_PX[1], { look, hop, mood: t >= tC && t < tUp ? 'happy' : undefined });
});

// =====================================================================
//  MASK 26.75–33.5: "Rồi một lớp mặt nạ đảo bớt ô, để không có mảng đen hay trắng nào quá to."
// =====================================================================
// a real big same-colour block in QR_RAW: rows 13..18 x cols 15..16, 12 data modules, all LIGHT before the mask;
// in QR_M rows 14, 16, 18 are flipped -> dark stripes break it up.
const MP_BLOCK = [13, 15, 6, 2];
SCENES.mask = () => lowres(RES, () => {
  const t = TT, tEnd = EE('mask');
  const tIn = VW('mask', 'mặt') - 0.05, tIn1 = VW('mask', 'nạ') + 0.25;      // stripes slide in
  const tF0 = VW('mask', 'đảo'), tF1 = VW('mask', 'để') + 0.3;               // flip sweep left -> right
  const tOut = VW('mask', 'mảng'), tOut1 = VE('mask', 'trắng') + 0.1;                // stripes leave (slowly)
  const tHet = tF1 + 0.15, tFrameOff = tEnd - 0.5;
  const x0 = QX - QM, x1 = QX + 22 * QM;                                       // card span
  const tq = mp_q(t);
  const sIn = Math.round(x0 + (x1 - x0) * EZ.o2(seg(tq, tIn, tIn1)));       // stripes cover [sOut, sIn)
  const sOut = Math.round(x0 + (x1 - x0) * seg(tq, tOut, tOut1));
  const fx = Math.round(QX + 21 * QM * seg(tq, tF0, tF1));                     // flipped where x + QM <= fx
  const striped = (r, c) => { const x = qcell(r, c)[0]; return t >= tIn && x < sIn && x + QM > sOut; };
  qrWorld();
  mp_grid((r, c) => {
    const data = QR_KIND(r, c) === 'data', even = QR_MASKF(r, c), x = qcell(r, c)[0];
    const v = t >= tF0 && x + QM <= fx ? QR_M[r][c] : QR_RAW[r][c];
    if (data && even && striped(r, c) && t < tOut1) return v ? Q.ink : Q.pink;
    return v ? Q.ink : null;
  });
  // the flip cursor: a pink bar sweeping across while the flips happen
  if (t >= tF0 && t < tF1) { prect(fx - 1, QY - QM, 2, 23 * QM, Q.pink); prect(fx + 1, QY - QM, 1, 23 * QM, Q.ink); }
  // "mảng to": grey frame on the big light block, then (after the mask) "hết mảng to"
  if (t >= E0 + 0.15 && t < tFrameOff) {
    const [r0, c0, nr, nc] = MP_BLOCK, [x, y] = qcell(r0, c0), w = nc * QM, h = nr * QM;
    const blink = t >= VW('mask', 'trắng') && t < VW('mask', 'trắng') + 0.5 && B % 2 === 1;
    if (!blink) { pframe(x - 3, y - 3, w + 6, h + 6, Q.ink, 1); pframe(x - 2, y - 2, w + 4, h + 4, Q.grey, 2); }
    const cx = x + w / 2;
    prect(cx - 1, y + h + 3, 2, 284 - (y + h + 3), Q.grey);
    if (t < tHet) viLabel('mảng to', cx, 287, Q.white, E0 + 0.2, null, { align: 'center' });
    else viLabel('hết mảng to', cx, 287, Q.white, tHet, null, { align: 'center' });
  }
  if (t < tOut1) mp_NOTE();
  mp_tag('mask', 'mặt nạ đảo ô');
  // the hero: looks at the block, then at the sweep; a happy hop on "quá to"; home and calm at the end
  const tHop = VW('mask', 'quá');
  const look = t >= tF0 && t < tF1 ? [fx > 120 ? 1 : 0, -1] : [1, 0];
  const hop = t >= tHop && t < tHop + 0.4 ? Math.round(4 * Math.sin(Math.PI * seg(mp_q(t), tHop, tHop + 0.4))) : 0;
  heroAt(HERO_PX[0], HERO_PX[1], { look, hop, mood: t >= tHet && t < tHop + 0.6 ? 'happy' : undefined });
});
