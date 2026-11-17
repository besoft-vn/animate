// =====================================================================
//  PROPS — lò vi sóng (director's shared helpers; scene agents use them, never edit them)
//  Colour code: TERRACOTTA = hero + heat, YELLOW (COL.wave) = microwaves / field ONLY, CYAN-ish (COL.cold) = cold.
//  tempCol(u): u = 0 cool (periwinkle on navy / cold blue on paper) .. 1 hot (terracotta).
// =====================================================================
function tempCol(u, dark = true) {
  const a = dark ? [200, 208, 240] : [111, 182, 201], b = [217, 119, 87];
  const k = clamp(u), c = a.map((v, i) => lerp(v, b[i], k));
  return `rgb(${c.map(Math.round).join(',')})`;
}
// a microwave: a yellow sine line from (ax, ay) to (bx, by). o: { lam (px, 120), amp (28), phase (px, moves it), frac
// (write-on 0..1), w (7), key, al }. Keep it to ONE or a few waves per frame (khung hình gọn).
function mwave(ax, ay, bx, by, o = {}) {
  const L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, lam = o.lam ?? 120, amp = o.amp ?? 28, ph = o.phase ?? 0;
  const P = [];
  for (let s = 0; s <= L * clamp(o.frac ?? 1); s += 6) { const off = Math.sin((s - ph) / lam * TAU) * amp; P.push([ax + ux * s - uy * off, ay + uy * s + ux * off]); }
  if (P.length < 2) return;
  ink(P, { w: (o.w ?? 7) + 5, color: 'rgba(58,36,23,0.55)', key: (o.key || 'mw') + 'o', amt: 0.8 });
  ink(P, { w: o.w ?? 7, color: o.color || COL.wave, key: (o.key || 'mw'), amt: 0.8, alpha: o.al ?? 1 });
}
// a field arrow (the electric field's direction): a fat yellow arrow centred (x, y), length len, angle ang (rad)
function fieldArrow(x, y, len, ang, o = {}) {
  const dx = Math.cos(ang) * len / 2, dy = Math.sin(ang) * len / 2, h = o.head ?? 34;
  const tip = [x + dx, y + dy], tail = [x - dx, y - dy];
  const l = [tip[0] - Math.cos(ang - 0.5) * h, tip[1] - Math.sin(ang - 0.5) * h], r = [tip[0] - Math.cos(ang + 0.5) * h, tip[1] - Math.sin(ang + 0.5) * h];
  const dark = o.dark !== false, line = dark ? C.peri : C.ink;
  ink([tail, tip], { w: (o.w ?? 12) + 6, color: line, key: (o.key || 'fa') + 'o' });
  ink([l, tip, r], { w: (o.w ?? 12) + 6, color: line, key: (o.key || 'fa') + 'ho' });
  ink([tail, tip], { w: o.w ?? 12, color: COL.wave, key: (o.key || 'fa') });
  ink([l, tip, r], { w: o.w ?? 12, color: COL.wave, key: (o.key || 'fa') + 'h' });
}
// the two hydrogen "ears" of a water molecule (104.5° apart) pointing toward angle ang. Returns the + end point.
function _hEars(x, y, r, ang, o) {
  const d = r * 0.98, hr = r * 0.46, line = o.dark ? C.peri : C.ink;
  for (const s of [-1, 1]) {
    const a = ang + s * 0.912, hx = x + Math.cos(a) * d, hy = y + Math.sin(a) * d;
    paint(ellipsePts(hx, hy, hr, hr, 0, 20), { fill: o.hFill || '#f4f1ea', key: (o.key || 'm') + 'h' + s, line, w: o.dark ? 3 : 2.6, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.3 }] });
  }
  return [x + Math.cos(ang) * r * 1.35, y + Math.sin(ang) * r * 1.35];
}
// charge marks: "+" beyond the H ears, "−" on the far side of the O. size ≥ 50 px when they must read.
function _charges(x, y, r, ang, o) {
  const k = clamp(o.charges ?? 0); if (k <= 0) return;
  const col = o.dark ? C.white : C.ink, sz = o.chargeSize ?? Math.max(50, r * 0.7);
  const px = x + Math.cos(ang) * r * 1.85, py = y + Math.sin(ang) * r * 1.85, mx = x - Math.cos(ang) * r * 1.45, my = y - Math.sin(ang) * r * 1.45;
  ctx.save(); ctx.globalAlpha = k;
  handText('+', px - handW('+', sz) / 2, py + sz * 0.36, sz, col, { key: (o.key || 'm') + 'cp' });
  handText('−', mx - handW('−', sz) / 2, my + sz * 0.36, sz, col, { key: (o.key || 'm') + 'cm' });
  ctx.restore();
}
// THE HERO: our water molecule = dotHero (the O) + two H ears toward ang. o: { dark, mood, charges (0..1), key, heat (0..1:
// a terracotta glow ring that grows with heat) }
function heroMol(x, y, r, ang, o = {}) {
  const key = o.key || 'hero';
  if ((o.heat ?? 0) > 0) ink(ellipsePts(x, y, r * 1.5, r * 1.5, 0, 30), { closed: true, color: `rgba(217,119,87,${0.25 * clamp(o.heat)})`, w: r * 0.5 * clamp(o.heat), key: key + 'gl' });
  _hEars(x, y, r, ang, { ...o, key });
  dotHero(x, y, r, { dark: o.dark, mood: o.mood, key, shadow: false });
  _charges(x, y, r, ang, { ...o, key });
}
// another water molecule (no face): O disc in tempCol(u) + two H ears. Use at most ~10 on screen, r ≥ 18 (≥ 40 preferred).
function waterMol(x, y, r, ang, o = {}) {
  const key = o.key || 'wm', dark = o.dark !== false;
  _hEars(x, y, r, ang, { ...o, dark, key });
  paint(ellipsePts(x, y, r, r, 0, 26), { fill: tempCol(o.u ?? 0, dark), key: key + 'o', line: dark ? C.peri : C.ink, w: dark ? 3.5 : 3, tex: [{ k: 'cross', c: 'rgba(0,0,0,0.25)', al: 0.35, gap: 6 }] });
  _charges(x, y, r, ang, { ...o, dark, key });
}
// a bowl of rice seen from the front-ish: bowl body + rice dome. o: { heat 0..1 (rice tint), steam 0..1, key }
function riceBowl(x, y, r, o = {}) {
  const key = o.key || 'bowl', h = clamp(o.heat ?? 0);
  // rice dome above the rim
  paint(arcPts(x, y, r * 0.92, Math.PI, TAU, 22, 0.55).concat([[x + r * 0.92, y]]), { fill: h > 0 ? `rgb(${Math.round(lerp(251, 250, h))},${Math.round(lerp(246, 222, h))},${Math.round(lerp(234, 200, h))})` : COL.rice, key: key + 'r', w: 3, tex: [{ k: 'pencil', c: '#e6dcc4', al: 0.6, per: 70 }] });
  // bowl body
  const body = [[x - r, y], [x + r, y], [x + r * 0.62, y + r * 0.72], [x - r * 0.62, y + r * 0.72]];
  paint(body, { fill: '#f2ede2', key: key + 'b', w: 3.4, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.4, dens: (px) => clamp((px - x) / r + 0.4) }] });
  ink([[x - r * 0.8, y + r * 0.22], [x + r * 0.8, y + r * 0.22]], { w: 4, color: COL.cold, key: key + 'stripe' });
  if ((o.steam ?? 0) > 0) steam(x, y - r * 0.55, { n: 3, amt: o.steam, key: key + 'st', spread: r * 0.4 });
}
// steam wisps rising from (x, y): terracotta-tinted (it is heat). o: { n (3), amt 0..1 (height/opacity), spread, key, w }
function steam(x, y, o = {}) {
  const n = o.n ?? 3, a = clamp(o.amt ?? 1), sp = o.spread ?? 50;
  for (let i = 0; i < n; i++) {
    const P = [], ox = x - sp + (n > 1 ? i * 2 * sp / (n - 1) : sp);
    for (let k = 0; k <= Math.round(10 * a); k++) P.push([ox + Math.sin(k * 0.8 + TT * 3 + i * 1.7) * 14, y - k * 18]);
    if (P.length > 1) ink(P, { w: o.w ?? 6, color: `rgba(217,119,87,${0.25 + 0.45 * a})`, key: (o.key || 'st') + i });
  }
}
// a thermometer on paper with a hand-lettered reading: thermo(860, 700, 70)
function thermo(x, y, val, o = {}) {
  const hgt = o.h ?? 280, u = clamp(val / 90), key = o.key || 'th', dark = !!o.dark, line = dark ? C.peri : C.ink;
  paint(rrectPts(x - 24, y - hgt, 48, hgt + 20, 24), { fill: dark ? C.navy2 : '#fffaf0', line, w: 3, key: key + 'b' });
  paint(ellipsePts(x, y + 28, 40, 40, 0, 30), { fill: tempCol(u, false), line, w: 3, key: key + 'bulb', tex: [{ k: 'cross', c: 'rgba(0,0,0,0.25)', al: 0.4, gap: 5 }] });
  ink([[x, y + 10], [x, y - 20 - (hgt - 50) * u]], { w: 18, color: tempCol(u, false), key: key + 'col', amt: 0.6 });
  const s = Math.round(val) + '°C';
  handText(s, x + (o.labelLeft ? -56 - handW(s, 64) : 56), y - hgt * 0.55, 64, dark ? C.white : C.ink, { key: key + 't' });
}
// THE OVEN (hook / magnet / bounce / end, same place every time). o: {
//   mode: 'door' (closed door, cavity seen through a dark glass window) | 'cut' (door removed: the cavity's metal walls,
//          the magnetron box + waveguide in the panel area visible, labelled by the scene),
//   bowl: { heat, steam } (the rice bowl at BOWL), plate (turntable angle, rad), light (0..1 cavity lamp), key }
function ovenFront(o = {}) {
  const key = o.key || 'oven', cut = o.mode === 'cut';
  // body
  paint(rrectPts(OVEN.x + 14, OVEN.y + 20, OVEN.w, OVEN.h, 34), { fill: 'rgba(58,36,23,0.3)', line: false, key: key + 'sh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
  paint(rrectPts(OVEN.x, OVEN.y, OVEN.w, OVEN.h, 34), { fill: '#e9e3d6', key: key + 'body', w: 4.5, tex: [{ k: 'pencil', c: '#d7cfbd', al: 0.6, per: 80 }, { k: 'hatch', a: 0.8, gap: 6, al: 0.3, dens: (px, py) => clamp((px - OVEN.x) / OVEN.w * 0.6 + (py - OVEN.y) / OVEN.h * 0.6 - 0.3) }] });
  // feet
  for (const fx of [OVEN.x + 90, OVEN.x + OVEN.w - 90]) paint(rrectPts(fx - 40, OVEN.y + OVEN.h - 4, 80, 26, 8), { fill: '#5a4a3c', key: key + 'ft' + fx, w: 3 });
  // cavity
  const lit = clamp(o.light ?? 0);
  const cavFill = cut ? '#d9d4c8' : `rgb(${Math.round(lerp(58, 120, lit))},${Math.round(lerp(53, 104, lit))},${Math.round(lerp(48, 70, lit))})`;
  paint(rrectPts(CAV.x, CAV.y, CAV.w, CAV.h, 26), { fill: cavFill, key: key + 'cav', w: 4, tex: cut ? [{ k: 'hatch', a: 0.8, gap: 7, al: 0.35, dens: (px, py) => clamp((py - CAV.y) / CAV.h) }] : [{ k: 'hatch', a: -0.7, gap: 6, al: 0.25 }] });
  if (cut) {   // perspective lines of the box interior
    const ix = CAV.x + 60, iy = CAV.y + 50, iw = CAV.w - 120, ih = CAV.h - 110;
    ink(rrectPts(ix, iy, iw, ih, 10), { closed: true, w: 2.4, key: key + 'back', color: 'rgba(58,36,23,0.6)' });
    for (const [a, b] of [[[CAV.x, CAV.y], [ix, iy]], [[CAV.x + CAV.w, CAV.y], [ix + iw, iy]], [[CAV.x, CAV.y + CAV.h], [ix, iy + ih]], [[CAV.x + CAV.w, CAV.y + CAV.h], [ix + iw, iy + ih]]]) ink([a, b], { w: 2.4, key: key + 'pl' + a[0] + a[1], color: 'rgba(58,36,23,0.6)' });
  }
  // turntable + bowl
  const pa = o.plate ?? 0;
  paint(ellipsePts(BOWL.x, BOWL.y + BOWL.r * 0.75, BOWL.r * 1.55, BOWL.r * 0.32, 0, 40), { fill: '#eef3f2', key: key + 'plate', w: 3, tex: [{ k: 'pencil', c: '#cfdcdb', al: 0.6, per: 60 }] });
  const mk = [BOWL.x + Math.cos(pa) * BOWL.r * 1.3, BOWL.y + BOWL.r * 0.75 + Math.sin(pa) * BOWL.r * 0.27];
  ink([[mk[0] - 10, mk[1]], [mk[0] + 10, mk[1]]], { w: 5, key: key + 'pm', color: 'rgba(58,36,23,0.6)' });
  riceBowl(BOWL.x, BOWL.y, BOWL.r, { heat: o.bowl?.heat, steam: o.bowl?.steam, key: key + 'bowl' });
  if (!cut) {   // the door glass: dark, a little shine, the mesh suggested by a few faint lines (not dots)
    ink(rrectPts(CAV.x - 18, CAV.y - 18, CAV.w + 36, CAV.h + 36, 34), { closed: true, w: 5, key: key + 'door' });
    ctx.save(); ctx.globalAlpha = 0.18; ink([[CAV.x + 60, CAV.y + 80], [CAV.x + 220, CAV.y + 40]], { w: 16, color: '#fff', key: key + 'shine' }); ctx.restore();
    ink([[CAV.x + CAV.w - 10, CAV.y + 160], [CAV.x + CAV.w - 10, CAV.y + CAV.h - 160]], { w: 12, key: key + 'handle', color: '#5a4a3c' });
  }
  // panel: a small display + a dial + a button
  paint(rrectPts(PANEL.x + 20, PANEL.y + 40, PANEL.w - 40, 90, 12), { fill: '#2c3a33', key: key + 'disp', w: 3 });
  if (o.display) handText(o.display, PANEL.x + 34, PANEL.y + 104, 50, '#9fe3a8', { key: key + 'dt' });
  paint(ellipsePts(PANEL.x + PANEL.w / 2, PANEL.y + 260, 56, 56, 0, 30), { fill: '#d8d0c0', key: key + 'dial', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.4, dens: (px, py) => clamp((px - PANEL.x - 60) / 100) }] });
  const da = o.dial ?? -0.6;
  ink([[PANEL.x + PANEL.w / 2, PANEL.y + 260], [PANEL.x + PANEL.w / 2 + Math.cos(da) * 44, PANEL.y + 260 + Math.sin(da) * 44]], { w: 6, key: key + 'dn' });
  paint(rrectPts(PANEL.x + 35, PANEL.y + 400, PANEL.w - 70, 70, 14), { fill: '#d8d0c0', key: key + 'btn', w: 3.2 });
}
// the magnetron (in the panel area, 'cut' mode): a hatched metal cylinder with fins + the waveguide into the cavity top.
// Returns the waveguide mouth [x, y] (where waves enter the cavity).
function magnetron(o = {}) {
  const key = o.key || 'mag', x = PANEL.x + PANEL.w / 2, y = PANEL.y + 170;
  paint(rrectPts(x - 66, y - 90, 132, 180, 18), { fill: COL.metal, key: key + 'b', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.45, dens: (px) => clamp((px - x + 40) / 90) }] });
  for (let i = 0; i < 5; i++) ink([[x - 82, y - 64 + i * 32], [x + 82, y - 64 + i * 32]], { w: 4, key: key + 'fin' + i });
  const glow = clamp(o.on ?? 0);
  if (glow > 0) paint(ellipsePts(x, y, 30, 30, 0, 20), { fill: `rgba(240,197,90,${0.5 + 0.5 * glow})`, key: key + 'core', w: 3 });
  // waveguide: a rectangular duct from the magnetron top, over into the cavity's upper right
  const mouth = [CAV.x + CAV.w - 120, CAV.y + 30];
  paint([[x - 30, y - 90], [x + 30, y - 90], [x + 30, CAV.y - 40], [mouth[0] - 40, CAV.y - 40], [mouth[0] - 40, CAV.y + 10], [x - 30, CAV.y + 10]].map((p) => p), { fill: COL.metalD, key: key + 'wg', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.35 }] });
  return mouth;
}
