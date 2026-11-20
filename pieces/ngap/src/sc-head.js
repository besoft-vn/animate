// =====================================================================
//  sc-head.js — the cut-away PROFILE head (facing RIGHT) with the brain hero in its skull (owned by the sc-head agent).
//  Eras: warm (giả thuyết: não tự làm mát) · jaw (há hàm -> máu chảy qua đầu) · air (hít khí mát, hút nhiệt của máu) ·
//  cool (máu mát hơn lên não, như nước làm mát động cơ). All four are ONE picture (HD_head) with different states, on the
//  same soft teal-cream wall, so the morph bridges inside this block read as one place. The hero stays at
//  [470, 640, 130] the whole time (BR.hookWarm.b ... BR.coolSeason.a).
//  Geometry: nose -> +x (~800, 800); mouth line from the jaw hinge (455, 868) to the lips (~740, 880); the lower jaw
//  rotates CLOCKWISE about the hinge (= opens DOWN / right). Blood: neck (452, 1215) -> up behind the jaw, past the back
//  of the mouth -> underside of the brain (472, 738); dashes move along it neck -> brain (UP). Air: from the right edge
//  (x 930) pointing LEFT into the open mouth. Heat wisps: from the vessel into the air stream.
// =====================================================================
const HD_WALL = '#cfe6df';
const HD_SKIN = PAL.skin1, HD_SKIN_D = '#dda784', HD_HAIR = '#2b211d', HD_SHIRT = PAL.tweed;
const HD_HINGE = [455, 868];
const HD_JAW_ANG = 0.42;                      // jaw = 1 -> 0.42 rad clockwise (≈ 24°)
const HD_JMAX = 1.08;                         // a bit wider on the deep breath ("hít")
const HD_HERO = [470, 640, 130];
// the vessel (neck -> brain underside)
const HD_VES = [[440, 1215], [438, 1100], [430, 1000], [423, 920], [421, 860], [428, 800], [447, 760], [468, 738]];
const HD_VES_R = resample(HD_VES, false, 6);

// rotate points about the jaw hinge by the jaw opening
const HD_rotJ = (P, jaw) => rot(P, HD_HINGE[0], HD_HINGE[1], HD_JAW_ANG * jaw);

// a label on a soft cream pill (Pangolin), springing in at t0; al fades it
function HD_label(str, x, y, t0, col, size = 56, al = 1) {
  const a = clamp(pop(t0, SPRING.smooth)) * clamp(al); if (a <= 0.001) return;
  const dy = (1 - clamp(pop(t0, SPRING.smooth))) * 14;
  ctx.save(); ctx.font = `400 ${size}px ${VFONT}`; const w = ctx.measureText(str).width; ctx.restore();
  ctx.save(); ctx.globalAlpha = a;
  ctx.shadowColor = 'rgba(35,20,10,0.18)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
  trace(rrectPts(x - w / 2 - 18, y - size * 0.86 + dy, w + 36, size * 1.14, size * 0.32, 4), true); ctx.fillStyle = '#fbf6ea'; ctx.fill();
  ctx.restore();
  vtext(str, x, y + dy, size, { col, al: a });
}

// phase of the blood dashes (cycles along the vessel), continuous over all four eras
function HD_bloodPhase(t) {
  const tD = VW('jaw', 'đẩy'), tM = VW('jaw', 'máu');
  return 0.2 * Math.max(0, t - tD) + 0.28 * Math.max(0, t - tM);
}

// ---------------------------------------------------------------------
//  THE HEAD. o: jaw 0..1.08, blood 0..1 (vessel drawn from the neck up), bw (vessel width), air 0..1 (blue arrows),
//  airAl, heatX 0..1 (orange wisps), cooled 0..1 (blue tint in the upper dashes), therm (thermometer level),
//  thermCool 0..1 (orange -> blue), arcs 0..1 (stretch arcs on the cheek)
// ---------------------------------------------------------------------
function HD_head(o) {
  const jaw = o.jaw ?? 0;
  // wall (full-bleed, flat)
  cut(rect(-40, -40, W + 80, H + 80, 0), HD_WALL, { key: 'hdwall', shadow: false, tear: 0, grain: 0.4 });
  // thermometer (left)
  thermo(150, 1010, 300, o.therm ?? 0.4, { col: mixHex(COL.heat, COL.cool, clamp(o.thermCool ?? 0)), key: 'hdth' });
  // shoulders (a paper bust) + neck
  cut(rrectPts(215, 1140, 480, 150, 70), HD_SHIRT, { key: 'hdsh', tear: 0.8 });
  cut([[340, 900], [530, 950], [548, 1170], [352, 1170]], HD_SKIN_D, { key: 'hdnk', sb: 6, sy: 3 });
  // mouth cavity (shows between the lips when the jaw drops)
  if (jaw > 0.02) {
    const C = [[HD_HINGE[0] + 10, HD_HINGE[1]], [600, 874], [745, 878], ...HD_rotJ([[744, 880], [600, 872], [470, 868]], jaw)];
    cut(C, COL.mouth, { key: 'hdcav', shadow: false, tear: 0.3, grain: false });
  }
  // upper head (cranium + face, profile facing right)
  const U = [[300, 955], [252, 830], [232, 700], [248, 565], [305, 470], [400, 418], [510, 402], [620, 428], [700, 488], [746, 568],
    [754, 648], [738, 690], [758, 740], [800, 800], [776, 826], [748, 834], [752, 860], [744, 878], [600, 876], [HD_HINGE[0] + 5, HD_HINGE[1] - 4], [400, 905]];
  cut(U, HD_SKIN, { key: 'hdhead', sb: 14, sy: 8 });
  // hair cap over the back/top
  cut([[236, 700], [244, 572], [300, 474], [398, 420], [510, 404], [618, 430], [690, 482], [650, 500], [540, 480], [400, 500], [300, 590], [266, 700]], HD_HAIR, { key: 'hdhair', sb: 4, sy: 3, tear: 1.2 });
  // lower jaw (rotates about the hinge; drawn over the upper face so a closed jaw is one continuous profile)
  const J = [[HD_HINGE[0] - 5, HD_HINGE[1] - 2], [600, 868], [728, 872], [744, 886], [745, 908], [738, 948], [712, 980], [650, 994], [570, 990], [490, 958], [446, 912]];
  ctx.save(); ctx.translate(HD_HINGE[0], HD_HINGE[1]); ctx.rotate(HD_JAW_ANG * jaw); ctx.translate(-HD_HINGE[0], -HD_HINGE[1]);
  if (jaw > 0.05) { ctx.fillStyle = COL.tongue; ctx.beginPath(); ctx.ellipse(615, 872, 80, 13, 0.02, 0, TAU); ctx.fill(); }
  cut(J, HD_SKIN, { key: 'hdjaw', sb: lerp(0, 8, clamp(jaw * 3)), sy: lerp(0, 5, clamp(jaw * 3)), sx: lerp(0, 3, clamp(jaw * 3)) });
  ink([[728, 886], [744, 890], [743, 910]], { w: 5, color: '#c98466', amt: 0.3, key: 'hdll' });    // lower lip
  // stretch arcs on the cheek (the face muscles pull)
  const ar = clamp(o.arcs ?? 0);
  if (ar > 0.01) {
    const sh = Math.sin(TT * 14) * 2 * ar;
    for (let i = 0; i < 3; i++) {
      const k = clamp(ar * 3 - i); if (k <= 0) continue;
      const cx = 585 + i * 42, cy = 945 + i * 8;
      ctx.save(); ctx.globalAlpha = k;
      ink(arcPts(cx + sh, cy, 26, -0.9, 0.9, 10), { w: 5, color: '#9a5a40', amt: 0.3, key: 'hdarc' + i });
      ctx.restore();
    }
  }
  ctx.restore();
  // the cut-away skull: bone ring + light window around the brain
  cut(ellipsePts(470, 636, 206, 168, 0, 48), '#eadcc0', { key: 'hdbone', sb: 6, sy: 3, tear: 1.4 });
  cut(ellipsePts(470, 636, 188, 152, 0, 48), '#fdf7ea', { key: 'hdwin', shadow: false, tear: 1.0, grain: 0.3 });
  // ear
  cut(ellipsePts(368, 838, 30, 46, -0.1, 18), HD_SKIN_D, { key: 'hdear', sb: 4, sy: 3 });
  ink(arcPts(372, 838, 17, Math.PI * 0.6, Math.PI * 1.5, 8), { w: 4, color: '#a8664a', amt: 0.3, key: 'hdear2' });
  // eye + brow (squeezed shut while the jaw is wide open)
  const I = PAL.ink;
  if (jaw > 0.55) ink(arcPts(704, 690, 14, Math.PI * 1.1, Math.PI * 1.9, 8), { w: 5, color: I, amt: 0.2, key: 'hdeyc' });
  else if (mod(TT, 3.4) < 0.1) ink([[692, 688], [716, 688]], { w: 5, color: I, amt: 0.2, key: 'hdeyb' });
  else { dot(706, 688, 8, I); dot(709, 685, 2.6, '#fff'); }
  ink(arcPts(704, 676 - 6 * clamp(jaw), 24, Math.PI * 1.15, Math.PI * 1.8, 8), { w: 5, color: HD_HAIR, amt: 0.2, key: 'hdbrow' });
  ink([[748, 836], [752, 860], [742, 876]], { w: 5, color: '#c98466', amt: 0.3, key: 'hdul' });    // upper lip
  if (jaw < 0.12) { ctx.save(); ctx.globalAlpha = 1 - jaw / 0.12; ink([[690, 877], [718, 879], [744, 878]], { w: 4, color: '#9a5a40', amt: 0.2, key: 'hdml' }); ctx.restore(); }   // closed mouth line
  ink([[770, 806], [784, 812]], { w: 4, color: '#b07050', amt: 0.2, key: 'hdnos' });               // nostril
  ctx.fillStyle = 'rgba(240,110,120,0.30)'; ctx.beginPath(); ctx.ellipse(670, 770, 26, 15, 0, 0, TAU); ctx.fill();

  // ---- the blood vessel (neck -> brain), drawn on from the neck
  const bp = clamp(o.blood ?? 0);
  if (bp > 0.01) {
    const P = subPath(HD_VES_R, bp), bw = o.bw ?? 34;
    ink(P, { w: bw + 8, color: '#7e1f2a', amt: 0.6, key: 'hdves0' });
    ink(P, { w: bw, color: COL.blood, amt: 0.6, key: 'hdves1' });
    // dashes flowing UP (neck -> brain)
    const ph = HD_bloodPhase(TT), N = 7, cooled = clamp(o.cooled ?? 0);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(8, bw * 0.34);
    for (let k = 0; k < N; k++) {
      const f = mod(k / N + ph, 1), f2 = f + 0.045;
      if (f2 > bp - 0.01 || f < 0.01) continue;
      const a = pointAt(HD_VES_R, f), b = pointAt(HD_VES_R, f2);
      const tint = cooled * EZ.io(seg(f, 0.3, 0.75));
      ctx.strokeStyle = tint > 0.01 ? mixHex(COL.bloodL, COL.cool, 0.85 * tint) : COL.bloodL;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    ctx.restore();
  }
  // ---- the breathed-in air: 3 blue wave arrows from the right, pointing LEFT into the mouth
  const air = clamp(o.air ?? 0), aal = clamp(o.airAl ?? 1);
  if (air > 0.01 && aal > 0.01) {
    for (let i = 0; i < 3; i++) {
      const y0 = 868 + i * 46, y1 = 885 + i * 13;
      waveArrow(930, y0, 585 + i * 8, y1 + (jaw - 1) * 6, { col: COL.cool, part: clamp(air * 1.25 - i * 0.12), w: 9, amp: 7, head: 22, ph: i * 1.3, al: aal, key: 'hdair' + i });
    }
  }
  // ---- heat leaving the blood INTO the air: 3 small orange wave arrows from the vessel (x ≈ 445) to the air heads
  const hx = clamp(o.heatX ?? 0);
  if (hx > 0.01) {
    for (let i = 0; i < 3; i++) {
      const y0 = 852 + i * 34, y1 = 862 + i * 22;
      waveArrow(450, y0, 548, y1, { col: COL.heat, part: clamp(hx * 1.3 - i * 0.15), w: 7, amp: 5, head: 15, ph: i * 1.7, al: hx, key: 'hdhx' + i });
    }
  }
}

// the hero, always at [470, 640, 130]
function HD_hero(o = {}) {
  const w = heroWarmAt(TT);
  const mood = w > 0.55 ? 'hot' : (TT > VW('cool', 'lên') ? 'happy' : 'calm');
  heroBrain(HD_HERO[0], HD_HERO[1], HD_HERO[2], { warm: w, mood, key: 'hero', look: o.look ?? 0 });
}

// the engine + radiator inset card (cool, on "như nước làm mát")
function HD_engineCard(t0) {
  const s = pop(t0); if (s <= 0.01) return;
  const cx = 840, cy = 450;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(0.03); ctx.scale(s, s); ctx.translate(-cx, -cy);
  cut(rect(742, 350, 196, 198, 6), '#fbf6ea', { key: 'hdcard', tear: 1.2 });
  cut(rect(808, 336, 60, 26, 2), 'rgba(240,230,190,0.8)', { key: 'hdcardtape', shadow: false, grain: 0.3, shade: false });
  // engine block (grey) with 2 cylinders
  cut(rect(756, 400, 66, 62, 8), PAL.grey, { key: 'hdeng', sb: 4, sy: 3 });
  for (let i = 0; i < 2; i++) cut(rect(764 + i * 28, 382, 20, 22, 4), PAL.charcoal, { key: 'hdcyl' + i, sb: 3, sy: 2 });
  // radiator (grill)
  cut(rect(874, 388, 50, 82, 4), '#c9ccd2', { key: 'hdrad', sb: 4, sy: 3, pat: pat.stripes('rgba(74,69,80,0.45)', 3, 10, 0) });
  // the coolant loop: blue arrows engine -> radiator (top) and back (bottom), moving
  const k = clamp(seg(TT, t0 + 0.2, t0 + 0.9));
  if (k > 0) {
    simpleArrow(828, 408, 866, 408, { col: COL.cool, w: 6, head: 12, part: k, key: 'hdcl1' });
    simpleArrow(866, 452, 828, 452, { col: COL.cool, w: 6, head: 12, part: k, key: 'hdcl2' });
    const u = mod(TT * 0.9, 1);
    dot(lerp(828, 866, u), 408, 5, COL.coolD); dot(lerp(866, 828, u), 452, 5, COL.coolD);
  }
  vtext('làm mát', 840, 528, 50, { col: COL.coolD });
  ctx.restore();
}

// ---------------------------------------------------------------------
//  WARM (7.75–12.5) — "Giả thuyết mạnh nhất hiện nay: ngáp là cách bộ não tự làm mát."
//  the brain flushes (heroWarmAt), the thermometer rises orange; tag "giả thuyết"; on "làm mát" a blue "?".
// ---------------------------------------------------------------------
SCENES.warm = function () {
  const t0 = ET('warm'), tG = VW('warm', 'giả'), tL = VW('warm', 'làm');
  const therm = lerp(0.35, 0.82, EZ.io(seg(TT, t0 + 0.4, t0 + 2.2))) + 0.015 * Math.sin(TT * 3);
  HD_head({ jaw: 0, therm });
  HD_hero();
  ptag('giả thuyết', 762, 470, tG, 54, { rot: 0.04 });
  const q = pop(tL); if (q > 0.01) {
    ctx.save(); ctx.translate(875, 640); ctx.scale(q, q); ctx.rotate(0.12 + Math.sin(TT * 3) * 0.06);
    vtext('?', 0, 0, 110, { col: COL.cool }); ctx.restore();
  }
  viTag('02', TITLES.warm);
  viCaption(['ngáp = làm mát', 'bộ não?'], [0, 'làm mát'], { at: VW('warm', 'ngáp') - t0, col: COL.coolL });
};

// ---------------------------------------------------------------------
//  JAW (12.5–18.25) — "Hàm há thật rộng, cơ mặt căng ra, đẩy thêm máu chảy qua đầu."
//  "há": the jaw swings DOWN open (spring) · "cơ mặt căng": stretch arcs · "đẩy": the red vessel draws on from the neck
//  up · "máu": it thickens, the dashes speed up, label "máu".
// ---------------------------------------------------------------------
SCENES.jaw = function () {
  const t0 = ET('jaw'), tH = VW('jaw', 'há'), tC = VW('jaw', 'cơ'), tD = VW('jaw', 'đẩy'), tM = VW('jaw', 'máu');
  const jaw = springEase(TT - tH, 90, 13);
  const arcs = clamp(seg(TT, tC, tC + 1.2));
  const blood = EZ.io(seg(TT, tD, tD + 1.0));
  const bw = 30 + 8 * EZ.io(seg(TT, tM, tM + 0.6));
  const fade = 1 - ev(t0 + 0.5, 0.4);                      // the warm era's tag/? leave after the bridge
  HD_head({ jaw, arcs, blood, bw, therm: 0.82 + 0.015 * Math.sin(TT * 3) });
  HD_hero();
  if (fade > 0.01) {
    ctx.save(); ctx.globalAlpha = fade;
    tag('giả thuyết', 762, 470, 54, { rot: 0.04 });
    ctx.save(); ctx.translate(875, 640); ctx.rotate(0.12 + Math.sin(TT * 3) * 0.06); vtext('?', 0, 0, 110, { col: COL.cool }); ctx.restore();
    ctx.restore();
  }
  HD_label('máu', 245, 1090, tM - 0.1, COL.blood, 62);
  if (TT > tM - 0.1) simpleArrow(300, 1070, 405, 1045, { col: COL.blood, w: 5, head: 16, part: ev(tM, 0.4), key: 'hdmauar' });
  viTag('03', TITLES.jaw);
  viCaption(['há hàm:', 'nhiều máu qua đầu'], [1, 'máu'], { at: 0.6, col: COL.bloodL });
};

// ---------------------------------------------------------------------
//  AIR (18.25–23.5) — "Một hơi hít sâu kéo khí mát vào miệng, hút bớt nhiệt của dòng máu."
//  "hít": 3 blue arrows flow in from the right INTO the mouth (jaw opens a hair more) · label "khí mát" ·
//  "hút": orange wisps leave the vessel into the air stream · label "nhiệt". The brain is still warm.
// ---------------------------------------------------------------------
SCENES.air = function () {
  const tH = VW('air', 'hít'), tK = VW('air', 'khí'), tU = VW('air', 'hút');
  const jaw = 1 + (HD_JMAX - 1) * EZ.io(seg(TT, tH, tH + 0.8));
  const air = EZ.o2(seg(TT, tH, tH + 0.9));
  const heatX = EZ.io(seg(TT, tU, tU + 0.6));
  HD_head({ jaw, blood: 1, bw: 38, air, heatX, therm: 0.82 + 0.015 * Math.sin(TT * 3) });
  HD_hero();
  HD_label('máu', 245, 1090, -1, COL.blood, 62);
  simpleArrow(300, 1070, 405, 1045, { col: COL.blood, w: 5, head: 16, key: 'hdmauar' });
  HD_label('khí mát', 830, 1100, Math.min(tK, tH + 0.6), COL.coolD, 58);
  HD_label('nhiệt', 600, 800, tU + 0.2, COL.heatD, 56);
  viTag('04', TITLES.air);
  viCaption(['hít khí mát vào', 'hút bớt nhiệt'], [0, 'khí mát'], { at: 0.6, col: COL.coolL });
};

// ---------------------------------------------------------------------
//  COOL (23.5–29.0) — "Máu mát hơn chảy lên não, như nước làm mát chảy qua động cơ."
//  the jaw closes slowly, the air/heat fade; the rising dashes turn blue-tinted near the top; "lên": the brain cools
//  (heroWarmAt) and smiles, the thermometer falls and turns blue; "như": the engine + radiator inset card.
// ---------------------------------------------------------------------
SCENES.cool = function () {
  const t0 = ET('cool'), tL = VW('cool', 'lên'), tN = VW('cool', 'như');
  const jaw = HD_JMAX * (1 - EZ.io(seg(TT, t0 + 0.55, t0 + 3.2)));
  const out = 1 - EZ.io(seg(TT, t0 + 0.55, t0 + 1.6));
  const cooled = EZ.io(seg(TT, t0 + 0.5, tL + 0.4));
  const tc = EZ.io(seg(TT, tL, tL + 1.2));
  HD_head({ jaw, blood: 1, bw: 38, air: 1, airAl: out, heatX: out, cooled, therm: lerp(0.82, 0.3, tc) + 0.015 * Math.sin(TT * 3), thermCool: tc });
  HD_hero();
  HD_label('máu', 245, 1090, -1, COL.blood, 62);
  simpleArrow(300, 1070, 405, 1045, { col: COL.blood, w: 5, head: 16, key: 'hdmauar' });
  if (out > 0.01) { HD_label('khí mát', 830, 1100, -1, COL.coolD, 58, out); HD_label('nhiệt', 600, 800, -1, COL.heatD, 56, out); }
  HD_engineCard(tN);
  viTag('05', TITLES.cool);
  viCaption(['máu mát hơn', 'lên não'], [0, 'mát hơn'], { at: 0.6, col: COL.coolL });
};
