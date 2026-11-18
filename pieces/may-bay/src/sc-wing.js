// =====================================================================
//  sc-wing.js — the wing cross-section: wing (shape + angle), bend (the air turned down), pressure (low above, high below)
//  The wing is ALWAYS the default WING drawn by airfoil() (leading edge LEFT, air flows LEFT -> RIGHT).
//  KHUNG HÌNH GỌN: ≤ 6 blue flow lines, chevrons riding them; graphite construction; bare paper.
// =====================================================================
// fixed-at-boundary envelope: 0 within 0.5 s of either end of the era, 1 in the middle (eased)
const w_env = (id, pad = 0.5, ramp = 0.5) => EZ.io(seg(TT, ET(id) + pad, ET(id) + pad + ramp)) * (1 - EZ.io(seg(TT, EE(id) - pad - ramp, EE(id) - pad)));
// y of a flow line at x (interpolating flowPts, which steps x by 10 from x0 = 50)
function w_flowY(P, x) {
  const f = clamp((x - 50) / 10, 0, P.length - 1.001), i = Math.floor(f), u = f - i;
  return lerp(P[i][1], P[i + 1][1], u);
}
// the wing's camber line (midpoints of the upper and lower surfaces of the default airfoil)
function w_camber() {
  const P = airfoilPts(), n = P.length, h = n / 2, C = [];
  for (let i = 0; i < h; i++) { const a = P[i], b = P[n - 1 - i]; C.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]); }
  return C;
}
// the lower surface's y at world x (default airfoil)
function w_underY(x) {
  const P = airfoilPts(), n = P.length, L = P.slice(n / 2).sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < L.length - 1; i++) if (x >= L[i][0] && x <= L[i + 1][0]) return lerp(L[i][1], L[i + 1][1], (x - L[i][0]) / (L[i + 1][0] - L[i][0] || 1));
  return WING.y;
}
// a flow line plus its riding chevrons (two per line, phase-offset); u advances with TT (on 2s)
function w_flow(h, i, o = {}) {
  const part = o.part ?? 1; if (part <= 0) return;
  flowLine(h, { down: o.down, part, a: o.a, key: 'w_fl' + h });
  if (part < 0.6) return;
  const P = flowPts(h, { down: o.down }), u0 = o.u ?? 0;
  for (let k = 0; k < 2; k++) {
    const u = ((u0 + i * 0.29 + k * 0.5) % 1 + 1) % 1;
    if (u > 0.04 && u < 0.97) flowChevron(P, u, { key: 'w_ch' + h + k });
  }
}
const w_dashed = (x0, y0, x1, y1, part, key, n = 14) => {
  for (let i = 0; i < n; i++) {
    const a = i / n, b = (i + 0.55) / n; if (a > part) break;
    gpencil([[lerp(x0, x1, a), lerp(y0, y1, a)], [lerp(x0, x1, Math.min(b, part)), lerp(y0, y1, Math.min(b, part))]], { key: key + i, w: 3, a: 0.8, amp: 0.8, passes: 1 });
  }
};

// ---------------------------------------------------------------------
//  WING — the airfoil pencilled -> inked; camber line on "cong"; chord + horizontal + angle arc "góc tấn" on
//  "nghiêng"/"góc"; three blue flow lines write on from the left on "đón gió". Hero waits in the oncoming air.
// ---------------------------------------------------------------------
SCENES.wing = function () {
  sketchPage({ grid: 'plain' });
  const t0 = ET('wing'), tc = VW('wing', 'cong'), tn = VW('wing', 'nghiêng'), tg = VW('wing', 'góc'), tf = VW('wing', 'đón') - 0.35;
  const FP = airfoilPts(), [lx, ly] = foilLE();
  // the airfoil: pencil first, then ink over it (fill + hatch once inked)
  const kp = ev(t0 + 0.1, 0.75), ki = ev(t0 + 0.75, 0.75);
  if (ki < 1 && kp > 0) gpencil(FP, { key: 'w_fp', w: 2.6, a: 0.8, part: kp, closed: true });
  if (ki > 0) airfoil({ part: ki, key: 'w_foil' });
  if (ki < 1 && kp > 0) { const e = writeEnd(closeP(FP), ki > 0 ? ki : kp); pencilTool(e[0], e[1], -0.75, 1); }
  // "cong": the camber line, graphite, traced inside the wing
  const C = w_camber(), kc = ev(tc - 0.05, 0.6);
  if (kc > 0) gpencil(C, { key: 'w_cam', w: 4.2, a: 1, part: kc, amp: 1.2 });
  // "nghiêng": the chord line (extended), a horizontal dashed line through the leading edge, and the angle arc
  const ca = Math.cos(WING.aoa), sa = Math.sin(WING.aoa);
  const CH = [[WING.x - 390 * ca, WING.y - 390 * sa], [WING.x + 430 * ca, WING.y + 430 * sa]], kch = ev(tn - 0.05, 0.6);
  if (kch > 0) gpencil(CH, { key: 'w_chord', w: 3, a: 0.9, part: kch });
  w_dashed(lx - 60, ly, 975, ly, ev(tn + 0.35, 0.6), 'w_hz');
  const AR = 700, ARC = arcPts(lx, ly, AR, 0, WING.aoa, 10), kar = ev(tg - 0.1, 0.45);
  if (kar > 0) gpencil(ARC, { key: 'w_arc', w: 5, a: 1, part: kar, amp: 1 });
  label('góc tấn', 790, 1065, 60, { reveal: ev(tg + 0.2, 0.45), key: 'w_lgt' });
  if (kar > 0) arrowPencil([[850, 1015], [890, 985], [906, 950]], ev(tg + 0.4, 0.35), { key: 'w_lga', w: 3 });
  // the pencil follows the construction strokes
  for (const [P, t, d] of [[C, tc - 0.05, 0.6], [CH, tn - 0.05, 0.6], [ARC, tg - 0.1, 0.45]])
    if (TT >= t && TT < t + d + 0.1) { const e = writeEnd(P, ev(t, d)); pencilTool(e[0], e[1], -0.75, 1); }
  // "đón gió": three blue flow lines write on from the left, chevrons start riding
  const u = 0.17 * Math.max(0, TT - tf);
  [-330, -120, 230].forEach((h, i) => w_flow(h, i, { down: 0.6, part: ev(tf + i * 0.1, 0.6), u }));
  // the hero: one parcel of air ahead of the leading edge, watching the wing being drawn
  const e = w_env('wing'), [hx, hy] = BR.wingBend.a;
  const bx = 5 * Math.sin((TT - t0) * 1.9) * e, by = 7 * Math.sin((TT - t0) * 2.6) * e;
  const mood = TT < tc ? 'calm' : TT < tf ? 'wow' : 'happy';
  const look = TT < tf ? [1, 0.6] : [1, 0.1];
  heroAir(hx + bx, hy + by, HR, { key: 'hero', mood, look, wind: 0.45, rot: 0.04 * Math.sin((TT - t0) * 2.2) * e });
  viTag('đôi cánh');
  pageCaption(['cánh hơi cong,', 'nghiêng góc nhỏ'], [[1, 'nghiêng']], { at: tc - t0 });
};

// ---------------------------------------------------------------------
//  BEND — six flow lines, chevrons riding; the hero rides the upper stream over the wing; on "hắt…chúi" the
//  downwash grows (down 0.6 -> 1.5) and the hero is flung down behind the trailing edge to BR.bendPressure.a
// ---------------------------------------------------------------------
const W_H = [-330, -210, -120, 130, 230];   // five lines: a sixth (h 340) would run into the caption once bent down
SCENES.bend = function () {
  sketchPage({ grid: 'plain' });
  const t0 = ET('bend'), tl = VW('bend', 'lao'), tnh = VW('bend', 'nhanh'), tb = VW('bend', 'bẻ'), th = VW('bend', 'hắt'), tch = VW('bend', 'chúi');
  const dn = lerp(0.6, 1.5, EZ.io(ev(th, 1.0)));
  // the air speeds up a little on "nhanh"
  const u = 0.17 * (TT - t0) + 0.07 * Math.max(0, TT - tnh) + 0.17 * 0.6;
  airfoil({ key: 'w_foil' });
  W_H.forEach((h, i) => {
    const had = h === -330 || h === -120 || h === 230, j = [-210, 130].indexOf(h);
    w_flow(h, i, { down: dn, part: had ? 1 : ev(tl + j * 0.15, 0.8), u });
  });
  // label near the downwash
  const kl = ev(tch, 0.6);
  label('khí bị hắt xuống', 90, 1228, 56, { reveal: kl, key: 'w_lb1', col: COL.airD, align: 'left' });
  // the hero: rides flowPts(-120) from the leading edge over the wing, flung down on "hắt", lands at BR.bendPressure.a
  const [ax, ay] = BR.wingBend.b, [bx, by] = BR.bendPressure.a, r0 = t0 + 0.5, X1 = 815;
  const P = flowPts(-120, { down: dn });
  const rs = seg(TT, r0, th), hxR = lerp(ax, X1, 0.25 * rs * rs + 0.75 * EZ.io(rs));
  const hyR = lerp(ay, w_flowY(P, hxR), EZ.io(seg(TT, r0, r0 + 0.9)));
  const y1 = w_flowY(flowPts(-120, { down: 0.6 }), X1);
  const tLand = Math.min(th + 0.95, EE('bend') - 0.6), fk = seg(TT, th, tLand), land = Math.sin(Math.PI * seg(TT, tLand, tLand + 0.3));
  let hx, hy, rot = 0, dir = 0;
  if (TT < th) {
    hx = hxR; hy = hyR;
    const i = clamp(Math.floor((hx - 50) / 10), 0, P.length - 2); dir = Math.atan2(P[i + 1][1] - P[i][1], 10) * seg(TT, r0, r0 + 0.5);
    rot = 0.05 * Math.sin((TT - t0) * 3) * seg(TT, r0, r0 + 0.5);
    hy += 4 * Math.sin((TT - t0) * 4.2) * seg(TT, r0, r0 + 0.5);
  } else {
    hx = lerp(X1, bx, EZ.o2(fk)); hy = lerp(y1, by, fk * fk * 0.6 + 0.4 * fk) - 30 * Math.sin(Math.PI * fk * 0.5) * (1 - fk);
    rot = 0.9 * TAU * EZ.o2(fk); dir = Math.atan2(by - y1, bx - X1);
  }
  const flying = TT >= th && fk < 1;
  const mood = TT < tb ? 'calm' : TT < th ? 'happy' : TT < tLand + 0.4 ? 'wow' : 'puzzled';
  const look = TT < th ? [1, 0.2] : flying ? [0.5, 1] : [-0.8, -0.6];
  heroAir(hx, hy, HR, { key: 'hero', mood, look, rot, wind: TT > r0 && !(TT > tLand) ? 0.7 : 0, dir,
    sx: 1 + 0.14 * land, sy: 1 - 0.14 * land, arms: flying ? [1.3, 1.3] : null });
  viTag('bẻ dòng khí');
  pageCaption(['cánh bẻ dòng khí', 'hắt xuống sau'], [[1, 'hắt xuống']], { at: tb - t0 });
};

// ---------------------------------------------------------------------
//  PRESSURE — same wing; on "trên…giảm" a light zone above + "áp suất thấp" (the hero sits in it, a little
//  stretched up); on "dưới…tăng" a deeper zone below + "áp suất cao" + 3 short blue arrows pushing UP on the underside
// ---------------------------------------------------------------------
SCENES.pressure = function () {
  sketchPage({ grid: 'plain' });
  const t0 = ET('pressure'), tt = VW('pressure', 'trên'), ta = VW('pressure', 'áp'), td = VW('pressure', 'dưới'), ta2 = VW('pressure', 'áp', 2), tg = VW('pressure', 'tăng');
  const u = 0.17 * (TT - t0) + 0.5;
  // the zones (under everything): light above, deeper below
  const kz1 = ev(tt, 0.7), kz2 = ev(td, 0.7);
  if (kz1 > 0) airZone(540, 690, 340, 115, { part: kz1, key: 'w_zlo', a: 0.55 });
  if (kz2 > 0) airZone(540, 1040, 340, 105, { part: kz2, col: COL.air, key: 'w_zhi', a: 0.7 });
  // two flow lines keep the air moving past (top and bottom, out of the zones' way)
  w_flow(-330, 0, { down: 1.5, u, a: 0.75 });
  w_flow(340, 3, { down: 1.5, u, a: 0.75 });
  airfoil({ key: 'w_foil' });
  // three short blue arrows pushing UP on the underside, pulsing
  [380, 540, 700].forEach((x, i) => {
    const ta0 = ta2 + i * 0.15, k = ev(ta0, 0.35), yU = w_underY(x);
    if (k <= 0) return;
    const p = TT > ta0 + 0.35 ? 0.5 - 0.5 * Math.cos(TAU * (TT - ta0 - 0.35) / 1.2) : 0;
    arrowPencil([[x, yU + 110 - 4 * p], [x, yU + 22 - 10 * p]], k, { col: COL.airD, w: 6, key: 'w_pa' + i });
  });
  label('áp suất thấp', 540, 490, 62, { reveal: ev(ta, 0.6), key: 'w_llo', col: COL.airD });
  label('áp suất cao', 540, 1215, 62, { reveal: ev(td + 0.45, 0.6), key: 'w_lhi', col: COL.airD });
  // the hero sits in the low zone, a little stretched up (only away from the boundaries)
  const e = w_env('pressure'), [hx, hy] = BR.pressurePush.a, st = e * seg(TT, ta, ta + 0.6);
  const by = 5 * Math.sin((TT - t0) * 2.3) * e;
  const mood = TT < ta ? 'calm' : TT < td ? 'wow' : 'happy';
  const look = TT < td ? [0.3 * Math.sin((TT - t0) * 1.7), -0.8] : [0, 1];
  heroAir(hx, hy + by, HR, { key: 'hero', mood, look, sx: 1 - 0.05 * st, sy: 1 + 0.08 * st });
  viTag('áp suất');
  pageCaption(['trên thấp,', 'dưới cao'], [[1, 'cao']], { at: tt - t0 });
};
