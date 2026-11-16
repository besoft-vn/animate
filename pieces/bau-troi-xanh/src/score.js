  // SCORE BODY — bầu trời xanh (inside buildScore(); see kit/score-head.js). Under a voice: sparse, low, out of the way.
  // kitchen: a warm thin pad -> the loop: a pulse (8ths) that thickens through the machine -> densest in "cycle"
  // -> hard stop, near-silence -> the thermostat click = the loudest hit, on the SLAM -> a flat warm chord to the end.
  const T = TIMELINE, R = RNG('score');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HEAT = [['D4', 0], ['A4', E8]];                                     // the hero (heat) motif: a rising fifth
  const motif = (t, vel) => HEAT.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('scatter').t1);                                        // the silence starts here, ends on SLAM

  // ================= MUSIC =================
  to = 'm';
  // 1-3 kitchen: warm, thin
  pad(0.0, ET('air') + 0.1, ['D3', 'A3', 'Fs4'], 0.03, { type: 'triangle', cut: 850, att: 0.2, rel: 0.3 });
  motif(0.5, 0.16);
  motif(ET('white') + E8, 0.13);
  each(ET('waves'), ET('air'), BEAT, (t, k) => pluck(t, nz(['Fs4', 'A4', 'E4', 'A4'][k % 4]), 0.045, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  // 4-8 the loop: cold minor-ish colour, a soft 8th pulse that thickens station by station
  pad(ET('air'), SIL, ['D3', 'A3', 'E4'], 0.028, { cut: 700, att: 0.4, rel: 0.02, send: 0.3 });
  each(ET('air'), SIL, E8, (t, k) => {
    const st = t < ET('scatter') ? 2 : t < VW('scatter', 'hất') ? 4 : 5;
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
  // the white light splitting into a rainbow: a soft rising chime run
  for (let i = 0; i < 6; i++) chime(VW('white', 'cầu') + i * E16, [nz(['D5', 'E5', 'Fs5', 'A5', 'B5', 'D6'][i])], 0.012, (i - 2.5) * 0.15);
  // the waves: two soft sweeps (long = low, short = high)
  sweep(VW('waves', 'đỏ'), VW('waves', 'đỏ') + 0.8, 0.008, 300, 600, -0.3);
  sweep(VW('waves', 'xanh'), VW('waves', 'xanh') + 0.5, 0.008, 1200, 2600, 0.3);
  // scatter: a burst of small blips as the blue flies off in every direction
  for (let i = 0; i < 8; i++) blip(VW('scatter', 'hất') + i * 0.06, 1800 + R.f() * 800, 3200, 0.05, 0.02, R.n(0.7));
  // bridge whooshes
  for (const id of ['white', 'waves', 'air', 'scatter', 'violet', 'sunset', 'end']) sweep(ET(id) - 0.45, ET(id), 0.008, 600, 2200, 0);
  // the slam: a bright transient + sub on the cut into the blue sky (the loudest moment)
  noiseHit(SLAM, 0.03, 'highpass', 2500, 0.9, 0.45, 0);
  sub(SLAM, 0.3);
