// =====================================================================
//  PROPS — wifi (director's shared helpers; scene agents use them, never edit them)
//  Style: math (manim look: near-black flat stage, clean vector strokes, serif type that is Written on, no grain,
//  no boil). KHUNG HÌNH GỌN: one subject per frame, ≤ 12 small objects, each r ≥ 18; never fields of dots.
//  Text: serif (MATH_SERIF renders Vietnamese), ≥ 50 px, inside x 60–940, never below y 1260.
//  Colour = one meaning (keep it everywhere: figure, labels, readouts):
//    YELLOW (COL.bit)   = data: the bits 0 / 1, bit groups, the decoded data             only
//    BLUE   (COL.wave)  = the radio wave (sóng vô tuyến / sóng mang) and the Wi‑Fi arcs  only
//    RED    (COL.amp)   = amplitude (độ cao của sóng): its brace, its label               only
//    GREEN  (COL.phase) = phase (độ lệch / thời điểm của sóng): its marks, its label      only
//    PURPLE (COL.elec)  = electrons (the charges that jiggle in an antenna)               only
//    GOLD   (COL.photo) = the photo being sent (bức ảnh: sun + hills)                     only
//    TEAL   (COL.ack)   = the receiver's "đã nhận" (ACK) reply                            only
//    greys = devices (router, phone, wall), axes, guides.  pi-blue = the hero only.
//    The visible-light rainbow appears ONLY in the spectrum strip (hook / end).
// =====================================================================
const COL = {
  bit: MC.yellow, wave: MC.blue, amp: MC.red, phase: MC.green, elec: MC.purple, photo: MC.gold, ack: MC.teal,
  dev: MC.grey, devD: MC.greyC, guide: MC.greyD, text: MC.white, textD: MC.grey,
};
const VFONT = MATH_SERIF;

// ---- text (serif, never boils). vt = Written text (p 0..1 from runS), vtNow = already written
const vt = (str, x, y, size, p, o = {}) => writeText(typeof str === 'string' ? [{ s: str, c: o.col ?? COL.text, it: o.it }] : str, x, y, size, p, { align: o.align ?? 'center', alpha: o.al ?? 1, lag: o.lag ?? 0.8 });
const vtNow = (str, x, y, size, o = {}) => vt(str, x, y, size, 1, o);

// ---- the section tag top-left: grey number + rule + white label (≥ 50 px), Written at era start, drawn after the camera
function viTagDraw(num, label, now) {
  const p = now ? 1 : runS(E0 + 0.15, 0.8);
  if (p <= 0.001) return;
  ctx.save(); ctx.font = fontM(44); const w = ctx.measureText(num).width; ctx.restore();
  writeText([{ s: num, c: MC.greyC }], 70, 330, 44, p, { align: 'left' });
  segLine(70 + w + 14, 316, 70 + w + 14 + 44 * smoothM(p), 316, MC.greyD, 3, 1);
  writeText([{ s: label, c: COL.text }], 70 + w + 74, 332, 52, p, { align: 'left', lag: 0.8 });
}
const viTag = (num, label) => { const f = () => viTagDraw(num, label, false); if (DEFER) DEFER.push(f); else f(); };
const viTagNow = (num, label) => { const f = () => viTagDraw(num, label, true); if (DEFER) DEFER.push(f); else f(); };

// ---- a caption card (manim BackgroundRectangle), at screen size, y ≈ 1180 (above the burnt-caption zone; we ship
// no captions, but keep it ≤ 1250). segs: string or [{ s, c }]. at: seconds after the era start.
function viCaption(segs, at = 0.5, y = 1190, size = 56) { const f = () => mathCard(segs, CX, y, size, runS(E0 + at, 0.9)); if (DEFER) DEFER.push(f); else f(); }

// ---- a bit digit / a row of bits (yellow). bits: '0110…'. Each digit is Written; returns the digit centres.
function bitRow(bits, x, y, size = 60, p = 1, o = {}) {
  const gap = o.gap ?? size * 0.62, n = bits.length, x0 = x - (gap * (n - 1)) / 2, out = [];
  for (let i = 0; i < n; i++) {
    const pi = lagged(p, i, n, o.lag ?? 0.35), cx = x0 + i * gap;
    if (pi > 0) writeText([{ s: bits[i], c: o.col ?? COL.bit }], cx, y, size, pi, { align: 'center', alpha: o.al ?? 1 });
    out.push([cx, y - size * 0.35]);
  }
  return out;
}

// ---- the photo (gold): a framed picture of a sun over two hills. (x, y) centre, w × h. p: ShowCreation progress.
function photoCard(x, y, w, h, p = 1, o = {}) {
  if (p <= 0) return;
  const al = o.al ?? 1, c = COL.photo, l = x - w / 2, t = y - h / 2;
  ctx.save(); ctx.globalAlpha = al;
  showCreation([[l, t], [l + w, t], [l + w, t + h], [l, t + h]], clamp(p * 1.6), { c, w: 5, closed: true, fill: 0.12 });
  const q = clamp(p * 1.6 - 0.5);
  if (q > 0) {
    showCreation(arcPts(l + w * 0.68, t + h * 0.36, Math.min(w, h) * 0.14, 0, TAU, 40), q, { c, w: 5, closed: true, fill: 0.5 });
    const hill = []; for (let i = 0; i <= 30; i++) { const u = i / 30; hill.push([l + u * w, t + h * (0.78 - 0.22 * Math.sin(Math.PI * Math.min(1, u * 1.4)) - 0.1 * Math.sin(Math.PI * Math.max(0, u * 1.6 - 0.6)))]); }
    showCreation(hill, q, { c, w: 5 });
  }
  ctx.restore();
}

// ---- an electron: a purple disc with a minus sign (r ≥ 18)
function electron(x, y, r = 22, al = 1) {
  if (al <= 0) return;
  glowAt(x, y, r * 2.2, COL.elec, 0.35 * al); mDot(x, y, r, COL.elec, al);
  ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = MC.white; ctx.lineWidth = Math.max(3, r * 0.16); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - r * 0.45, y); ctx.lineTo(x + r * 0.45, y); ctx.stroke(); ctx.restore();
}

// ---- the router (grey): a box with two antennas and a blinking LED. (x, y) = centre of the box's bottom edge.
// s = 1 is a 300 × 110 box with 170-px antennas. Returns { tips: [[x, y], [x, y]], box: [l, t, r, b] }.
function router(x, y, s = 1, o = {}) {
  const al = o.al ?? 1, p = o.p ?? 1, w = 300 * s, h = 110 * s, l = x - w / 2, t = y - h, ah = 170 * s;
  const ax = [l + 50 * s, l + w - 50 * s], tips = ax.map((a) => [a, t - ah]);
  if (al <= 0 || p <= 0) return { tips, box: [l, t, l + w, y] };
  ctx.save(); ctx.globalAlpha = al;
  showCreation([[l, t], [l + w, t], [l + w, y], [l, y]], clamp(p * 1.5), { c: COL.dev, w: 5, closed: true, fill: 0.08 });
  ax.forEach((a) => segLine(a, t, a, t - ah * clamp(p * 1.5 - 0.3), COL.dev, 8 * s));
  ax.forEach((a) => mDot(a, t - ah * clamp(p * 1.5 - 0.3), 9 * s, COL.dev, clamp(p * 2 - 1)));
  const led = 0.55 + 0.45 * Math.sin(TT * 9);
  [0, 1, 2].forEach((i) => mDot(l + w * 0.62 + i * 34 * s, t + h * 0.5, 9 * s, i === 0 ? MC.green : COL.devD, (i === 0 ? led : 0.7) * clamp(p * 2 - 1)));
  ctx.restore();
  return { tips, box: [l, t, l + w, y] };
}

// ---- the phone (grey outline). (x, y) centre, s = 1 is 260 × 500. screen(l, t, w, h) draws inside the screen (clipped).
function phone(x, y, s = 1, o = {}) {
  const al = o.al ?? 1, p = o.p ?? 1, w = 260 * s, h = 500 * s, l = x - w / 2, t = y - h / 2, r = 34 * s;
  if (al <= 0 || p <= 0) return { l, t, w, h };
  ctx.save(); ctx.globalAlpha = al;
  const P = [...arcPts(l + w - r, t + r, r, -Math.PI / 2, 0, 8), ...arcPts(l + w - r, t + h - r, r, 0, Math.PI / 2, 8), ...arcPts(l + r, t + h - r, r, Math.PI / 2, Math.PI, 8), ...arcPts(l + r, t + r, r, Math.PI, 1.5 * Math.PI, 8)];
  showCreation(P, clamp(p * 1.4), { c: COL.dev, w: 6, closed: true, fill: 0.06 });
  if (o.screen && p > 0.6) {
    const sl = l + 18 * s, st = t + 58 * s, sw = w - 36 * s, sh = h - 116 * s;
    ctx.save(); ctx.beginPath(); ctx.rect(sl, st, sw, sh); ctx.clip(); ctx.globalAlpha = al * clamp(p * 2.5 - 1.5);
    o.screen(sl, st, sw, sh); ctx.restore();
  }
  segLine(x - 30 * s, t + 30 * s, x + 30 * s, t + 30 * s, COL.devD, 5 * s, clamp(p * 2 - 1));
  ctx.restore();
  return { l, t, w, h };
}

// ---- the Wi‑Fi wave fronts (blue): n arcs spreading from (x, y) over the angle span [a0, a1] (radians, 0 = right).
// t = time; arcs move out at `speed` px/s from radius r0 to r1, fading out. Few, thick arcs (never many thin ones).
function wifiArcs(x, y, t, o = {}) {
  const n = o.n ?? 3, r0 = o.r0 ?? 40, r1 = o.r1 ?? 520, sp = o.speed ?? 260, a0 = o.a0 ?? -Math.PI * 0.85, a1 = o.a1 ?? -Math.PI * 0.15, al = o.al ?? 1;
  if (al <= 0) return;
  const span = r1 - r0, gap = span / n;
  for (let i = 0; i < n; i++) {
    const r = r0 + mod(t * sp + i * gap, span), f = 1 - (r - r0) / span;
    const k = Math.min(1, (r - r0) / 40) * f;
    if (k > 0.02) showCreation(arcPts(x, y, r, a0, a1, 36), 1, { c: o.c ?? COL.wave, w: o.w ?? 7, al: al * k });
  }
}

// ---- a sine wave (blue) along x from x0 to x1 around baseline y. The wave can be MODULATED: segs = [{ x0, x1, amp, ph }]
// gives the amplitude (px) and phase (radians) for pieces of the line; between pieces they blend over `blend` px.
// lam = wavelength in px; drift = how far the wave has travelled (px, positive = to the right). p = ShowCreation.
function sineWave(x0, x1, y, o = {}) {
  const lam = o.lam ?? 160, drift = o.drift ?? 0, p = o.p ?? 1, segs = o.segs, blend = o.blend ?? 30;
  const ampAt = (x) => {
    if (!segs) return [o.amp ?? 60, o.ph ?? 0];
    let a = segs[0].amp, ph = segs[0].ph ?? 0;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i]; if (x >= s.x0 - blend / 2) { const u = i === 0 ? 1 : smoothM((x - (s.x0 - blend / 2)) / blend); a = lerp(segs[Math.max(0, i - 1)].amp, s.amp, u); ph = lerp(segs[Math.max(0, i - 1)].ph ?? 0, s.ph ?? 0, u); }
    }
    return [a, ph];
  };
  const P = []; for (let x = x0; x <= x1 + 0.1; x += 4) { const [a, ph] = ampAt(x); P.push([x, y - a * Math.sin(TAU * (x - drift) / lam + ph)]); }
  showCreation(P, p, { c: o.c ?? COL.wave, w: o.w ?? 6, al: o.al ?? 1 });
  return P;
}

// ---- a brick wall (grey) between y0 and y1 at x (width w): drawn as a few large bricks (no texture)
function wall(x, y0, y1, w = 90, o = {}) {
  const al = o.al ?? 1, p = o.p ?? 1; if (al <= 0 || p <= 0) return;
  ctx.save(); ctx.globalAlpha = al;
  showCreation([[x - w / 2, y0], [x + w / 2, y0], [x + w / 2, y1], [x - w / 2, y1]], clamp(p * 1.4), { c: COL.dev, w: 5, closed: true, fill: 0.1 });
  const bh = 70, q = clamp(p * 1.4 - 0.4);
  for (let yy = y0 + bh, k = 0; yy < y1 - 4; yy += bh, k++) {
    segLine(x - w / 2, yy, x + w / 2, yy, COL.guide, 3, q);
    const bx = x + (k % 2 ? -w / 4 : w / 4); segLine(bx, yy, bx, Math.min(y1, yy + bh), COL.guide, 3, q);
  }
  ctx.restore();
}

// ---- the hero at its contract spot: (x, y, r) as in BR. Same drawing as the bridge (STYLE.hero), so joins are seamless.
function heroAt(x, y, r = 100, o = {}) { piHero(x, y + r * 0.68, r / 110, { key: 'hero', ...o }); }
