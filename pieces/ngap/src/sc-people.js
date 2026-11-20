// =====================================================================
//  sc-people.js — the people scenes (owned by the sc-people agent; prefix PE_).
//  hook   (0–7.75)     desk: Minh with an O₂ 100% mask still yawns; "thiếu ô xi?" crossed out. Brain [540,560,80].
//  lay    (35.5–42.5)  living room: Minh (left) yawns, Lan (right) sees / hears / reads "ngáp"; silence: Lan twitches.
//  payoff (42.5–47.25) SLAM: Lan yawns huge, the brain above her too; "ngáp lây!", "1/2 – 2/3 số người".
//  end    (53.0–60.75) the hook's desk again, later on the clock; Minh + Lan; the brain fans itself; "bạn?" at the viewer.
//  Colour: pink = the brain only, orange = heat only, blue = cool only; props are neutrals (wood, cream, green tank).
// =====================================================================
const PE_WALL_DESK = PAL.sky, PE_WALL_LIVING = '#f1dfb0';
const PE_DESK_Y = 1140;
const PE_MINH = { x: 540, y: 1020, s: 1.6 };          // hook / end start: head centre ≈ (540, 831), hair top ≈ 678
const PE_HERO_HOOK = [540, 560, 80];
const PE_HERO_LAY = [740, 560, 70];

// ---- the desk set (hook + end): sky wall, wall clock, desk lamp, mug with steam, wooden desk
function PE_deskBack(hh, mm) {
  room(PE_WALL_DESK, PE_DESK_Y, PAL.wood, 'pedr');
  // a skirting strip of slightly darker wall low down (flat, quiet)
  clock(860, 520, 80, hh, mm, 'peck');
  // the lamp: base on the desk at the far right, arm up, shade over the desk
  cut(capsulePts(990, PE_DESK_Y - 10, 1010, 760, 26, 6), PAL.charcoal, { key: 'pelarm1', sb: 6 });
  cut(capsulePts(1010, 760, 950, 700, 24, 6), PAL.charcoal, { key: 'pelarm2', sb: 6 });
  cut([[890, 730], [925, 650], [985, 650], [1030, 730]], PAL.lamp, { key: 'pelshade', sb: 8 });
  ctx.save(); ctx.globalAlpha = 0.18 + 0.03 * Math.sin(TT * 3);
  ctx.fillStyle = PAL.yellow; ctx.beginPath(); ctx.moveTo(898, 732); ctx.lineTo(1022, 732); ctx.lineTo(1080, PE_DESK_Y); ctx.lineTo(820, PE_DESK_Y); ctx.closePath(); ctx.fill();
  ctx.restore();
  cut(ellipsePts(990, PE_DESK_Y - 8, 60, 16, 0, 22), PAL.charcoal, { key: 'pelbase', sb: 5 });
}
function PE_deskFront() {
  cut(rect(-40, PE_DESK_Y, W + 80, 900, 6), PAL.wood, { key: 'pedesk', tear: 0.6, sy: -6, pat: pat.grainWood('rgba(120,70,30,0.18)') });
  cut(rect(-40, PE_DESK_Y - 6, W + 80, 26, 6), PAL.woodL, { key: 'pedeskedge', tear: 0.5, sb: 6, sy: 4 });
  mug(770, PE_DESK_Y - 100, 1.05, PAL.yellow, 'pemug');
}

// ---- an oxygen tank (green, neutral prop) rising from behind the desk; returns the valve point
function PE_tank(x, k) {
  const dy = (1 - k) * 420, top = 860 + dy;
  cut(capsulePts(x, top + 40, x, PE_DESK_Y + 60, 118, 10), PAL.green, { key: 'petank', sb: 10 });
  ink([[x - 30, top + 70], [x - 30, PE_DESK_Y - 20]], { w: 6, color: 'rgba(255,255,255,0.35)', amt: 0.3, key: 'petanksh' });
  cut(rect(x - 20, top - 10, 40, 34, 6), PAL.grey, { key: 'petankv', sb: 4 });
  cut(ellipsePts(x + 28, top + 2, 16, 16, 0, 16), PAL.paper, { key: 'petankg', sb: 3 });
  ink([[x + 28, top + 2], [x + 28 + 9 * Math.cos(-0.6 + Math.sin(TT * 7) * 0.05), top + 2 + 9 * Math.sin(-0.6)]], { w: 3, color: PAL.ink, amt: 0.1, key: 'petankn' });
  return [x, top - 6];
}
// the clear mask (over nose + mouth) at (mx, my), rotated a; tube from the valve
function PE_mask(mx, my, a, valve, strap) {
  const [vx, vy] = valve;
  // the tube: a soft sag from the valve up to the mask's bottom
  const ex = mx + Math.sin(a) * 40, ey = my + Math.cos(a) * 42;
  const P = []; for (let i = 0; i <= 20; i++) { const u = i / 20, cx = lerp(vx, ex, 0.45), cy = Math.max(vy, ey) + 110; const x = (1 - u) ** 2 * vx + 2 * u * (1 - u) * cx + u * u * ex, y = (1 - u) ** 2 * vy + 2 * u * (1 - u) * cy + u * u * ey; P.push([x, y]); }
  ink(P, { w: 13, color: '#9aa9ae', amt: 0.4, key: 'petube' });
  ink(P, { w: 5, color: 'rgba(255,255,255,0.55)', amt: 0.4, key: 'petubeh' });
  if (strap > 0.01) {
    ctx.save(); ctx.globalAlpha = clamp(strap);
    ink([[mx - 52, my - 14], [PE_MINH.x - 118, PE_MINH.y - 190]], { w: 5, color: '#7f8f95', amt: 0.3, key: 'pestl' });
    ink([[mx + 52, my - 14], [PE_MINH.x + 118, PE_MINH.y - 190]], { w: 5, color: '#7f8f95', amt: 0.3, key: 'pestr' });
    ctx.restore();
  }
  ctx.save(); ctx.translate(mx, my); ctx.rotate(a);
  const M = ellipsePts(0, 0, 58, 44, 0, 30);
  trace(M, true); ctx.fillStyle = 'rgba(236,246,248,0.42)'; ctx.fill();
  ctx.strokeStyle = '#7f9aa5'; ctx.lineWidth = 5; ctx.lineJoin = 'round'; trace(M, true); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-14, -10, 26, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
  cut(rect(-14, 36, 28, 18, 4), '#b8c4c8', { key: 'pemaskv', sb: 3, grain: false });
  ctx.restore();
}

// ---------------------------------------------------------------------
//  HOOK (0–7.75) — "Ngáp không phải vì thiếu ô xi: cho thở ô xi tinh khiết, người ta vẫn ngáp như thường."
// ---------------------------------------------------------------------
SCENES.hook = function () {
  const tO = VW('hook', 'ô'), tCho = VW('hook', 'cho'), tTho = VW('hook', 'thở'), tO2 = VW('hook', 'ô', 2);
  const tVan = VW('hook', 'vẫn');
  const yT0 = tVan - 0.25, yawnM = yawnCurve(TT, yT0, 1.9);   // open 6.1–6.95, hold, close by 8.0
  PE_deskBack(3, 8 + Math.floor(TT * 2) * 0.5);
  // the tank comes up from behind the desk on "cho"
  const tk = pop(tCho, SPRING.smooth);
  const valve = PE_tank(175, tk);
  // Minh: breathes; looks at the tag, then drowsy with the mask, then yawns anyway
  const breath = Math.sin(TT * TAU * 0.35) * 5;
  const look = TT < tO ? 0.3 * Math.sin(TT * 1.6) : TT < tTho ? -0.8 : 0;
  const mood = TT > tO2 + 0.4 && TT < yT0 ? 'sleepy' : undefined;
  bust(PE_MINH.x, PE_MINH.y + breath, PE_MINH.s, { who: 'minh', yawn: yawnM, look, mood, key: 'peminh' });
  // the mask: from the tank to the face (on "thở"), then slides down to the chin as the jaw drops
  if (tk > 0.02) {
    const mk = TT < tTho - 0.6 ? 0 : springEase(TT - (tTho - 0.6), 150, 24);
    const fx = PE_MINH.x, fy = PE_MINH.y - 130 + breath;               // over nose + mouth, below the eyes
    const slide = EZ.io(seg(TT, yT0 + 0.1, yT0 + 0.7));
    const mx = lerp(valve[0] + 40, fx, mk) + slide * 30, my = lerp(valve[1] + 30, fy, mk) + slide * 110;
    PE_mask(mx, my, lerp(-0.4, 0, mk) + slide * 0.35, valve, clamp((mk - 0.85) / 0.15));
  }
  PE_deskFront();
  // tank label (≥ 50 px) — in front of the desk edge
  ptag('O₂ 100%', 200, 1010, tO2, 54, { rot: -0.05, fill: PAL.paper });
  // the question tag, then the strike on "vẫn"
  ptag('thiếu ô xi?', 260, 520, tO, 60, { rot: -0.04 });
  if (TT > tVan) {
    const w = handW('thiếu ô xi?', 60) + 54;
    ink([[260 - w / 2 - 6, 490], [260 + w / 2 + 6, 552]], { w: 10, color: PAL.ink, amt: 0.5, key: 'pex1', frac: seg(TT, tVan, tVan + 0.25) });
    ink([[260 - w / 2 - 6, 552], [260 + w / 2 + 6, 488]], { w: 10, color: PAL.ink, amt: 0.5, key: 'pex2', frac: seg(TT, tVan + 0.18, tVan + 0.43) });
  }
  // the hero: bobs/looks around, exactly at [540,560,80] from 7.25; yawns a little with Minh
  const free = 1 - EZ.io(seg(TT, 6.0, 7.2));
  const hx = PE_HERO_HOOK[0] + 22 * Math.sin(TT * 1.4) * free;
  const hlook = TT < tO ? Math.sin(TT * 1.8) * 0.6 : TT < tTho + 0.3 ? -1 : TT < tVan ? 0.2 * Math.sin(TT * 3) : 0;
  const hmood = TT > tTho && TT < tVan ? 'wow' : 'calm';
  heroBrain(hx, PE_HERO_HOOK[1], PE_HERO_HOOK[2], { warm: heroWarmAt(TT), yawn: 0.65 * yawnCurve(TT, yT0 + 0.15, 1.35), look: hlook * free, mood: hmood, key: 'hero' });
  viTag('01', TITLES.hook);
};

// ---------------------------------------------------------------------
//  the living room (lay + payoff): mustard-cream wall, window with a drifting cloud, a plant, a sage sofa
// ---------------------------------------------------------------------
const PE_LMINH = { x: 300, y: 1000, s: 1.45 }, PE_LLAN = { x: 740, y: 1000, s: 1.45 };
function PE_livingBack() {
  room(PE_WALL_LIVING, 1180, PAL.woodL, 'pelr');
  // window (upper left)
  cut(rect(70, 410, 270, 260, 6), PAL.paper, { key: 'pewin', sb: 8 });
  ctx.save(); trace(rect(88, 428, 234, 224, 3), true); ctx.clip();
  ctx.fillStyle = PAL.sky; ctx.fillRect(80, 420, 250, 240);
  const cx = 60 + mod(TT * 22, 320);
  cut(ellipsePts(cx, 520, 50, 22, 0, 18), PAL.paper, { key: 'pecl1', shadow: false, grain: false });
  cut(ellipsePts(cx + 34, 506, 32, 20, 0, 16), PAL.paper, { key: 'pecl2', shadow: false, grain: false });
  ctx.restore();
  ink([[205, 428], [205, 652]], { w: 8, color: PAL.paper, amt: 0.2, key: 'pewb1' });
  ink([[88, 540], [322, 540]], { w: 8, color: PAL.paper, amt: 0.2, key: 'pewb2' });
  // plant (far right)
  plant(985, 860, 0.85, PAL.charcoal, 'peplant');
  // sofa back + arms
  cut(rect(30, 900, 1020, 360, 70), '#6f8a74', { key: 'pesofa', sb: 12, pat: pat.stripes('rgba(255,255,255,0.08)', 10, 60) });
  cut(rect(-20, 1010, 120, 300, 50), '#5e7863', { key: 'pesofaL', sb: 10 });
  cut(rect(980, 1010, 120, 300, 50), '#5e7863', { key: 'pesofaR', sb: 10 });
}
function PE_livingFront() {
  cut(rect(-20, 1250, 1120, 260, 40), '#6f8a74', { key: 'peseat', sb: 12, sy: -6 });
  cut(rect(-40, 1470, 1160, 500, 0), PAL.woodL, { key: 'pefloor2', tear: 0.5, sy: -4 });
}
// the phone in Lan's hand showing "ngáp" (k: 0 hidden below, 1 up)
function PE_phone(k, wob = 0) {
  if (k <= 0.01) return;
  const dy = (1 - k) * 420;
  hand(712, 1205 + dy, 0.85, -2.05, PE_LLAN_SKIN, PAL.mustard, { key: 'pephh' });
  ctx.save(); ctx.translate(660, 1105 + dy); ctx.rotate(-0.08 + wob);
  cut(rect(-110, -72, 220, 144, 18), PAL.navy, { key: 'peph', sb: 10 });
  cut(rect(-96, -58, 192, 116, 8), PAL.paper, { key: 'pephs', shadow: false, grain: false });
  vtext('ngáp', 0, 18, 60, { col: COL.text });
  ctx.restore();
}
const PE_LLAN_SKIN = PAL.skin2;
// an icon card (eye / ear) with its word, popping at t0
function PE_iconCard(kind, word, x, y, t0) {
  const s = pop(t0); if (s <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(kind === 'eye' ? -0.05 : 0.05); ctx.scale(s, s);
  cut(rect(-92, -84, 184, 168, 6), PAL.paper, { key: 'pec' + kind, tear: 1.4, sb: 8 });
  cut(rect(-30, -98, 60, 26, 2), 'rgba(240,230,190,0.8)', { key: 'pect' + kind, shadow: false, grain: 0.3, shade: false });
  const I = PAL.ink;
  if (kind === 'eye') {
    const bl = mod(TT, 2.6) < 0.12 ? 0.15 : 1;
    ctx.save(); ctx.translate(0, -26); ctx.scale(1, bl);
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-52, 0); ctx.quadraticCurveTo(0, -40, 52, 0); ctx.quadraticCurveTo(0, 40, -52, 0); ctx.fill();
    ctx.strokeStyle = I; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.stroke();
    dot(Math.sin(TT * 2) * 6, 0, 16, PAL.navy); dot(Math.sin(TT * 2) * 6 + 5, -5, 5, '#fff');
    ctx.restore();
  } else {
    cut(ellipsePts(0, -26, 30, 42, 0, 22), PAL.skin1, { key: 'peear', sb: 4, grain: false });
    ink(arcPts(2, -28, 16, Math.PI * 0.6, Math.PI * 1.9, 10), { w: 5, color: '#a96f4f', amt: 0.2, key: 'peeari' });
    for (let i = 0; i < 2; i++) { const r = 50 + i * 16 + mod(TT * 30, 16); ctx.save(); ctx.globalAlpha = 0.8 - i * 0.3; ink(arcPts(-20, -26, r, Math.PI * 0.75, Math.PI * 1.25, 8), { w: 5, color: COL.textD, amt: 0.2, key: 'peeaw' + i }); ctx.restore(); }
  }
  vtext(word, 0, 62, 52, { col: COL.text });
  ctx.restore();
}

// ---------------------------------------------------------------------
//  LAY (35.5–42.5) — "Lạ nhất là ngáp lây: chỉ cần thấy, nghe, thậm chí đọc chữ ngáp..."  (silence 41.75–42.375)
// ---------------------------------------------------------------------
SCENES.lay = function () {
  const tNgap = VW('lay', 'ngáp'), tThay = VW('lay', 'thấy'), tNghe = VW('lay', 'nghe'), tDoc = VW('lay', 'đọc');
  const tSil = VL('lay').t1;
  PE_livingBack();
  // Minh yawns big on "ngáp lây", then turns to Lan
  const ym = yawnCurve(TT, tNgap - 0.2, 2.6);
  const mb = Math.sin(TT * TAU * 0.4) * 4;
  bust(PE_LMINH.x, PE_LMINH.y + mb, PE_LMINH.s, { who: 'minh', yawn: ym, look: TT < tNgap ? 0.6 : TT > tNgap + 2.5 ? 1 : 0.2, key: 'pelminh' });
  // Lan watches him; her mouth twitches once she has read the word, trembling through the silence
  const tw = TT > tDoc + 0.5 ? 0.06 + 0.09 * (0.5 + 0.5 * Math.sin(TT * 23)) * (0.6 + 0.4 * Math.sin(TT * 7.3)) : 0;
  const lb = Math.sin(TT * TAU * 0.33 + 1) * 4;
  const ltilt = TT > tSil ? Math.sin(TT * 31) * 0.012 : 0;
  bust(PE_LLAN.x, PE_LLAN.y + lb, PE_LLAN.s, { who: 'lan', yawn: tw, look: TT < tDoc ? -1 : TT < tDoc + 0.6 ? 0.3 : 0, tilt: ltilt, mood: TT > tNgap && TT < tNgap + 2.4 ? 'wow' : undefined, key: 'pellan' });
  PE_livingFront();
  PE_phone(pop(tDoc - 0.15, SPRING.smooth), TT > tSil ? Math.sin(TT * 27) * 0.012 : 0);
  // the senses: eye on "thấy", ear on "nghe"
  PE_iconCard('eye', 'thấy', 522, 565, tThay);
  PE_iconCard('ear', 'nghe', 522, 770, tNghe);
  // the hero above Lan: exact at [740,560,70] at the start; looks at Minh; anxious (wow + shiver) at the end
  const anx = TT > tDoc + 0.4;
  const shiver = TT > tSil ? Math.sin(TT * 40) * 2.5 : 0;
  const hl = TT < tNgap ? 0 : anx ? (Math.sin(TT * 5) > 0 ? -1 : 0.6) : -1;
  heroBrain(PE_HERO_LAY[0] + shiver * seg(TT, ET('lay') + 0.6, ET('lay') + 1), PE_HERO_LAY[1], PE_HERO_LAY[2], { warm: heroWarmAt(TT), look: hl, mood: anx || (TT > tNgap && TT < tNgap + 2.4) ? 'wow' : 'calm', yawn: TT > tSil ? 0.06 + 0.06 * Math.abs(Math.sin(TT * 19)) : 0, key: 'hero' });
  viTag('07', TITLES.lay);
};

// ---------------------------------------------------------------------
//  PAYOFF (42.5–47.25, SLAM) — "Khoảng một nửa đến hai phần ba số người sẽ ngáp theo."  Complete on its first frame.
// ---------------------------------------------------------------------
SCENES.payoff = function () {
  const tHalf = VW('payoff', 'một'), tTheo = VW('payoff', 'ngáp');
  PE_livingBack();
  // Minh laughs (bouncing, little open mouth)
  const laugh = 1 - seg(TT, 45.6, 46.6);
  const bnc = Math.abs(Math.sin(TT * TAU * 2.4)) * 7 * laugh;
  bust(PE_LMINH.x, PE_LMINH.y - bnc, PE_LMINH.s, { who: 'minh', yawn: 0.05 + 0.16 * laugh * Math.abs(Math.sin(TT * TAU * 2.4)), look: 1, tilt: 0.04 * Math.sin(TT * TAU * 1.2) * laugh, key: 'pelminh' });
  // Lan: a huge yawn already near full at the SLAM
  const yl = yawnCurve(TT, SLAM - 1.0, 3.2);
  bust(PE_LLAN.x, PE_LLAN.y + Math.sin(TT * TAU * 0.33 + 1) * 4, PE_LLAN.s, { who: 'lan', yawn: yl, look: TT > SLAM + 2.3 ? -1 : 0, key: 'pellan' });
  PE_livingFront();
  PE_phone(1 - EZ.io(seg(TT, SLAM + 0.6, SLAM + 1.6)));
  // the brain above Lan yawns with her; exactly at [740,560,70] all along
  const yb = yawnCurve(TT, SLAM - 0.8, 3.0);
  heroBrain(PE_HERO_LAY[0], PE_HERO_LAY[1], PE_HERO_LAY[2], { warm: heroWarmAt(TT), yawn: yb, mood: TT > SLAM + 2.4 ? 'happy' : 'calm', look: TT > SLAM + 3.2 ? -0.8 * Math.sin(TT * 1.5) : 0, key: 'hero' });
  // tags: "ngáp lây!" from the first frame (a bounce on "ngáp theo"), "1/2 – 2/3 số người" on "một nửa"
  const bump = TT > tTheo ? Math.sin(seg(TT, tTheo, tTheo + 0.5) * Math.PI) * 0.12 : 0;
  tag('ngáp lây!', 320, 480, 84, { rot: -0.05 + 0.02 * Math.sin(TT * 2.2), s: 1 + bump });
  ptag('1/2 – 2/3 số người', 345, 618, tHalf, 54, { rot: 0.03 });
  viTagNow('08', TITLES.payoff);
};

// ---------------------------------------------------------------------
//  END (53.0–60.75) — "Vậy đấy: một cái ngáp là não đang tự hạ nhiệt, và có khi chính bạn vừa ngáp xong."
// ---------------------------------------------------------------------
SCENES.end = function () {
  const E = ET('end'), tTu = VW('end', 'tự'), tBan = VW('end', 'chính'), tNg1 = VW('end', 'ngáp'), tNg2 = VW('end', 'ngáp', 2);
  // the clock is later now (4:40 instead of 3:10), still ticking
  PE_deskBack(4, 40 + Math.floor((TT - E) * 2) * 0.5);
  // Minh starts exactly as in the hook, then makes room for Lan
  const mv = springEase(TT - (E + 0.5), 110, 22);
  const mx = lerp(PE_MINH.x, 360, mv), my = lerp(PE_MINH.y, 1035, mv), ms = lerp(PE_MINH.s, 1.45, mv);
  const lx = lerp(1320, 765, springEase(TT - (E + 0.55), 110, 22));
  const atYou = TT > tBan;
  // Lan (behind Minh's shoulder), yawns on the first "ngáp"
  const yl = yawnCurve(TT, tNg1 - 0.3, 2.6);
  bust(lx, 1040 + Math.sin(TT * TAU * 0.33) * 4, 1.45, { who: 'lan', yawn: yl, look: atYou ? 0 : -0.8, mood: atYou ? 'wow' : undefined, key: 'peelan' });
  const ym = yawnCurve(TT, tNg2 - 0.2, 1.9);
  bust(mx, my + Math.sin(TT * TAU * 0.35) * 4, ms, { who: 'minh', yawn: ym, look: atYou ? 0 : mv * 0.8, mood: atYou ? 'wow' : undefined, key: 'peeminh' });
  PE_deskFront();
  // the hero: [540,560,80] at the start, then above Minh; on "tự hạ nhiệt" it fans itself, happy and cool
  const fan = pop(tTu - 0.1);
  heroBrain(lerp(PE_HERO_HOOK[0], 360, mv), PE_HERO_HOOK[1], PE_HERO_HOOK[2], { warm: heroWarmAt(TT), fan, mood: atYou ? 'wow' : TT > tTu - 0.1 ? 'happy' : 'calm', look: atYou ? 0 : TT < tTu ? 0.6 * Math.sin(TT * 1.7) : 0, yawn: 0.4 * yawnCurve(TT, tNg2 - 0.1, 1.7), key: 'hero' });
  // "bạn?" with a paper arrow coming OUT at the viewer (it widens toward its tip, down-front)
  const ak = pop(tBan + 0.15, SPRING.smooth);
  if (ak > 0.01) {
    const x0 = 612, y0 = 690, x1 = 585, y1 = lerp(y0 + 40, 1120, ak), w0 = 26, w1 = 70 * ak + 26;
    const nx = (y1 - y0), ny = -(x1 - x0), L = Math.hypot(nx, ny), ux = nx / L, uy = ny / L;
    const hy = y1 - 90 * ak, hx = lerp(x0, x1, (hy - y0) / (y1 - y0));
    cut([[x0 - ux * w0 / 2, y0 - uy * w0 / 2], [x0 + ux * w0 / 2, y0 + uy * w0 / 2], [hx + ux * w1 / 2, hy + uy * w1 / 2], [hx + ux * w1, hy + uy * w1], [x1, y1 + 30 * ak], [hx - ux * w1, hy - uy * w1], [hx - ux * w1 / 2, hy - uy * w1 / 2]], PAL.navy, { key: 'pearrow', tear: 0.8, sb: 10 });
  }
  ptag('bạn?', 640, 620, tBan, 72, { rot: 0.05 + 0.03 * Math.sin(TT * 2.5) });
  viCaption(['ngáp = não', 'tự hạ nhiệt'], [1, 'hạ nhiệt'], { at: tTu - E, col: COL.coolL });
  viTag('10', TITLES.end);
};
