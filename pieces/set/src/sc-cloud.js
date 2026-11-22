// =====================================================================
//  sc-cloud.js — collide (inside the cloud: crystals rise, soft hail falls, one bump separates + / −; the hero hops
//  onto the pellet and gets its "−" badge) -> charge (cloud cross-section: + up to the top, − down to the base, the hero
//  rides its pellet down) ... heat (close-up of the blazing channel: thermometer ≈ 28.000 °C, the sun ×5).
//  KHUNG HÌNH GỌN: few big crystals / pellets / signs (≤ 10), bare page. Colour: blue = ice / +, plum = −,
//  yellow = light (channel core, the sun), red-orange = heat (channel rim, thermometer).
// =====================================================================
const c_CR = 31, c_PR = 42;                                     // crystal / pellet radius in "collide"
const c_RIDE_C = c_CR + HR * 0.95, c_RIDE_P = c_PR + HR * 0.92; // hero centre above a crystal / pellet centre
// alpha for something wrapping through the band y0..y1 (fades in/out over f px at both ends)
const c_bandA = (y, y0 = 430, y1 = 1240, f = 90) => clamp(Math.min((y - y0) / f, (y1 - y) / f));
const c_wrap = (y, y0 = 430, y1 = 1240) => y0 + mod(y - y0, y1 - y0);
// a soft graphite blob (wash) inside the cloud
function c_blob(x, y, rx, ry, a, key) {
  smudge(x, y, rx * 1.3, ry * 1.3, a);
}
// a label that writes on at t0 and fades out over [t1 - 0.25, t1]
const c_lab = (str, x, y, size, t0, t1, o = {}) => {
  const a = 1 - seg(TT, t1 - 0.25, t1); if (a <= 0 || TT < t0) return;
  ctx.save(); ctx.globalAlpha *= a; label(str, x, y, size, { reveal: ev(t0, o.d ?? 0.4), col: o.col, key: o.key, align: o.align }); ctx.restore();
};

// ---------------------------------------------------------------------
//  COLLIDE
// ---------------------------------------------------------------------
const c_C_LANES = [[360, 1180, 0.3], [700, 760, 1.4], [880, 1010, 2.6]];   // other rising crystals: x, y at era start, spin phase
const c_P_LANES = [[450, 560, 0.7], [790, 900, 2.1]];                      // other falling pellets
SCENES.collide = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('collide'), e1 = EE('collide'), u = TT - e0;
  const tg = VW('collide', 'gió'), tt = VW('collide', 'tinh'), tva = VW('collide', 'va'), tvao = VW('collide', 'vào');
  const tEnd = e1 - 0.5;                                        // labels gone by here
  // the cloud interior: a pale grey wash over the whole page + two darker graphite blobs drifting slowly
  gfill([[-240, -240], [1320, -240], [1320, 2160], [-240, 2160]], COL.cloudL, { a: 0.55, key: 'c_wash', off: [0, 0] });
  c_blob(760 - 9 * u, 560 + 6 * u, 240, 150, 0.32, 'c_bl1');
  c_blob(300 + 11 * u, 1120 - 8 * u, 260, 140, 0.3, 'c_bl2');
  // the updraft: two big blue arrows pointing UP on the left, breathing upward
  const ka = EZ.o2(ev(tg - 0.1, 0.6));
  for (let i = 0; i < 2; i++) {
    const x = 135 + i * 120, b = 14 * Math.sin(TAU * (u - i * 0.4) / 1.6), y0 = 1210 - i * 70, y1 = 760 - i * 70 - b;
    bigArrow(x, y0, x, y1, { col: i ? COL.posL : COL.pos, w: 52, part: seg(ka * 1.3 - i * 0.3, 0, 1), key: 'c_up' + i, a: 0.85 });
  }
  c_lab('gió', 195, 640, 64, tg, tEnd, { key: 'c_lgio' });
  // the other rising crystals (wrap by fading at top / bottom) and falling pellets
  const cpos = [];
  c_C_LANES.forEach(([x, y, ph], i) => {
    const y1 = c_wrap(y - 80 * u), xx = x + 10 * Math.sin(u * 1.1 + ph);
    cpos.push([xx, y1]);
    iceCrystal(xx, y1, c_CR - 2 + i * 2, { rot: ph + u * 0.5, key: 'c_ic' + i, a: c_bandA(y1), plus: i < 2 ? EZ.o2(ev(tva + 0.45 + i * 0.3, 0.3)) : 0 });
  });
  const ppos = [];
  c_P_LANES.forEach(([x, y, ph], i) => {
    const y1 = c_wrap(y + 45 * u), xx = x + 8 * Math.sin(u * 0.9 + ph);
    ppos.push([xx, y1]);
    hailPellet(xx, y1, c_PR - 2 + i * 2, { key: 'c_hp' + i, a: c_bandA(y1) });
  });
  // THE pair: crystal C0 (hero rides it, rising) and pellet P0 (falling); they bump on "va"
  const kb = EZ.o2(seg(TT, tva, tva + 0.6));
  const c0x = 540 - 40 * kb, c0y = 860 + c_RIDE_C - 80 * (TT - 10.75);
  const ub = seg(TT, tva, 16.0), fP = 0.58 * ub + 1.84 * ub * ub - 1.42 * ub ** 3;
  const p0x = TT < tva ? 612 + 12 * (tva - TT) : lerp(612, 600, EZ.io(ub)) + 22 * Math.sin(Math.PI * seg(TT, tva, tva + 0.7));
  const p0y = TT < tva ? 790 - 45 * (tva - TT) : 790 + (900 + c_RIDE_P - 790) * fP;
  const kpm = EZ.o2(ev(tva + 0.1, 0.35));
  iceCrystal(c0x, c0y, c_CR + 2, { rot: 0.4 + u * 0.5, key: 'c_ic0', plus: kpm, a: c_bandA(c0y, 400, 1300, 80) });
  hailPellet(p0x, p0y, c_PR, { key: 'c_hp0', minus: kpm });
  sparkle(576, 782, 70, seg(TT, tva - 0.05, tva + 0.45), 'c_spk');
  // labels: "tinh thể băng" (blue) pointing to the crystal in lane 2, "mưa đá mềm" pointing to the pellet in lane 2
  c_lab('tinh thể băng', 700, 470, 56, tt, tEnd, { col: COL.pos, key: 'c_ltinh' });
  c_lab('mưa đá mềm', 735, 1225, 56, tvao - 0.2, tEnd, { key: 'c_lmua' });
  // the hero: exactly at BR.cloudCollide.b until 10.75, then riding C0 up; hops onto P0 after the bump; badge on landing
  const th = tva + 0.25, tl = th + 0.55, kh = EZ.io(seg(TT, th, tl));
  let hx, hy;
  if (TT <= 10.75) [hx, hy] = BR.cloudCollide.b;
  else {
    const ax = c0x, ay = c0y - c_RIDE_C, bx = p0x, by = p0y - c_RIDE_P;
    hx = lerp(ax, bx, kh); hy = lerp(ay, by, kh) - 70 * Math.sin(Math.PI * kh);
  }
  if (TT >= 16.0) [hx, hy] = BR.collideCharge.a;
  const land = Math.sin(Math.PI * seg(TT, tl, tl + 0.3));
  const look = TT < 11.0 ? [0, 0.6] : TT < tva - 0.3 ? [0.5, -0.6] : TT < tl ? [0.9, 0.5] : [-0.2, 0.7];
  const mood = TT < tva - 0.1 ? 'calm' : TT < tl + 0.4 ? 'wow' : 'happy';
  heroTia(hx, hy, HR, { key: 'hero', look, mood, badge: ev(tl, 0.35), sx: 1 + 0.08 * land, sy: 1 - 0.1 * land, arms: kh > 0 && kh < 1 ? [1.2, 1.2] : null });
  viTag('va chạm trong mây');
  pageCaption(['Băng nhỏ bay lên,', 'va hạt mưa đá mềm'], [[1, 'va']], { size: 62, at: 0.3 });
};

// ---------------------------------------------------------------------
//  CHARGE
// ---------------------------------------------------------------------
const c_PS = [[270, 830], [440, 720], [740, 760], [880, 880]], c_PT = [[300, 505], [470, 555], [650, 495], [820, 540]];   // + crystals: start, top
const c_MS = [[380, 960], [560, 775], [850, 680]], c_MT = [[220, 1045], [660, 1065], [830, 1000]];                      // − pellets: start, base
// the cloud cross-section: lumpy outline (top ≈ 410, flat base 1160), light wash, a darker lower band; lumps boil slowly
const c_CV = [[60, 1160], [45, 1030], [75, 900], [55, 770], [95, 650], [85, 545], [170, 465], [290, 430], [400, 452], [490, 410], [610, 428], [710, 402], [830, 440], [935, 500], [985, 625], [960, 750], [1000, 870], [980, 1000], [1015, 1160]];
function c_cloudPts(u) {
  const out = [];
  for (let i = 0; i < c_CV.length - 1; i++) {
    const [ax, ay] = c_CV[i], [bx, by] = c_CV[i + 1], L = Math.hypot(bx - ax, by - ay), nx = (by - ay) / L, ny = -(bx - ax) / L;
    const f = 0.22 + 0.06 * Math.sin(u * 1.3 + i * 1.9);
    for (let k = 0; k < 8; k++) { const v = k / 8, b = Math.sin(Math.PI * v) * L * f; out.push([ax + (bx - ax) * v + nx * b, ay + (by - ay) * v + ny * b]); }
  }
  out.push(c_CV[c_CV.length - 1]);
  return out;
}
function c_cloud(u, part) {
  const P = c_cloudPts(u);
  gfill(P, COL.cloudL, { a: 0.6, key: 'c_clf' });
  scribbleFill(P, COL.cloud, { key: 'c_cls', gap: 30, w: 5, base: 0.08, a: 0.22 * part });
  ctx.save(); gclip(P); smudge(530, 1170, 560, 150, 0.35); ctx.restore();
  gline(P, { w: 5, key: 'c_clo', part, closed: true });
}
SCENES.charge = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('charge'), e1 = EE('charge'), u = TT - e0;
  const tvc = VW('charge', 'va'), ttach = VW('charge', 'tách'), td = VW('charge', 'dương'), tdinh = VW('charge', 'đỉnh'), tam = VW('charge', 'âm');
  const tEnd = e1 - 0.5;
  // the cloud cross-section filling the frame (top ≈ 420, base ≈ 1160), lower band shaded
  c_cloud(u, EZ.o2(ev(e0 - 0.4, 0.9)));
  // + crystals: jostle in the middle, signs pop on "tách", rise to the top on "dương", then drift gently
  c_PS.forEach(([sx, sy], i) => {
    const [tx, ty] = c_PT[i], k = EZ.io(seg(TT, td + i * 0.14, td + 1.3 + i * 0.14));
    const jx = 16 * Math.sin(u * 1.4 + i * 1.7) * (1 - k) + 9 * Math.sin(u * 0.8 + i) * k, jy = 20 * Math.sin(u * 1.8 + i * 2.3) * (1 - k) + 7 * Math.sin(u * 1.1 + i * 2) * k;
    const x = lerp(sx, tx, k) + jx, y = lerp(sy, ty, k) + jy, ks = EZ.o2(ev(ttach + i * 0.1, 0.3));
    iceCrystal(x, y, 34, { rot: u * 0.6 + i, key: 'c_pc' + i });
    chargeSign(x, y, 22 * (0.4 + 0.6 * EZ.back(ks)) * (ks > 0 ? 1 : 0), 1, { key: 'c_ps' + i });
  });
  // − pellets: jostle, signs on "tách", sink to the base on "âm"
  c_MS.forEach(([sx, sy], i) => {
    const [tx, ty] = c_MT[i], k = EZ.io(seg(TT, tam + i * 0.14, tam + 1.4 + i * 0.14));
    const jx = 15 * Math.sin(u * 1.2 + i * 2.1) * (1 - k) + 8 * Math.sin(u * 0.7 + i) * k, jy = 18 * Math.sin(u * 1.6 + i * 1.3) * (1 - k) + 6 * Math.sin(u * 1.0 + i * 3) * k;
    const x = lerp(sx, tx, k) + jx, y = lerp(sy, ty, k) + jy, ks = EZ.o2(ev(ttach + 0.2 + i * 0.1, 0.3));
    hailPellet(x, y, 36, { key: 'c_mp' + i });
    if (ks > 0) chargeSign(x, y, 22 * (0.4 + 0.6 * EZ.back(ks)), -1, { key: 'c_ms' + i });
  });
  // a bump tick on "va chạm" between a crystal and a pellet in the middle
  sparkle(520, 705, 60, seg(TT, tvc, tvc + 0.45), 'c_spk2');
  // labels
  c_lab('dương +', 560, 665, 64, td, tEnd, { col: COL.pos, key: 'c_lduong' });
  c_lab('âm −', 190, 945, 64, tdinh, tEnd, { col: COL.neg, key: 'c_lam' });
  // the hero on its pellet: exactly at BR.collideCharge.b until 17.0, a gentle bob, then rides DOWN to BR.chargeLeader.a
  const [ax, ay] = BR.collideCharge.b, [bx, by] = BR.chargeLeader.a;
  const kd = EZ.io(seg(TT, tam, tam + 1.75)), bob = seg(TT, 17.0, 17.4) * (1 - seg(TT, tam - 0.4, tam));
  let hx = lerp(ax, bx, kd) + 14 * bob * Math.sin(TAU * (TT - 17.0) / 1.5), hy = lerp(ay, by, kd) + 18 * bob * Math.sin(TAU * (TT - 17.0) / 1.2);
  if (TT <= 17.0) [hx, hy] = [ax, ay];
  if (TT >= e1 - 0.5) [hx, hy] = [bx, by];
  hailPellet(hx, hy + c_RIDE_P, c_PR, { key: 'c_hp0', minus: 1 });
  const look = TT < ttach ? [-0.4, 0.3] : TT < tam ? [-0.3, -0.9] : [-0.6, 0.8];
  heroTia(hx, hy, HR, { key: 'hero', badge: 1, look, mood: TT > td && TT < tam ? 'wow' : 'calm' });
  viTag('tách điện tích');
  pageCaption(['Dương lên đỉnh,', 'âm xuống đáy mây'], [[0, 'Dương'], [1, 'âm']], { size: 62, at: 0.3 });
};

// ---------------------------------------------------------------------
//  HEAT
// ---------------------------------------------------------------------
const c_chanPts = () => { const P = []; for (let y = 430; y <= 1230; y += 20) P.push([520 + 26 * Math.sin((y - 380) / 140) + 10 * Math.sin(y / 53), y]); return P; };
function c_sun(x, y, r, k, key) {
  if (k <= 0) return;
  const rr = r * EZ.back(k), sp = TT * 0.4;
  for (let i = 0; i < 10; i++) { const a = sp + i / 10 * TAU; gline([[x + Math.cos(a) * rr * 1.25, y + Math.sin(a) * rr * 1.25], [x + Math.cos(a) * rr * 1.65, y + Math.sin(a) * rr * 1.65]], { w: 5, col: COL.flashD, key: key + 'r' + i, second: false, part: k }); }
  const P = loopPts(x, y, rr, rr, 0.05);
  scribbleFill(P, COL.flash, { key: key + 'f', gap: 10, w: 5, base: 0.6 });
  gline(P, { w: 4, key: key + 'o', part: k });
}
SCENES.heat = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('heat'), e1 = EE('heat'), u = TT - e0;
  const tsat = VW('heat', 'sét'), tn = VW('heat', 'nóng'), tg = VW('heat', 'gấp');
  const tEnd = e1 - 0.5;
  // the channel: red-orange glow + rim around a yellow core, pulsing
  const P = c_chanPts(), pu = 0.5 + 0.5 * Math.sin(TAU * u / 0.9), hot = 1 + 0.25 * seg(TT, tn, tn + 0.6);
  gline(P, { w: 150 + 14 * pu, col: COL.hotL, a: 0.55 + 0.2 * pu, key: 'c_chg', second: false, amp: 2.5 });
  gline(P, { w: (96 + 10 * pu) * (0.95 + 0.05 * hot), col: COL.hot, a: 0.9, key: 'c_chr', second: false, amp: 2 });
  gline(P, { w: 58 + 6 * pu, col: COL.flash, key: 'c_chc', second: false, amp: 1.4 });
  gline(P, { w: 16, col: SK.sheet, a: 0.85, key: 'c_chw', second: false, amp: 1 });
  // heat shimmer: short graphite wiggles near the channel, drifting up and fading on a cycle
  [[385, 560], [665, 640], [375, 930], [675, 1080], [660, 820]].forEach(([x, y], i) => {
    const ph = mod(u / 1.6 + i * 0.37, 1), a = Math.sin(Math.PI * ph) * 0.9, yy = y - 50 * ph, Q = [];
    for (let k = 0; k <= 8; k++) Q.push([x + 9 * Math.sin(k * 0.9 + TT * 7 + i), yy - k * 10]);
    gpencil(Q, { w: 4, a, key: 'c_shm' + i, amp: 1, step: 6 });
  });
  // the thermometer (right): a tube with a red column rising (from "sét", reaching the top on "nóng")
  const tx = 800, tTop = 925, tBot = 1170, kt = EZ.o2(ev(tsat - 0.3, 0.4)), kc = EZ.io(seg(TT, tsat, tn + 0.5));
  const fa = 1 - seg(TT, tEnd - 0.25, tEnd);
  if (kt > 0) {
    ctx.save(); ctx.globalAlpha *= fa;
    const T = sketchBox(tx - 20, tTop, 40, tBot - tTop + 10, 18, 0);
    gfill(T, SK.sheet, { key: 'c_thf' });
    const top = lerp(tBot, tTop + 18, kc) - 5 * pu * seg(TT, tn + 0.5, tn + 0.8);
    if (kc > 0) gfill(sketchBox(tx - 9, top, 18, tBot - top + 20, 8, 0), COL.hot, { key: 'c_thc', off: [0, 0] });
    scribbleFill(loopPts(tx, tBot + 30, 36, 36, 0), COL.hot, { key: 'c_thb', gap: 9, w: 5, base: 0.75 });
    gline(T, { w: 4.5, key: 'c_tho', part: kt });
    gline(loopPts(tx, tBot + 30, 36, 36, 0.06), { w: 4.5, key: 'c_thbo', part: kt });
    for (let i = 1; i <= 4; i++) gpencil([[tx + 22, tTop + i * 48], [tx + 44, tTop + i * 48]], { w: 3, key: 'c_tht' + i, part: kt });
    ctx.restore();
  }
  c_lab('≈ 28.000 °C', 745, 885, 54, tsat + 0.25, tEnd, { col: COL.hot, key: 'c_lt', d: 0.2 });
  // the sun ×5 (left, up): on "nóng gấp"
  const ks = ev(tn, 0.4), sfa = 1 - seg(TT, tEnd - 0.25, tEnd);
  if (ks > 0) { ctx.save(); ctx.globalAlpha *= sfa; c_sun(170, 560, 58 + 4 * Math.sin(TAU * u / 1.2), ks, 'c_sun'); ctx.restore(); }
  c_lab('gấp 5 lần', 205, 705, 58, tn + 0.15, tEnd, { key: 'c_lx5', d: 0.25 });
  c_lab('bề mặt', 205, 772, 56, tg, tEnd, { key: 'c_lbm', d: 0.25 });
  c_lab('Mặt Trời', 205, 839, 56, tg + 0.15, tEnd, { key: 'c_lmt', d: 0.25 });
  // the hero: exactly at BR.strikeHeat.b, leans back from the heat and sweats, back at BR.heatThunder.a by 47.25
  const [hx0, hy0] = BR.strikeHeat.b, kl = EZ.io(seg(TT, e0 + 0.6, e0 + 1.3)) * (1 - EZ.io(seg(TT, tEnd - 0.75, tEnd - 0.05)));
  const flinch = Math.sin(Math.PI * seg(TT, tn, tn + 0.45));
  const hx = hx0 + 42 * kl + 14 * flinch, hy = hy0 - 10 * kl + 8 * kl * Math.sin(TAU * u / 1.1);
  heroTia(hx, hy, HR, { key: 'hero', mood: 'wow', look: [-0.9, 0.1], rot: 0.2 * kl, arms: kl > 0.3 ? [0.4 + 0.25 * Math.sin(TAU * u / 0.5), null] : null, sy: 1 - 0.05 * flinch });
  for (let i = 0; i < 2; i++) { const ph = (u - 0.9 - i * 0.6) / 1.2; if (ph > 0 && TT < tEnd - 0.2) sweat(hx - 50 + i * 100, hy - 36, mod(ph, 1), 'c_sw' + i); }
  viTag('kênh sét nóng');
  pageCaption(['Nóng gấp 5 lần', 'bề mặt Mặt Trời'], [[0, 'gấp 5 lần']], { size: 62, at: 0.3 });
};
