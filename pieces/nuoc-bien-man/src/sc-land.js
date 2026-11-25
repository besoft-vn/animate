// =====================================================================
//  sc-land.js — rock (close-up boulder: acid drips gnaw pits, salt grains come out into a trickle, the hero slides down
//  and grabs one -> badge ON), river (coast: the hero rides the river DOWN-LEFT from the spring to the mouth, 2 grains
//  ride along; a glass of river water: lots of blue, ONE grain -> "loãng"), vents (underwater: a small undersea volcano
//  + a vent chimney; a red-orange plume rises, 3 grains puff out; the hero sinks to [540,820]).
//  Colour: terracotta = hero · BLUE = water · PLUM = salt · GREEN = acid drips only · RED-ORANGE = vent heat only ·
//  graphite = rock. KHUNG HÌNH GỌN: ≤ 10 objects, each r ≥ 18. All top-level names start with l_.
// =====================================================================
// a gentle idle bob that starts at t0 and dies out by `still` (the hero must be exact at the bridge)
const l_bob = (t0, still, amp = 6, per = 1.6) => amp * Math.sin(TAU * (TT - t0) / per) * (1 - seg(TT, still - 0.45, still)) * seg(TT, t0, t0 + 0.4);
const l_hop = (t0, d = 0.4) => Math.sin(Math.PI * seg(TT, t0, t0 + d));
// a label that writes on at t0 (over d) and fades out over [t1 - 0.25, t1]
function l_lab(str, x, y, size, t0, t1, o = {}) {
  if (TT < t0) return;
  alphaDo(1 - seg(TT, t1 - 0.25, t1), () => label(str, x, y, size, { reveal: ev(t0, o.d ?? 0.4), col: o.col, key: o.key, align: o.align }));
}
// a drop (point UP, round end DOWN): green acid drip / blue bubble shapes
function l_drop(x, y, r, col, colL, key, a = 1) {
  const P = []; for (let i = 0; i <= 28; i++) { const an = i / 28 * TAU, s = Math.sin(an / 2); P.push([x + r * Math.sin(an) * s, y + r * 0.25 - r * Math.cos(an) * (0.9 + 0.35 * (1 - s))]); }
  alphaDo(a, () => { gfill(P, colL, { key: key + 'f' }); gline(P, { w: 4, col, key: key + 'o', second: false, amp: 0.6 }); });
}
// a wavy polyline (for heat shimmer)
const l_wave = (x, y0, y1, amp, ph, n = 10) => { const P = []; for (let i = 0; i <= n; i++) { const y = lerp(y0, y1, i / n); P.push([x + amp * Math.sin(i * 1.1 + ph), y]); } return P; };

// ---------------------------------------------------------------------
//  ROCK — the close-up boulder (graphite hatching), the hero on top with a faint green (acid) tint.
// ---------------------------------------------------------------------
const l_BOULDER = loopify([[300, 935], [284, 830], [318, 730], [408, 674], [540, 650], [672, 660], [792, 712], [860, 800], [868, 900], [820, 942]]);
const l_TRICKLE = [[120, 1012], [330, 1002], [540, 998], [760, 992], [980, 984]];     // flows LEFT (down-left, like the river)
const l_PITS = [[432, 790, 22], [565, 870, 20], [690, 772, 22]];                       // x, y, r — where the drips gnaw
const l_DRIPS = [[432, 690], [565, 670], [690, 690]];                                  // start points on the top surface
// the hero's slide: from the top, down the LEFT flank, round the foot, along the trickle to the contract point
const l_SLIDE = [[540, 600], [430, 616], [340, 668], [262, 770], [236, 880], [300, 966], [420, 982], [540, 980]];
// the 4 grains: where they come out (pit / crack) and where they float in the trickle
const l_GRAINS = [
  { from: [432, 790], to: [395, 1000], t: 0.00, rot: -0.2 },     // <- the hero grabs this one on the way past
  { from: [565, 870], to: [655, 996], t: 0.18, rot: 0.25 },
  { from: [690, 772], to: [800, 992], t: 0.34, rot: -0.1 },
  { from: [770, 880], to: [190, 1008], t: 0.50, rot: 0.15 },
];
const l_slideAt = (k) => writeEnd(l_SLIDE, k);
let l_grabT = null;

SCENES.rock = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('rock'), e1 = EE('rock'), still = e1 - 0.5;
  const tg = VW('rock', 'gặm'), tm = VW('rock', 'mòn'), tc = VW('rock', 'chút'), th = VW('rock', 'hòa'), tk = VW('rock', 'khoáng');
  const tOut = th - 0.45;                                                  // the grains start to come out (just before "hòa tan")
  const tS0 = th + 0.45, tS1 = still - 0.3;                                // the hero's slide
  // the trickle at the foot (blue, flowing LEFT) — drawn first, the boulder sits behind / above it
  gline(l_TRICKLE, { w: 30, col: COL.water, key: 'l_tr1', second: false, amp: 0.5 });
  gline(l_TRICKLE, { w: 20, col: COL.waterL, key: 'l_tr2', second: false, amp: 0.4 });
  for (let i = 0; i < 3; i++) {
    const u = 1 - mod(TT * 0.16 + i / 3, 1);                                // drifts from right to left
    const A = writeEnd(l_TRICKLE, u), Bp = writeEnd(l_TRICKLE, Math.max(0, u - 0.05));
    gline([A, Bp], { w: 5, col: SK.sheet, key: 'l_trd' + i, second: false, amp: 0.3 });
  }
  // the boulder
  smudge(575, 948, 310, 26, 0.18);
  gfill(l_BOULDER, COL.rock, { key: 'l_bf' });
  litHatch(l_BOULDER, { ang: -0.9, gap: 15, col: SK.graph, w: 2.6, a: 0.5, key: 'l_bh', lx: 0.25, ly: 0.4, lr: 0.75 });
  gline(l_BOULDER, { w: 6, key: 'l_bo', closed: true });
  gpencil([[360, 860], [420, 900], [470, 905]], { key: 'l_bc1', w: 3 });
  gpencil([[740, 900], [800, 880], [835, 840]], { key: 'l_bc2', w: 3 });
  // the crack (written on, "mòn")
  gline([[640, 668], [628, 720], [660, 760], [648, 812], [690, 850], [770, 880]], { w: 5, key: 'l_crk', part: EZ.o2(ev(tm, 0.6)), second: false, amp: 0.8 });
  // pits gnawed where the drips run ("mòn" … "từng chút")
  l_PITS.forEach(([x, y, r], i) => {
    const k = EZ.back(ev(tm + 0.15 + i * 0.25, 0.35)); if (k <= 0.01) return;
    const P = loopPts(x, y, r * k, r * 0.7 * k, 0.05);
    gfill(P, '#8d877e', { key: 'l_pf' + i, a: 0.8 });
    gline(P, { w: 4, key: 'l_po' + i, second: false, amp: 0.5 });
  });
  // green acid drips running DOWN the rock face (from the hero, "gặm mòn"), each leaves a fading green streak
  l_DRIPS.forEach(([x, y0], i) => {
    const t0 = tg + i * 0.28, u = seg(TT, t0, t0 + 1.5); if (TT < t0) return;
    const yEnd = 935 - (i === 1 ? 10 : 30), y = lerp(y0, yEnd, EZ.i2(u)), xx = x + 6 * Math.sin(u * 5 + i);
    const fa = 1 - seg(TT, t0 + 1.5, t0 + 2.0);
    alphaDo(0.55 * fa * (1 - seg(TT, th, th + 0.6)), () => gline([[x, y0], [x + 3, (y0 + y) / 2], [xx, y]], { w: 9, col: COL.acid, key: 'l_ds' + i, second: false, amp: 0.8 }));
    l_drop(xx, y, 20, COL.acid, COL.acidL, 'l_dr' + i, fa);
  });
  // two chips break off on "chút" and fall to the foot, then fade
  [[318, 740, -1], [858, 800, 1]].forEach(([x, y, s], i) => {
    const t0 = tc + 0.05 + i * 0.2, u = seg(TT, t0, t0 + 0.7); if (TT < t0) return;
    const a = 1 - seg(TT, t0 + 1.0, t0 + 1.4); if (a <= 0) return;
    const cx = x + s * 70 * u, cy = y + (1000 - y) * u * u, rot = s * 4 * u;
    const P = [[-20, -12], [6, -20], [22, -2], [12, 16], [-14, 14]].map(([px, py]) => [cx + px * Math.cos(rot) - py * Math.sin(rot), cy + px * Math.sin(rot) + py * Math.cos(rot)]);
    alphaDo(a, () => { gfill(P, COL.rockD, { key: 'l_chf' + i }); gline(P, { w: 4, key: 'l_cho' + i, closed: true, second: false, amp: 0.5 }); });
  });
  // the hero's path (needed for the grab): exact at BR.rainRock.b until e0+0.5, slides tS0..tS1, exact at BR.rockRiver.a after
  const heroAt = (t) => {
    if (t >= tS1) return BR.rockRiver.a;
    const k = EZ.io(seg(t, tS0, tS1)); return l_slideAt(k);
  };
  const g0At = (t) => {                                                    // the first grain's place at time t
    const G = l_GRAINS[0], u = EZ.io(seg(t, tOut + G.t, tOut + G.t + 1.0));
    return [lerp(G.from[0], G.to[0], u) - 14 * seg(t, tOut + 1.0, tOut + 3), lerp(G.from[1], G.to[1], u) - 40 * Math.sin(Math.PI * u * 0.5) * (1 - u)];
  };
  if (l_grabT === null) {                                                  // when the sliding hero reaches grain 0
    l_grabT = tS1 - 0.3;
    for (let t = tS0; t < tS1; t += 1 / 48) { const h = heroAt(t), g = g0At(t); if (Math.hypot(h[0] - g[0], h[1] - g[1]) < 62) { l_grabT = t; break; } }
  }
  // the salt grains come OUT of the pits / the crack ("hòa tan") and float in the trickle, drifting slowly left
  l_GRAINS.forEach((G, i) => {
    const t0 = tOut + G.t; if (TT < t0) return;
    if (i === 0 && TT >= l_grabT) return;                                 // grabbed: it is the hero's badge now
    const u = EZ.io(seg(TT, t0, t0 + 1.0));
    let x = lerp(G.from[0], G.to[0], u), y = lerp(G.from[1], G.to[1], u) - 40 * Math.sin(Math.PI * u * 0.5) * (1 - u);
    const dr = seg(TT, t0 + 1.0, t0 + 3);                                  // after landing: drift left with the trickle, bob
    x -= 14 * dr * (i === 0 ? 1 : 1.6); y += 4 * Math.sin(TAU * (TT - t0) / 1.3 + i) * seg(TT, t0 + 0.9, t0 + 1.2);
    saltGrain(x, y, 21, { part: ev(t0, 0.35), key: 'l_g' + i, rot: G.rot + 0.08 * Math.sin(TT * 1.5 + i) });
  });
  // labels: "phong hóa" (with a graphite arrow to a pit), "khoáng chất" (plum) under the trickle
  const fA = 1 - seg(TT, still - 0.75, still - 0.45);
  l_lab('phong hóa', 770, 520, 58, tg + 0.15, still - 0.45, { key: 'l_lph', d: 0.06 });
  alphaDo(fA * clamp(ev(tg + 0.35, 0.4) * 1.2), () => {
    gline([[800, 545], [775, 640], [712, 745]], { w: 3.5, col: SK.graph, key: 'l_aph', part: EZ.o2(ev(tg + 0.35, 0.4)), second: false, amp: 0.6 });
    const k = ev(tg + 0.7, 0.15);
    if (k > 0) for (const s of [-1, 1]) { const an = Math.atan2(85, -58); gline([[712, 745], [712 - Math.cos(an + s * 0.5) * 24 * k, 745 - Math.sin(an + s * 0.5) * 24 * k]], { w: 3.5, col: SK.graph, key: 'l_aph' + s, second: false, amp: 0.4 }); }
  });
  l_lab('khoáng chất', 540, 1112, 62, tOut + 0.1, still - 0.45, { key: 'l_lkc', col: COL.salt });
  // the hero: exact on top until e0+0.5; tinted green (the acid drop) until the drips have left; slides on "hòa tan"
  const [hx0, hy0] = BR.rainRock.b;
  let hx, hy;
  if (TT < tS0) { hx = hx0; hy = hy0 + l_bob(e0 + 0.5, tS0 + 0.2, 5) - 22 * l_hop(tg - 0.1, 0.35) * (TT > e0 + 0.5 ? 1 : 0); }
  else[hx, hy] = heroAt(TT);
  if (TT >= tS1) { hy += l_bob(tS1, still, 5, 1.2) - 18 * l_hop(tS1, 0.3); }
  if (TT >= still) [hx, hy] = BR.rockRiver.a;
  const tint = 0.4 * (1 - seg(TT, tg + 0.2, tg + 1.4));
  if (tint > 0.01) alphaDo(tint, () => { gfill(loopPts(hx, hy, HR * 1.3, HR * 1.3, 0), COL.acidL, { key: 'l_tint' }); gline(loopPts(hx, hy, HR * 1.3, HR * 1.3, 0.06), { w: 4, col: COL.acid, key: 'l_tinto', second: false }); });
  const sliding = TT > tS0 && TT < tS1;
  const look = TT < tg ? [Math.sin((TT - e0) * 1.8) * 0.6, 0.6] : TT < th ? [0.3 * Math.sin(TT * 2), 1] : sliding ? [-0.6, 0.8] : TT < l_grabT + 0.6 ? [0.7, 0.6] : [0, 0.2];
  const mood = TT < tg ? 'calm' : TT < th ? 'puzzled' : TT < l_grabT ? 'wow' : 'happy';
  const land = l_hop(l_grabT, 0.35) * (TT < still ? 1 : 0);
  heroGiot(hx, hy, HR, { key: 'hero', look, mood, salt: ev(l_grabT, 0.35), arms: sliding ? [1.3, 1.3] : undefined, rot: sliding ? -0.25 * Math.sin(Math.PI * seg(TT, tS0, tS1)) : 0, sx: 1 + 0.06 * land, sy: 1 - 0.08 * land });
  sparkle(hx + HR * 0.62, hy + HR * 0.55, 60, seg(TT, l_grabT, l_grabT + 0.45), 'l_spk', COL.salt);
  viTag('mưa gặm đá');
  pageCaption(['Mưa hơi chua', 'gặm mòn, hòa tan đá'], [[1, 'hòa tan']], { size: 62, at: 0.25 });
};

// ---------------------------------------------------------------------
//  RIVER — the coast; the hero (badge ON) rides the river from the spring DOWN-LEFT to the mouth; 2 grains ride along
//  and sink into the sea. On "loãng" a glass of river water (lots of blue, ONE grain) + "loãng"; "biển mặn gấp ~300 lần".
// ---------------------------------------------------------------------
const l_GLASS = [[118, 712], [302, 712], [282, 935], [138, 935]];
SCENES.river = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('river'), e1 = EE('river'), still = e1 - 0.5;
  const tl = VW('river', 'loãng'), td = VW('river', 'đến'), tkh = VW('river', 'không');
  coast();
  const r0 = e0 + 0.5, r1 = still - 0.25;                                 // the ride
  // two grains ride the river too (behind the hero), then tip into the sea and sink, fading
  [[0.16, -0.25], [0.5, 0.3]].forEach(([lag, rot], i) => {
    const t0 = r0 + lag, u = (TT - t0) / (r1 - r0 - 0.2); if (u < 0.02) return;
    let x, y, a = 1;
    if (u <= 1) { [x, y] = riverAt(u); y -= 14; }
    else { const s = Math.min(TT - (t0 + (r1 - r0 - 0.2)), 1.6); x = MOUTH[0] - 40 * s - i * 30; y = MOUTH[1] - 14 + 60 * s; a = 1 - seg(s, 0.9, 1.5); }
    alphaDo(a, () => saltGrain(x, y, 20, { part: ev(t0, 0.3), key: 'l_rg' + i, rot: rot + 0.15 * Math.sin(TT * 2 + i) }));
  });
  // the glass of river water ("loãng"): lots of blue, ONE small grain
  const gk = EZ.back(ev(tl, 0.35)), ga = 1 - seg(TT, still - 0.45, still - 0.2);
  if (gk > 0.01) alphaDo(ga, () => {
    ctx.save(); ctx.translate(210, 935); ctx.scale(gk, gk); ctx.translate(-210, -935);
    const wy = 742 + 4 * Math.sin(TT * 2.2);
    const Wt = [[124, wy], [296, wy], [282, 935], [138, 935]];
    gfill(l_GLASS, SK.sheet, { key: 'l_gsf' });
    gfill(Wt, COL.waterL, { key: 'l_gwf', a: 0.9 });
    gline([[124, wy], [168, wy + 5], [210, wy - 3], [252, wy + 4], [296, wy]], { w: 4, col: COL.water, key: 'l_gwl', second: false, amp: 0.6 });
    gline(l_GLASS, { w: 5, key: 'l_gso', closed: true });
    gline([[136, 740], [148, 900]], { w: 3, col: SK.sheet, key: 'l_gsh', second: false, amp: 0.3 });
    saltGrain(218 + 18 * Math.sin(TT * 0.9), 850 + 10 * Math.sin(TT * 1.3), 18, { key: 'l_gg', rot: 0.2 * Math.sin(TT), part: ev(tl + 0.3, 0.3) });
    ctx.restore();
  });
  l_lab('loãng', 210, 1010, 66, tl + 0.1, still - 0.2, { key: 'l_llo', col: COL.water });
  l_lab('biển mặn gấp ~300 lần', 540, 1205, 54, td - 0.2, still - 0.2, { key: 'l_l300', d: 0.5 });
  // the hero: exact at the spring until r0, rides DOWN the river (u increasing), exact at the mouth from `still`
  const [hx0, hy0] = BR.rockRiver.b;
  const k = EZ.io(seg(TT, r0, r1)), off = EZ.io(seg(k, 0.8, 1));
  const [rx, ry] = riverAt(Math.max(0.001, k));
  let hx = rx + lerp(0, 40, off), hy = ry + lerp(-50, -6, off);
  const bob = 5 * Math.sin(TAU * (TT - r0) / 1.1) * seg(TT, r0, r0 + 0.4) * (1 - seg(TT, still - 0.45, still));
  hy += bob;
  if (TT < r0) [hx, hy] = [hx0, hy0];
  if (TT >= still) [hx, hy] = BR.riverVents.a;
  const kA = riverAt(Math.min(1, k + 0.03)), kB = riverAt(Math.max(0.001, k - 0.03));
  const lean = Math.atan2(kA[1] - kB[1], kA[0] - kB[0]);
  const rot = TT > r0 && TT < still ? 0.18 * Math.sin(lean) * (1 - off) * seg(TT, r0, r0 + 0.4) : 0;
  const look = TT < r0 ? [-0.5, 0.5] : TT < tl ? [-0.8, 0.6] : TT < tkh ? [-1, 0] : [0, 0.3];
  const mood = TT < tl ? 'happy' : TT < tkh ? 'calm' : 'puzzled';
  heroGiot(hx, hy, HR, { key: 'hero', look, mood, salt: 1, rot });
  viTag('sông ra biển');
  pageCaption(['Sông chở ra biển,', 'loãng: không nếm thấy'], [[1, 'loãng']], { size: 62, at: 0.25 });
};

// ---------------------------------------------------------------------
//  VENTS — underwater: a flat blue wash below the surface (y 470), the sea floor (y 1150), a small undersea volcano
//  (right) + a vent chimney (left). On "núi lửa" the crater glows; on "miệng phun nóng" a red-orange plume rises from
//  the chimney; on "góp thêm" 3 grains puff out of it. The hero sinks from [470,520] to [540,820].
// ---------------------------------------------------------------------
const l_SURF = 470, l_FLOOR = 1150, l_CH = [410, 1018];                  // chimney mouth
const l_VOLC = loopify([[600, 1158], [690, 1060], [745, 990], [800, 990], [860, 1060], [950, 1158]]);
SCENES.vents = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('vents'), e1 = EE('vents'), still = e1 - 0.5;
  const tn = VW('vents', 'núi'), tm = VW('vents', 'miệng'), tgop = VW('vents', 'góp');
  // the water: a calm flat blue wash below the surface, a drifting surface line
  const surf = []; for (let x = -240; x <= 1320; x += 40) surf.push([x, l_SURF + 7 * Math.sin(x / 95 + TT * 1.4)]);
  gfill([...surf, [1320, l_FLOOR + 40], [-240, l_FLOOR + 40]], COL.waterL, { key: 'l_ww', a: 0.55, off: [0, 0] });
  gline(surf, { w: 5, col: COL.water, key: 'l_wsl' });
  for (let i = 0; i < 2; i++) {                                           // two faint drifting current strokes
    const y = 640 + i * 230, x0 = 90 + mod(i * 420 + TT * 28 * (i ? -1 : 1), 760);
    const P = []; for (let j = 0; j <= 7; j++) P.push([x0 + j * 22, y + 7 * Math.sin(j * 0.9 + TT * 1.2 + i)]);
    gpencil(P, { w: 4, col: COL.water, key: 'l_wc' + i, a: 0.5 });
  }
  // the sea floor (graphite-hatched rock band)
  const FL = []; for (let x = -240; x <= 1320; x += 60) FL.push([x, l_FLOOR + 8 * Math.sin(x / 70)]);
  const FP = [...FL, [1320, 1262], [-240, 1262]];
  gfill(FP, COL.rock, { key: 'l_flf', off: [0, 0] });
  ctx.save(); gclip(FP); ghatch(-240, l_FLOOR - 20, 1320, 1262, { ang: -0.9, gap: 16, col: SK.graph, w: 2.4, a: 0.4, key: 'l_flh' }); ctx.restore();
  gline(FL, { w: 5, key: 'l_flo' });
  // the undersea volcano (right): graphite cone, the crater glows red-orange from "núi lửa", heat squiggles rise
  gfill(l_VOLC, COL.rockD, { key: 'l_vf' });
  litHatch(l_VOLC, { ang: -0.9, gap: 13, col: SK.graph, w: 2.4, a: 0.55, key: 'l_vh' });
  gline(l_VOLC, { w: 5.5, key: 'l_vo' });
  const cg = ev(tn, 0.4);
  if (cg > 0) {
    const CR = loopPts(772, 994, 34 * cg, 11 * cg, 0.04);
    gfill(CR, COL.hot, { key: 'l_crf', a: 0.85 });
    for (let i = 0; i < 2; i++) {
      const p = mod((TT - tn) * 0.7 + i * 0.5, 1), y0 = 975 - 50 * p;
      alphaDo(cg * Math.sin(Math.PI * p), () => gline(l_wave(752 + i * 40, y0, y0 - 60, 7, TT * 5 + i, 6), { w: 5, col: COL.hot, key: 'l_vs' + i, second: false, amp: 0.4 }));
    }
  }
  // two big bubbles from the crater (≤ 2), rising and fading
  for (let i = 0; i < 2; i++) {
    const t0 = tn + 0.4 + i * 1.1; if (TT < t0) continue;
    const p = mod((TT - t0) / 2.2, 1), y = 960 - 330 * p, x = 735 - 70 * p - i * 25 + 10 * Math.sin(p * 9 + i);
    alphaDo(Math.sin(Math.PI * p), () => gline(loopPts(x, y, 19, 19, 0.06), { w: 4, col: COL.water, key: 'l_bb' + i, second: false, amp: 0.5 }));
  }
  // the hot plume (red-orange shimmer) rising UP from the chimney ("miệng phun nóng")
  const pk = EZ.o2(ev(tm - 0.1, 0.9)), yTop = lerp(l_CH[1], 690, pk);
  if (pk > 0.01) {
    for (const [sc, aa, kk] of [[1, 0.4, 'o'], [0.55, 0.55, 'i']]) {      // a soft outer plume + a stronger core, round top
      const L = [], R = [];
      for (let i = 0; i <= 12; i++) {
        const y = lerp(l_CH[1], yTop, i / 12), h = l_CH[1] - y, cx = l_CH[0] + 12 * Math.sin(h / 45 - TT * 4) * (h / 330);
        const wd = sc * (20 + h * 0.2) * (1 - 0.65 * (i / 12) ** 4) + 5 * Math.sin(i * 1.7 + TT * 5);
        L.push([cx - wd, y]); R.unshift([cx + wd, y]);
      }
      gfill(loopify([...L, ...R]), COL.hotL, { key: 'l_plf' + kk, a: aa });
    }
    for (let i = 0; i < 3; i++) {                                         // shimmer strokes travelling UP inside the plume
      const p = mod((TT - tm) * 0.8 + i / 3, 1), y0 = lerp(l_CH[1] - 20, yTop + 40, p), h = l_CH[1] - y0;
      if (y0 < yTop + 30) continue;
      alphaDo(Math.sin(Math.PI * p), () => gline(l_wave(l_CH[0] - 14 + i * 14 + 10 * Math.sin(h / 45 - TT * 4) * (h / 330), y0, y0 - 70, 8, TT * 6 + i, 6), { w: 5, col: COL.hot, key: 'l_pls' + i, second: false, amp: 0.4 }));
    }
  }
  // the vent chimney (left)
  const CHP = [[360, 1158], [372, 1080], [384, 1022], [436, 1022], [448, 1080], [462, 1158]];
  gfill(CHP, COL.rockD, { key: 'l_chf' });
  ctx.save(); gclip(CHP); ghatch(350, 1010, 470, 1160, { ang: 0.9, gap: 12, col: SK.graph, w: 2.4, a: 0.55, key: 'l_chh' }); ctx.restore();
  gline(CHP, { w: 5.5, key: 'l_cho' });
  gline(loopPts(l_CH[0], l_CH[1] + 2, 27, 8, 0.05), { w: 4.5, key: 'l_chm', second: false, amp: 0.4 });
  if (pk > 0.01) gfill(loopPts(l_CH[0], l_CH[1] + 2, 22 * pk, 6 * pk, 0), COL.hot, { key: 'l_chg', off: [0, 0] });
  // 3 salt grains puff out of the chimney on "góp thêm", carried a little way up with the warm water
  [[300, 945, 0.0, -0.2], [338, 820, 0.22, 0.3], [512, 968, 0.44, -0.1]].forEach(([x, y, d, rot], i) => {
    const t0 = tgop + d; if (TT < t0) return;
    const u = EZ.o3(seg(TT, t0, t0 + 0.8)), rise = 14 * Math.max(0, TT - t0 - 0.8);
    const gx = lerp(l_CH[0], x, u) + 6 * Math.sin(TT * 1.4 + i) * seg(TT, t0 + 0.7, t0 + 1.0), gy = lerp(l_CH[1] - 10, y, u) - rise;
    saltGrain(gx, gy, 21, { part: ev(t0, 0.3), key: 'l_vg' + i, rot: rot + 0.1 * Math.sin(TT * 1.7 + i) });
  });
  // labels
  l_lab('núi lửa', 560, 965, 60, tn, still - 0.45, { key: 'l_lnl' });   // 6b: beside the cone, with a pointer
  if (TT > tn + 0.3 && TT < still - 0.45) alphaDo(1 - seg(TT, still - 0.75, still - 0.45), () => arrowPencil([[650, 975], [730, 1000]], ev(tn + 0.3, 0.3), { key: 'l_lnla', w: 4 }));
  l_lab('miệng phun nóng', 400, 1232, 58, tm, still - 0.45, { key: 'l_lmp', col: COL.hot });
  // the hero: exact just under the surface until e0+0.5, sinks DOWN with a gentle sway, exact at [540,820] from `still`
  const [ax, ay] = BR.riverVents.b, [bx, by] = BR.ventsEvap.a, s0 = e0 + 0.5, s1 = still - 0.55;
  const u = seg(TT, s0, s1), k = EZ.io(u), sw = Math.sin(TAU * u * 1.5) * Math.sin(Math.PI * u);
  let hx = lerp(ax, bx, k) - 40 * sw, hy = lerp(ay, by, k);
  hy += 5 * Math.sin(TAU * (TT - s1) / 1.3) * seg(TT, s1 - 0.2, s1 + 0.1) * (1 - seg(TT, still - 0.4, still));
  if (TT < s0) [hx, hy] = [ax, ay];
  if (TT >= still) [hx, hy] = [bx, by];
  const look = TT < tn ? [0, 0.8] : TT < tm ? [0.9, 0.6] : TT < tgop ? [-0.9, 0.7] : [-0.6, 0.4];
  const mood = TT < tn ? 'calm' : TT < tgop + 0.3 ? 'wow' : 'happy';
  heroGiot(hx, hy, HR, { key: 'hero', look, mood, salt: 1, rot: TT > s0 && TT < still ? 0.12 * sw : 0 });
  viTag('dưới đáy biển');
  pageCaption(['Núi lửa đáy biển', 'góp thêm khoáng chất'], [[1, 'góp thêm']], { size: 62, at: 0.25 });
};
