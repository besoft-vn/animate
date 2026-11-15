// =====================================================================
//  PROPS — tủ lạnh (director's shared helpers; scene agents use them, never edit them)
//  Colour code: heat = terracotta / warm, cold = cyan. tempCol(u): u = 0 cold .. 1 hot.
// =====================================================================
function tempCol(u, dark = true) {
  const a = dark ? [82, 214, 196] : [111, 159, 184], m = dark ? [200, 208, 240] : [160, 140, 120], b = [217, 119, 87];
  const k = clamp(u), c = k < 0.5 ? a.map((v, i) => lerp(v, m[i], k * 2)) : m.map((v, i) => lerp(v, b[i], (k - 0.5) * 2));
  return `rgb(${c.map(Math.round).join(',')})`;
}
// a refrigerant pipe along polyline P: a fat inked tube in the temperature's colour, with flow dashes moving along it.
// o: { w (tube width, 34), u (temperature 0..1 or (frac)=>0..1 along the pipe), flow (dashes per second, 1), key, dark, frac (write-on) }
function pipe(P, o = {}) {
  const key = o.key || 'pipe', w = o.w ?? 34, dark = o.dark !== false, Q = resample(P, false, 8), L = pathLen(Q);
  const n = Q.length, fr = clamp(o.frac ?? 1), m = Math.max(2, Math.round(n * fr));
  const uAt = (f) => (typeof o.u === 'function' ? o.u(f) : o.u ?? 0.5);
  if (m < 2) return;
  ink(Q.slice(0, m), { w: w + 8, color: dark ? C.peri : C.ink, key: key + 'o', amt: 1.2 });
  // the tube, in short runs so the colour can change along it
  const runs = 12;
  for (let r = 0; r < runs; r++) {
    const i0 = Math.floor(r / runs * (m - 1)), i1 = Math.min(m - 1, Math.floor((r + 1) / runs * (m - 1)) + 1);
    if (i1 - i0 < 1) continue;
    ink(Q.slice(i0, i1 + 1), { w, color: tempCol(uAt((i0 + i1) / 2 / (n - 1)), dark), key: key + 'r' + r, amt: 0.8 });
  }
  // flow: short pale dashes travelling along the tube on 2s
  const sp = (o.flow ?? 1) * 140, gap = 90, off = mod(TT * sp, gap);
  for (let s = off; s < L * fr; s += gap) {
    const a = pointAt(Q, s / L), b = pointAt(Q, Math.min(1, (s + 26) / L));
    ink([a, b], { w: w * 0.28, color: 'rgba(255,255,255,0.55)', key: key + 'f' + Math.round(s), amt: 0.4 });
  }
}
// a station label: hand lettering on a small paper card, ≥ 54px so it reads on a phone
function stationLabel(str, x, y, o = {}) { inkCard(str, x, y, o.size ?? 56, { rot: o.rot ?? -0.03, s: o.s ?? 1, frac: o.frac }); }
// a thermometer with a hand-lettered reading, e.g. thermo(860, 700, -12, '°C', { t0: cue })
function thermo(x, y, val, unit = '°C', o = {}) {
  const hgt = o.h ?? 300, dark = o.dark !== false, u = clamp((val + 20) / 60), line = dark ? C.peri : C.ink;
  paint(rrectPts(x - 26, y - hgt, 52, hgt + 20, 26), { fill: dark ? C.navy2 : '#fffaf0', line, w: 3, key: (o.key || 'th') + 'b' });
  paint(ellipsePts(x, y + 30, 44, 44, 0, 32), { fill: tempCol(u, dark), line, w: 3, key: (o.key || 'th') + 'bulb', tex: [{ k: 'cross', c: 'rgba(0,0,0,0.25)', al: 0.4, gap: 5 }] });
  const top = y - 20 - (hgt - 50) * u;
  ink([[x, y + 10], [x, top]], { w: 20, color: tempCol(u, dark), key: (o.key || 'th') + 'col', amt: 0.6 });
  const s = (val < 0 ? '−' : '') + Math.abs(Math.round(val)) + unit;
  handText(s, x + (o.labelLeft ? -60 - handW(s, 70) : 60), y - hgt * 0.55, 70, dark ? C.white : C.ink, { key: (o.key || 'th') + 't', frac: o.frac });
}
// a puff of rising vapour: n wisps from (x, y), on 2s
function vapour(x, y, o = {}) {
  const n = o.n ?? 3, col = o.color || 'rgba(200,208,240,0.6)';
  for (let i = 0; i < n; i++) { const P = []; for (let k = 0; k <= 9; k++) P.push([x - (n - 1) * 18 + i * 36 + Math.sin(k * 0.8 + TT * 3 + i) * 12, y - k * (o.step ?? 16)]); ink(P, { w: o.w ?? 4, color: col, key: (o.key || 'vp') + i, frac: o.frac }); }
}
// a little heat mote (a mini hero without a face): small terracotta dots the hero travels with
function heatMote(x, y, r, key) { paint(ellipsePts(x, y, r, r, 0, 16), { fill: C.terra, key, w: 2.4, line: C.ink, tex: [{ k: 'cross', c: C.orangeD, al: 0.45, gap: 4 }] }); }
