// =====================================================================
//  SC-RING — one (each drop sends the eye ONE colour: high drop red, low drop violet), circle (every drop at that
//  angle around the head's shadow lights up: a ring; the part under the horizon = dashes), payoff (SLAM: seen from a
//  plane, the rainbow is a full circle around the plane's shadow; the ground only hides the lower part).
//  Colour: TERRACOTTA = hero · SPEC = light · pale yellow = sunlight · grey-blue = water · graphite = ground/cloud/guides.
// =====================================================================
// a label written on at t0 (over d), faded out over [t1 - 0.3, t1]
function r_label(str, x, y, size, t0, t1, o = {}) {
  const f = t1 == null ? 1 : 1 - seg(TT, t1 - 0.3, t1); if (TT < t0 || f <= 0) return;
  alphaDo(f, () => label(str, x, y, size, { reveal: o.now ? 1 : ev(t0, o.d ?? 0.35), key: 'r_lb' + str, align: o.align, col: o.col }));
}
// clip to the band y0..y1 (screen-world coords) and run f
function r_clipY(y0, y1, f) { ctx.save(); ctx.beginPath(); ctx.rect(-400, y0, W + 800, y1 - y0); ctx.clip(); f(); ctx.restore(); }

// ---------------------------------------------------------------------
//  ONE — "Nên mỗi giọt chỉ gửi tới mắt bạn một màu: giọt cao màu đỏ, giọt thấp màu tím."
//  Side view. Two drops in the rain; each gets a thin white beam from the left; each sends out a 6-ray fan (dropTrace)
//  down-left. The drop is placed so that ONE colour's exit ray passes exactly through SIDE_EYE: the HIGH drop's red
//  (steepest), the LOW drop's violet (shallowest). From the high drop the other colours pass ABOVE the eye; from the
//  low drop the others pass BELOW it (they hit the ground in front of the hero).
// ---------------------------------------------------------------------
const r_DR = 36, r_DX = 765;
// centre y so that colour n's exit ray (from P2 along d3) passes through the eye
function r_dropY(cx, n) {
  const t = dropTrace(0, 0, r_DR, n), P2x = cx + t.P2[0], s = (P2x - SIDE_EYE[0]) / -t.d3[0];
  return SIDE_EYE[1] - s * t.d3[1] - t.P2[1];
}
const r_HI = [r_DX, r_dropY(r_DX, SPEC[0].n)], r_LO = [r_DX, r_dropY(r_DX, SPEC[5].n)];
// the polyline of colour c leaving drop D: exit P2 -> until x reaches the eye's x (or the ground)
function r_ray(D, c, hitsEye) {
  const t = dropTrace(D[0], D[1], r_DR, c.n);
  if (hitsEye) return [t.P2, SIDE_EYE.slice()];
  let s = (t.P2[0] - (SIDE_EYE[0] - 20)) / -t.d3[0];
  const sg = (SD_GROUND - 6 - t.P2[1]) / t.d3[1]; s = Math.min(s, sg);
  return [t.P2, [t.P2[0] + s * t.d3[0], t.P2[1] + s * t.d3[1]]];
}
// one lit drop: beam in (part kb), path inside (red), fan out (part kf), the chosen colour bold (part kc)
function r_litDrop(D, ci, kb, kf, kc, key, fade) {
  const t0 = dropTrace(D[0], D[1], r_DR, SPEC[ci].n);
  if (kb > 0.01) sunBeam([60, t0.P0[1]], t0.P0, 16, { part: kb, key: key + 'bm', a: fade });
  raindrop(D[0], D[1], r_DR, { key: key + 'd' });
  if (kf > 0.01) alphaDo(fade, () => {
    // the light inside the drop (in at P0, bounce at P1, out at P2), drawn thin in the chosen colour
    gline(writeOn([t0.P0, t0.P1, t0.P2], clamp(kf * 3)) || [t0.P0, t0.P0], { w: 3, col: SPEC[ci].col, key: key + 'in', second: false, amp: 0.3 });
    SPEC.forEach((c, i) => { if (i !== ci) lightRay(r_ray(D, c, false), c.col, { part: kf, w: 4, a: 0.45, key: key + 'f' + i }); });
  });
}
SCENES.one = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('one'), END = EE('one'), off = END - 0.5;
  const tMoi = VW('one', 'mỗi'), tMat = VW('one', 'mắt'), tCao = VW('one', 'cao'), tDo = VW('one', 'đỏ');
  const tG3 = VW('one', 'giọt', 3), tThap = VW('one', 'thấp'), tTim = VW('one', 'tím');
  const tHi = VW('one', 'giọt', 2), tLo = tG3 - 0.1;
  groundLine(SD_GROUND);
  sunDisc(...SUN_SIDE);
  rainCloud(...CLOUD_SIDE);
  rainCurtain(RAIN_X0, RAIN_X1, 540, SD_GROUND, { a: 0.45, n: 5 });
  // the drops: drawn on during "mỗi giọt", wobble a little as they fall-hang in the rain
  const fade = 1 - seg(TT, off - 0.3, off) * 0.5;
  const Dh = r_HI, Dl = r_LO;
  const dpart = ev(tMoi, 0.5);
  if (dpart < 1) {
    raindrop(Dh[0], Dh[1], r_DR, { key: 'r_hid', part: dpart });
    raindrop(Dl[0], Dl[1], r_DR, { key: 'r_lod', part: ev(tMoi + 0.25, 0.5) });
  } else {
    // HIGH drop: beam on "giọt cao", fan as "cao" is said, red bold to the eye on "đỏ"
    r_litDrop(Dh, 0, ev(tHi, 0.6), ev(tCao - 0.4, 0.7), 0, 'r_hi', fade);
    // LOW drop: beam on the 3rd "giọt", fan, violet bold to the eye on "thấp … tím"
    r_litDrop(Dl, 5, ev(tLo, 0.6), ev(tLo + 0.55, 0.7), 0, 'r_lo', fade);
  }
  // "mắt bạn": a small graphite ring pulses around the eye
  const em = Math.sin(Math.PI * seg(TT, tMat - 0.1, tMat + 0.9));
  if (em > 0.01) gpencil(loopPts(SIDE_EYE[0] + 8, SIDE_EYE[1], 34, 30, 0.1), { w: 3.5, key: 'r_eyer', a: 0.8 * em });
  // the hero: faces right; looks up at the high drop, then the low one; still at both boundaries
  const look = TT < tHi ? [1, -0.3] : TT < tLo ? [0.8, -0.8] : TT < off - 0.3 ? [0.9, -0.55] : [1, -0.3];
  const mood = (TT > tDo && TT < tDo + 0.8) || (TT > tTim && TT < tTim + 0.7) ? 'wow' : 'calm';
  heroGiot(SIDE_HERO[0], SIDE_HERO[1], HR, { key: 'hero', look, mood, legs: true });
  // the ONE colour that reaches the eye: drawn over the hero, bold, its head at the eye
  const kr = ev(tCao + 0.2, 0.5), kv = ev(tThap + 0.1, 0.5);
  lightRay(r_ray(Dh, SPEC[0], true), SPEC[0].col, { part: kr, w: 8, key: 'r_hir', a: fade });
  lightRay(r_ray(Dl, SPEC[5], true), SPEC[5].col, { part: kv, w: 8, key: 'r_lov', a: fade });
  sparkle(SIDE_EYE[0] - 6, SIDE_EYE[1] - 4, 40, seg(TT, tCao + 0.65, tCao + 1.35), 'r_sp1', SPEC[0].col);
  sparkle(SIDE_EYE[0] - 6, SIDE_EYE[1] - 4, 40, seg(TT, tThap + 0.55, tThap + 1.25), 'r_sp2', SPEC[5].col);
  // labels: "đỏ" by the high drop, "tím" by the low drop (right of them), the exaggeration note under the ground
  r_label('đỏ', Dh[0] + 76, Dh[1] + 20, 60, tCao, off, { col: SPEC[0].col });
  r_label('tím', Dl[0] + 84, Dl[1] + 20, 60, tLo, off, { col: SPEC[5].col });
  r_label('(vẽ phóng đại)', 700, 1245, 50, tCao + 0.3, off, { col: SK.graph });
  viTag('mỗi giọt một màu');
  pageCaption(['Mỗi giọt gửi mắt', 'chỉ một màu'], [[1, 'một màu']], { size: 62, at: 0.3 });
};

// ---------------------------------------------------------------------
//  CIRCLE — "Mọi giọt nằm đúng góc ấy quanh bóng đầu bạn cùng sáng lên, thành một vòng."
//  Back view. The hero's shadow runs up from its feet to the head-shadow dot (ANTI). 7 drops light up one after
//  another on the arc (radius = the middle of the bow) above the horizon, each turning into a short piece of the bow;
//  on "thành một vòng" the part below the horizon is drawn as graphite dashes, completing the circle.
// ---------------------------------------------------------------------
const r_RM = BOW_R - BOW_W / 2, r_NA = 7, r_A0 = Math.PI + 0.17, r_A1 = TAU - 0.17;
const r_ang = (i) => lerp(r_A0, r_A1, i / (r_NA - 1));
const r_DA = (r_A1 - r_A0) / (r_NA - 1);
// the head shadow + the shadow strip from the feet up to it (graphite, lying on the ground, pointing AWAY from us)
function r_shadow(part, key) {
  if (part <= 0.01) return;
  const fy = BACK_HERO[1] + HR * 1.42, ty = lerp(fy, ANTI[1], part);
  const S = [[BACK_HERO[0] - 34, fy], [BACK_HERO[0] - 22, ty + 6], [BACK_HERO[0] + 22, ty + 6], [BACK_HERO[0] + 34, fy]];
  gfill(S, SK.graphL, { key: key + 's', a: 0.45, off: [0, 0] });
  if (part > 0.85) {
    const k = seg(part, 0.85, 1), C = loopPts(ANTI[0], ANTI[1], 34 * k, 24 * k, 0.05);
    gfill(C, SK.graph, { key: key + 'h', a: 0.7, off: [0, 0] });
  }
}
SCENES.circle = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('circle');
  const tMoi = VW('circle', 'mọi'), tBong = VW('circle', 'bóng'), tSang = VW('circle', 'sáng'), tLen = VW('circle', 'lên');
  const tThanh = VW('circle', 'thành'), tVong = VW('circle', 'vòng');
  groundLine(BK_HORIZON, { key: 'r_hz' });
  // the shadow draws up from the feet (after the bridge), the head-shadow dot at ANTI
  r_shadow(EZ.o2(seg(TT, E + 0.5, E + 1.3)), 'r_sh');
  // drops light up left -> right, then each widens into its piece of the bow (clipped above the horizon)
  const tD0 = tMoi + 0.5, dT = (tSang - tD0) / (r_NA - 1);
  r_clipY(-400, BK_HORIZON, () => {
    for (let i = 0; i < r_NA; i++) {
      const ti = tD0 + i * dT, a = r_ang(i), k = EZ.o2(seg(TT, ti + 0.6, ti + 1.1));
      if (k > 0.01) {
        const hw = (r_DA / 2 + 0.012) * k + 0.02;
        rainbowArc(ANTI[0], ANTI[1], BOW_R, BOW_W, a - hw, a + hw, { key: 'r_pc' + i });
      }
    }
  });
  for (let i = 0; i < r_NA; i++) {
    const ti = tD0 + i * dT, a = r_ang(i), x = ANTI[0] + r_RM * Math.cos(a), y = ANTI[1] + r_RM * Math.sin(a);
    const fa = 1 - seg(TT, ti + 0.75, ti + 1.1);
    if (TT >= ti && fa > 0.01) {
      // a drop appears and lights up (a pale sunlight glow behind it), then melts into the band
      const g = Math.sin(Math.PI * seg(TT, ti + 0.1, ti + 0.9));
      alphaDo(fa, () => {
        if (g > 0.01) gfill(loopPts(x, y, 34, 34, 0), COL.beam, { key: 'r_gl' + i, a: 0.9 * g, off: [0, 0] });
        raindrop(x, y, 20, { key: 'r_cd' + i, part: ev(ti, 0.25) });
      });
    }
  }
  // "thành một vòng": the hidden part under the horizon, graphite dashes, drawn on clockwise from the right end;
  // faint where it crosses the caption band
  const kd = EZ.io(seg(TT, tThanh, tVong + 0.4));
  if (kd > 0.01) {
    const a0 = -0.21, a1 = Math.PI + 0.21;
    r_clipY(BK_HORIZON, 1285, () => rainbowArc(ANTI[0], ANTI[1], BOW_R, BOW_W, a0, a1, { dashed: true, part: kd, key: 'r_dash' }));
    r_clipY(1285, 1600, () => rainbowArc(ANTI[0], ANTI[1], BOW_R, BOW_W, a0, a1, { dashed: true, part: kd, key: 'r_dash', a: 0.22 }));
  }
  // the hero, from behind, looking up at its bow; a small nod as the ring closes
  const nod = Math.sin(Math.PI * seg(TT, tVong, tVong + 0.5)) * 6;
  heroBack(BACK_HERO[0], BACK_HERO[1] - nod, HR, { key: 'heroB' });
  // labels: "bóng đầu bạn" above the head-shadow with a pencil arrow to it; "một vòng" inside the bow
  r_label('bóng đầu bạn', ANTI[0], 935, 54, tBong);
  if (TT > tBong + 0.3) arrowPencil([[ANTI[0] + 70, 950], [ANTI[0] + 58, 995], [ANTI[0] + 30, 1022]], ev(tBong + 0.3, 0.3), { key: 'r_bar', w: 3.5 });
  r_label('một vòng', ANTI[0], 810, 64, tThanh - 0.1);
  viTag('quanh bóng đầu');
  pageCaption(['Quanh bóng đầu', 'thành một vòng'], [[1, 'một vòng']], { size: 62, at: 0.3 });
};

// ---------------------------------------------------------------------
//  PAYOFF (opens on the SLAM, complete from its first frame) —
//  "Cầu vồng thật ra là một vòng tròn trọn vẹn, mặt đất chỉ che mất phần dưới!"
//  Seen from a plane: the hero in a small doodle plane (top-left), a soft cloud layer below, a FULL-circle rainbow
//  (red outside) around the plane's small shadow. On "mặt đất" a graphite ground band slides up over the lower part
//  (the hidden part turns to dashes), then slides back down.
// ---------------------------------------------------------------------
const r_PC = [560, 880], r_PR = 300, r_PW = 80, r_PH = 0.4;    // circle centre, radius, band; plane heading (rad)
// a doodle plane seen from above, heading `ang`, centre (x, y), scale s. ink outline on paper, or a graphite shadow.
function r_plane(x, y, s, ang, key, shadow) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const F = loopPts(10, 0, 140, 40, 0, 0, 36);
  const Wg = [[-20, 0], [-40, -112], [-6, -112], [44, 0], [-6, 112], [-40, 112]];
  const T = [[-112, 0], [-140, -44], [-122, -44], [-96, 0], [-122, 44], [-140, 44]];
  if (shadow) {
    for (const [P, k] of [[Wg, 'w'], [T, 't'], [F, 'f']]) scribbleFill(P, SK.graph, { key: key + k, gap: 9, w: 3, base: 0.45, a: 0.7 });
  } else {
    for (const [P, k] of [[Wg, 'w'], [T, 't']]) { gfill(P, SK.sheet, { key: key + k + 'p' }); gline(closeP(P), { w: 4.5, key: key + k + 'o', amp: 0.8 }); }
    gfill(F, SK.sheet, { key: key + 'fp' }); gline(F, { w: 5, key: key + 'fo', amp: 0.8 });
    gpencil([[120, -14], [136, 0], [120, 14]], { w: 3, key: key + 'nz' });
  }
  ctx.restore();
}
// a soft cloud (seen from above): pale wash, faint graphite outline
function r_cloud(x, y, s, key) {
  const C = loopify([[x - 170 * s, y + 30 * s], [x - 150 * s, y - 40 * s], [x - 60 * s, y - 70 * s], [x + 50 * s, y - 60 * s], [x + 160 * s, y - 30 * s], [x + 175 * s, y + 40 * s], [x + 60 * s, y + 70 * s], [x - 70 * s, y + 66 * s]]);
  gfill(C, '#e6e2db', { key: key + 'f', a: 0.9 });
  gpencil(closeP(C), { w: 3, key: key + 'o', a: 0.45 });
}
SCENES.payoff = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('payoff'), END = EE('payoff'), still = END - 0.5;
  const tTron = VW('payoff', 'tròn'), tMat = VW('payoff', 'mặt'), tChe = VW('payoff', 'che');
  // the cloud layer far below, drifting slowly
  const dr = 10 * (TT - E);
  r_cloud(300 + dr, 790, 1.15, 'r_c1');
  r_cloud(830 - dr * 0.8, 960, 1.05, 'r_c2');
  r_cloud(470 + dr * 0.6, 1120, 0.95, 'r_c3');
  // the ground band (on "mặt đất"): its top edge rises over the lower part of the circle, holds, slides back
  const up = EZ.io(seg(TT, tMat - 0.1, tMat + 0.4)) * (1 - EZ.io(seg(TT, tChe - 0.1, tChe + 0.35)));
  const gy = lerp(1300, 905, up);
  // the full circle: colour above the ground edge, dashes below it; a slow shimmer (alpha breath + travelling sparkle)
  const sh = 0.92 + 0.08 * Math.sin(TT * 2.4);
  r_clipY(-400, gy, () => rainbowArc(r_PC[0], r_PC[1], r_PR, r_PW, 0, TAU, { key: 'r_full', a: sh }));
  if (up > 0.01) {
    const G = [[-60, gy], [1140, gy + 4], [1140, 1255], [-60, 1255]];
    gfill(G, '#cfc9c0', { key: 'r_gbf', a: 0.75 * clamp(up * 3), off: [0, 0] });
    r_clipY(gy, 1255, () => rainbowArc(r_PC[0], r_PC[1], r_PR, r_PW, 0, TAU, { key: 'r_fulld', dashed: true }));
    gline([[-60, gy], [1140, gy + 4]], { w: 6, key: 'r_gbl' });
    for (let i = 0; i < 5; i++) { const x = 120 + i * 200; gpencil([[x, gy], [x - 7, gy - 18]], { w: 3, key: 'r_gg' + i, a: 0.7 }); }
  }
  // the plane's shadow at the centre of the circle (the "head shadow" of everyone on board)
  const bob = Math.sin(TAU * (TT - E) / 1.6) * (1 - seg(TT, still - 0.6, still - 0.1));
  const sp = (k) => [r_PC[0] + 4 * Math.sin(TT * 1.6 + k), r_PC[1]];
  r_plane(...sp(0), 0.3, r_PH, 'r_psh', true);
  // a sparkle running round the ring
  const sa = TT * 1.3, rr = r_PR - r_PW / 2;
  sparkle(r_PC[0] + rr * Math.cos(sa), r_PC[1] + rr * Math.sin(sa), 44, ((TT - E) * 0.9) % 1, 'r_spk', SK.ink);
  // the plane with the hero in it (top-left), bobbing; hero exact at PAYOFF_HERO for the bridge
  const by = 7 * bob;
  r_plane(PAYOFF_HERO[0], PAYOFF_HERO[1] + by, 0.8, r_PH + 0.04 * bob, 'r_pl', false);
  const look = TT < tMat - 0.2 ? [0.6, 0.8] : TT < tChe + 0.4 ? [0.4, 1] : [0.6, 0.8];
  const mood = TT < tTron + 1.2 ? 'wow' : TT < still ? 'happy' : 'wow';
  heroGiot(PAYOFF_HERO[0], PAYOFF_HERO[1] + by, HR, { key: 'hero', look, mood });
  // labels (already written on the cut)
  r_label('vòng tròn trọn vẹn', 640, 532, 56, E - 1, still, { now: true });
  if (up > 0.01) alphaDo(clamp(up * 2 - 1), () => label('mặt đất', 820, gy + 110, 54, { key: 'r_md', col: SK.ink }));
  viTagNow('nhìn từ máy bay');
  pageCaption(['Cầu vồng thật ra', 'là vòng tròn!'], [[1, 'vòng tròn']], { size: 62, at: -10 });
};
