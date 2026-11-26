  // SCORE BODY — phanh xe máy (inside buildScore(); see kit/score-head.js). Under a voice: sparse, low, out of the way.
  // street: a light rolling pad + a soft engine hum that eases off on the squeeze; lever: a small click-free tick;
  // fluid: a gentle 8th pulse that "travels"; caliper: a low push swell; clamp: a soft friction hiss; heat: a warm rising
  // shimmer; tyre: the pulse slows down with the wheel -> a faint bed + small swell in the pause (never dead silence) ->
  // the payoff chord BLOOMS on the SLAM (0.3 s attack, no click) + soft sub -> front: settled pad -> motif to close.
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['E4', 0], ['B4', E8]];
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('tyre').t1);

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('caliper') + 0.1, ['E3', 'B3', 'G#4'], 0.024, { type: 'triangle', cut: 800, att: 0.3, rel: 0.3 });
  motif(0.6, 0.035);
  pad(ET('caliper'), SIL, ['E3', 'B3', 'F#4'], 0.022, { cut: 750, att: 0.4, rel: 0.05, send: 0.3 });
  each(ET('fluid'), SIL, E8, (t, k) => {
    const st = t < ET('clamp') ? 0 : t < ET('tyre') ? 1 : 2;
    // in "tyre" the pulse thins out as the wheel slows (every 8th -> every beat -> every 2 beats)
    const slow = st === 2 ? (t < VW('tyre', 'chính') ? k % 2 === 0 : k % 4 === 0) : true;
    const on = [k % 2 === 0, true, slow][st];
    if (on) pluck(t, nz(['E4', 'B4', 'F#4', 'B4', 'G#4', 'B4', 'F#4', 'C#5'][k % 8]), 0.032 + st * 0.003, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.3, 2200 + st * 300, 0.2);
    if (st === 1 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'B1' : 'E2'), 0.085);
  });
  // SOFT payoff: a faint bed + small swell through the pause, then a blooming chord (no stab)
  pad(SIL - 0.6, SLAM + 0.4, ['E3', 'B3', 'F#4'], 0.02, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.012);
  ['E3', 'B3', 'E4', 'G#4', 'B4', 'E5'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.065, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['E3', 'B3', 'E4', 'G#4', 'B4'], 0.04, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, ET('end'), ['E3', 'B3', 'G#4'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  pad(ET('end') - 0.2, DURATION, ['E3', 'B3', 'E4', 'G#4'], 0.015, { cut: 900, att: 0.4, rel: 0.4, send: 0.45 });
  each(ET('end'), DURATION - 1.5, BEAT, (t, k) => pluck(t, nz(['G#4', 'B4', 'F#4', 'B4'][k % 4]), 0.028, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  motif(DURATION - 1.6, 0.06);

  // ================= SFX =================
  to = 's';
  // street: a soft rolling whoosh that eases off as the bike brakes
  sweep(0.2, VW('hook', 'nó') + 0.2, 0.005, 300, 700, -0.2);
  sweep(VW('hook', 'nó'), VW('hook', 'nóng') + 0.6, 0.004, 700, 250, 0.1);
  // lever: a small squeeze blip on "bóp", a low push on "ép"
  blip(VW('lever', 'bóp'), 900, 700, 0.05, 0.016, 0.1);
  blip(VW('lever', 'ép'), 300, 220, 0.12, 0.02, 0);
  // fluid: a soft travelling sweep down the hose on "chạy theo ống"
  sweep(VW('fluid', 'chạy') - 0.1, VW('fluid', 'chạy') + 1.4, 0.005, 1400, 400, 0.3);
  // caliper: a low swell as the force multiplies on "nhân lên"
  sweep(VW('caliper', 'nhân') - 0.2, VW('caliper', 'nhân') + 0.9, 0.006, 200, 600, 0);
  // clamp: a soft friction hiss on "kẹp"
  sweep(VW('clamp', 'kẹp'), VW('clamp', 'kẹp') + 1.4, 0.005, 2600, 1800, 0.2);
  // heat: a warm rising shimmer on "nhiệt"
  sweep(VW('heat', 'nhiệt') - 0.2, VW('heat', 'nhiệt') + 1.4, 0.005, 500, 2400, 0);
  chime(VW('heat', 'nóng'), [nz('B5'), nz('E6')], 0.012, 0.2);
  // tyre: a gentle tyre-on-road down-sweep on "bám"
  sweep(VW('tyre', 'bám') - 0.1, VW('tyre', 'dừng') + 0.3, 0.005, 900, 250, -0.1);
  // bridge whooshes (not on the slam)
  for (const id of ['lever', 'fluid', 'caliper', 'clamp', 'heat', 'tyre', 'front', 'end']) sweep(ET(id) - 0.45, ET(id), 0.005, 600, 2200, 0);
  sub(SLAM, 0.06);
  chime(SLAM + 0.15, [nz('B5'), nz('E6')], 0.018, 0);
  // front: a soft settling down-sweep on "dồn về trước"
  sweep(VW('front', 'dồn') - 0.1, VW('front', 'dồn') + 0.9, 0.005, 1800, 500, 0);
  // the end: a small chime on "hơi ấm"
  chime(VW('end', 'ấm'), [nz('E6')], 0.014, 0);
