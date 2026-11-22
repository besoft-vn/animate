  // SCORE BODY — sét (inside buildScore(); see kit/score-head.js). Under a voice: sparse, low, out of the way.
  // a low stormy pad + distant soft rumbles -> the cloud's churn: a soft 8th pulse thickening collide -> charge -> leader
  // (the leader's steps = soft ticks) -> meet: a faint bed + small swell in the pause (never dead silence) -> the payoff
  // chord BLOOMS on the SLAM (0.3 s attack, no click) + a soft low bloom -> heat: a warm pad -> thunder: a soft, rolling
  // low rumble (no sharp crack) -> the hero motif to close.
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['D4', 0], ['A4', E8]];                                   // the hero motif: a rising fifth
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('meet').t1);                                        // the pause starts here, ends on SLAM
  const rumble = (t, dur, vel) => { drone(t, t + dur, 41, vel, { att: 0.35, rel: Math.min(1.2, dur * 0.6) }); sweep(t, t + dur * 0.7, vel * 0.5, 260, 90, 0); };

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('collide') + 0.1, ['D3', 'A3', 'F4'], 0.026, { type: 'triangle', cut: 800, att: 0.3, rel: 0.3 });
  motif(0.6, 0.07);
  pad(ET('collide'), SIL, ['D3', 'A3', 'E4'], 0.024, { cut: 750, att: 0.4, rel: 0.05, send: 0.3 });
  each(ET('collide'), SIL, E8, (t, k) => {
    const st = t < ET('charge') ? 0 : t < ET('leader') ? 1 : 2;
    const on = [k % 4 === 0, k % 2 === 0, true][st];
    if (on) pluck(t, nz(['D4', 'A4', 'E4', 'A4', 'F4', 'A4', 'E4', 'C5'][k % 8]), 0.034 + st * 0.004, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.3, 2200 + st * 300, 0.2);
    if (st >= 1 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A1' : 'D2'), 0.09 + st * 0.01);
  });
  // SOFT payoff: a faint bed + small swell through the pause, then a blooming chord (no stab)
  pad(SIL - 0.6, SLAM + 0.4, ['D3', 'A3', 'E4'], 0.02, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.012);
  ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.065, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['D3', 'A3', 'D4', 'F#4', 'A4'], 0.05, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, ET('thunder'), ['D3', 'A3', 'F#4'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  pad(ET('thunder') - 0.2, DURATION, ['D3', 'A3', 'D4', 'F#4'], 0.015, { cut: 900, att: 0.4, rel: 0.4, send: 0.45 });
  each(ET('end'), DURATION - 1.5, BEAT, (t, k) => pluck(t, nz(['F#4', 'A4', 'E4', 'A4'][k % 4]), 0.03, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  motif(DURATION - 1.6, 0.07);

  // ================= SFX =================
  to = 's';
  // the hook's flash: a soft airy up-sweep (from the ground UP) + a distant rumble a little later
  sweep(VW('hook', 'vọt') - 0.1, VW('hook', 'vọt') + 0.5, 0.008, 400, 2400, 0);
  rumble(VW('hook', 'vọt') + 0.9, 2.2, 0.012);
  // the cloud: wind
  sweep(ET('cloud') + 0.3, ET('cloud') + 2.6, 0.005, 300, 900, -0.3);
  // collisions: small soft ticks on "va"; the charge splitting: a small chime up, a low blip down
  blip(VW('collide', 'va'), 900, 700, 0.04, 0.02, 0.2);
  chime(VW('charge', 'dương'), [nz('A5'), nz('E6')], 0.016, 0.3);
  blip(VW('charge', 'âm'), 420, 260, 0.08, 0.03, -0.2);
  // the leader's steps: soft ticks on 8ths from "dò" to "ngắn"
  each(VW('leader', 'dò'), VE('leader', 'ngắn'), E8, (t, k) => blip(t, 1500 - k * 40, 1300 - k * 40, 0.015, 0.018, 0));
  // the streamer rising: a small up-sweep; the touch: a soft spark
  sweep(VW('meet', 'vươn') - 0.2, VW('meet', 'vươn') + 0.6, 0.006, 500, 1800, 0.2);
  chime(VW('meet', 'chạm'), [nz('D6')], 0.014, 0);
  // bridge whooshes (not on the slam)
  for (const id of ['cloud', 'collide', 'charge', 'leader', 'meet', 'heat', 'thunder', 'end']) sweep(ET(id) - 0.45, ET(id), 0.006, 600, 2200, 0);
  sub(SLAM, 0.07);   // a soft low bloom under the chord (no click)
  chime(SLAM + 0.15, [nz('A5'), nz('D6')], 0.02, 0);
  // heat: a warm rising hiss; thunder: a soft rolling low rumble on "nổ" (no crack), echoes fading
  sweep(VW('heat', 'nóng') - 0.2, VW('heat', 'nóng') + 0.9, 0.005, 800, 3000, 0);
  rumble(VW('thunder', 'nở') - 0.1, 1.6, 0.02);
  rumble(VW('thunder', 'nổ') - 0.05, 2.6, 0.03);
  rumble(VW('thunder', 'sấm') + 0.3, 2.4, 0.014);
  // the end's distant flash: a faint up-sweep on "lên"
  sweep(VW('end', 'đi') - 0.2, VW('end', 'lên') + 0.2, 0.005, 400, 2000, 0);
