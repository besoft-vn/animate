// =====================================================================
//  sc-eye.js — dome (the payoff), violet, sunset. KHUNG HÌNH GỌN: few large things, bare paper.
//  Globals prefixed e_. Deterministic (no Math.random).
// =====================================================================

// ---- shared helpers ----------------------------------------------------
// a hop from a to b starting at t0 over d seconds, arc height h (eased)
function e_hop(t0, d, a, b, h) {
  const u = EZ.io(ev(t0, d)), arc = Math.sin(Math.PI * clamp((TT - t0) / d));
  return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * arc, arc];
}
// a gently bowed path A -> B (n points), bow = sideways offset at the middle
function e_bow(A, B, bow = 0, n = 14) {
  const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1;
  const cx = mx - dy / L * bow, cy = my + dx / L * bow, P = [];
  for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u; P.push([v * v * A[0] + 2 * u * v * cx + u * u * B[0], v * v * A[1] + 2 * u * v * cy + u * u * B[1]]); }
  return P;
}
// an inked arrow along P, written on with part; optional paper halo so it reads on a coloured scribble
function e_arrow(P, o = {}) {
  const { col = SK.ink, w = 5, part = 1, key = 'ea', halo = false, a = 1, head = 26 } = o;
  if (part <= 0) return;
  if (halo) gline(P, { w: w + 9, col: SK.paper, a: 0.75 * a, key: key + 'hl', part, second: false, amp: 0.8 });
  const Q = gline(P, { w, col, a, key, part, amp: 1.1 });
  if (!Q || part < 0.85) return;
  const e = Q[Q.length - 1], q = Q[Math.max(0, Q.length - 3)], an = Math.atan2(e[1] - q[1], e[0] - q[0]), hk = seg(part, 0.85, 1);
  for (const s of [-1, 1]) {
    const T = [e, [e[0] - Math.cos(an + s * 0.5) * head * hk, e[1] - Math.sin(an + s * 0.5) * head * hk]];
    if (halo) gline(T, { w: w + 8, col: SK.paper, a: 0.75 * a, key: key + 'hh' + s, second: false, amp: 0.4, step: 6 });
    gline(T, { w, col, a, key: key + 'h' + s, second: false, amp: 0.5, step: 6 });
  }
}
// a sub-path of a polyline between fractions u0..u1 (by length)
function e_sub(P, u0, u1) {
  const R = resample(P, false, 6), n = R.length - 1, i0 = Math.max(0, Math.floor(u0 * n)), i1 = Math.min(n, Math.ceil(u1 * n));
  return i1 - i0 >= 1 ? R.slice(i0, i1 + 1) : null;
}

// =====================================================================
//  DOME (29.5–35.0) — the payoff, after the SLAM. Complete on frame 1.
//  A big blue sky dome over the horizon; the hero stands at the bottom, looking up; 7 molecules in the dome each
//  send a blue arrow down into the hero's eyes. "khắp trời": the dome brightens, the arrows pulse into the eye.
// =====================================================================
const E_DOME = { cx: 520, cy: 1170, rx: 425, ry: 740 };
const E_HERO_D = [560, 1060];
// molecules: [x, y, rot]
const E_MOLS = [[228, 1030, 0.5], [292, 836, -0.3], [398, 690, 0.9], [540, 610, 0.1], [668, 702, -0.8], [770, 850, 0.35], [826, 1036, -0.4]];
function e_domePts() {
  const { cx, cy, rx, ry } = E_DOME, P = [];
  for (let i = 0; i <= 48; i++) { const a = Math.PI + i / 48 * Math.PI; P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return P;
}
SCENES.dome = function () {
  const t0 = ET('dome'), tK = VW('dome', 'khắp'), tM = VW('dome', 'mắt'), tH = VW('dome', 'hướng'), tN = VW('dome', 'nào');
  sketchPage({ grid: 'plain' });
  const D = e_domePts(), closed = [...D, [E_DOME.cx - E_DOME.rx, E_DOME.cy]];
  // the sky: a soft blue scribble from frame 1, brightening on "khắp trời"; between, it breathes in slow waves
  // (a wash that swells every 1.6 s, stronger from "ánh xanh") so the held payoff never freezes
  const br = EZ.o2(ev(tK, 0.8)), tA = VW('dome', 'ánh');
  scribbleFill(closed, COL.blueL, { key: 'e_sky1', gap: 22, w: 5, a: 0.6, base: 0.26, ang: -0.55 });
  // two halves breathe a quarter-wave apart (period 2 s), so some of the sky is always swelling or easing
  const wamp = lerp(0.2, 0.28, ev(tA, 0.5)), ph = TAU * (TT - t0) / 2.0;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, E_DOME.cx, H); ctx.clip();
  gfill(closed, COL.blueL, { a: wamp * (0.5 - 0.5 * Math.cos(ph)) + 0.3 * br, off: [0, 0], key: 'e_skyw' }); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(E_DOME.cx, 0, W, H); ctx.clip();
  gfill(closed, COL.blueL, { a: wamp * (0.5 - 0.5 * Math.sin(ph)) + 0.3 * br, off: [0, 0], key: 'e_skyw' }); ctx.restore();
  // a band of brighter blue sweeps up the dome from the horizon to the top, once per wave
  const sw = ((TT - t0) / 2.0) % 1, syb = E_DOME.cy - sw * (E_DOME.ry + 160);
  ctx.save(); gclip(closed);
  gfill([[60, syb], [1000, syb - 40], [1000, syb + 120], [60, syb + 160]], COL.blue, { a: 0.1 * (0.5 + 0.5 * ev(tA, 0.5)) * Math.sin(Math.PI * sw), off: [0, 0], key: 'e_skyb' });
  ctx.restore();
  if (br > 0) scribbleFill(closed, COL.blue, { key: 'e_sky2', gap: 30, w: 4.5, a: 0.32, base: 0, ang: 0.7, part: br });
  gline(D, { w: 6, key: 'e_dome' });
  // the horizon
  gline([[70, 1172], [330, 1168], [700, 1174], [1000, 1169]], { w: 6, key: 'e_hor' });
  gpencil([[150, 1196], [260, 1194]], { key: 'e_g1', a: 0.5 }); gpencil([[790, 1198], [930, 1195]], { key: 'e_g2', a: 0.5 });
  // the sun, small, outside the dome (top right): the source
  sunDoodle(866, 470, 46, { key: 'e_dsun' });
  // arrows: each molecule -> the hero's eyes; a light pulse runs down each, stronger after "khắp"
  const eye = [E_HERO_D[0], E_HERO_D[1] - 4];
  E_MOLS.forEach(([x, y, rot], i) => {
    const d = Math.hypot(eye[0] - x, eye[1] - y), ux = (eye[0] - x) / d, uy = (eye[1] - y) / d;
    const A = [x + ux * 46, y + uy * 46], Bp = [eye[0] - ux * 104, eye[1] - uy * 104];
    const P = e_bow(A, Bp, (i % 2 ? 1 : -1) * 10);
    e_arrow(P, { col: COL.blue, w: 5.5, key: 'e_da' + i, halo: true });
    // the pulse: short thick blue dashes keep travelling down every arrow (calm before "khắp", livelier after)
    const sp = TT < tK ? 0.6 : 1.0, len = 0.22;
    for (const k of [0, 0.5]) {
      const u = ((TT - t0) * sp + i * 0.37 + k) % 1, S = e_sub(P, Math.max(0, u - len), u);
      if (S) gline(S, { w: TT < tK ? 10 : 12, col: COL.blue, key: 'e_dp' + i + k, second: false, amp: 0.6, step: 6 });
    }
    molecule(x, y, 24, { rot, key: 'e_m' + i });
  });
  // the hero on the horizon, looking up; its gaze sweeps the sky (left on "hướng", right on "nào", back and forth
  // through "ánh xanh cũng từ"), up and amazed on "khắp"; a slow sway keeps it alive, settled from EE - 0.6
  const tE6 = EE('dome') - 0.6, settle = 1 - ev(tE6 - 0.4, 0.4);
  const gx = TT < tH ? 0.35 * Math.sin((TT - t0) * 2.2) : TT < tN ? -0.9 : TT < tK ? 0.9 * Math.cos((TT - tN) * 2.4) : 0.25 * Math.sin((TT - tK) * 1.8);
  const lk = [gx, TT < tK ? -0.75 : -1];
  const hop = Math.sin(Math.PI * ev(tK, 0.4)) * 0.9 + Math.sin(Math.PI * ev(tM, 0.35)) * 0.6 + Math.sin(Math.PI * ev(tA, 0.35)) * 0.5;
  const hy = TT >= tE6 ? E_HERO_D[1] : E_HERO_D[1] - 34 * hop;
  const rot = TT >= tE6 ? 0 : settle * 0.07 * Math.sin((TT - t0) * 2.0) + gx * 0.05;
  doodleHero(E_HERO_D[0], hy, HR, { key: 'hero', legs: true, mood: TT >= tK ? (TT >= tM ? 'happy' : 'wow') : 'calm', look: lk, rot,
    arms: TT >= tK ? [1.1, 1.1] : TT >= tA ? [0.2 + 0.3 * Math.sin((TT - tA) * 3), -0.9] : [-0.9, -0.9], sx: 1 - 0.04 * hop, sy: 1 + 0.05 * hop + (TT >= tE6 ? 0 : 0.015 * Math.sin(TT * 3)) });
  viTag('trời xanh');
  pageCaption(['ánh xanh từ', 'khắp trời'], [[1, 'khắp']], { at: VW('dome', 'ánh') - t0 });
};

// =====================================================================
//  VIOLET (35.0–41.5) — why not violet? Two bars: sunlight has lots of blue, little violet ("ít tím").
//  The eye and its sensitivity curve, low at violet ("kém nhạy").
// =====================================================================
function e_eye(x, y, s, key, part = 1) {
  const up = [], lo = [];
  for (let i = 0; i <= 16; i++) { const u = i / 16, xx = x + (u - 0.5) * 140 * s; up.push([xx, y - Math.sin(Math.PI * u) * 46 * s]); lo.push([xx, y + Math.sin(Math.PI * u) * 38 * s]); }
  const P = [...up, ...lo.reverse()];
  if (part >= 1) gfill(P, SK.sheet, { a: 1, off: [0, 0], key: key + 'f' });
  gline(P, { w: 5, key: key + 'o', part });
  if (part >= 1) {
    const ir = loopPts(x, y - 2 * s, 28 * s, 28 * s, 0.05);
    gfill(ir, SK.graph, { a: 0.55, off: [0, 0], key: key + 'if' });
    gline(ir, { w: 4, key: key + 'i' });
    ctx.fillStyle = SK.ink; ctx.beginPath(); ctx.arc(x, y - 2 * s, 12 * s, 0, TAU); ctx.fill();
    ctx.fillStyle = SK.sheet; ctx.beginPath(); ctx.arc(x - 6 * s, y - 8 * s, 4.5 * s, 0, TAU); ctx.fill();
    for (let i = 0; i < 4; i++) { const xx = x + (i - 1.5) * 26 * s; gline([[xx, y - 44 * s + Math.abs(i - 1.5) * 5 * s], [xx + (i - 1.5) * 6 * s, y - 62 * s + Math.abs(i - 1.5) * 8 * s]], { w: 3.5, key: key + 'l' + i, second: false, amp: 0.4, step: 5 }); }
  }
}
const E_CURVE = { x0: 330, x1: 920, y0: 1180, h: 180, pk: 700, wd: 200 };
const e_sens = (x) => E_CURVE.y0 - E_CURVE.h * Math.exp(-(((x - E_CURVE.pk) / E_CURVE.wd) ** 2));
SCENES.violet = function () {
  const t0 = ET('violet'), tT = VW('violet', 'tím'), tN = VW('violet', 'nắng'), tI = VW('violet', 'ít'), tE = VW('violet', 'mắt'), tK = VW('violet', 'kém');
  sketchPage({ grid: 'plain' });
  // ---- the bars: sunlight's blue vs violet
  const base = 920, bx = [[270, 380], [450, 560]];
  if (TT >= tN - 0.2) sunDoodle(168, 540, 40, { key: 'e_vsun', part: ev(tN - 0.2, 0.4), rays: ev(tN, 0.4) });
  gline([[230, base], [610, base + 3]], { w: 5, key: 'e_vbase', part: ev(tN, 0.35) });
  const hL = 330 * EZ.o3(ev(tN + 0.25, 0.5)), hT = 120 * EZ.o3(ev(tI, 0.45));
  [[0, hL, COL.blue, 'lam'], [1, hT, COL.violet, 'tím']].forEach(([i, h, col, name]) => {
    if (h < 2) return;
    const [x0, x1] = bx[i], P = [[x0, base], [x0 + 1, base - h], [x1 - 1, base - h + 2], [x1, base]];
    scribbleFill(P, col, { key: 'e_vb' + i, gap: 13, w: 4.5, a: 0.85, base: 0.3, ang: -0.7 });
    gline(P, { w: 5, key: 'e_vbo' + i });
    label(name, (x0 + x1) / 2, base + 64, 54, { col: SK.ink, key: 'e_vbl' + i, reveal: ev(i ? tI + 0.2 : tN + 0.5, 0.3) });
  });
  // ---- the eye and its sensitivity curve
  const ep = ev(tE - 0.1, 0.4);
  if (ep > 0) e_eye(178, 1095, 1, 'e_veye', ep);
  gline([[E_CURVE.x0, E_CURVE.y0], [E_CURVE.x1, E_CURVE.y0 + 2]], { w: 4, key: 'e_vax', part: ev(tE + 0.2, 0.4), col: SK.graph, second: false });
  const CP = []; for (let x = E_CURVE.x0; x <= E_CURVE.x1 - 20; x += 10) CP.push([x, e_sens(x)]);
  const cp = ev(tE + 0.45, 0.7);
  gline(CP, { w: 6, key: 'e_vcur', part: cp });
  if (cp >= 1) {
    // where blue and violet sit on it: blue is seen; violet sits in the dip ("kém nhạy")
    const xb = 520, xv = 390, yb = e_sens(xb), yv = e_sens(xv);
    const pb = popS(tE + 1.15), pv = popS(tK);
    if (pb > 0) { const C = loopPts(xb, yb, 20 * pb, 20 * pb, 0.1); gfill(C, COL.blue, { a: 0.9, off: [0, 0], key: 'e_vdb' }); gline(C, { w: 4, key: 'e_vdbo' }); }
    if (pv > 0) {
      const C = loopPts(xv, yv, 20 * pv, 20 * pv, 0.1); gfill(C, COL.violet, { a: 0.9, off: [0, 0], key: 'e_vdv' }); gline(C, { w: 4, key: 'e_vdvo' });
      e_arrow([[xv, yv - 130], [xv + 2, yv - 72], [xv, yv - 34]], { col: COL.violet, w: 5, key: 'e_vda', part: ev(tK + 0.1, 0.35), head: 20 });
    }
  }
  // ---- the hero: puzzled "?" at the start, hops beside the chart, then up to the bridge spot (800,560)
  const A0 = BR.domeViolet.b, M = [790, 860], A1 = BR.violetSunset.a, tJ1 = t0 + 0.9, tJ2 = EE('violet') - 1.2;
  let hp = A0, arc = 0;
  if (TT >= tJ1 && TT < tJ2) { const r = e_hop(tJ1, 0.5, A0, M, 110); hp = r; arc = r[2]; }
  if (TT >= tJ2) { const r = e_hop(tJ2, 0.55, M, A1, 120); hp = r; arc = r[2]; }
  if (TT < t0 + 0.5) hp = A0;
  const mood = TT < tN ? 'puzzled' : TT < tK ? 'calm' : TT < tK + 0.8 ? 'wow' : 'happy';
  const look = TT < tJ1 ? [0.2, -0.8] : TT < tE ? [-1, 0.3] : TT < tJ2 ? [-1, 0.9] : [-0.8, 0.8];
  doodleHero(hp[0], hp[1], HR, { key: 'hero', legs: true, mood, look, sx: 1 - 0.05 * arc, sy: 1 + 0.07 * arc, arms: TT >= tK && TT < tJ2 ? [-0.6, 1.0] : null });
  const qk = popS(tT) * (1 - ev(tN, 0.3));
  if (qk > 0) handLetter('?', hp[0] + 96, hp[1] - 86, 120 * qk, { col: COL.violet, key: 'e_vq', jit: 1.2 });
  viTag('màu tím?');
  pageCaption(['nắng ít tím,', 'mắt kém nhạy'], [[1, 'kém']], { at: tI - t0 });
};


// =====================================================================
//  SUNSET (41.5–49.5) — a sunset over the sea (the same sea as "end"). The hero lands on a rock at right.
//  Noon: a ghost sun high up, its light comes straight down — a SHORT way through the thick air near the sea.
//  "xiên": the orange sun sinks onto the horizon; its light runs LOW and LONG through that air to the hero.
//  "chục": "dày gấp / hàng chục lần". "hất": blue arrows peel up off the long beam, it turns orange/red, the sky warms.
// =====================================================================
const E_SS = { hero: [840, 1110], hr: HR * 0.8, ghost: [840, 450, 62], airTop: 905 };
// the thick air near the sea: one band from the left edge to the right, top edge gently wavy, bottom = the horizon
const E_AIR = (() => { const P = []; for (let x = 70; x <= 1010; x += 40) P.push([x, E_SS.airTop + 10 * Math.sin(x / 150)]); P.push([1010, SEA.y - 2], [70, SEA.y - 2]); return P; })();
// the long low beam: from the low sun's rays to the hero, bowing up a little above the sea
const E_LONG = e_bow([348, 1030], [E_SS.hero[0] - E_SS.hr - 10, E_SS.hero[1] - 8], -46, 26);
const E_PEEL = [[0.14, -1.75, 150], [0.29, -1.35, 170], [0.44, -1.9, 160], [0.58, -1.45, 175], [0.72, -1.8, 150], [0.85, -1.4, 135]];
function e_rock() {
  const P = [[748, 1214], [760, 1196], [786, 1186], [840, 1182], [896, 1186], [924, 1198], [936, 1216]];
  gfill([...P, [748, 1222]], SK.sheet, { a: 1, off: [0, 0], key: 'e_rkf' });
  litHatch([...P, [748, 1222]], { key: 'e_rkh', gap: 9, lx: 0.4, ly: 0.9 });
  gline(P, { w: 5, key: 'e_rko' });
  gpencil([[770, 1226], [920, 1228]], { key: 'e_rkw', w: 3, a: 0.6 });
}
SCENES.sunset = function () {
  const t0 = ET('sunset'), tNo = VW('sunset', 'nắng'), tX = VW('sunset', 'xiên'), tL = VW('sunset', 'lớp'), tD = VW('sunset', 'dày');
  const tHg = VW('sunset', 'hàng'), tC = VW('sunset', 'chục'), tP = VW('sunset', 'phần'), tB = VW('sunset', 'xanh'), tH = VW('sunset', 'hất');
  const tDg = VW('sunset', 'đường'), tE6 = EE('sunset') - 0.6;
  sketchPage({ grid: 'plain' });
  // ---- the sky: pale blue at noon; from "xiên" the warm sky spreads (written on slowly), deepening on "hất"
  const warm = ev(tX + 0.2, tH - tX - 0.2), deep = ev(tH - 0.1, tE6 - tH + 0.1);
  const SKY1 = [[60, 520], [1020, 520], [1020, SEA.y], [60, SEA.y]], SKY2 = [[60, SEA.y - 260], [1020, SEA.y - 260], [1020, SEA.y], [60, SEA.y]];
  if (warm < 1) { const k = 1 - EZ.io(warm); scribbleFill(SKY1, COL.blueL, { key: 'e_snoon', gap: 26, w: 6, a: 0.45 * k, base: 0.16 * k, ang: -0.5 }); }
  if (warm > 0) scribbleFill(SKY1, SEA.skyL, { key: 'seask1', gap: 22, w: 7, base: 0.35, part: warm });
  if (deep > 0) scribbleFill(SKY2, SEA.sky, { key: 'seask2', gap: 18, w: 7, base: 0.3, part: deep });
  // the warm light keeps rising from the horizon through "phần lớn màu xanh…" (a wash whose top edge climbs)
  const rise = EZ.io(ev(tP - 0.2, tE6 - tP + 0.2));
  if (rise > 0) { const yt = lerp(SEA.y, 540, rise); gfill([[60, yt + 30], [540, yt], [1020, yt + 24], [1020, SEA.y], [60, SEA.y]], SEA.sky, { a: 0.3, off: [0, 0], key: 'e_srise' }); }
  // ---- the sea (swell lines drift on their own)
  seaHorizon({ sky: false });
  // ---- the thick air: one translucent blue band along the sea, drawn on "lớp khí"; it thins as the blue is knocked out
  const ap = ev(tL - 0.1, 0.6), af = 1 - 0.55 * ev(tH + 0.2, 1.0);
  if (ap > 0) {
    scribbleFill(E_AIR, COL.blue, { key: 'e_air', gap: 26, w: 9, a: 0.3 * af, base: 0.13 * af, ang: -0.12, part: ap });
    gpencil(E_AIR.slice(0, -2), { key: 'e_airl', w: 3, a: 0.6 * af, part: ap });
    label('lớp khí dày', 640, 1000, 46, { col: SK.graph, key: 'e_airt', reveal: ev(tL + 0.3, 0.4) * (1 - ev(tP, 0.4)) });
  }
  // ---- the noon ghost: dashed graphite sun high up, a dashed path down, and a SHORT yellow beam through the air
  const g = E_SS.ghost, gp = ev(tNo - 0.1, 0.45), gdim = 1 - 0.5 * ev(tX, 0.5);
  if (gp > 0) {
    ctx.save(); ctx.globalAlpha = gdim; ctx.setLineDash([16, 14]);
    gpencil(loopPts(g[0], g[1], g[2], g[2], 0.04), { key: 'e_ghost', w: 3.5, a: 0.8, part: gp });
    gpencil([[g[0], g[1] + g[2] + 22], [g[0], E_SS.airTop - 14]], { key: 'e_ghl', w: 3, a: 0.6, part: ev(tNo + 0.2, 0.3) });
    ctx.setLineDash([]);
    e_arrow([[g[0], E_SS.airTop - 6], [g[0] + 1, E_SS.hero[1] - E_SS.hr - 16]], { col: COL.sun, w: 8, key: 'e_nbeam', part: ev(tNo + 0.45, 0.3), head: 22 });
    ctx.restore();
    if (TT < tNo + 0.4) { const tip = writeEnd(loopPts(g[0], g[1], g[2], g[2], 0.04), gp); pencilTool(tip[0], tip[1], -0.75, 0.8); }
  }
  // ---- the low orange sun: sinks into place on "xiên", then keeps settling a few px; exactly at BR.sunsetEnd from EE-0.6
  const [sx, sy0, sr] = BR.sunsetEnd.a, sp = ev(tX - 0.3, 0.9);
  if (sp > 0) {
    const sy = TT >= tE6 ? sy0 : lerp(sy0 - 190, sy0 - 18, EZ.o3(sp)) + 18 * EZ.io(ev(tX + 0.6, tE6 - tX - 0.6));
    ctx.save(); ctx.beginPath(); ctx.rect(-200, -200, W + 400, SEA.y - 2 + 200); ctx.clip();
    ctx.globalAlpha = clamp(sp * 2);
    sunDoodle(sx, sy, sr, { col: COL.orange, key: 'e_lsun', rays: ev(tX, 0.5) });
    ctx.restore();
    seaGlitter(sx, { key: 'e_gl', col: COL.orange });
  }
  // ---- the long low beam: yellow on "xiên", a light pulse runs along it; on "hất" it turns orange, red at the hero
  const lp = ev(tX + 0.25, 0.8);
  if (lp > 0) {
    gline(E_LONG, { w: 8, col: COL.sun, key: 'e_long', part: lp, second: false, amp: 0.8 });
    const op = ev(tH, 1.0), rp = ev(tH + 0.5, 0.7);
    if (op > 0) gline(E_LONG, { w: 8, col: COL.orange, key: 'e_longo', part: op, second: false, amp: 0.8 });
    if (rp > 0) { const R = e_sub(E_LONG, 0.55, 0.55 + 0.45 * rp); if (R) gline(R, { w: 8, col: COL.red, key: 'e_longr', second: false, amp: 0.8 }); }
    if (lp >= 1) {
      // the pulse: light travelling the long road (calm, one every 1.5 s)
      const u = ((TT - tX) / 1.5) % 1, S = e_sub(E_LONG, Math.max(0, u - 0.12), u);
      if (S) gline(S, { w: 15, col: op > 0.5 ? COL.orange : COL.sun, key: 'e_lpul', second: false, amp: 0.6, step: 6 });
    }
    e_arrow(E_LONG.slice(-4), { col: rp >= 1 ? COL.red : op >= 1 ? COL.orange : COL.sun, w: 8, key: 'e_lhead', part: ev(tX + 0.95, 0.12), head: 26 });
    // "hất": ≤ 6 blue arrows peel UP off the long beam
    const Q = resample(E_LONG, false, 6);
    E_PEEL.forEach(([u, an, L], i) => {
      const k = ev(tH - 0.15 + i * 0.2, 0.35); if (k <= 0) return;
      const p = Q[Math.round(u * (Q.length - 1))];
      e_arrow(e_bow([p[0] + Math.cos(an) * 16, p[1] + Math.sin(an) * 16], [p[0] + Math.cos(an) * L, p[1] + Math.sin(an) * L], 10, 8),
        { col: COL.blue, w: 6, key: 'e_peel' + i, part: k, head: 22, halo: true });
    });
  }
  // ---- "dày gấp / hàng chục lần" above the air
  const tp = ev(tD, 0.45);
  if (tp > 0) {
    const X = 470, Y1 = 700, Y2 = 790;
    label('dày gấp', X, Y1, 76, { key: 'e_st1', reveal: tp });
    const ww = letterW('hàng chục lần', 76, 'hand'), x0 = X - ww / 2, xs = letterW('hàng ', 76, 'hand'), xe = letterW('hàng chục', 76, 'hand');
    highlight(x0 + xs, x0 + xe, Y2 - 20, 42, ev(tC + 0.2, 0.3), { key: 'e_sthi' });
    label('hàng chục lần', X, Y2, 76, { key: 'e_st2', reveal: ev(tHg - 0.05, 0.5) });
  }
  // ---- the hero: arrives at the bridge spot, hops down onto the rock; looks up at noon, left at the low sun,
  //      follows the light along the road, amazed on "chục" and "hất", content at the end
  e_rock();
  const P0 = BR.violetSunset.b, P1 = E_SS.hero, tJ = t0 + 0.5;
  const r = e_hop(tJ, 0.6, P0, P1, 80), hp = TT < tJ ? P0 : r, arc = TT < tJ ? 0 : r[2];
  const hr = lerp(HR, E_SS.hr, EZ.io(ev(tJ, 0.6)));
  const land = Math.sin(Math.PI * ev(tJ + 0.6, 0.25));
  const hop2 = Math.sin(Math.PI * ev(tC, 0.35)) * 0.7 + Math.sin(Math.PI * ev(tB, 0.3)) * 0.4 + Math.sin(Math.PI * ev(tDg, 0.35)) * 0.8;
  const look = TT < tNo ? [0.2, 0.8] : TT < tX ? [0, -1] : TT < tP ? [-1, -0.25]
    : TT < tH ? [-1 + 0.5 * (0.5 - 0.5 * Math.cos((TT - tP) * 2.6)), -0.3 - 0.4 * (0.5 - 0.5 * Math.cos((TT - tP) * 2.6))] : [-0.7, -0.9];
  const mood = TT < tC ? 'calm' : TT < tC + 0.7 ? 'wow' : TT < tH ? 'calm' : TT < tH + 0.8 ? 'wow' : 'happy';
  const arms = TT >= tH && TT < tDg ? [0.9, -0.6] : TT >= tDg ? [1.1, 1.1] : null;
  doodleHero(hp[0], hp[1] - 26 * hop2, hr, { key: 'hero', legs: true, mood, look, arms,
    sx: 1 - 0.05 * arc + 0.06 * land - 0.03 * hop2, sy: 1 + 0.07 * arc - 0.08 * land + 0.05 * hop2 + 0.015 * Math.sin(TT * 3) });
  viTag('hoàng hôn');
  pageCaption(['nắng đi xiên,', 'xanh bị hất đi'], [[0, 'xiên']], { at: tX - t0 + 0.3 });
};
