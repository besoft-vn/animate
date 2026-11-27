// =====================================================================
//  SC-WORLD — hook (back view: the hero walks toward the rainbow's foot; the whole bow slides away with it, because
//  it is centred on the shadow of the hero's head), setup (side view: low sun BEHIND, rain IN FRONT), white (the white
//  sunbeam under a magnifier opens into the colours of light), end (back view again: two people, two rainbows, each
//  centred on its own head's shadow: "của riêng bạn").
//  Colour: TERRACOTTA = hero · SPEC = colours of light · COL.sun/beam = sunlight · COL.drop = water · graphite = the
//  rest (ground, shadows, pot, friend, guide lines). RAINBOW: red outside (rainbowArc does it).
// =====================================================================
// a label written on at t0 (over d), faded out over [t1 - 0.3, t1]
function w_label(str, x, y, size, t0, t1, o = {}) {
  const f = t1 == null ? 1 : 1 - seg(TT, t1 - 0.3, t1); if (TT < t0 || f <= 0) return;
  alphaDo(f * (o.a ?? 1), () => label(str, x, y, size, { reveal: ev(t0, o.d ?? 0.35), key: 'w_lb' + str, align: o.align, col: o.col }));
}
// the window that keeps a still hero exact at both boundaries: 0 near the era ends, 1 inside
const w_inner = (E, X) => seg(TT, E + 0.5, E + 0.9) * (1 - seg(TT, X - 0.9, X - 0.5));
// a rainbow seen in the back view: centred on (cx, cy), only above the horizon (clipped)
function w_bow(cx, cy, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.rect(-400, -400, W + 800, BK_HORIZON + 400 - 2); ctx.clip();
  rainbowArc(cx, cy, BOW_R, BOW_W, Math.PI, TAU, { key: o.key ?? 'w_rb', a: o.a ?? 1, part: o.part ?? 1 });
  ctx.restore();
}
// the shadow of a person in the back view: a graphite smudge from the feet (x, y + 1.42 r) running UP the screen to
// the head's shadow at (x, y - 110): sun behind the camera, shadow pointing away from us
function w_shadow(x, y, key, a = 1) {
  const hy = y - 110, fy = y + HR * 1.42;
  smudge(x, (hy + fy) / 2, 46, (fy - hy) / 2 + 10, 0.45 * a);
  smudge(x, hy, 44, 30, 0.42 * a);
  alphaDo(a, () => gpencil(loopPts(x, hy, 40, 22, 0.08), { w: 3, key: key + 'hs', a: 0.55 }));
}
// a small "treasure?" pot (graphite) standing on the horizon at (x, y)
function w_pot(x, y, a = 1) {
  alphaDo(a, () => {
    const P = [[x - 30, y - 40], [x - 34, y - 18], [x - 22, y], [x + 22, y], [x + 34, y - 18], [x + 30, y - 40]];
    gfill(P, SK.sheet, { key: 'w_potf' });
    ctx.save(); gclip(P); ghatch(x - 36, y - 42, x + 36, y, { ang: -0.8, gap: 9, col: SK.graphL, w: 2, a: 0.6, key: 'w_poth' }); ctx.restore();
    gpencil(closeP(P), { w: 3.5, key: 'w_poto', a: 0.95 });
    gpencil(loopPts(x, y - 41, 36, 9, 0.06), { w: 3.5, key: 'w_potr', a: 0.95 });
    for (let i = 0; i < 3; i++) gpencil(loopPts(x - 18 + i * 18, y - 52 - (i === 1 ? 6 : 0), 11, 8, 0.05), { w: 3, key: 'w_coin' + i, a: 0.8 });
  });
}
// the friend in the end scene: a graphite/ink doodle seen from behind (NOT terracotta)
function w_friend(x, y, r, o = {}) {
  const key = 'w_fr', lw = Math.max(3, r * 0.065);
  ctx.save(); ctx.translate(x, y);
  for (const s of [-1, 1]) gline([[s * r * 0.32, r * 0.85], [s * r * 0.36, r * 1.42]], { w: lw, key: key + 'leg' + s, amp: 0.8, second: false, step: 8 });
  ctx.scale(o.sx ?? 1, o.sy ?? 1);
  const body = loopPts(0, 0, r, r, 0, 0, 40);
  gfill(body, SK.sheet, { off: [r * 0.06, r * 0.05], key: key + 'f' });
  litHatch(body, { ang: -0.85, gap: Math.max(6, r * 0.1), col: SK.graph, w: 2.2, a: 0.85, key: key + 'h' });
  gline(loopPts(0, 0, r, r, 0.08), { w: lw, key: key + 'o' });
  gpencil([[-r * 0.2, -r * 0.95], [-r * 0.05, -r * 1.25], [r * 0.08, -r * 0.98], [r * 0.25, -r * 1.2]], { w: 4, key: key + 'tuft' });   // a tuft of hair
  gpencil([[-r * 0.35, r * 0.5], [0, r * 0.62], [r * 0.35, r * 0.5]], { w: 3, key: key + 'bk', a: 0.6 });
  ctx.restore();
}

// ---------------------------------------------------------------------
//  HOOK — "Bạn không bao giờ đến được chân cầu vồng, vì nó chẳng nằm ở chỗ nào cả."
//  Back view. The bow's right foot stands on a little "kho báu?" pot. The hero walks toward it (up-right, legs
//  stepping) and the WHOLE bow slides with it (centred on its head's shadow); the pot is left with no rainbow; a "?".
//  The hero steps back to BACK_HERO by 5.4 (the bow comes back with it), the pot has been rubbed out.
// ---------------------------------------------------------------------
const w_HK_D = [100, -62];                       // how far the hero walks (toward the foot: up and right)
const w_HK_POT = [892, BK_HORIZON];
function w_hookOff(t) {
  const go = EZ.io(seg(t, 0.8, 3.3)), back = EZ.io(seg(t, 3.95, 5.4)), k = go * (1 - back);
  return { k, walking: (t > 0.8 && t < 3.3) || (t > 3.95 && t < 5.4) };
}
SCENES.hook = function () {
  sketchPage({ grid: 'plain' });
  const X = EE('hook'), tVi = VW('hook', 'vì'), tChang = VW('hook', 'chẳng');
  const { k, walking } = w_hookOff(TT);
  const hx = BACK_HERO[0] + w_HK_D[0] * k, hy = BACK_HERO[1] + w_HK_D[1] * k, r = HR * (1 - 0.1 * k);
  // the rainbow, centred on the hero's head shadow (moves with the hero), gentle breathing alpha
  w_bow(hx, hy - 110, { a: 0.9 + 0.1 * Math.sin(TT * 2.4) });
  groundLine(BK_HORIZON, { key: 'w_hz' });
  // the pot at the bow's first foot (left behind; rubbed out before the hero is home)
  const potA = 1 - seg(TT, 4.6, 5.0);
  w_pot(...w_HK_POT, potA);
  w_label('kho báu?', 890, 1062, 52, 0.15, 5.0, { col: SK.graph, align: 'right' });
  // a small pencil arrow from the walking hero toward the pot while it walks there
  if (TT > 0.9 && TT < 3.6) alphaDo(1 - seg(TT, 3.3, 3.6), () => arrowPencil([[610, 935], [720, 905], [835, 930]], ev(1.0, 0.6), { key: 'w_hkarw', w: 4 }));
  // the hero: its shadow (to the head's shadow), then the hero from behind, stepping while it walks
  w_shadow(hx, hy, 'w_hksh');
  const ph = (TT - 0.8) * TAU * 1.8, step = walking ? Math.sin(ph) : 0, bob = walking ? Math.abs(Math.sin(ph)) * 6 : 0;
  const look = TT > 3.3 && TT < 3.95 ? 0.12 * Math.sin((TT - 3.3) * TAU * 1.5) : 0;   // looks left/right: where did it go?
  heroBack(hx, hy - bob, r, { key: 'w_hero', step, rot: look });
  // "?" when the foot has slid away (stays 2 s, gone 0.5 s before the bridge)
  if (TT > 3.4) w_label('?', hx + 70, hy - 85, 90, 3.4, X - 0.5, { col: SK.graph, d: 0.25 });
  viTag('chân cầu vồng?');
  pageCaption(['Không bao giờ tới', 'chân cầu vồng'], [[1, 'chân cầu vồng']], { size: 62 });
};

// ---------------------------------------------------------------------
//  SIDE VIEW (setup, white): ground, low sun at the LEFT behind the hero, the white beam travelling LEFT -> RIGHT
//  over the hero's shoulder into the rain at the right.
// ---------------------------------------------------------------------
const w_BEAM_Y = 1030, w_BEAM_A = [110, w_BEAM_Y];
function w_side(o) {
  groundLine(SD_GROUND, { key: 'w_sg' });
  // rain: cloud + curtain (drawn on: drops down a little and fades in)
  const ra = o.rain ?? 1;
  if (ra > 0.01) {
    alphaDo(ra * (o.rainA ?? 1), () => {
      rainCloud(CLOUD_SIDE[0], CLOUD_SIDE[1] - 40 * (1 - EZ.o2(ra)), { key: 'w_cl', dark: 0.35 });
      rainCurtain(RAIN_X0, RAIN_X1, 540, SD_GROUND, { key: 'w_rn', n: 7 });
    });
  }
  // the sunbeam (behind the sun's disc and the hero): flows LEFT -> RIGHT
  if ((o.beam ?? 1) > 0.01) sunBeam(w_BEAM_A, [o.beamX ?? 700, w_BEAM_Y], 52, { key: 'w_bm', part: o.beam ?? 1, a: o.beamA ?? 1 });
  // the sun: low on the left, pops on
  const sk = o.sun ?? 1;
  if (sk > 0.01) {
    const [x, y, r] = SUN_SIDE, s = lerp(0.3, 1, EZ.back(sk));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y);
    sunDisc(x, y, r, { key: 'w_sun', a: clamp(sk * 2) * (o.sunA ?? 1), hot: o.hot ?? 0.3 });
    ctx.restore();
  }
}
function w_sideHero(E, X, look, mood = 'calm') {
  const w = w_inner(E, X), bob = 5 * Math.sin(TAU * (TT - E) / 1.3) * w;
  heroGiot(SIDE_HERO[0], SIDE_HERO[1] + bob, HR, { key: 'w_hero', look, mood, legs: true, sx: 1 + 0.02 * Math.sin(TAU * (TT - E) / 1.3) * w, sy: 1 - 0.02 * Math.sin(TAU * (TT - E) / 1.3) * w });
}

// ---------------------------------------------------------------------
//  SETUP — "Cầu vồng cần nắng chiếu từ sau lưng bạn, và một màn mưa ở phía trước."
//  On "nắng" the sun pops on at the left (behind the hero), the beam grows L -> R over its shoulder; the hero glances
//  back on "sau lưng" ("nắng sau lưng"); on "màn mưa" the cloud + rain come in at the right ("mưa trước mặt").
// ---------------------------------------------------------------------
SCENES.setup = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('setup'), X = EE('setup'), tNang = VW('setup', 'nắng'), tSau = VW('setup', 'sau'), tMan = VW('setup', 'màn'), tMua = VW('setup', 'mưa');
  w_side({
    sun: seg(TT, tNang - 0.15, tNang + 0.45), hot: 0.3 + 0.5 * Math.sin(Math.PI * seg(TT, tNang, tSau + 0.8)),
    beam: EZ.o2(seg(TT, tNang + 0.2, tSau + 0.6)), beamX: 700,
    rain: seg(TT, tMan - 0.35, tMua + 0.25),
  });
  w_label('nắng sau lưng', 270, 900, 56, tSau, X - 0.5);
  if (TT > tSau + 0.3 && TT < X - 0.5) alphaDo(1 - seg(TT, X - 0.8, X - 0.5), () => arrowPencil([[160, 925], [120, 980]], ev(tSau + 0.3, 0.3), { key: 'w_sarw', w: 4 }));
  w_label('mưa trước mặt', 720, 820, 56, tMua - 0.05, X - 0.5);   // continues in "white" (same place)
  const look = TT < tSau - 0.1 ? [0.6, -0.4] : TT < tMan - 0.3 ? [-1, -0.2] : [1, -0.3];
  const mood = TT > tMua && TT < X - 0.7 ? 'happy' : 'calm';
  w_sideHero(E, X, look, mood);
  viTag('nắng & mưa');
  pageCaption(['Nắng sau lưng,', 'mưa trước mặt'], [[0, 'Nắng']], { size: 62 });
};

// ---------------------------------------------------------------------
//  WHITE — "Ánh nắng trông màu trắng, nhưng thật ra là hỗn hợp của mọi màu."
//  The side view, lighter; the beam reaches into the rain. A magnifier loop over the beam (callout from a small
//  circle on the beam): inside, the white beam flows; on "hỗn hợp của mọi màu" it opens into the six SPEC strands.
// ---------------------------------------------------------------------
const w_LENS = [470, 770, 140], w_SPOT = [500, w_BEAM_Y, 40];
SCENES.white = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('white'), X = EE('white'), tTrang = VW('white', 'trắng'), tHon = VW('white', 'hỗn'), tMoi = VW('white', 'mọi');
  const beamX = lerp(700, 940, EZ.io(seg(TT, E + 0.5, E + 1.6)));
  w_side({ sunA: 0.75, rainA: 0.6, beamX, hot: 0.2 });
  // "mưa trước mặt" carries over from setup, then gives way to the magnifier
  w_label('mưa trước mặt', 720, 820, 56, E - 5, tTrang - 0.05, { a: 1 });
  w_sideHero(E, X, TT > tTrang && TT < X - 0.6 ? [0.5, -1] : [1, -0.3], TT > tMoi + 0.2 && TT < X - 0.7 ? 'wow' : 'calm');
  // the magnifier: spot circle on the beam, two tangent lines, then the big lens
  const lk = EZ.o2(seg(TT, tTrang, tTrang + 0.6)), lout = 1 - seg(TT, X - 0.8, X - 0.5);
  if (lk > 0.01 && lout > 0.01) alphaDo(lout, () => {
    const [sx, sy, sr] = w_SPOT, [lx, ly, lr] = w_LENS;
    gpencil(loopPts(sx, sy, sr, sr, 0.08), { w: 4, key: 'w_spot', part: lk });
    for (const s of [-1, 1]) gpencil([[sx + s * sr, sy], [lx + s * lr * 0.97, ly + lr * 0.25]], { w: 3, key: 'w_tan' + s, a: 0.6, part: seg(lk, 0.3, 1) });
    const L = loopPts(lx, ly, lr, lr, 0, 0, 60);
    if (lk > 0.5) {
      ctx.save(); gclip(L);
      gfill(L, SK.sheet, { key: 'w_lensf', off: [0, 0] });
      sunBeam([lx - lr - 20, ly], [lx + lr + 20, ly], 120, { key: 'w_lbm', part: seg(lk, 0.5, 1), strands: EZ.io(seg(TT, tHon, tMoi + 0.4)) });
      ctx.restore();
    }
    gline(loopPts(lx, ly, lr, lr, 0.06), { w: 7, key: 'w_lens', part: lk });
    gline([[lx + lr * 0.72, ly - lr * 0.72], [lx + lr * 1.0, ly - lr * 1.0]], { w: 12, key: 'w_lensh', part: seg(lk, 0.7, 1), second: false });   // handle stub
  });
  w_label('trắng = mọi màu trộn lại', 66, 548, 50, tHon, X - 0.5, { align: 'left' });
  viTag('nắng trắng');
  pageCaption(['Nắng trắng =', 'mọi màu trộn lại'], [[1, 'mọi màu']], { size: 62 });
};

// ---------------------------------------------------------------------
//  END — "Và vì mỗi người đứng một chỗ, chiếc cầu vồng bạn thấy là của riêng bạn."
//  The hook's back view. The hero (BACK_HERO) with its bow (centred on its head's shadow, ANTI); a graphite friend
//  at [300,1150]. On "mỗi người đứng một chỗ" the friend's own bow (fainter) draws on around the friend's head
//  shadow; each person's dashed sight line to its own bow; "của riêng bạn" on "riêng bạn"; the hero turns, happy, hops.
// ---------------------------------------------------------------------
const w_FR = [300, 1150];
SCENES.end = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('end'), X = EE('end'), tMoi = VW('end', 'mỗi'), tCho = VW('end', 'chỗ'), tRieng = VW('end', 'riêng'), tCua = VW('end', 'của');
  const fA = w_FR[0], fy = w_FR[1];
  // the friend's bow first (fainter, behind), then the hero's
  w_bow(fA, fy - 110, { key: 'w_frb', a: 0.42 + 0.06 * Math.sin(TT * 2), part: EZ.io(seg(TT, tMoi, tCho + 0.2)) });
  w_bow(ANTI[0], ANTI[1], { key: 'w_hrb', a: 0.92 + 0.08 * Math.sin(TT * 2.4 + 1) });
  groundLine(BK_HORIZON, { key: 'w_hz' });
  // shadows to each head's shadow
  w_shadow(fA, fy, 'w_frsh', 0.8 * seg(TT, E, E + 0.6) + 0.2);
  w_shadow(BACK_HERO[0], BACK_HERO[1], 'w_hesh');
  // sight lines: each person to its OWN bow
  const sl = seg(TT, tCho, tCho + 0.6);
  const ha = -1.05, fa = -2.1, rm = BOW_R - BOW_W / 2;
  guideLine([BACK_HERO[0] + 20, BACK_HERO[1] - 60], [ANTI[0] + rm * Math.cos(ha), ANTI[1] + rm * Math.sin(ha)], { key: 'w_hsl', part: sl });
  guideLine([fA - 20, fy - 60], [fA + rm * Math.cos(fa), fy - 110 + rm * Math.sin(fa)], { key: 'w_fsl', part: sl, a: 0.6 });
  // the friend: graphite, arrives a step from the left during the opening, then breathes
  const fin = EZ.o2(seg(TT, E + 0.3, E + 1.3)), fbob = 3 * Math.sin(TAU * (TT - E) / 1.5 + 1);
  alphaDo(clamp(fin * 1.5), () => w_friend(fA - 60 * (1 - fin), fy + fbob, HR));
  // the hero: from behind (exact at the bridge); on "riêng" turns round, happy, and hops
  const tTurn = tRieng - 0.15;
  if (TT < tTurn) {
    const bob = 4 * Math.sin(TAU * (TT - E) / 1.4) * seg(TT, E + 0.5, E + 0.9);
    heroBack(BACK_HERO[0], BACK_HERO[1] + bob, HR, { key: 'w_hero', rot: 0.08 * Math.sin(TAU * seg(TT, tCua - 0.6, tCua)) });
  } else {
    const hop = Math.sin(Math.PI * seg(TT, tTurn + 0.15, tTurn + 0.6)), sq = 0.08 * Math.sin(TAU * seg(TT, tTurn + 0.1, tTurn + 0.7));
    const bob = 4 * Math.sin(TAU * (TT - tTurn) / 1.2);
    heroGiot(BACK_HERO[0], BACK_HERO[1] - 34 * hop + bob, HR, { key: 'w_heroF', mood: 'happy', look: [-0.6, -0.3], legs: true, sx: 1 + sq, sy: 1 - sq, arms: [0.9 + 0.25 * Math.sin(TT * 5), 0.9 + 0.25 * Math.sin(TT * 5 + 1)] });
    sparkle(BACK_HERO[0] + 80, BACK_HERO[1] - 80, 34, seg(TT, tTurn + 0.2, tTurn + 0.9), 'w_spk');
  }
  // labels: "của riêng bạn" by the hero's bow; a small "của bạn ấy" by the friend's (fainter)
  w_label('của riêng bạn', 700, 560, 62, tRieng - 0.2, null);
  w_label('bạn ấy', 335, 905, 50, tCho + 0.4, null, { col: SK.graph });
  viTag('của riêng bạn');
  pageCaption(['Mỗi người một', 'cầu vồng riêng'], [[1, 'riêng']], { size: 62 });
};
