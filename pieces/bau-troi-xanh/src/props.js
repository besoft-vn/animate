// =====================================================================
//  PROPS — bầu trời xanh (director's shared helpers; scene agents use them, never edit them)
//  Sketchbook pens: gline (ink), gpencil (graphite), scribbleFill (colour), handLetter (lettering, face 'hand' ONLY:
//  the kit's 'marker' fonts have no Vietnamese glyphs).
// =====================================================================
// the sun: a yellow scribbled disc with short ink rays that boil. o: { col, rays (0..1 write-on), part (0..1 draw-on), key }
function sunDoodle(x, y, r, o = {}) {
  const key = o.key || 'sun', col = o.col || COL.sun, P = loopPts(x, y, r, r, 0.06);
  gfill(P, col, { a: 0.55, key: key + 'f' });
  scribbleFill(P, col, { key: key + 's', gap: 13, w: 4, part: o.part ?? 1, base: 0.3 });
  gline(P, { w: 4.5, key: key + 'o', part: o.part ?? 1 });
  const n = 10, k = clamp(o.rays ?? 1);
  for (let i = 0; i < n; i++) { const a = i / n * TAU + 0.2; if (i / n > k) break; gline([[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.55, y + Math.sin(a) * r * 1.55]], { w: 4, key: key + 'r' + i }); }
}
// a light wave from x0 to x1 around y: wavelength lam (px), amplitude amp, colour col. o: { part (write-on 0..1), phase (px), w, key }
function waveLine(x0, x1, y, lam, amp, col, o = {}) {
  const P = [], ph = o.phase ?? 0;
  for (let x = x0; x <= x1; x += 6) P.push([x, y + Math.sin((x - x0 + ph) / lam * TAU) * amp]);
  gline(P, { w: o.w ?? 7, col, key: o.key || 'wave', part: o.part ?? 1, amp: 1.2 });
}
// a gas molecule: two joined balls (N2 / O2), graphite-shaded, LARGE (r >= 18). o: { rot, key, col }
function molecule(x, y, r, o = {}) {
  const rot = o.rot ?? 0, dx = Math.cos(rot) * r * 0.75, dy = Math.sin(rot) * r * 0.75, key = o.key || 'mol';
  for (const [s, i] of [[-1, 0], [1, 1]]) {
    const P = loopPts(x + s * dx, y + s * dy, r, r, 0.05);
    gfill(P, o.col || SK.sheet, { a: 1, key: key + 'f' + i });
    litHatch(P, { key: key + 'h' + i, gap: 9 });
    gline(P, { w: 3.5, key: key + 'o' + i });
  }
}
// a short hand-lettered label (Vietnamese-safe): handLetter with the hand face, centred by default
const label = (str, x, y, size = 56, o = {}) => handLetter(str, x, y, size, { face: 'hand', align: o.align ?? 'center', col: o.col ?? SK.ink, reveal: o.reveal ?? 1, key: o.key ?? ('lb' + str) });
// the scene tag (top-left, tape + red underline), Vietnamese-safe version of the kit's pageTag (which uses marker fonts)
function viTagDraw(str) {
  const size = 66, w = letterW(str, size, 'hand'), x = 84, y = 340;
  tapeStrip(x + w / 2, y - size * 0.3, w + 70, -0.03, 'tagtape' + str, size * 1.15);
  const [x0, x1] = handLetter(str, x, y, size, { face: 'hand', align: 'left', reveal: ev(E0 + 0.1, 0.3), key: 'tag' + str, jit: 0.7 });
  underline(x0, x1, y + 20, { col: SK.red, w: 5, key: 'tagu' + str, part: ev(E0 + 0.4, 0.2) });
}
const viTag = (str) => { const f = () => viTagDraw(str); if (DEFER) DEFER.push(f); else f(); };
// captions: use the kit's pageCaption(lines, [[i, 'word']], { at, size }) — it uses the hand face (Vietnamese-safe).
// ≤ ~18 characters per line, ≤ 2 lines, at y ≈ 1330–1440 (no burned-in subtitles in this series any more).
