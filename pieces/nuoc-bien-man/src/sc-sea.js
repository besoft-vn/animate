// =====================================================================
//  SC-SEA — evap (the sun lifts the WATER, the salt grain stays in the sea), payoff (SLAM: the salt of all the seas
//  spread on land = a slab > 160 m, as tall as a 40-storey building), balance (a sea cross-section: salt in from the
//  river, out to the floor sediment; the gauge holds at 3,5 %).
//  Colour: TERRACOTTA = hero · BLUE = water · PLUM = salt · YELLOW = sun / evaporation · graphite = building, bracket.
// =====================================================================
// a cubic Bezier point
const s_bz = (t, A, B, C, D) => [0, 1].map((j) => (1 - t) ** 3 * A[j] + 3 * (1 - t) ** 2 * t * B[j] + 3 * (1 - t) * t * t * C[j] + t ** 3 * D[j]);
// a label written on at t0 (over d), faded out over [t1 - 0.3, t1]
function s_label(str, x, y, size, t0, t1, o = {}) {
  const f = t1 == null ? 1 : 1 - seg(TT, t1 - 0.3, t1); if (TT < t0 || f <= 0) return;
  alphaDo(f, () => label(str, x, y, size, { reveal: o.now ? 1 : ev(t0, o.d ?? 0.3), key: 's_lb' + str, align: o.align, col: o.col }));
}
// a wavy vertical stroke (vapour), bottom at (x, y), height h, phase ph
function s_wave(x, y, h, ph, amp = 12) {
  const P = []; for (let k = 0; k <= 10; k++) { const u = k / 10; P.push([x + amp * Math.sin(u * 2 * TAU * 0.75 + ph), y - h * u]); }
  return P;
}
// a small water ring at the surface (a plop), k 0..1
function s_ring(x, y, k, key) {
  if (k <= 0 || k >= 1) return;
  gline(loopPts(x, y, 20 + 70 * EZ.o2(k), 6 + 16 * EZ.o2(k), 0.02), { w: 4, col: COL.water, a: 1 - k, key, second: false });
}

// ---------------------------------------------------------------------
//  EVAP — "Nắng làm nước biển bốc hơi, nhưng muối không bay theo, nó ở lại."
//  The coast; hot sun; hero floating on the sea with its badge. On "bốc hơi" it turns light and rises (wavy yellow/blue
//  vapour strokes going UP); on "muối" the badge pulls off, falls back into the sea and sinks a little ("muối ở lại").
//  The hero reaches the rain cloud [770,470] with no badge.
// ---------------------------------------------------------------------
const s_EV_P = [BR.ventsEvap.b, [540, 880], [700, 600], BR.evapTime.a];
const s_EV_T0 = 27.9, s_EV_T1 = 31.45;
const s_evHero = (t) => s_bz(EZ.io(seg(t, s_EV_T0, s_EV_T1)), ...s_EV_P);
SCENES.evap = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('evap'), tBoc = VW('evap', 'bốc'), tMuoi = VW('evap', 'muối'), tKhong = VW('evap', 'không'), tO = VW('evap', 'ở');
  const off = EE('evap') - 0.5;
  const hot = 0.6 + 0.4 * Math.sin(Math.PI * seg(TT, E, tKhong));
  coast({ sun: { hot }, cloud: { dark: 0.35 + 0.1 * Math.sin(TT * 1.2) } });
  // sunlight on the sea: two long yellow rays from the sun down to the water near the hero, pulsing
  const ra = 0.75 * (1 - seg(TT, tKhong, tKhong + 0.8));
  if (ra > 0.01) [[470, 1060], [640, 1060]].forEach(([x, y], i) => {
    const pu = 0.55 + 0.45 * Math.sin(TT * 3 + i * 1.7);
    gline([[SUN.x + 70, SUN.y + 50 + i * 20], [x, y]], { w: 7, col: COL.sunD, a: ra * pu, key: 's_ray' + i, part: ev(E - 0.2, 0.5), second: false, amp: 1 });
  });
  // vapour: 4 wavy strokes (yellow / blue) rising UP from the sea under the hero, from "bốc hơi"
  const va = seg(TT, tBoc - 0.1, tBoc + 0.3) * (1 - seg(TT, 30.6, 31.2));
  if (va > 0.01) for (let i = 0; i < 4; i++) {
    const u = ((TT - tBoc) / 1.7 + i / 4) % 1; if (u < 0) continue;
    const x = 470 + i * 70, y = 1070 - 380 * u;
    gline(s_wave(x, y, 120, i * 1.3 + TT * 2), { w: 6, col: i % 2 ? COL.water : COL.sunD, a: va * Math.sin(Math.PI * u), key: 's_vp' + i, second: false, amp: 0.8 });
  }
  // the hero: exact on the sea at the bridge, bobs on the waves, then rises to the cloud
  let [hx, hy] = s_evHero(TT);
  const bob = Math.sin(TAU * (TT - E) / 1.4) * seg(TT, E + 0.5, E + 0.9) * (1 - seg(TT, s_EV_T0, s_EV_T0 + 0.5));
  hy += 8 * bob;
  const rising = TT > s_EV_T0 && TT < s_EV_T1;
  const st = rising ? 0.07 * Math.sin(Math.PI * seg(TT, s_EV_T0, s_EV_T1)) : 0;
  // "light": a pale halo around the hero while it rises
  const la = 0.5 * Math.sin(Math.PI * seg(TT, tBoc - 0.1, s_EV_T1));
  if (la > 0.01) scribbleFill(loopPts(hx, hy, HR * 1.45, HR * 1.6, 0), COL.waterL, { key: 's_halo', gap: 16, w: 5, base: 0.25, a: la });
  // the badge: tugged on "muối", torn off; falls back into the sea, plops, sinks a little and stays
  const tD = tMuoi + 0.1;
  const tug = seg(TT, tMuoi - 0.35, tD) * (TT < tD ? 1 : 0);
  const look = TT < tBoc ? [-0.8, -0.7] : TT < tMuoi - 0.3 ? [0.2, -1] : TT < tO + 0.4 ? [0.4, 1] : [0.3, -0.9];
  const mood = TT < tBoc ? 'happy' : TT < tMuoi - 0.3 ? 'calm' : TT < tO + 0.4 ? 'wow' : 'happy';
  heroGiot(hx + 3 * tug * Math.sin(TT * 40), hy, HR, { key: 'hero', look, mood, salt: TT < tD ? 1 : 0, sx: 1 - st, sy: 1 + st });
  if (TT >= tD) {
    const [bx0, by0] = s_evHero(tD), x0 = bx0 + HR * 0.62, y0 = by0 + 8 * 0 + HR * 0.55;
    const fall = seg(TT, tD, tD + 0.55), sink = EZ.o2(seg(TT, tD + 0.55, tD + 1.9));
    const y = fall < 1 ? lerp(y0, SEA_Y + 10, EZ.i2(fall)) : SEA_Y + 10 + 60 * sink + 4 * Math.sin(TT * 2.2) * sink;
    const r = lerp(HR * 0.36, 24, EZ.o2(seg(TT, tD, tD + 0.6)));
    saltGrain(x0, y, r, { key: 's_badge', rot: -0.15 + 0.5 * EZ.o2(fall) + 0.08 * Math.sin(TT * 1.8) * sink });
    s_ring(x0, SEA_Y + 4, seg(TT, tD + 0.5, tD + 1.4), 's_plop');
    // "muối ở lại": plum label + pencil arrow to the grain (gone 0.5 s before the bridge)
    s_label('muối ở lại', 790, 1215, 58, tKhong, off, { col: COL.salt, d: 0.35 });
    if (TT > tKhong + 0.2 && TT < off) alphaDo(1 - seg(TT, off - 0.3, off), () => arrowPencil([[680, 1190], [x0 + 34, SEA_Y + 72]], ev(tKhong + 0.25, 0.3), { key: 's_mar', w: 4 }));
  }
  // "bốc hơi" (left of the vapour) + a small up arrow
  s_label('bốc hơi', 300, 880, 60, tBoc, off, { d: 0.35 });
  if (TT > tBoc + 0.2 && TT < off) alphaDo(1 - seg(TT, off - 0.3, off), () => arrowPencil([[300, 820], [300, 700]], ev(tBoc + 0.3, 0.3), { key: 's_bha', w: 4, col: COL.sunD }));
  viTag('bốc hơi');
  pageCaption(['Nước bay hơi,', 'muối ở lại'], [[1, 'muối ở lại']], { size: 62, at: 0.3 });
};

// ---------------------------------------------------------------------
//  PAYOFF (opens on the SLAM, complete from its first frame) —
//  "Nếu rút hết muối ra rải lên đất liền, nó dày hơn một trăm sáu mươi mét!"
//  A land strip under a THICK salt slab (top y 620), the hero standing on it; beside it a 40-storey building of the
//  same height + a measuring bracket "> 160 m". Motion: marching dashes, bracket pulse, sparkles, hero looks/breathes.
// ---------------------------------------------------------------------
const s_GND = 1150, s_TOP = 620, s_SL = [60, 560], s_BLD = [700, 880], s_BRX = 630;
function s_house(x, y, s, key, a = 1) {   // a tiny house doodle, base centre (x, y)
  const P = [[x - 30 * s, y], [x - 30 * s, y - 36 * s], [x, y - 62 * s], [x + 30 * s, y - 36 * s], [x + 30 * s, y]];
  alphaDo(a, () => { gfill(P, SK.sheet, { key: key + 'f' }); gpencil(closeP(P), { w: 3.5, key: key + 'o', a: 0.9 }); gpencil([[x - 7 * s, y], [x - 7 * s, y - 20 * s], [x + 7 * s, y - 20 * s], [x + 7 * s, y]], { w: 3, key: key + 'd' }); });
}
function s_tree(x, y, s, key, a = 1) {    // a tiny tree doodle, base centre (x, y)
  alphaDo(a, () => {
    gpencil([[x, y], [x, y - 40 * s]], { w: 4, key: key + 't' });
    const C = loopPts(x, y - 62 * s, 26 * s, 28 * s, 0.05);
    gfill(C, SK.sheet, { key: key + 'f' }); gpencil(C, { w: 3.5, key: key + 'c', a: 0.9 });
  });
}
SCENES.payoff = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('payoff'), tRai = VW('payoff', 'rải'), tDat = VW('payoff', 'đất'), tDay = VW('payoff', 'dày'), tMet = VW('payoff', 'mét');
  const still = EE('payoff') - 0.5, off = EE('payoff') - 0.5;
  // the land: ground line + a sand strip
  const G = [[40, s_GND], [960, s_GND], [960, s_GND + 38], [40, s_GND + 38]];
  gfill(G, SK.wood, { a: 0.7, key: 's_gf' });
  gline([[40, s_GND], [960, s_GND]], { w: 5, key: 's_gl' });
  // the SALT SLAB: plum rim, light plum scribble, two faint strata; a buried house + tree show through (graphite ghost)
  const top = []; for (let x = s_SL[0]; x <= s_SL[1]; x += 50) top.push([x, s_TOP + 5 * Math.sin(x * 0.05)]);
  const SL = [...top, [s_SL[1], s_GND], [s_SL[0], s_GND]];
  gfill(SL, SK.sheet, { key: 's_slp' });
  scribbleFill(SL, COL.saltL, { key: 's_sls', gap: 20, w: 7, base: 0.55, a: 0.85 });
  [800, 990].forEach((y, i) => gpencil([[s_SL[0] + 20, y], [s_SL[1] - 20, y + 6 * (i ? -1 : 1)]], { w: 3, col: COL.salt, a: 0.45, key: 's_st' + i }));
  s_house(170, s_GND, 1, 's_bh', 0.45); s_tree(290, s_GND, 1, 's_bt', 0.45);
  gline(closeP(SL), { w: 7, col: COL.salt, key: 's_slo' });
  // big cube grains on the top
  [[140, 26, -0.1], [225, 22, 0.15], [500, 26, -0.2]].forEach(([x, r, rot], i) => saltGrain(x, s_TOP - r + 2, r, { key: 's_tg' + i, rot: rot + 0.04 * Math.sin(TT * 1.5 + i) }));
  // sparkles on the salt surface ("rải lên đất liền", then "mét")
  sparkle(200, s_TOP - 60, 60, seg(TT, tRai, tRai + 0.7), 's_sp1', COL.salt);
  sparkle(510, s_TOP - 70, 60, seg(TT, tDat + 0.3, tDat + 1.0), 's_sp2', COL.salt);
  sparkle(120, s_TOP - 70, 60, seg(TT, tMet, tMet + 0.7), 's_sp3', COL.salt);
  // the 40-storey building (graphite), the same height, window ticks, a small antenna; a tiny house beside it
  const BL = [[s_BLD[0], s_GND], [s_BLD[0], s_TOP], [s_BLD[1], s_TOP], [s_BLD[1], s_GND]];
  gfill(BL, SK.sheet, { key: 's_bdf' });
  for (let r = 0; r < 11; r++) for (let c = 0; c < 3; c++) {
    const y = s_TOP + 36 + r * 42, x = s_BLD[0] + 34 + c * 56;
    gpencil([[x, y], [x + 24, y]], { w: 4, key: 's_w' + r + '_' + c, a: 0.75 });
  }
  gline(BL, { w: 5, col: SK.graph, key: 's_bdo' });
  gline([[790, s_TOP], [790, s_TOP - 34]], { w: 4, col: SK.graph, key: 's_ant', second: false });
  s_house(920, s_GND, 0.6, 's_th');
  // the measuring bracket between them: dashed top line across (same height), arrows both ends, pulsing
  const dash = (TT * 40) % 30;
  for (let x = s_SL[1] - 10 + dash; x < s_BLD[0]; x += 30) gpencil([[x, s_TOP], [Math.min(s_BLD[0], x + 15), s_TOP]], { w: 3.5, key: 's_dt' + Math.round((x - dash) / 30), a: 0.8 });
  const pu = 1 + 0.35 * Math.sin(Math.PI * seg(TT, tDay, tDay + 0.6)) + 0.35 * Math.sin(Math.PI * seg(TT, tMet, tMet + 0.6)) + 0.08 * Math.sin(TT * 4);
  gline([[s_BRX, s_TOP + 6], [s_BRX, s_GND - 6]], { w: 6, col: SK.ink, key: 's_brv' });
  for (const [y, d] of [[s_TOP + 6, 1], [s_GND - 6, -1]]) {
    gline([[s_BRX - 26 * pu, y + 30 * d * pu], [s_BRX, y], [s_BRX + 26 * pu, y + 30 * d * pu]], { w: 6, key: 's_brh' + d, second: false });
    gline([[s_BRX - 30, y - 6 * d], [s_BRX + 30, y - 6 * d]], { w: 5, key: 's_brt' + d, second: false });
  }
  // the labels: "> 160 m" on a paper chip on the slab; "≈ tòa nhà / 40 tầng" above the building (gone before the bridge)
  const la = 1 - seg(TT, off - 0.3, off);
  alphaDo(la, () => {
    const hop = 1 + 0.08 * Math.sin(Math.PI * seg(TT, tMet, tMet + 0.5));
    gfill(sketchBox(150, 830, 330, 110, 18, 0), SK.sheet, { key: 's_chip' });
    gpencil(sketchBox(150, 830, 330, 110, 18, 0.04), { w: 3.5, col: COL.salt, key: 's_chipo' });
    ctx.save(); ctx.translate(315, 885); ctx.scale(hop, hop); label('> 160 m', 0, 28, 82, { key: 's_160' }); ctx.restore();
    gpencil([[485, 885], [600, 885]], { w: 4, key: 's_chipa' });
    gpencil([[600, 885], [580, 873]], { w: 4, key: 's_chipa1' }); gpencil([[600, 885], [580, 897]], { w: 4, key: 's_chipa2' });
    label('≈ tòa nhà', 770, 498, 56, { key: 's_tn' });
    label('40 tầng', 770, 566, 56, { key: 's_40', col: SK.graph });
  });
  // the hero on top of the slab: looks down at the salt, at the building, wow on "dày hơn … mét"; breathing
  const env = seg(TT, E + 0.2, E + 0.6) * (1 - seg(TT, still - 0.5, still));
  const br = 0.025 * Math.sin(TT * 3.2) * env, hp = Math.sin(Math.PI * seg(TT, tMet, tMet + 0.4)) * (TT < still ? 1 : 0);
  const look = TT < tDat ? [0.1 * Math.sin(TT * 2), 1] : TT < tDay ? [1, 0.2] : [0.3, -0.4];
  const mood = TT < tDat ? 'wow' : TT < tDay ? 'calm' : 'wow';
  heroGiot(PAYOFF_HERO[0], PAYOFF_HERO[1] - 22 * hp, HR, { key: 'hero', legs: true, look, mood, salt: 0, sx: 1 - br - 0.04 * hp, sy: 1 + br + 0.05 * hp, arms: TT > tDay && TT < still ? [0.9, 0.9] : null });
  viTagNow('160 mét muối');
  pageCaption(['Muối phủ đất liền', 'dày hơn 160 m!'], [[1, '160 m']], { size: 62, at: -10 });
};

// ---------------------------------------------------------------------
//  BALANCE — "Nhưng muối cũng lắng xuống đáy, nên độ mặn giữ quanh ba phẩy năm phần trăm."
//  A sea cross-section (surface y 600, a shelf on the left at y 1045, the deep floor with a sediment layer). The river
//  arrow brings plum grains IN (top-left); on "lắng xuống đáy" 3 grains sink to the sediment (OUT); a gauge holds at
//  3,5 %. The hero floats at the surface, then dives down-left and lands on the shelf at HERO_BEACH.
// ---------------------------------------------------------------------
const s_SY = 600, s_FL = 1150, s_SED = 1118;
const s_LAND = [[20, 1045], [320, 1045], [440, s_FL], [1060, s_FL], [1060, 1195], [20, 1195]];
const s_GAUGE = { x: 780, y: 840, r: 92, box: [660, 670, 240, 280] };
SCENES.balance = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('balance'), tLang = VW('balance', 'lắng'), tNen = VW('balance', 'nên'), tDo = VW('balance', 'độ');
  const off = EE('balance') - 0.5;
  // the sea (section): blue scribble from the surface down, a drifting wavy surface line, 2 slow current strokes
  const top = []; for (let x = 20; x <= 1060; x += 40) top.push([x, s_SY + 6 * Math.sin(x / 90 + TT * 1.6)]);
  scribbleFill([...top, [1060, 1190], [20, 1190]], COL.waterL, { key: 's_bsf', gap: 18, w: 7, base: 0.5 });
  gline(top, { w: 5, col: COL.water, key: 's_bsl' });
  for (let i = 0; i < 2; i++) {
    const wy = 690 + i * 260, x0 = 120 + ((i * 300 + TT * 36 * (i ? -1 : 1)) % 400 + 400) % 400;
    const Wv = []; for (let k = 0; k <= 8; k++) Wv.push([x0 + k * 22, wy + 7 * Math.sin(k * 0.9 + TT * 0.8 + i)]);
    gpencil(Wv, { w: 4, col: COL.water, key: 's_bw' + i, a: 0.55 });
  }
  // the land: shelf on the left, the deep floor; the sediment layer on the floor (graphite strata with a plum tint)
  gfill(s_LAND, SK.wood, { a: 0.9, key: 's_blf' });
  gline([s_LAND[0], s_LAND[1], s_LAND[2], s_LAND[3]], { w: 5, key: 's_blo' });
  const SED = [[430, s_FL - 2], [452, s_SED], [1060, s_SED], [1060, s_FL - 2]];
  gfill(SED, COL.rock, { key: 's_sdf' });
  scribbleFill(SED, COL.saltL, { key: 's_sds', gap: 16, w: 5, base: 0.3, a: 0.6 });
  gpencil([[470, s_SED + 14], [1040, s_SED + 12]], { w: 3, key: 's_sdl', a: 0.6 });
  gpencil([[452, s_SED], [1060, s_SED]], { w: 4, key: 's_sdo' });
  // IN: the river arrow (top-left) with 2 plum grains riding it into the sea
  const A0 = [70, 450], A1 = [285, 605];
  bigArrow(A0[0], A0[1], A1[0], A1[1], { col: COL.waterL, w: 46, head: 76, key: 's_riv', part: lerp(0.85, 1, ev(E - 0.5, 0.5)) });
  const ga = 1 - seg(TT, off - 0.3, off);
  for (let i = 0; i < 2; i++) {
    const u = ((TT - E) * 0.42 + i * 0.5) % 1, k = Math.sin(Math.PI * u) ** 0.4;
    saltGrain(lerp(A0[0] + 25, A1[0] - 50, u), lerp(A0[1] + 18, A1[1] - 36, u), 19, { key: 's_rg' + i, a: ga * k, rot: 0.3 * Math.sin(TT * 2 + i) });
  }
  s_label('từ sông', 170, 690, 54, E + 0.3, off, { col: COL.water });
  // OUT: 3 grains hang in the water, then sink to the sediment on "lắng xuống đáy" and stay there
  [[470, 720], [545, 800], [615, 705]].forEach(([x, y], i) => {
    const t0 = tLang - 0.05 + i * 0.22, u = EZ.io(seg(TT, t0, t0 + 1.3));
    const yy = lerp(y + 8 * Math.sin(TT * 1.7 + i * 2), s_SED - 21, u), xx = x + 10 * Math.sin(TT * 1.2 + i) * (1 - u);
    if (u > 0.02 && u < 0.98) gpencil([[xx - 10, yy - 34], [xx - 10, yy - 90]], { w: 3.5, key: 's_tr' + i, a: 0.7 * Math.sin(Math.PI * u) });
    const land = Math.sin(Math.PI * seg(TT, t0 + 1.3, t0 + 1.6));
    saltGrain(xx, yy, 21, { key: 's_sg' + i, rot: lerp(0.3 * Math.sin(TT * 1.5 + i), 0.05 * (i - 1), u) + 0.12 * land });
  });
  s_label('lắng xuống đáy', 700, 1050, 54, tLang, off, { d: 0.4 });
  if (TT > tLang + 0.3 && TT < off) alphaDo(1 - seg(TT, off - 0.3, off), () => arrowPencil([[600, 1040], [600, 1092]], ev(tLang + 0.4, 0.3), { key: 's_lga', w: 4 }));
  // the gauge card (from "nên"): the needle swings, then holds steady at the middle mark = 3,5 %
  const g = s_GAUGE, gk = EZ.o2(ev(tNen - 0.3, 0.45)), gf = 1 - seg(TT, off - 0.3, off);
  if (gk > 0) alphaDo(gf, () => {
    const [bx, by, bw, bh] = g.box;
    gfill(sketchBox(bx, by, bw, bh, 18, 0), SK.sheet, { key: 's_gbf', a: gk });
    gpencil(sketchBox(bx, by, bw, bh, 18, 0.04), { w: 3.5, key: 's_gbo', part: gk });
    gline(arcPts(g.x, g.y, g.r, Math.PI, TAU, 24), { w: 5, key: 's_garc', part: gk });
    for (let i = 0; i <= 6; i++) {
      const an = Math.PI + i / 6 * Math.PI, r0 = g.r - (i === 3 ? 26 : 16);
      gline([[g.x + Math.cos(an) * r0, g.y + Math.sin(an) * r0], [g.x + Math.cos(an) * g.r, g.y + Math.sin(an) * g.r]], { w: i === 3 ? 6 : 4, col: i === 3 ? COL.salt : SK.ink, key: 's_gt' + i, second: false, a: gk });
    }
    const sw = seg(TT, tNen, tNen + 1.0), v = 0.5 + 0.32 * Math.cos(sw * 3 * Math.PI) * (1 - sw) * (sw > 0 ? 1 : 0) - (sw <= 0 ? 0.3 : 0) + 0.012 * Math.sin(TT * 5) * sw;
    const an = Math.PI + v * Math.PI;
    gline([[g.x, g.y], [g.x + Math.cos(an) * (g.r - 14), g.y + Math.sin(an) * (g.r - 14)]], { w: 6, col: COL.salt, key: 's_gn', second: false, a: gk });
    gfill(loopPts(g.x, g.y, 10, 10, 0), SK.ink, { key: 's_gp', a: gk, off: [0, 0] });
    label('độ mặn', g.x, by + 62, 50, { key: 's_gdm', reveal: ev(tNen - 0.1, 0.3) });
  });
  s_label('3,5 %', g.x, g.y + 82, 66, tNen + 0.05, off, { col: COL.salt });
  s_label('≈ 35 g muối / 1 kg nước', 500, 1245, 50, tDo - 0.1, off, { d: 0.35 });
  // the hero: floats at the surface (exact at the bridge), watches the river, the sinking grains, the gauge; then dives
  // down-left and lands on the shelf at HERO_BEACH
  const tDive = 48.3, tLand = 49.6;
  const u = EZ.io(seg(TT, tDive, tLand));
  let [hx, hy] = s_bz(u, BR.payoffBalance.b, [430, 700], [200, 780], BR.balanceEnd.a);
  const env = seg(TT, E + 0.5, E + 0.9) * (1 - seg(TT, tDive - 0.3, tDive));
  hy += 7 * Math.sin(TAU * (TT - E) / 1.5) * env; hx += 6 * Math.sin(TAU * (TT - E) / 2.3) * env;
  const sq = 0.1 * Math.sin(Math.PI * seg(TT, tLand, tLand + 0.3));
  const look = TT < tLang - 0.2 ? [-0.9, 0.2] : TT < tNen ? [0.5, 1] : TT < tDive ? [1, 0.4] : TT < tLand ? [-0.6, 1] : [0.6, 0];
  const mood = TT < tNen ? 'calm' : TT < tDive ? 'happy' : 'calm';
  heroGiot(hx, hy, HR, { key: 'hero', look, mood, salt: 0, legs: TT > tLand - 0.4, rot: -0.25 * Math.sin(Math.PI * u), sx: 1 + sq, sy: 1 - sq });
  viTag('độ mặn giữ đều');
  pageCaption(['Muối lắng xuống đáy,', 'độ mặn ≈ 3,5 %'], [[1, '3,5 %']], { size: 62, at: 0.3 });
};
