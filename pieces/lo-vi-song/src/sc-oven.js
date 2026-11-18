// =====================================================================
//  SCENES — hook, magnet, bounce, end (the oven on the counter, front view). World 1080x1920.
//  Colour code: terracotta = hero + heat (steam, warm thermometer), yellow COL.wave = microwaves only,
//  COL.cold = cold (the cold thermometer). Red pencil (planInk) = the wrong guesses, crossed out.
//  Bridges: hook -> magnet -> bounce share the cavity rect CAV; bounce ends with the hero popped up out of the
//  rice at BR.bounceWater.a (440, 960); end opens on the bowl circle BR.tableEnd.b (440, 1060, 150) = BOWL.
// =====================================================================

const OV_COUNTER_Y = 1250;                                     // counter top (wood), under the oven feet
const OV_V = 240;                                              // microwave travel speed (px/s), the phase

// ---- the plain wall + wood counter, identical in every oven era
function OV_room(key) {
  paperSheet(key, { ruled: false });
  woodSurface(-40, OV_COUNTER_Y, W + 40, H + 40, key + 'ct');
  paint(box(-20, OV_COUNTER_Y - 6, W + 40, 30), { fill: C.woodL, key: key + 'edge', w: 3, tex: [{ k: 'pencil', c: C.wood, al: 0.5, per: 90, a: 0.02, len: 40 }] });
}

// ---- a probe thermometer stuck in the rice, its reading hand-lettered to the left (inside the cavity)
function OV_thermo(x, y, val, o = {}) {
  const hgt = o.h ?? 150, u = clamp(val / 90), key = o.key || 'ovth', dark = !!o.dark, line = dark ? C.peri : C.ink;
  paint(rrectPts(x - 20, y - hgt, 40, hgt + 16, 20), { fill: dark ? C.navy2 : '#fffaf0', line, w: 3, key: key + 'b' });
  paint(ellipsePts(x, y + 24, 32, 32, 0, 26), { fill: tempCol(u, false), line, w: 3, key: key + 'bulb', tex: [{ k: 'cross', c: 'rgba(0,0,0,0.25)', al: 0.4, gap: 5 }] });
  ink([[x, y + 8], [x, y - 14 - (hgt - 40) * u]], { w: 15, color: tempCol(u, false), key: key + 'col', amt: 0.6 });
  for (let i = 1; i < 4; i++) ink([[x + 6, y - i * hgt / 4.4], [x + 16, y - i * hgt / 4.4]], { w: 2, color: line, key: key + 'tk' + i, amt: 0.3 });
  const s = Math.round(val) + '°C', sz = 56;
  handText(s, x - 34 - handW(s, sz), y - hgt * 0.45, sz, o.tc || (dark ? C.white : C.ink), { key: key + 't', frac: o.frac });
}

// ---- a microwave like props.mwave, but its alpha fades the whole stroke (underlay too)
function OV_wave(ax, ay, bx, by, o = {}) {
  const L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, lam = o.lam ?? 120, amp = o.amp ?? 28, ph = o.phase ?? 0;
  const P = [];
  for (let s = 0; s <= L * clamp(o.frac ?? 1); s += 6) { const off = Math.sin((s - ph) / lam * TAU) * amp; P.push([ax + ux * s - uy * off, ay + uy * s + ux * off]); }
  if (P.length < 2) return;
  const al = o.al ?? 1;
  ink(P, { w: (o.w ?? 7) + 5, color: 'rgba(58,36,23,0.55)', key: (o.key || 'ovw') + 'o', amt: 0.8, alpha: al });
  ink(P, { w: o.w ?? 7, color: COL.wave, key: o.key || 'ovw', amt: 0.8, alpha: al });
}

// ---- one wave along a polyline, written on (f 0..1 of the whole length), its phase travelling along the path
function OV_path(P, f, key, o = {}) {
  const lens = P.slice(1).map((p, i) => dist(P[i], p)), tot = lens.reduce((a, b) => a + b, 0);
  let cum = 0;
  for (let i = 0; i < lens.length; i++) {
    const fr = clamp((f * tot - cum) / lens[i]);
    if (fr > 0) OV_wave(P[i][0], P[i][1], P[i + 1][0], P[i + 1][1], { frac: fr, phase: TT * OV_V - cum, key: key + i, lam: o.lam, amp: o.amp, w: o.w, al: o.al });
    cum += lens[i];
  }
  return tot;
}

// ---- the path of the microwaves: magnetron -> up the waveguide -> across -> out of the mouth, then the bounces
const OV_DUCT = [[875, 770], [875, 595], [615, 595]];
const OV_ZIG = [[615, 632], [150, 780], [736, 905], [150, 1030], [736, 1160]];

// ---- red-pencil sketches over the oven (the wrong guesses)
function OV_flame(cx, cy, f, key) {
  const P = [];
  for (let i = 0; i <= 40; i++) {
    const a = i / 40 * TAU, r = 1 - 0.55 * Math.max(0, -Math.sin(a)) ** 3;
    P.push([cx + Math.cos(a) * 62 * r * (1 - 0.35 * Math.max(0, -Math.sin(a))), cy + 40 + Math.sin(a) * (Math.sin(a) < 0 ? 120 : 34)]);
  }
  planInk(P, { key: key + 'o', frac: f, w: 6, dash: [400, 1] });
  const Q = [[cx - 10, cy + 60], [cx - 24, cy + 30], [cx - 4, cy - 16], [cx + 14, cy + 22], [cx + 6, cy + 60]];
  planInk(Q, { key: key + 'i', frac: clamp(f * 2 - 1), w: 5, dash: [400, 1] });
}
function OV_coil(cx, cy, f, key) {
  const P = [];
  for (let i = 0; i <= 90; i++) { const t = i / 90, a = t * 5 * TAU; P.push([cx - 120 + t * 240 + Math.cos(a) * 26, cy + Math.sin(a) * 52]); }
  planInk([[cx - 175, cy + 50], [cx - 175, cy], [cx - 120, cy]], { key: key + 'l', frac: clamp(f * 4), w: 6, dash: [400, 1] });
  planInk(P, { key: key + 'c', frac: f, w: 6, dash: [400, 1] });
  planInk([[cx + 120, cy], [cx + 175, cy], [cx + 175, cy + 50]], { key: key + 'r', frac: clamp(f * 4 - 3), w: 6, dash: [400, 1] });
  // glow rays
  const g = clamp(f * 2 - 1);
  for (let i = 0; i < 4; i++) { const x = cx - 90 + i * 60; planInk([[x, cy - 70], [x + 6, cy - 98]], { key: key + 'g' + i, frac: g, w: 4, dash: [400, 1] }); }
}
function OV_cross(cx, cy, hw, hh, f, key) {
  planInk([[cx - hw, cy - hh], [cx + hw, cy + hh]], { key: key + '1', frac: clamp(f * 2), w: 9, dash: [400, 1] });
  planInk([[cx - hw, cy + hh], [cx + hw, cy - hh]], { key: key + '2', frac: clamp(f * 2 - 1), w: 9, dash: [400, 1] });
}

// ---- an ink arrow (a label's pointer)
function OV_arrow(a, b, f, key) {
  if (f <= 0) return;
  ink([a, b], { w: 4.5, key: key, frac: f });
  if (f >= 1) { const an = Math.atan2(b[1] - a[1], b[0] - a[0]); ink([[b[0] - Math.cos(an - 0.5) * 26, b[1] - Math.sin(an - 0.5) * 26], b, [b[0] - Math.cos(an + 0.5) * 26, b[1] - Math.sin(an + 0.5) * 26]], { w: 4.5, key: key + 'h' }); }
}

// a card that writes on and pops (drawn in world coords so it rides the camera)
function OV_card(str, x, y, t, o = {}) { if (TT < t) return; inkCard(str, x, y, o.size ?? 58, { rot: o.rot ?? -0.03, frac: ev(t, 0.5), s: popS(t - 0.05) }); }

// =====================================================================
//  1 HOOK — "Lò vi sóng không có lửa, cũng chẳng có dây đốt nóng, vậy mà thức ăn tự nóng lên."
// =====================================================================
SCENES.hook = function () {
  OV_room('hk');
  const tFire = VW('hook', 'lửa'), tCoil = VW('hook', 'dây'), tYet = VW('hook', 'vậy'), tOn = VW('hook', 'tự'), tHot = VW('hook', 'nóng', 2);
  const on = ev(tOn, 0.35);
  ovenFront({ mode: 'door', light: on, display: TT >= tOn ? '1:00' : undefined, plate: TT > tOn ? (TT - tOn) * 1.4 : 0, dial: lerp(-0.6, 0.4, EZ.o2(ev(tOn - 0.15, 0.3))), bowl: { heat: 0, steam: 0 } });
  // the cold probe thermometer in the rice: its reading sinks to 5°C as we arrive
  const val = lerp(22, 5, EZ.io(seg(TT, 0.2, 1.6)));
  OV_thermo(318, 1000, val, { dark: true, tc: COL.cold, key: 'hkth' });
  // a couple of cold breath curls over the cold rice (cold blue), before the lamp comes on
  if (on < 1) for (let i = 0; i < 2; i++) {
    const P = []; for (let k = 0; k <= 6; k++) P.push([500 + i * 50 + Math.sin(k * 1.1 + TT * 2.5 + i) * 8, 960 - k * 12 - mod(TT * 14 + i * 20, 30)]);
    ink(P, { w: 4, color: COL.cold, key: 'hkcb' + i, amt: 0.6, alpha: 0.8 * (1 - on) });
  }
  // the wrong guesses: a flame ("lửa"), a glowing coil ("dây đốt nóng"), each crossed out
  OV_flame(230, 440, ev(tFire - 0.05, 0.5), 'hkfl');
  OV_cross(230, 470, 95, 95, ev(tFire + 0.5, 0.4), 'hkflx');
  OV_coil(560, 470, ev(tCoil - 0.05, 0.6), 'hkco');
  OV_cross(560, 470, 200, 90, ev(tCoil + 0.6, 0.4), 'hkcox');
  // "vậy mà…": a big ink question mark, wobbling
  const q = popS(tYet);
  if (q > 0) { ctx.save(); ctx.translate(855, 520); ctx.rotate(0.1 + Math.sin(TT * 3) * 0.06); ctx.scale(q, q); handText('?', -32, 0, 150, C.ink, { key: 'hkq' }); ctx.restore(); }
  // the lamp: a soft warm-white glow over the plate once it is on (not terracotta: it is light, not heat)
  if (on > 0) { ctx.save(); ctx.globalAlpha = 0.18 * on; ink([[CAV.x + 70, CAV.y + 40], [CAV.x + CAV.w - 70, CAV.y + 40]], { w: 26, color: '#fff6d8', key: 'hklamp' }); ctx.restore(); }
  // on "nóng lên": a little ink hum over the oven (it is running)
  if (TT > tHot) for (let i = 0; i < 3; i++) if ((B + i * 2) % 6 < 4) ink([[300 + i * 140, 548], [312 + i * 140, 524]], { w: 4, key: 'hkhum' + i, amt: 0.6 });
  inkTag('lò vi sóng');
};

// =====================================================================
//  2 MAGNET — "Ở góc lò, ống magnetron phát ra vi sóng, một loại sóng vô tuyến."
// =====================================================================
SCENES.magnet = function () {
  OV_room('mg');
  const tCorner = VW('magnet', 'góc'), tMag = VW('magnet', 'magnetron'), tEmit = VW('magnet', 'phát'), tRadio = VW('magnet', 'vô');
  const plate = (TT - VW('hook', 'tự')) * 1.4;
  ovenFront({ mode: 'cut', plate, display: '1:00', dial: 0.4 });
  const glow = 0.55 + 0.45 * Math.sin(TT * 7) * ev(tCorner, 0.4);
  magnetron({ on: glow });
  // its hum: little ink ticks beside the magnetron
  for (let i = 0; i < 3; i++) if ((B + i * 3) % 8 < 5) ink([[790 - i * 4, 720 + i * 50], [770 - i * 4, 720 + i * 50 + 6]], { w: 4, key: 'mghum' + i, amt: 0.6 });
  // the label, on "magnetron", pointing at it
  OV_card('magnetron', 735, 470, tMag, { rot: 0.03 });
  OV_arrow([800, 520], [828, 680], ev(tMag + 0.3, 0.3), 'mgar');
  // on "phát": one wave from the magnetron up the waveguide, out of the mouth, down into the cavity
  const fD = ev(tEmit, 0.5), fC = ev(tEmit + 0.5, 0.8);
  OV_path(OV_DUCT, fD, 'mgd', { amp: 11, lam: 60, w: 6 });
  if (fC > 0) OV_path([OV_ZIG[0], OV_ZIG[1]], fC, 'mgz');
  // on "vô tuyến": the card
  OV_card('sóng vô tuyến', 290, 470, tRadio - 0.1, { rot: -0.03 });
  OV_arrow([330, 520], [330, 700], ev(tRadio + 0.35, 0.3), 'mgar2');
  inkTag('bên trong lò');
};

// =====================================================================
//  3 BOUNCE — "Vi sóng dội qua lại giữa các vách kim loại, tràn khắp khoang lò."
// =====================================================================
SCENES.bounce = function () {
  OV_room('bn');
  const tBounce = VW('bounce', 'dội'), tFill = VW('bounce', 'tràn'), tc = ET('water'), tPop = tc - 1.2;
  const plate = (TT - VW('hook', 'tự')) * 1.4;
  ovenFront({ mode: 'cut', plate, display: '1:00', dial: 0.4 });
  magnetron({ on: 0.55 + 0.45 * Math.sin(TT * 7) });
  const dim = 1 - 0.55 * ev(tPop, 0.5);
  // on "tràn": faint wave bands across the whole cavity (fade in, then breathe)
  const fb = ev(tFill, 0.6);
  if (fb > 0) [700, 850, 1110].forEach((y, i) => {
    OV_wave(CAV.x + 20, y, CAV.x + CAV.w - 20, y, { phase: TT * OV_V * (i % 2 ? -1 : 1) + i * 40, amp: 18 + 6 * Math.sin(TT * 3 + i), lam: 110, w: 5, al: fb * 0.38 * dim, key: 'bnb' + i, frac: clamp(fb * 1.6 - i * 0.2) });
  });
  // the duct wave keeps running; the first leg is already there; from "dội" the bounces write on
  OV_path(OV_DUCT, 1, 'mgd', { amp: 11, lam: 60, w: 6, al: dim });
  const lens = OV_ZIG.slice(1).map((p, i) => dist(OV_ZIG[i], p)), tot = lens.reduce((a, b) => a + b, 0);
  const f = (lens[0] + (tot - lens[0]) * EZ.io(seg(TT, tBounce, tFill + 0.2))) / tot;
  OV_path(OV_ZIG, f, 'bnz', { al: dim });
  // a small ink flash at each wall hit, as the wave reaches it
  let cum = 0;
  for (let i = 1; i < OV_ZIG.length - 1; i++) {
    cum += lens[i - 1];
    const tHit = tBounce + (tFill + 0.2 - tBounce) * (cum - lens[0]) / (tot - lens[0]);
    const k = seg(TT, tHit, tHit + 0.5);
    if (i > 1 && k > 0 && k < 1) { const [x, y] = OV_ZIG[i], s = x < 400 ? 1 : -1; for (let j = -1; j <= 1; j++) ink([[x + s * 12, y + j * 22], [x + s * (30 + 30 * k), y + j * (30 + 26 * k)]], { w: 4, key: 'bnfl' + i + j, amt: 0.5, alpha: 1 - k }); }
  }
  // the hero pops up out of the rice and sits at (440, 960) for the bridge
  const [hx, hy] = BR.bounceWater.a;
  const s = popS(tPop);
  if (s > 0) {
    const jump = Math.sin(Math.PI * seg(TT, tPop, tPop + 0.45)) * 70;
    ctx.save(); ctx.translate(hx, hy - jump); ctx.scale(s, s);
    heroMol(0, 0, HR, -Math.PI / 2 + Math.sin(TT * 2.2) * 0.12 * ev(tPop + 0.5, 0.3), { mood: 'wow', key: 'hero' });
    ctx.restore();
    const k = seg(TT, tPop, tPop + 0.45);
    if (k > 0 && k < 1) for (let j = 0; j < 5; j++) { const a = -Math.PI * (0.15 + j * 0.175); ink([[hx + Math.cos(a) * 110, hy + 30 + Math.sin(a) * 60], [hx + Math.cos(a) * (130 + 50 * k), hy + 30 + Math.sin(a) * (80 + 40 * k)]], { w: 4.5, key: 'bnpop' + j, amt: 0.5, alpha: 1 - k }); }
  }
  inkTag('vi sóng dội');
};

// =====================================================================
//  10 END — "Lần tới hâm cơm, hãy nhớ: hơi nóng sinh ra từ chính những giọt nước trong cơm."
//  the hook framing again: door shut, lamp off, "0:00", the rice steaming, the hero warm and happy on top
// =====================================================================
SCENES.end = function () {
  OV_room('hk');
  const tHeat = VW('end', 'hơi'), tDrop = VW('end', 'giọt'), t0 = ET('end');
  const blink = TT < t0 + 1.6 && (B % 6) >= 3;                 // the "ding": 0:00 blinks
  const stm = 0.75 + 0.25 * ev(tHeat, 0.6);
  ovenFront({ mode: 'door', light: 0, display: blink ? ' ' : '0:00', plate: 0.9, dial: -0.6, bowl: { heat: 1, steam: stm } });
  // a little extra steam curling up beside the hero (heat = terracotta)
  steam(BOWL.x, BOWL.y - 120, { n: 2, amt: 0.6 + 0.4 * ev(tHeat, 0.6), spread: 125, key: 'enst', w: 7 });
  // the thermometer in the rice now reads 70°C
  OV_thermo(318, 1000, 70, { dark: true, tc: C.terra, key: 'enth' });
  // the hero: warm and happy on the rice, its glow breathing (stronger from "hơi nóng")
  const heat = (0.6 + 0.25 * ev(tHeat, 0.5)) * (0.85 + 0.15 * Math.sin(TT * 3));
  heroMol(BOWL.x, 960, HR, -Math.PI / 2 + Math.sin(TT * 1.6) * 0.1, { mood: 'happy', heat, key: 'hero' });
  // on "giọt nước": a small tag pointing down at the hero
  OV_card('từ giọt nước', 440, 470, tDrop - 0.1, { size: 60, rot: -0.03 });
  OV_arrow([440, 525], [440, 855], ev(tDrop + 0.35, 0.4), 'enar');
  inkTag('cơm nóng rồi!');
};
