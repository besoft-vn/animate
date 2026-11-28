  // SCORE BODY — mã QR (inside buildScore(); see kit/score-head.js). Under a voice: sparse, soft, out of the way.
  // A warm pad + a gentle 8th "data" pluck (bits ticking) -> blips as bits flip (bit), 8 rising ticks (byte),
  // three soft chimes on the finder corners, a stepping pluck up the zigzag, a soft sweep for the mask, a thicker
  // pulse for ECC -> a faint bed + small swell through the pause (never dead silence) -> the payoff chord BLOOMS on
  // the SLAM (0.3 s attack, no click) + soft sub -> end: a settled pad, a "scan ok" chime and the hero motif.
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['A4', 0], ['E5', E8]];
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('ecc').t1);

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('finder') + 0.1, ['A2', 'E3', 'C#4'], 0.024, { type: 'triangle', cut: 800, att: 0.3, rel: 0.3 });
  motif(0.6, 0.035);
  pad(ET('finder'), SIL, ['F#2', 'C#3', 'A3'], 0.02, { cut: 750, att: 0.4, rel: 0.05, send: 0.3 });
  each(ET('bit'), SIL, E8, (t, k) => {
    const st = t < ET('finder') ? 0 : t < ET('ecc') ? 1 : 2;
    const on = [k % 2 === 0, k % 2 === 0, true][st];
    if (on) pluck(t, nz(['A4', 'C#5', 'E5', 'B4', 'A4', 'E5', 'F#5', 'E5'][k % 8]), 0.026 + st * 0.004, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.25, 2200 + st * 300, 0.22);
    if (st >= 1 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'E2' : 'F#2'), 0.07 + st * 0.01);
  });
  // SOFT payoff: a faint bed + small swell through the pause, then a blooming chord (no stab)
  pad(SIL - 0.6, SLAM + 0.4, ['F#2', 'C#3', 'A3'], 0.02, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.012);
  ['A2', 'E3', 'A3', 'C#4', 'E4', 'A4'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.06, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['A2', 'E3', 'A3', 'C#4', 'E4'], 0.04, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, ET('end'), ['A2', 'E3', 'C#4'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  pad(ET('end') - 0.2, DURATION, ['A2', 'E3', 'A3', 'C#4'], 0.015, { cut: 900, att: 0.4, rel: 0.4, send: 0.45 });
  each(ET('end'), DURATION - 1.5, BEAT, (t, k) => pluck(t, nz(['C#5', 'E5', 'B4', 'E5'][k % 4]), 0.026, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  motif(DURATION - 1.6, 0.06);

  // ================= SFX =================
  to = 's';
  // bit: two soft blips on "một" (high) and "không" (low)
  blip(VW('bit', 'một'), 1320, 1320, 0.07, 0.014, 0.2);
  blip(VW('bit', 'không'), 660, 660, 0.07, 0.014, -0.2);
  // byte: 8 small rising ticks as the 8 modules line up, a chime on "C"
  each(VW('byte', 'tám'), VW('byte', 'tám') + 8 * E16, E16, (t, k) => blip(t, 900 + k * 90, 900 + k * 90, 0.035, 0.01, (k - 3.5) * 0.08));
  chime(VW('byte', 'c'), [nz('A5'), nz('E6')], 0.014, 0);
  // finder: three soft chimes, one per corner
  [0, 1, 2].forEach((i) => chime(VW('finder', 'góc') + 0.1 + i * 0.3, [nz(['E5', 'A5', 'C#6'][i])], 0.012, (i - 1) * 0.3));
  // zigzag: a stepping pluck up the column pairs
  each(VW('zigzag', 'ngoằn'), VW('zigzag', 'ngoằn') + 1.5, E16, (t, k) => pluck(t, nz(['A4', 'C#5', 'E5', 'A5'][k % 4]), 0.016, (k % 2 ? 0.2 : -0.2), 0.2, 2400, 0.1));
  // mask: a soft sweep as the stripes wipe across
  sweep(VW('mask', 'mặt') - 0.1, VW('mask', 'đảo') + 0.6, 0.005, 700, 2000, 0);
  // ecc: a shimmer as the error-correction modules light up
  chime(VW('ecc', 'sửa'), [nz('E5'), nz('A5'), nz('C#6')], 0.012, 0.1);
  // bridge whooshes (not on the slam)
  for (const id of ['bit', 'byte', 'finder', 'zigzag', 'mask', 'ecc', 'end']) sweep(ET(id) - 0.45, ET(id), 0.004, 600, 2200, 0);
  sub(SLAM, 0.06);
  chime(SLAM + 0.15, [nz('A5'), nz('E6')], 0.016, 0);
  // payoff: a soft "read ok" double blip on "đủ"
  blip(VW('payoff', 'đủ'), 1760, 1760, 0.06, 0.012, 0); blip(VW('payoff', 'đủ') + 0.1, 2200, 2200, 0.08, 0.012, 0);
  // end: the scan chime on "lời chào"
  chime(VW('end', 'lời'), [nz('A5'), nz('E6')], 0.016, 0);
