// =====================================================================
//  SCENES water / flip / jostle — "inside the rice" close-ups (navy world). Owned by the molecule agent.
//  Colour code: terracotta = the hero + heat (glow), yellow COL.wave = the electric field ONLY, other water molecules
//  periwinkle warming toward terracotta (tempCol) in jostle. The hero sits at (540, 860) at every boundary.
//  KHUNG HÌNH GỌN: flat navy, a few big faint rice-grain silhouettes at the edges, ≤ 10 molecules (r ≥ 44), no specks.
// =====================================================================

// the other water molecules: home [x, y, r]; the same homes in all three eras (continuity across the morphs)
const MO_HOME = {
  A: [205, 610, 55], B: [865, 620, 52], G: [180, 885, 50], F: [885, 890, 50],
  C: [195, 1170, 54], D: [875, 1170, 50], E: [540, 1200, 50], H: [540, 545, 50],
};
const MO_HX = 540, MO_HY = 860;   // the hero, pinned (BR.bounceWater.b = waterFlip = flipJostle)

// background: flat navy + a soft lighter middle + three big faint rice grains at the edges ("inside the rice")
function MO_bg(key) {
  fillAll(C.navy);
  ctx.save(); screen();
  const g = ctx.createRadialGradient(540, 880, 120, 540, 880, 760);
  g.addColorStop(0, 'rgba(36,40,92,0.55)'); g.addColorStop(1, 'rgba(12,13,28,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const grains = [[-30, 330, 300, 120, 0.35], [1110, 470, 280, 115, -0.5], [-60, 1440, 320, 125, -0.25], [1120, 1380, 300, 120, 0.4]];
  grains.forEach(([x, y, rx, ry, a], i) => {
    const dx = Math.sin(TT * 0.35 + i * 1.7) * 10, dy = Math.cos(TT * 0.3 + i) * 8;
    paint(ellipsePts(x + dx, y + dy, rx, ry, a + Math.sin(TT * 0.2 + i) * 0.03, 40), {
      fill: 'rgba(36,40,88,0.65)', line: 'rgba(124,134,196,0.45)', w: 3, key: 'mo_g' + key + i,
      tex: [{ k: 'hatch', c: 'rgba(124,134,196,0.5)', a: 0.8, gap: 9, al: 0.35, dens: (px, py) => clamp(((px - x) + (py - y)) / rx + 0.3) }],
    });
  });
}
// a big hand-lettered charge sign, centred at (x, y), popped by scale s
function MO_sign(str, x, y, size, s, key) {
  if (s <= 0.01) return;
  const a = size * 0.36 * s, w = Math.max(6, size * 0.13);
  ink([[x - a, y], [x + a, y]], { w, color: C.white, key: key + 'h', amt: 0.5 });
  if (str === '+') ink([[x, y - a], [x, y + a]], { w, color: C.white, key: key + 'v', amt: 0.5 });
}
// the hero's + (beyond the H ears) and − (far side of the O), each with its own pop scale
function MO_charges(ang, sp, sm, size = 96) {
  const r = HR;
  MO_sign('+', MO_HX + Math.cos(ang) * r * 1.9, MO_HY + Math.sin(ang) * r * 1.9, size, sp, 'mo_cp');
  MO_sign('−', MO_HX - Math.cos(ang) * r * 1.5, MO_HY - Math.sin(ang) * r * 1.5, size, sm, 'mo_cm');
}
// a molecule drawn at scale s around its centre (pop-in)
function MO_mol(x, y, r, ang, s, o) {
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  waterMol(0, 0, r, ang, { dark: true, ...o });
  ctx.restore();
}
// small paper card (≥ 56 px text) popped in at t
function MO_card(str, x, y, t, size = 58, rot = -0.03) { inkCard(str, x, y, size, { rot, s: popS(t), frac: ev(t + 0.05, 0.35) }); }
// each molecule's slow drifting/turning in calm water
const MO_wanderAng = (k, t) => { const S = RNG('mo_w', k); return S.r(-Math.PI, Math.PI) + t * S.r(-0.35, 0.35) + Math.sin(t * 0.9 + S.r(0, 6)) * 0.25; };
const MO_drift = (k, t) => { const S = RNG('mo_d', k), a = S.r(0, 6), b = S.r(0, 6); return [Math.sin(t * 0.55 + a) * 14, Math.cos(t * 0.47 + b) * 12]; };
const MO_heroWater = (t) => 0.14 * Math.sin((t - ET('water')) * 1.7);

// ---------------------------------------------------------------------
//  4 · WATER — the hero up close, with its H ears; water molecules drift in; "+" on "dương", "−" on "âm"
// ---------------------------------------------------------------------
SCENES.water = function () {
  const tN = VW('water', 'nước'), tP = VW('water', 'dương'), tM = VW('water', 'đầu', 2);
  MO_bg('w');
  ['A', 'B', 'G', 'F', 'C', 'D'].forEach((k, i) => {
    const [x, y, r] = MO_HOME[k], [dx, dy] = MO_drift(k, TT);
    MO_mol(x + dx, y + dy, r, MO_wanderAng(k, TT), popS(tN + i * 0.14), { key: 'mo_' + k });
  });
  const ang = MO_heroWater(TT);
  heroMol(MO_HX, MO_HY, HR, ang, { dark: true, mood: TT > tP ? 'wow' : undefined });
  MO_charges(ang, popS(tP), popS(tM));
  if (TT >= tP) MO_card('đầu +', 720, 1020, tP + 0.15, 58, -0.03);
  if (TT >= tM) MO_card('đầu −', 370, 1020, tM + 0.15, 58, 0.03);
};

// ---------------------------------------------------------------------
//  5 · FLIP — a big yellow field arrow flips left/right on the beat (faster from "tỷ"); every molecule's + end follows
// ---------------------------------------------------------------------
const MO_FLIPS = (() => {
  const a = snap8(VW('flip', 'đổi')), b = snap8(VW('flip', 'tỷ')), out = [];
  for (let t = a; t < b - 1e-6; t += 0.5) out.push(t);
  for (let t = b; t < EE('flip') + 1.5; t += 0.25) out.push(t);
  return out;
})();
const MO_ARROW_T = () => ET('flip') + 0.5;
const MO_ALIGN_T = () => ET('flip') + 0.75;
// signed field: +1 → pointing right, −1 → left; eased through 0 on each flip (0.16 s)
function MO_field(t) {
  let n = 0; while (n < MO_FLIPS.length && MO_FLIPS[n] <= t) n++;
  if (n === 0) return 1;
  const p = EZ.io(clamp((t - MO_FLIPS[n - 1]) / 0.16)), prev = n % 2 === 1 ? 1 : -1;
  return prev * Math.cos(Math.PI * p);
}
const MO_wrap = (a) => mod(a + Math.PI, TAU) - Math.PI;
// molecule angle in flip: wander until the field appears, then a spring per flip (alternating ±π: back and forth)
function MO_flipAng(k, a0fn, t) {
  const tA = MO_ALIGN_T(), S = RNG('mo_f', k), sgn = S.f() < 0.5 ? -1 : 1, kk = S.r(150, 230), dd = S.r(16, 22);
  const a0 = a0fn(Math.min(t, tA));
  if (t < tA) return a0;
  const base = a0fn(tA), T0 = base + MO_wrap(0 - base);
  let v = base + (T0 - base) * springEase(t - tA, 90, 16);
  MO_FLIPS.forEach((tf, i) => { if (t > tf) v += (i % 2 === 0 ? 1 : -1) * sgn * Math.PI * springEase(t - tf - 0.03 * S.f(), kk, dd); });
  return v;
}
const MO_heroFlipAng = (t) => MO_flipAng('hero', MO_heroWater, t);
SCENES.flip = function () {
  const tTy = VW('flip', 'tỷ');
  MO_bg('f');
  // the field arrow: writes on (grows) at "trường", then flips
  const grow = EZ.o3(ev(MO_ARROW_T(), 0.5)), f = MO_field(TT) * grow, L = 560 * Math.abs(f);
  if (L > 60) fieldArrow(540, 440, L, f >= 0 ? 0 : Math.PI, { dark: true, w: 16, head: 44, key: 'mo_fa' });
  ['A', 'B', 'G', 'F', 'C', 'D'].forEach((k) => {
    const [x, y, r] = MO_HOME[k], [dx, dy] = MO_drift(k, TT);
    MO_mol(x + dx, y + dy, r, MO_flipAng(k, (t) => MO_wanderAng(k, t), TT), 1, { key: 'mo_' + k });
  });
  const ang = MO_heroFlipAng(TT);
  heroMol(MO_HX, MO_HY, HR, ang, { dark: true, mood: 'wow' });
  MO_charges(ang, 1, 1);
  if (TT >= tTy) MO_card('hàng tỷ lần / giây', 540, 1215, tTy, 56, -0.02);
};

// ---------------------------------------------------------------------
//  6 · JOSTLE — faster back-and-forth spinning, jitter, bumps (white impact strokes), warming toward terracotta.
//  CAMS.jostle (bridges.js) pushes in 5% to the SLAM; the pause after the voice keeps everything moving, slower.
// ---------------------------------------------------------------------
const MO_JO_KEYS = ['O', 'A', 'B', 'G', 'F', 'C', 'D', 'E', 'H'];
// spin speed (rad/s of the back-and-forth phase), integrated so speed changes never jump
function MO_omega(t) {
  const t0 = ET('jostle'), tc = VW('jostle', 'chen'), te = VL('jostle').t1;
  if (t < tc) return lerp(4.5, 11, seg(t, t0, tc));
  if (t < te) return lerp(11, 14, seg(t, tc, te));
  return lerp(14, 6, EZ.o2(seg(t, te, te + 0.6)));
}
function MO_phase(t) { const t0 = ET('jostle'); let s = 0; for (let u = t0; u < t; u += 0.02) s += MO_omega(u) * Math.min(0.02, t - u); return s; }
// bumps: [time, a, b] — at most 2–3 overlapping (each 0.55 s, every ~0.36 s); slower in the pause
const MO_BUMPS = (() => {
  const pairs = [['O', 'G'], ['A', 'H'], ['F', 'D'], ['O', 'H'], ['C', 'E'], ['B', 'F'], ['O', 'F'], ['G', 'C'], ['E', 'D'], ['A', 'G'], ['O', 'E'], ['H', 'B']];
  const out = [], tS = VW('jostle', 'xoay', 2), te = VL('jostle').t1;
  let t = tS, i = 0;
  while (t < SLAM + 0.5) { out.push([t, ...pairs[i % pairs.length]]); t += t < te ? 0.36 : 0.5; i++; }
  return out;
})();
const MO_bumpCurve = (k) => (k <= 0 || k >= 1 ? 0 : k < 0.4 ? EZ.i2(k / 0.4) : 1 - EZ.o3((k - 0.4) / 0.6));
SCENES.jostle = function () {
  const t0 = ET('jostle'), tChen = VW('jostle', 'chen'), tVa = VW('jostle', 'va'), te = VL('jostle').t1;
  MO_bg('j');
  const ramp = seg(TT, t0 + 0.3, te), u = 0.7 * ramp, Phi = MO_phase(TT);
  const crowd = 0.12 * EZ.io(seg(TT, t0 + 0.5, tChen + 0.5));
  // pre-bump positions
  const P = {};
  for (const k of MO_JO_KEYS) {
    if (k === 'O') { P.O = [MO_HX, MO_HY, HR]; continue; }
    const [x, y, r] = MO_HOME[k], [dx, dy] = MO_drift(k, TT), S = RNG('mo_j', k), jt = (3 + 9 * ramp) * (TT > te ? 0.6 : 1);
    P[k] = [lerp(x, MO_HX, crowd) + dx + Math.sin(TT * 13 + S.r(0, 6)) * jt, lerp(y, MO_HY, crowd) + dy + Math.cos(TT * 11 + S.r(0, 6)) * jt, r];
  }
  // the hero only jitters after the boundary window (it is pinned at (540, 860) for t0 ± 0.5)
  const hj = (2 + 6 * ramp) * seg(TT, t0 + 0.5, t0 + 1.2);
  P.O[0] += Math.sin(TT * 12) * hj; P.O[1] += Math.cos(TT * 10.5) * hj;
  // bumps
  const D = {}, marks = [];
  for (const k of MO_JO_KEYS) D[k] = [0, 0];
  for (const [tb, a, b] of MO_BUMPS) {
    const k = (TT - tb) / 0.55; if (k <= 0 || k >= 1) continue;
    const pa = P[a], pb = P[b], d = dist(pa, pb), ux = (pb[0] - pa[0]) / d, uy = (pb[1] - pa[1]) / d;
    const gap = Math.max(0, d - (pa[2] + pb[2]) * 1.1), m = (gap / 2) * MO_bumpCurve(k), wa = a === 'O' ? 0.6 : 1, wb = b === 'O' ? 0.6 : 1;
    D[a][0] += ux * m * wa; D[a][1] += uy * m * wa; D[b][0] -= ux * m * wb; D[b][1] -= uy * m * wb;
    if (k > 0.36 && k < 0.8) marks.push({ x: (pa[0] + D[a][0] + pb[0] + D[b][0]) / 2, y: (pa[1] + D[a][1] + pb[1] + D[b][1]) / 2, ux, uy, k: (k - 0.36) / 0.44, key: 'mo_k' + tb.toFixed(2) });
  }
  // the molecules: back-and-forth spin, warming
  const amp = lerp(0.5, 1.1, ramp) * (TT > te ? lerp(1, 0.75, seg(TT, te, te + 0.6)) : 1);
  const heroBase = MO_heroFlipAng(t0);
  for (const k of MO_JO_KEYS) {
    if (k === 'O') continue;
    const S = RNG('mo_s', k), [x, y, r] = P[k], base = MO_flipAng(k, (t) => MO_wanderAng(k, t), t0);
    const ang = base + amp * Math.sin(Phi * S.r(0.8, 1.2) + S.r(0, 6));
    const s = k === 'E' || k === 'H' ? popS(t0 + 0.55 + (k === 'H' ? 0.12 : 0)) : 1;
    MO_mol(x + D[k][0], y + D[k][1], r, ang, s, { key: 'mo_' + k, u: u * S.r(0.85, 1.1) });
  }
  // impact marks: short white strokes splaying out sideways from the contact
  for (const mk of marks) {
    const g = EZ.o2(mk.k), nx = -mk.uy, ny = mk.ux;
    for (const [s, a] of [[1, 0], [1, 0.5], [1, -0.5], [-1, 0], [-1, 0.5], [-1, -0.5]]) {
      const dx = (nx * Math.cos(a) - ny * Math.sin(a)) * s, dy = (ny * Math.cos(a) + nx * Math.sin(a)) * s;
      const r0 = 26 + 24 * g, r1 = r0 + 38 * (1 - mk.k * 0.5);
      ink([[mk.x + dx * r0, mk.y + dy * r0], [mk.x + dx * r1, mk.y + dy * r1]], { w: 8, color: C.white, key: mk.key + s + a, amt: 0.5 });
    }
  }
  // the hero: spins too (a little less), heat glow rising, pulsing in the pause
  const hAmp = amp * 0.8 * seg(TT, t0 + 0.3, t0 + 1.0);
  const hang = heroBase + hAmp * Math.sin(Phi + 0.4);
  const heat = TT < te ? lerp(0.05, 0.75, ramp) : 0.75 + 0.2 * Math.sin((TT - te) * 7);
  heroMol(P.O[0] + D.O[0], P.O[1] + D.O[1], HR, hang, { dark: true, mood: 'wow', heat });
  if (TT >= tChen) MO_card('chen lấn', 285, 455, tChen, 58, -0.04);
  if (TT >= tVa) MO_card('va nhau!', 790, 455, tVa, 58, 0.04);
};
