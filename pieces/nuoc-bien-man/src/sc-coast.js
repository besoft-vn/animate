// =====================================================================
//  sc-coast.js — hook (the beach: a sip of sweet river water, salt grains ride the river DOWN into the sea),
//  rain (the hero floats UP into the cloud, falls as a raindrop, CO2 bubbles merge in -> "hơi chua", lands at the
//  spring), time (the big loop cloud -> mountain -> river -> sea -> cloud, run twice; each loop leaves a grain in the
//  sea; "100… 200… triệu năm"), end (the same beach: the hero tastes the SEA -> "mặn!"; a thought bubble of the
//  mountain rock + a salt grain; a dashed pencil path mountain -> river -> sea).
//  Colour: terracotta = hero · BLUE = water · PLUM = salt · GREEN = CO2 / acid only · graphite = arrows, rock.
// =====================================================================
// a gentle idle bob that dies out by `still` (the hero must be exact at the bridge)
const c_bob = (t0, still, amp = 6, per = 1.6) => amp * Math.sin(TAU * (TT - t0) / per) * (1 - seg(TT, still - 0.5, still)) * seg(TT, t0, t0 + 0.4);
const c_hop = (t0, d = 0.4) => Math.sin(Math.PI * seg(TT, t0, t0 + d));
// a small water drop (point up) — a sip, a raindrop
function c_dropPts(x, y, R) {
  const P = []; for (let i = 0; i <= 32; i++) { const an = i / 32 * TAU, s = Math.sin(an / 2); P.push([x + R * Math.sin(an) * s, y + R * 0.25 - R * Math.cos(an) * (0.9 + 0.35 * (1 - s))]); }
  return P;
}
function c_drop(x, y, R, key, a = 1) {
  if (R < 2) return;
  const P = c_dropPts(x, y, R);
  alphaDo(a, () => { gfill(P, COL.waterL, { key: key + 'f' }); gline(P, { w: 4, col: COL.water, key: key + 'o', closed: true, second: false }); });
}
// where the hero's hand is (doodleHero's arm geometry), s = -1 left / +1 right
const c_hand = (x, y, r, s, ang) => [x + s * r * 0.9 + s * r * 0.85 * Math.cos(ang), y + r * 0.15 - r * 0.85 * Math.sin(ang)];
// a point (and the heading) at fraction u along a polyline (by length)
function c_at(P, u) {
  const Q = writeOn(P, clamp(u, 0.0005, 1)) || [P[0], P[1]];
  const e = Q[Q.length - 1], q = Q.length > 1 ? Q[Q.length - 2] : P[0];
  return [e[0], e[1], Math.atan2(e[1] - q[1], e[0] - q[0])];
}
const c_len = (P) => { let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L; };
// a graphite chevron (arrow head) at (x, y) pointing along angle an
function c_chev(x, y, an, s, key, a = 1) {
  if (a <= 0.01) return;
  for (const k of [-1, 1]) gpencil([[x, y], [x - Math.cos(an + k * 0.55) * s, y - Math.sin(an + k * 0.55) * s]], { w: 6, col: SK.graph, key: key + k, a: 0.95 * a, amp: 0.8, passes: 2 });
}
// a dashed pencil path written on (part 0..1), with a head at the end
function c_dashed(P, part, key, o = {}) {
  const Q = writeOn(resample(P, false, 6), clamp(part)); if (!Q || Q.length < 2) return;
  const dash = o.dash ?? 5;                                                   // points per dash (6 px each)
  for (let i = 0, n = 0; i < Q.length - 1; i += dash, n++) if (n % 2 === 0) gpencil(Q.slice(i, Math.min(Q.length, i + dash + 1)), { w: o.w ?? 8, col: o.col ?? SK.graph, key: key + n, a: 1, amp: 0.6, passes: 2 });
  if (part > 0.9) { const e = Q[Q.length - 1], q = Q[Math.max(0, Q.length - 4)]; c_chev(e[0], e[1], Math.atan2(e[1] - q[1], e[0] - q[0]), 30 * EZ.o2(seg(part, 0.9, 1)), key + 'h'); }
}

// ---------------------------------------------------------------------
//  HOOK — the coast; the hero on the beach. On "ngọt lịm" it steps to the water's edge, scoops a sip: happy, "ngọt ✓".
//  On "vậy mà" puzzled; on "chính sông … chở muối" 3 plum grains ride the river (spring -> mouth, DOWN-LEFT) and sink
//  into the sea (dissolving away by 5.45); label "muối" + a pencil arrow. Exact at HERO_BEACH from 5.5.
// ---------------------------------------------------------------------
SCENES.hook = function () {
  sketchPage({ grid: 'plain' });
  const tn = VW('hook', 'ngọt'), tv = VW('hook', 'vậy'), tc = VW('hook', 'chính'), tm = VW('hook', 'muối'), still = EE('hook') - 0.5;
  coast();
  // the grains riding the river: pop in at the spring, ride down to the mouth, sink into the sea and dissolve
  for (let i = 0; i < 3; i++) {
    const t0 = tc - 0.1 + i * 0.32; if (TT < t0) continue;
    const u = seg(TT, t0, t0 + 1.25), [x, y] = riverAt(u), sk = EZ.o2(seg(TT, t0 + 1.25, t0 + 1.8));
    const a = (1 - seg(TT, t0 + 1.35, t0 + 1.7)) * (1 - seg(TT, still - 0.3, still - 0.05));
    saltGrain(x - 30 * sk, y + 8 + 60 * sk, 22, { part: ev(t0, 0.3), key: 'c_hg' + i, rot: 0.3 * Math.sin(TT * 3 + i), a });
  }
  // label "muối" + pencil arrow to the river (written early so it can hold ≥ 1.7 s; gone by 5.45)
  const am = 1 - seg(TT, still - 0.2, still - 0.05);
  alphaDo(am, () => {
    label('muối', 500, 770, 66, { col: COL.salt, reveal: ev(tc + 0.05, 0.3), key: 'c_lmu' });
    arrowPencil([[560, 790], [610, 830], [650, 872]], ev(tc + 0.3, 0.35), { key: 'c_amu', w: 4 });
    if (TT > tm) underline(455, 545, 790, { col: COL.salt, w: 5, key: 'c_umu', part: ev(tm, 0.25) });
  });
  // the hero: steps to the water's edge, scoops a sip, back to the beach spot by 4.75
  const [bx, by] = HERO_BEACH;
  const go = EZ.io(seg(TT, 0.7, 1.3)), back = EZ.io(seg(TT, 3.95, 4.75)), hx = bx + 100 * go - 100 * back;
  const moving = (TT > 0.7 && TT < 1.3) || (TT > 3.95 && TT < 4.75);
  const hop = c_hop(tn + 0.45, 0.35) + c_hop(tm + 0.05, 0.35);
  const hy = by + c_bob(0, still) - 24 * hop * (TT < still ? 1 : 0);
  // the right arm: down to the water, up to the mouth (sip), then points at the river while the grains come
  let ra = -0.6;
  if (TT >= 1.3 && TT < 1.55) ra = lerp(-0.6, -1.15, EZ.io(seg(TT, 1.3, 1.55)));
  else if (TT >= 1.55 && TT < 1.85) ra = lerp(-1.15, 2.9, EZ.io(seg(TT, 1.55, 1.85)));
  else if (TT >= 1.85 && TT < 2.25) ra = 2.9;
  else if (TT >= 2.25 && TT < 2.55) ra = lerp(2.9, -0.6, EZ.io(seg(TT, 2.25, 2.55)));
  else if (TT >= tc - 0.1 && TT < 3.95) ra = lerp(-0.6, 0.55, EZ.io(seg(TT, tc - 0.1, tc + 0.2))) + 0.08 * Math.sin(TT * 6);
  else if (TT >= 3.95 && TT < 4.25) ra = lerp(0.55, -0.6, EZ.io(seg(TT, 3.95, 4.25)));
  const look = TT < 0.7 ? [0.5, 0.2] : TT < 1.3 ? [1, 0.3] : TT < 1.85 ? [0.7, 1] : TT < tv ? [0, -0.2] : TT < tc ? [0.8, -0.6] : TT < still - 0.3 ? [0.9, -0.2 + 0.4 * seg(TT, tc, tm)] : [0.2, 0];
  const mood = TT < 1.85 ? 'calm' : TT < tv ? 'happy' : TT < tm ? 'puzzled' : TT < still - 0.2 ? 'wow' : 'calm';
  const X = TT >= still ? bx : hx, Y = TT >= still ? by : hy;
  heroGiot(X, Y, HR, { key: 'hero', look, mood, legs: true, step: moving ? Math.sin(TT * 16) : 0, arms: [-0.6, ra], sx: 1 - 0.05 * hop, sy: 1 + 0.07 * hop });
  // the sip: a little blue drop picked up from the water at the edge, carried to the mouth, drunk
  const dk = ev(1.45, 0.15) * (1 - seg(TT, 1.95, 2.15));
  if (dk > 0.01) { const [qx, qy] = c_hand(X, Y, HR, 1, ra); c_drop(qx, qy - 16, 19 * dk, 'c_sip'); }
  // "ngọt ✓" over the hero (ink check: correct), holds 2 s, gone before the grains' label gets busy
  const an = 1 - seg(TT, 3.8, 4.05);
  alphaDo(an, () => {
    label('ngọt', 190, 845, 66, { reveal: ev(tn + 0.15, 0.3), key: 'c_lng' });
    checkMark(292, 822, 0.8, ev(tn + 0.45, 0.25), SK.ink, 'c_ckn');
  });
  viTag('ngọt hay mặn?');
  pageCaption(['Sông ngọt lịm mà', 'chở muối ra biển'], [[1, 'muối']], { size: 62, at: 0.25 });
};

// ---------------------------------------------------------------------
//  RAIN — the coast; the hero floats UP from the beach into the cloud (6.5–8.3), a raindrop shell forms, it falls DOWN
//  with 4 faint rain strokes; on "khí cacbonic" 3 CO2 bubbles drift in and merge, the drop tints faint green, label
//  "hơi chua" (green). Lands at the spring [740,650] by 11.3, exact from 11.5.
// ---------------------------------------------------------------------
SCENES.rain = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('rain'), e1 = EE('rain'), still = e1 - 0.5, tk = VW('rain', 'khí'), th = VW('rain', 'hòa');
  const tUp = e0 + 0.5, tCl = 8.3, tF0 = 8.9, tLand = 11.3;
  const [ax, ay] = BR.hookRain.b, [lx, ly] = BR.rainRock.a, CL = [RAIN_CLOUD.x, RAIN_CLOUD.y - 10];
  coast({ cloud: { dark: 0.3 + 0.5 * seg(TT, 7.5, 8.6) * (1 - seg(TT, 10.8, 11.6)) } });
  // the rain: 4 long faint blue strokes falling from the cloud base (DOWN)
  const ra = seg(TT, 8.4, 8.9) * (1 - seg(TT, 11.1, 11.45));
  if (ra > 0.01) [640, 690, 850, 900].forEach((x, i) => {
    const ph = ((TT * 0.9 + i * 0.27) % 1), y0 = 505 + ph * 230;
    gline([[x - 6, y0], [x - 14, y0 + 110]], { w: 5, col: COL.water, key: 'c_rs' + i, a: 0.5 * ra * Math.sin(Math.PI * ph), second: false, amp: 0.5 });
  });
  // the hero's path
  let hx, hy, rot = 0;
  if (TT < tUp) { hx = ax; hy = ay; }
  else if (TT < tCl) {
    const u = EZ.io(seg(TT, tUp, tCl)), C = [470, 700];
    hx = (1 - u) ** 2 * ax + 2 * u * (1 - u) * C[0] + u * u * CL[0];
    hy = (1 - u) ** 2 * ay + 2 * u * (1 - u) * C[1] + u * u * CL[1];
    hx += 18 * Math.sin(TAU * u * 1.5) * Math.sin(Math.PI * u); rot = 0.12 * Math.sin(TAU * u * 1.5);
  } else if (TT < tF0) { hx = CL[0] + 6 * Math.sin(TT * 4); hy = CL[1] + 5 * Math.sin(TT * 3); }
  else if (TT < tLand) {
    const u = EZ.io(seg(TT, tF0, tLand));
    hx = lerp(CL[0], lx, u) + 26 * Math.sin(TAU * u) * Math.sin(Math.PI * u); hy = lerp(CL[1], ly, u); rot = 0.1 * Math.sin(TAU * u);
  } else { hx = lx; hy = ly; }
  if (TT >= still) { hx = lx; hy = ly; rot = 0; }
  // the raindrop shell around the hero (forms in the cloud, gone on landing) + its green tint after the merge
  const sa = ev(8.25, 0.5) * (1 - seg(TT, tLand - 0.1, tLand + 0.15));
  const gk = EZ.o2(seg(TT, tk + 0.35, tk + 0.9));
  if (sa > 0.01) {
    const DP = c_dropPts(hx, hy - 12, HR * 1.95);                         // a raindrop big enough to hold the hero
    alphaDo(sa, () => {
      gfill(DP, COL.waterL, { key: 'c_dsf', a: 0.45 });
      if (gk > 0.01) gfill(DP, COL.acidL, { key: 'c_dg', a: 0.8 * gk });
      gline(DP, { w: 5, col: COL.water, key: 'c_dso', closed: true });
    });
  }
  // the CO2 bubbles: pop in around, drift into the drop and merge (shrink + fade)
  const BS = [[540, 470], [560, 680], [860, 610]];
  BS.forEach((p, i) => {
    const t0 = th + 0.05 + i * 0.18; if (TT < t0) return;
    const m = EZ.io(seg(TT, t0 + 0.3, tk + 0.55 + i * 0.1)), sh = seg(m, 0.6, 1);
    const x = lerp(p[0], hx, m) + 8 * Math.sin(TT * 3 + i), y = lerp(p[1], hy, m) + 6 * Math.cos(TT * 2.5 + i);
    co2Bubble(x, y, 44 * (1 - 0.6 * sh), { part: ev(t0, 0.3), key: 'c_b' + i, a: 1 - seg(m, 0.8, 1) });
  });
  // the label "hơi chua" (green), beside the falling drop; gone by 11.45
  const la = 1 - seg(TT, still - 0.3, still - 0.05);
  alphaDo(la, () => {
    const [x0, x1] = label('hơi chua', 470, 615, 66, { col: COL.acid, reveal: ev(tk + 0.1, 0.35), key: 'c_lch' });
    underline(x0, x1, 635, { col: COL.acid, w: 5, key: 'c_uch', part: ev(VW('rain', 'chua'), 0.25) });
  });
  // splash ticks at the landing
  sparkle(lx, ly + HR * 0.9, 70, seg(TT, tLand - 0.05, tLand + 0.35), 'c_spl', COL.water);
  const land = c_hop(tLand - 0.05, 0.35);
  const look = TT < tUp ? [0.6, -0.4] : TT < tCl ? [0.5, -1] : TT < th ? [0, 0.8] : TT < tk + 0.6 ? [-0.8, -0.2] : TT < still ? [-0.3, 0.6] : [0, 0];
  const mood = TT < tUp ? 'calm' : TT < tCl ? 'wow' : TT < tk ? 'happy' : TT < tLand ? 'puzzled' : 'calm';
  heroGiot(hx, hy, HR, { key: 'hero', look, mood, rot, legs: TT < tUp + 0.25, sx: 1 + 0.08 * land, sy: 1 - 0.08 * land });
  viTag('mưa hơi chua');
  pageCaption(['Mưa hòa khí cacbonic', 'nên hơi chua'], [[1, 'hơi chua']], { size: 62, at: 0.25 });
};

// ---------------------------------------------------------------------
//  TIME — the big loop: cloud -> (rain, DOWN) -> spring -> river (DOWN-LEFT) -> mouth -> sea -> (vapour, UP) -> cloud,
//  written on 32.4–34.0; the hero (small) runs it twice fast, carrying a grain on the river leg and dropping it in the
//  sea (the sea's plum tint deepens); "100… 200… triệu năm" on "hàng trăm triệu năm". Still from 37.6 to the SLAM.
// ---------------------------------------------------------------------
const c_LEG_RAIN = [[770, 470], [762, 560], [748, 640], SRC_PT];
const c_LEG_SEA = [MOUTH, [360, 1140], [250, 1168], [150, 1142]];
const c_LEG_VAP = [[150, 1142], [118, 1060], [110, 940], [140, 820], [230, 720], [370, 640], [520, 560], [650, 495], [770, 470]];
const c_LOOP = [...c_LEG_RAIN, ...RIVER.slice(1), ...c_LEG_SEA.slice(1), ...c_LEG_VAP.slice(1)];
const c_LL = c_len(c_LOOP);
const c_FS = c_len(c_LEG_RAIN) / c_LL;                        // the spring
const c_FM = (c_len(c_LEG_RAIN) + c_len(RIVER)) / c_LL;       // the mouth
const c_SLOTS = [[300, 1196], [385, 1212]];                    // where the loops' grains settle in the sea
SCENES.time = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('time'), tL0 = 33.3, tL1 = 37.6, th = VW('time', 'hàng'), tt = VW('time', 'triệu');
  const S = 2 * seg(TT, tL0, tL1);                                         // loops run (0..2)
  const tDrop = (k) => tL0 + (k + c_FM) / 2 * (tL1 - tL0);                 // when loop k reaches the mouth
  const salt = 0.12 + 0.2 * EZ.o2(seg(TT, tDrop(0), tDrop(0) + 0.6)) + 0.22 * EZ.o2(seg(TT, tDrop(1), tDrop(1) + 0.6));
  coast({ sea: { salt } });
  // the loop line (graphite), written on, with 4 heads: rain DOWN, river DOWN-LEFT, sea, vapour UP
  const lp = EZ.io(ev(e0 + 0.4, 1.6));
  gpencil(c_LOOP, { w: 6, col: SK.graph, key: 'c_loop', part: lp, a: 0.75, amp: 1.6 });
  [0.06, (c_FS + c_FM) / 2, (c_FM + 1) / 2 - 0.08, 0.86].forEach((f, i) => {
    const [x, y, an] = c_at(c_LOOP, f); c_chev(x, y, an, 34 * EZ.back(seg(lp, f, f + 0.05)), 'c_lh' + i, seg(lp, f, f + 0.02));
  });
  // the grains dropped in the sea (each loop adds one): fall from the mouth to their slot, then rock gently
  c_SLOTS.forEach(([sx, sy], k) => {
    const t0 = tDrop(k); if (TT < t0) return;
    const u = EZ.o2(seg(TT, t0, t0 + 0.6)), [mx, my] = MOUTH;
    saltGrain(lerp(mx + 20, sx, u), lerp(my + 10, sy, u) + 4 * Math.sin(TT * 2 + k), 22, { key: 'c_tg' + k, rot: 0.25 * Math.sin(TT * 1.5 + k) });
  });
  // the hero: exact at the cloud until 32.5, shrinks, runs the loop twice, stops back at the cloud (still in the pause)
  const r = lerp(HR, 38, EZ.io(seg(TT, e0 + 0.5, e0 + 1.1)));
  const f = S % 1, [px, py, an] = c_at(c_LOOP, TT >= tL1 ? 1 : f);
  const [cx, cy] = BR.evapTime.b;
  const run = TT > tL0 && TT < tL1;
  const hx = run ? px : cx, hy = (run ? py : cy) + (TT > e0 + 0.5 && TT < tL0 ? 5 * Math.sin(TAU * (TT - e0 - 0.5) / 0.8) : 0);
  const carry = run && f > c_FS - 0.01 && f < c_FM ? EZ.back(seg(f, c_FS - 0.01, c_FS + 0.03)) : 0;
  const onVap = run && f > (c_FM + 1) / 2 - 0.02;
  const look = run ? [Math.cos(an), Math.sin(an)] : [0.3, 0.5];
  const mood = run ? (onVap ? 'happy' : 'wow') : TT < tL0 ? 'calm' : 'wow';
  heroGiot(hx, hy, r, { key: 'hero', look, mood, salt: carry, rot: run ? 0.15 * Math.sin(TT * 9) : 0 });
  // the counter "100… 200… triệu năm" (inside the loop)
  const [a0] = label('100…', 280, 830, 66, { reveal: ev(th, 0.3), key: 'c_c1' });
  label('200…', 450, 830, 66, { reveal: ev(VW('time', 'trăm'), 0.3), key: 'c_c2' });
  const [b0, b1] = label('triệu năm', 370, 912, 74, { reveal: ev(th + 0.2, 0.4), key: 'c_c3' });
  underline(b0, b1, 934, { col: SK.red, w: 6, key: 'c_cu', part: ev(tt + 0.4, 0.3) });
  viTag('vòng lặp');
  pageCaption(['Cứ thế lặp lại', 'hàng trăm triệu năm'], [[1, 'triệu năm']], { size: 62, at: 0.25 });
};

// ---------------------------------------------------------------------
//  END — the hook's coast. The hero hops off the sand into the SEA (left, away from the river mouth), sips: puzzled ->
//  "mặn!" (plum). On "một phần" a thought bubble rises: the mountain rock; on "đá núi" a salt grain pops out of it and a
//  dashed pencil path runs from the mountain down the river to the sea; a grain rides it down to the hero.
// ---------------------------------------------------------------------
const c_PATH = [[712, 668], ...RIVER.slice(1).map(([x, y]) => [x - 30, y - 30]), [330, 1090], [258, 1122]];
SCENES.end = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('end'), tn = VW('end', 'nếm'), tm = VW('end', 'mặn'), th = VW('end', 'nhớ'), tp = VW('end', 'một'), tg = VW('end', 'từng'), td = VW('end', 'đá');
  coast();
  // the hero: exact on the beach until 51.0, hops into the sea on "nếm", floats and bobs
  const [bx, by] = HERO_BEACH, SX = 175, SY = 1112, t0 = e0 + 0.5, tj = Math.max(t0, tn - 0.05);
  const j = EZ.io(seg(TT, tj, tj + 0.45));
  let hx = lerp(bx, SX, j), hy = lerp(by, SY, j) - 90 * Math.sin(Math.PI * j);
  if (TT < t0) { hx = bx; hy = by; }
  const fl = seg(TT, tj + 0.45, tj + 0.8);
  hx += 10 * Math.sin(TAU * (TT - tj) / 3.4) * fl; hy += 6 * Math.sin(TAU * (TT - tj) / 1.5) * fl;
  // the splash on landing
  sparkle(SX, SY + 20, 80, seg(TT, tj + 0.4, tj + 0.8), 'c_esp', COL.water);
  // the sip from the sea, then the "mặn!" shake
  const ts = tj + 0.5;
  let ra = -0.6;
  if (TT >= ts && TT < ts + 0.15) ra = lerp(-0.6, -1.2, seg(TT, ts, ts + 0.15));
  else if (TT >= ts + 0.15 && TT < ts + 0.4) ra = lerp(-1.2, 2.9, EZ.io(seg(TT, ts + 0.15, ts + 0.4)));
  else if (TT >= ts + 0.4 && TT < ts + 0.7) ra = 2.9;
  else if (TT >= ts + 0.7 && TT < ts + 1.0) ra = lerp(2.9, -0.6, EZ.io(seg(TT, ts + 0.7, ts + 1.0)));
  const pk = EZ.back(ev(td + 0.1, 0.35)), pa = lerp(-0.6, 1.0, pk) + 0.12 * Math.sin(TAU * (TT - td) / 0.9) * seg(TT, td + 0.5, td + 0.9);
  const shake = 0.12 * Math.sin(TT * 28) * Math.sin(Math.PI * seg(TT, tm + 0.15, tm + 0.75));
  const hop = c_hop(th, 0.35) + c_hop(td + 0.05, 0.4);
  const mood = TT < ts + 0.45 ? 'calm' : TT < tm + 0.2 ? 'puzzled' : TT < th ? 'wow' : TT < tp ? 'happy' : TT < td ? 'calm' : 'happy';
  const look = TT < tj ? [-0.3, 0.6] : TT < th ? [0.1, 0.3] : TT < tp ? [0, 0] : TT < td + 0.3 ? [0.6, -0.9] : [1, -0.4];
  const inSea = TT > tj + 0.35;
  heroGiot(hx, hy - 20 * hop, HR, { key: 'hero', look, mood, rot: shake, legs: !inSea, arms: [inSea ? pa : -0.6, ra], sx: 1 - 0.05 * hop, sy: 1 + 0.07 * hop });
  const dk = ev(ts + 0.12, 0.12) * (1 - seg(TT, ts + 0.5, ts + 0.65));
  if (dk > 0.01) { const [qx, qy] = c_hand(hx, hy - 20 * hop, HR, 1, ra); c_drop(qx, qy - 16, 19 * dk, 'c_esip'); }
  // "mặn!" (plum: salt), holds 2 s, gone before the thought bubble
  alphaDo(1 - seg(TT, tp - 0.2, tp + 0.05), () => {
    const [x0, x1] = label('mặn!', 330, 960, 76, { col: COL.salt, reveal: ev(tm + 0.15, 0.3), key: 'c_lmn' });
    underline(x0, x1, 982, { col: COL.salt, w: 5, key: 'c_umn', part: ev(tm + 0.5, 0.25) });
  });
  // the thought bubble: two little puffs rising from the hero, then the cloud-shaped bubble
  const bk = ev(tp, 0.4), BX = 330, BY = 790;
  const puff = (x, y, rr, k, key) => { if (k <= 0.01) return; const P = loopPts(x, y, rr * EZ.back(k), rr * EZ.back(k), 0.05); gfill(P, SK.card, { key: key + 'f' }); gline(P, { w: 4, key: key + 'o', second: false }); };
  puff(232, 1010, 18, ev(tp - 0.2, 0.25), 'c_p1');
  puff(268, 945, 24, ev(tp - 0.05, 0.25), 'c_p2');
  if (bk > 0.01) {
    const s = EZ.back(bk), C = [];
    for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU, bump = 1 + 0.07 * Math.abs(Math.sin(a * 4.5)); C.push([BX + Math.cos(a) * 172 * s * bump, BY + 4 * Math.sin(TT * 1.4) + Math.sin(a) * 112 * s * bump]); }
    gfill(C, SK.card, { key: 'c_bbf' });
    gline(C, { w: 5, key: 'c_bbo', closed: true });
    // inside: a little mountain, the rock in front of it, then the salt grain popping out of the rock
    const mk = ev(tp + 0.25, 0.4);
    gpencil([[200, 860], [262, 745], [300, 712], [340, 742], [420, 860]], { w: 4, key: 'c_bm', part: mk, a: 0.85 });
    const rk = ev(tg - 0.2, 0.4);
    if (rk > 0.01) {
      const R = loopify([[230, 870], [240, 820], [285, 795], [335, 805], [365, 840], [355, 878]]);
      gfill(R, COL.rock, { key: 'c_brf', a: rk });
      litHatch(R, { ang: -0.9, gap: 12, col: SK.graph, w: 2.4, a: 0.6 * rk, key: 'c_brh' });
      gline(R, { w: 4.5, key: 'c_bro', closed: true, part: rk });
    }
    const gk = ev(td, 0.35);
    saltGrain(lerp(330, 412, EZ.o2(gk)), lerp(830, 790, EZ.o2(gk)) + 4 * Math.sin(TT * 2.4), 24, { part: gk, key: 'c_bg', rot: 0.2 * Math.sin(TT * 1.7) });
  }
  // the dashed pencil path: mountain -> river -> sea (to the hero), then a grain rides it down
  const pp = EZ.io(ev(td + 0.05, 1.1));
  c_dashed(c_PATH, pp, 'c_dp');
  const gu = EZ.io(seg(TT, td + 0.6, td + 2.2));
  if (TT > td + 0.6) { const [gx, gy] = c_at(c_PATH, gu); saltGrain(gx, gy + 3 * Math.sin(TT * 2.2), 20, { part: ev(td + 0.6, 0.25), key: 'c_eg', rot: 0.3 * Math.sin(TT * 2) }); }
  viTag('nhớ nhé!');
  pageCaption(['Một phần vị mặn', 'từng là đá núi'], [[1, 'đá núi']], { size: 62, at: 0.25 });
};
