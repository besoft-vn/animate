// =====================================================================
//  PROPS — mã QR (director's file; agents use, never edit).  Everything here draws in LOW-RES PIXELS inside
//  lowres(RES, ...) — call these only from inside a lowres draw.
// =====================================================================

// ---- Vietnamese pixel text. The kit's FONT5 has no Vietnamese diacritics, so we rasterise Pangolin at the
// era's own pixel size and keep only the pixels that are mostly covered (hard pixels, no anti-aliasing).
// viText(str, x, y, col, { size = 14, count, align: 'left'|'center'|'right', bold = true, shadow }) -> width (px)
// (x, y) = top-left of the text box (align moves x).  size 14 px = 56 screen px (minimum for readable labels: 13).
const Q = PAL16;
const VI_CACHE = new Map();
function viGlyphs(str, size, bold) {
  const k = str + '|' + size + '|' + bold;
  if (VI_CACHE.has(k)) return VI_CACHE.get(k);
  const c = document.createElement('canvas'), g = c.getContext('2d', { willReadFrequently: true });
  g.font = `${size}px ${HAND_PX}`;
  const w = Math.ceil(g.measureText(str).width) + 4, h = Math.ceil(size * 1.5) + 2;
  c.width = Math.max(1, w); c.height = h;
  g.font = `${size}px ${HAND_PX}`; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff';
  const base = Math.round(size * 1.12);
  g.fillText(str, 1, base);
  if (bold) g.fillText(str, 1.45, base);
  const d = g.getImageData(0, 0, c.width, c.height).data, runs = [];
  for (let j = 0; j < c.height; j++) for (let i = 0; i < c.width;) {
    if (d[(j * c.width + i) * 4 + 3] < 100) { i++; continue; }
    let e = i + 1; while (e < c.width && d[(j * c.width + e) * 4 + 3] >= 100) e++;
    runs.push([i, j, e - i]); i = e;
  }
  const out = { runs, w: w - 2, h };
  VI_CACHE.set(k, out);
  return out;
}
const viTextW = (str, size = 14, bold = true) => viGlyphs(str, size, bold).w;
function viText(str, x, y, col, o = {}) {
  const size = o.size ?? 14, bold = o.bold ?? true, full = viGlyphs(str, size, bold);
  const s = o.count == null ? str : str.slice(0, Math.max(0, Math.floor(o.count)));
  const gl = viGlyphs(s, size, bold), dx = o.align === 'center' ? -Math.round(full.w / 2) : o.align === 'right' ? -full.w : 0;
  const ox = Math.round(x) + dx - 1, oy = Math.round(y) - Math.round(size * 0.35);
  if (o.shadow) { ctx.fillStyle = o.shadow; for (const [i, j, n] of gl.runs) cellR(ox + i + 1, oy + j + 1, n, 1); }
  ctx.fillStyle = col; for (const [i, j, n] of gl.runs) cellR(ox + i, oy + j, n, 1);
  return full.w;
}
// a panel with Vietnamese text: viPanel(str, cx, cy, { fg, bg, edge, size, count }) centred at (cx, cy) px
function viPanel(str, cx, cy, o = {}) {
  const size = o.size ?? 14, tw = viTextW(str, size), bw = tw + 10, bh = Math.round(size * 1.45) + 4;
  const x0 = Math.round(cx - bw / 2), y0 = Math.round(cy - bh / 2);
  pixBox(x0, y0, bw, bh, { bg: o.bg ?? Q.ink, edge: o.edge ?? Q.white, shadow: o.shadow });
  viText(str, x0 + 5, y0 + 2 + Math.round(size * 0.35), o.fg ?? Q.white, { size, count: o.count });
  return [x0, y0, bw, bh];
}
// the caption (bottom, centred at CAP_Y): types on from `at` (absolute seconds; default E0 + 0.3) over `dur`;
// complete on its first frame when at <= E0 - 1 (use at: -10 after the SLAM).
function viCaption(str, o = {}) {
  const at = o.at ?? E0 + 0.3; if (TT < at) return;
  const n = Math.floor(clamp((TT - at) / (o.dur ?? 0.6)) * str.length + 1e-6);
  viPanel(str, Math.round(CX / G), CAP_Y, { ...o, count: n, size: o.size ?? 15 });
}
// the tag (top-left), pops on at `at` (default E0 + 0.2)
function viTag(str, o = {}) {
  const at = o.at ?? E0 + 0.2; if (TT < at) return;
  const size = 14, tw = viTextW(str, size), [x, y] = TAG_XY;
  pixBox(x, y, tw + 10, 25, { bg: Q.ink, edge: o.edge ?? Q.yellow });
  viText(str, x + 5, y + 2 + 5, o.fg ?? Q.yellow, { size });
}
// a label at (x, y) px, typed on from t0 (absolute), gone (blinks off, no fade) at t1
function viLabel(str, x, y, col, t0, t1, o = {}) {
  if (TT < t0 || (t1 != null && TT >= t1)) return;
  viText(str, x, y, col, { ...o, count: Math.floor(clamp((TT - t0) / (o.dur ?? 0.4)) * str.length + 1e-6) });
}

// ---- the world: a flat night wall and a dark floor the hero stands on (no stars, no specks)
const FLOOR_Y = 311;
function qrWorld() {
  pfill(Q.night);
  prect(0, FLOOR_Y, 270, 480 - FLOOR_Y, Q.ink);
  prect(0, FLOOR_Y, 270, 1, Q.slate);
}
// ---- the QR itself.  drawQR(x0, y0, m, o): module size m px, top-left at (x0, y0).
//  o.raw: draw the UNMASKED modules (before the mask).  o.col(r, c, v): override a module's colour (return a colour
//  or null for the default), v = 1 dark / 0 light.  o.card: draw the white quiet-zone card (default true).
//  o.show(r, c): return false to leave a module out (drawn as card colour).
function drawQR(x0, y0, m, o = {}) {
  const src = o.raw ? QR_RAW : QR_M, card = o.card ?? true;
  if (card) { prect(x0 - m - 1, y0 - m - 1, 23 * m + 2, 23 * m + 2, Q.slate); prect(x0 - m, y0 - m, 23 * m, 23 * m, Q.white); }
  for (let r = 0; r < QR_N; r++) for (let c = 0; c < QR_N; c++) {
    if (o.show && !o.show(r, c)) continue;
    const v = src[r][c], cc = o.col ? o.col(r, c, v) : null;
    const col = cc ?? (v ? Q.ink : null);
    if (col) prect(x0 + c * m, y0 + r * m, m, m, col);
  }
}
const drawBigQR = (o = {}) => drawQR(QX, QY, QM, o);
// a pixel rectangle outline (w x h px, t px thick)
function pframe(x, y, w, h, col, t = 1) { prect(x, y, w, t, col); prect(x, y + h - t, w, t, col); prect(x, y, t, h, col); prect(x + w - t, y, t, h, col); }
// a pixel arrow from (x0, y0) to (x1, y1), axis-aligned or diagonal; head of size hs at (x1, y1)
function parrow(x0, y0, x1, y1, col, hs = 4) {
  pline(x0, y0, x1, y1, col); pline(x0 + 1, y0, x1 + 1, y1, col);
  const a = Math.atan2(y1 - y0, x1 - x0);
  for (const s of [-1, 1]) pline(x1, y1, Math.round(x1 - hs * Math.cos(a + s * 0.6)), Math.round(y1 - hs * Math.sin(a + s * 0.6)), col);
}
// ---- a phone (slate body, ink screen, camera dot). (x, y) = top-left, w x h px. o.screen(x, y, w, h): draw in the screen.
function phone(x, y, w, h, o = {}) {
  pixBox(x, y, w, h, { bg: Q.slate, edge: Q.ink });
  prect(x + 3, y + 6, w - 6, h - 12, Q.ink);
  prect(x + Math.floor(w / 2) - 2, y + 2, 4, 2, Q.grey);
  if (o.screen) o.screen(x + 3, y + 6, w - 6, h - 12);
}
// ---- the hero (ALWAYS orange, at HERO_PX within 0.5 s of every boundary). o: mood, look, hop, blink
function heroAt(x = HERO_PX[0], y = HERO_PX[1], o = {}) {
  prect(x - 7, FLOOR_Y - 0, 15, 1, Q.ink);   // contact shadow on the floor edge
  return pixHero(x, y, HRP, { pal: HERO_PAL, key: o.key ?? 'hero', ...o });
}
// helpers for "a beat-ish wiggle" that is on whole pixels: wig(period s, amp px, phase)
const wig = (per, amp, ph = 0) => Math.round(amp * Math.sin(TAU * (TT / per + ph)));
