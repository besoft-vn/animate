  // SCORE BODY — màn hình cảm ứng (inside buildScore(); see kit/score-head.js). Under a voice: sparse, light, out of the way.
  // a clean glassy pad -> a soft 8th "scan" pulse from "scan" on, thickening through finger/drop/sweep -> a faint bed + a
  // small swell in the pause (never dead silence) -> the payoff chord BLOOMS on the SLAM (0.3 s attack, no click) ->
  // a thinner pad for the glove, a warm low pad + the hero motif to close.
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['A4', 0], ['E5', E8]];                                   // the fingertip motif: a rising fifth ("tap-tap")
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('sweep').t1);                                       // the pause starts here, ends on SLAM

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('scan') + 0.1, ['A3', 'E4', 'C5'], 0.028, { type: 'triangle', cut: 850, att: 0.2, rel: 0.3 });
  motif(0.5, 0.15);
  motif(ET('grid') + E8, 0.12);
  // the scan: a soft pulse that thickens scan -> finger -> drop -> sweep
  pad(ET('scan'), SIL, ['A3', 'E4', 'B4'], 0.026, { cut: 750, att: 0.4, rel: 0.05, send: 0.3 });
  each(ET('scan'), SIL, E8, (t, k) => {
    const st = t < ET('finger') ? 0 : t < ET('drop') ? 1 : 2;
    const on = [k % 4 === 0, k % 2 === 0, true][st];
    if (on) pluck(t, nz(['A4', 'E5', 'B4', 'E5', 'C5', 'E5', 'B4', 'F#5'][k % 8]), 0.036 + st * 0.004, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.3, 2400 + st * 300, 0.2);
    if (st >= 1 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'E2' : 'A2'), 0.09 + st * 0.01);
  });
  // SOFT payoff: a faint bed + small swell through the pause, then a blooming chord (no stab)
  pad(SIL - 0.6, SLAM + 0.4, ['A3', 'E4', 'B4'], 0.009, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.007);
  ['A3', 'E4', 'A4', 'C#5', 'E5', 'A5'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.065, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['A3', 'E4', 'A4', 'C#5', 'E5'], 0.05, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, ET('end'), ['A3', 'E4', 'B4'], 0.012, { type: 'triangle', cut: 800, att: 0.3, rel: 0.4, send: 0.45 });
  pad(ET('end') - 0.3, DURATION, ['A3', 'E4', 'A4', 'C#5'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  each(ET('end'), DURATION - 1.5, BEAT, (t, k) => pluck(t, nz(['C#5', 'E5', 'B4', 'E5'][k % 4]), 0.03, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  motif(DURATION - 1.6, 0.07);

  // ================= SFX =================
  to = 's';
  // the tap in the hook (a soft low blip), the glass lifting (an airy up-sweep)
  blip(VW('hook', 'ấn'), 500, 380, 0.05, 0.03, -0.2);
  sweep(VW('grid', 'kính'), VW('grid', 'kính') + 0.8, 0.006, 600, 2000, 0.2);
  // the tiny capacitor: a small chime; the drive pulses: soft ticks on "xung"
  chime(VW('cap', 'tụ'), [nz('E5'), nz('B5')], 0.018, 0);
  each(VW('scan', 'xung'), VW('scan', 'xung') + 2.0, E8, (t) => blip(t, 1400, 1300, 0.012, 0.02, 0.2));
  // the touch: a soft low thump; the field pulled away: a falling sweep
  blip(VW('finger', 'chạm'), 300, 200, 0.06, 0.04, 0);
  sweep(VW('finger', 'kéo'), VW('finger', 'kéo') + 0.9, 0.006, 1800, 500, -0.2);
  // the glove: a dull muted tap, nothing answers
  blip(VW('glove', 'găng'), 260, 220, 0.04, 0.03, 0);
  // bridge whooshes (not on the slam)
  for (const id of ['grid', 'cap', 'scan', 'finger', 'drop', 'sweep', 'glove', 'end']) sweep(ET(id) - 0.45, ET(id), 0.006, 600, 2200, 0);
  sub(SLAM, 0.08);   // a soft low bloom under the chord (no click)
  chime(SLAM + 0.15, [nz('A5'), nz('E6')], 0.02, 0);
