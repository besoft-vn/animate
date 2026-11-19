// =====================================================================
//  sc-switch.js — the cutaway of the cooker's base and its magnetic thermostat (owned by the sc-switch agent).
//  Scenes: magnet (ấn nút -> nam châm đẩy lên, hít ferit), heat (mạch đóng, mâm nhiệt nóng), curie (≈103°C: ferit mất
//  từ tính), click (SLAM: nam châm rơi, nút nhảy sang giữ ấm).
//  Mechanism (props.js cutaway): knob DOWN -> lever tips about (390, 1118) -> its right end pushes the magnet UP onto
//  the ferrite (mag 1). Ferrite hot -> no pull -> magnet FALLS (mag 0) -> lever tips back -> knob pops UP.
//  The lens is a magnifier centred ON the real thermostat (540, 1060), so it grows out of it and shrinks back into it;
//  it sits below the hero (hero bottom ≈ y 795, lens top ≈ y 875) and never covers it.
//  Colour: dark = magnet + pull lines; orange = heat / hot; blue = water / the hero; grey = everything else.
// =====================================================================
const SW_LENS = { cx: 540, cy: 1060, R: 185, z: 2.6 };
const SW_WATER = 0.85, SW_RICE = 0.45;            // full pot (matches sc-water at the heat->boil boundary)
const SW_DRY_RICE = 0.9;
// 0 within `pad` s of either end of the era, 1 in the middle (eased) — the hero is exact at its BR points there
const sw_env = (id, pad = 0.5, ramp = 0.6) => EZ.io(seg(TT, ET(id) + pad, ET(id) + pad + ramp)) * (1 - EZ.io(seg(TT, EE(id) - pad - ramp, EE(id) - pad)));
// screen point of a cutaway point inside the lens (k = lens grow 0..1)
const sw_lp = (x, y, k = 1) => [SW_LENS.cx + (x - LENS_C[0]) * SW_LENS.z * k, SW_LENS.cy + (y - LENS_C[1]) * SW_LENS.z * k];
// the readout card, kept at a fixed SCREEN spot (290, 404) under any camera zoom about (540, 1000), clear of the tag
function sw_card(v, o = {}) { if (DEFER) DEFER.push(() => tempCard(290, 404, v, o)); else tempCard(290, 404, v, o); }   // screen space, below the tag
const sw_lens = (o) => thermoLens(SW_LENS.cx, SW_LENS.cy, SW_LENS.R, SW_LENS.z, o);

// a label (Pangolin) on a soft white pill, springing in at t0 (now: no spring); optional hairline leader to `to`
function sw_label(str, x, y, t0, o = {}) {
  const size = o.size ?? 52;
  const a = (o.now ? 1 : clamp(spring(TT, t0, { k: 140, damp: 0.8 }))) * clamp(o.al ?? 1);
  if (a <= 0.001) return;
  const dy = (1 - a) * 14 * (o.now ? 0 : 1);
  ctx.save(); ctx.font = `400 ${size}px ${VFONT}`; const w = ctx.measureText(str).width; ctx.restore();
  const al = o.align ?? 'center', x0 = al === 'left' ? x : al === 'right' ? x - w : x - w / 2;
  ctx.save(); ctx.globalAlpha = a;
  if (o.to) {
    const lx = al === 'right' ? x + 10 : al === 'left' ? x - 10 : x, ly = y - size * 0.32 + dy;
    polyPath([[lx, ly], o.to], false); hair(o.lead ?? PAL.edge, 3); ctx.stroke();
    ctx.beginPath(); ctx.arc(o.to[0], o.to[1], 5, 0, TAU); ctx.fillStyle = o.lead ?? PAL.edge; ctx.fill();
  }
  polyPath(rrectPts(x0 - 14, y - size * 0.86 + dy, w + 28, size * 1.12, size * 0.3, 4), true); ctx.fillStyle = PAL.face; ctx.fill();
  ctx.restore();
  vtext(str, x, y + dy, size, { col: o.col ?? PAL.text, align: al, al: a });
}
// a big onomatopoeia that pops (scale spring) — "cạch!"
function sw_pop(str, x, y, t0, size = 92, o = {}) {
  const s = spring(TT, t0, { k: 260, damp: 0.42 }); if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.06); ctx.scale(Math.max(0, s), Math.max(0, s)); ctx.translate(-x, -y);
  vtext(str, x, y, size, { col: o.col ?? PAL.text, al: clamp(s * 1.5) * clamp(o.al ?? 1) });
  ctx.restore();
}
// props' cutaway leaves the moving contact 18 px short of the fixed one even when cook = 1: redraw it so it TOUCHES
// when closed (white-out the props' leaf, draw ours), with a small orange tick at the touch while current flows
function sw_contacts(cook, flow = cook) {
  const yP = lerp(1128, 1110, clamp(cook)) + 4, yS = lerp(1132, 1101, clamp(cook));
  polyPath([[597, yP], [727, yP]], false); hair(PAL.face, 9); ctx.stroke();
  polyPath([[650, 1096], [724, 1096]], false); hair(PAL.edge, 5); ctx.stroke();
  polyPath([[600, yS], [724, yS]], false); hair(PAL.edge, 5); ctx.stroke();
  if (flow > 0.01 && cook > 0.95) { ctx.save(); ctx.globalAlpha = clamp(flow); polyPath([[660, 1098.5], [714, 1098.5]], false); hair(COL.heat, 4); ctx.stroke(); ctx.restore(); }
}
// the lamp captions under the body (the props draw the lamps but not their words)
const sw_lampWord = (str, x, t0, o = {}) => sw_label(str, x, 1236, t0, { size: 50, ...o });

// ---------------------------------------------------------------------
//  MAGNET (6.25–12.5) — "Ấn nút nấu, một nam châm được đẩy lên, hít chặt vào miếng ferit dưới đáy nồi."
//  ấn: knob pressed DOWN (lever tips, magnet rises, mag 0 -> 1) + the lens grows out of the thermostat;
//  nam châm: label · đẩy: up arrow by the magnet · hít: dashed pull lines · ferit: label. Hero watches from the water.
// ---------------------------------------------------------------------
SCENES.magnet = function () {
  const t0 = ET('magnet'), tA = VW('magnet', 'ấn'), tN = VW('magnet', 'nam'), tD = VW('magnet', 'đẩy'), tH = VW('magnet', 'hít'), tF = VW('magnet', 'ferit');
  const kL = clamp(spring(TT, t0 + 0.05, { k: 110, damp: 0.75 }));
  const mag = clamp(spring(TT, tA + 0.12, { k: 110, damp: 0.55 }));
  const field = EZ.o2(ev(tH, 0.5));
  const S = { water: SW_WATER, rice: SW_RICE, mag, field, cook: 0, heat: 0 };
  cutaway(S);
  // the press: a grey arrow pushing the knob DOWN (outside the body, left of the knob)
  const pa = ev(tA - 0.1, 0.3) * (1 - ev(tN, 0.5));
  if (pa > 0) simpleArrow(105, 1010, 105, 1010 + 110 * EZ.o2(ev(tA - 0.1, 0.35)), { al: pa, w: 5 });
  sw_lens({ ...S, k: kL });
  // labels on the lens
  const [, my] = sw_lp(540, 1062 + (1 - mag) * 46), [, fy] = sw_lp(540, 1019);
  sw_label('nam châm', 345, my + 17, VW('magnet', 'châm') - 0.1, { align: 'right', al: kL, to: sw_lp(510, 1062 + (1 - mag) * 46) });
  // "đẩy lên": an up arrow beside the magnet, inside the lens; it re-grows once a beat while the word lasts
  const da = ev(tD - 0.05, 0.25) * (1 - ev(tH + 0.6, 0.5)) * kL;
  if (da > 0) { const g = EZ.o2(ev(tD - 0.05, 0.45)); simpleArrow(655, 1160, 655, 1160 - 105 * g, { al: da, w: 6, head: 22 }); }
  sw_label('ferit', 735, fy + 17, tF - 0.1, { align: 'left', al: kL, to: sw_lp(578, 1019) });
  // the hero: in the water above the thermostat, looking at what is being labelled
  const e = sw_env('magnet'), [hx, hy] = BR.magnetHeat.a;
  const look = TT < tN ? 0 : TT < tH ? -0.7 : TT < tF ? 0 : 0.7;
  heroDrop(hx + 26 * Math.sin((TT - t0) * 1.3) * e, hy + 10 * Math.sin((TT - t0) * 1.9) * e, HR,
    { key: 'hero', mood: TT >= tH && TT < tH + 1.4 ? 'wow' : 'calm', look: look * e });
  viTag('02', 'nam châm');
  viCaption(['ấn nút: nam châm', 'hít chặt ferit'], [1, 'hít chặt'], { at: tA - t0 + 0.2, col: '#e4e4ea' });
};

// ---------------------------------------------------------------------
//  HEAT (12.5–17.5) — "Lực hút ấy giữ cho mạch điện đóng, và mâm nhiệt bắt đầu nóng lên."
//  The lens (pull lines) holds through "Lực hút ấy giữ", then shrinks back into the thermostat; mạch/đóng: the
//  contacts close, current dashes run, "nấu" lamp lights; mâm: the plate glows, three heat arrows rise into the pot.
// ---------------------------------------------------------------------
SCENES.heat = function () {
  const t0 = ET('heat'), tG = VW('heat', 'giữ'), tM = VW('heat', 'mạch'), tDg = VW('heat', 'đóng'), tMa = VW('heat', 'mâm'), tNo = VW('heat', 'nóng');
  const kL = 1 - EZ.io(seg(TT, tG + 0.25, tM - 0.05));
  const cook = clamp(spring(TT, tM + 0.05, { k: 160, damp: 0.6 })), flow = ev(tDg - 0.1, 0.4);
  const heat = EZ.io(ev(tMa, 1.1));
  // "Lực hút": the pull lines swell once while the word is said
  const S = { water: SW_WATER, rice: SW_RICE, mag: 1, field: 1 - 0.5 * EZ.io(seg(TT, tNo, EE('heat') - 0.3)), cook, flow, heat };
  cutaway(S); sw_contacts(cook, flow);
  // heat arrows: up from the plate / pot bottom through the rice into the water
  const ha = ev(tMa + 0.4, 0.3);
  if (ha > 0) [360, 540, 720].forEach((x, i) => {
    const p = EZ.o2(ev(tMa + 0.4 + i * 0.18, 0.7)), top = i === 1 ? 830 : 790;
    heatArrow(x, 992, x, top, { part: p, ph: i * 1.7, amp: 8, w: 6 });
  });
  if (kL > 0.01) {
    sw_lens({ ...S, k: kL });
    const [, my] = sw_lp(540, 1062), [, fy] = sw_lp(540, 1019), la = clamp(1 - seg(TT, tG, tG + 0.3));
    sw_label('nam châm', 345, my + 17, 0, { now: true, align: 'right', al: la, to: sw_lp(510, 1062) });
    sw_label('ferit', 735, fy + 17, 0, { now: true, align: 'left', al: la, to: sw_lp(578, 1019) });
    // "lực hút": a soft dark ring pulse around the gap, once
    const pu = ev(VW('heat', 'hút'), 0.6);
    if (pu > 0 && pu < 1) { const [gx, gy] = sw_lp(540, 1037, kL); ctx.save(); ctx.globalAlpha = (1 - pu) * 0.8; ctx.beginPath(); ctx.ellipse(gx, gy, 90 + 70 * pu, 40 + 40 * pu, 0, 0, TAU); hair(PAL.accent, 3); ctx.stroke(); ctx.restore(); }
  }
  // the contacts closing: a short orange tick where they meet, and the lamp's word
  sw_lampWord('nấu', 640, tM + 0.1, { col: COL.heat });
  sw_label('mâm nhiệt', 330, 1088, tMa + 0.1, { size: 50, col: COL.heat });
  // the hero: in the water, looking down at the plate once it warms
  const e = sw_env('heat'), [hx, hy] = BR.heatBoil.a;
  heroDrop(hx + 22 * Math.sin((TT - t0) * 1.4 + 1) * e, hy + 9 * Math.sin((TT - t0) * 2.1) * e, HR,
    { key: 'hero', mood: TT >= tNo && TT < tNo + 0.9 ? 'wow' : 'calm', look: (TT < tM ? 0 : TT < tMa ? 0.6 : -0.3) * e });
  // the readout climbs from room temperature once the plate heats (not hot yet: ~80 °C by the era end)
  const tc = 25 + 55 * EZ.io(seg(TT, tMa + 0.3, EE('heat') - 0.2));
  sw_card(tc, { al: ev(tMa, 0.4), fill: 0.2 + 0.45 * seg(tc, 25, 80) });
  viTag('03', 'mạch đóng');
  viCaption(['mạch đóng,', 'mâm nhiệt nóng lên'], [1, 'nóng lên'], { at: tM - t0 });
};

// ---------------------------------------------------------------------
//  CURIE (34.5–40.0) — "Đến khoảng một trăm linh ba độ, miếng ferit bỗng mất từ tính."
//  Dry pot; the lens opens on the thermostat (magnet held up, pull lines on, plate hot); the readout ticks 102 -> 103
//  on "một trăm linh ba"; the ferrite turns orange on "ferit"; on "mất" the pull lines fade, label "mất từ tính".
//  The pause (39.05–40.0) holds still; only the magnet trembles a hair. Camera: CAMS.curie (bridges.js).
// ---------------------------------------------------------------------
SCENES.curie = function () {
  const t0 = ET('curie'), tMot = VW('curie', 'một'), tF = VW('curie', 'ferit'), tMat = VW('curie', 'mất');
  const kL = clamp(spring(TT, t0 + 0.45, { k: 110, damp: 0.75 }));
  const ferHot = EZ.io(ev(tF, 0.7)), field = 1 - EZ.io(ev(tMat + 0.05, 0.8));
  const trem = 0.03 * (0.5 + 0.5 * Math.sin(TT * 47)) * ev(tMat + 0.6, 0.4);
  const S = { water: 0, rice: SW_DRY_RICE, mag: 1 - trem, field, ferHot, cook: 1, flow: 1, heat: 1 };
  cutaway(S); sw_contacts(1, 1);
  sw_lens({ ...S, k: kL });
  const [, fy] = sw_lp(540, 1019);
  sw_label('ferit', 735, fy + 17, tF - 0.05, { align: 'left', al: kL, col: COL.heat, lead: COL.heat, to: sw_lp(578, 1019) });
  sw_label('mất từ tính', 345, fy + 17, tMat + 0.05, { align: 'right', al: kL, to: sw_lp(500, 1030) });
  // the readout: 102 -> 103 on "một trăm linh ba"
  const v = 102 + EZ.io(ev(tMot + 0.15, 0.5));
  sw_card(v, { hot: 1, fill: 0.85 + 0.1 * ev(tMot + 0.15, 0.5) });
  // the hero (steam) above the vent, watching the base; still in the pause
  const e = sw_env('curie', 0.5, 0.6) * (1 - ev(tMat + 0.5, 0.4)), [hx, hy] = BR.dryCurie.b;
  heroDrop(hx - 10 * Math.sin((TT - t0) * 1.2) * e, hy + 6 * Math.sin((TT - t0) * 1.7) * e, HR,
    { key: 'hero', steam: 1, mood: TT >= tMat ? 'wow' : 'calm', look: -0.5 * clamp(seg(TT, t0 + 0.5, t0 + 1.0)) });
  viTag('07', 'ferit nóng');
  viCaption(['≈103°C: ferit', 'mất từ tính'], [1, 'mất từ tính'], { at: 0.35 });
};

// ---------------------------------------------------------------------
//  CLICK (40.0–44.0) — HARD CUT on the SLAM. "Nam châm rơi xuống, và nút nhảy sang giữ ấm."
//  Complete on frame 1 (tag, caption, lens, readout). The magnet FALLS right at the SLAM (spring, small bounce), the
//  lever tips back and the knob pops UP; contacts open, "nấu" off, "giữ ấm" on, current stops, the plate cools.
//  Big "cạch!" pops in the empty pot. The hero (steam) cheers at [760, 360] and is back there exactly by 43.5.
// ---------------------------------------------------------------------
SCENES.click = function () {
  const t0 = SLAM, tNh = VW('click', 'nhảy'), tGi = VW('click', 'giữ');
  const fall = spring(TT, t0, { k: 230, damp: 0.42 });
  const mag = clamp(1 - fall);
  const cook = 1 - ev(t0 + 0.06, 0.12), warm = ev(t0 + 0.12, 0.2);
  const heat = lerp(1, 0.18, EZ.io(seg(TT, t0 + 0.2, t0 + 2.2)));
  const S = { water: 0, rice: SW_DRY_RICE, mag, field: 0, ferHot: 1, cook, flow: cook, warm, heat };
  cutaway(S); sw_contacts(cook, cook);
  // the knob pops UP: a grey up arrow outside the body (again on "nhảy")
  const up = (k0) => EZ.o2(ev(k0, 0.3));
  const ua = ev(t0 + 0.05, 0.1) * (1 - ev(t0 + 1.4, 0.4)) + ev(tNh - 0.05, 0.15) * (1 - ev(tNh + 1.0, 0.4));
  if (ua > 0) { const g = TT < tNh - 0.05 ? up(t0 + 0.05) : up(tNh - 0.05); simpleArrow(105, 1130, 105, 1130 - 110 * g, { al: clamp(ua), w: 5 }); }
  sw_lens({ ...S, k: 1 });
  // the fall: a down arrow beside the magnet in the lens
  const da = (1 - ev(t0 + 1.6, 0.4));
  if (da > 0) { const g = EZ.o2(ev(t0, 0.3)); simpleArrow(655, 1000, 655, 1000 + 120 * g, { al: da, w: 6, head: 22 }); }
  const [, my] = sw_lp(540, 1062 + (1 - mag) * 46);
  sw_label('nam châm', 345, my + 17, 0, { now: true, align: 'right', to: sw_lp(510, 1062 + (1 - mag) * 46) });
  sw_card(103, { hot: 1, fill: 0.95 });
  sw_pop('cạch!', 540, 760, t0 + 0.12, 104);
  // the lamps' words: "giữ ấm" lights (and is underlined again on "giữ ấm")
  sw_lampWord('giữ ấm', 790, t0 + 0.15, { col: COL.heat });
  const ul = ev(tGi, 0.35);
  if (ul > 0) { ctx.save(); polyPath([[730, 1252], [730 + 120 * EZ.o2(ul), 1252]], false); hair(COL.heat, 4); ctx.stroke(); ctx.restore(); }
  // the hero (steam) cheers: a few hops, then back exactly to [760, 360] by EE - 0.5
  const e = sw_env('click', 0.3, 0.4) * (1 - ev(EE('click') - 1.1, 0.6)), [hx, hy] = BR.clickWarm.a;
  const hop = Math.abs(Math.sin((TT - t0) * Math.PI * 2)) * 22 * e;
  heroDrop(hx, hy - hop, HR, { key: 'hero', steam: 1, mood: 'wow', look: -0.4 * (1 - ev(EE('click') - 1.1, 0.6)), squash: 0.25 * (1 - hop / 22) * e });
  viTagNow('08', 'cạch!');
  viCaption(['nam châm rơi:', 'nhảy sang giữ ấm'], [1, 'giữ ấm'], { now: true });
};
