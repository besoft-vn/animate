// =====================================================================
//  PROPS — nước biển mặn (director's shared helpers; scene agents use them, never edit them)
//  Sketchbook pens: gline (ink), gpencil (graphite), scribbleFill (colour), handLetter (lettering, face 'hand' ONLY:
//  HAND = Pangolin, Vietnamese-safe).
//  Colour (one colour = one meaning): TERRACOTTA = the hero only · BLUE (COL.water/waterL) = water (rain, river, sea) ·
//  PLUM (COL.salt) = SALT / dissolved minerals (the salt grains, the hero's badge, the salt layer's rim) ·
//  GREEN (COL.acid) = the CO2 / "hơi chua" acid only · YELLOW (COL.sun) = sunlight / evaporation heat only ·
//  RED-ORANGE (COL.hot) = volcanic / vent heat only · graphite = rock, mountain hatching, arrows of "flow", labels' ticks.
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

// ---- A SALT GRAIN ("muối"): a small tilted cube — cream faces, plum rim + plum top face. r = half-size, r ≥ 18.
// o: { rot, key, a, part (0..1 pops it in) }
function saltGrain(x, y, r, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01 || r < 2) return;
  const key = o.key || ('sg' + Math.round(x) + '_' + Math.round(y)), a = o.a ?? 1, s = r * EZ.back(k), rot = o.rot ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const d = s * 0.45;                                                      // the depth offset (top / side faces)
  const F = [[-s, -s + d], [s - d, -s + d], [s - d, s], [-s, s]];          // front face
  const T = [[-s, -s + d], [-s + d, -s], [s, -s], [s - d, -s + d]];        // top face
  const S = [[s - d, -s + d], [s, -s], [s, s - d], [s - d, s]];            // side face
  gfill(F, SK.sheet, { a, key: key + 'f' });
  gfill(T, COL.saltL, { a, key: key + 't' });
  gfill(S, COL.salt, { a: 0.75 * a, key: key + 's' });
  gline(closeP(F), { w: Math.max(2.5, s * 0.12), col: COL.salt, key: key + 'of', a, second: false, amp: 0.4 });
  gline([T[0], T[1], T[2], T[3]], { w: Math.max(2.5, s * 0.12), col: COL.salt, key: key + 'ot', a, second: false, amp: 0.4 });
  gline([S[1], S[2], S[3]], { w: Math.max(2.5, s * 0.12), col: COL.salt, key: key + 'os', a, second: false, amp: 0.4 });
  ctx.restore();
}
// ---- a CO2 bubble ("khí cacbonic"): a green-rimmed bubble with "CO₂" lettered inside, r ≥ 30. o: { key, a, part }
function co2Bubble(x, y, r, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01) return;
  const key = o.key || 'co2', a = o.a ?? 1, rr = r * EZ.back(k);
  const P = loopPts(x, y, rr, rr, 0.05);
  gfill(P, COL.acidL, { a: 0.9 * a, key: key + 'f' });
  gline(P, { w: 4, col: COL.acid, key: key + 'o', a, second: false });
  if (rr > 24) alphaDo(a, () => handLetter('CO₂', x, y + rr * 0.3, rr * 0.8, { face: 'hand', align: 'center', col: COL.acid, key: key + 'l' }));
}

// ---- THE HERO "Giọt" (the channel's terracotta doodle) + optional SALT badge (a plum salt grain on its belly).
// o: everything doodleHero takes (look, mood, arms, legs, rot, sx, sy), plus salt (0..1 pops the grain in), key
function heroGiot(x, y, r = HR, o = {}) {
  const body = doodleHero(x, y, r, o);
  const k = clamp(o.salt ?? 0);
  if (k > 0.01) saltGrain(x + r * 0.62, y + r * 0.55, r * 0.36, { part: k, key: (o.key || 'hero') + 'sb', rot: -0.15 });
  return body;
}
// ---- a RAINDROP shell around the hero (for "rain"): a blue teardrop outline + light wash, point UP. o: { key, a }
function dropShell(x, y, r, o = {}) {
  const key = o.key || 'ds', a = o.a ?? 1, R = r * 1.35;
  const P = []; for (let i = 0; i <= 40; i++) { const an = i / 40 * TAU, s = Math.sin(an / 2); P.push([x + R * Math.sin(an) * s, y + R * 0.25 - R * Math.cos(an) * (0.9 + 0.35 * (1 - s))]); }
  alphaDo(a, () => { gfill(P, COL.waterL, { a: 0.35, key: key + 'f' }); gline(P, { w: 5, col: COL.water, key: key + 'o', closed: true }); });
}

// =====================================================================
//  THE COAST (shared world: hook, rain (start), river (end), evap, time, end). Fixed geometry so every scene agrees:
//  the sea surface at SEA_Y (full width, sea below it), the beach on the left (x < BEACH_X1), the mountain on the right
//  (peak MOUNT.peak), the rain cloud over it (RAIN_CLOUD), the river from SRC_PT down to MOUTH (RIVER points), the sun
//  top-left (SUN).
// =====================================================================
// the sea: a flat blue wash from SEA_Y down to y 1250 (fading), with 3 slow wave lines that drift (never still).
// o: { key, a, salt (0..1 a plum tint over the wash: "saltier"), y (surface y), part }
function sea(o = {}) {
  const key = o.key || 'sea', a = o.a ?? 1, y0 = o.y ?? SEA_Y, part = o.part ?? 1;
  const top = []; for (let x = -40; x <= 1120; x += 40) top.push([x, y0 + 6 * Math.sin(x / 90 + TT * 1.6)]);
  const F = [...top, [1120, 1250], [-40, 1250]];
  scribbleFill(F, COL.waterL, { key: key + 'f', gap: 18, w: 7, base: 0.55, a, part });
  const s = clamp(o.salt ?? 0); if (s > 0.01) scribbleFill(F, COL.saltL, { key: key + 'sl', gap: 22, w: 6, base: 0.3, a: s * a });
  gline(top, { w: 5, col: COL.water, key: key + 'l', a, part });
  for (let i = 0; i < 3; i++) {
    const wy = y0 + 50 + i * 55, ph = TT * (0.7 + 0.2 * i) + i * 1.7, x0 = 80 + ((i * 260 + TT * 40 * (i % 2 ? -1 : 1)) % 700 + 700) % 700;
    const Wv = []; for (let k = 0; k <= 8; k++) Wv.push([x0 + k * 22, wy + 7 * Math.sin(k * 0.9 + ph)]);
    gpencil(Wv, { w: 4, col: COL.water, key: key + 'w' + i, a: 0.6 * a });
  }
}
// the beach: a sand strip on the left at the sea edge
function beach(o = {}) {
  const key = o.key || 'bch', a = o.a ?? 1;
  const P = [[-40, SEA_Y - 40], [BEACH_X1 - 60, SEA_Y - 30], [BEACH_X1, SEA_Y + 4], [-40, SEA_Y + 4]];
  alphaDo(a, () => { gfill(P, SK.wood, { a: 0.8, key: key + 'f' }); gline([P[0], P[1], P[2]], { w: 4, key: key + 'o' }); });
}
// the mountain (right): graphite-hatched rock with a snowless rounded peak; o: { key, a, part }
function mountain(o = {}) {
  const key = o.key || 'mt', a = o.a ?? 1, part = o.part ?? 1;
  const P = MOUNT.pts;
  alphaDo(a, () => {
    gfill(P, '#d9d2c4', { key: key + 'f' });
    litHatch(P, { ang: -0.9, gap: 14, col: SK.graph, w: 2.4, a: 0.5, key: key + 'h' });
    gline(P, { w: 5, key: key + 'o', part, closed: false });
  });
}
// the river: a blue ribbon from SRC_PT to MOUTH along RIVER; flow dashes drift DOWNSTREAM (towards the sea).
// o: { key, a, part (0..1 grows from the spring), flow (0..1 shows the moving flow dashes) }
function river(o = {}) {
  const key = o.key || 'rv', a = o.a ?? 1, part = o.part ?? 1;
  const Q = writeOn(RIVER, part); if (!Q || Q.length < 2) return;
  alphaDo(a, () => {
    gline(Q, { w: 34, col: COL.water, key: key + 'e', second: false, amp: 0.5 });
    gline(Q, { w: 24, col: COL.waterL, key: key + 'c', second: false, amp: 0.4 });
    const fk = clamp(o.flow ?? 1);
    if (fk > 0.01) for (let i = 0; i < 4; i++) {
      const u = ((TT * 0.18 + i / 4) % 1) * part;                             // drifts from the spring to the mouth
      const A = writeOn(RIVER, Math.max(0.001, u)), B = writeOn(RIVER, Math.min(part, u + 0.05));
      if (A && B) gline([A[A.length - 1], B[B.length - 1]], { w: 5, col: SK.sheet, key: key + 'd' + i, a: 0.9 * fk, second: false });
    }
  });
}
// the point at fraction u (0..1) along the river (for riding it)
const riverAt = (u) => { const Q = writeOn(RIVER, clamp(u, 0.001, 1)); return Q[Q.length - 1]; };
// a small rain cloud over the mountain: a rounded graphite-washed cloud. o: { key, a, x, y, s, dark (0..1) }
function rainCloud(o = {}) {
  const key = o.key || 'rc', a = o.a ?? 1, x = (o.x ?? RAIN_CLOUD.x) + 6 * Math.sin(TT * 0.7), y = o.y ?? RAIN_CLOUD.y, s = o.s ?? 1;
  const C = loopify([[x - 170 * s, y + 50 * s], [x - 185 * s, y - 10 * s], [x - 110 * s, y - 70 * s], [x - 20 * s, y - 95 * s], [x + 80 * s, y - 80 * s], [x + 170 * s, y - 30 * s], [x + 175 * s, y + 50 * s]]);
  alphaDo(a, () => {
    gfill(C, '#e4e1dc', { key: key + 'f' });
    scribbleFill(C, '#a9a49d', { key: key + 's', gap: 22, w: 6, base: 0.25, a: 0.35 + 0.4 * clamp(o.dark ?? 0.3) });
    gline(C, { w: 5, key: key + 'o', closed: true });
  });
}
// the sun (top-left): yellow disc with slowly turning ray ticks. o: { key, a, x, y, r, hot (0..1 stronger rays) }
function sunDisc(o = {}) {
  const key = o.key || 'sun', a = o.a ?? 1, x = o.x ?? SUN.x, y = o.y ?? SUN.y, r = o.r ?? SUN.r, h = clamp(o.hot ?? 0);
  alphaDo(a, () => {
    gfill(loopPts(x, y, r, r, 0), COL.sun, { key: key + 'f' });
    gline(loopPts(x, y, r, r, 0.06), { w: 5, col: SK.ink, key: key + 'o' });
    for (let i = 0; i < 8; i++) {
      const an = i / 8 * TAU + TT * 0.25, r0 = r + 14, r1 = r + 36 + 16 * h + 4 * Math.sin(TT * 3 + i);
      gline([[x + Math.cos(an) * r0, y + Math.sin(an) * r0], [x + Math.cos(an) * r1, y + Math.sin(an) * r1]], { w: 6, col: COL.sunD, key: key + 'r' + i, second: false });
    }
  });
}
// the whole coast in one call. o: { sea, mountain, river, cloud, sun, beach: each an options object or false }
function coast(o = {}) {
  if (o.sun !== false) sunDisc(o.sun || {});
  if (o.cloud !== false) rainCloud(o.cloud || {});
  if (o.mountain !== false) mountain(o.mountain || {});
  if (o.river !== false) river(o.river || {});
  if (o.sea !== false) sea(o.sea || {});
  if (o.beach !== false) beach(o.beach || {});
}
// smooth a coarse polygon into a soft lumpy outline (chaikin ×2)
function loopify(P) {
  let Q = P;
  for (let k = 0; k < 2; k++) { const R = []; for (let i = 0; i < Q.length; i++) { const a = Q[i], b = Q[(i + 1) % Q.length]; R.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } Q = R; }
  return Q;
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
