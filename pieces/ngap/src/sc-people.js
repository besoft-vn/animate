// =====================================================================
//  sc-people.js — the people scenes (owned by the sc-people agent; prefix PE_).
//  hook   (0–7.75)     desk: Minh with an O₂ 100% mask still yawns; "thiếu ô xi?" crossed out. Brain [540,560,80].
//  lay    (35.5–42.5)  living room: Minh (left) yawns, Lan (right) sees / hears / reads "ngáp"; silence: Lan twitches.
//  payoff (42.5–47.25) SLAM: Lan yawns huge, the brain above her too; "ngáp lây!", "1/2 – 2/3 số người".
//  end    (53.0–end)   the hook's desk again, later on the clock; Minh + Lan; the brain fans itself; "bạn?" to the viewer.
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
  cut(ellipsePts(960, 736, 26, 14, 0, 14), PAL.yellow, { key: 'pelbulb', sb: 4, grain: false });
  cut(ellipsePts(990, PE_DESK_Y - 8, 60, 16, 0, 22), PAL.charcoal, { key: 'pelbase', sb: 5 });
}
function PE_deskFront(mugX = 885) {
  cut(rect(-40, PE_DESK_Y, W + 80, 900, 6), PAL.wood, { key: 'pedesk', tear: 0.6, sy: -6, pat: pat.grainWood('rgba(120,70,30,0.18)') });
  cut(rect(-40, PE_DESK_Y - 6, W + 80, 26, 6), PAL.woodL, { key: 'pedeskedge', tear: 0.5, sb: 6, sy: 4 });
  cut(rect(150, 1215, 780, 230, 14), PAL.woodL, { key: 'pedrawer', sb: 6, sy: 3, grain: 0.3 });
  cut(capsulePts(490, 1250, 590, 1250, 22, 6), PAL.woodD, { key: 'peknob', sb: 4 });
  mug(mugX, PE_DESK_Y - 92, 0.95, PAL.yellow, 'pemug');
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
// the tank label "O₂ 100%" (subscript drawn by hand: the font has no ₂)
function PE_o2tag(x, y, k) {
  if (k <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.05); ctx.scale(k, k);
  const w1 = handW('O', 56), w2 = handW('2', 36), w3 = handW(' 100%', 56), w = w1 + w2 + w3 + 50;
  cut(rect(-w / 2, -42, w, 84, 3), PAL.paper, { key: 'peo2', tear: 1.6 });
  let xx = -w / 2 + 25;
  handText('O', xx, 20, 56, PAL.ink, { key: 'peo2a' }); xx += w1;
  handText('2', xx, 32, 36, PAL.ink, { key: 'peo2b' }); xx += w2;
  handText(' 100%', xx, 20, 56, PAL.ink, { key: 'peo2c' });
  ctx.restore();
}
// the clear mask (over nose + mouth) at (mx, my), rotated a; tube from the valve
function PE_mask(mx, my, a, valve, strap, ears = null, stretch = 0) {
  const [vx, vy] = valve;
  // the tube: a soft sag from the valve up to the mask's bottom
  const ex = mx + Math.sin(a) * 40, ey = my + Math.cos(a) * 42;
  const P = []; for (let i = 0; i <= 20; i++) { const u = i / 20, cx = lerp(vx, ex, 0.45), cy = Math.max(vy, ey) + 110; const x = (1 - u) ** 2 * vx + 2 * u * (1 - u) * cx + u * u * ex, y = (1 - u) ** 2 * vy + 2 * u * (1 - u) * cy + u * u * ey; P.push([x, y]); }
  ink(P, { w: 13, color: '#9aa9ae', amt: 0.4, key: 'petube' });
  ink(P, { w: 5, color: 'rgba(255,255,255,0.55)', amt: 0.4, key: 'petubeh' });
  if (strap > 0.01) {
    ctx.save(); ctx.globalAlpha = clamp(strap);
    const eL = ears ? ears[0] : [PE_MINH.x - 118, PE_MINH.y - 190], eR = ears ? ears[1] : [PE_MINH.x + 118, PE_MINH.y - 190];
    ink([[mx - 52, my - 14], eL], { w: 5, color: '#7f8f95', amt: 0.3, key: 'pestl' });
    ink([[mx + 52, my - 14], eR], { w: 5, color: '#7f8f95', amt: 0.3, key: 'pestr' });
    ctx.restore();
  }
  ctx.save(); ctx.translate(mx, my); ctx.rotate(a);
  const M = ellipsePts(0, 0, 58 + 6 * stretch, 44 + 16 * stretch, 0, 30);
  trace(M, true); ctx.fillStyle = 'rgba(236,246,248,0.42)'; ctx.fill();
  ctx.strokeStyle = '#7f9aa5'; ctx.lineWidth = 5; ctx.lineJoin = 'round'; trace(M, true); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-14, -10, 26, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
  cut(rect(-14, 36 + 16 * stretch, 28, 18, 4), '#b8c4c8', { key: 'pemaskv', sb: 3, grain: false });
  ctx.restore();
}

// ---------------------------------------------------------------------
//  HOOK (0–7.75) — "Ngáp không phải vì thiếu ô xi: cho thở ô xi tinh khiết, người ta vẫn ngáp như thường."
// ---------------------------------------------------------------------
SCENES.hook = function () {
  const tO = VW('hook', 'ô'), tCho = VW('hook', 'cho'), tTho = VW('hook', 'thở'), tO2 = VW('hook', 'ô', 2);
  const tVan = VW('hook', 'vẫn');
  const yT0 = tVan - 0.35, yawnM = yawnCurve(TT, yT0, 2.0);   // open 6.0–6.9, hold to 7.4, close by 8.0
  PE_deskBack(3, 8 + Math.floor(TT * 2) * 0.5);
  // the tank comes up from behind the desk on "cho"
  const tk = pop(tCho, SPRING.smooth);
  const valve = PE_tank(175, tk);
  // Minh: breathes; looks at the tag, then drowsy with the mask, then yawns anyway
  const breath = Math.sin(TT * TAU * 0.35) * 5;
  const look = TT < tO ? 0.3 * Math.sin(TT * 1.6) : TT < tTho ? -0.8 : 0;
  const mood = TT > tO2 + 0.4 && TT < yT0 ? 'sleepy' : undefined;
  bust(PE_MINH.x, PE_MINH.y + breath, PE_MINH.s, { who: 'minh', yawn: yawnM, look, mood, key: 'peminh' });
  // the mask: from the tank to the face (on "thở") and it STAYS ON — the yawn happens behind the clear plastic.
  // It follows the head's tip-back (bust rotates the head by -0.1·yawn about the neck) and stretches with the jaw.
  if (tk > 0.02) {
    const mk = TT < tTho - 0.6 ? 0 : springEase(TT - (tTho - 0.6), 150, 24);
    const piv = [PE_MINH.x, PE_MINH.y + breath - 30 * PE_MINH.s], ang = -0.1 * yawnM;
    const rp = (x, y) => { const c = Math.cos(ang), si = Math.sin(ang), dx = x - piv[0], dy = y - piv[1]; return [piv[0] + dx * c - dy * si, piv[1] + dx * si + dy * c]; };
    const [fx, fy] = rp(PE_MINH.x, PE_MINH.y - 130 + breath + 14 * yawnM);   // over nose + mouth, below the eyes
    const ears = [rp(PE_MINH.x - 118, PE_MINH.y - 190 + breath), rp(PE_MINH.x + 118, PE_MINH.y - 190 + breath)];
    const mx = lerp(valve[0] + 40, fx, mk), my = lerp(valve[1] + 30, fy, mk);
    PE_mask(mx, my, lerp(-0.4, 0, mk) + ang, valve, clamp((mk - 0.85) / 0.15), ears, yawnM);
  }
  PE_deskFront();
  // tank label (≥ 50 px) — in front of the desk edge
  PE_o2tag(200, 1010, pop(tO2));
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
  // window (upper right, clear of the tags on the left and of the brain above Lan)
  cut(rect(866, 380, 230, 250, 6), PAL.paper, { key: 'pewin', sb: 8 });
  ctx.save(); trace(rect(884, 398, 200, 214, 3), true); ctx.clip();
  ctx.fillStyle = PAL.sky; ctx.fillRect(876, 390, 220, 230);
  const cx = 840 + mod(TT * 22, 280);
  cut(ellipsePts(cx, 480, 46, 20, 0, 18), PAL.paper, { key: 'pecl1', shadow: false, grain: false });
  cut(ellipsePts(cx + 30, 467, 30, 18, 0, 16), PAL.paper, { key: 'pecl2', shadow: false, grain: false });
  ctx.restore();
  ink([[984, 398], [984, 612]], { w: 8, color: PAL.paper, amt: 0.2, key: 'pewb1' });
  ink([[884, 505], [1084, 505]], { w: 8, color: PAL.paper, amt: 0.2, key: 'pewb2' });
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
  hand(726, 1172 + dy, 0.72, -2.55, PE_LLAN_SKIN, PAL.mustard, { key: 'pephh' });   // forearm from her side, palm under the phone
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
  ctx.save(); ctx.translate(x, y); ctx.rotate(kind === 'ear' ? 0.05 : -0.05); ctx.scale(s * 0.86, s * 0.86);
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
  } else if (kind === 'book') {
    const fl = Math.sin(TT * 4) * 4;
    cut([[0, -6], [-58, -14], [-58, -58 + fl], [0, -50]], PAL.paper, { key: 'pebk1', sb: 4, grain: false, line: PAL.ink, lw: 4 });
    cut([[0, -6], [58, -14], [58, -58 - fl], [0, -50]], PAL.paper, { key: 'pebk2', sb: 4, grain: false, line: PAL.ink, lw: 4 });
    for (let i = 0; i < 3; i++) { ink([[-48, -46 + i * 11], [-10, -42 + i * 11]], { w: 3, color: COL.textD, amt: 0.2, key: 'pebl' + i }); ink([[10, -42 + i * 11], [48, -46 + i * 11]], { w: 3, color: COL.textD, amt: 0.2, key: 'pebr' + i }); }
  } else {
    cut(ellipsePts(0, -26, 30, 42, 0, 22), PAL.skin1, { key: 'peear', sb: 4, grain: false });
    ink(arcPts(2, -28, 16, Math.PI * 0.6, Math.PI * 1.9, 10), { w: 5, color: '#a96f4f', amt: 0.2, key: 'peeari' });
    for (let i = 0; i < 2; i++) { const r = 50 + i * 16 + mod(TT * 30, 16); ctx.save(); ctx.globalAlpha = 0.8 - i * 0.3; ink(arcPts(-20, -26, r, Math.PI * 0.75, Math.PI * 1.25, 8), { w: 5, color: COL.textD, amt: 0.2, key: 'peeaw' + i }); ctx.restore(); }
  }
  vtext(word, 0, 64, 60, { col: COL.text });
  ctx.restore();
}

// a held yawn: opens t0→t1, held wide t1→t2, closes t2→t3
function PE_yawnHold(t, t0, t1, t2, t3) {
  if (t <= t0 || t >= t3) return 0;
  if (t < t1) return EZ.io(seg(t, t0, t1));
  if (t < t2) return 1;
  return 1 - EZ.io(seg(t, t2, t3));
}
// Minh's arms stretching up behind his shoulders (k 0..1), drawn BEFORE the bust so they come out from behind it
function PE_stretch(x, y, k) {
  if (k <= 0.02) return;
  const s = 1.1, L = 200 * s;
  for (const sd of [-1, 1]) {
    const a = -Math.PI / 2 + sd * 0.42, sx = x + sd * 120, sy = y + 20;
    hand(sx + Math.cos(a) * L * k, sy + Math.sin(a) * L * k, s, a, PAL.skin1, PAL.blue, { key: 'pestr' + sd });
  }
}

// ---------------------------------------------------------------------
//  LAY (35.5–42.5) — "Lạ nhất là ngáp lây: chỉ cần thấy, nghe, thậm chí đọc chữ ngáp..."  (silence 41.75–42.375)
// ---------------------------------------------------------------------
SCENES.lay = function () {
  const tNgap = VW('lay', 'ngáp'), tThay = VW('lay', 'thấy'), tNghe = VW('lay', 'nghe'), tDoc = VW('lay', 'đọc');
  const tSil = VL('lay').t1;
  PE_livingBack();
  // Minh yawns BIG on "ngáp lây": open by ~37.2, held wide (≥ 0.9) to ~39.3, closes; arms stretch up meanwhile
  const ym = PE_yawnHold(TT, tNgap - 0.3, tNgap + 0.4, tNgap + 2.5, tNgap + 3.0);
  const mb = Math.sin(TT * TAU * 0.4) * 4;
  const st = EZ.io(seg(TT, tNgap, tNgap + 0.6)) * (1 - EZ.io(seg(TT, tNgap + 1.7, tNgap + 2.2)));
  PE_stretch(PE_LMINH.x, PE_LMINH.y + mb, st);
  bust(PE_LMINH.x, PE_LMINH.y + mb, PE_LMINH.s, { who: 'minh', yawn: ym, look: TT < tNgap ? 0.6 : TT > tNgap + 2.5 ? 1 : 0.2, key: 'pelminh' });
  // Lan watches him; her mouth twitches once she has read the word, trembling through the silence
  const tw = TT > tDoc + 0.5 ? 0.06 + 0.09 * (0.5 + 0.5 * Math.sin(TT * 23)) * (0.6 + 0.4 * Math.sin(TT * 7.3)) : 0;
  const lb = Math.sin(TT * TAU * 0.33 + 1) * 4;
  const ltilt = TT > tSil ? Math.sin(TT * 31) * 0.012 : 0;
  bust(PE_LLAN.x, PE_LLAN.y + lb, PE_LLAN.s, { who: 'lan', yawn: tw, look: TT < tDoc ? -1 : TT < tDoc + 0.6 ? -0.3 : -0.1, tilt: ltilt, mood: TT > tNgap && TT < tNgap + 2.4 ? 'wow' : undefined, key: 'pellan' });
  PE_phone(pop(tDoc - 0.15, SPRING.smooth), TT > tSil ? Math.sin(TT * 27) * 0.012 : 0);
  PE_livingFront();
  // the senses: eye on "thấy", ear on "nghe", book on "đọc"
  PE_iconCard('eye', 'thấy', 520, 498, tThay);
  PE_iconCard('ear', 'nghe', 520, 655, tNghe);
  PE_iconCard('book', 'đọc', 520, 812, tDoc);
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
  bust(PE_LMINH.x, PE_LMINH.y - bnc, PE_LMINH.s, { who: 'minh', yawn: 0, look: 1, tilt: 0.04 * Math.sin(TT * TAU * 1.2) * laugh, key: 'pelminh' });
  // Lan: a huge yawn already near full at the SLAM
  const yl = yawnCurve(TT, SLAM - 1.0, 3.2);
  bust(PE_LLAN.x, PE_LLAN.y + Math.sin(TT * TAU * 0.33 + 1) * 4, PE_LLAN.s, { who: 'lan', yawn: yl, look: TT > SLAM + 2.3 ? -1 : 0, key: 'pellan' });
  PE_phone(1 - EZ.io(seg(TT, SLAM + 0.6, SLAM + 1.6)));
  PE_livingFront();
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
//  END (53.0–end) — "Vậy đấy: có lẽ ngáp là não đang tự hạ nhiệt, và có khi chính bạn vừa ngáp xong."
// ---------------------------------------------------------------------
SCENES.end = function () {
  const E = ET('end'), tLe = VW('end', 'lẽ'), tTu = VW('end', 'tự'), tBan = VW('end', 'chính'), tNg1 = VW('end', 'ngáp'), tNg2 = VW('end', 'ngáp', 2);
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
  PE_deskFront(165);
  // the hero: [540,560,80] at the start, then above Minh; on "tự hạ nhiệt" it fans itself, happy and cool
  const fan = pop(tTu - 0.1);
  heroBrain(lerp(PE_HERO_HOOK[0], 360, mv), PE_HERO_HOOK[1], PE_HERO_HOOK[2], { warm: heroWarmAt(TT), fan, mood: atYou ? 'wow' : TT > tTu - 0.1 ? 'happy' : 'calm', look: atYou ? 0 : TT < tTu ? 0.6 * Math.sin(TT * 1.7) : 0, yawn: 0.4 * yawnCurve(TT, tNg2 - 0.1, 1.7), key: 'hero' });
  // "giả thuyết" beside the brain on "có lẽ"; "bạn?" between the heads (no face covered) on "chính"
  ptag('giả thuyết', 215, 668, tLe, 52, { rot: -0.04 });
  ptag('còn bạn?', 540, 1150, tBan, 72, { rot: 0.05 + 0.03 * Math.sin(TT * 2.5) });
  viCaption(['ngáp: não tự', 'hạ nhiệt?'], [1, 'hạ nhiệt?'], { at: tTu - E, col: COL.coolL });
  viTag('10', TITLES.end);
};
