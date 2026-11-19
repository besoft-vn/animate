// =====================================================================
//  PROPS — nginx-http2 (director's shared helpers; scene agents use them, never edit them)
// =====================================================================
// THE SERVER (the constant): a rack box labelled NGINX, centred at (x, y), size SW×SH*s, with a status lamp.
// o: { s, state: 'ok' | 'vuln' | 'down' | 'patched', dark, h2 (0..1: an "HTTP/2" badge), key, shake }
const SW = 260, SH = 320;
function serverProp(x, y, o = {}) {
  const s = o.s ?? 1, k = o.key || 'srv', dark = !!o.dark, line = dark ? C.peri : C.ink;
  const w = SW * s, h = SH * s, sh = o.shake ? Math.sin(TT * 60) * 4 * o.shake : 0;
  ctx.save(); ctx.translate(sh, 0);
  if (!dark) paint(rrectPts(x - w / 2 + 12, y - h / 2 + 16, w, h, 18 * s), { fill: 'rgba(58,36,23,0.3)', line: false, key: k + 'sh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
  paint(rrectPts(x - w / 2, y - h / 2, w, h, 18 * s), { fill: dark ? C.navy2 : '#e9e2d2', key: k + 'b', line, w: 4, tex: [{ k: 'hatch', gap: 7, al: 0.22, dens: (px, py) => clamp((px - x + py - y) / w + 0.5) }] });
  for (let i = 0; i < 3; i++) {   // three drive bays with blinking LEDs
    const yy = y - h / 2 + 60 * s + i * 62 * s;
    paint(rrectPts(x - w / 2 + 22 * s, yy, w - 44 * s, 44 * s, 8 * s), { fill: dark ? '#20234a' : '#d8cfbb', key: k + 'bay' + i, line, w: 2.5 });
    const on = (Math.floor(TT * 6) + i * 3) % 5 !== 0;
    ctx.fillStyle = on ? (dark ? C.cyan : C.green) : 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.arc(x + w / 2 - 44 * s, yy + 22 * s, 7 * s, 0, TAU); ctx.fill();
  }
  handText('NGINX', x - w / 2 + 24 * s, y + h / 2 - 34 * s, 46 * s, dark ? C.white : C.ink, { key: k + 'n', weight: 700 });
  const st = o.state || 'ok', lampC = { ok: C.green, patched: C.green, vuln: C.red, down: '#555' }[st];
  const pulse = st === 'vuln' ? 0.6 + 0.4 * Math.sin(TT * 7) : 1;
  ctx.globalAlpha = pulse; ctx.fillStyle = lampC; ctx.beginPath(); ctx.arc(x + w / 2 - 40 * s, y + h / 2 - 48 * s, 15 * s, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
  ink(ellipsePts(x + w / 2 - 40 * s, y + h / 2 - 48 * s, 15 * s, 15 * s, 0, 16), { closed: true, w: 2.5, color: line, key: k + 'lo' });
  if ((o.h2 ?? 0) > 0) { ctx.save(); ctx.translate(x - w / 2 - 10 * s, y - h / 2 - 20 * s); ctx.scale(o.h2, o.h2); paint(rrectPts(0, -28 * s, 150 * s, 56 * s, 28 * s), { fill: C.yellow, key: k + 'h2', line: C.ink, w: 3 }); monoText('HTTP/2', 18 * s, 12 * s, 34 * s, C.ink, { key: k + 'h2t' }); ctx.restore(); }
  ctx.restore();
}
// a terminal card: lines typed one after another from t0 (cps chars/s). lines: [{ s: 'text', c: colour?, out: true? }]
// o: { size (34), t0, cps (28), title, key, dark }  — returns the card height. Keep text ≥ 30px; ≤ 30 chars per line at 34px in w 880.
function termCard(x, y, w, lines, o = {}) {
  const b0 = B; B = 0;   // UI cards stay still (no boil): only drawings wobble
  try {
  const size = o.size ?? 34, lh = size * 1.45, h = 70 + lines.length * lh, k = o.key || 'term', t0 = o.t0 ?? E0, cps = o.cps ?? 28;
  paint(rrectPts(x + 8, y + 10, w, h, 16), { fill: 'rgba(0,0,0,0.35)', line: false, key: k + 'sh' });
  paint(rrectPts(x, y, w, h, 16), { fill: '#11132a', key: k + 'b', line: C.peri, w: 3 });
  for (let i = 0; i < 3; i++) { ctx.fillStyle = [C.red, C.yellow, C.green][i]; ctx.beginPath(); ctx.arc(x + 28 + i * 26, y + 26, 8, 0, TAU); ctx.fill(); }
  if (o.title) monoText(o.title, x + 110, y + 34, 26, C.periD, { key: k + 'ti' });
  let t = t0;
  lines.forEach((L, i) => {
    const n = L.s.length, dur = L.out ? 0.25 : n / cps, cnt = Math.floor(clamp((TT - t) / dur) * n);
    if (TT >= t) monoText(L.s, x + 28, y + 70 + i * lh + size * 0.4, size, L.c || (L.out ? C.cyan : C.white), { key: k + 'l' + i, count: L.out ? (TT >= t ? n : 0) : cnt });
    t += dur + (L.gap ?? 0.25);
  });
  return h;
  } finally { B = b0; }
}
// a CVE / version chip (red = vulnerable, green = fixed)
function chip(str, x, y, col, o = {}) {
  const b0 = B; B = 0; try {   // still UI chip
  const size = o.size ?? 40, w = monoW(size) * str.length + 40, s = o.s ?? 1; if (s <= 0.01) return w;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  paint(rrectPts(0, -size, w, size * 1.6, size * 0.8), { fill: col, key: (o.key || 'chip') + str, line: o.dark ? C.peri : C.ink, w: 3 });
  monoText(str, 20, size * 0.35, size, o.tc || C.white, { key: (o.key || 'chip') + 't' + str });
  ctx.restore(); return w;
  } finally { B = b0; }
}
