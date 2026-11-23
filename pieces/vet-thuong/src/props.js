// =====================================================================
//  PROPS — vết thương (director's shared helpers; scene agents use them, never edit them)
//  Style: cut-paper (torn shapes, soft shadows) — KHUNG HÌNH GỌN: flat fills, very light grain (grainIn is overridden
//  below: no stipple dots), no dotted patterns (pat.dots banned), ≤ 12 small objects per frame, each r ≥ 18.
//  Text: Pangolin only (Vietnamese glyphs), never boils.
//  Colour = one meaning:  PEACH (COL.skin*)  = skin cells / the epidermis (the hero, its partner, new skin) only
//                         RED (COL.blood*)   = blood: vessels, red cells, liquid blood, new capillaries
//                         YELLOW (COL.plt)   = platelets (tiểu cầu) only
//                         CREAM (COL.fib)    = fibrin threads (sợi huyết) only
//                         BROWN (COL.scab*)  = the scab (vảy) only
//                         LAVENDER (COL.wbc) = white blood cells (bạch cầu) only
//                         GREEN (COL.germ)   = germs / bacteria only
//                         ORANGE (COL.heat)  = inflammation: redness / warmth / swelling glow only
//                         TEAL (COL.col*)    = collagen fibres + fibroblasts (nguyên bào sợi), scar fibres
//                         BLUE (COL.water)   = moisture (water drops, a moist dressing) only
//                         neutrals: pale-pink dermis, sky wall, cream, ink = everything else
// =====================================================================
const COL = {
  skin: '#f2b48f', skinD: '#d68a63', skinL: '#f9d6bd', skinNew: '#f7c2b0',
  blood: '#c43a45', bloodD: '#93222d', bloodL: '#e98d93',
  plt: '#f2c94c', pltD: '#c99a1c',
  fib: '#fff3d2', fibD: '#d9c48e',
  scab: '#7a4a2e', scabD: '#55311d', scabL: '#a06a46',
  wbc: '#b9a6e6', wbcD: '#8a74c8',
  germ: '#7fb04a', germD: '#557d2c',
  heat: '#ec7a4f', heatL: '#fbd2bd',
  col: '#3f9f9a', colL: '#a9d9c6', colD: '#2b7470',
  water: '#4c8fd0', waterL: '#d4e7f6',
  dermis: '#f6dcd2', dermisD: '#e9bfb2', fat: '#f6e3a8', fatD: '#e5cb7e', gran: '#eea69a',
  sky: '#d6e8ee', text: '#2a1d18', textD: '#6a5a50',
};
const VFONT = HAND;

// ---- KHUNG HÌNH GỌN: replace the kit's grain (thousands of stipple dots per shape) with a few soft fibres only
function grainIn(bb, key, k = 1) {
  pencil(bb, { key: key + 'fb', c: '#ffffff', al: 0.08, per: 1400, len: 30, w: 1, a: -0.35, max: 260 });
}
STYLE.post = () => grain({ n: 220, dark: 'rgba(70,45,25,0.06)', light: 'rgba(255,250,236,0.08)' });

// a spring-in 0..1 from time t0 (overshoots a hair), 0 before t0
const pop = (t0, p = SPRING.playful) => (TT < t0 ? 0 : springEase(TT - t0, p.k, p.d));

// ---- screen/world text (Pangolin, no boil). o: { col, align, al, weight }
function vtext(str, x, y, size = 54, o = {}) {
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  ctx.font = `${o.weight ?? 400} ${size}px ${VFONT}`; ctx.fillStyle = o.col ?? COL.text;
  ctx.textAlign = o.align ?? 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(str, x, y); const w = ctx.measureText(str).width; ctx.restore(); return w;
}
// a label that springs in at t0 (rises 14 px, fades in). Text must be ≥ 50 px and inside x 60–940.
function vlabel(str, x, y, t0, size = 54, o = {}) {
  const a = clamp(pop(t0, SPRING.smooth)); if (a <= 0.001) return;
  vtext(str, x, y + (1 - a) * 14, size, { ...o, al: a * (o.al ?? 1) });
}
// a torn paper tag with text that pops in at t0 (kit tag); o: { fill, color, rot, tape }
function ptag(str, x, y, t0, size = 54, o = {}) {
  const s = pop(t0); if (s <= 0.01) return;
  tag(str, x, y, size, { ...o, s });
}

// ---- the scene tag top-left (number + rule + label), drawn at screen size after the camera
function viTagDraw(num, label, now) {
  const a = now ? 1 : clamp(pop(E0 + 0.15, SPRING.smooth));
  if (a <= 0.001) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = `400 40px ${VFONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = COL.textD; ctx.fillText(num, 70, 330); const w = ctx.measureText(num).width;
  ctx.strokeStyle = COL.textD; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(70 + w + 16, 318); ctx.lineTo(70 + w + 16 + 50 * a, 318); ctx.stroke();
  ctx.font = `400 54px ${VFONT}`; ctx.fillStyle = COL.text; ctx.fillText(label, 70 + w + 84, 332);
  ctx.restore();
}
const viTag = (num, label) => { const f = () => viTagDraw(num, label, false); if (DEFER) DEFER.push(f); else f(); };
const viTagNow = (num, label) => { const f = () => viTagDraw(num, label, true); if (DEFER) DEFER.push(f); else f(); };
// ---- the caption on a cream paper strip (≤ 2 short lines, y ≈ 1300–1450; one highlighted word optional)
// lines: ['dòng 1', 'dòng 2'], hi: [lineIndex, 'word'], o: { at (s after era start), col (highlight colour), now }
function viCaptionDraw(lines, hi, o) {
  const a = o.now ? 1 : clamp(pop(E0 + (o.at ?? 0.5), SPRING.smooth));
  if (a <= 0.001) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = `400 60px ${VFONT}`; ctx.textBaseline = 'alphabetic';
  const wmax = Math.max(...lines.map((s) => ctx.measureText(s).width));
  const y0 = 1300 + (1 - a) * 16, h = 40 + lines.length * 72;
  ctx.save(); ctx.shadowColor = 'rgba(35,20,10,0.22)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
  trace(torn(rect(CX - wmax / 2 - 34, y0, wmax + 68, h, 4), 'capstrip' + lines.length, 1.4), true); ctx.fillStyle = '#fbf6ea'; ctx.fill(); ctx.restore();
  lines.forEach((s, i) => {
    const y = y0 + 76 + i * 72, w = ctx.measureText(s).width, x = CX - w / 2;
    if (hi && hi[0] === i && s.includes(hi[1])) {
      const k = s.indexOf(hi[1]), pre = ctx.measureText(s.slice(0, k)).width, hw = ctx.measureText(hi[1]).width;
      ctx.fillStyle = o.col ?? COL.heatL; ctx.fillRect(x + pre - 8, y - 48, hw + 16, 62);
    }
    ctx.fillStyle = COL.text; ctx.textAlign = 'left'; ctx.fillText(s, x, y);
  });
  ctx.restore();
}
const viCaption = (lines, hi, o = {}) => { const f = () => viCaptionDraw(lines, hi, o); if (DEFER) DEFER.push(f); else f(); };


// =====================================================================
//  THE HERO — one skin cell ("tế bào da"): a peach paper blob (a soft rounded square) with a face.
//  heroCell(x, y, r, { mood: 'calm'|'wow'|'happy'|'focus'|'sad', look -1..1, stretch 0..1 (crawling: longer along x,
//  flatter), dir 1 (faces/crawls right) | -1, wave 0..1 (a little arm waving up), partner (true = the partner cell from
//  the RIGHT edge: same peach, a small teal hair-clip so the two are told apart), key })
//  (x, y) = centre, r = half its height. The body is ≈ 1.1 r wide each side (more when stretching).
// =====================================================================
function cellPts(x, y, r, stretch = 0, n = 48, dir = 1) {
  const P = [], sx = 1.1 + 0.45 * stretch, sy = 1 - 0.22 * stretch;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, c = Math.cos(a), s = Math.sin(a);
    const q = 1 / Math.pow(Math.pow(Math.abs(c), 3) + Math.pow(Math.abs(s), 3), 1 / 3);   // a soft square (superellipse)
    const lead = 1 + 0.18 * stretch * Math.max(0, c * dir);                                // the leading edge reaches out
    P.push([x + c * q * r * sx * lead, y + s * q * r * sy]);
  }
  return P;
}
function heroCell(x, y, r = 58, o = {}) {
  const key = o.key ?? (o.partner ? 'partner' : 'hero'), st = clamp(o.stretch ?? 0), dir = o.dir ?? (o.partner ? -1 : 1);
  y += Math.sin(TT * TAU * 0.55 + (o.partner ? 1.7 : 0)) * r * 0.035 * (1 - st);              // idle bob
  const P = cellPts(x, y, r, st, 48, dir);
  cut(P, COL.skin, { key: key + 'b', tear: 0.7, sb: 9, sy: 5, grain: 0.5, crayon: COL.skinD, crAl: 0.18, crPer: 60 });
  // nucleus hint: a soft darker peach oval behind the face (big, flat, not a dot)
  ctx.fillStyle = 'rgba(214,138,99,0.22)'; ctx.beginPath(); ctx.ellipse(x - dir * r * 0.05, y - r * 0.05, r * 0.62, r * 0.5, 0, 0, TAU); ctx.fill();
  const s = r / 64, lk = ((o.look ?? 0) + dir * 0.25 * st) * r * 0.14, fy = y - r * 0.08, I = PAL.ink;
  const mood = o.mood ?? 'calm', blink = mod(TT + (o.partner ? 1.3 : 0), 3.2) < 0.1;
  for (const ex of [-0.3, 0.3]) {
    const cx = x + ex * r + lk;
    if (mood === 'happy') ink(arcPts(cx, fy + 5 * s, 8 * s, Math.PI * 1.15, Math.PI * 1.85, 8), { w: 3.8 * s, color: I, amt: 0.2, key: key + 'eh' + ex });
    else if (mood === 'focus' || blink) ink([[cx - 7 * s, fy], [cx + 7 * s, fy]], { w: 3.8 * s, color: I, amt: 0.2, key: key + 'ef' + ex });
    else { dot(cx, fy, (mood === 'wow' ? 8 : 6.5) * s, I); dot(cx + 2.2 * s, fy - 2.4 * s, 2.2 * s, '#fff'); }
  }
  ctx.fillStyle = 'rgba(240,110,120,0.45)'; ctx.beginPath(); ctx.ellipse(x - r * 0.5 + lk, fy + 13 * s, 8 * s, 5 * s, 0, 0, TAU); ctx.ellipse(x + r * 0.5 + lk, fy + 13 * s, 8 * s, 5 * s, 0, 0, TAU); ctx.fill();
  const my = fy + 20 * s;
  if (mood === 'wow') { ctx.fillStyle = I; ctx.beginPath(); ctx.ellipse(x + lk, my + 2 * s, 5.5 * s, 7.5 * s, 0, 0, TAU); ctx.fill(); }
  else if (mood === 'happy') { ctx.fillStyle = I; ctx.beginPath(); ctx.arc(x + lk, my - 2 * s, 10 * s, 0, Math.PI); ctx.closePath(); ctx.fill(); }
  else if (mood === 'sad') ink(arcPts(x + lk, my + 10 * s, 9 * s, Math.PI * 1.2, Math.PI * 1.8, 8), { w: 3.4 * s, color: I, amt: 0.2, key: key + 'ms' });
  else ink(arcPts(x + lk, my - 8 * s, 9 * s, Math.PI * 0.2, Math.PI * 0.8, 8), { w: 3.4 * s, color: I, amt: 0.2, key: key + 'mc' });
  if (o.partner) cut(rect(x + r * 0.35, y - r * 1.02, r * 0.5, r * 0.26, 6), PAL.teal, { key: key + 'clip', tear: 0.3, sb: 3, sy: 2, grain: false });
  const wv = clamp(o.wave ?? 0);
  if (wv > 0.01) {                                                                          // a little arm waving
    const ax = x - dir * r * 0.95, ay = y + r * 0.05, ang = -Math.PI / 2 - dir * (0.5 + 0.35 * Math.sin(TT * TAU * 2)) * wv;
    cut(capsulePts(ax, ay, ax + Math.cos(ang) * r * 0.75 * wv, ay + Math.sin(ang) * r * 0.75 * wv, r * 0.26, 6), COL.skin, { key: key + 'arm', tear: 0.4, sb: 4, sy: 3, grain: 0.4 });
  }
  if (!o.partner) SPARK_AT = toScreen(x, y);
}
STYLE.hero = (x, y, r, o = {}) => heroCell(x, y, r, { key: 'hero' + (o.key ?? '') });
STYLE.heroPts = (x, y, r, n = 96) => cellPts(x, y, r, 0, n);
STYLE.heroColor = COL.skin;

// =====================================================================
//  CAST — big, simple, readable cells (r ≥ 18). Faces are optional (face: true) and tiny.
// =====================================================================
// a plain skin cell (the epidermis row): peach rounded square, no face. o.c overrides the colour (COL.skinNew = new skin)
function skinCell(x, y, r, o = {}) { cut(cellPts(x, y, r, 0, 32), o.c ?? COL.skin, { key: o.key ?? ('sc' + Math.round(x) + '_' + Math.round(y)), tear: 0.6, sb: 5, sy: 3, grain: 0.3 }); }
// a red blood cell: a red disc with a paler dimple (biconcave); a = tilt (rad) -> it can be seen edge-on (squashed)
function redCell(x, y, r = 22, o = {}) {
  const a = o.a ?? 0, sq = o.sq ?? 1;
  cut(ellipsePts(x, y, r, r * sq, a, 20), COL.blood, { key: o.key ?? ('rc' + Math.round(x) + Math.round(y)), tear: 0.4, sb: 4, sy: 2, grain: false, shade: false });
  ctx.fillStyle = 'rgba(255,170,170,0.35)'; ctx.beginPath(); ctx.ellipse(x, y, r * 0.45, r * 0.45 * sq, a, 0, TAU); ctx.fill();
}
// a platelet: a yellow lumpy disc. o.stick 0..1 -> it sprouts 4 short spiky arms (activated, sticky); o.face
function platelet(x, y, r = 22, o = {}) {
  const key = o.key ?? ('pl' + Math.round(x) + Math.round(y)), st = clamp(o.stick ?? 0);
  const P = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; const sp = 1 + 0.5 * st * Math.max(0, Math.cos(4 * a + (o.rot ?? 0))) ** 6; P.push([x + Math.cos(a) * r * 1.15 * sp, y + Math.sin(a) * r * 0.85 * sp]); }
  cut(P, COL.plt, { key, tear: 0.4, sb: 4, sy: 2, grain: false });
  if (o.face) { const s = r / 30; dot(x - 8 * s, y - 2 * s, 3.2 * s, PAL.ink); dot(x + 8 * s, y - 2 * s, 3.2 * s, PAL.ink); }
}
// a white blood cell: a big lavender blob with a face; o.eat 0..1 opens a wide mouth (it engulfs a germ); o.look
function wbc(x, y, r = 60, o = {}) {
  const key = o.key ?? ('wb' + Math.round(x)), eat = clamp(o.eat ?? 0);
  const P = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; const w = 1 + 0.07 * Math.sin(3 * a + TT * 3 + x) + 0.05 * Math.sin(5 * a - TT * 2); P.push([x + Math.cos(a) * r * w, y + Math.sin(a) * r * 0.9 * w]); }
  cut(P, COL.wbc, { key, tear: 0.6, sb: 8, sy: 4, grain: 0.4 });
  const s = r / 64, lk = (o.look ?? 0) * r * 0.15, fy = y - r * 0.15, I = PAL.ink;
  if (eat > 0.5) for (const ex of [-0.28, 0.28]) ink([[x + ex * r + lk - 7 * s, fy], [x + ex * r + lk + 7 * s, fy]], { w: 4 * s, color: I, amt: 0.2, key: key + 'e' + ex });
  else for (const ex of [-0.28, 0.28]) { dot(x + ex * r + lk, fy, 7 * s, I); dot(x + ex * r + lk + 2.4 * s, fy - 2.4 * s, 2.4 * s, '#fff'); }
  if (eat > 0.02) { ctx.fillStyle = '#4b2a5c'; ctx.beginPath(); ctx.ellipse(x + lk, fy + 26 * s, lerp(8, 26, eat) * s, lerp(4, 22, eat) * s, 0, 0, TAU); ctx.fill(); }
  else ink(arcPts(x + lk, fy + 12 * s, 10 * s, Math.PI * 0.2, Math.PI * 0.8, 8), { w: 3.6 * s, color: I, amt: 0.2, key: key + 'm' });
}
// a germ (bacterium): a green capsule with 4 short hairs and a grumpy face; a = angle
function germ(x, y, r = 24, o = {}) {
  const key = o.key ?? ('gm' + Math.round(x) + Math.round(y)), a = o.a ?? 0, c = Math.cos(a), s = Math.sin(a);
  for (let i = 0; i < 4; i++) { const t = (i - 1.5) * 0.55, bx = x + c * r * t, by = y + s * r * t, w = Math.sin(TT * 9 + i) * 4;
    ink([[bx - s * r * 0.55, by + c * r * 0.55], [bx - s * r * 0.95 + w, by + c * r * 0.95]], { w: 3, color: COL.germD, amt: 0.2, key: key + 'h' + i }); }
  cut(capsulePts(x - c * r * 0.9, y - s * r * 0.9, x + c * r * 0.9, y + s * r * 0.9, r * 1.1, 6), COL.germ, { key, tear: 0.4, sb: 4, sy: 2, grain: false });
  const k = r / 24; ink([[x - 9 * k, y - 6 * k], [x - 3 * k, y - 3 * k]], { w: 2.6 * k, color: PAL.ink, amt: 0.1, key: key + 'b1' }); ink([[x + 9 * k, y - 6 * k], [x + 3 * k, y - 3 * k]], { w: 2.6 * k, color: PAL.ink, amt: 0.1, key: key + 'b2' });
  dot(x - 5 * k, y + 1 * k, 2.6 * k, PAL.ink); dot(x + 5 * k, y + 1 * k, 2.6 * k, PAL.ink);
}
// a fibroblast: a teal spindle cell with a small face; o.weave 0..1 -> it trails a collagen fibre behind it (to -x*dir)
function fibroblast(x, y, r = 46, o = {}) {
  const key = o.key ?? ('fb' + Math.round(x)), a = o.a ?? 0;
  const P = []; for (let i = 0; i < 32; i++) { const t = i / 32 * TAU; const rx = r * 1.5, ry = r * 0.62 * (0.75 + 0.25 * Math.abs(Math.sin(t))); P.push([Math.cos(t) * rx * (1 + 0.25 * Math.cos(t) ** 8), Math.sin(t) * ry]); }
  const Q = P.map(([px, py]) => [x + px * Math.cos(a) - py * Math.sin(a), y + px * Math.sin(a) + py * Math.cos(a)]);
  cut(Q, COL.col, { key, tear: 0.5, sb: 6, sy: 3, grain: 0.3 });
  const s = r / 46; dot(x - 9 * s, y - 4 * s, 4.2 * s, PAL.ink); dot(x + 9 * s, y - 4 * s, 4.2 * s, PAL.ink);
  ink(arcPts(x, y + 1 * s, 7 * s, Math.PI * 0.2, Math.PI * 0.8, 8), { w: 2.8 * s, color: PAL.ink, amt: 0.2, key: key + 'm' });
}
// a collagen fibre: a wavy teal ribbon along polyline P, drawn from the start to fraction k (0..1)
function collagen(P, k = 1, o = {}) {
  if (k <= 0.01) return; const Q = subPath(resample(P, false, 8), clamp(k));
  ink(Q, { w: o.w ?? 9, color: o.c ?? COL.col, amt: 0.4, key: o.key ?? ('cg' + Math.round(P[0][0]) + Math.round(P[0][1])) });
}
// fibrin threads: n cream strands criss-crossing the box (x0, y0)-(x1, y1), each growing in over k (0..1);
// o.inCut: clip to the cut (skCutPts, o.puff); o.n, o.w, o.key
function fibrinNet(x0, y0, x1, y1, k, o = {}) {
  if (k <= 0.01) return; const n = o.n ?? 7, R = RNG('fib', o.key ?? 'f', Math.round(x0));
  if (o.inCut) { ctx.save(); trace(skCutPts(o.puff ?? 0), true); ctx.clip(); }
  for (let i = 0; i < n; i++) {
    const ka = clamp(k * 1.4 - i * 0.4 / n); if (ka <= 0) continue;
    const ya = lerp(y0, y1, R.f()), yb = lerp(y0, y1, R.f()), P = [[x0, ya], [lerp(x0, x1, 0.35), lerp(ya, yb, 0.3) + R.n(18)], [lerp(x0, x1, 0.7), lerp(ya, yb, 0.7) + R.n(18)], [x1, yb]];
    const Q = subPath(resample(i % 2 ? P.slice().reverse() : P, false, 8), clamp(ka));
    ink(Q, { w: o.w ?? 6, color: o.c ?? COL.fib, amt: 0.5, key: (o.key ?? 'fn') + i });
  }
  if (o.inCut) ctx.restore();
}
// a blue water drop (moisture), tip up
function waterDrop(x, y, r = 30, o = {}) {
  const P = []; for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; const k = Math.sin(a) < 0 ? 1 + 0.9 * Math.pow(-Math.sin(a), 3) : 1; P.push([x + Math.cos(a) * r / k ** 0.8, y + Math.sin(a) * r * (Math.sin(a) < 0 ? 1.5 : 1)]); }
  cut(P, COL.water, { key: o.key ?? ('wd' + Math.round(x)), tear: 0.3, sb: 5, sy: 3, grain: false });
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.ellipse(x - r * 0.35, y - r * 0.1, r * 0.16, r * 0.3, 0.3, 0, TAU); ctx.fill();
}

// =====================================================================
//  THE SKIN SLICE — the shared stage of plug / clot / clean / fill / crawl / meet / scar (and the hook's cut-away).
//  Geometry (world px): sky wall above y 600 (the skin surface). Epidermis = ONE row of big peach cells (r 50) centred
//  on y 650 (r 54), slots x = 290 − 112 k (left of the cut) and 790 + 112 k (right). The cut (wound) is a U-shaped
//  notch: top x 340–740 at the surface y 600, bottom x 470–610 at y 1080. Dermis (pale pink) y 708–1180 with ONE
//  horizontal blood vessel (red tube, centre y 1020, ~46 thick) that the cut severs: stubs end at x 470 / 610.
//  Fat lobes y 1180–1240, then a plain darker band to the bottom (the caption zone stays calm).
//  SK.edgeL = [290, 650] = the hero's home (slot left free unless o.heroX says otherwise); the partner is drawn by the
//  slice at o.partner ([x, y, r]; default [790, 650, 60]; null = not drawn), with o.partnerO passed to heroCell.
//  State o (all 0..1 unless said):
//   squash   the vessel stubs narrow (vasoconstriction)          bleed   red trickle from the stubs into the cut
//   blood    liquid red fills the cut from the bottom (1 = to the surface, a slight bulge above)
//   scab     the clot's top turns into a brown crust (y ≈ 555–650 over the cut); scabDry 0..1: red-brown -> dark brown
//   redness  a soft flat orange glow in the dermis around the cut (inflammation) + the cut sides puff out a little
//   fill     new pinkish tissue (granulation) rises from the bottom: top y = lerp(1080, 760, fill); the clot above it
//            stays dark red up to the scab; collagen 0..1 draws teal wavy fibres across the new tissue
//   capil    new capillaries: thin red loops sprouting up from the vessel stubs into the new tissue
//   epiL, epiR  new skin tongues under the scab: TIP x of the left tongue (from 340 toward the centre) and of the right
//            tongue (from 740 toward the centre); trailing new-skin cells (r 32) along y 712 fill edge→tip. null = none.
//   lift     the scab lifts off (rises ~80 px, tilts) and is gone at 1
//   closed   1 = healed: the top row continues across with NEW skin cells (COL.skinNew) at SK.newX = 390, 490, 590, 690 (y 650),
//            the cut is gone; scar 0..1 = straight parallel teal fibres in the old cut region (paler, denser)
//   heroX    which top-row slot the hero occupies (left blank): default 345
// =====================================================================
const SK = { top: 600, row: 650, cellR: 54, step: 112, edgeL: [290, 650], edgeR: [790, 650], cutL: 340, cutR: 740,
  botL: 470, botR: 610, bot: 1080, derm: 708, vy: 1020, vw: 46, fatY: 1180, fillTop: 760, epiY: 712, newX: [390, 490, 590, 690] };
// the cut's outline (U notch), optional puff (inflammation) pushing the sides in a little
function skCutPts(puff = 0) {
  const P = [];
  for (let i = 0; i <= 12; i++) { const u = i / 12, y = lerp(SK.top, SK.bot - 40, u); P.push([lerp(SK.cutL, SK.botL, Math.pow(u, 0.8)) + puff * 14 * Math.sin(Math.PI * u), y]); }
  for (let i = 0; i <= 8; i++) { const a = Math.PI - i / 8 * Math.PI; P.push([(SK.botL + SK.botR) / 2 + Math.cos(a) * (SK.botR - SK.botL) / 2, SK.bot - 40 + Math.sin(a) * 40]); }
  for (let i = 12; i >= 0; i--) { const u = i / 12, y = lerp(SK.top, SK.bot - 40, u); P.push([lerp(SK.cutR, SK.botR, Math.pow(u, 0.8)) - puff * 14 * Math.sin(Math.PI * u), y]); }
  return P;
}
// x-extent of the cut at height y (for clipping fills)
function skCutX(y, puff = 0) { const u = clamp((y - SK.top) / (SK.bot - 40 - SK.top)); const p = puff * 14 * Math.sin(Math.PI * u); return [lerp(SK.cutL, SK.botL, Math.pow(u, 0.8)) + p, lerp(SK.cutR, SK.botR, Math.pow(u, 0.8)) - p]; }
function skinSlice(o = {}) {
  const closed = clamp(o.closed ?? 0), puff = clamp(o.redness ?? 0);
  // sky wall + dermis + fat + lower band
  cut(rect(-40, -40, W + 80, SK.top + 80, 0), COL.sky, { key: 'skwall', shadow: false, tear: 0, grain: 0.3 });
  cut(rect(-40, SK.top + 40, W + 80, SK.fatY - SK.top, 0), COL.dermis, { key: 'skderm', shadow: false, tear: 0.5, grain: 0.3 });
  for (let i = 0; i < 6; i++) cut(ellipsePts(-20 + i * 200, SK.fatY + 40, 112, 58, 0, 24), COL.fat, { key: 'skfat' + i, tear: 0.6, sb: 4, sy: 2, grain: 0.3 });
  cut(rect(-40, SK.fatY + 80, W + 80, H - SK.fatY, 0), COL.dermisD, { key: 'sklow', shadow: false, tear: 0.6, grain: 0.3 });
  // inflammation glow (flat, under everything in the dermis)
  if (puff > 0.01) { ctx.save(); ctx.globalAlpha = 0.42 * puff; ctx.fillStyle = COL.heatL; ctx.beginPath(); ctx.ellipse(540, 850, 360 + 20 * puff, 280, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 0.25 * puff; ctx.fillStyle = COL.heat; ctx.beginPath(); ctx.ellipse(540, 830, 260, 210, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  // the vessel: full tube when closed, else two stubs that end at the cut (squash narrows the ends)
  const sq = clamp(o.squash ?? 0);
  const vessel = (x0, x1, endAt, key) => {
    const P = []; for (let i = 0; i <= 20; i++) { const x = lerp(x0, x1, i / 20), near = 1 - clamp(Math.abs(x - endAt) / 150); P.push([x, SK.vy - SK.vw / 2 * (1 - 0.6 * sq * near)]); }
    for (let i = 20; i >= 0; i--) { const x = lerp(x0, x1, i / 20), near = 1 - clamp(Math.abs(x - endAt) / 150); P.push([x, SK.vy + SK.vw / 2 * (1 - 0.6 * sq * near)]); }
    cut(P, COL.blood, { key, tear: 0.4, sb: 5, sy: 3, grain: 0.2 });
  };
  if (closed > 0.5) vessel(-40, W + 40, -999, 'skvfull');
  else { vessel(-40, SK.botL + 6, SK.botL, 'skvL'); vessel(SK.botR - 6, W + 40, SK.botR, 'skvR'); }
  // the cut cavity (dark pink when empty), then its contents
  if (closed < 0.5) {
    const C = skCutPts(puff);
    cut(C, '#e7a99d', { key: 'skcut', shadow: false, tear: 0.6, grain: false });
    ctx.save(); trace(C, true); ctx.clip();
    const bl = clamp(o.blood ?? 0), fl = clamp(o.fill ?? 0);
    if (bl > 0.01) { const ty = lerp(SK.bot + 10, SK.top - 6, bl); cut(rect(250, ty, 580, SK.bot + 60 - ty, 0), COL.blood, { key: 'skbl', shadow: false, tear: 0.8, grain: false }); }
    if (fl > 0.01) {
      const ty = lerp(SK.bot + 10, SK.fillTop, fl);
      cut([[250, SK.bot + 60], [250, ty + 10], [420, ty - 8], [540, ty + 6], [660, ty - 6], [830, ty + 8], [830, SK.bot + 60]], COL.gran, { key: 'skgran', shadow: false, tear: 0.8, grain: false });
      const cg = clamp(o.collagen ?? 0);
      for (let i = 0; i < 4; i++) { const y = lerp(SK.bot - 30, ty + 30, (i + 0.5) / 4); if (y < ty + 18) continue; const [a, b] = skCutX(y, puff);
        collagen([[a - 10, y], [lerp(a, b, 0.33), y - 14], [lerp(a, b, 0.66), y + 12], [b + 10, y - 4]], cg * 1.3 - i * 0.1, { key: 'skcg' + i, w: 8 }); }
      const cp = clamp(o.capil ?? 0);
      if (cp > 0.01) for (const [sx, d] of [[SK.botL + 6, 1], [SK.botR - 6, -1]]) {
        const top = Math.max(ty + 50, SK.fillTop + 60), P = [];
        for (let i = 0; i <= 16; i++) { const u = i / 16, a = Math.PI * u; P.push([sx + d * (40 - 40 * Math.cos(a)) * 0.9, lerp(SK.vy - 10, top, Math.sin(a) * 0.98 + 0.02 * u)]); }
        ink(subPath(P, cp), { w: 8, color: COL.blood, amt: 0.3, key: 'skcp' + d });
      }
    }
    ctx.restore();
    const bd = clamp(o.bleed ?? 0);
    if (bd > 0.01 && bd < 1) for (const [sx, d] of [[SK.botL, 1], [SK.botR, -1]]) cut(capsulePts(sx, SK.vy, sx + d * 30 * bd, SK.vy - 80 * bd, 18, 6), COL.blood, { key: 'skbd' + d, shadow: false, tear: 0.4, grain: false });
  }
  // the epidermis row (big cells), skipping the hero's slot and the partner slot (the partner is drawn as a character)
  const heroX = o.heroX === null ? -9999 : (o.heroX ?? SK.edgeL[0]);   // heroX: null = the hero left its slot (fill it)
  const pSlot = o.partner === undefined || (o.partner && Math.abs(o.partner[0] - SK.edgeR[0]) < 2 && Math.abs(o.partner[1] - SK.edgeR[1]) < 2);
  for (let k = 0; k < 5; k++) for (const x of [SK.edgeL[0] - SK.step * k, SK.edgeR[0] + SK.step * k]) {
    if (Math.abs(x - heroX) < 2 || (Math.abs(x - SK.edgeR[0]) < 2 && pSlot)) continue;
    skinCell(x, SK.row, SK.cellR, { key: 'skr' + x });
  }
  if (closed > 0.5) for (const x of SK.newX) if (Math.abs(x - heroX) > 2) skinCell(x, SK.row, SK.cellR, { key: 'skn' + x, c: COL.skinNew });
  // the scar: straight parallel teal fibres where the cut was
  const scr = clamp(o.scar ?? 0);
  if (closed > 0.5 && scr > 0.01) for (let i = 0; i < 5; i++) { const y = 780 + i * 56, [a, b] = skCutX(y); collagen([[a - 30, y], [b + 30, y]], scr * 1.4 - i * 0.1, { key: 'sksc' + i, w: 8, c: COL.colL }); }
  // new skin tongues under the scab (trailing cells from the edges to the tips)
  if (o.epiL != null && o.epiL > SK.cutL + 10) for (let x = SK.cutL + 24; x < o.epiL - 44; x += 62) skinCell(x, SK.epiY, 32, { key: 'skeL' + x, c: COL.skinNew });
  if (o.epiR != null && o.epiR < SK.cutR - 10) for (let x = SK.cutR - 24; x > o.epiR + 44; x -= 62) skinCell(x, SK.epiY, 32, { key: 'skeR' + x, c: COL.skinNew });
  // the scab (a brown torn crust over the cut), lifting at the end
  const sc = clamp(o.scab ?? 0), lf = clamp(o.lift ?? 0);
  if (sc > 0.01 && lf < 0.999) {
    const dry = clamp(o.scabDry ?? 1), col = mixHex(COL.bloodD, COL.scab, dry);
    ctx.save(); ctx.translate(540, SK.top - 80 * EZ.o2(lf)); ctx.rotate(-0.12 * lf); ctx.translate(-540, -SK.top);
    const S = [[SK.cutL - 26, SK.top + 4], [SK.cutL - 6, SK.top - 30], [470, SK.top - 44], [540, SK.top - 40], [610, SK.top - 46], [SK.cutR + 8, SK.top - 28], [SK.cutR + 26, SK.top + 6], [SK.cutR - 20, SK.top + 40], [610, SK.top + 50], [540, SK.top + 46], [470, SK.top + 52], [SK.cutL + 20, SK.top + 40]];
    const Ssc = S.map(([x, y]) => [x, lerp(SK.top, y, sc)]);
    cut(Ssc, col, { key: 'skscab', tear: 2.2, sb: 8, sy: 5, grain: 0.5, crayon: dry > 0.5 ? COL.scabD : undefined, crAl: 0.3, crPer: 40 });
    ctx.restore();
  }
  // the partner (the cell at the RIGHT edge)
  if (o.partner !== null) { const p = o.partner ?? [SK.edgeR[0], SK.edgeR[1], 60]; heroCell(p[0], p[1], p[2], { partner: true, ...(o.partnerO ?? {}) }); }
}

// =====================================================================
//  SMALL PIECES
// =====================================================================
// a paper thermometer: bulb at (x, y), tube up to y - h. v 0..1 fill; col: COL.heat (hot) or COL.cool (cool)
function thermo(x, y, h, v, o = {}) {
  const c = o.col ?? COL.heat, key = o.key ?? 'th';
  cut(capsulePts(x, y - h, x, y, 44, 6), '#fbf6ea', { key: key + 'tb', sb: 6, sy: 4 });
  cut(ellipsePts(x, y + 6, 36, 36, 0, 22), c, { key: key + 'bu', sb: 6, sy: 4 });
  const top = y - (h - 18) * clamp(v);
  if (v > 0.01) cut(capsulePts(x, top, x, y, 20, 4), c, { key: key + 'fl', shadow: false, tear: 0.4 });
  for (let i = 1; i <= 4; i++) ink([[x + 24, y - h * i / 5], [x + 36, y - h * i / 5]], { w: 3, color: COL.textD, amt: 0.2, key: key + 'tk' + i });
}
// a wavy arrow from (x0, y0) to (x1, y1); part 0..1 grows from the tail; col COL.heat / COL.cool / COL.blood
function waveArrow(x0, y0, x1, y1, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01) return;
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux;
  const P = [], amp = o.amp ?? 10, ph = (o.ph ?? 0) + TT * 6;
  for (let i = 0; i <= 26; i++) { const sx = (i / 26) * L * k; const w = Math.sin(sx / 24 - ph) * amp * Math.min(1, sx / 30, (L * k - sx) / 30 + 0.2); P.push([x0 + ux * sx + nx * w, y0 + uy * sx + ny * w]); }
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  const col = o.col ?? COL.heat, lw = o.w ?? 9;
  ink(P, { w: lw, color: col, amt: 0.3, key: (o.key ?? 'wa') + 'l' });
  const e = P[P.length - 1], hl = o.head ?? 26;
  ink([[e[0] - ux * hl + nx * hl * 0.6, e[1] - uy * hl + ny * hl * 0.6], e, [e[0] - ux * hl - nx * hl * 0.6, e[1] - uy * hl - ny * hl * 0.6]], { w: lw, color: col, amt: 0.3, key: (o.key ?? 'wa') + 'h' });
  ctx.restore();
}
// a straight arrow (ink by default)
function simpleArrow(x0, y0, x1, y1, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01) return;
  const ex = lerp(x0, x1, k), ey = lerp(y0, y1, k), L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, hl = o.head ?? 24;
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  const col = o.col ?? COL.textD, lw = o.w ?? 7;
  ink([[x0, y0], [ex, ey]], { w: lw, color: col, amt: 0.3, key: (o.key ?? 'sa') + 'l' });
  ink([[ex - ux * hl + nx * hl * 0.6, ey - uy * hl + ny * hl * 0.6], [ex, ey], [ex - ux * hl - nx * hl * 0.6, ey - uy * hl - ny * hl * 0.6]], { w: lw, color: col, amt: 0.3, key: (o.key ?? 'sa') + 'h' });
  ctx.restore();
}
// a full-bleed wall + floor/table for a scene (one dominant wall colour per scene; flat, no dotted pattern)
function room(wall, floorY = 1180, floor = PAL.wood, key = 'room') {
  cut(rect(-40, -40, W + 80, floorY + 40, 0), wall, { key: key + 'w', shadow: false, tear: 0, grain: 0.4 });
  cut(rect(-40, floorY, W + 80, H - floorY + 40, 0), floor, { key: key + 'f', tear: 0.6, sy: -4, grain: 0.4 });
}
