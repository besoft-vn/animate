// =====================================================================
//  PROPS — nồi cơm điện (director's shared helpers; scene agents use them, never edit them)
//  Style: isometric (white ground, constant hairlines, white faces, springs). Text: Pangolin only (Vietnamese glyphs).
//  Colour = one meaning:  BLUE (COL.water*) = water / steam / the hero (one drop of water) only
//                         ORANGE (COL.heat*) = heat / hot only (the glowing plate, heat arrows, hot readouts)
//                         ACCENT dark (PAL.accent) = the magnet + its pull (field lines) — the one focus
//                         grey hairlines (PAL.edge / PAL.inner) = everything else.
// =====================================================================
const COL = {
  water: '#3f8fd8', waterL: '#d6e8f8', waterM: '#9cc8ee',
  heat: '#e8702a', heatL: '#fbd9c2', heatM: '#f4a26b',
  rice: '#f6f1e4', riceE: '#d9d0bb',
};
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
      ctx.fillStyle = o.col ?? COL.heatL; ctx.fillRect(x + pre - 8, y - 46, hw + 16, 60);
    }
    ctx.fillStyle = PAL.text; ctx.textAlign = 'left'; ctx.fillText(s, x, y);
  });
  polyPath([[CX - 22, 1290], [CX + 22, 1290]], false); hair(PAL.edge); ctx.stroke();
  ctx.restore();
}
const viCaption = (lines, hi, o = {}) => { const f = () => viCaptionDraw(lines, hi, o); if (DEFER) DEFER.push(f); else f(); };

// =====================================================================
//  THE HERO — one drop of water ("giọt nước cuối cùng"): a blue teardrop with two dark eyes. In the end it becomes
//  steam: steam 0 = drop, 1 = a small puffy cloud (same eyes, same blue outline, paler).
//  heroDrop(x, y, r, { steam 0..1, look -1..1, squash 0..1, key, al, mood: 'calm'|'wow'|'hot' })
//  (x, y) = the centre of the body. r = HR normally (≈ 54 px).
// =====================================================================
function dropPts(x, y, r, n = 48) {   // teardrop, point up
  const P = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, s = Math.sin(a), c = Math.cos(a);
    const px = r * s * (0.55 + 0.45 * (1 - c) / 2) * 1.0, py = -r * c * 1.15;
    P.push([x + px, y + py + r * 0.15]);
  }
  return P;
}
function cloudPts(x, y, r, n = 48) {   // a puffy cloud: radius modulated by 5 lobes
  const P = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * TAU; const rr = r * (1.05 + 0.13 * Math.cos(5 * a + 0.6)); P.push([x + Math.sin(a) * rr * 1.18, y - Math.cos(a) * rr * 0.86]); }
  return P;
}
function heroOutline(x, y, r, steam = 0, n = 48) {
  const A = dropPts(x, y, r, n), B = cloudPts(x, y, r, n), k = EZ.io(clamp(steam));
  return A.map((p, i) => [lerp(p[0], B[i][0], k), lerp(p[1], B[i][1], k)]);
}
function heroDrop(x, y, r = HR, o = {}) {
  const st = clamp(o.steam ?? 0), bob = Math.sin(TT * TAU * 0.7 + (o.ph ?? 0)) * r * 0.05, sq = clamp(o.squash ?? 0);
  y += bob;
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  ctx.translate(x, y); ctx.scale(1 + sq * 0.18, 1 - sq * 0.18); ctx.translate(-x, -y);
  const P = heroOutline(x, y, r, st);
  polyPath(P, true); ctx.fillStyle = mixHex(COL.waterL, '#eef5fc', st); ctx.fill();
  hair(COL.water, 4); ctx.stroke();
  // a small highlight stroke (drop only)
  if (st < 0.6) { polyPath(arcPts(x - r * 0.3, y - r * 0.05, r * 0.42, Math.PI * 1.05, Math.PI * 1.45, 8), false); hair('#ffffff', 5); ctx.globalAlpha *= 1 - st; ctx.stroke(); ctx.globalAlpha = clamp(o.al ?? 1); }
  // eyes (the hero's two dark dots), blink every ~2.6 s
  const lk = (o.look ?? 0) * r * 0.18, blink = mod(TT + (o.ph ?? 0) * 0.3, 2.6) < 0.09;
  const mood = o.mood ?? 'calm';
  for (const ex of [-0.28, 0.28]) {
    ctx.beginPath();
    if (mood === 'wow') ctx.ellipse(x + ex * r + lk, y + r * 0.12, r * 0.1, blink ? r * 0.02 : r * 0.16, 0, 0, TAU);
    else ctx.ellipse(x + ex * r + lk, y + r * 0.15, r * 0.085, blink ? r * 0.02 : r * 0.13, 0, 0, TAU);
    ctx.fillStyle = PAL.accent; ctx.fill();
  }
  // mouth
  ctx.beginPath();
  if (mood === 'wow') ctx.ellipse(x + lk, y + r * 0.5, r * 0.09, r * 0.11, 0, 0, TAU);
  else if (mood === 'hot') { ctx.moveTo(x - r * 0.16 + lk, y + r * 0.5); ctx.lineTo(x + r * 0.16 + lk, y + r * 0.5); }
  else ctx.arc(x + lk, y + r * 0.38, r * 0.16, 0.2 * Math.PI, 0.8 * Math.PI);
  hair(PAL.accent, 3.5); ctx.stroke();
  ctx.restore();
  SPARK_AT = toScreen(x, y);
}
// the hero's state on any bridge: a drop until it has boiled off (in "dry"), steam after
const heroSteamAt = (t) => (t < ET('curie') - 0.6 ? 0 : 1);
STYLE.hero = (x, y, r, o = {}) => heroDrop(x, y, r, { steam: heroSteamAt(TT), mood: 'calm', key: o.key });
STYLE.heroPts = (x, y, r, n = 96) => heroOutline(x, y, r, heroSteamAt(TT), n);
STYLE.heroColor = COL.water;

// =====================================================================
//  SMALL PIECES
// =====================================================================
// a heat arrow (wavy, orange) from (x0, y0) to (x1, y1); part 0..1 grows from the tail; phase animates the wave
function heatArrow(x0, y0, x1, y1, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01) return;
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux;
  const P = [], amp = o.amp ?? 9, ph = (o.ph ?? 0) + TT * 6;
  for (let i = 0; i <= 24; i++) { const s = (i / 24) * L * k; const w = Math.sin(s / 22 - ph) * amp * Math.min(1, s / 30, (L * k - s) / 30 + 0.2); P.push([x0 + ux * s + nx * w, y0 + uy * s + ny * w]); }
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  polyPath(P, false); hair(o.col ?? COL.heat, o.w ?? 6); ctx.stroke();
  const e = P[P.length - 1], hl = 22;
  polyPath([[e[0] - ux * hl + nx * hl * 0.6, e[1] - uy * hl + ny * hl * 0.6], e, [e[0] - ux * hl - nx * hl * 0.6, e[1] - uy * hl - ny * hl * 0.6]], false); ctx.stroke();
  ctx.restore();
}
// a straight arrow (hairline grey by default) — for "falls", "pushes up", motion cues
function simpleArrow(x0, y0, x1, y1, o = {}) {
  const k = clamp(o.part ?? 1); if (k <= 0.01) return;
  const ex = lerp(x0, x1, k), ey = lerp(y0, y1, k), L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, hl = o.head ?? 20;
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  polyPath([[x0, y0], [ex, ey]], false); hair(o.col ?? PAL.edge, o.w ?? 5); ctx.stroke();
  polyPath([[ex - ux * hl + nx * hl * 0.6, ey - uy * hl + ny * hl * 0.6], [ex, ey], [ex - ux * hl - nx * hl * 0.6, ey - uy * hl - ny * hl * 0.6]], false); ctx.stroke();
  ctx.restore();
}
// a temperature readout card: "100°C" big, with a small thermometer glyph; hot (0..1) tints the number orange
function tempCard(x, y, val, o = {}) {
  const a = clamp(o.al ?? 1); if (a <= 0.001) return;
  const str = `${Math.round(val)}°C`, w = 250, h = 104;
  ctx.save(); ctx.globalAlpha = a;
  polyPath(rrectPts(x - w / 2, y - h / 2, w, h, 22, 5), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge); ctx.stroke();
  // thermometer glyph
  const tx = x - w / 2 + 40, hot = clamp(o.hot ?? 0);
  polyPath(rrectPts(tx - 9, y - 36, 18, 56, 9, 4), true); hair(PAL.edge, 3); ctx.stroke();
  ctx.beginPath(); ctx.arc(tx, y + 26, 15, 0, TAU); ctx.fillStyle = mixHex(COL.waterM, COL.heat, hot); ctx.fill(); hair(PAL.edge, 3); ctx.stroke();
  ctx.fillStyle = mixHex(COL.waterM, COL.heat, hot); ctx.fillRect(tx - 4, y + 20 - (o.fill ?? 0.6) * 52, 8, (o.fill ?? 0.6) * 52);
  ctx.restore();
  vtext(str, x + 28, y + 22, 64, { col: mixHex(PAL.text, COL.heat, hot), al: a });
}

// =====================================================================
//  THE CUTAWAY (sc-switch and sc-water): a front-on section through the cooker, drawn as a flat isometric
//  "section plane" (hairlines, white fills). Screen coords at scale s around (ox, oy) = SECT origin.
//  Fixed layout at s = 1 (SECT = { x: 540, y: 0 }):  body x 170–910, y 500–1180 · inner pot x 240–840, bottom y 1000 ·
//  heating plate ring y 1008–1040 (gap x 486–594 for the thermostat) · ferrite x 506–574, y 1004–1034 (pressed to the
//  pot) · magnet x 506–574, y 1040–1084 when UP (touching ferrite), 46 px lower when DOWN · lever pivot (390, 1118):
//  right end under the magnet rod, left end at the front knob (200, 1110) · contacts at x 650–720, y 1112 · lamps on the
//  front: "nấu" (640, 1150), "giữ ấm" (780, 1150).
//  o: { water 0..1 (level above the rice: 0 dry, 1 full), rice 0..1 (rice mass height), heat 0..1 (plate glow),
//       mag 0..1 (1 up/touching, 0 dropped), field 0..1 (pull lines between magnet & ferrite), ferHot 0..1,
//       cook 0..1 (contacts closed + "nấu" lamp), warm 0..1 ("giữ ấm" lamp), lid (true), bubbles 0..1, steamOut 0..1,
//       flow 0..1 (current dashes on the wires) }
//  Returns handy points: { potBottom, waterTop, ferrite: [x, y], magnet: [x, y], knob: [x, y], vent: [x, y] }
// =====================================================================
const SECT = { x: 0, y: 0, s: 1 };
function cutaway(o = {}) {
  const water = clamp(o.water ?? 0.8), rice = clamp(o.rice ?? 0.6), heat = clamp(o.heat ?? 0), mag = clamp(o.mag ?? 1);
  const field = clamp(o.field ?? 0), ferHot = clamp(o.ferHot ?? 0), cook = clamp(o.cook ?? 0), warm = clamp(o.warm ?? 0);
  ctx.save(); ctx.translate(SECT.x, SECT.y);
  // -- outer body (a slab seen front-on: a light thickness line under it)
  const BODY = rrectPts(170, 500, 740, 680, 70, 8);
  polyPath(BODY.map(([x, y]) => [x + 10, y + 12]), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.inner); ctx.stroke();
  polyPath(BODY, true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge); ctx.stroke();
  // section hatch strip (the cut wall) — a light inner line parallel to the outline
  polyPath(rrectPts(196, 526, 688, 628, 52, 8), true); hair(PAL.inner); ctx.stroke();
  // -- the lid (a low dome) + steam vent
  if (o.lid !== false) {
    const L = [[170, 520]]; for (let i = 0; i <= 20; i++) { const u = i / 20; L.push([lerp(170, 910, u), 520 - Math.sin(u * Math.PI) * 90]); } L.push([910, 520]);
    polyPath(L, true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge); ctx.stroke();
    polyPath(rrectPts(516, 412, 48, 26, 10, 4), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge); ctx.stroke();   // vent knob
    polyPath(rrectPts(700, 452, 60, 16, 8, 4), true); hair(PAL.inner); ctx.stroke();   // vent slot
  }
  // -- inner pot (U), white inside
  const POT = [[240, 560], [240, 960], ...arcPts(280, 960, 40, Math.PI, Math.PI / 2, 6), [800, 1000], ...arcPts(800, 960, 40, Math.PI / 2, 0, 6), [840, 560]];
  const POTIN = [[252, 560], [252, 958], ...arcPts(282, 958, 30, Math.PI, Math.PI / 2, 6), [798, 988], ...arcPts(798, 958, 30, Math.PI / 2, 0, 6), [828, 560]];
  polyPath(POT, false); hair(PAL.edge, 4); ctx.stroke();
  // rice mass (flat cream, a few big soft bumps on top — no grains)
  const rTop = lerp(985, 800, rice);
  if (rice > 0.01) {
    const R = [[254, 986]]; for (let i = 0; i <= 24; i++) { const u = i / 24; R.push([lerp(254, 826, u), rTop + Math.sin(u * Math.PI * 6) * 8]); } R.push([826, 986]);
    polyPath(R, true); ctx.fillStyle = COL.rice; ctx.fill(); hair(COL.riceE, 3); ctx.stroke();
  }
  // water: from rTop up to waterTop (blue tint, gently waving surface)
  const wTop = lerp(rTop, 640, water);
  if (water > 0.01) {
    const Wt = []; for (let i = 0; i <= 30; i++) { const u = i / 30; Wt.push([lerp(254, 826, u), wTop + Math.sin(u * 14 + TT * 3) * (2 + 5 * clamp(o.bubbles ?? 0))]); }
    const Wp = [...Wt, [826, rTop + 6], [254, rTop + 6]];
    ctx.save(); ctx.globalAlpha = 0.55; polyPath(Wp, true); ctx.fillStyle = COL.waterL; ctx.fill(); ctx.restore();
    polyPath(Wt, false); hair(COL.water, 3.5); ctx.stroke();
    // a few big bubbles rising (≤ 5, r ≥ 14) when boiling
    const nb = Math.round(5 * clamp(o.bubbles ?? 0));
    for (let i = 0; i < nb; i++) {
      const ph = mod(TT * 0.8 + i * 0.37, 1), bx = 330 + i * 110 + Math.sin(TT * 2 + i) * 8, by = lerp(rTop - 10, wTop + 10, ph);
      if (by > wTop + 8) { ctx.beginPath(); ctx.arc(bx, by, 14 + 4 * ph, 0, TAU); ctx.fillStyle = '#ffffff'; ctx.fill(); hair(COL.water, 3); ctx.stroke(); }
    }
  }
  polyPath(POTIN, false); hair(PAL.inner); ctx.stroke();
  // -- heating plate (ring with a centre gap) — glows orange with heat
  const plateC = mixHex('#ffffff', COL.heatL, heat), plateE = mixHex(PAL.edge, COL.heat, heat);
  for (const [x0, x1] of [[262, 486], [594, 818]]) {
    polyPath(rrectPts(x0, 1008, x1 - x0, 32, 12, 4), true); ctx.fillStyle = plateC; ctx.fill(); hair(plateE, 3); ctx.stroke();
    // a heating-element line inside the plate
    polyPath([[x0 + 20, 1024], [x1 - 20, 1024]], false); hair(mixHex(PAL.inner, COL.heat, heat), 4); ctx.stroke();
  }
  // -- the thermostat: ferrite (pressed to the pot) above, magnet (accent) below on a rod
  const ferC = mixHex('#ffffff', COL.heatL, ferHot);
  polyPath(rrectPts(506, 1004, 68, 30, 6, 3), true); ctx.fillStyle = ferC; ctx.fill(); hair(mixHex(PAL.edge, COL.heat, ferHot), 3.5); ctx.stroke();
  // housing cup around the magnet travel
  polyPath([[494, 1036], [494, 1140], [586, 1140], [586, 1036]], false); hair(PAL.inner); ctx.stroke();
  const my = 1040 + (1 - mag) * 46;
  polyPath(rrectPts(510, my, 60, 44, 6, 3), true); ctx.fillStyle = PAL.accent; ctx.fill();
  // N/S split line on the magnet
  polyPath([[512, my + 22], [568, my + 22]], false); hair('#ffffff', 2); ctx.stroke();
  // pull lines between magnet and ferrite (accent, dashed, breathing)
  if (field > 0.01) {
    ctx.save(); ctx.globalAlpha = field; ctx.setLineDash([8, 8]); ctx.lineDashOffset = -TT * 30;
    for (const dx of [-1, 1]) { polyPath(arcPts(540 + dx * 34, (my + 1019) / 2 + 2, 30 + 6 * Math.sin(TT * 4), dx < 0 ? Math.PI * 0.5 : -Math.PI * 0.5, dx < 0 ? Math.PI * 1.5 : Math.PI * 0.5, 10), false); hair(PAL.accent, 3); ctx.stroke(); }
    ctx.restore();
  }
  // rod from the magnet down to the lever's right end
  const rodY = my + 44;
  // lever: pivot (390, 1118). Right end follows the magnet: up (y 1100) when mag = 1, down (y 1146) when mag = 0
  const ry = lerp(1146, 1100, mag);   // the left end mirrors around the pivot
  const lyy = 1118 - (ry - 1118) * (390 - 200) / (540 - 390);
  polyPath([[540, rodY], [540, ry]], false); hair(PAL.edge, 4); ctx.stroke();
  polyPath([[200, lyy], [540, ry]], false); hair(PAL.edge, 6); ctx.stroke();
  ctx.beginPath(); ctx.arc(390, 1118, 9, 0, TAU); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge, 3); ctx.stroke();
  // the front knob on the left end (sticks out of the body)
  polyPath(rrectPts(138, lyy - 22, 70, 44, 14, 4), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge, 4); ctx.stroke();
  // contacts: the moving leaf is pushed up by the lever's right side; touches the fixed one when cook
  const cy = lerp(1128, 1092, cook);
  polyPath([[650, 1096], [724, 1096]], false); hair(PAL.edge, 5); ctx.stroke();            // fixed
  polyPath([[600, cy + 4], [724, cy + 4]], false); hair(PAL.edge, 5); ctx.stroke();        // moving
  // wires: contact -> plate (current dashes in heat colour when flowing)
  const WIRE = [[724, 1096], [860, 1096], [860, 1040], [818, 1040]];
  polyPath(WIRE, false); hair(PAL.inner, 3); ctx.stroke();
  if ((o.flow ?? cook) > 0.01) { ctx.save(); ctx.globalAlpha = clamp(o.flow ?? cook); ctx.setLineDash([14, 16]); ctx.lineDashOffset = -TT * 60; polyPath(WIRE, false); hair(COL.heat, 4); ctx.stroke(); ctx.restore(); }
  // lamps + their labels on the front
  for (const [lx, on, str] of [[640, cook, 'nấu'], [780, warm, 'giữ ấm']]) {
    ctx.beginPath(); ctx.arc(lx, 1150, 13, 0, TAU); ctx.fillStyle = mixHex('#ffffff', COL.heat, on); ctx.fill(); hair(PAL.edge, 3); ctx.stroke();
  }
  ctx.restore();
  return { potBottom: 1000, waterTop: wTop, riceTop: rTop, ferrite: [540, 1019], magnet: [540, my + 22], knob: [173, lyy], vent: [730, 450] };
}

// =====================================================================
//  THE COOKER, OUTSIDE (sc-cooker): an isometric rice cooker on a small plinth. COOKER = world placement.
//  cookerIso(o): o { lidOpen 0..1, cook 0..1 (lamp "nấu"), warm 0..1 (lamp "giữ ấm"), knobUp 0..1 (0 = pressed down
//  to cook, 1 = popped up), steam 0..1 (two wisps from the vent) }. Returns { vent: [x, y] screen, knob: [x, y] screen }
// =====================================================================
const COOKER = { ox: 540, oy: 900, u: 1.0 };
function cookerIso(o = {}) {
  const keep = ISO; setIso(COOKER);
  const R = 190, Hb = 250;
  // plinth
  isoPlates(-300, -300, -40, 600, 600, [{ h: 14, r: 50 }, { h: 12, gap: 6, inset: 14, r: 44 }]);
  // body: a rounded cylinder
  isoCyl(0, 0, -8, R, Hb);
  // a band line near the top + the base ring
  facePath(faceOf([0, 0, Hb - 30], [1, 0, 0], [0, 1, 0]), ellipsePts(0, 0, R, R, 0, 40).filter(([u, v]) => u + v > -20), false); hair(PAL.inner); ctx.stroke();
  // lid: a dome on top
  const lz = Hb - 8;
  isoCyl(0, 0, lz, R - 6, 20);
  const D = []; for (let i = 0; i <= 24; i++) { const a = Math.PI * (i / 24); D.push(isoP([Math.cos(a) * (R - 6) * 0.7071, -Math.cos(a) * (R - 6) * 0.7071, lz + 20 + Math.sin(a) * 70])); }
  polyPath(D, false); hair(PAL.edge); ctx.stroke();
  // handle on the lid
  isoBox(-40, -12, lz + 82, 80, 24, 16, { r: 10 });
  // steam vent
  const vent = isoP([60, -90, lz + 64]);
  ctx.beginPath(); ctx.ellipse(vent[0], vent[1], 16, 8, 0, 0, TAU); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge); ctx.stroke();
  if ((o.steam ?? 0) > 0.01) for (let i = 0; i < 2; i++) {
    const P = []; for (let k = 0; k <= 14; k++) { const q = k / 14; P.push([vent[0] - 10 + i * 20 + Math.sin(q * 5 + TT * 3 + i * 2) * 10 * q, vent[1] - 12 - q * 130 * o.steam]); }
    ctx.save(); ctx.globalAlpha = o.steam; polyPath(P, false); hair(COL.waterM, 4); ctx.stroke(); ctx.restore();
  }
  // front control panel on the +x+y side (facing the viewer)
  const n = [0.7071, 0.7071, 0], c0 = [R * 0.7071, R * 0.7071, 0];
  const fp = faceOf(vadd(c0, [-60 * 0.7071, 60 * 0.7071, 150]), [0.7071, -0.7071, 0], [0, 0, -1]);
  faceRR(fp, 0, 0, 120, 120, 18, { fill: PAL.face, stroke: PAL.edge });
  // two lamps (orange when lit) + the knob slot
  const lampAt = (u, v, on) => { faceEll(fp, u, v, 10, 10, { fill: mixHex('#ffffff', COL.heat, clamp(on)), stroke: PAL.edge }); };
  lampAt(30, 24, o.cook ?? 0); lampAt(90, 24, o.warm ?? 0);
  faceRR(fp, 50, 44, 20, 66, 8, { stroke: PAL.inner });
  const kv = lerp(92, 58, clamp(o.knobUp ?? 0));
  faceSlab(fp, 42, kv - 12, 36, 24, 10, {});
  const knob = isoP(fp(60, kv));
  ISO = keep;
  return { vent: toScreen(...vent), knob: toScreen(...knob), lampCook: toScreen(...isoP(fp(30, 24))), lampWarm: toScreen(...isoP(fp(90, 24))) };
}

// =====================================================================
//  THE LENS: a magnified round callout of the thermostat (the cutaway drawn again at zoom z around the ferrite),
//  so the magnet / ferrite / lever read on a phone. (cx, cy) screen centre, R radius, o = the same options as cutaway()
//  plus o.al (fade), o.k (0..1 grow-in). A hairline leader joins the lens to the real thermostat at (540, 1040).
//  Typical: thermoLens(540, 640, 250, 3.0, {...}) — covers the water area; the hero sits beside it, not inside.
// =====================================================================
const LENS_C = [540, 1060];   // the point of the cutaway the lens centres on (between ferrite and magnet)
function thermoLens(cx, cy, R, z, o = {}) {
  const k = clamp(o.k ?? 1); if (k <= 0.01) return;
  const r = R * k;
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  // leader lines from the lens to the real thermostat
  polyPath([[cx - r * 0.5, cy + r * 0.87], [LENS_C[0] - 40, 1036]], false); hair(PAL.inner, 3); ctx.stroke();
  polyPath([[cx + r * 0.5, cy + r * 0.87], [LENS_C[0] + 40, 1036]], false); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = PAL.face; ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  ctx.translate(cx, cy); ctx.scale(z * k, z * k); ctx.translate(-LENS_C[0], -LENS_C[1]);
  cutaway({ ...o, lid: false });
  ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); hair(PAL.edge, 4); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, TAU); hair(PAL.inner, 3); ctx.stroke();
  ctx.restore();
  // screen positions of parts inside the lens (for labels): ferrite, magnet (up), lever pivot
  const P = (x, y) => [cx + (x - LENS_C[0]) * z * k, cy + (y - LENS_C[1]) * z * k];
  return { ferrite: P(540, 1019), magnet: P(540, 1062 + (1 - clamp(o.mag ?? 1)) * 46), pot: P(540, 1000), plateL: P(374, 1024), plateR: P(706, 1024) };
}
