// =====================================================================
//  sc-water.js — the cutaway with the plate hot the whole time: boil (water boils, the readout climbs to 100 °C and
//  HOLDS), steam (the extra heat only makes steam; still 100 °C), dry (the water is gone, the hero is the last drop to
//  turn to steam and leaves through the vent; the readout jumps to 102 °C and turns hot).
//  KHUNG HÌNH GỌN: ≤ 5 bubbles (cutaway), ≤ 3 steam wisps, 2 heat arrows, one trend arrow beside the readout.
//  Colour: blue = water / steam / hero only; orange = heat / hot; dark = the magnet only; grey = everything else.
// =====================================================================
// 0 within `pad` of either end of the era, 1 in the middle (eased) — keeps the hero exact at the bridges
const wa_env = (id, pad = 0.5, ramp = 0.5) => EZ.io(seg(TT, ET(id) + pad, ET(id) + pad + ramp)) * (1 - EZ.io(seg(TT, EE(id) - pad - ramp, EE(id) - pad)));
// cutaway geometry (same formulas as props.js cutaway): rice top and water top for given levels
const wa_riceTop = (rice) => lerp(985, 800, rice);
const wa_waterTop = (water, rice) => lerp(wa_riceTop(rice), 640, water);
// the readout's thermometer fill for a temperature (°C)
const wa_fill = (T) => clamp((T - 20) / 90);
// the plate state shared by all three scenes: hot, cooking, magnet held, current flowing
const WA_PLATE = { heat: 1, cook: 1, mag: 1, field: 0.5, flow: 1 };
const WA_ARROWS = [385, 715];     // heat arrows sit between the bubbles (bubbles at x 330 + 110 i)
const WA_VENT = [730, 452];

// the plate's heat arrows rising into the pot; top = where they end (the water surface, or low in a dry pot)
function wa_heat(top, o = {}) {
  WA_ARROWS.forEach((x, i) => heatArrow(x, 984, x, top, { ph: i * 1.7, amp: 8, al: o.al ?? 1, part: o.part ?? 1 }));
}
// the temperature readout at its standard place, with an optional pulse (kick) on a cue
function wa_card(T, o = {}) {
  const s = 1 + 0.06 * (o.kick ?? 0);
  ctx.save(); ctx.translate(290, 404); ctx.scale(s, s); ctx.translate(-290, -404);
  tempCard(290, 404, T, { fill: wa_fill(T) + 0.006 * Math.sin(TT * 5.3), hot: o.hot ?? 0 });
  ctx.restore();
}
// the trend mark beside the readout (x 430–500): 'flat' (holds), 'up' grey crossed (not hotter), 'hot' orange up
function wa_trend(kind, k, o = {}) {
  if (k <= 0.01) return;
  const x = 462;
  if (kind === 'flat') {
    simpleArrow(428, 404, 500, 404, { part: k, w: 5, al: o.al ?? 1 });
    return;
  }
  const col = kind === 'hot' ? COL.heat : PAL.edge;
  simpleArrow(x, 440, x, 350, { part: k, col, w: kind === 'hot' ? 6 : 5, al: o.al ?? 1 });
  const kx = clamp(o.cross ?? 0);
  if (kx > 0.01) {
    ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
    const d = 30;
    polyPath([[x - d, 395 - d], [lerp(x - d, x + d, kx), lerp(395 - d, 395 + d, kx)]], false); hair(PAL.text, 5); ctx.stroke();
    if (kx > 0.5) { const q = (kx - 0.5) * 2; polyPath([[x + d, 395 - d], [lerp(x + d, x - d, q), lerp(395 - d, 395 + d, q)]], false); hair(PAL.text, 5); ctx.stroke(); }
    ctx.restore();
  }
}
// a steam wisp: from the water surface at (sx, sy), curving into the lid's vent and out above it.
// h (0..1.4) = the head's progress; the wisp is the stretch [h - 0.4, h] of the path, fading at the tail and the top.
function wa_wispPt(sx, sy, u, i) {
  const [vx, vy] = WA_VENT;
  if (u <= 0.75) {   // cubic from the surface up and over to the vent
    const s = u / 0.75, a = 1 - s;
    const P0 = [sx, sy], P1 = [sx, 600], P2 = [vx, 600], P3 = [vx, vy];
    const x = a * a * a * P0[0] + 3 * a * a * s * P1[0] + 3 * a * s * s * P2[0] + s * s * s * P3[0];
    const y = a * a * a * P0[1] + 3 * a * a * s * P1[1] + 3 * a * s * s * P2[1] + s * s * s * P3[1];
    const wob = Math.sin(u * 14 - TT * 4 + i * 2) * 13 * Math.sin(Math.PI * s);
    return [x + wob, y];
  }
  const s = (u - 0.75) / 0.25;   // out of the vent, drifting up and a little right
  return [vx + s * 24 + Math.sin(s * 5 - TT * 4 + i * 2) * 16 * s, vy - s * 120];
}
function wa_wisps(sy, k, n = 3) {
  if (k <= 0.01) return;
  const SX = [610, 700, 790];
  for (let i = 0; i < n; i++) {
    const h = mod(TT * 0.42 + i / n, 1) * 1.4, a = Math.max(0, h - 0.4), b = Math.min(1, h);
    if (b - a < 0.02) continue;
    const P = [];
    for (let j = 0; j <= 24; j++) P.push(wa_wispPt(SX[i], sy - 6, lerp(a, b, j / 24), i));
    const fade = clamp((1.4 - h) / 0.35) * clamp(h / 0.15);
    ctx.save(); ctx.globalAlpha = k * fade; polyPath(P, false); hair(COL.waterL, 16); ctx.stroke(); hair(COL.waterM, 5); ctx.stroke(); ctx.restore();
  }
}

// ---------------------------------------------------------------------
//  BOIL — "Nước sôi ở một trăm độ, và chừng nào còn nước, đáy nồi cứ đứng quanh mức đó."
//  Bubbles grow to 5 on "sôi"; the readout climbs 80 -> 100 by "độ" and HOLDS (needle wobble only); on "đứng quanh
//  mức đó" the card pulses and a flat grey arrow beside it says "holds". The hero bobs in the bubbling water.
// ---------------------------------------------------------------------
SCENES.boil = function () {
  const t0 = ET('boil'), t1 = EE('boil'), ts = VW('boil', 'sôi'), td = VW('boil', 'độ'), tst = VW('boil', 'đứng');
  const water = lerp(0.85, 0.75, seg(TT, t0, t1)), rice = 0.45;
  const bub = lerp(0.6, 1, EZ.io(seg(TT, ts - 0.1, ts + 0.4)));
  const wTop = wa_waterTop(water, rice);
  cutaway({ ...WA_PLATE, water, rice, bubbles: bub });
  wa_heat(wTop + 30);
  // the readout: climbs to 100 by "độ", then holds
  const T = lerp(80, 100, EZ.o2(seg(TT, t0 + 0.1, td)));
  wa_card(T, { kick: kick(TT, tst, { k: 200, damp: 0.35 }) });
  wa_trend('flat', EZ.o2(ev(tst + 0.05, 0.4)));
  // the hero bobs with the bubbles (envelope keeps it exact at the bridges)
  const e = wa_env('boil'), [hx, hy] = BR.boilSteam.a;
  const mood = TT < ts ? 'calm' : TT < VW('boil', 'chừng') ? 'wow' : 'hot';
  const look = (TT > VW('boil', 'một') && TT < VW('boil', 'và')) ? -0.7 : 0;
  heroDrop(hx + 5 * Math.sin((TT - t0) * 2.1) * e, hy + 9 * Math.sin((TT - t0) * 3.3) * e, HR,
    { mood, look: look * e, squash: 0.12 * e * (0.5 + 0.5 * Math.sin((TT - t0) * 6.6)) });
  viTag('04', 'nước sôi');
  viCaption(['nước sôi ở 100°C', 'còn nước: đứng yên'], [0, '100°C']);
};

// ---------------------------------------------------------------------
//  STEAM — "Nhiệt cấp thêm chỉ biến nước thành hơi, chứ không làm đáy nồi nóng hơn."
//  Heat arrows pulse up into the water on "nhiệt cấp thêm"; on "hơi" 3 wisps rise from the surface through the vent;
//  the water falls 0.75 -> 0.5; the readout stays 100, "vẫn 100°C" springs in; on "không làm" a grey up arrow appears
//  beside the card and is crossed out on "nóng hơn".
// ---------------------------------------------------------------------
SCENES.steam = function () {
  const t0 = ET('steam'), t1 = EE('steam'), th = VW('steam', 'hơi'), tk = VW('steam', 'không'), tn = VW('steam', 'nóng');
  const water = lerp(0.75, 0.5, seg(TT, t0, t1)), rice = 0.45, wTop = wa_waterTop(water, rice);
  cutaway({ ...WA_PLATE, water, rice, bubbles: 1 });
  // "nhiệt cấp thêm": the arrows swell (thicker wave) for a moment
  const sw = Math.sin(Math.PI * seg(TT, VW('steam', 'nhiệt'), VW('steam', 'chỉ') + 0.3));
  WA_ARROWS.forEach((x, i) => heatArrow(x, 984, x, wTop + 30, { ph: i * 1.7, amp: 8 + 6 * sw, w: 6 + 2 * sw }));
  wa_wisps(wTop, EZ.o2(ev(th - 0.15, 0.6)));
  wa_card(100, { kick: kick(TT, VW('steam', 'biến'), { k: 200, damp: 0.4 }) * 0.6 });
  vlabel('vẫn 100°C', 272, 628, VW('steam', 'chỉ'), 58, { align: 'left' });
  wa_trend('up', EZ.o2(ev(tk, 0.4)), { cross: EZ.o2(ev(tn - 0.1, 0.45)) });
  const e = wa_env('steam'), [hx, hy] = BR.steamDry.a;
  const look = TT > th + 0.2 && TT < tk ? 0.8 : 0;
  heroDrop(hx + 4 * Math.sin((TT - t0) * 1.9) * e, hy + 7 * Math.sin((TT - t0) * 3.1) * e, HR,
    { mood: 'hot', look: look * e, squash: 0.1 * e * (0.5 + 0.5 * Math.sin((TT - t0) * 6.2)) });
  viTag('05', 'hơi nước');
  viCaption(['nhiệt chỉ tạo hơi,', 'không nóng hơn'], [0, 'hơi'], { col: COL.waterL });
};

// ---------------------------------------------------------------------
//  DRY — "Khi gạo hút hết nước và hơi bay đi, đáy nồi khô lại, nhiệt độ vọt lên."
//  On "gạo hút hết nước" the water drains to 0 and the rice swells (0.45 -> 0.9); the hero settles on the rice.
//  On "hơi" it turns to steam (steam 0 -> 1) and rises along a path through the vent to BR.dryCurie.a, holding there
//  from ~33.5. The heat arrows now stop low in the dry pot; on "vọt" the readout jumps 100 -> 102 and turns hot,
//  with an orange up arrow beside it.
// ---------------------------------------------------------------------
const WA_PATH = [[540, 748], [548, 660], [600, 580], [690, 530], [730, 470], [742, 410], [760, 360]];
function wa_pathAt(u) {   // Catmull-Rom through WA_PATH, parameterised by arc length (sampled)
  const S = [];
  for (let i = 0; i < WA_PATH.length - 1; i++) {
    const p0 = WA_PATH[Math.max(0, i - 1)], p1 = WA_PATH[i], p2 = WA_PATH[i + 1], p3 = WA_PATH[Math.min(WA_PATH.length - 1, i + 2)];
    for (let j = 0; j < 12; j++) {
      const t = j / 12, t2 = t * t, t3 = t2 * t;
      S.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  S.push(WA_PATH[WA_PATH.length - 1]);
  const L = [0]; for (let i = 1; i < S.length; i++) L.push(L[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
  const d = clamp(u) * L[L.length - 1];
  let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const f = (d - L[i - 1]) / (L[i] - L[i - 1] || 1);
  return [lerp(S[i - 1][0], S[i][0], f), lerp(S[i - 1][1], S[i][1], f)];
}
SCENES.dry = function () {
  const t0 = ET('dry'), t1 = EE('dry'), tg = VW('dry', 'gạo'), tho = VW('dry', 'hơi'), tv = VW('dry', 'vọt');
  const tDry = VW('dry', 'và');                                     // the last water is gone by "và"
  const kw = EZ.io(seg(TT, tg - 0.1, tDry)), water = lerp(0.5, 0, kw);
  const rice = lerp(0.45, 0.9, EZ.io(seg(TT, tg, tDry + 0.3)));
  const rTop = wa_riceTop(rice), wTop = wa_waterTop(water, rice);
  cutaway({ ...WA_PLATE, water, rice, bubbles: clamp(water / 0.5) });
  // heat arrows: into the water while it lasts, then they stop low — the heat stays in the dry bottom
  wa_heat(lerp(wTop + 30, Math.max(rTop + 40, 900), kw));
  // the last wisps fade as the water goes
  wa_wisps(wTop, 1 - EZ.io(seg(TT, tg, tDry + 0.2)), 3);
  // readout: holds 100 until "vọt", then jumps to 102 and turns hot
  const kv = spring(TT, tv - 0.05, { k: 160, damp: 0.55 });
  wa_card(lerp(100, 102, clamp(kv, 0, 1.2)), { hot: EZ.o2(ev(tv - 0.05, 0.35)), kick: kick(TT, tv, { k: 220, damp: 0.35 }) });
  // the "not hotter" mark from steam leaves; on "vọt" an orange up arrow
  const kOld = 1 - ev(t0 + 0.4, 0.4);
  wa_trend('up', kOld, { cross: 1, al: kOld });
  wa_trend('hot', EZ.o2(ev(tv, 0.35)));
  // "vẫn 100°C" stays while the water drains, then leaves (the pot is drying)
  const kl = 1 - ev(tDry, 0.4);
  if (kl > 0.01) vtext('vẫn 100°C', 272, 628, 58, { align: 'left', al: kl });
  // the hero: exact at BR.steamDry.a, settles on the swelling rice, turns to steam on "hơi", rises out of the vent
  const [ax, ay] = BR.steamDry.b, [bx, by] = BR.dryCurie.a;
  const sitY = rTop - 70;
  const ks = EZ.io(seg(TT, t0 + 0.5, t0 + 1.5));
  let hx = ax, hy = lerp(ay, Math.max(ay, sitY), ks);
  WA_PATH[0] = [540, wa_riceTop(0.9) - 70];
  const tr0 = tho + 0.15, tr1 = Math.min(tr0 + 2.9, t1 - 1.0);   // arrive ≥ 0.5 s before the bridge window opens
  const ur = seg(TT, tr0, tr1), u = 0.5 * EZ.io(ur) + 0.5 * EZ.o2(ur);
  if (TT >= tr0) [hx, hy] = wa_pathAt(u);
  if (TT >= tr1) { hx = bx; hy = by; }
  const steam = EZ.io(seg(TT, tho - 0.1, tho + 0.55));
  const thin = Math.sin(Math.PI * seg(u, 0.55, 0.92));            // squeezes through the vent
  const arrive = kick(TT, tr1, { k: 180, damp: 0.4 });
  const mood = TT < tho - 0.1 ? 'calm' : TT < tr1 + 0.3 ? 'wow' : 'calm';
  heroDrop(hx, hy, HR * (1 - 0.35 * thin), { steam, mood, squash: 0.25 * thin + 0.15 * arrive, look: TT > tr1 ? -0.4 * (1 - seg(TT, t1 - 1.0, t1 - 0.6)) : 0 });
  viTag('06', 'cạn nước');
  viCaption(['hết nước:', 'nhiệt độ vọt lên'], [1, 'vọt lên']);
};
