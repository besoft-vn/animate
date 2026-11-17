// =====================================================================
//  SCENES — heat, depth, table (beats 7–9). Paper world, time TT on 2s.
//  heat  : hard cut (SLAM) to a big warm rice ball (540,900,300), steam, the hero glowing on top, a thermometer rising;
//          tag "rung lắc = nhiệt" finished on the first frame. Settles into a clean warm disc for the bridge.
//  depth : the rice ball cut open (disc 540,900,300): microwaves stop in the outer ring (≈ 1 cm), the core stays cold,
//          then the warm front creeps inward with inward ink arrows until the whole disc is warm.
//  table : top-down cavity: the turntable plate (540,900,300) with the bowl off-centre; fixed yellow strong spots and
//          cool gaps; on "đĩa xoay" the plate turns, the bowl warms each time it crosses a spot.
//  Colour: terracotta = hero + heat, yellow COL.wave = microwaves/field only, COL.cold = cold.
// =====================================================================
const HT_CX = 540, HT_CY = 900, HT_R = 300;

// ---- a thermometer whose reading sits ABOVE the tube (so it never runs into the rice)
function HT_thermo(x, y, val, o = {}) {
  const hgt = o.h ?? 280, u = clamp(val / 90), key = o.key || 'htth';
  paint(rrectPts(x - 24, y - hgt, 48, hgt + 20, 24), { fill: '#fffaf0', w: 3, key: key + 'b' });
  for (let i = 1; i < 6; i++) ink([[x + 10, y - i * hgt / 6], [x + 24, y - i * hgt / 6]], { w: 2.4, key: key + 'tk' + i, amt: 0.5 });
  paint(ellipsePts(x, y + 28, 40, 40, 0, 30), { fill: tempCol(u, false), w: 3, key: key + 'bulb', tex: [{ k: 'cross', c: 'rgba(0,0,0,0.25)', al: 0.4, gap: 5 }] });
  ink([[x, y + 10], [x, y - 20 - (hgt - 50) * u]], { w: 18, color: tempCol(u, false), key: key + 'col', amt: 0.6 });
  const s = Math.round(val) + '°C', sz = o.size ?? 64;
  handText(s, x - handW(s, sz) / 2, y - hgt - 26, sz, C.ink, { key: key + 't' });
}
// ---- one big rice grain (an elongated outline), fill by temperature u (0 cold .. 1 hot) or plain rice
function HT_grain(x, y, a, key, o = {}) {
  const P = ellipsePts(x, y, o.rx ?? 34, o.ry ?? 15, a, 18);
  paint(P, { fill: o.fill || COL.rice, key, w: 2.6, tex: o.tex || [{ k: 'hatch', a: 0.8, gap: 4, al: 0.3 }] });
}
// ---- a small ink arrow from a to b (head at b)
function HT_arrow(a, b, key, o = {}) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), h = o.head ?? 18, w = o.w ?? 5;
  const fr = clamp(o.frac ?? 1); if (fr <= 0) return;
  const tip = [lerp(a[0], b[0], fr), lerp(a[1], b[1], fr)];
  ink([a, tip], { w, key: key + 's', color: o.color, amt: 0.8 });
  ink([[tip[0] - Math.cos(ang - 0.5) * h, tip[1] - Math.sin(ang - 0.5) * h], tip, [tip[0] - Math.cos(ang + 0.5) * h, tip[1] - Math.sin(ang + 0.5) * h]], { w, key: key + 'h', color: o.color, amt: 0.6 });
}
// ---- a soft hatched shadow under a round object
function HT_shadow(x, y, r, key) {
  paint(ellipsePts(x + r * 0.07, y + r * 0.1, r * 1.0, r * 1.0, 0, 48), { fill: 'rgba(58,36,23,0.25)', line: false, key, tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
}
const HT_GRAINS = [[-150, -60, 0.4], [-40, -170, -0.3], [110, -110, 0.9], [190, 40, -0.6], [60, 60, 0.2], [-110, 110, -1.1], [-210, 10, 1.3], [20, 200, 0.7], [160, 170, -0.2]];

// =====================================================================
//  7 HEAT — "Sự rung lắc hỗn loạn ấy chính là nhiệt."  (starts on the SLAM: complete on its first frame)
// =====================================================================
SCENES.heat = function () {
  paperSheet('htp', { ruled: false });
  const t0 = ET('heat'), tEnd = EE('heat'), tRung = VW('heat', 'rung'), tHeat = VW('heat', 'nhiệt');
  const settle = EZ.io(seg(TT, tEnd - 0.75, tEnd - 0.5));          // 0 -> 1: the busy mound -> a clean warm disc
  const busy = 1 - settle;
  const bloom = 0.45 + 0.55 * EZ.o2(seg(TT, t0, t0 + 1.6));        // warm hatching already there on frame 1, then spreads
  const shake = 0.35 + 0.65 * ev(tRung - 0.1, 0.4);                // the jiggle grows on "rung"
  // the rice ball: shadow, rice, shading, blooming terracotta hatching
  HT_shadow(HT_CX + 18, HT_CY + 22, HT_R, 'htsh');
  const rd = (px, py) => Math.hypot(px - HT_CX, py - HT_CY) / HT_R;
  paint(ellipsePts(HT_CX, HT_CY, HT_R, HT_R, 0, 72), {
    fill: COL.rice, key: 'htball', w: 5,
    tex: [
      { k: 'pencil', c: '#e6dcc4', al: 0.6, per: 70 },
      { k: 'hatch', a: 0.8, gap: 6, al: 0.35, dens: (px, py) => clamp((px - HT_CX + py - HT_CY) / HT_R * 0.8 + 0.1) },
      { k: 'hatch', a: -0.7, gap: 6, c: C.terra, al: 0.75, w: 2, dens: (px, py) => busy * clamp(bloom * 1.5 - rd(px, py) * 0.6) },
      { k: 'hatch', a: 0.75, gap: 8, c: C.orangeD, al: 0.5, w: 1.6, dens: (px, py) => busy * clamp(bloom * 1.3 - 0.35 - rd(px, py) * 0.5) },
    ],
  });
  // the settled disc: a clean warm face (the bridge object, terracotta)
  if (settle > 0) { ctx.save(); ctx.globalAlpha = settle; paint(ellipsePts(HT_CX, HT_CY, HT_R, HT_R, 0, 72), { fill: '#eeb596', key: 'htdisc', w: 5, tex: [{ k: 'hatch', a: 0.8, gap: 7, c: C.orangeD, al: 0.35 }] }); ctx.restore(); }
  // big rice grains, jiggling (the jostling IS the heat)
  if (busy > 0.02) {
    ctx.save(); ctx.globalAlpha = busy;
    HT_GRAINS.forEach(([dx, dy, a], i) => {
      const R = RNG('htgj', i, B), k = 7 * shake;
      HT_grain(HT_CX + dx + R.n(k), HT_CY + dy + 40 + R.n(k), a + R.n(0.12 * shake), 'htg' + i, { fill: '#f9e3d2', tex: [{ k: 'hatch', a: 0.8, gap: 4, c: C.terra, al: 0.45 }] });
    });
    // little jiggle ticks beside a few grains (motion marks, ink)
    for (let i = 0; i < 3; i++) {
      const [dx, dy] = HT_GRAINS[i * 3 + 1], on = (B + i * 2) % 6 < 3;
      if (on) for (const s of [-1, 1]) ink([[HT_CX + dx + s * 40, HT_CY + dy + 30], [HT_CX + dx + s * 52, HT_CY + dy + 50]], { w: 3.4, key: 'htmk' + i + s, amt: 0.6 });
    }
    ctx.restore();
  }
  // steam rising off the top (terracotta: it is heat)
  const st = busy * (0.75 + 0.25 * Math.sin(TT * 2.2));
  if (st > 0.05) { steam(395, 650, { n: 2, amt: st, spread: 34, key: 'htstL', w: 7 }); steam(690, 650, { n: 2, amt: st, spread: 34, key: 'htstR', w: 7 }); }
  // the hero sits on top, glowing, jiggling happily; sinks into the disc as it settles
  const hs = 1 - EZ.i2(seg(TT, tEnd - 0.85, tEnd - 0.55));
  if (hs > 0.02) {
    const R = RNG('hthj', B), j = 5 * shake;
    const hx = HT_CX + R.n(j), hy = 610 + R.n(j) + (1 - hs) * 60;
    heroMol(hx, hy, HR * hs, -Math.PI / 2 + Math.sin(TT * 9) * 0.25 * shake, { heat: 1, mood: 'happy', key: 'hthero' });
  }
  // the thermometer: cold -> hot, 70 on "nhiệt"
  const tv = lerp(5, 70, EZ.io(seg(TT, t0 + 0.1, tHeat)));
  HT_thermo(130, 1150, tv, { h: 300, key: 'htth' });
  // the tag, finished on the first frame (hard cut), a small nod on "nhiệt"
  const tg = 'rung lắc = nhiệt', nod = 1 + 0.08 * Math.sin(Math.PI * seg(TT, tHeat, tHeat + 0.4));
  const f = () => inkCard(tg, 70 + (handW(tg, 80) + 72) / 2, 330, 80, { rot: -0.04, s: nod });
  if (DEFER) DEFER.push(f); else f();
};

// =====================================================================
//  8 DEPTH — "Vi sóng chỉ thấm vào lớp ngoài chừng một xăng-ti-mét, phần lõi nóng dần nhờ nhiệt lan vào."
// =====================================================================
const HT_RING = 60;                                                 // ≈ 1/5 of the radius: "≈ 1 cm"
function HT_front() {                                               // the radius of the still-cold core
  const tOut = VW('depth', 'lớp'), tCore = VW('depth', 'lõi'), tEnd = EE('depth');
  const ring = HT_R - HT_RING * EZ.io(seg(TT, tOut - 0.1, tOut + 0.7));
  return lerp(ring, 0, EZ.i2(seg(TT, tCore - 0.1, tEnd - 0.6)) ** 0.8);
}
SCENES.depth = function () {
  paperSheet('dpp', { ruled: false });
  const tWave = VW('depth', 'vi'), tCm = VW('depth', 'chừng'), tCore = VW('depth', 'lõi');
  const tLan = VW('depth', 'lan');
  const rf = HT_front();
  // the cut-open rice ball: shadow, the warm outside, the cold core on top
  HT_shadow(HT_CX + 18, HT_CY + 22, HT_R, 'dpsh');
  paint(ellipsePts(HT_CX, HT_CY, HT_R, HT_R, 0, 72), { fill: '#f1c3a8', key: 'dpwarm', w: 5, tex: [{ k: 'hatch', a: -0.7, gap: 6, c: C.terra, al: 0.7, w: 2 }, { k: 'pencil', c: '#f7dccb', al: 0.5, per: 80 }] });
  if (rf > 4) {
    const coreLine = rf > HT_R - 6 ? C.ink : 'rgba(58,36,23,0.55)';
    paint(ellipsePts(HT_CX, HT_CY, rf, rf, 0, 72), { fill: '#dbecf0', key: 'dpcold', w: rf > HT_R - 6 ? 5 : 2.6, line: coreLine, tex: [{ k: 'hatch', a: 0.75, gap: 7, c: COL.cold, al: 0.75, w: 1.8 }, { k: 'pencil', c: '#c3dfe7', al: 0.5, per: 90 }] });
  }
  // the crust: a second outline just inside the edge, so it reads as the cut face of a ball
  ink(ellipsePts(HT_CX, HT_CY, HT_R - 10, HT_R - 10, 0, 72), { closed: true, w: 2, key: 'dpcrust', color: 'rgba(58,36,23,0.5)' });
  // rice grains on the cut face, coloured by where the warmth has reached; warm ones jiggle
  HT_GRAINS.forEach(([dx, dy, a], i) => {
    const d = Math.hypot(dx, dy * 1.0 + 40), u = clamp((d - rf + 20) / 40), R = RNG('dpgj', i, B), k = 5 * u;
    const x = HT_CX + dx * 1.12 + R.n(k), y = HT_CY + dy * 1.12 + 40 + R.n(k);
    HT_grain(x, y, a + R.n(0.1 * u), 'dpg' + i, { fill: u > 0.5 ? '#f9e3d2' : '#eef6f8', tex: [{ k: 'hatch', a: 0.8, gap: 4, c: tempCol(u, false), al: 0.7 }] });
  });
  // microwaves: small yellow waves come in from outside and stop inside the outer ring (never reach the core)
  const dirs = [Math.PI * 1.06, -0.12, Math.PI * 0.62, Math.PI * 0.2];
  dirs.forEach((ang, i) => {
    const per = 1.5, s0 = tWave + 0.05 + i * 0.37, tStop = tLan + 0.2;
    if (TT < s0 || TT > tStop + per) return;
    const ph = mod(TT - s0, per), cyc = Math.floor((TT - s0) / per), startC = s0 + cyc * per;
    if (startC > tStop) return;
    const r0 = 450, r1 = HT_R - 30, ca = Math.cos(ang), sa = Math.sin(ang);
    const frac = EZ.o2(seg(ph, 0, 0.6)), al = 1 - seg(ph, 1.0, 1.4);
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha = al;
    mwave(HT_CX + ca * r0, HT_CY + sa * r0, HT_CX + ca * r1, HT_CY + sa * r1, { lam: 58, amp: 19, w: 8, frac, phase: TT * 80, key: 'dpw' + i });
    if (frac > 0.97) {   // absorbed: a warm splash in the ring
      const k = seg(ph, 0.6, 1.2);
      ink(ellipsePts(HT_CX + ca * r1, HT_CY + sa * r1, 18 + 26 * k, 18 + 26 * k, 0, 20), { closed: true, w: 5, color: `rgba(217,119,87,${0.9 * (1 - k)})`, key: 'dpsp' + i });
    }
    ctx.restore();
  });
  // dimension "≈ 1 cm" across the ring at the top
  const dm = ev(tCm - 0.15, 0.4) * (1 - ev(tCore - 0.2, 0.4));
  if (dm > 0) {
    ctx.save(); ctx.globalAlpha = dm;
    const xa = HT_CX, ya = HT_CY - HT_R, yb = HT_CY - HT_R + HT_RING;
    ink([[xa - 32, ya], [xa + 32, ya]], { w: 3.4, key: 'dmt1' }); ink([[xa - 32, yb], [xa + 32, yb]], { w: 3.4, key: 'dmt2' });
    HT_arrow([xa, (ya + yb) / 2], [xa, ya + 3], 'dma1', { head: 14, w: 4.5, frac: ev(tCm - 0.15, 0.3) });
    HT_arrow([xa, (ya + yb) / 2], [xa, yb - 3], 'dma2', { head: 14, w: 4.5, frac: ev(tCm - 0.15, 0.3) });
    ctx.restore();
    const f = () => inkCard('≈ 1 cm', HT_CX, 525, 60, { rot: -0.03, frac: ev(tCm, 0.5), s: popS(tCm - 0.1) * (1 - ev(tCore - 0.2, 0.4)) });
    if (DEFER) DEFER.push(f); else f();
  }
  // the warm front creeps in: ink arrows riding just outside it, pointing to the core
  const ar = ev(tCore, 0.3) * clamp((rf - 20) / 40);
  if (ar > 0) {
    const big = 1 + 0.25 * Math.sin(Math.PI * seg(TT, tLan - 0.1, tLan + 0.4));
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + i * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a), ro = rf + 55 * big, ri = Math.max(14, rf - 25);
      ctx.save(); ctx.globalAlpha = ar;
      HT_arrow([HT_CX + ca * ro, HT_CY + sa * ro], [HT_CX + ca * ri, HT_CY + sa * ri], 'dpin' + i, { head: 22, w: 6.5, frac: ev(tCore + i * 0.08, 0.35) });
      ctx.restore();
    }
  }
};

// =====================================================================
//  9 TABLE — "Sóng có chỗ mạnh chỗ yếu, nên đĩa xoay đưa món ăn đi khắp lượt."  (top-down cavity)
// =====================================================================
const HT_PATH = 170, HT_BOWL_R = 95;
const HT_ANG = (deg) => deg * Math.PI / 180;
const HT_SPOTS = [[HT_CX + HT_PATH * Math.cos(HT_ANG(150)), HT_CY + HT_PATH * Math.sin(HT_ANG(150)), 80],
  [HT_CX + HT_PATH * Math.cos(HT_ANG(270)), HT_CY + HT_PATH * Math.sin(HT_ANG(270)), 78],
  [HT_CX + HT_PATH * Math.cos(HT_ANG(30)), HT_CY + HT_PATH * Math.sin(HT_ANG(30)), 82],
  [262, 640, 66]];
const HT_GAPS = [[HT_CX + HT_PATH * Math.cos(HT_ANG(210)), HT_CY + HT_PATH * Math.sin(HT_ANG(210))],
  [HT_CX + HT_PATH * Math.cos(HT_ANG(330)), HT_CY + HT_PATH * Math.sin(HT_ANG(330))]];
function HT_plateAng(t) { return HT_ANG(90) + TAU * EZ.io(seg(t, VW('table', 'đĩa') - 0.05, EE('table') - 0.15)); }
function HT_bowlAt(t) { const a = HT_plateAng(t); return [HT_CX + Math.cos(a) * HT_PATH, HT_CY + Math.sin(a) * HT_PATH]; }
function HT_inSpot(p) { let k = 0; for (const [x, y, r] of HT_SPOTS) k = Math.max(k, clamp((r + 20 - Math.hypot(p[0] - x, p[1] - y)) / 60)); return k; }
function HT_bowlHeat() {   // accumulates while the bowl sits in a strong spot (deterministic: re-integrated each frame)
  const t0 = VW('table', 'đĩa') - 0.05; let h = 0;
  for (let t = t0; t < TT; t += 1 / 24) h += HT_inSpot(HT_bowlAt(t)) * 1.7 / 24;
  return clamp(h);
}
SCENES.table = function () {
  paperSheet('tbp', { ruled: false });
  const tStrong = VW('table', 'mạnh'), tWeak = VW('table', 'yếu'), tTurn = VW('table', 'đĩa'), tSpin = VW('table', 'xoay');
  // the cavity from above: the walls slope down to a square metal floor
  const O = [130, 490, 950, 1310], I = [195, 555, 885, 1245];
  paint(box(O[0], O[1], O[2] - O[0], O[3] - O[1]), { fill: COL.metalD, key: 'tbwall', w: 4.5, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.45 }] });
  paint(box(I[0], I[1], I[2] - I[0], I[3] - I[1]), { fill: COL.metal, key: 'tbfloor', w: 3.5, tex: [{ k: 'hatch', a: -0.7, gap: 8, al: 0.25 }, { k: 'pencil', c: '#e2ddd1', al: 0.5, per: 120 }] });
  for (const [a, b] of [[[O[0], O[1]], [I[0], I[1]]], [[O[2], O[1]], [I[2], I[1]]], [[O[0], O[3]], [I[0], I[3]]], [[O[2], O[3]], [I[2], I[3]]]]) ink([a, b], { w: 3, key: 'tbc' + a[0] + a[1] });
  // the turntable plate (the bridge disc), turning on "đĩa xoay"
  const pa = HT_plateAng(TT);
  HT_shadow(HT_CX + 10, HT_CY + 12, HT_R, 'tbpsh');
  paint(ellipsePts(HT_CX, HT_CY, HT_R, HT_R, 0, 72), { fill: '#eef3f2', key: 'tbplate', w: 4.5, tex: [{ k: 'pencil', c: '#cfdcdb', al: 0.6, per: 70 }, { k: 'hatch', a: 0.8, gap: 7, al: 0.25, dens: (px, py) => clamp((px - HT_CX + py - HT_CY) / HT_R * 0.7 + 0.2) }] });
  ink(ellipsePts(HT_CX, HT_CY, HT_R - 26, HT_R - 26, 0, 72), { closed: true, w: 2.2, key: 'tbprim', color: 'rgba(58,36,23,0.55)' });
  paint(ellipsePts(HT_CX, HT_CY, 26, 26, 0, 20), { fill: '#d8d0c0', key: 'tbhub', w: 3 });
  for (let i = 0; i < 3; i++) {   // three notches on the rim: they ride round with the plate
    const a = pa + i * TAU / 3 + 0.5, r0 = HT_R - 26, r1 = HT_R - 6;
    ink([[HT_CX + Math.cos(a) * r0, HT_CY + Math.sin(a) * r0], [HT_CX + Math.cos(a) * r1, HT_CY + Math.sin(a) * r1]], { w: 5, key: 'tbn' + i });
  }
  // the rice bowl from above, off-centre; its rice warms each time it crosses a strong spot
  const [bx, by] = HT_bowlAt(TT), heat = HT_bowlHeat(), inside = TT > tTurn ? HT_inSpot([bx, by]) : 0;
  HT_shadow(bx + 6, by + 8, HT_BOWL_R, 'tbbsh');
  paint(ellipsePts(bx, by, HT_BOWL_R, HT_BOWL_R, 0, 40), { fill: '#f2ede2', key: 'tbbowl', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.35, dens: (px, py) => clamp((px - bx + py - by) / HT_BOWL_R) }] });
  ink(ellipsePts(bx, by, HT_BOWL_R - 10, HT_BOWL_R - 10, 0, 40), { closed: true, w: 4, color: COL.cold, key: 'tbbst' });
  paint(ellipsePts(bx, by, HT_BOWL_R * 0.74, HT_BOWL_R * 0.74, 0, 36), { fill: heat > 0.02 ? `rgb(${Math.round(lerp(251, 240, heat))},${Math.round(lerp(246, 190, heat))},${Math.round(lerp(234, 160, heat))})` : COL.rice, key: 'tbrice', w: 3, tex: [{ k: 'hatch', a: -0.7, gap: 5, c: tempCol(heat, false), al: 0.85, w: 1.8 }, { k: 'pencil', c: '#e6dcc4', al: 0.5, per: 60 }] });
  if (inside > 0.05) ink(ellipsePts(bx, by, HT_BOWL_R + 16, HT_BOWL_R + 16, 0, 40), { closed: true, w: 12 * inside, color: `rgba(217,119,87,${0.6 * inside})`, key: 'tbbgl' });
  if (heat > 0.3) steam(bx, by - 30, { n: 2, amt: clamp((heat - 0.3) * 1.6), spread: 26, key: 'tbst', w: 5 });
  // the strong spots: fixed in the cavity (they don't turn), breathing; pulse in on "mạnh"
  HT_SPOTS.forEach(([x, y, r], i) => {
    const s = popS(tStrong - 0.25 + i * 0.12); if (s <= 0) return;
    const rr = r * s * (1 + 0.06 * Math.sin(TT * 5 + i * 1.7));
    paint(ellipsePts(x, y, rr, rr, 0, 36), { fill: 'rgba(240,197,90,0.38)', line: COL.waveD, w: 3, lineAl: 0.7, key: 'tbsp' + i, tex: [{ k: 'hatch', a: 0.8, gap: 7, c: COL.waveD, al: 0.35, dens: (px, py) => clamp(1 - Math.hypot(px - x, py - y) / rr * 0.9) }] });
    ink(ellipsePts(x, y, rr * 0.45, rr * 0.45, 0, 24), { closed: true, w: 3, color: COL.waveD, key: 'tbspc' + i, alpha: 0.6 });
  });
  // the cool gaps: dashed cold rings, marked on "yếu"
  HT_GAPS.forEach(([x, y], i) => {
    const s = popS(tWeak - 0.1 + i * 0.15); if (s <= 0) return;
    const rr = 52 * s * (1 + 0.04 * Math.sin(TT * 4 + i));
    ctx.save(); ctx.setLineDash([12, 10]);
    ink(ellipsePts(x, y, rr, rr, 0, 32), { closed: true, w: 4.5, color: COL.cold, key: 'tbgap' + i });
    ctx.restore();
  });
  // the turning arrow on the rim, from "xoay"
  const ta = ev(tSpin - 0.1, 0.4);
  if (ta > 0) {
    const a0 = pa - 0.9, a1 = pa - 0.25, rr = HT_R + 28;
    const P = arcPts(HT_CX, HT_CY, rr, a0, a1, 14);
    ink(P, { w: 6, key: 'tbrot', frac: ta, amt: 0.8 });
    if (ta >= 1) HT_arrow(P[P.length - 3], P[P.length - 1], 'tbroth', { head: 20, w: 6 });
  }
  // the cards: "chỗ mạnh" pointing at the corner spot, "chỗ yếu" at a gap
  const cS = ev(tStrong - 0.1, 0.5), cW = ev(tWeak - 0.05, 0.5);
  if (cS > 0) ink([[300, 470], [HT_SPOTS[3][0] + 10, HT_SPOTS[3][1] - HT_SPOTS[3][2] + 8]], { w: 4, key: 'tbls', frac: cS });
  if (cW > 0) ink([[770, 470], [HT_GAPS[1][0] + 18, HT_GAPS[1][1] - 46]], { w: 4, key: 'tblw', frac: cW });
  const f = () => {
    if (cS > 0) inkCard('chỗ mạnh', 300, 440, 58, { rot: -0.04, frac: cS, s: popS(tStrong - 0.15) });
    if (cW > 0) inkCard('chỗ yếu', 770, 440, 58, { rot: 0.03, frac: cW, s: popS(tWeak - 0.1) });
  };
  if (DEFER) DEFER.push(f); else f();
};
