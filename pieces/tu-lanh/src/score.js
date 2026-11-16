  // SCORE BODY — tủ lạnh (inside buildScore(); see kit/score-head.js). Under a voice: sparse, low, out of the way.
  // kitchen: a warm thin pad -> the loop: a pulse (8ths) that thickens through the machine -> densest in "cycle"
  // -> hard stop, near-silence -> the thermostat click = the loudest hit, on the SLAM -> a flat warm chord to the end.
  const T = TIMELINE, R = RNG('score');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HEAT = [['D4', 0], ['A4', E8]];                                     // the hero (heat) motif: a rising fifth
  const motif = (t, vel) => HEAT.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('cycle').t1);                                        // the silence starts here, ends on SLAM

  // ================= MUSIC =================
  to = 'm';
  // 1-3 kitchen: warm, thin
  pad(0.0, ET('loop') + 0.1, ['D3', 'A3', 'Fs4'], 0.03, { type: 'triangle', cut: 850, att: 0.2, rel: 0.3 });
  motif(0.5, 0.16);
  motif(ET('turn') + E8, 0.13);
  each(ET('sweat'), ET('loop'), BEAT, (t, k) => pluck(t, nz(['Fs4', 'A4', 'E4', 'A4'][k % 4]), 0.045, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  // 4-8 the loop: cold minor-ish colour, a soft 8th pulse that thickens station by station
  pad(ET('loop'), SIL, ['D3', 'A3', 'E4'], 0.028, { cut: 700, att: 0.4, rel: 0.02, send: 0.3 });
  each(ET('loop'), SIL, E8, (t, k) => {
    const st = t < ET('evap') ? 0 : t < ET('comp') ? 1 : t < ET('cond') ? 2 : t < ET('valve') ? 3 : t < ET('cycle') ? 4 : 5;
    const on = [k % 4 === 0, k % 2 === 0, k % 2 === 0, k % 2 === 0, true, true][st];
    const dry = t >= SIL - BEAT ? 0.02 : 0.2;
    if (on) pluck(t, nz(['D4', 'A4', 'E4', 'A4', 'Fs4', 'A4', 'E4', 'B4'][k % 8]), 0.04 + st * 0.003, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.3, 2600 + st * 300, dry);
    if (st >= 2 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.1 + st * 0.008);
    if (st >= 5 && k % 4 === 0) sub(t, 0.05);
  });
  // the payoff: the click's chord stab on the SLAM, then a flat warm chord under the last line, the motif to close
  ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'].forEach((n, i) => pluck(SLAM + i * 0.006, nz(n), 0.34, (i - 2.5) * 0.15, 0.7, 5000, 0.4));
  pad(SLAM, SLAM + 0.4, ['D3', 'A3', 'D4', 'Fs4', 'A4'], 0.45, { cut: 3400, att: 0.008, rel: 0.35, send: 0.3 });
  pad(SLAM + 0.3, SLAM + 2.3, ['D3', 'A3', 'D4', 'Fs4', 'A4'], 0.04, { cut: 2200, att: 0.05, rel: 0.6, send: 0.4 });   // the flat warm chord, held through the payoff act
  pad(SLAM + 2.0, DURATION, ['D3', 'A3', 'D4', 'Fs4'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  motif(DURATION - 1.6, 0.07);

  // ================= SFX =================
  to = 's';
  // steam hiss in the kitchen, a fridge hum
  noiseHit(0.2, 1.4, 'bandpass', 5200, 1.2, 0.012, 0.2);
  drone(0.0, ET('loop'), 50, 0.012, { att: 0.5, rel: 0.4 });
  // the sweat drop evaporating: a soft rising sweep
  sweep(VW('sweat', 'bay'), VW('sweat', 'bay') + 0.6, 0.01, 800, 4200, -0.2);
  sweep(ET('loop') - 0.45, ET('loop'), 0.01, 600, 2400, 0);
  // evap: bubbles (random blips) from "sôi"
  for (let i = 0; i < 18; i++) { const t = VW('evap', 'sôi') + i * 0.17 + R.f() * 0.08; if (t < ET('comp') - 0.2) blip(t, 600 + R.f() * 900, 1400 + R.f() * 800, 0.04, 0.025, R.n(0.5)); }
  // comp: piston thumps on the beat
  each(ET('comp'), ET('cond'), BEAT, (t) => { noiseHit(t, 0.08, 'lowpass', 220, 0.8, 0.05, 0); });
  // cond: a warm whoosh out into the room on "chảy"
  sweep(VW('cond', 'chảy'), VW('cond', 'chảy') + 0.7, 0.012, 2600, 500, 0.3);
  // valve: the hiss of the pressure drop on "tụt"
  noiseHit(VW('valve', 'tụt'), 0.9, 'highpass', 6000, 0.7, 0.03, 0, 0, 9000);
  for (let i = 0; i < 5; i++) chime(VW('valve', 'lạnh') + i * E16, [nz('A5') * (1 + i * 0.12)], 0.015, (i - 2) * 0.2);
  // cycle: the bridge whoosh, nothing after the silence starts
  sweep(ET('cycle') - 0.45, ET('cycle'), 0.01, 600, 2400, 0);
  // the thermostat click: a sharp transient + sub on the SLAM (the loudest moment)
  noiseHit(SLAM, 0.03, 'highpass', 2500, 0.9, 0.5, 0);
  noiseHit(SLAM + 0.012, 0.05, 'bandpass', 1800, 3, 0.35, 0);
  sub(SLAM, 0.3);
