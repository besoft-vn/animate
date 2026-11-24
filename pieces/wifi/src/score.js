  // SCORE BODY — wifi (inside buildScore(); see kit/score-head.js). Under a voice: sparse, clean, out of the way.
  // a cool pad + the hero motif -> bits: tiny blips as digits are written -> wave: a steady pulse (the carrier) ->
  // mod/qam: plucks that change pitch with each wave shape -> ofdm: a layered arpeggio (many sub-waves) -> fly: rising
  // steps, a faint bed + a small swell in the pause (never dead silence) -> the payoff chord BLOOMS on the SLAM (0.3 s
  // attack, no click) -> a warm low pad -> ack: two soft "received" chimes -> the motif to close.
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['E4', 0], ['B4', E8], ['G#4', BEAT]];
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2400, 0.35));
  const SIL = snap8(VL('fly').t1);

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('wave') + 0.1, ['E3', 'B3', 'G#4'], 0.024, { type: 'triangle', cut: 800, att: 0.3, rel: 0.3 });
  motif(0.5, 0.11);
  pad(ET('wave'), ET('ofdm') + 0.1, ['C#3', 'G#3', 'E4'], 0.022, { cut: 750, att: 0.4, rel: 0.1, send: 0.3 });
  each(ET('wave'), ET('ofdm'), E8, (t, k) => {
    const st = t < ET('mod') ? 0 : t < ET('qam') ? 1 : 2;
    const on = [k % 2 === 0, true, true][st];
    if (on) pluck(t, nz([['E5', 'B4', 'E5', 'B4'], ['E5', 'B4', 'G#5', 'C#5'], ['E5', 'C#5', 'B5', 'G#5']][st][k % 4]), 0.03 + st * 0.003, Math.sin(k * 0.9) * 0.3, 0.3, 2200 + st * 300, 0.25);
    if (k % 4 === 0) bass(t, nz(st === 2 ? 'A2' : 'C#3'), 0.08);
  });
  pad(ET('ofdm'), SIL, ['A2', 'E3', 'C#4'], 0.022, { cut: 900, att: 0.4, rel: 0.1, send: 0.35 });
  each(ET('ofdm'), ET('fly'), E16 * 2, (t, k) => pluck(t, nz(['A4', 'C#5', 'E5', 'A5', 'E5', 'C#5', 'B4', 'E5'][k % 8]), 0.024, Math.sin(k) * 0.5, 0.3, 2600, 0.3));
  each(ET('fly'), SIL, BEAT, (t, k) => pluck(t, nz(['E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D#5', 'E5', 'F#5', 'G#5', 'A5', 'B5'][k % 12]), 0.03, Math.sin(k) * 0.3, 0.4, 2400, 0.3));
  // SOFT payoff: a faint bed + small swell through the pause, then a blooming chord (no stab)
  pad(SIL - 0.6, SLAM + 0.4, ['B2', 'F#3', 'C#4'], 0.009, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.007);
  ['E3', 'B3', 'E4', 'G#4', 'B4', 'E5'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.06, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['E3', 'B3', 'E4', 'G#4'], 0.048, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, DURATION, ['A2', 'E3', 'C#4', 'G#4'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  each(ET('end'), DURATION - 1.8, BEAT, (t, k) => pluck(t, nz(['G#4', 'B4', 'E5', 'B4'][k % 4]), 0.028, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  motif(DURATION - 1.7, 0.07);

  // ================= SFX =================
  to = 's';
  each(VW('bits', 'dãy'), VE('bits', 'một', 2), E16 * 2, (t, k) => blip(t, k % 2 ? 1500 : 1100, k % 2 ? 1300 : 950, 0.03, 0.014, Math.sin(k) * 0.4));   // digits written
  sweep(VW('wave', 'rung'), VW('wave', 'rung') + 1.2, 0.004, 400, 1400, 0);       // the antenna starts to ring
  chime(VW('mod', 'nhóm'), [nz('B5'), nz('E6')], 0.012, 0);
  chime(VW('qam', 'mười'), [nz('E5'), nz('G#5')], 0.012, 0);
  sweep(VW('fly', 'lao'), VW('fly', 'lao') + 1.4, 0.005, 300, 1800, 0);
  for (const id of ['bits', 'wave', 'mod', 'qam', 'ofdm', 'fly', 'ack', 'end']) sweep(ET(id) - 0.45, ET(id), 0.006, 600, 2200, 0);
  sub(SLAM, 0.07);
  chime(SLAM + 0.2, [nz('G#5'), nz('B5')], 0.018, 0);
  chime(VW('ack', 'nhận'), [nz('E5'), nz('B5')], 0.014, 0.2);                       // "đã nhận"
  blip(VW('ack', 'hỏng'), 300, 200, 0.12, 0.02, -0.2);                             // a broken packet
  chime(VW('end', 'vô') , [nz('E5'), nz('G#5')], 0.014, 0);
