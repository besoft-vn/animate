// =====================================================================
//  PROPS — màn hình cảm ứng (director's shared helpers; scene agents use them, never edit them)
//  Style: isometric (white ground, constant hairlines, white faces, springs). Text: Pangolin only (Vietnamese glyphs).
//  Colour = one meaning:  BLUE (COL.field*) = the electric field / the signal (field lines, the drive pulse, readings)
//                         SKIN (COL.skin*)  = the finger / the body (the hero) only
//                         ACCENT dark (PAL.accent) = the found touch point (crosshair) — the one focus; also the hero's eyes
//                         grey hairlines (PAL.edge / PAL.inner) = glass, electrodes, chip, everything else
//                         WOOL grey-beige (COL.wool*) = the glove (scene "glove" only)
// =====================================================================
const COL = {
  field: '#3f8fd8', fieldL: '#d6e8f8', fieldM: '#9cc8ee',
  skin: '#e0876a', skinL: '#fbe3d8', skinM: '#f2b8a2',
  wool: '#a89f8c', woolL: '#efe9dc',
  dip: '#f4a26b',                    // (unused by default) keep BLUE for the signal; a weakened reading is a SHORTER/PALER blue
};
const VFONT = '"Pangolin", "DejaVu Sans", sans-serif';
const VFONT = '"Pangolin", "DejaVu Sans", sans-serif';

// ---- screen-space text (Pangolin). o: { col, align, al, weight }
function vtext(str, x, y, size = 54, o = {}) {
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  ctx.font = `${o.weight ?? 400} ${size}px ${VFONT}`; ctx.fillStyle = o.col ?? PAL.text;
  ctx.textAlign = o.align ?? 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(str, x, y); const w = ctx.measureText(str).width; ctx.restore(); return w;
}
// a label that springs in at time t0 (rises 14px, fades in)
function vlabel(str, x, y, t0, size = 54, o = {}) {
  const a = clamp(spring(TT, t0, { k: 140, damp: 0.8 }));
  if (a <= 0.001) return;
  vtext(str, x, y + (1 - a) * 14, size, { ...o, al: a * (o.al ?? 1) });
}
// ---- the scene tag top-left (number + rule + label), drawn at screen size after the camera
function viTagDraw(num, label, now) {
  const a = now ? 1 : clamp(spring(TT, E0 + 0.15, { k: 140, damp: 0.85 }));
  if (a <= 0.001) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = `400 40px ${VFONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = PAL.textD; ctx.fillText(num, 70, 330); const w = ctx.measureText(num).width;
  polyPath([[70 + w + 16, 318], [70 + w + 16 + 50 * a, 318]], false); hair(PAL.edge); ctx.stroke();
  ctx.font = `400 54px ${VFONT}`; ctx.fillStyle = PAL.text; ctx.fillText(label, 70 + w + 84, 332);
  ctx.restore();
}
const viTag = (num, label) => { const f = () => viTagDraw(num, label, false); if (DEFER) DEFER.push(f); else f(); };
const viTagNow = (num, label) => { const f = () => viTagDraw(num, label, true); if (DEFER) DEFER.push(f); else f(); };
// ---- the caption (≤ 2 short lines, y ≈ 1330–1440 is reserved for it; one highlighted word optional)
// lines: ['dòng 1', 'dòng 2'], hi: [lineIndex, 'word'], o: { at (s after era start), col (highlight colour), now }
function viCaptionDraw(lines, hi, o) {
  const a = o.now ? 1 : clamp(spring(TT, E0 + (o.at ?? 0.5), { k: 120, damp: 0.8 }));
  if (a <= 0.001) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = `400 60px ${VFONT}`; ctx.textBaseline = 'alphabetic';
  lines.forEach((s, i) => {
    const y = 1360 + i * 72 + (1 - a) * 16, w = ctx.measureText(s).width;
    let x = CX - w / 2;
    if (hi && hi[0] === i && s.includes(hi[1])) {
      const k = s.indexOf(hi[1]), pre = ctx.measureText(s.slice(0, k)).width, hw = ctx.measureText(hi[1]).width;
      ctx.fillStyle = o.col ?? COL.fieldL; ctx.fillRect(x + pre - 8, y - 46, hw + 16, 60);
    }
    ctx.fillStyle = PAL.text; ctx.textAlign = 'left'; ctx.fillText(s, x, y);
  });
  polyPath([[CX - 22, 1290], [CX + 22, 1290]], false); hair(PAL.edge); ctx.stroke();
  ctx.restore();
}
const viCaption = (lines, hi, o = {}) => { const f = () => viCaptionDraw(lines, hi, o); if (DEFER) DEFER.push(f); else f(); };

// =====================================================================
//  THE HERO — a fingertip ("đầu ngón tay"): an upright rounded capsule in skin colour, a nail on the upper back,
//  two dark eyes and a small mouth. Its TIP (the pad) is at the bottom: tipOf(x, y, r) = [x, y + 1.3 r].
//  heroFinger(x, y, r, { look -1..1, squash 0..1 (pressing), mood: 'calm'|'wow'|'sad'|'happy', glove 0..1, al, tilt })
//  (x, y) = the centre of the body. r = HR normally (≈ 54 px). Body: half-width 0.78 r, from y − 1.3 r to y + 1.3 r.
// =====================================================================
const tipOf = (x, y, r = HR) => [x, y + 1.3 * r];
function fingerPts(x, y, r, n = 48) {   // a capsule (stadium), point order clockwise from the top
  const P = [], w = r * 0.78, hh = r * 1.3 - w;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;               // 0 at the top
    const s = Math.sin(a), c = Math.cos(a);
    P.push([x + w * s, y + (c > 0 ? -hh : hh) - w * c]);
  }
  return P;
}
function heroFinger(x, y, r = HR, o = {}) {
  const sq = clamp(o.squash ?? 0), gl = clamp(o.glove ?? 0);
  const bob = (1 - sq) * Math.sin(TT * TAU * 0.7 + (o.ph ?? 0)) * r * 0.05;
  y += bob;
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  // squash keeps the tip on the surface: scale about the tip
  const tip = tipOf(x, y, r);
  ctx.translate(tip[0], tip[1]); ctx.rotate(o.tilt ?? 0); ctx.scale(1 + sq * 0.12, 1 - sq * 0.12); ctx.translate(-tip[0], -tip[1]);
  const P = fingerPts(x, y, r);
  polyPath(P, true); ctx.fillStyle = mixHex(COL.skinL, COL.woolL, gl); ctx.fill();
  hair(gl > 0.5 ? COL.wool : COL.skin, 4); ctx.stroke();
  const w = r * 0.78;
  if (gl < 0.5) {
    // the nail: a rounded cap on the upper part, seen a little from the front
    polyPath(rrectPts(x - w * 0.62, y - r * 1.18, w * 1.24, r * 0.62, r * 0.28, 6), true);
    ctx.fillStyle = '#ffffff'; ctx.fill(); hair(COL.skinM, 3); ctx.stroke();
    // two knuckle creases near the tip
    polyPath(arcPts(x, y + r * 0.62, w * 0.42, Math.PI * 0.15, Math.PI * 0.85, 8), false); hair(COL.skinM, 2.5); ctx.stroke();
  } else {
    // the glove: knitted rib lines + a cuff
    for (let k = -2; k <= 2; k++) { polyPath([[x + k * w * 0.32, y - r * 0.9], [x + k * w * 0.32, y + r * 1.1]], false); hair(COL.wool, 2); ctx.globalAlpha *= 0.5; ctx.stroke(); ctx.globalAlpha = clamp(o.al ?? 1); }
    polyPath(rrectPts(x - w * 1.04, y - r * 1.3, w * 2.08, r * 0.34, r * 0.12, 4), true); ctx.fillStyle = COL.woolL; ctx.fill(); hair(COL.wool, 3); ctx.stroke();
  }
  // eyes + mouth (on the front, below the nail)
  const lk = (o.look ?? 0) * r * 0.16, blink = mod(TT + (o.ph ?? 0) * 0.3, 2.7) < 0.09, mood = o.mood ?? 'calm';
  for (const ex of [-0.3, 0.3]) {
    ctx.beginPath();
    if (mood === 'wow') ctx.ellipse(x + ex * r + lk, y - r * 0.12, r * 0.1, blink ? r * 0.02 : r * 0.16, 0, 0, TAU);
    else ctx.ellipse(x + ex * r + lk, y - r * 0.1, r * 0.085, blink ? r * 0.02 : r * 0.13, 0, 0, TAU);
    ctx.fillStyle = PAL.accent; ctx.fill();
  }
  ctx.beginPath();
  if (mood === 'wow') ctx.ellipse(x + lk, y + r * 0.26, r * 0.09, r * 0.11, 0, 0, TAU);
  else if (mood === 'sad') ctx.arc(x + lk, y + r * 0.36, r * 0.15, 1.2 * Math.PI, 1.8 * Math.PI);
  else if (mood === 'happy') ctx.arc(x + lk, y + r * 0.1, r * 0.2, 0.15 * Math.PI, 0.85 * Math.PI);
  else ctx.arc(x + lk, y + r * 0.12, r * 0.15, 0.2 * Math.PI, 0.8 * Math.PI);
  hair(PAL.accent, 3.5); ctx.stroke();
  ctx.restore();
  SPARK_AT = toScreen(x, y);
}
STYLE.hero = (x, y, r, o = {}) => heroFinger(x, y, r, { mood: 'calm', key: o.key, glove: TT > ET('glove') - 0.6 && TT < ET('end') - 0.6 ? 1 : 0 });
STYLE.heroPts = (x, y, r, n = 96) => fingerPts(x, y, r, n);
STYLE.heroColor = COL.skin;

// =====================================================================
//  SMALL PIECES
// =====================================================================
// a straight arrow (hairline grey by default)
function simpleArrow(x0, y0, x1, y1, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01) return;
  const ex = lerp(x0, x1, k), ey = lerp(y0, y1, k), L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, hl = o.head ?? 20;
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  polyPath([[x0, y0], [ex, ey]], false); hair(o.col ?? PAL.edge, o.w ?? 5); ctx.stroke();
  polyPath([[ex - ux * hl + nx * hl * 0.6, ey - uy * hl + ny * hl * 0.6], [ex, ey], [ex - ux * hl - nx * hl * 0.6, ey - uy * hl - ny * hl * 0.6]], false); ctx.stroke();
  ctx.restore();
}
// a field line: a smooth curve through points P (screen coords) in BLUE, with dashes flowing from P[0] to the end.
// o: { part 0..1 (grows from the start), al, w, flow (speed, default 1; 0 = still dashes), dash [on, off] }
function fieldLine(P, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01 || P.length < 2) return;
  const R = resample(P, false, 6), Q = k < 1 ? subPath(R, k) : R;
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  polyPath(Q, false); hair(o.col ?? COL.fieldM, o.w ?? 4); ctx.stroke();
  const d = o.dash ?? [16, 22];
  ctx.setLineDash(d); ctx.lineDashOffset = -TT * 60 * (o.flow ?? 1);
  polyPath(Q, false); hair(o.col2 ?? COL.field, o.w ?? 4); ctx.stroke();
  ctx.setLineDash([]);
  // a small head at the end
  if (k > 0.95 && o.head !== false) { const a = Q[Q.length - 2], b = Q[Q.length - 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), hl = 14;
    polyPath([[b[0] - Math.cos(ang - 0.5) * hl, b[1] - Math.sin(ang - 0.5) * hl], b, [b[0] - Math.cos(ang + 0.5) * hl, b[1] - Math.sin(ang + 0.5) * hl]], false); hair(o.col2 ?? COL.field, o.w ?? 4); ctx.stroke(); }
  ctx.restore();
}
// an arc between two points bulging up by h (for field arcs from a row electrode to a column electrode)
function arcBetween(a, b, h, n = 24) { const P = []; for (let i = 0; i <= n; i++) { const u = i / n; P.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * Math.sin(Math.PI * u)]); } return P; }
// the found touch point: the ONE dark accent — a crosshair ring with ticks. k 0..1 grows it in.
function crosshair(x, y, r = 46, k = 1, o = {}) {
  k = clamp(k); if (k <= 0.01) return;
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  ctx.beginPath(); ctx.arc(x, y, r * k, 0, TAU); hair(PAL.accent, 5); ctx.stroke();
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; polyPath([[x + Math.cos(a) * r * 0.55 * k, y + Math.sin(a) * r * 0.55 * k], [x + Math.cos(a) * r * 1.45 * k, y + Math.sin(a) * r * 1.45 * k]], false); hair(PAL.accent, 5); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(x, y, 7 * k, 0, TAU); ctx.fillStyle = PAL.accent; ctx.fill();
  ctx.restore();
}
// the controller chip (grey hairline square with pins and a label). s = side in px.
function chipIcon(x, y, s = 150, o = {}) {
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  for (let i = 0; i < 5; i++) { const d = -s * 0.36 + i * s * 0.18;
    for (const [ax, ay, bx, by] of [[x + d, y - s / 2, x + d, y - s / 2 - 16], [x + d, y + s / 2, x + d, y + s / 2 + 16], [x - s / 2, y + d, x - s / 2 - 16, y + d], [x + s / 2, y + d, x + s / 2 + 16, y + d]]) { polyPath([[ax, ay], [bx, by]], false); hair(PAL.edge, 3); ctx.stroke(); } }
  polyPath(rrectPts(x - s / 2, y - s / 2, s, s, s * 0.1, 4), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge); ctx.stroke();
  ctx.beginPath(); ctx.arc(x - s * 0.3, y - s * 0.3, 6, 0, TAU); hair(PAL.inner, 3); ctx.stroke();
  ctx.restore();
  if (o.label !== false) vtext(o.label ?? 'chip', x, y + 18, 50, { col: PAL.text, al: o.al ?? 1 });
}
