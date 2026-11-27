// =====================================================================
//  PROPS — cầu vồng (director's shared helpers; scene agents use them, never edit them)
//  Sketchbook pens: gline (ink), gpencil (graphite), scribbleFill (colour), handLetter (lettering, face 'hand' ONLY:
//  HAND = Pangolin, Vietnamese-safe).
//  Colour (one colour = one meaning): TERRACOTTA = the hero only · SPECTRUM (SPEC: red, orange, yellow, green, blue,
//  violet) = the colours OF LIGHT only (rays leaving a drop, the rainbow bands, the strands inside a sunbeam) ·
//  PALE YELLOW (COL.sun / COL.beam) = white sunlight (the sun disc, the incoming white beam) ·
//  GREY-BLUE (COL.drop / COL.dropL) = water (raindrops, the rain curtain) — never a spectrum blue ·
//  graphite = ground, cloud, angle arcs, guide lines, arrows · ink = outlines, lettering.
//  RAINBOW ORDER (primary bow): RED on the OUTSIDE (top/outer edge), VIOLET on the INSIDE. Never reverse it.
//  LIGHT DIRECTION: the sun is BEHIND the viewer. Side views: sunlight travels LEFT -> RIGHT (sun at the left, low),
//  coloured light comes back RIGHT -> LEFT and DOWN to the eye. Back views: the sun is behind the camera; the hero's
//  shadow points AWAY from us (up the screen) and the rainbow is centred on the shadow of the hero's head.
// =====================================================================
// ---- a short hand-lettered label (Vietnamese-safe), centred by default
const label = (str, x, y, size = 56, o = {}) => handLetter(str, x, y, size, { face: 'hand', align: o.align ?? 'center', col: o.col ?? SK.ink, reveal: o.reveal ?? 1, key: o.key ?? ('lb' + str) });
// ---- the scene tag (top-left, tape + red underline), written on at the era start
function viTagDraw(str, now) {
  const size = 66, w = letterW(str, size, 'hand'), x = 84, y = 340;
  tapeStrip(x + w / 2, y - size * 0.3, w + 70, -0.03, 'tagtape' + str, size * 1.15);
  const [x0, x1] = handLetter(str, x, y, size, { face: 'hand', align: 'left', reveal: now ? 1 : ev(E0 + 0.1, 0.3), key: 'tag' + str, jit: 0.7 });
  underline(x0, x1, y + 20, { col: SK.red, w: 5, key: 'tagu' + str, part: now ? 1 : ev(E0 + 0.4, 0.2) });
}
const viTag = (str) => { const f = () => viTagDraw(str, false); if (DEFER) DEFER.push(f); else f(); };
// a tag already written (for "payoff", which opens on the hard cut: complete on its first frame)
const viTagNow = (str) => { const f = () => viTagDraw(str, true); if (DEFER) DEFER.push(f); else f(); };
// captions: the kit's pageCaption(lines, [[i, 'word']], { at, size }) — hand face (Pangolin). Use size 62.
// ≤ ~22 characters per line, ≤ 2 lines, at y ≈ 1330–1440. pageCaption(..., { at: -10 }) = already written (payoff).
// a group drawn at alpha a (multiplies every pen inside)
function alphaDo(a, f) { if (a <= 0.005) return; ctx.save(); ctx.globalAlpha *= clamp(a); f(); ctx.restore(); }

// =====================================================================
//  THE HERO (terracotta doodle). heroGiot = front view (doodleHero; eyes, mood, look, arms, legs);
//  heroBack = seen from BEHIND (no face: body + crown asterisk + a hint of the back), for the back-view world.
// =====================================================================
const heroGiot = (x, y, r = HR, o = {}) => doodleHero(x, y, r, o);
function heroBack(x, y, r = HR, o = {}) {
  const key = o.key ?? 'heroB', lw = Math.max(3, r * 0.065);
  SPARK_AT = toScreen(x, y);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  if (o.legs !== false) for (const s of [-1, 1]) {
    const st = o.step ?? 0, hip = [s * r * 0.32, r * 0.85], foot = [s * r * 0.36 + s * st * r * 0.22, r * 1.42];
    gline([hip, foot], { w: lw, key: key + 'leg' + s, amp: 0.8, second: false, step: 8 });
  }
  if (o.arms) [-1, 1].forEach((s, i) => {
    const ang = o.arms[i]; if (ang == null) return;
    const sh = [s * r * 0.9, r * 0.15], L = r * 0.85, hd = [sh[0] + s * L * Math.cos(ang), sh[1] - L * Math.sin(ang)];
    gline([sh, hd], { w: lw, key: key + 'arm' + s, amp: 0.8, second: false, step: 8 });
  });
  ctx.scale(o.sx ?? 1, o.sy ?? 1);
  const body = loopPts(0, 0, r, r, 0, 0, 40);
  gfill(body, SK.terra, { off: [r * 0.06, r * 0.05], key: key + 'f' });
  litHatch(body, { ang: -0.85, gap: Math.max(5, r * 0.08), col: SK.terraD, w: Math.max(1.6, r * 0.03), a: 0.95, key: key + 'h' });
  gline(loopPts(0, 0, r, r, 0.08), { w: lw, key: key + 'o' });
  for (let i = 0; i < 8; i++) {                                                // the crown asterisk, seen from behind (higher)
    const an = i / 8 * TAU + 0.2, r0 = r * 0.04, r1 = r * 0.19, cy = -r * 0.62;
    gline([[Math.cos(an) * r0, cy + Math.sin(an) * r0], [Math.cos(an) * r1, cy + Math.sin(an) * r1]], { w: r * 0.065, col: SK.cream, key: key + 'a' + i, amp: 0.4, second: false, step: 6 });
  }
  gpencil([[-r * 0.35, r * 0.5], [0, r * 0.62], [r * 0.35, r * 0.5]], { w: 3, key: key + 'bk', a: 0.6 });   // a back seam
  ctx.restore();
}

// =====================================================================
//  LIGHT
// =====================================================================
// SPEC: the six drawn colours, red -> violet. n = the refractive index USED FOR DRAWING (red 1.331 is real; the spread
// to violet is EXAGGERATED ~5x so the fan is visible: real violet is 1.343 / ~40.6°). dev = the exit angle the drawing
// gives (degrees below the reversed sunlight): red ≈ 42.4°, violet ≈ 32.3° (drawn). Say "vẽ phóng đại" when it matters.
const SPEC = [
  { name: 'đỏ',   col: '#e0483a', n: 1.331 },
  { name: 'cam',  col: '#ef8a2f', n: 1.345 },
  { name: 'vàng', col: '#efc52a', n: 1.360 },
  { name: 'lục',  col: '#4f9d5d', n: 1.375 },
  { name: 'lam',  col: '#3d6fd1', n: 1.390 },
  { name: 'tím',  col: '#7a4bb5', n: 1.405 },
];
const SPEC_RED = SPEC[0].col, SPEC_VIOLET = SPEC[5].col;
// ---- the Descartes ray through a round drop (centre cx, cy, radius R), sunlight moving +x (left -> right).
// h = entry height as a fraction of R (negative = above the centre; default -0.86 = the rainbow ray).
// Returns { P0 (entry, upper-left), P1 (reflection, on the back/right), P2 (exit, bottom), d1 (inside, after entry),
// d3 (unit direction after exit: DOWN-LEFT), dev (deg) }. Verified: red exits at ≈ 42.4° below the horizontal going left.
function dropTrace(cx, cy, R, n, h = -0.86) {
  const refr = (d, N, n1, n2) => { const r = n1 / n2, c = -(N[0] * d[0] + N[1] * d[1]), k = 1 - r * r * (1 - c * c); return [r * d[0] + (r * c - Math.sqrt(k)) * N[0], r * d[1] + (r * c - Math.sqrt(k)) * N[1]]; };
  const far = (p, d) => { const b = p[0] * d[0] + p[1] * d[1], c = p[0] * p[0] + p[1] * p[1] - 1, t = -b + Math.sqrt(Math.max(0, b * b - c)); return [p[0] + t * d[0], p[1] + t * d[1]]; };
  const P0 = [-Math.sqrt(1 - h * h), h];
  const d1 = refr([1, 0], P0, 1, n);
  const P1 = far(P0, d1);
  const dn = d1[0] * P1[0] + d1[1] * P1[1], d2 = [d1[0] - 2 * dn * P1[0], d1[1] - 2 * dn * P1[1]];
  const P2 = far(P1, d2);
  const d3 = refr(d2, [-P2[0], -P2[1]], n, 1);
  const S = (p) => [cx + p[0] * R, cy + p[1] * R];
  return { P0: S(P0), P1: S(P1), P2: S(P2), d1, d2, d3, dev: Math.atan2(d3[1], -d3[0]) * 180 / Math.PI };
}
// ---- a RAINDROP (a round water drop, as light sees it): pale grey-blue wash, grey-blue ink outline, a small
// highlight. Big drops for close-ups (R 200+), small (r ≥ 18) in a curtain. o: { key, a, part (draws on) }
function raindrop(x, y, r, o = {}) {
  const key = o.key || ('rd' + Math.round(x) + '_' + Math.round(y)), a = o.a ?? 1, part = o.part ?? 1;
  alphaDo(a, () => {
    const P = loopPts(x, y, r, r, 0.04, -2.2, Math.max(24, Math.round(r / 3)));
    if (part > 0.6) gfill(P, COL.dropL, { a: 0.7 * seg(part, 0.6, 1), key: key + 'f' });
    gline(P, { w: r > 100 ? 6 : 4, col: COL.drop, key: key + 'o', part });
    if (part > 0.9 && r > 24) gline(arcPts(x - r * 0.35, y - r * 0.35, r * 0.35, -2.6, -1.6, 8), { w: r > 100 ? 6 : 3, col: SK.sheet, key: key + 'hl', second: false });
  });
}
// ---- a ray of light along P (polyline), colour col, drawn on by `part`; a small arrow head at the end shows the
// direction of travel (light moves from P[0] to P[last]). o: { w, a, key, head (true), dash }
function lightRay(P, col, o = {}) {
  const part = clamp(o.part ?? 1); if (part <= 0.01) return;
  const key = o.key || 'ray', w = o.w ?? 7, a = o.a ?? 1;
  const Q = writeOn(P, part); if (!Q || Q.length < 2) return;
  alphaDo(a, () => {
    gline(Q, { w, col, key: key + 'l', second: false, amp: 0.5 });
    if (o.head !== false && part > 0.25) {
      const [x1, y1] = Q[Q.length - 1], [x0, y0] = Q[Q.length - 2];
      const L = Math.hypot(x1 - x0, y1 - y0) || 1, ux = (x1 - x0) / L, uy = (y1 - y0) / L, s = w * 3.2;
      gline([[x1 - ux * s - uy * s * 0.6, y1 - uy * s + ux * s * 0.6], [x1, y1], [x1 - ux * s + uy * s * 0.6, y1 - uy * s - ux * s * 0.6]], { w: w * 0.85, col, key: key + 'h', second: false, amp: 0.3 });
    }
  });
}
// ---- WHITE SUNLIGHT: a pale-yellow beam (band) along a straight line A -> B, width wd, with an ink edge and a few
// drifting flow ticks (moving A -> B, never still). o: { key, a, part (grows from A), strands (0..1: reveals six
// thin SPEC strands inside the beam — "white is all colours mixed") }
function sunBeam(A, Bp, wd, o = {}) {
  const part = clamp(o.part ?? 1); if (part <= 0.01) return;
  const key = o.key || 'beam', a = o.a ?? 1;
  const L = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]), ux = (Bp[0] - A[0]) / L, uy = (Bp[1] - A[1]) / L, nx = -uy, ny = ux, Lp = L * part;
  const pt = (s, q) => [A[0] + ux * s + nx * q, A[1] + uy * s + ny * q];
  const Pb = [pt(0, -wd / 2), pt(Lp, -wd / 2), pt(Lp, wd / 2), pt(0, wd / 2)];
  alphaDo(a, () => {
    gfill(Pb, COL.beam, { a: 0.85, key: key + 'f', off: [0, 0] });
    gline([Pb[0], Pb[1]], { w: 3, col: COL.sunD, key: key + 'e0', second: false, amp: 0.4 });
    gline([Pb[3], Pb[2]], { w: 3, col: COL.sunD, key: key + 'e1', second: false, amp: 0.4 });
    const st = clamp(o.strands ?? 0);
    if (st > 0.01) SPEC.forEach((c, i) => {
      const q = (i - 2.5) / 6 * wd * 0.8;
      gline([pt(0, q), pt(Lp, q)], { w: Math.max(3, wd / 16), col: c.col, a: st, key: key + 's' + i, second: false, amp: 0.6 });
    });
    for (let i = 0; i < 3; i++) {                                     // flow ticks drifting along the beam
      const s = ((TT * 0.35 + i / 3) % 1) * Lp;
      gline([pt(s, -wd * 0.25), pt(s + 40, -wd * 0.25)], { w: 4, col: SK.sheet, a: 0.9 * (1 - st), key: key + 't' + i, second: false });
    }
  });
}
// ---- THE RAINBOW BAND: six concentric arcs centred (cx, cy), outer radius R, band thickness bw (total),
// from angle a0 to a1 (radians, screen: 0 = right, -PI/2 = up). RED OUTSIDE, VIOLET INSIDE.
// o: { key, a, part (0..1 draws on from a0 to a1), dashed (draw graphite dashes instead of colour: "hidden part") }
function rainbowArc(cx, cy, R, bw, a0 = Math.PI, a1 = TAU, o = {}) {
  const part = clamp(o.part ?? 1); if (part <= 0.01) return;
  const key = o.key || 'rb', a = o.a ?? 1, w = bw / 6;
  const end = a0 + (a1 - a0) * part, n = Math.max(12, Math.round(Math.abs(end - a0) * R / 18));
  alphaDo(a, () => SPEC.forEach((c, i) => {
    const r = R - w * (i + 0.5);
    const P = []; for (let k = 0; k <= n; k++) { const t = a0 + (end - a0) * k / n; P.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); }
    if (o.dashed) { for (let k = 0; k + 1 < P.length; k += 2) gpencil([P[k], P[k + 1]], { w: 3, key: key + 'd' + i + '_' + k, a: 0.6 }); }
    else gline(P, { w: w + 1.5, col: c.col, key: key + i, second: false, amp: 0.35, step: 10 });
  }));
}
// ---- the sun: yellow disc with slowly turning ray ticks. o: { key, a, x, y, r, hot (0..1 stronger rays) }
function sunDisc(x, y, r, o = {}) {
  const key = o.key || 'sun', a = o.a ?? 1, h = clamp(o.hot ?? 0);
  alphaDo(a, () => {
    gfill(loopPts(x, y, r, r, 0), COL.sun, { key: key + 'f' });
    gline(loopPts(x, y, r, r, 0.06), { w: 5, col: SK.ink, key: key + 'o' });
    for (let i = 0; i < 8; i++) {
      const an = i / 8 * TAU + TT * 0.25, r0 = r + 14, r1 = r + 34 + 14 * h + 4 * Math.sin(TT * 3 + i);
      gline([[x + Math.cos(an) * r0, y + Math.sin(an) * r0], [x + Math.cos(an) * r1, y + Math.sin(an) * r1]], { w: 6, col: COL.sunD, key: key + 'r' + i, second: false });
    }
  });
}
// smooth a coarse polygon into a soft lumpy outline (chaikin ×2)
function loopify(P) {
  let Q = P;
  for (let k = 0; k < 2; k++) { const R = []; for (let i = 0; i < Q.length; i++) { const a = Q[i], b = Q[(i + 1) % Q.length]; R.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } Q = R; }
  return Q;
}
// ---- a rain cloud: rounded, graphite-washed. o: { key, a, s (scale), dark (0..1) }; drifts slightly (never still)
function rainCloud(x, y, o = {}) {
  const key = o.key || 'rc', a = o.a ?? 1, s = o.s ?? 1; x += 6 * Math.sin(TT * 0.7);
  const C = loopify([[x - 170 * s, y + 50 * s], [x - 185 * s, y - 10 * s], [x - 110 * s, y - 70 * s], [x - 20 * s, y - 95 * s], [x + 80 * s, y - 80 * s], [x + 170 * s, y - 30 * s], [x + 175 * s, y + 50 * s]]);
  alphaDo(a, () => {
    gfill(C, '#e4e1dc', { key: key + 'f' });
    scribbleFill(C, '#a9a49d', { key: key + 's', gap: 22, w: 6, base: 0.25, a: 0.35 + 0.4 * clamp(o.dark ?? 0.3) });
    gline(C, { w: 5, key: key + 'o', closed: true });
  });
}
// ---- a rain curtain under a cloud: ≤ 7 long faint grey-blue strokes falling (DOWN) between x0 and x1, from y0 to y1.
// KHUNG HÌNH GỌN: never more strokes than this; no specks. o: { key, a, n (≤ 7) }
function rainCurtain(x0, x1, y0, y1, o = {}) {
  const key = o.key || 'rcur', a = o.a ?? 1, n = Math.min(7, o.n ?? 6);
  alphaDo(a, () => { for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + 0.5) / n), L = 70, u = ((TT * 0.9 + hash(key + i) % 97 / 97) % 1), y = lerp(y0, y1 - L, u);
    gline([[x + 6, y], [x - 6, y + L]], { w: 4, col: COL.drop, a: 0.55 * Math.sin(Math.PI * u), key: key + i, second: false });
  } });
}
// ---- the ground: a graphite line across the frame at y (side view / back view horizon), a few grass ticks.
function groundLine(y, o = {}) {
  const key = o.key || 'gnd', a = o.a ?? 1;
  alphaDo(a, () => {
    gline([[-40, y], [1120, y + 4]], { w: 5, key: key + 'l' });
    for (let i = 0; i < 6; i++) { const x = 90 + i * 170 + (hash(key + i) % 40); gpencil([[x, y], [x - 6, y - 16]], { w: 3, key: key + 'g' + i, a: 0.7 }); }
  });
}
// ---- an angle marker: a graphite arc at (x, y) of radius r between angles a0 and a1 (radians), + an optional label
// at the bisector. o: { key, a, part, label, size, col, lr (label radius) }
function angleArc(x, y, r, a0, a1, o = {}) {
  const part = clamp(o.part ?? 1); if (part <= 0.01) return;
  const key = o.key || 'ang', a = o.a ?? 1, end = a0 + (a1 - a0) * part, n = 16;
  const P = []; for (let k = 0; k <= n; k++) { const t = a0 + (end - a0) * k / n; P.push([x + r * Math.cos(t), y + r * Math.sin(t)]); }
  alphaDo(a, () => {
    gpencil(P, { w: 4, key: key + 'a', col: o.col ?? SK.graph });
    if (o.label && part > 0.9) { const m = (a0 + a1) / 2, lr = o.lr ?? r + 50; label(o.label, x + lr * Math.cos(m), y + lr * Math.sin(m) + 18, o.size ?? 52, { key: key + 'lb', col: o.col ?? SK.ink }); }
  });
}
// ---- a dashed graphite guide line A -> B (a "line of sight" / the direction of the sunlight, continued)
function guideLine(A, Bp, o = {}) {
  const key = o.key || 'gl', a = o.a ?? 1, part = clamp(o.part ?? 1), n = Math.max(2, Math.round(Math.hypot(Bp[0] - A[0], Bp[1] - A[1]) / 26));
  alphaDo(a, () => { for (let k = 0; k < n * part; k += 2) gpencil([[lerp(A[0], Bp[0], k / n), lerp(A[1], Bp[1], k / n)], [lerp(A[0], Bp[0], Math.min(1, (k + 1) / n)), lerp(A[1], Bp[1], Math.min(1, (k + 1) / n))]], { w: 3.5, key: key + k, a: 0.75 }); });
}
// ---- a chunky hand-drawn arrow from (x0, y0) to (x1, y1): colour scribble inside an ink outline.
// o: { col (fill), w (shaft width, 40), head (head length, 1.6*w), part (grow 0..1 from the tail), key, a }
function bigArrow(x0, y0, x1, y1, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01) return;
  const D = Math.hypot(x1 - x0, y1 - y0), L = D * k, ux = (x1 - x0) / D, uy = (y1 - y0) / D;
  const w = o.w ?? 40, hl = Math.min(o.head ?? w * 1.6, L * 0.6), nx = -uy, ny = ux, sl = L - hl;
  const pt = (s, n) => [x0 + ux * s + nx * n, y0 + uy * s + ny * n];
  const P = [pt(0, -w / 2), pt(sl, -w / 2), pt(sl, -w), pt(L, 0), pt(sl, w), pt(sl, w / 2), pt(0, w / 2), pt(0, -w / 2)];
  const key = o.key || 'ba';
  gfill(P, SK.sheet, { a: 1, key: key + 'p' });
  scribbleFill(P, o.col || SK.graphL, { key: key + 's', gap: 12, w: 4, base: 0.45, a: o.a ?? 0.9 });
  gline(P, { w: 4.5, key: key + 'o', a: o.a ?? 1 });
}
