  // SCORE BODY — ngáp (inside buildScore(); see kit/score-head.js). Under a voice: sparse, warm, sleepy, out of the way.
  // a lazy afternoon pad -> the head: a soft pulse that warms through warm/jaw/air, a cool airy turn on "cool" ->
  // the seasons: light plucks -> "lay": a faint bed + small swell in the pause (never dead silence) -> the payoff chord
  // BLOOMS on the SLAM (0.3 s attack, no click) -> a warm low pad to the end, the yawn motif (a slow falling slide) to close.
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['A4', 0], ['E5', E8], ['C5', BEAT]];                         // the brain motif: a little rising-falling turn
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2400, 0.35));
  const yawnSlide = (t, vel) => blip(t, 520, 260, 1.1, vel, 0);              // a soft downward "aaah" for each yawn
  const SIL = snap8(VL('lay').t1);                                         // the pause starts here, ends on SLAM

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('jaw') + 0.1, ['F3', 'C4', 'A4'], 0.026, { type: 'triangle', cut: 800, att: 0.3, rel: 0.3 });
  motif(0.4, 0.13);
  // the head: a soft 8th pulse that warms (jaw/air), then an airy cool turn
  pad(ET('jaw'), ET('season') + 0.1, ['D3', 'A3', 'F4'], 0.024, { cut: 750, att: 0.4, rel: 0.1, send: 0.3 });
  each(ET('jaw'), ET('season'), E8, (t, k) => {
    const st = t < ET('air') ? 0 : t < ET('cool') ? 1 : 2;
    const on = [k % 2 === 0, true, k % 2 === 0][st];
    if (on) pluck(t, nz([['D5', 'A4', 'F5', 'A4'], ['D5', 'A4', 'G5', 'A4'], ['E5', 'B4', 'G5', 'D5']][st][k % 4]), 0.032 + st * 0.003, Math.sin(k * 0.9) * 0.3, 0.3, 2200 + st * 400, 0.25);
    if (k % 4 === 0) bass(t, nz(st === 2 ? 'E2' : 'D2'), 0.08);
  });
  // seasons + lay: light plucks, a pad that builds a little toward the pause
  pad(ET('season'), SIL, ['C3', 'G3', 'E4'], 0.022, { cut: 900, att: 0.4, rel: 0.1, send: 0.35 });
  each(ET('season'), SIL, BEAT, (t, k) => pluck(t, nz(['G4', 'C5', 'E5', 'C5'][k % 4]), 0.03, Math.sin(k) * 0.3, 0.4, 2400, 0.3));
  // SOFT payoff: a faint bed + small swell through the pause, then a blooming chord (no stab)
  pad(SIL - 0.6, SLAM + 0.4, ['C3', 'G3', 'D4'], 0.009, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.007);
  ['C4', 'G4', 'C5', 'E5', 'G5', 'C6'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.06, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['C4', 'G4', 'C5', 'E5'], 0.048, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, DURATION, ['F3', 'C4', 'A4', 'E5'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  each(ET('end'), DURATION - 1.8, BEAT, (t, k) => pluck(t, nz(['A4', 'C5', 'E5', 'C5'][k % 4]), 0.028, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  motif(DURATION - 1.7, 0.07);

  // ================= SFX =================
  to = 's';
  yawnSlide(VW('hook', 'ngáp', 2) - 0.2, 0.02);               // Minh yawns despite the oxygen
  sweep(VW('air', 'hít'), VW('air', 'hít') + 1.2, 0.007, 400, 1600, 0.2);   // the deep breath in (airy)
  chime(VW('cool', 'lên'), [nz('E5'), nz('B5')], 0.016, 0);    // the brain cools
  for (const id of ['warm', 'jaw', 'air', 'cool', 'season', 'lay', 'social', 'end']) sweep(ET(id) - 0.45, ET(id), 0.006, 600, 2200, 0);
  sub(SLAM, 0.07);   // a soft low bloom under the chord (no click)
  yawnSlide(SLAM + 0.1, 0.022);                                // Lan's contagious yawn
  chime(SLAM + 0.2, [nz('G5'), nz('C6')], 0.018, 0);
  yawnSlide(VW('end', 'ngáp', 2) - 0.1, 0.018);
