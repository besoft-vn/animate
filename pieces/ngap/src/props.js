// =====================================================================
//  PROPS — ngáp (director's shared helpers; scene agents use them, never edit them)
//  Style: cut-paper (torn shapes, soft shadows) — but KHUNG HÌNH GỌN: flat fills, very light grain (grainIn is
//  overridden below: no stipple dots), no dotted patterns. Text: Pangolin only (Vietnamese glyphs), never boils.
//  Colour = one meaning:  ORANGE (COL.heat*) = heat / warm only (warm brain flush, heat wisps, hot readouts)
//                         BLUE (COL.cool*)  = cool air / cooling only (breathed-in air, cool readouts, winter)
//                         DEEP RED (COL.blood*) = blood only (vessels, flowing blood dashes)
//                         PINK (COL.brain*) = the brain = the hero only
//                         neutrals (cream, wood, navy text, PAL.ink lines) = everything else
// =====================================================================
const COL = {
  heat: '#ec7a4f', heatD: '#c4542e', heatL: '#fbd2bd',
  cool: '#4c8fd0', coolD: '#2f6aa8', coolL: '#d4e7f6',
  blood: '#b8323f', bloodL: '#e48a92',
  brain: '#f3a3bf', brainD: '#d9789b', brainL: '#f8c3d4',
  text: '#2a1d18', textD: '#6a5a50', mouth: '#5a1f26', tongue: '#e8707a',
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
//  THE HERO — the brain ("bộ não"): a pink paper cutout, wider than tall, with two folds and a face.
//  heroBrain(x, y, r, { warm 0..1, yawn 0..1, mood: 'calm'|'wow'|'happy'|'hot', look -1..1, fan 0..1, key })
//  (x, y) = centre of the brain body, r = half its height-ish (outline ≈ 1.2r wide each side, 0.9r tall each side).
//  warm 1 = flushed orange-pink with 3 small orange heat wisps rising from the top; 0 = plain pink.
//  yawn 1 = the brain's own mouth wide open, eyes squeezed shut. fan 1 = a small paper fan waving beside it (the end).
// =====================================================================
function brainPts(x, y, r, n = 64) {
  const P = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, bump = 1 + 0.055 * Math.cos(7 * a + 0.4) + 0.03 * Math.cos(3 * a);
    const flat = Math.sin(a) > 0 ? 0.82 : 1;          // a flatter underside
    P.push([x + Math.cos(a) * r * 1.2 * bump, y + Math.sin(a) * r * 0.9 * bump * flat]);
  }
  return P;
}
function heroBrain(x, y, r = 80, o = {}) {
  const warm = clamp(o.warm ?? 0), yw = clamp(o.yawn ?? 0), key = o.key ?? 'brain';
  y += Math.sin(TT * TAU * 0.6 + (o.ph ?? 0)) * r * 0.04;                       // idle bob
  const fill = mixHex(COL.brain, '#f2946f', warm * 0.75);
  cut(brainPts(x, y, r), fill, { key: key + 'b', tear: 0.8, sb: 10, sy: 6, grain: 0.5 });
  // folds: a centre line and two curls (darker pink / orange when warm)
  const fc = mixHex(COL.brainD, COL.heatD, warm * 0.7), lw = Math.max(3, r * 0.05);
  ink([[x - r * 0.05, y - r * 0.82], [x + r * 0.02, y - r * 0.55], [x - r * 0.04, y - r * 0.32]], { w: lw, color: fc, amt: 0.3, key: key + 'f0' });
  ink(arcPts(x - r * 0.62, y - r * 0.28, r * 0.28, Math.PI * 1.0, Math.PI * 1.9, 10), { w: lw, color: fc, amt: 0.3, key: key + 'f1' });
  ink(arcPts(x + r * 0.62, y - r * 0.28, r * 0.28, Math.PI * 1.1, Math.PI * 2.0, 10), { w: lw, color: fc, amt: 0.3, key: key + 'f2' });
  // face
  const s = r / 80, lk = (o.look ?? 0) * r * 0.12, fy = y + r * 0.12, I = PAL.ink;
  const mood = o.mood ?? (warm > 0.6 ? 'hot' : 'calm');
  const blink = mod(TT + (o.ph ?? 0) * 0.3, 3.1) < 0.1;
  for (const ex of [-0.3, 0.3]) {
    const cx = x + ex * r + lk;
    if (yw > 0.4 || mood === 'happy') ink(arcPts(cx, fy + 6 * s, 9 * s, Math.PI * 1.15, Math.PI * 1.85, 8), { w: 4 * s, color: I, amt: 0.2, key: key + 'e' + ex });
    else if (blink) ink([[cx - 8 * s, fy], [cx + 8 * s, fy]], { w: 4 * s, color: I, amt: 0.2, key: key + 'bl' + ex });
    else { dot(cx, fy, (mood === 'wow' ? 8.5 : 7) * s, I); dot(cx + 2.4 * s, fy - 2.6 * s, 2.4 * s, '#fff'); }
  }
  ctx.fillStyle = 'rgba(240,110,120,0.45)'; ctx.beginPath(); ctx.ellipse(x - r * 0.52, fy + 14 * s, 9 * s, 5.5 * s, 0, 0, TAU); ctx.ellipse(x + r * 0.52, fy + 14 * s, 9 * s, 5.5 * s, 0, 0, TAU); ctx.fill();
  const my = fy + 24 * s;
  if (yw > 0.05) {                                   // the yawn: a tall dark oval
    ctx.fillStyle = COL.mouth; ctx.beginPath(); ctx.ellipse(x + lk, my + 6 * s * yw, lerp(5, 15, yw) * s, lerp(4, 22, yw) * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = COL.tongue; ctx.beginPath(); ctx.ellipse(x + lk, my + 6 * s * yw + lerp(2, 12, yw) * s, lerp(3, 9, yw) * s, lerp(1.5, 6, yw) * s, 0, 0, TAU); ctx.fill();
  } else if (mood === 'wow') { ctx.fillStyle = I; ctx.beginPath(); ctx.ellipse(x + lk, my, 6 * s, 8 * s, 0, 0, TAU); ctx.fill(); }
  else if (mood === 'hot') ink([[x - 12 * s + lk, my], [x - 4 * s + lk, my - 3 * s], [x + 4 * s + lk, my + 1 * s], [x + 12 * s + lk, my - 2 * s]], { w: 3.6 * s, color: I, amt: 0.2, key: key + 'mh' });
  else ink(arcPts(x + lk, my - 8 * s, 10 * s, Math.PI * 0.2, Math.PI * 0.8, 8), { w: 3.6 * s, color: I, amt: 0.2, key: key + 'mc' });
  // heat wisps (warm) — 3 short orange wavy strokes rising above
  if (warm > 0.4) {
    const al = clamp((warm - 0.4) / 0.4);
    for (let i = 0; i < 3; i++) {
      const bx = x + (i - 1) * r * 0.55, P = [];
      for (let k = 0; k <= 8; k++) P.push([bx + Math.sin(k * 0.9 + TT * 5 + i) * 6 * s, y - r * 1.0 - k * 6 * s]);
      ctx.save(); ctx.globalAlpha = al; ink(P, { w: 5 * s, color: COL.heat, amt: 0.3, key: key + 'hw' + i }); ctx.restore();
    }
  }
  // a little paper fan held to the right (the end): waves
  const fan = clamp(o.fan ?? 0);
  if (fan > 0.01) {
    const fx = x + r * 1.35, fyy = y - r * 0.1, a0 = -0.5 + Math.sin(TT * TAU * 1.6) * 0.35;
    ctx.save(); ctx.translate(fx, fyy); ctx.rotate(a0); ctx.scale(fan, fan);
    const F = [[0, 30 * s]]; for (let k = 0; k <= 10; k++) { const a = -Math.PI * 0.85 + k / 10 * Math.PI * 0.7; F.push([Math.cos(a) * 62 * s, 30 * s + Math.sin(a) * 62 * s]); }
    cut(F, COL.coolL, { key: key + 'fan', tear: 0.5, sb: 5, sy: 3, pat: pat.stripes('rgba(76,143,208,0.35)', 3, 14, 0.0) });
    ctx.restore();
  }
  SPARK_AT = toScreen(x, y);
}
// the hero's temperature on any bridge (also the value scenes should use): warm from "warm" on, cooling in "cool"
function heroWarmAt(t) {
  if (t < ET('warm') + 0.6) return 0.25;
  if (t < VW('cool', 'lên')) return 1;
  if (t < ET('season')) return 1 - seg(t, VW('cool', 'lên'), VW('cool', 'lên') + 1.2);
  return 0;
}
STYLE.hero = (x, y, r, o = {}) => heroBrain(x, y, r, { warm: heroWarmAt(TT), mood: 'calm', key: 'hero' + (o.key ?? '') });
STYLE.heroPts = (x, y, r, n = 96) => brainPts(x, y, r, n);
STYLE.heroColor = COL.brain;

// =====================================================================
//  PEOPLE — busts that can yawn. Minh (blue shirt, short hair, left/centre) and Lan (mustard shirt, long hair, right).
//  bust(x, y, s, { who: 'minh'|'lan'|'mom'|'kid'|'stranger', yawn 0..1, look -1..1, tilt (rad), mood, key })
//  (x, y) = the shoulders' top centre; head centre ≈ (x, y - 118 s); the mouth ≈ (x, y - 88 s).
//  yawn: 0 neutral smile → 1 jaw wide open (tall dark oval + tongue), eyes squeezed shut, head tipped back a little,
//  a tear at 1. Drive it with yawnCurve(t, t0, dur) for a believable yawn (slow open, hold, quick close).
// =====================================================================
const WHO = {
  minh: { skin: PAL.skin1, hair: '#2b211d', shirt: PAL.blue, style: 'short' },
  lan: { skin: PAL.skin2, hair: '#3a2420', shirt: PAL.mustard, style: 'long' },
  mom: { skin: PAL.skin2, hair: '#4a3028', shirt: PAL.purple, style: 'bun' },
  kid: { skin: PAL.skin1, hair: '#2b211d', shirt: PAL.green, style: 'short' },
  stranger: { skin: PAL.skin3, hair: '#1e1714', shirt: PAL.charcoal, style: 'short' },
};
// a yawn over time: open slowly (~45%), hold at the peak (~25%), close fast (~30%) — research: inhale long, exhale short
function yawnCurve(t, t0, dur = 2.4) {
  const u = (t - t0) / dur; if (u <= 0 || u >= 1) return 0;
  if (u < 0.45) return EZ.io(u / 0.45);
  if (u < 0.7) return 1;
  return 1 - EZ.io((u - 0.7) / 0.3);
}
function bust(x, y, s, o = {}) {
  const who = WHO[o.who ?? 'minh'], key = o.key ?? ('bs' + (o.who ?? 'minh')), yw = clamp(o.yawn ?? 0);
  const skin = who.skin, hair = who.hair;
  cut(rect(x - 125 * s, y, 250 * s, 330 * s, 80 * s), who.shirt, { key: key + 't' });
  cut(rect(x - 24 * s, y - 46 * s, 48 * s, 66 * s, 12 * s), skin, { key: key + 'n', shadow: false });
  ctx.save();
  const tilt = (o.tilt ?? 0) - 0.1 * yw;              // head tips back a little at the peak
  ctx.translate(x, y - 30 * s); ctx.rotate(tilt); ctx.translate(-x, -(y - 30 * s));
  if (who.style === 'long') cut(rect(x - 92 * s, y - 200 * s, 184 * s, 230 * s, 70 * s), hair, { key: key + 'hb', sb: 6 });
  cut(ellipsePts(x - 74 * s, y - 112 * s, 14 * s, 20 * s, 0, 14), skin, { key: key + 'el' });
  cut(ellipsePts(x + 74 * s, y - 112 * s, 14 * s, 20 * s, 0, 14), skin, { key: key + 'er' });
  cut(ellipsePts(x, y - 116 * s + 6 * s * yw, 76 * s, 86 * s + 8 * s * yw, 0, 30), skin, { key: key + 'h' });
  cut([[x - 80 * s, y - 120 * s], [x - 82 * s, y - 170 * s], [x - 40 * s, y - 214 * s], [x + 40 * s, y - 214 * s], [x + 84 * s, y - 168 * s], [x + 80 * s, y - 122 * s], [x + 60 * s, y - 160 * s], [x - 50 * s, y - 166 * s]], hair, { key: key + 'hr', sb: 4 });
  if (who.style === 'bun') cut(ellipsePts(x, y - 222 * s, 34 * s, 28 * s, 0, 18), hair, { key: key + 'bun', sb: 4 });
  // face
  const fy = y - 122 * s, lk = (o.look ?? 0) * 10 * s, I = PAL.ink;
  const blink = mod(TT + key.length * 0.37, 3.3) < 0.1;
  for (const ex of [-22, 22]) {
    const cx = x + ex * s + lk;
    if (yw > 0.45) ink(arcPts(cx, fy + 4 * s, 10 * s, Math.PI * 1.1, Math.PI * 1.9, 8), { w: 4.2 * s, color: I, amt: 0.2, key: key + 'ey' + ex });
    else if (blink || o.mood === 'sleepy') ink([[cx - 9 * s, fy], [cx + 9 * s, fy]], { w: 4.2 * s, color: I, amt: 0.2, key: key + 'eb' + ex });
    else { dot(cx, fy, (o.mood === 'wow' ? 9 : 7.5) * s, I); dot(cx + 2.5 * s, fy - 3 * s, 2.5 * s, '#fff'); }
  }
  ctx.fillStyle = 'rgba(240,110,120,0.4)'; ctx.beginPath(); ctx.ellipse(x - 40 * s, fy + 20 * s, 10 * s, 6 * s, 0, 0, TAU); ctx.ellipse(x + 40 * s, fy + 20 * s, 10 * s, 6 * s, 0, 0, TAU); ctx.fill();
  const my = y - 86 * s;
  if (yw > 0.04) {
    ctx.fillStyle = COL.mouth; ctx.beginPath(); ctx.ellipse(x + lk * 0.5, my + 6 * s * yw, lerp(8, 24, yw) * s, lerp(5, 36, yw) * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = COL.tongue; ctx.beginPath(); ctx.ellipse(x + lk * 0.5, my + 6 * s * yw + lerp(2, 20, yw) * s, lerp(4, 14, yw) * s, lerp(2, 9, yw) * s, 0, 0, TAU); ctx.fill();
    if (yw > 0.9) { ctx.fillStyle = 'rgba(160,210,240,0.9)'; ctx.beginPath(); ctx.ellipse(x - 34 * s, fy + 16 * s, 4 * s, 6 * s, 0, 0, TAU); ctx.fill(); }   // a tear
  } else if (o.mood === 'wow') { ctx.fillStyle = I; ctx.beginPath(); ctx.ellipse(x + lk, my, 6 * s, 8 * s, 0, 0, TAU); ctx.fill(); }
  else ink(arcPts(x + lk, my - 10 * s, 12 * s, Math.PI * 0.2, Math.PI * 0.8, 8), { w: 3.8 * s, color: I, amt: 0.2, key: key + 'm' });
  ctx.restore();
}
// a hand coming up to cover the yawn (optional): call after bust with the same x, y, s and yawn value
function yawnHand(x, y, s, yw, skin = PAL.skin1, sleeve = PAL.blue, key = 'yh') {
  const k = clamp((yw - 0.3) / 0.4); if (k <= 0.01) return;
  hand(x - 40 * s + 0, y + 200 * s - 230 * s * EZ.o2(k), s * 0.7, -Math.PI / 2 + 0.25, skin, sleeve, { key });
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
