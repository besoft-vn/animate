// =====================================================================
//  sc-hill.js — hook (the hill, "sét không lao từ trời xuống" ✗ / "vọt từ mặt đất lên" ↑), cloud (the height ruler,
//  the hero floats UP into the growing cloud), end (same hill: a distant flash, the big up arrow, the hero points UP).
//  Colour: terracotta = hero · graphite = the "wrong" down arrow, ruler · SK.red = the cross-out · COL.flash = light only.
// =====================================================================
// the hook's return stroke: tree top -> meeting point -> cloud base (grows FROM THE TREE UP)
const h_BOLT = [...BOLT_STREAM].reverse().concat([...BOLT_LEADER].reverse().slice(1));
// a group drawn at alpha a (multiplies every pen inside)
function h_alpha(a, f) { if (a <= 0.005) return; ctx.save(); ctx.globalAlpha *= clamp(a); f(); ctx.restore(); }
// the cloud, gently boiling (drifts ± a few px, base shade breathes) — o merges on top (glow, s, base, sy …)
function h_cloud(o = {}) {
  stormCloud({ x: CLOUD.x + 9 * Math.sin(TT * 0.8), dark: 0.6 + 0.15 * Math.sin(TT * 1.3), ...o, key: 'h_cl' });
}
// a gentle idle bob that dies out by `still` (the hero must be exact at the bridge)
const h_bob = (t0, still, amp = 7, per = 1.6) => amp * Math.sin(TAU * (TT - t0) / per) * (1 - seg(TT, still - 0.5, still)) * seg(TT, t0, t0 + 0.4);
const h_hop = (t0, d = 0.4) => Math.sin(Math.PI * seg(TT, t0, t0 + d));
// a flash envelope: rises over `up`, holds `hold`, fades over `down`
const h_env = (t0, up, hold, down) => seg(TT, t0, t0 + up) * (1 - seg(TT, t0 + up + hold, t0 + up + hold + down));

// ---------------------------------------------------------------------
//  HOOK — the hill, the tree, the storm cloud; the hero on the hill looking up. On "lao từ trời xuống" a graphite
//  down arrow under the cloud, crossed out (red ✗) on "xuống". On "vọt" the bright bolt grows from the tree top UP to
//  the cloud + a big yellow up arrow; flash-lit washes peak and fade; everything is gone again by ~5.4 s.
// ---------------------------------------------------------------------
SCENES.hook = function () {
  sketchPage({ grid: 'plain' });
  const tk = VW('hook', 'không'), tl = VW('hook', 'lao'), tv = VW('hook', 'vọt');
  const fl = h_env(tv + 0.1, 0.25, 0.2, 0.7);                         // the flash-lit washes
  h_cloud({ glow: 0.9 * fl });
  hill({ tint: 0.55 * fl });
  tree({ lit: 0.85 * fl });
  // the WRONG idea: a graphite arrow from the cloud base DOWN, crossed out on "xuống"
  const dA = 1 - seg(TT, tv + 0.1, tv + 0.5);
  h_alpha(dA, () => {
    bigArrow(220, 715, 220, 935, { part: EZ.o2(ev(tk - 0.4, 0.4)), w: 46, key: 'h_dn' });
    const k1 = ev(tk, 0.3), k2 = ev(tk + 0.3, Math.max(0.15, tl + 0.3 - tk - 0.3));
    gline([[150, 760], [290, 900]], { w: 12, col: SK.red, key: 'h_x1', part: k1, second: false, amp: 1 });
    gline([[292, 765], [148, 895]], { w: 12, col: SK.red, key: 'h_x2', part: k2, second: false, amp: 1 });
  });
  // the TRUE stroke: from the tree top UP to the cloud base, then it fades away
  const kb = EZ.o2(ev(tv, 0.35)), ab = 1 - seg(TT, tv + 0.5, tv + 1.05);
  h_alpha(ab, () => boltPath(h_BOLT, { part: kb, w: 26, halo: 0.6 + 0.4 * fl, key: 'h_bt' }));
  sparkle(430, 690, 80, seg(TT, tv + 0.3, tv + 0.75), 'h_spk', SK.ink);
  // the big yellow up arrow beside it, pointing UP (gone before the bridge)
  const aa = 1 - seg(TT, tv + 1.1, tv + 1.5), pu = 6 * Math.sin(TAU * (TT - tv) / 0.7) * seg(TT, tv + 0.6, tv + 0.8);
  h_alpha(aa, () => bigArrow(875, 1090, 875, 760 - pu, { col: COL.flash, w: 60, part: EZ.o2(ev(tv + 0.1, 0.4)), key: 'h_up' }));
  // the hero: on the hill at BR.hookCloud.a, looking up; glances at the down arrow, puzzled at the ✗, wow on the flash
  const [hx, hy0] = BR.hookCloud.a, still = EE('hook') - 0.5;
  const hy = hy0 + h_bob(0, tv) - 26 * h_hop(0.35, 0.45) - 30 * h_hop(tv + 0.15, 0.4) * (TT < still ? 1 : 0);
  const look = TT < 0.9 ? [0.5, -0.9] : TT < tk - 0.3 ? [Math.sin(TT * 2.4) * 0.8, -0.9] : TT < tv ? [-0.8, -0.6] : TT < tv + 0.6 ? [0.9, -0.3] : [0.6, -0.9];
  const mood = TT < tk ? 'calm' : TT < tv ? 'puzzled' : 'wow';
  const sq = h_hop(0.35, 0.45) + h_hop(tv + 0.15, 0.4);
  heroTia(hx, TT >= still ? hy0 : hy, HR, { key: 'hero', look, mood, sx: TT >= still ? 1 : 1 - 0.05 * sq, sy: TT >= still ? 1 : 1 + 0.07 * sq });
  viTag('sét đi đâu?');
  pageCaption(['Sét chói nhất', 'vọt từ đất lên'], [[1, 'đất lên']], { size: 62, at: 0.25 });
};

// ---------------------------------------------------------------------
//  CLOUD — same hill; a height ruler on the left (0 → 10 km+) and the label "mây dông"; the hero floats UP from the
//  hill into the cloud; from ~8.2 s the cloud swells down and out until its wash fills the frame (hero on top).
// ---------------------------------------------------------------------
SCENES.cloud = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('cloud'), e1 = EE('cloud'), tm = VW('cloud', 'mây'), t10 = VW('cloud', 'mười');
  const gu = EZ.io(seg(TT, 8.2, e1 - 0.5));                            // the cloud swells around the hero
  h_cloud({ s: 1 + 0.45 * gu, sy: 0.85 + 1.15 * gu, base: CLOUD.base + 310 * gu, x: CLOUD.x + 20 * gu, dark: 0.6 + 0.4 * gu });
  hill(); tree();
  // the height ruler + labels (fade out by 9.75)
  const fa = 1 - seg(TT, e1 - 0.8, e1 - 0.5), rk = EZ.io(ev(e0 + 0.45, 0.85));
  h_alpha(fa, () => {
    const RX = 110, Y0 = 1150, Y1 = 445;
    gline([[RX, Y0], [RX, Y1]], { w: 6, key: 'h_rl', part: rk, amp: 1.2 });
    for (let i = 0; i <= 10; i++) {
      const y = lerp(Y0, Y1, i / 10), big = i % 5 === 0;
      if (rk < i / 10) continue;
      gline([[RX - (big ? 26 : 14), y], [RX + (big ? 26 : 14), y]], { w: big ? 5 : 4, key: 'h_tk' + i, second: false, amp: 0.6 });
    }
    label('0', 150, 1168, 56, { align: 'left', reveal: ev(e0 + 0.6, 0.3), key: 'h_l0' });
    const [a0, a1] = label('10 km+', 150, 470, 56, { align: 'left', reveal: ev(e0 + 1.2, 0.45), key: 'h_l10' });
    underline(a0, a1, 488, { col: SK.red, w: 6, key: 'h_u10', part: ev(t10, 0.3) });
    label('mây dông', 560, 600, 64, { reveal: ev(Math.min(tm, VW('cloud', 'một')), 0.4), key: 'h_lm' });
  });
  // the hero: exactly at BR.hookCloud.b until 6.5, floats UP into the cloud, exactly at BR.cloudCollide.a from 9.75
  const [ax, ay] = BR.hookCloud.b, [bx, by] = BR.cloudCollide.a;
  const u = seg(TT, e0 + 0.5, e1 - 0.5), k = EZ.io(u), side = Math.sin(TAU * u) * Math.sin(Math.PI * u);
  const hx = lerp(ax, bx, k) - 45 * side, hy = lerp(ay, by, k) - 30 * Math.sin(Math.PI * u) * (1 - k);
  const look = TT < e0 + 0.4 ? [0.6, -0.9] : TT < e1 - 0.6 ? [0.2 * Math.sin(TT * 2), -1] : [0, 0];
  heroTia(hx, hy, HR, { key: 'hero', look, mood: TT < tm ? 'calm' : 'wow', rot: 0.12 * side });
  viTag('mây dông');
  pageCaption(['Mây dông cao', 'hơn mười cây số'], [[1, 'mười cây số']], { size: 62, at: 0.25 });
};

// ---------------------------------------------------------------------
//  END — the hook's hill again; the hero back at [300,1100], no badge. On "chớp" a bolt strikes the TREE again, growing
//  from the tree top UP; on "từ dưới đất lên" it flickers again, a big yellow up arrow stands beside it, the hero points UP.
// ---------------------------------------------------------------------
SCENES.end = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('end'), tc = VW('end', 'chớp'), tn = VW('end', 'nhớ'), ta = VW('end', 'ánh'), td = VW('end', 'dưới');
  const f1 = h_env(tc + 0.05, 0.2, 0.2, 0.8), f2 = h_env(td + 0.05, 0.2, 0.25, 1.0), fl = Math.max(f1, f2);
  h_cloud({ glow: 0.8 * fl });
  hill({ tint: 0.45 * fl });
  tree({ lit: 0.8 * fl });
  // the distant flash: grows UP from the ground, fades; re-strikes on "dưới" and stays as a soft glow
  const a1 = (1 - seg(TT, tc + 0.6, tc + 1.3)) * (TT < td ? 1 : 0);
  h_alpha(a1, () => boltPath(h_BOLT, { part: EZ.o2(ev(tc, 0.3)), w: 18, halo: 0.8, key: 'h_fb' }));
  if (TT >= td) {
    const a2 = 1 - 0.15 * seg(TT, td + 0.6, td + 1.4) - 0.1 * Math.sin(TAU * (TT - td) / 0.9) * seg(TT, td + 1.4, td + 1.8);
    h_alpha(a2, () => boltPath(h_BOLT, { part: EZ.o2(ev(td, 0.3)), w: 18, halo: 0.8, key: 'h_fb' }));
  }
  // the big yellow up arrow beside it (stays to the end, breathing up)
  const pu = 10 * Math.sin(TAU * (TT - td) / 1.2) * seg(TT, td + 0.6, td + 1.0);
  bigArrow(880, 1000, 880, 720 - pu, { col: COL.flash, w: 54, part: EZ.o2(ev(td + 0.1, 0.45)), key: 'h_eup' });
  // the hero: exact until 53.75; looks at the flash, nods on "nhớ", looks at the light on "ánh", points UP on "dưới"
  const [hx0, hy0] = BR.thunderEnd.b, t0 = e0 + 0.5;
  const hop = h_hop(tc + 0.1, 0.4) + h_hop(tn, 0.35) + h_hop(td + 0.2, 0.4);
  const hx = hx0 + 14 * Math.sin(TAU * (TT - t0) / 3.2) * seg(TT, t0, t0 + 0.6);
  const hy = hy0 + (TT > t0 ? 7 * Math.sin(TAU * (TT - t0) / 1.6) * seg(TT, t0, t0 + 0.6) : 0) - 28 * hop;
  const look = TT < tc ? [0.3, -0.6] : TT < tn ? [0.8, -0.8] : TT < ta ? [0, 0.2] : TT < td ? [0.8, -0.8] : [0.6, -1];
  const mood = TT < tc ? 'calm' : TT < tn ? 'wow' : 'happy';
  const pk = EZ.back(ev(td + 0.1, 0.35)), wv = 0.15 * Math.sin(TAU * (TT - td) / 0.8) * seg(TT, td + 0.6, td + 1);
  const arms = pk > 0.01 ? [-0.5, lerp(-0.6, 1.5, pk) + wv] : undefined;
  heroTia(TT < t0 ? hx0 : hx, TT < t0 ? hy0 : hy, HR, { key: 'hero', look, mood, arms, sx: 1 - 0.05 * hop, sy: 1 + 0.07 * hop });
  viTag('nhớ nhé!');
  pageCaption(['Ánh sáng ấy', 'đi từ dưới đất lên'], [[1, 'dưới đất lên']], { size: 62, at: 0.25 });
};
