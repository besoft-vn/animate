  // SCORE BODY — nước biển mặn (inside buildScore(); see kit/score-head.js). Under a voice: sparse, low, out of the way.
  // a calm seaside pad + soft waves -> rain: soft drips; rock: small crumble ticks; river: a gentle flowing 8th pulse;
  // vents: a low warm bubble; evap: an airy rising shimmer; time: the pulse loops and thickens -> a faint bed + small
  // swell in the pause (never dead silence) -> the payoff chord BLOOMS on the SLAM (0.3 s attack, no click) + soft sub ->
  // balance: a settled pad -> the hero motif to close.
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['D4', 0], ['A4', E8]];
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('time').t1);
  const wave = (t, dur, vel) => sweep(t, t + dur, vel, 300, 900, Math.sin(t) * 0.4);

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('river') + 0.1, ['D3', 'A3', 'F#4'], 0.024, { type: 'triangle', cut: 800, att: 0.3, rel: 0.3 });
  motif(0.6, 0.035);
  pad(ET('river'), SIL, ['D3', 'A3', 'E4'], 0.022, { cut: 750, att: 0.4, rel: 0.05, send: 0.3 });
  each(ET('river'), SIL, E8, (t, k) => {
    const st = t < ET('evap') ? 0 : t < ET('time') ? 1 : 2;
    const on = [k % 4 === 0, k % 2 === 0, true][st];
    if (on) pluck(t, nz(['D4', 'A4', 'E4', 'A4', 'F#4', 'A4', 'E4', 'B4'][k % 8]), 0.032 + st * 0.004, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.3, 2200 + st * 300, 0.2);
    if (st >= 1 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A1' : 'D2'), 0.08 + st * 0.01);
  });
  // SOFT payoff: a faint bed + small swell through the pause, then a blooming chord (no stab)
  pad(SIL - 0.6, SLAM + 0.4, ['D3', 'A3', 'E4'], 0.02, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.012);
  ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.065, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['D3', 'A3', 'D4', 'F#4', 'A4'], 0.04, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, ET('end'), ['D3', 'A3', 'F#4'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  pad(ET('end') - 0.2, DURATION, ['D3', 'A3', 'D4', 'F#4'], 0.015, { cut: 900, att: 0.4, rel: 0.4, send: 0.45 });
  each(ET('end'), DURATION - 1.5, BEAT, (t, k) => pluck(t, nz(['F#4', 'A4', 'E4', 'A4'][k % 4]), 0.028, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  motif(DURATION - 1.6, 0.06);

  // ================= SFX =================
  to = 's';
  // the sea: soft waves under the coast scenes
  for (const t of [0.4, 3.2, ET('evap') + 0.4, ET('end') + 0.4, ET('end') + 3.2]) wave(t, 1.8, 0.004);
  // rain: a few soft drips; CO2: a small bubble blip
  each(VW('rain', 'mưa', 2), VW('rain', 'mưa', 2) + 1.5, E8 * 1.5, (t, k) => blip(t, 1400 - k * 60, 900 - k * 40, 0.03, 0.014, Math.sin(k) * 0.4));
  blip(VW('rain', 'khí'), 500, 800, 0.08, 0.02, 0.1);
  // rock: crumble ticks on "gặm"/"mòn"; a chime as the minerals dissolve
  each(VW('rock', 'gặm'), VW('rock', 'gặm') + 1.0, E8, (t, k) => blip(t, 700 - k * 50, 500 - k * 40, 0.025, 0.016, -0.2 + k * 0.1));
  chime(VW('rock', 'hòa'), [nz('A5'), nz('E6')], 0.014, 0.2);
  // river: a soft flowing sweep
  sweep(ET('river') + 0.3, ET('river') + 2.6, 0.005, 400, 1200, -0.2);
  // vents: low warm bubbles
  each(VW('vents', 'miệng'), VW('vents', 'miệng') + 1.5, E8, (t, k) => blip(t, 300 + k * 30, 500 + k * 30, 0.06, 0.016, Math.sin(k) * 0.3));
  // evap: an airy rising shimmer on "bốc hơi"; a small low "plop" as the salt stays
  sweep(VW('evap', 'bốc') - 0.1, VW('evap', 'bốc') + 1.1, 0.006, 600, 2600, 0);
  blip(VW('evap', 'ở'), 420, 300, 0.08, 0.02, -0.1);
  // time: soft ticks of the looping years
  each(VW('time', 'cứ'), SIL - 0.2, E8, (t, k) => blip(t, 1500 + (k % 4) * 80, 1300, 0.012, 0.012, 0));
  // bridge whooshes (not on the slam)
  for (const id of ['rain', 'rock', 'river', 'vents', 'evap', 'time', 'balance', 'end']) sweep(ET(id) - 0.45, ET(id), 0.005, 600, 2200, 0);
  sub(SLAM, 0.06);
  chime(SLAM + 0.15, [nz('A5'), nz('D6')], 0.018, 0);
  // balance: a soft settling down-sweep on "lắng"
  sweep(VW('balance', 'lắng') - 0.1, VW('balance', 'lắng') + 0.9, 0.005, 1800, 500, 0);
  // the end: a wave and a small chime on "đá núi"
  chime(VW('end', 'đá'), [nz('D6')], 0.014, 0);
