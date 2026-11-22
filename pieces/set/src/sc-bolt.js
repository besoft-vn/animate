// =====================================================================
//  SC-BOLT — leader, meet, strike, thunder. All on the hill (stormCloud, hill, tree), the same channel points
//  (BOLT_LEADER + BOLT_STREAM) so the faint leader, the streamer and the blazing return stroke agree.
// =====================================================================
// ---- path helpers: cumulative lengths, a point at fraction u, the sub-path between fractions a..b
function b_cum(P) { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + dist(P[i - 1], P[i])); return L; }
function b_at(P, u) {
  const L = b_cum(P), T = L[L.length - 1], s = clamp(u) * T;
  for (let i = 1; i < P.length; i++) if (s <= L[i] || i === P.length - 1) { const k = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return [lerp(P[i - 1][0], P[i][0], clamp(k)), lerp(P[i - 1][1], P[i][1], clamp(k))]; }
  return P[P.length - 1];
}
function b_sub(P, a, b) {
  a = clamp(a); b = clamp(b); if (b - a < 1e-4) return null;
  const L = b_cum(P), T = L[L.length - 1], out = [b_at(P, a)];
  for (let i = 1; i < P.length - 1; i++) { const f = L[i] / T; if (f > a && f < b) out.push(P[i]); }
  out.push(b_at(P, b));
  return out;
}
// a crisp straight-segment stroke through exactly the given vertices (no smoothing: same jags as leader/streamer)
function b_stroke(P, w, col, a = 1) {
  if (!P || P.length < 2 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = 'miter'; ctx.miterLimit = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); ctx.stroke(); ctx.restore();
}
// the blazing channel: halo, ink rim, yellow core, white heart — straight through the channel vertices
function b_bolt(P, w, halo, a = 1) {
  b_stroke(P, w * 3.2, COL.flash, 0.3 * halo * a);
  b_stroke(P, w + 10, SK.ink, a);
  b_stroke(P, w, COL.flash, a);
  b_stroke(P, w * 0.32, SK.sheet, 0.9 * a);
}
// the full channel, ordered the way the return stroke runs: tree top -> MEET -> cloud base
const b_FULL = [...BOLT_STREAM].reverse().concat([...BOLT_LEADER].reverse().slice(1));
const b_STREAM_UP = [...BOLT_STREAM].reverse();
// leader stepping: 7 steps from "dò" to just before 28.0 (hero at MEET by then); each = a 2-frame jump + a hold
const b_LD_T0 = () => VW('leader', 'dò');
const b_LD_DT = () => (27.9 - b_LD_T0()) / (BOLT_LEADER.length - 1);
const b_JUMP = 2 / 24;
// how many steps are done (fractional only during a jump)
function b_steps(t) {
  const t0 = b_LD_T0(), dt = b_LD_DT(), n = BOLT_LEADER.length - 1;
  if (t <= t0) return 0;
  const i = Math.floor((t - t0) / dt); if (i >= n) return n;
  return i + EZ.o2(seg(t - t0 - i * dt, 0, b_JUMP));
}
// the leader's tip after s steps (s fractional) and the matching write-on fraction of BOLT_LEADER
function b_tip(s) { const i = Math.min(Math.floor(s), BOLT_LEADER.length - 2), k = s - i; return [lerp(BOLT_LEADER[i][0], BOLT_LEADER[i + 1][0], k), lerp(BOLT_LEADER[i][1], BOLT_LEADER[i + 1][1], k)]; }
function b_part(s) { const L = b_cum(BOLT_LEADER), T = L[L.length - 1], i = Math.min(Math.floor(s), BOLT_LEADER.length - 2), k = s - i; return (L[i] + (L[i + 1] - L[i]) * k) / T; }
// two short faint side branches that grow for 2 steps, then stop
const b_BR = [
  { from: 2, P: [[450, 748], [418, 774], [426, 802], [396, 830]] },
  { from: 4, P: [[530, 808], [504, 836], [516, 864]] },
];
function b_branches(s, a = 0.55) {
  b_BR.forEach((b, j) => { const k = clamp((s - b.from) / 2); if (k > 0) leaderPath(b.P, k, { key: 'b_br' + j, w: 3.5, a }); });
}
// the row of "−" charges under the cloud base (skips the hero's spot), jiggling; pop = 0..1 per sign
const b_CHX = [150, 260, 590, 710, 830];
function b_charges(popT, swellT) {
  b_CHX.forEach((x, i) => {
    const k = popT == null ? 1 : popS(popT + i * 0.16); if (k <= 0) return;
    const sw = swellT == null ? 0 : 0.18 * Math.sin(Math.PI * seg(TT, swellT + i * 0.05, swellT + 0.5 + i * 0.05));
    const jx = 5 * Math.sin(TT * 2.3 + i * 1.7), jy = 4 * Math.sin(TT * 3.1 + i * 2.3);
    chargeSign(x + jx, 668 + jy, 22 * k * (1 + sw), -1, { key: 'b_ch' + i });
  });
}
// a short fade-in/out factor for a label: in at t0 (over d), out over [t1 - 0.3, t1]
const b_fade = (t1) => 1 - seg(TT, t1 - 0.3, t1);
function b_label(str, x, y, size, t0, t1, o = {}) {
  const f = t1 == null ? 1 : b_fade(t1); if (TT < t0 || f <= 0) return;
  ctx.save(); ctx.globalAlpha *= f;
  label(str, x, y, size, { reveal: ev(t0, o.d ?? 0.3), key: 'b_lb' + str, align: o.align, col: o.col });
  ctx.restore();
}
// a cubic Bezier point
const b_bz = (t, A, B, C, D) => [0, 1].map((j) => (1 - t) ** 3 * A[j] + 3 * (1 - t) ** 2 * t * B[j] + 3 * (1 - t) * t * t * C[j] + t ** 3 * D[j]);

// ---- LEADER: "Khi điện tích đủ lớn, một tia tiên đạo mờ dò đường xuống, từng bước ngắn."
SCENES.leader = function () {
  sketchPage({ grid: 'plain' });
  const tTich = VW('leader', 'tích'), tLon = VW('leader', 'lớn'), tTien = VW('leader', 'tiên'), tDo = b_LD_T0(), tTung = VW('leader', 'từng');
  stormCloud({ dark: 0.6 + 0.25 * Math.sin(TT * 1.3) });
  hill(); tree();
  // the "−" charges gather along the cloud base ("điện tích đủ lớn"), swelling on "lớn"
  b_charges(tTich - 0.05, tLon);
  // the faint stepped leader, step by step, + 2 short side branches that stop
  const s = b_steps(TT);
  b_branches(s);
  if (s > 0) leaderPath(BOLT_LEADER, b_part(s), { tip: true, key: 'b_ld' });
  // the hero rides the tip; before "dò" it hovers at the cloud base peering down (exact at the bridge)
  let [hx, hy] = BR.chargeLeader.b;
  if (TT < tDo) {
    const env = Math.sin(Math.PI * seg(TT, ET('leader') + 0.5, tDo));
    hx += 18 * Math.sin(2 * Math.PI * seg(TT, ET('leader') + 0.5, tDo)) * env; hy += 16 * env;
  } else [hx, hy] = b_tip(s);
  if (TT >= 28.0) [hx, hy] = BR.leaderMeet.a;
  const hop = s % 1 > 0 && s < BOLT_LEADER.length - 1 ? Math.sin(Math.PI * (s % 1)) : 0;
  heroTia(hx, hy, HR, { key: 'hero', badge: 1, look: TT < tDo ? [0.2 * Math.sin(TT * 1.5), 1] : [0.5, 1], mood: 'calm', sx: 1 + 0.08 * hop, sy: 1 - 0.08 * hop });
  // labels (left of the path) — off ≥ 0.5 s before the bridge to "meet"
  const off = ET('meet') - 0.55;
  b_label('tia tiên đạo', 245, 930, 58, tTien, off);
  b_label('(mờ)', 245, 1000, 58, tTien + 0.4, off);
  if (TT > tTien + 0.3 && TT < off) { ctx.save(); ctx.globalAlpha *= b_fade(off); arrowPencil([[330, 880], [400, 800]], ev(tDo, 0.3), { key: 'b_lda', w: 4 }); ctx.restore(); }
  b_label('từng bước', 800, 760, 54, tTung, off, { d: 0.35 });
  viTag('tia tiên đạo');
  pageCaption(['Tia tiên đạo mờ', 'dò từng bước xuống'], [[1, 'từng bước']], { size: 62, at: 0.3 });
};

// ---- MEET: "Gần mặt đất, một tia ngược từ ngọn cây vươn lên, và hai tia chạm nhau."
SCENES.meet = function () {
  sketchPage({ grid: 'plain' });
  const tNguoc = VW('meet', 'ngược'), tCay = VW('meet', 'cây'), tLen = VE('meet', 'lên'), tCham = VW('meet', 'chạm'), tTouch = tCham + 0.3;
  stormCloud({ dark: 0.6 + 0.25 * Math.sin(TT * 1.3) });
  hill(); tree();
  b_charges(null, null);
  b_branches(9, 0.45);
  leaderPath(BOLT_LEADER, 1, { tip: true, key: 'b_ld' });
  // the streamer grows UP from the tree top: most of the way by "lên", the last bit on "chạm"
  const sp = 0.8 * EZ.o2(seg(TT, tNguoc, tLen)) + 0.2 * EZ.io(seg(TT, tCham, tTouch));
  if (sp > 0) {
    const Q = writeOn(b_STREAM_UP, sp);
    if (Q && Q.length > 1) { b_stroke(Q, 7, SK.graph, 1); gpencil(Q, { key: 'b_st', w: 4, a: 0.9, amp: 1 }); }
    if (sp < 1) { const [ex, ey] = b_at(b_STREAM_UP, sp); gpencil(loopPts(ex, ey, 12, 12, 0.1), { key: 'b_stt', w: 3, a: 0.7 }); }
  }
  // "+" near the tree top (blue = positive), drifting up a little
  [[778, 1010], [624, 1030]].forEach(([x, y], i) => { const k = popS(tCay + i * 0.2); if (k > 0) chargeSign(x + 4 * Math.sin(TT * 2 + i), y - 10 * Math.sin(TT * 1.6 + i * 2), 22 * k, 1, { key: 'b_pp' + i }); });
  // the hero: exact at MEET at the bridge, then steps aside (by 30.2) to STRIKE_HERO so the touch is seen; bobs till 33.5
  const mv = EZ.io(seg(TT, 29.0, 30.2));
  const [mx, my] = b_bz(mv, MEET, [700, 800], [800, 720], STRIKE_HERO);
  const env = seg(TT, 30.2, 30.7) * (1 - seg(TT, 33.0, 33.5));
  const hx = mx + 8 * Math.sin((TT - 30.2) * 1.9) * env, hy = my - 16 * Math.abs(Math.sin((TT - 30.2) * 2.4)) * env;
  const wow = TT >= tTouch, br = TT > 33.0 ? 0.02 * Math.sin(TT * 3) : 0;
  heroTia(hx, hy, HR, { key: 'hero', badge: 1, mood: wow ? 'wow' : 'calm', look: TT < tNguoc ? [0.3 * Math.sin(TT), 0.9] : [0.6, 1], sx: 1 - br, sy: 1 + br });
  // the touch: a brief pale yellow glow + an ink sparkle right at the meeting point
  const gk = TT < tTouch ? 0 : Math.exp(-(TT - tTouch) / 0.45) * Math.min(1, (TT - tTouch) / 0.08);
  if (gk > 0.02) { scribbleFill(loopPts(MEET[0], MEET[1], 44, 44, 0.05), COL.flash, { key: 'b_tgl', gap: 9, w: 5, base: 0.4, a: 0.85 * gk }); b_stroke([MEET, MEET], 26, '#fff6c4', gk); }
  sparkle(MEET[0], MEET[1], 95, seg(TT, tTouch, tTouch + 0.7), 'b_spk');
  b_label('tia ngược', 440, 1000, 56, tNguoc + 0.15, null);
  if (TT > tNguoc + 0.3) arrowPencil([[545, 975], [650, 928]], ev(tNguoc + 0.35, 0.3), { key: 'b_sta', w: 4 });
  viTag('tia ngược');
  pageCaption(['Tia ngược từ ngọn cây', 'vươn lên đón'], [[0, 'Tia ngược']], { size: 62, at: 0.3 });
};

// ---- STRIKE (opens on the SLAM): "Lập tức, một luồng sáng chói vọt từ đất ngược lên mây: đó là tia chớp ta thấy."
const b_RUNS = [[34.5, 0.85], [35.6, 0.4], [36.6, 0.4]];
SCENES.strike = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('strike'), tDat = VW('strike', 'đất');
  // extra glow: the slam bloom + a burst as each return stroke reaches the cloud
  let ex = Math.exp(-(TT - E) / 0.35);
  for (const [r, d] of b_RUNS) if (TT >= r) ex = Math.max(ex, TT < r + d ? 0.5 + 0.5 * (TT - r) / d : Math.exp(-(TT - r - d) / 0.3));
  const calm = EZ.io(seg(TT, 38.6, 39.6)), gp = 0.08 * Math.sin((TT - 39) * 2 * Math.PI / 1.3) * calm;
  const base = lerp(0.6, 0.3, calm) + gp, g = clamp(base + 0.4 * ex);
  stormCloud({ glow: g, dark: 0.5 });
  hill({ tint: clamp(lerp(0.45, 0.22, calm) + gp + 0.35 * ex) });
  tree({ lit: clamp(base + 0.4 * ex) });
  // the whole channel blazing, from the first frame
  b_bolt(b_FULL, 30 + 6 * ex, clamp(0.6 + 0.4 * ex + gp * 2));
  // the return stroke: a white-yellow pulse runs from the tree top UP to the cloud, 3× (flicker)
  for (const [r, d] of b_RUNS) {
    const u = (TT - r) / d; if (u < 0 || u > 1.2) continue;
    const big = d > 0.5 ? 1 : 0.7, Q = b_sub(b_FULL, u - (d > 0.5 ? 0.45 : 0.28), Math.min(1, u)); if (!Q) continue;
    b_stroke(Q, 90 * big, COL.flash, 0.5);
    b_stroke(Q, 38 * big, '#fffbe2', 0.97);
    if (u <= 1) { const [fx, fy] = b_at(b_FULL, u); b_stroke([[fx, fy], [fx, fy]], 120 * big, COL.flash, 0.55); b_stroke([[fx, fy], [fx, fy]], 62 * big, '#fffdf0', 1); }
  }
  // the big yellow up-arrow: from the ground up to the cloud (grows with the first run), then labelled
  const aOff = EE('strike') - 1.0, af = b_fade(aOff + 0.3);
  if (af > 0) {
    ctx.save(); ctx.globalAlpha *= af;
    bigArrow(330, 1100, 330, 760, { col: COL.flash, w: 60, head: 100, part: lerp(0.3, 1, EZ.o2(seg(TT, E, E + 0.85))), key: 'b_up', a: 1 });
    ctx.restore();
  }
  b_label('lên mây', 170, 800, 60, tDat - 0.55, aOff);
  b_label('từ đất', 170, 1090, 60, tDat - 0.6, aOff);
  // the hero: knocked aside, no badge, dazzled — shields its eyes, then lowers its arms as the glow calms
  let kick = 0; for (const [r] of b_RUNS) if (TT >= r) kick = Math.max(kick, Math.exp(-(TT - r) / 0.35) * Math.min(1, (TT - r) / 0.08));
  const env = 1 - EZ.io(seg(TT, 40.8, 41.6));
  const hx = STRIKE_HERO[0] + (26 * kick + 14 * Math.sin((TT - E) * 1.9)) * env, hy = STRIKE_HERO[1] + 14 * Math.sin((TT - E) * 2.7) * env;
  const arm = lerp(1.25, 0.45, EZ.io(seg(TT, 39.2, 39.8)));
  heroTia(hx, hy, HR, { key: 'hero', badge: 0, mood: 'wow', arms: [arm, arm], look: [-0.7, -0.3], rot: 0.12 * kick + 0.05 * Math.sin(TT * 1.7) * env });
  viTagNow('tia chớp');
  pageCaption(['Luồng sáng vọt', 'từ đất lên mây'], [[1, 'từ đất lên mây']], { size: 62, at: -10 });
};

// ---- THUNDER: "Không khí nở bung đột ngột, tạo thành tiếng nổ mà ta gọi là sấm."
SCENES.thunder = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('thunder'), tNo = VW('thunder', 'nở'), tBoom = VW('thunder', 'nổ'), off = EE('thunder') - 0.55;
  const fade = 1 - EZ.io(seg(TT, E, 50.0));
  stormCloud({ glow: 0.3 * fade, dark: 0.6 + 0.2 * Math.sin(TT * 1.4) });
  hill({ tint: 0.18 * fade }); tree({ lit: 0.3 * fade });
  // the channel dims out; a faint graphite trace stays where the air burst from
  leaderPath(b_FULL, 1, { key: 'b_ghost', w: 5, a: 0.5 * (1 - fade) + 0.1 });
  if (fade > 0.01) b_bolt(b_FULL, 26, 0.5 * fade, fade);
  // "nở bung": two chunky graphite arrows push OUTWARD from the channel, sliding out
  const pa = EZ.o2(seg(TT, tNo, tNo + 0.4)), push = 50 * EZ.o2(seg(TT, tNo, tNo + 2.0)), pf = 1 - seg(TT, tBoom + 0.6, tBoom + 1.0);
  if (pa > 0 && pf > 0) {
    ctx.save(); ctx.globalAlpha *= pf;
    bigArrow(470 - push * 0.4, 860, 300 - push, 860, { w: 38, head: 62, part: pa, key: 'b_pl' });
    bigArrow(640 + push * 0.4, 880, 790 + push * 0.3, 880, { w: 38, head: 62, part: pa, key: 'b_pr' });
    ctx.restore();
  }
  // "tiếng nổ": ≤ 4 sound rings expand from the channel's middle and fade
  for (let i = 0; i < 4; i++) {
    const u = seg(TT, tBoom + i * 0.32, tBoom + i * 0.32 + 1.5); if (u <= 0 || u >= 1) continue;
    soundRing(540, 820, lerp(60, 600, EZ.o2(u)), { key: 'b_sr' + i, w: 8 - 3 * u, a: 0.85 * (1 - u) });
  }
  // the big "ẦM…" (shaking), and "sấm"
  const bk = popS(tBoom);
  if (bk > 0 && TT < off) {
    ctx.save(); ctx.globalAlpha *= b_fade(off);
    const sh = 1 - seg(TT, tBoom, tBoom + 1.6) * 0.6;
    ctx.translate(520 + 6 * sh * Math.sin(TT * 41), 560 + 5 * sh * Math.sin(TT * 37)); ctx.scale(bk, bk); ctx.rotate(-0.05 + 0.03 * sh * Math.sin(TT * 29));
    handLetter('ẦM…', 0, 0, 120, { face: 'hand', col: SK.ink, key: 'b_am', jit: 1 });
    ctx.restore();
  }
  b_label('sấm', 160, 960, 64, Math.min(VW('thunder', 'sấm'), tBoom + 0.35), off);
  // the hero: pushed outward on "nở", blown back on "nổ" along an arc down to the hill, covering its ears
  let hx = BR.heatThunder.b[0], hy = BR.heatThunder.b[1], rot = 0;
  const lean = 28 * EZ.o2(seg(TT, tNo + 0.1, tNo + 0.6)) * (1 - seg(TT, tBoom, tBoom + 0.1));
  const bob = 10 * Math.sin((TT - E) * 2.6) * seg(TT, E + 0.5, E + 1.0);
  const A = [hx + 28, hy], R = [hx + 85, hy + 20];
  if (TT < tBoom) { hx += lean; hy += bob * (1 - seg(TT, tBoom - 0.3, tBoom)); }
  else {
    const r = EZ.o2(seg(TT, tBoom, tBoom + 0.3)), u = EZ.io(seg(TT, tBoom + 0.3, 52.55));
    if (u <= 0) [hx, hy] = [lerp(A[0], R[0], r), lerp(A[1], R[1], r)];
    else [hx, hy] = b_bz(u, R, [1010, 1010], [580, 1290], BR.thunderEnd.a);
    rot = -TAU * EZ.io(seg(TT, tBoom + 0.3, 52.55));
  }
  if (TT >= 52.55) { [hx, hy] = BR.thunderEnd.a; rot = 0; }
  const land = seg(TT, 52.55, 52.85), sq = 0.12 * Math.sin(Math.PI * land);
  const ears = TT >= tBoom ? [1.15, 1.15] : null;
  heroTia(hx, hy, HR, { key: 'hero', badge: 0, mood: TT >= tBoom ? 'wow' : 'puzzled', arms: ears, look: TT < tBoom ? [-0.8, 0.1] : [0, 0], rot, sx: 1 + sq, sy: 1 - sq });
  viTag('sấm');
  pageCaption(['Không khí nở bung:', 'tiếng sấm'], [[1, 'tiếng sấm']], { size: 62, at: 0.3 });
};
