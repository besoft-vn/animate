  // SCORE BODY — máy bay (inside buildScore(); see kit/score-head.js). Under a voice: sparse, low, out of the way.
  // the heavy plane on the runway: a thin pad + a low engine hum -> the airflow: a soft 8th pulse that thickens through
  // bend/pressure/push -> a faint bed + a small swell in the pause (never dead silence) -> the payoff chord BLOOMS on the
  // SLAM (0.3 s attack, no click) -> a warm open pad, the engines spool for the takeoff, the hero motif to close.
  const T = TIMELINE, R = RNG('score');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['G4', 0], ['D5', E8]];                                   // the hero (air parcel) motif: a rising fifth
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('push').t1);                                        // the pause starts here, ends on SLAM

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('bend') + 0.1, ['G3', 'D4', 'B4'], 0.028, { type: 'triangle', cut: 850, att: 0.2, rel: 0.3 });
  motif(0.5, 0.15);
  motif(ET('wing') + E8, 0.12);
  // the airflow: a soft pulse that thickens bend -> pressure -> push
  pad(ET('bend'), SIL, ['G3', 'D4', 'A4'], 0.026, { cut: 750, att: 0.4, rel: 0.05, send: 0.3 });
  each(ET('bend'), SIL, E8, (t, k) => {
    const st = t < ET('pressure') ? 0 : t < ET('push') ? 1 : 2;
    const on = [k % 4 === 0, k % 2 === 0, true][st];
    if (on) pluck(t, nz(['G4', 'D5', 'A4', 'D5', 'B4', 'D5', 'A4', 'E5'][k % 8]), 0.038 + st * 0.004, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.3, 2400 + st * 300, 0.2);
    if (st >= 1 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'D2' : 'G2'), 0.09 + st * 0.01);
  });
  // SOFT payoff: a faint bed + small swell through the pause, then a blooming chord (no stab)
  pad(SIL - 0.4, SLAM + 0.4, ['G3', 'D4', 'A4'], 0.016, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.013);
  ['G3', 'D4', 'G4', 'B4', 'D5', 'G5'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.065, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['G3', 'D4', 'G4', 'B4', 'D5'], 0.05, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, DURATION, ['G3', 'D4', 'G4', 'B4'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  each(ET('takeoff'), ET('end'), BEAT, (t, k) => pluck(t, nz(['B4', 'D5', 'A4', 'D5'][k % 4]), 0.035, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  motif(DURATION - 1.6, 0.07);

  // ================= SFX =================
  to = 's';
  // engine hum while the plane is on screen in the hook/engine; a soft rising spool for the takeoff roll
  drone(0.3, ET('wing') + 0.3, 55, 0.010, { att: 0.6, rel: 0.5 });
  sweep(VW('engine', 'đẩy'), VW('engine', 'đẩy') + 1.0, 0.007, 400, 1400, 0);
  drone(ET('takeoff'), ET('end') + 0.6, 58, 0.012, { att: 1.2, rel: 0.6 });
  sweep(ET('takeoff') + 0.3, VW('takeoff', 'rời'), 0.006, 300, 1800, 0);
  // the air bending down behind the wing: a soft descending sweep
  sweep(VW('bend', 'hắt'), VW('bend', 'hắt') + 0.7, 0.008, 2200, 700, 0.2);
  // push: down then up
  sweep(VW('push', 'xuống'), VW('push', 'xuống') + 0.5, 0.008, 1600, 600, -0.2);
  sweep(VW('push', 'lên'), VW('push', 'lên') + 0.5, 0.008, 600, 1800, 0.2);
  // speed ×2 -> ×4: two small ticks then four
  blip(VW('speed', 'gấp'), 900, 1200, 0.04, 0.02, -0.3);
  for (let i = 0; i < 4; i++) blip(VW('speed', 'gấp', 2) + i * E16, 1200 + i * 150, 1500, 0.04, 0.016, (i - 1.5) * 0.2);
  // bridge whooshes (not on the slam)
  for (const id of ['engine', 'wing', 'bend', 'pressure', 'push', 'speed', 'takeoff', 'end']) sweep(ET(id) - 0.45, ET(id), 0.007, 600, 2200, 0);
  sub(SLAM, 0.08);   // a soft low bloom under the chord (no click)
  chime(VW('takeoff', 'rời') + 0.1, [nz('G5'), nz('D6')], 0.025, 0);
