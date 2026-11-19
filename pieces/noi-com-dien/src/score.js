  // SCORE BODY — nồi cơm điện (inside buildScore(); see kit/score-head.js). Under a voice: sparse, low, out of the way.
  // a light kitchen pad -> the heat: a soft 8th pulse that thickens through boil/steam/dry -> a faint bed + a small
  // swell in the pause (never dead silence) -> the payoff chord BLOOMS on the SLAM (0.3 s attack, no click) ->
  // a warm, low "giữ ấm" pad to the end, the hero motif to close.
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['E5', 0], ['A4', E8]];                                   // the drop motif: a falling fourth ("plip")
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('curie').t1);                                       // the pause starts here, ends on SLAM

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('boil') + 0.1, ['A3', 'E4', 'C5'], 0.028, { type: 'triangle', cut: 850, att: 0.2, rel: 0.3 });
  motif(0.5, 0.15);
  motif(ET('magnet') + E8, 0.12);
  // the heat: a soft pulse that thickens boil -> steam -> dry -> curie
  pad(ET('boil'), SIL, ['A3', 'E4', 'B4'], 0.026, { cut: 750, att: 0.4, rel: 0.05, send: 0.3 });
  each(ET('boil'), SIL, E8, (t, k) => {
    const st = t < ET('steam') ? 0 : t < ET('dry') ? 1 : 2;
    const on = [k % 4 === 0, k % 2 === 0, true][st];
    if (on) pluck(t, nz(['A4', 'E5', 'B4', 'E5', 'C5', 'E5', 'B4', 'F#5'][k % 8]), 0.036 + st * 0.004, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.3, 2400 + st * 300, 0.2);
    if (st >= 1 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'E2' : 'A2'), 0.09 + st * 0.01);
  });
  // SOFT payoff: a faint bed + small swell through the pause, then a blooming chord (no stab)
  pad(SIL - 0.6, SLAM + 0.4, ['A3', 'E4', 'B4'], 0.009, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.007);
  ['A3', 'E4', 'A4', 'C#5', 'E5', 'A5'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.065, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['A3', 'E4', 'A4', 'C#5', 'E5'], 0.05, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, DURATION, ['A3', 'E4', 'A4', 'C#5'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  each(ET('end'), DURATION - 1.5, BEAT, (t, k) => pluck(t, nz(['C#5', 'E5', 'B4', 'E5'][k % 4]), 0.03, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  motif(DURATION - 1.6, 0.07);

  // ================= SFX =================
  to = 's';
  // the knob pressed (a soft low tick-thump), the magnet catching: a small chime
  blip(VW('magnet', 'ấn'), 500, 380, 0.05, 0.03, -0.2);
  chime(VW('magnet', 'hít'), [nz('E5'), nz('B5')], 0.02, 0);
  // the plate warming: a low hum from "heat" through "dry"
  drone(VW('heat', 'mâm'), SIL - 0.2, 60, 0.010, { att: 1.0, rel: 0.6 });
  // steam rising: soft airy upward sweeps
  sweep(VW('steam', 'hơi'), VW('steam', 'hơi') + 1.0, 0.006, 600, 2000, 0.2);
  sweep(VW('dry', 'bay'), VW('dry', 'bay') + 0.9, 0.006, 700, 2400, 0.3);
  // temperature "vọt lên": a small rising sweep
  sweep(VW('dry', 'vọt'), VW('dry', 'vọt') + 0.6, 0.007, 500, 1500, 0);
  // bridge whooshes (not on the slam)
  for (const id of ['magnet', 'heat', 'boil', 'steam', 'dry', 'curie', 'warm', 'end']) sweep(ET(id) - 0.45, ET(id), 0.006, 600, 2200, 0);
  sub(SLAM, 0.08);   // a soft low bloom under the chord (no click)
  chime(SLAM + 0.15, [nz('A5'), nz('E6')], 0.02, 0);
