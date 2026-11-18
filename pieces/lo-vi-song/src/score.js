  // SCORE BODY — lò vi sóng (inside buildScore(); see kit/score-head.js). Under a voice: sparse, low, out of the way.
  // the cold oven: a thin pad + a low hum when it switches on -> the molecules: a soft 8th pulse that thickens through
  // flip/jostle -> a faint bed + a small swell in the pause (never dead silence) -> the payoff chord BLOOMS on the SLAM
  // (0.3 s attack, no click) -> a warm flat pad to the end, the hero motif to close.
  const T = TIMELINE, R = RNG('score');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['E4', 0], ['B4', E8]];                                   // the hero (water molecule) motif: a rising fifth
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('jostle').t1);                                      // the pause starts here, ends on SLAM

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('water') + 0.1, ['E3', 'B3', 'Gs4'], 0.028, { type: 'triangle', cut: 850, att: 0.2, rel: 0.3 });
  motif(0.5, 0.15);
  motif(ET('magnet') + E8, 0.12);
  each(ET('bounce'), ET('water'), BEAT, (t, k) => pluck(t, nz(['Gs4', 'B4', 'Fs4', 'B4'][k % 4]), 0.04, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  // the molecules: navy world, a soft pulse that thickens water -> flip -> jostle
  pad(ET('water'), SIL, ['E3', 'B3', 'Fs4'], 0.026, { cut: 700, att: 0.4, rel: 0.05, send: 0.3 });
  each(ET('water'), SIL, E8, (t, k) => {
    const st = t < ET('flip') ? 0 : t < ET('jostle') ? 1 : 2;
    const on = [k % 4 === 0, k % 2 === 0, true][st];
    if (on) pluck(t, nz(['E4', 'B4', 'Fs4', 'B4', 'Gs4', 'B4', 'Fs4', 'Cs5'][k % 8]), 0.038 + st * 0.004, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.3, 2400 + st * 300, 0.2);
    if (st >= 1 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'B2' : 'E2'), 0.09 + st * 0.01);
  });
  // SOFT payoff (owner feedback "âm thanh to đột ngột"): a faint bed + small swell through the pause, then a blooming chord
  pad(SIL - 0.4, SLAM + 0.4, ['E3', 'B3', 'Fs4'], 0.016, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.013);
  ['E3', 'B3', 'E4', 'Gs4', 'B4', 'E5'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.065, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['E3', 'B3', 'E4', 'Gs4', 'B4'], 0.05, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, DURATION, ['E3', 'B3', 'E4', 'Gs4'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  motif(DURATION - 1.6, 0.07);

  // ================= SFX =================
  to = 's';
  // the oven hum from the magnet line until the molecules (the magnetron is on)
  drone(VW('magnet', 'phát'), ET('water') + 0.3, 60, 0.012, { att: 0.4, rel: 0.4 });
  // the waves bouncing: two soft sweeps
  sweep(VW('bounce', 'dội'), VW('bounce', 'dội') + 0.6, 0.008, 900, 2200, -0.3);
  sweep(VW('bounce', 'tràn'), VW('bounce', 'tràn') + 0.6, 0.008, 1200, 2600, 0.3);
  // flip: tiny ticks as the field flips
  each(VW('flip', 'đổi'), ET('jostle') - 0.2, E16 * 2, (t, k) => blip(t, 900 + (k % 2) * 300, 1300, 0.03, 0.012, k % 2 ? 0.3 : -0.3));
  // jostle: a few soft knocks (molecules bumping), stopping before the pause
  for (let i = 0; i < 10; i++) { const t = VW('jostle', 'chen') + i * 0.14 + R.f() * 0.05; if (t < SIL - 0.2) blip(t, 500 + R.f() * 500, 700, 0.03, 0.02, R.n(0.6)); }
  // bridge whooshes (not on the slam)
  for (const id of ['magnet', 'bounce', 'water', 'flip', 'jostle', 'depth', 'table', 'end']) sweep(ET(id) - 0.45, ET(id), 0.007, 600, 2200, 0);
  sub(SLAM, 0.08);   // a soft low bloom under the chord (no click)
  // the turntable: a low hum + the end "ding" (soft chime) when the oven finishes, on the last line
  drone(ET('table'), ET('end') + 0.5, 60, 0.01, { att: 0.3, rel: 0.4 });
  chime(ET('end') + 0.2, [nz('E6'), nz('B6')], 0.03, 0);
