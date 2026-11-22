// =====================================================================
//  PROPS — sét (director's shared helpers; scene agents use them, never edit them)
//  Sketchbook pens: gline (ink), gpencil (graphite), scribbleFill (colour), handLetter (lettering, face 'hand' ONLY:
//  HAND = Pangolin, Vietnamese-safe).
//  Colour: terracotta = hero only · COL.pos blue = POSITIVE "+" / ice crystals · COL.neg plum = NEGATIVE "−" ·
//  COL.flash yellow = LIGHT only · COL.hot = HEAT only · graphite = leader (faint), streamer (unlit), cloud, sound.
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
// a tag already written (for "strike", which opens on the hard cut: complete on its first frame)
const viTagNow = (str) => { const f = () => viTagDraw(str, true); if (DEFER) DEFER.push(f); else f(); };
// captions: the kit's pageCaption(lines, [[i, 'word']], { at, size }) — hand face (Pangolin). Use size 62.
// ≤ ~22 characters per line, ≤ 2 lines, at y ≈ 1330–1440. pageCaption(..., { at: -10 }) = already written (strike).

// ---- THE HERO "Tia": doodleHero (terracotta) + optional NEGATIVE badge (a plum "−" disc on its belly, from "charge" on)
// o: everything doodleHero takes (look, mood, arms, legs, rot, sx, sy), plus badge (0..1 pops the "−" in), key
function heroTia(x, y, r = HR, o = {}) {
  const body = doodleHero(x, y, r, o);
  const k = clamp(o.badge ?? 0);
  if (k > 0.01) chargeSign(x + r * 0.62, y + r * 0.55, r * 0.34 * EZ.o2(k), -1, { key: (o.key || 'hero') + 'bd' });
  return body;
}

// ---- a CHARGE sign: a small cream disc with a bold "+" (sign 1, BLUE) or "−" (sign −1, PLUM), ink rim. r ≥ 18.
function chargeSign(x, y, r, sign, o = {}) {
  if (r < 2) return;
  const key = o.key || ('cs' + Math.round(x) + '_' + Math.round(y)), col = sign > 0 ? COL.pos : COL.neg, a = o.a ?? 1;
  const P = loopPts(x, y, r, r, 0.05);
  gfill(P, SK.sheet, { a, key: key + 'f' });
  gline(P, { w: Math.max(2.5, r * 0.12), key: key + 'o', a, second: false });
  const s = r * 0.55, w = Math.max(4, r * 0.24);
  gline([[x - s, y], [x + s, y]], { w, col, key: key + 'h', a, second: false, amp: 0.4 });
  if (sign > 0) gline([[x, y - s], [x, y + s]], { w, col, key: key + 'v', a, second: false, amp: 0.4 });
}

// ---- an ICE CRYSTAL: a small six-armed star (light blue, ink lines), r ≥ 20. o: { rot, key, a, plus (0..1 shows a "+") }
function iceCrystal(x, y, r, o = {}) {
  const key = o.key || 'ic', rot = o.rot ?? 0, a = o.a ?? 1;
  const P = []; for (let i = 0; i < 6; i++) { const an = rot + i / 6 * TAU; P.push([x + Math.cos(an) * r, y + Math.sin(an) * r]); }
  gfill(P, COL.posL, { a: 0.7 * a, key: key + 'f' });
  for (let i = 0; i < 3; i++) gline([P[i], P[i + 3]], { w: 4, key: key + 'a' + i, a, second: false });
  gline(P, { w: 3, key: key + 'o', a: 0.6 * a, closed: true, second: false });
  const k = clamp(o.plus ?? 0); if (k > 0.01) chargeSign(x + r * 0.95, y - r * 0.85, 18 + 4 * k, 1, { key: key + 'p', a: k * a });
}
// ---- a SOFT-HAIL pellet (graupel, "mưa đá mềm"): a lumpy off-white ball with graphite hatching, r ≥ 26.
// o: { key, a, minus (0..1 shows a "−") }
function hailPellet(x, y, r, o = {}) {
  const key = o.key || 'hp', a = o.a ?? 1, R = RNG(key + 'lump');
  const P = []; for (let i = 0; i < 14; i++) { const an = i / 14 * TAU, rr = r * (0.9 + 0.14 * R()); P.push([x + Math.cos(an) * rr, y + Math.sin(an) * rr]); }
  gfill(P, COL.hail, { a, key: key + 'f' });
  litHatch(P, { key: key + 'h', gap: 8, a: 0.5 * a });
  gline(P, { w: 4, key: key + 'o', a, closed: true });
  const k = clamp(o.minus ?? 0); if (k > 0.01) chargeSign(x + r * 0.85, y + r * 0.7, 18 + 4 * k, -1, { key: key + 'm', a: k * a });
}

// ---- THE STORM CLOUD on the hill: a big graphite-washed cumulonimbus with a flat base at CLOUD.base and an anvil top.
// o: { part (0..1 draw-on), dark (0..1 extra shade at the base), glow (0..1 a yellow flash-lit wash inside), key, x, base, s }
function stormCloudPts(o = {}) {
  const x = o.x ?? CLOUD.x, base = o.base ?? CLOUD.base, s = o.s ?? 1;
  // a cumulonimbus: flat base, billowy sides (scalloped), a wide anvil on top
  const V = [[-430, 0], [-455, -95], [-370, -165], [-300, -228], [-400, -262], [-140, -272], [140, -272], [430, -262],
    [300, -222], [380, -160], [455, -90], [430, 0]];
  const out = [];
  for (let i = 0; i < V.length - 1; i++) {
    const [ax, ay] = V[i], [bx, by] = V[i + 1], L = Math.hypot(bx - ax, by - ay), nx = (by - ay) / L, ny = -(bx - ax) / L;
    const flat = (i === 4 || i === 5 || i === 6) ? 0.12 : 0.32;           // the anvil top is flatter
    for (let k = 0; k < 8; k++) { const u = k / 8, b = Math.sin(Math.PI * u) * L * flat; out.push([ax + (bx - ax) * u + nx * b, ay + (by - ay) * u + ny * b]); }
  }
  out.push(V[V.length - 1]);
  const sy = s * (o.sy ?? 0.85);
  return out.map(([px, py]) => [x + px * s, base + py * sy]);
}
function stormCloud(o = {}) {
  const key = o.key || 'cl', P = stormCloudPts(o), part = o.part ?? 1, a = o.a ?? 1;
  gfill(P, COL.cloudL, { a: 0.85 * a, key: key + 'f' });
  const g = clamp(o.glow ?? 0);
  if (g > 0.01) scribbleFill(P, COL.flash, { key: key + 'gl', gap: 18, w: 7, base: 0.35, a: g * a });
  scribbleFill(P, COL.cloud, { key: key + 's', gap: 20, w: 6, base: 0.25, a: 0.55 * a, part });
  const x = o.x ?? CLOUD.x, base = o.base ?? CLOUD.base, s = o.s ?? 1, d = clamp(o.dark ?? 0.6);
  if (d > 0.01) scribbleFill([[x - 420 * s, base - 70 * s], [x + 420 * s, base - 70 * s], [x + 420 * s, base], [x - 420 * s, base]], COL.cloudD, { key: key + 'd', gap: 16, w: 6, base: 0.2, a: 0.45 * d * a, part });
  gline(P, { w: 5, key: key + 'o', part, closed: true, a });
}
// smooth a coarse polygon into a soft lumpy outline (chaikin ×2)
function loopify(P) {
  let Q = P;
  for (let k = 0; k < 2; k++) { const R = []; for (let i = 0; i < Q.length; i++) { const a = Q[i], b = Q[(i + 1) % Q.length]; R.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } Q = R; }
  return Q;
}

// ---- THE HILL: a soft ground line at GROUND_Y with a green scribble below and a few grass ticks that sway on 2s.
// o: { part, key, tint (0..1 a yellow flash-lit wash over the grass) }
function hill(o = {}) {
  const key = o.key || 'hl', part = o.part ?? 1;
  const G = []; for (let x = 20; x <= 1060; x += 40) G.push([x, GROUND_Y - 30 * Math.sin((x - 20) / 1040 * Math.PI) + 0]);
  const F = [...G, [1060, GROUND_Y + 240], [20, GROUND_Y + 240]];
  scribbleFill(F, COL.grassL, { key: key + 'g', gap: 18, w: 6, base: 0.4, part });
  if ((o.tint ?? 0) > 0.01) scribbleFill(F, COL.flash, { key: key + 'gy', gap: 22, w: 6, base: 0.3, a: o.tint });
  gline(G, { w: 5, key: key + 'l', part });
  for (let i = 0; i < 7; i++) {
    const gx = 90 + i * 140 + (i % 2) * 30, gy = hillY(gx) + 6, sw = 6 * Math.sin(TT * 2.2 + i * 1.3);
    gpencil([[gx, gy], [gx + sw - 8, gy - 30]], { w: 3, key: key + 't' + i, a: 0.7 });
    gpencil([[gx + 10, gy], [gx + 12 + sw, gy - 24]], { w: 3, key: key + 'u' + i, a: 0.7 });
  }
}
const hillY = (x) => GROUND_Y - 30 * Math.sin((x - 20) / 1040 * Math.PI);
// ---- THE TREE (on the hill, right of centre): trunk from TREE.x on the ground up into a round crown whose top = TREE_TOP.
// o: { part, key, sway (px), lit (0..1 a yellow flash-lit rim) }
function tree(o = {}) {
  const key = o.key || 'tr', part = o.part ?? 1, sw = o.sway ?? 4 * Math.sin(TT * 1.7);
  const x = TREE.x, gy = hillY(x) + 4;
  const T = [[x - 18, gy], [x - 12, gy - 140], [x + 12, gy - 140], [x + 18, gy]];
  gfill(T, SK.wood, { key: key + 'tf' }); ghatchClip(T, key + 'th');
  gline(T, { w: 5, key: key + 'to', part });
  const cx = x + sw, cy = TREE_TOP[1] + 95, C = loopify([[cx - 110, cy + 40], [cx - 120, cy - 20], [cx - 70, cy - 80], [cx, cy - 95], [cx + 70, cy - 80], [cx + 118, cy - 20], [cx + 105, cy + 45], [cx, cy + 70]]);
  gfill(C, COL.grass, { a: 1, key: key + 'cf' });
  litHatch(C, { key: key + 'ch', gap: 10, col: '#4f7a44', a: 0.6 });
  if ((o.lit ?? 0) > 0.01) scribbleFill(C, COL.flash, { key: key + 'cy', gap: 16, w: 6, base: 0.3, a: o.lit });
  gline(C, { w: 5, key: key + 'co', part, closed: true });
}
function ghatchClip(P, key) { ctx.save(); gclip(P); ghatch(-2000, -2000, 4000, 4000, { key, gap: 9, a: 0.35 }); ctx.restore(); }

// ---- A ZIGZAG CHANNEL along points P (world coords).
//  leaderPath(P, part, o): the FAINT stepped leader — a graphite pencil zigzag, written on to `part` (0..1); its tip gets
//    a small plum glow (COL.negL scribble) when o.tip is true. o: { key, a, w }
//  boltPath(P, o): the BRIGHT channel — a fat yellow highlighter stroke inside an ink outline (+ a soft yellow halo).
//    o: { part (0..1 write-on FROM P[0]), w (core width, 26), halo (0..1), key, a }
//  Pass P ordered in the direction it should GROW: for the return stroke that is ground -> cloud (reverse the arrays).
function leaderPath(P, part, o = {}) {
  const k = clamp(part); if (k <= 0.01) return;
  const Q = writeOn(P, k); if (!Q || Q.length < 2) return;
  gpencil(Q, { w: o.w ?? 5, key: (o.key || 'ld') + 'p', a: o.a ?? 0.9, amp: 1.2 });
  if (o.tip) { const [tx, ty] = Q[Q.length - 1]; scribbleFill(loopPts(tx, ty, 26, 26, 0.05), COL.negL, { key: (o.key || 'ld') + 'tip', gap: 9, w: 4, base: 0.3, a: 0.8 }); }
}
function boltPath(P, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01) return;
  const Q = writeOn(P, k); if (!Q || Q.length < 2) return;
  const w = o.w ?? 26, key = o.key || 'bt', a = o.a ?? 1, h = clamp(o.halo ?? 0.6);
  if (h > 0.01) gline(Q, { w: w * 3.2, col: COL.flash, key: key + 'h', a: 0.28 * h * a, second: false, amp: 0.6 });
  gline(Q, { w: w + 9, col: SK.ink, key: key + 'o', a, second: false, amp: 0.7 });
  gline(Q, { w, col: COL.flash, key: key + 'c', a, second: false, amp: 0.5 });
  gline(Q, { w: w * 0.3, col: SK.sheet, key: key + 'w', a: 0.9 * a, second: false, amp: 0.4 });
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
// ---- a sound ring (thunder): a graphite arc of radius r around (x, y), fading as it grows. o: { key, a, w }
function soundRing(x, y, r, o = {}) {
  gline(arcPts(x, y, r, -Math.PI * 0.42, Math.PI * 0.42, 24), { w: o.w ?? 6, key: (o.key || 'sr') + 'r', a: o.a ?? 0.8, second: false });
  gline(arcPts(x, y, r, Math.PI * 0.58, Math.PI * 1.42, 24), { w: o.w ?? 6, key: (o.key || 'sr') + 'l', a: o.a ?? 0.8, second: false });
}
