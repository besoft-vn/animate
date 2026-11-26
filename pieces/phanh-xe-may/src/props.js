// =====================================================================
//  PROPS — phanh xe máy (director's shared helpers; scene agents use them, never edit them)
//  Colour code: BLUE COL.oil = brake fluid / pressure ONLY · RED C.red (forceArrow) = FORCES ONLY ·
//  TERRACOTTA (tempCol(u), heatWisps) = HEAT ONLY · steel greys = metal · ink = everything else.
//  The bike faces RIGHT and moves RIGHT; wheels turn CLOCKWISE (spin angle grows with time when moving).
// =====================================================================

// steel (u = 0) -> glowing terracotta (u = 1): a disc / pad warming up
function tempCol(u) {
  const a = [201, 198, 191], b = [217, 119, 87], k = clamp(u), c = a.map((v, i) => lerp(v, b[i], k));
  return `rgb(${c.map(Math.round).join(',')})`;
}

// a FORCE arrow (red, ink-outlined) from (ax, ay) to the tip (bx, by). o: { w (14), head (36), frac (write-on), key, al }
// Only for forces (squeeze, push, clamp, grip, weight). Thickness can grow with the force's size (w).
function forceArrow(ax, ay, bx, by, o = {}) {
  const L = Math.hypot(bx - ax, by - ay); if (L < 2) return;
  const f = clamp(o.frac ?? 1), ux = (bx - ax) / L, uy = (by - ay) / L, w = o.w ?? 14, h = o.head ?? Math.max(30, w * 2.4);
  const tx = ax + (bx - ax) * f, ty = ay + (by - ay) * f, ang = Math.atan2(uy, ux), key = o.key || 'fa', al = o.al ?? 1;
  const l = [tx - Math.cos(ang - 0.55) * h, ty - Math.sin(ang - 0.55) * h], r = [tx - Math.cos(ang + 0.55) * h, ty - Math.sin(ang + 0.55) * h];
  const base = [tx - ux * h * 0.6, ty - uy * h * 0.6];
  ink([[ax, ay], base], { w: w + 7, color: C.ink, key: key + 'o', alpha: al, amt: 1 });
  ink([[ax, ay], base], { w, color: C.red, key, alpha: al, amt: 1 });
  ctx.globalAlpha = al;
  paint([l, [tx, ty], r], { fill: C.red, key: key + 'h', w: 3.5, amt: 0.8 });
  ctx.globalAlpha = 1;
}

// heat shimmer: n (≤ 4) wavy terracotta wisps rising from (x, y). o: { n (3), amt 0..1 (height/opacity), spread (40), key, w (6) }
function heatWisps(x, y, o = {}) {
  const n = Math.min(4, o.n ?? 3), a = clamp(o.amt ?? 1), sp = o.spread ?? 40;
  if (a <= 0) return;
  for (let i = 0; i < n; i++) {
    const P = [], ox = x - sp + (n > 1 ? i * 2 * sp / (n - 1) : sp);
    for (let k = 0; k <= Math.round(9 * a); k++) P.push([ox + Math.sin(k * 0.8 - TT * 4 + i * 1.7) * 12, y - k * 16]);
    if (P.length > 1) ink(P, { w: o.w ?? 6, color: `rgba(217,119,87,${0.3 + 0.5 * a})`, key: (o.key || 'hw') + i });
  }
}

// a hand-lettered label with a thin ink leader to (px, py). o: { size (54), color, frac, key, al }
function label(str, x, y, px, py, o = {}) {
  const sz = o.size ?? 54, key = o.key || 'lb' + str, al = o.al ?? 1;
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha = al;
  if (px != null) ink([[x + (o.lx ?? 0), y + (o.ly ?? 10)], [px, py]], { w: 2.6, color: 'rgba(58,36,23,0.8)', key: key + 'l', frac: o.frac, amt: 1 });
  handText(str, x, y, sz, o.color || C.ink, { key, frac: o.frac });
  ctx.restore();
}

// ---- THE ROAD: asphalt band from y0 down; lane dashes slide LEFT by `scroll` px (bike moving right). o: { key }
function road(y0, scroll = 0, o = {}) {
  const key = o.key || 'road';
  paint(box(-60, y0, W + 120, H - y0 + 60), { fill: COL.road, key: key + 'b', w: 4, tex: [{ k: 'hatch', a: 0.15, gap: 9, al: 0.25, dens: (px, py) => clamp((py - y0) / 300) }] });
  const gap = 260, len = 120, yy = y0 + 70;
  for (let i = -1; i < 7; i++) {
    const x = mod(i * gap - scroll, gap * 6) - gap;
    paint(box(x, yy, len, 16), { fill: '#f4ecd9', key: key + 'd' + i, w: 2.4, amt: 0.6 });
  }
}

// ---- a brake DISC seen face-on (centre x, y, radius r), turned by `ang` (clockwise as it grows).
// o: { heat 0..1 (tint + glow ring), holes (true), key, hub (true) }
function brakeDisc(x, y, r, ang = 0, o = {}) {
  const key = o.key || 'disc', h = clamp(o.heat ?? 0);
  if (h > 0.05) ink(ellipsePts(x, y, r * 1.06, r * 1.06, 0, 48), { closed: true, w: r * 0.16 * h, color: `rgba(217,119,87,${0.35 * h})`, key: key + 'gl' });
  paint(ellipsePts(x, y, r, r, 0, 48), { fill: tempCol(h * 0.85), key: key + 'b', w: Math.max(3, r * 0.025), tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.3, dens: (px, py) => clamp(((px - x) + (py - y)) / (2 * r) + 0.5) }] });
  // the friction ring (where the pads rub): a slightly darker band
  ink(ellipsePts(x, y, r * 0.78, r * 0.78, 0, 48), { closed: true, w: r * 0.03, color: 'rgba(58,36,23,0.35)', key: key + 'rg' });
  if (o.holes !== false) for (let i = 0; i < 8; i++) {
    const a = ang + i * TAU / 8, hx = x + Math.cos(a) * r * 0.64, hy = y + Math.sin(a) * r * 0.64;
    paint(ellipsePts(hx, hy, r * 0.07, r * 0.07, 0, 14), { fill: '#f4ecd9', key: key + 'h' + i, w: Math.max(2, r * 0.018), amt: 0.6 });
  }
  if (o.hub !== false) {
    paint(ellipsePts(x, y, r * 0.38, r * 0.38, 0, 32), { fill: COL.steelL, key: key + 'hub', w: Math.max(2.5, r * 0.02), tex: [{ k: 'hatch', a: -0.7, gap: 6, al: 0.3 }] });
    for (let i = 0; i < 5; i++) { const a = ang + i * TAU / 5; paint(ellipsePts(x + Math.cos(a) * r * 0.24, y + Math.sin(a) * r * 0.24, r * 0.045, r * 0.045, 0, 10), { fill: COL.steelD, key: key + 'b' + i, w: 2, amt: 0.4 }); }
  }
}

// ---- THE SCOOTER, side view, facing RIGHT, in the street layout (FW, RW, GRIP in head.html). The scene moves the
// world around it (road scroll) rather than the bike. o: {
//   spin   wheel angle (rad, grows clockwise while rolling),
//   pitch  nose-dive (rad, + = front goes DOWN while braking; the body + rider rotate about the rear axle, max ~0.05),
//   squeeze 0..1 (the front brake lever pulled toward the grip), heat 0..1 (front disc tint + wisps),
//   rider (true), speed 0..1 (ink speed lines behind the bike), key }
function scooter(o = {}) {
  const key = o.key || 'sc', spin = o.spin ?? 0, pitch = o.pitch ?? 0, sq = clamp(o.squeeze ?? 0), heat = clamp(o.heat ?? 0);
  const [fx, fy, fr] = FW, [rx, ry, rr] = RW;
  // ground shadow
  paint(ellipsePts((fx + rx) / 2, GROUND_Y + 4, 330, 18, 0, 40), { fill: 'rgba(58,36,23,0.25)', line: false, key: key + 'gs', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
  // speed lines (behind, to the LEFT: the bike moves right)
  const sp = clamp(o.speed ?? 0);
  if (sp > 0.02) for (let i = 0; i < 4; i++) {
    const y = 760 + i * 95, x1 = 150 - i * 20, len = 170 * sp;
    ink([[x1 - len, y], [x1, y]], { w: 5, color: 'rgba(58,36,23,0.55)', key: key + 'sl' + i, alpha: sp });
  }
  const wheel = (cx, cy, r, front) => {
    paint(ellipsePts(cx, cy, r, r, 0, 44), { fill: COL.tyre, key: key + 'ty' + front, w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.3, c: '#000' }] });
    paint(ellipsePts(cx, cy, r * 0.66, r * 0.66, 0, 40), { fill: COL.steelL, key: key + 'rim' + front, w: 3.5, tex: [{ k: 'hatch', a: -0.7, gap: 6, al: 0.25 }] });
    for (let i = 0; i < 5; i++) {          // 5 spokes: the rotation reads clearly
      const a = spin + i * TAU / 5;
      ink([[cx + Math.cos(a) * r * 0.16, cy + Math.sin(a) * r * 0.16], [cx + Math.cos(a) * r * 0.62, cy + Math.sin(a) * r * 0.62]], { w: 9, color: COL.steelD, key: key + 'sp' + front + i, amt: 0.6 });
    }
    if (front) {
      brakeDisc(cx, cy, DISC_R, spin, { heat, key: key + 'disc', hub: false });
      // the caliper on the disc's upper-rear edge (behind the fork)
      const ca = -2.25, kx = cx + Math.cos(ca) * DISC_R * 0.86, ky = cy + Math.sin(ca) * DISC_R * 0.86;
      paint(rrectPts(kx - 22, ky - 16, 44, 32, 9), { fill: COL.steelD, key: key + 'cal', w: 3, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.35 }] });
      if (heat > 0.05) heatWisps(cx + 6, cy - DISC_R - 14, { n: 3, amt: heat, spread: 26, key: key + 'hw', w: 5 });
    }
    paint(ellipsePts(cx, cy, r * 0.14, r * 0.14, 0, 16), { fill: COL.steelD, key: key + 'ax' + front, w: 3 });
  };
  wheel(rx, ry, rr, false);
  wheel(fx, fy, fr, true);
  // ---- body + rider pitch about the rear axle
  ctx.save(); ctx.translate(rx, ry); ctx.rotate(pitch); ctx.translate(-rx, -ry);
  // front fork (from the steering head down to the front axle)
  ink([[712, 690], [fx, fy]], { w: 16, color: C.ink, key: key + 'fk0' });
  ink([[712, 690], [fx, fy]], { w: 9, color: COL.steelD, key: key + 'fk' });
  // rear body over the rear wheel + seat + floorboard + leg shield
  const BODY = [[170, 980], [190, 900], [250, 850], [470, 840], [520, 880], [560, 990], [640, 990], [655, 900], [690, 760], [720, 700], [748, 712], [728, 820], [700, 1000], [660, 1030], [420, 1030], [380, 1000], [200, 1005]];
  paint(BODY, { fill: COL.body, key: key + 'body', w: 4.5, tex: [{ k: 'pencil', c: COL.bodyD, al: 0.5, per: 70 }, { k: 'hatch', a: 0.8, gap: 6, al: 0.3, dens: (px, py) => clamp((py - 860) / 180) }] });
  paint(rrectPts(240, 812, 240, 40, 18), { fill: '#5a4a3c', key: key + 'seat', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.3 }] });
  // rear fender over RW
  ink(arcPts(rx, ry, rr + 12, Math.PI * 1.05, Math.PI * 1.7, 14), { w: 8, color: COL.bodyD, key: key + 'rf' });
  // headlight + front fender
  paint(ellipsePts(752, 700, 16, 24, 0.3, 18), { fill: '#fff6d6', key: key + 'hl', w: 3 });
  ink(arcPts(fx, fy, fr + 12, Math.PI * 1.3, Math.PI * 1.9, 12), { w: 8, color: COL.bodyD, key: key + 'ff' });
  // handlebar: stem + grip, the brake lever under it (pivot near the bar end, toward the rider)
  ink([[712, 690], [GRIP[0] - 4, GRIP[1] + 8]], { w: 12, color: C.ink, key: key + 'stem' });
  ink([[GRIP[0] - 50, GRIP[1]], [GRIP[0] + 22, GRIP[1] - 4]], { w: 16, color: '#3a3530', key: key + 'grip' });
  const la = lerp(0.42, 0.12, sq), piv = [GRIP[0] + 14, GRIP[1] + 10];
  ink([piv, [piv[0] - Math.cos(la) * 78, piv[1] + Math.sin(la) * 78]], { w: 6, color: COL.steelD, key: key + 'lev', amt: 0.6 });
  if (o.rider !== false) {
    // rider: leg (hip -> knee -> foot on the floor), torso, arm to the grip, helmet. Leans forward a little with pitch.
    const hip = [380, 820], sh = [470, 620], hd = [500, 545];
    ink([hip, [560, 860], [590, 985]], { w: 34, color: '#46566e', key: key + 'leg' });
    paint([[592, 975], [640, 975], [642, 996], [588, 996]], { fill: '#3a3530', key: key + 'shoe', w: 2.5 });
    ink([hip, sh], { w: 58, color: '#7a8fb0', key: key + 'torso' });
    ink([[sh[0] + 6, sh[1] + 10], [610, 660], [GRIP[0] - 22, GRIP[1] + 2]], { w: 24, color: '#7a8fb0', key: key + 'arm' });
    paint(ellipsePts(GRIP[0] - 18, GRIP[1] + 4 + 6 * sq, 20, 17, 0, 16), { fill: '#e8b98e', key: key + 'hand', w: 3 });
    paint(ellipsePts(hd[0], hd[1], 56, 52, 0, 30), { fill: COL.helmet, key: key + 'helm', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.3, dens: (px, py) => clamp((px - hd[0] + py - hd[1]) / 80 + 0.4) }] });
    paint([[hd[0] + 18, hd[1] - 12], [hd[0] + 58, hd[1] - 6], [hd[0] + 54, hd[1] + 26], [hd[0] + 16, hd[1] + 22]], { fill: '#2e3a48', key: key + 'visor', w: 3 });
  }
  ctx.restore();
}
