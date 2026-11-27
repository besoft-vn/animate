  // SCORE BODY — cầu vồng (inside buildScore(); see kit/score-head.js). Under a voice: sparse, low, out of the way.
  // a light after-rain pad -> setup: soft drips; white: a shimmer; enter/reflect/angle: a gentle glassy 8th pulse
  // (prism-like arpeggio up the scale as colours split); one: two bell tones (high red, low violet); circle: the pulse
  // thickens -> a faint bed + small swell in the pause (never dead silence) -> the payoff chord BLOOMS on the SLAM
  // (0.3 s attack, no click) + soft sub -> end: a settled pad and the hero motif.
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['E4', 0], ['B4', E8]];
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('circle').t1);

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('enter') + 0.1, ['E3', 'B3', 'G#4'], 0.024, { type: 'triangle', cut: 800, att: 0.3, rel: 0.3 });
  motif(0.6, 0.035);
  pad(ET('enter'), SIL, ['E3', 'B3', 'F#4'], 0.022, { cut: 750, att: 0.4, rel: 0.05, send: 0.3 });
  each(ET('enter'), SIL, E8, (t, k) => {
    const st = t < ET('one') ? 0 : t < ET('circle') ? 1 : 2;
    const on = [k % 2 === 0, k % 2 === 0, true][st];
    if (on) pluck(t, nz(['E4', 'G#4', 'B4', 'C#5', 'D#5', 'F#5', 'D#5', 'B4'][k % 8]), 0.03 + st * 0.004, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.3, 2400 + st * 300, 0.25);
    if (st >= 1 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'B1' : 'E2'), 0.08 + st * 0.01);
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
  // hook: soft steps as the hero walks toward the rainbow's foot
  each(0.8, 4.4, BEAT * 0.75, (t, k) => blip(t, 260, 200, 0.05, 0.012, Math.sin(k) * 0.2));
  // setup: a few soft drips on "mưa"
  each(VW('setup', 'mưa'), VW('setup', 'mưa') + 1.5, E8 * 1.5, (t, k) => blip(t, 1400 - k * 60, 900 - k * 40, 0.03, 0.012, Math.sin(k) * 0.4));
  // white: a shimmer on "mọi màu"
  chime(VW('white', 'hỗn'), [nz('B5'), nz('E6'), nz('G#6')], 0.012, 0.1);
  // enter: a glassy bend on "bẻ cong"
  sweep(VW('enter', 'bẻ') - 0.1, VW('enter', 'bẻ') + 0.7, 0.005, 1800, 900, -0.1);
  // reflect: a small "ping" off the back of the drop; a soft spread as the colours split
  blip(VW('reflect', 'dội'), 1600, 1200, 0.06, 0.016, 0.2);
  chime(VW('reflect', 'tách'), [nz('E5'), nz('B5'), nz('E6')], 0.012, -0.1);
  // angle: two ticks on the two angles
  chime(VW('angle', 'bốn', 1), [nz('E6')], 0.012, 0.2);
  chime(VW('angle', 'bốn', 2), [nz('B5')], 0.012, -0.2);
  // one: high bell (red, high drop) then low bell (violet, low drop)
  chime(VW('one', 'cao'), [nz('E6')], 0.016, 0.2);
  chime(VW('one', 'thấp'), [nz('E5')], 0.016, -0.2);
  // circle: an airy rising sweep as the ring lights up
  sweep(VW('circle', 'sáng') - 0.1, VW('circle', 'vòng') + 0.4, 0.006, 500, 2400, 0);
  // bridge whooshes (not on the slam)
  for (const id of ['setup', 'white', 'enter', 'reflect', 'angle', 'one', 'circle', 'end']) sweep(ET(id) - 0.45, ET(id), 0.005, 600, 2200, 0);
  sub(SLAM, 0.06);
  chime(SLAM + 0.15, [nz('B5'), nz('E6')], 0.018, 0);
  // the end: a small chime on "riêng"
  chime(VW('end', 'riêng'), [nz('E6')], 0.014, 0);
