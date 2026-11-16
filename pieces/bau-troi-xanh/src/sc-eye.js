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
  // the sky: a soft blue scribble from frame 1, brightening on "khắp trời"
  const br = EZ.o2(ev(tK, 0.8));
  scribbleFill(closed, COL.blueL, { key: 'e_sky1', gap: 22, w: 5, a: 0.6, base: 0.26, ang: -0.55 });
  if (br > 0) {
    gfill(closed, COL.blueL, { a: 0.32 * br, off: [0, 0], key: 'e_skyw' });
    scribbleFill(closed, COL.blue, { key: 'e_sky2', gap: 30, w: 4.5, a: 0.32, base: 0, ang: 0.7, part: br });
  }
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
    // the pulse: one short thick blue dash travelling along the arrow (gentle before "khắp", livelier after)
    const look = TT < tH ? -1 : TT < tN ? (i < 3 ? 1 : 0) : TT < tK ? (i > 3 ? 1 : 0) : 1;
    if (look) {
      const sp = TT < tK ? 0.7 : 1.15, u = ((TT - t0) * sp + i * 0.37) % 1, len = 0.22;
      const S = e_sub(P, Math.max(0, u - len), u);
      if (S) gline(S, { w: TT < tK ? 9 : 12, col: COL.blue, key: 'e_dp' + i, second: false, amp: 0.6, step: 6 });
    }
    molecule(x, y, 24, { rot, key: 'e_m' + i });
  });
  // the hero on the horizon, looking up; looks left on "hướng", right on "nào", up and amazed on "khắp"
  const lk = TT < tH ? [0, -1] : TT < tN ? [-0.9, -0.7] : TT < tK ? [0.9, -0.7] : [0, -1];
  const hop = Math.sin(Math.PI * ev(tK, 0.4)) * 0.9 + Math.sin(Math.PI * ev(tM, 0.35)) * 0.6;
  const hy = TT >= EE('dome') - 0.6 ? E_HERO_D[1] : E_HERO_D[1] - 34 * hop;
  doodleHero(E_HERO_D[0], hy, HR, { key: 'hero', legs: true, mood: TT >= tK ? (TT >= tM ? 'happy' : 'wow') : 'calm', look: lk,
    arms: TT >= tK ? [1.1, 1.1] : [-0.9, -0.9], sx: 1 - 0.04 * hop, sy: 1 + 0.05 * hop });
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
//  SUNSET (41.5–49.5) — the Earth's curve and its shell of air. Noon light comes straight down (short way
//  through the air); the low orange sun's light goes slanting through it (a long way): blue gets knocked out
//  along the road, orange arrives.
// =====================================================================
const E_EARTH = { cx: 560, cy: 2700, r: 1500, ra: 1720 };
const e_arcPts = (r, x0 = 20, x1 = 1060) => { const P = []; for (let x = x0; x <= x1; x += 20) P.push([x, E_EARTH.cy - Math.sqrt(r * r - (x - E_EARTH.cx) ** 2)]); return P; };
SCENES.sunset = function () {
  const t0 = ET('sunset'), tX = VW('sunset', 'xiên'), tD = VW('sunset', 'dày'), tC = VW('sunset', 'chục'), tB = VW('sunset', 'xanh'), tH = VW('sunset', 'hất'), tNo = VW('sunset', 'nắng');
  sketchPage({ grid: 'plain' });
  // the shell of air (a faint blue band) and the Earth's curve
  const G = e_arcPts(E_EARTH.r), S = e_arcPts(E_EARTH.ra), band = [...S, ...G.slice().reverse()];
  gfill(band, COL.blueL, { a: 0.22, off: [0, 0], key: 'e_sband' });
  gpencil(S, { key: 'e_shell', w: 3, a: 0.75 });
  gline(G, { w: 6, key: 'e_earth' });
  label('lớp khí', 830, 1100, 46, { col: SK.graph, key: 'e_slk' });
  // the hero: from the bridge spot, hops down onto the Earth (it is the observer)
  const P0 = BR.violetSunset.b, P1 = [760, 1149], tJ = t0 + 0.55;
  const r = e_hop(tJ, 0.55, P0, P1, 90), hp = TT < tJ ? P0 : r, arc = TT < tJ ? 0 : r[2];
  const hr = lerp(HR, 45, EZ.io(ev(tJ, 0.55)));
  // noon: a small yellow sun straight overhead, its light short and straight down
  const noon = [760, 500], np = ev(tNo - 0.15, 0.4);
  const fade = 1 - 0.45 * ev(tH, 0.5);
  ctx.save(); ctx.globalAlpha = fade;
  if (np > 0) {
    sunDoodle(noon[0], noon[1], 52, { key: 'e_nsun', part: np, rays: np });
    gline([[760, 590], [761, 1098]], { w: 6, col: COL.sun, key: 'e_npath', part: ev(tNo + 0.1, 0.4), second: false, amp: 0.8 });
    e_arrow([[761, 1040], [760, 1094]], { col: COL.sun, w: 6, key: 'e_nhead', part: ev(tNo + 0.45, 0.1), head: 22 });
  }
  ctx.restore();
  // sunset: the low orange sun at BR.sunsetEnd, its light slanting a long way through the air
  const SUN = BR.sunsetEnd.a, sp = ev(tX - 0.2, 0.45);
  const LP = e_bow([SUN[0] + 128, SUN[1] + 26], [hp[0] - 58, P1[1] - 6], -14, 24);
  const lp = ev(tX + 0.2, 0.7);
  if (lp > 0) {
    gline(LP, { w: 7, col: COL.sun, key: 'e_lpath', part: lp, second: false, amp: 0.8 });
    // blue peels off along the road ("xanh bị hất đi"), the light turns orange behind it
    const op = ev(tB, tH + 0.9 - tB);
    if (op > 0) { gline(LP, { w: 7, col: COL.orange, key: 'e_lpo', part: op, second: false, amp: 0.8 }); }
    e_arrow(LP.slice(-4), { col: op >= 1 ? COL.orange : COL.sun, w: 7, key: 'e_lhead', part: ev(tX + 0.85, 0.1), head: 26 });
    const PEEL = [[0.12, -1.9], [0.3, -1.25], [0.46, -2.15], [0.62, -1.4], [0.78, -1.95]];
    PEEL.forEach(([u, an], i) => {
      const t = tB + 0.15 + i * 0.28, k = ev(t, 0.3); if (k <= 0) return;
      const Q = resample(LP, false, 6), p = Q[Math.round(u * (Q.length - 1))], L = 150;
      e_arrow(e_bow([p[0] + Math.cos(an) * 14, p[1] + Math.sin(an) * 14], [p[0] + Math.cos(an) * L, p[1] + Math.sin(an) * L], 8, 8), { col: COL.blue, w: 6, key: 'e_peel' + i, part: k, head: 24 });
    });
    // "dày gấp hàng chục lần": the long road through the air
    const tp = ev(tD, 0.5);
    if (tp > 0) {
      label('dày gấp', 420, 810, 72, { key: 'e_st1', reveal: tp });
      const ww = letterW('hàng chục lần', 72, 'hand'), x0 = 420 - ww / 2, xs = letterW('hàng ', 72, 'hand'), xe = letterW('hàng chục', 72, 'hand');
      highlight(x0 + xs, x0 + xe, 880, 40, ev(tC, 0.3), { key: 'e_sthi' });
      label('hàng chục lần', 420, 895, 72, { key: 'e_st2', reveal: ev(tD + 0.35, 0.5) });
    }
  }
  if (sp > 0) sunDoodle(SUN[0], SUN[1], SUN[2], { col: COL.orange, key: 'e_lsun', part: sp, rays: ev(tX, 0.4) });
  // the hero (the observer): looks up at noon, then left to the low sun; amazed on "chục", content at the end
  const look = TT < tJ + 0.5 ? [0.2, 0.8] : TT < tX ? [0, -1] : [-1, -0.2];
  const mood = TT < tC ? 'calm' : TT < tH + 0.6 ? 'wow' : 'happy';
  doodleHero(hp[0], hp[1], hr, { key: 'hero', legs: true, mood, look, sx: 1 - 0.05 * arc, sy: 1 + 0.07 * arc });
  viTag('hoàng hôn');
  pageCaption(['nắng đi xiên,', 'xanh bị hất đi'], [[0, 'xiên']], { at: tX - t0 + 0.3 });
};
