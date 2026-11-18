// =====================================================================
//  PROPS — máy bay (director's shared helpers; scene agents use them, never edit them)
//  Sketchbook pens: gline (ink), gpencil (graphite), scribbleFill (colour), handLetter (lettering, face 'hand' ONLY:
//  the kit's 'marker' fonts have no Vietnamese glyphs).
//  Colour: terracotta = hero only · COL.air/airL/airD = air & airflow · COL.lift = LIFT only · graphite/ink = the rest.
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
// a tag already written (for "lift", which opens on the hard cut: complete on its first frame)
const viTagNow = (str) => { const f = () => viTagDraw(str, true); if (DEFER) DEFER.push(f); else f(); };
// captions: the kit's pageCaption(lines, [[i, 'word']], { at, size }) — hand face (Vietnamese-safe).
// ≤ ~18 characters per line, ≤ 2 lines, at y ≈ 1330–1440. No burned-in subtitles in this series.

// ---- THE HERO: one parcel of air = doodleHero (terracotta) + optional little graphite wind ticks behind it showing
// which way it is moving. o: everything doodleHero takes, plus wind (0..1 strength), dir (rad, direction of travel).
function heroAir(x, y, r = HR, o = {}) {
  const k = clamp(o.wind ?? 0);
  if (k > 0) {
    const d = o.dir ?? 0, ca = Math.cos(d), sa = Math.sin(d);
    for (let i = -1; i <= 1; i++) {
      const bx = x - ca * r * 1.35 - sa * i * r * 0.45, by = y - sa * r * 1.35 + ca * i * r * 0.45, L = r * (0.9 - Math.abs(i) * 0.3) * k;
      gpencil([[bx, by], [bx - ca * L, by - sa * L]], { w: 3, key: (o.key || 'hero') + 'wt' + i, a: 0.7 });
    }
  }
  return doodleHero(x, y, r, o);
}

// ---- a chunky hand-drawn force arrow from (x0, y0) to (x1, y1): colour scribble inside an ink outline.
// o: { col (fill), w (shaft width, 44), head (head length, 1.6*w), part (grow 0..1 from the tail), key, a }
// LIFT: col COL.lift. Air pushed down: COL.air. Thrust / weight: SK.graphL (graphite) — never yellow.
function forceArrow(x0, y0, x1, y1, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01) return;
  const L = Math.hypot(x1 - x0, y1 - y0) * k, ux = (x1 - x0) / Math.hypot(x1 - x0, y1 - y0), uy = (y1 - y0) / Math.hypot(x1 - x0, y1 - y0);
  const w = o.w ?? 44, hl = Math.min(o.head ?? w * 1.6, L * 0.6), nx = -uy, ny = ux, sl = L - hl;
  const pt = (s, n) => [x0 + ux * s + nx * n, y0 + uy * s + ny * n];
  const P = [pt(0, -w / 2), pt(sl, -w / 2), pt(sl, -w), pt(L, 0), pt(sl, w), pt(sl, w / 2), pt(0, w / 2), pt(0, -w / 2)];
  const key = o.key || 'fa';
  gfill(P, SK.sheet || '#fffdf6', { a: 1, key: key + 'p' });
  scribbleFill(P, o.col || SK.graphL || '#9a948b', { key: key + 's', gap: 12, w: 4, base: 0.45, a: o.a ?? 0.9 });
  gline(P, { w: 4.5, key: key + 'o', a: o.a ?? 1 });
}

// ---- the airliner, side view, nose LEFT. Centre (x, y), scale s (1 = ~820 px long). The main wheels touch y + 140*s
// when gear = 1 and rot = 0. o: { rot (pitch, rad, + = nose up, about the main wheels), gear (0 up .. 1 down),
// part (pencil -> ink write-on 0..1), exhaust (0..1: graphite heat-shimmer strokes behind the engine), key }
const PLANE_MAIN = [40, 140];                                    // local: the main wheels' contact point (pivot for rot)
function planeSide(x, y, s = 1, o = {}) {
  const key = o.key || 'pl', part = o.part ?? 1, rot = o.rot ?? 0, g = clamp(o.gear ?? 1);
  ctx.save();
  ctx.translate(x + PLANE_MAIN[0] * s, y + PLANE_MAIN[1] * s); ctx.rotate(-rot); ctx.scale(s, s); ctx.translate(-PLANE_MAIN[0], -PLANE_MAIN[1]);
  // landing gear (behind the body)
  if (g > 0.01) for (const [gx, gl] of [[-280, 48], [40, 62]]) {
    const yb = 60 + gl * g;
    gline([[gx, 50], [gx, yb]], { w: 6, key: key + 'gs' + gx, part });
    const wr = gx === 40 ? 19 : 15, W = loopPts(gx, yb + wr * 0.6, wr, wr, 0.05);
    gfill(W, SK.ink, { a: 0.85, key: key + 'gw' + gx }); gline(W, { w: 4, key: key + 'gwo' + gx, part });
  }
  // the tail fin
  const FIN = [[250, -58], [330, -225], [398, -225], [408, -52]];
  gfill(FIN, SK.sheet || '#fffdf6', { key: key + 'ff' }); litHatch(FIN, { key: key + 'fh', gap: 10, a: 0.35 });
  gline(FIN, { w: 5, key: key + 'fo', part });
  // the fuselage: rounded nose (left), tapering tail cone (right)
  const BODY = [...arcPts(-330, 0, 60, Math.PI / 2, Math.PI * 1.5, 14).map(([px, py]) => [-330 + (px + 330) * 1.45, py]),
    [300, -60], [412, -54], [416, -36], [230, 60], [-330, 60]];
  gfill(BODY, SK.sheet || '#fffdf6', { key: key + 'bf' });
  litHatch(BODY, { key: key + 'bh', gap: 12, a: 0.3, ly: 0.9, lx: 0.1, lr: 0.9 });
  gline(BODY, { w: 5.5, key: key + 'bo', part, closed: true });
  // cockpit + a short row of windows (few, big enough to read as windows, not specks)
  gline([[-392, -18], [-360, -30], [-330, -30], [-330, -14], [-392, -14]], { w: 4, key: key + 'ck', part });
  for (let i = 0; i < 9; i++) { const wx = -270 + i * 52; gline(loopPts(wx, -20, 9, 11, 0.05), { w: 3.2, key: key + 'w' + i, part, second: false }); }
  // the horizontal stabiliser (side-on sliver)
  gline([[300, -30], [420, -44], [395, -20], [300, -22]], { w: 4, key: key + 'hs', part });
  // the wing (side view: a thin swept sliver) and the engine under it
  const WG = [[-130, 18], [150, 22], [190, 44], [-110, 42]];
  gfill(WG, SK.sheet || '#fffdf6', { key: key + 'wf' }); gline(WG, { w: 4.5, key: key + 'wo', part, closed: true });
  const EN = sketchBox(-120, 64, 160, 66, 30, 0.02);
  gfill(EN, SK.sheet || '#fffdf6', { key: key + 'ef' }); litHatch(EN, { key: key + 'eh', gap: 9, a: 0.45 });
  gline(EN, { w: 5, key: key + 'eo', part });
  gline(loopPts(-118, 97, 12, 30, 0.05), { w: 4, key: key + 'ei', part });
  gline([[-60, 42], [-40, 64]], { w: 4, key: key + 'py', part });
  const ex = clamp(o.exhaust ?? 0);
  if (ex > 0) for (let i = 0; i < 3; i++) {
    const yy = 80 + i * 17, L = (70 + 40 * Math.sin(TT * 9 + i * 2)) * ex;
    gpencil([[50, yy], [50 + L * 0.5, yy - 5], [50 + L, yy + 2]], { w: 3, key: key + 'ex' + i, a: 0.75 });
  }
  ctx.restore();
}
// world position of a point given in planeSide's local coords (follows x, y, s, rot) — e.g. the engine [-40, 97],
// the wing [20, 30], the nose [-410, 0], the tail [410, -100]
function planePt(lx, ly, x = PLANE.x, y = PLANE.y, s = PLANE.s, rot = 0) {
  const dx = (lx - PLANE_MAIN[0]) * s, dy = (ly - PLANE_MAIN[1]) * s, c = Math.cos(-rot), sn = Math.sin(-rot);
  return [x + PLANE_MAIN[0] * s + dx * c - dy * sn, y + PLANE_MAIN[1] * s + dx * sn + dy * c];
}
// the runway: a long ink line at RUNWAY_Y with a few big dashed centre marks (they slide left with `slide` px to show speed)
function runway(o = {}) {
  const y = o.y ?? RUNWAY_Y, key = o.key || 'rw', sl = o.slide ?? 0;
  gline([[40, y], [1040, y]], { w: 5, key: key + 'l', part: o.part ?? 1 });
  for (let i = -1; i < 6; i++) { const x0 = ((i * 220 - sl) % 1320 + 1320) % 1320 - 120; gpencil([[x0, y + 46], [x0 + 110, y + 46]], { w: 7, key: key + 'd' + i, a: 0.6 }); }
}

// ---- THE WING CROSS-SECTION (airfoil), leading edge LEFT, cambered ~4%, 12% thick, tilted nose-up by aoa.
// airfoilPts(cx, cy, c, aoa) -> closed outline (world). airfoil(o) draws it: { x, y, c, aoa, part, key, hatch }
function _foilLocal(c) {
  const N = 40, U = [], L = [], m = 0.045, p = 0.4;
  for (let i = 0; i <= N; i++) {
    const t = (1 - Math.cos(Math.PI * i / N)) / 2;
    const th = 0.12 * 5 * (0.2969 * Math.sqrt(t) - 0.126 * t - 0.3516 * t * t + 0.2843 * t ** 3 - 0.1036 * t ** 4);
    const cb = t < p ? m / (p * p) * (2 * p * t - t * t) : m / ((1 - p) ** 2) * (1 - 2 * p + 2 * p * t - t * t);
    U.push([(t - 0.5) * c, -(cb + th) * c]); L.push([(t - 0.5) * c, -(cb - th) * c]);
  }
  return [...U, ...L.reverse()];
}
const airfoilPts = (cx = WING.x, cy = WING.y, c = WING.c, aoa = WING.aoa) => xform(_foilLocal(c), cx, cy, aoa);
function airfoil(o = {}) {
  const P = airfoilPts(o.x ?? WING.x, o.y ?? WING.y, o.c ?? WING.c, o.aoa ?? WING.aoa), key = o.key || 'foil';
  if ((o.part ?? 1) >= 1) { gfill(P, SK.sheet || '#fffdf6', { key: key + 'f' }); if (o.hatch !== false) litHatch(P, { key: key + 'h', gap: 10, a: 0.4 }); }
  gline(P, { w: 6, key: key + 'o', part: o.part ?? 1, closed: true });
  return P;
}
// the wing's leading / trailing edge in world coords (for the default WING)
const foilLE = () => xform([[-WING.c / 2, 0]], WING.x, WING.y, WING.aoa)[0];
const foilTE = () => xform([[WING.c / 2, 0]], WING.x, WING.y, WING.aoa)[0];

// ---- an AIRFLOW line past the default WING (air flows LEFT -> RIGHT). h = its height far upstream relative to WING.y
// (negative = above; keep |h| ≥ 110 so it never cuts the wing). It rises a little before the wing (upwash), follows
// the curve, and leaves the trailing edge bent DOWN (downwash) by `down` (0..1.5, default 1).
// flowPts(h, o) -> points; flowLine(h, o) draws it in COL.air: { x0, x1, down, part, w, key, col, a }
function flowPts(h, o = {}) {
  const c = WING.c, ca = Math.cos(WING.aoa), sa = Math.tan(WING.aoa), LEx = WING.x - c / 2 * ca, TEx = WING.x + c / 2 * ca;
  const d = Math.exp(-Math.abs(h) / 300), above = h < 0, dw = 120 * (o.down ?? 1), sm = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  const surf = (xx) => (xx - WING.x) * sa;                           // the chord line's height (down positive)
  const P = [];
  for (let x = o.x0 ?? 50; x <= (o.x1 ?? 1030); x += 10) {
    // every term is continuous: the slope of the wing (upwash ahead, held behind), the wing's thickness/camber inside
    // the chord, and the downwash that builds from the leading edge to well behind the trailing edge
    let off = x < LEx ? sm(LEx - 300, LEx, x) * surf(LEx) : surf(Math.min(x, TEx));
    if (x > LEx && x < TEx) {
      const t = (x - LEx) / (TEx - LEx), th = 0.6 * (0.2969 * Math.sqrt(t) - 0.126 * t - 0.3516 * t * t + 0.2843 * t ** 3 - 0.1036 * t ** 4) * c;
      const cb = 0.045 * c * (t < 0.4 ? (0.8 * t - t * t) / 0.16 : (0.2 + 0.8 * t - t * t) / 0.36);
      off += -cb + (above ? -th * 0.9 : th * 0.35);
    }
    off += dw * sm(LEx, TEx + 320, x);
    P.push([x, WING.y + h + off * d]);
  }
  return P;
}
function flowLine(h, o = {}) {
  return gline(flowPts(h, o), { w: o.w ?? 5, col: o.col || COL.air, key: o.key || ('fl' + h), part: o.part ?? 1, a: o.a ?? 0.9, amp: 1.2 });
}
// a small blue chevron riding along a path at fraction u (0..1) — animate u with time so the air visibly MOVES
function flowChevron(P, u, o = {}) {
  const Q = resample(P, false, 8), i = Math.min(Q.length - 2, Math.max(0, Math.floor(clamp(u) * (Q.length - 1))));
  const [ax, ay] = Q[i], [bx, by] = Q[i + 1], an = Math.atan2(by - ay, bx - ax), s = o.s ?? 18;
  gline([[ax - Math.cos(an - 0.6) * s, ay - Math.sin(an - 0.6) * s], [ax, ay], [ax - Math.cos(an + 0.6) * s, ay - Math.sin(an + 0.6) * s]], { w: o.w ?? 5, col: o.col || COL.airD, key: (o.key || 'chv'), second: false });
}
// a soft blue "air zone" (pressure): a scribbled blob, light (low pressure) or deeper (high pressure). o: { col, part, key, a }
function airZone(cx, cy, rx, ry, o = {}) {
  const P = loopPts(cx, cy, rx, ry, 0.04);
  scribbleFill(P, o.col || COL.airL, { key: (o.key || 'az') + 's', gap: 16, w: 5, base: 0.3, part: o.part ?? 1, a: o.a ?? 0.7 });
  gpencil(P, { key: (o.key || 'az') + 'o', a: 0.6, part: o.part ?? 1 });
}
