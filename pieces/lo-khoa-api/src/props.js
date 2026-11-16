// =====================================================================
//  PROPS — lộ khoá API (director's shared helpers; scene agents use them, never edit them)
// =====================================================================
// THE RED KEY (the constant): ring centred at (x, y), shaft to the right. s = scale (ring radius 46*s). o: { rot, dark, masked, key }
// masked: draws the key as "••••" on a grey card instead (the fix: data masked before it leaves).
function keyProp(x, y, s = 1, o = {}) {
  const k = o.key || 'rk', r = 46 * s;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.translate(-x, -y);
  if (o.masked) {
    paint(rrectPts(x - r * 1.2, y - r * 0.8, r * 4.2, r * 1.6, 14 * s), { fill: '#d9d4c8', key: k + 'mc', line: o.dark ? C.peri : C.ink, w: 3, tex: [{ k: 'hatch', gap: 6, al: 0.25 }] });
    handText('••••', x - r * 0.6, y + r * 0.35, 70 * s, C.ink, { key: k + 'mt' });
    ctx.restore(); return;
  }
  const line = o.dark ? C.peri : C.ink;
  if (o.dark) ink(ellipsePts(x, y, r * 1.5, r * 1.5, 0, 28), { closed: true, color: 'rgba(212,56,44,0.22)', w: r * 0.6, key: k + 'g' });
  paint(ellipsePts(x, y, r, r, 0, 40), { fill: C.red, key: k + 'b', line, w: 4, tex: [{ k: 'cross', c: '#8f2018', al: 0.45, gap: 6 }] });
  paint(ellipsePts(x, y, r * 0.42, r * 0.42, 0, 24), { fill: o.dark ? C.navy2 : C.paper, key: k + 'h', line, w: 3 });
  const L = r * 2.9;
  paint([[x + r * 0.85, y - r * 0.22], [x + r + L, y - r * 0.22], [x + r + L, y + r * 0.22], [x + r * 0.85, y + r * 0.22]], { fill: C.red, key: k + 's', line, w: 4, tex: [{ k: 'hatch', c: '#8f2018', al: 0.4, gap: 6 }] });
  for (const [dx, h] of [[0.55, 0.62], [0.85, 0.45]]) paint([[x + r + L * dx, y + r * 0.2], [x + r + L * dx + r * 0.32, y + r * 0.2], [x + r + L * dx + r * 0.32, y + r * h + r * 0.2], [x + r + L * dx, y + r * h + r * 0.2]], { fill: C.red, key: k + 't' + dx, line, w: 3 });
  ctx.restore();
}
// the chain strip at the top of the link scenes: n links lit (0..5), the current one pulsing. y ≈ 470, inside x 80–1000.
function chainStrip(n, o = {}) {
  const y = o.y ?? 470, x0 = 120, dx = 190, dark = o.dark !== false;
  for (let i = 0; i < 5; i++) {
    const x = x0 + i * dx, on = i < n, cur = i === n - 1;
    const P = rrectPts(x - 62, y - 30, 124, 60, 30);
    const pulse = cur ? 1 + 0.06 * Math.sin(TT * 6) : 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse); ctx.translate(-x, -y);
    if (on) paint(P, { fill: C.red, key: 'ch' + i, line: dark ? C.peri : C.ink, w: 4, tex: [{ k: 'hatch', c: '#8f2018', al: 0.35, gap: 6 }] });
    else ink(P, { closed: true, w: 3, color: dark ? 'rgba(200,208,240,0.35)' : 'rgba(58,36,23,0.3)', key: 'chg' + i });
    ctx.restore();
  }
}
// a chat box (the AI assistant's prompt field) with a line of text being typed: count = characters shown
function chatBox(x, y, w, h, str, count, o = {}) {
  paint(rrectPts(x, y, w, h, 22), { fill: C.paper, key: (o.key || 'chat') + 'b', w: 3.2, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.5, per: 90 }] });
  monoText(str, x + 30, y + h / 2 + 14, o.size ?? 36, C.ink, { key: (o.key || 'chat') + 't', count });
}
