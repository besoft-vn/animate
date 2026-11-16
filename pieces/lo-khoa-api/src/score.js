  // SCORE BODY — lộ khoá API (inside buildScore(); see kit/score-head.js). Under a voice: sparse, low, out of the way.
  // kitchen: a warm thin pad -> the loop: a pulse (8ths) that thickens through the machine -> densest in "cycle"
  // -> hard stop, near-silence -> the thermostat click = the loudest hit, on the SLAM -> a flat warm chord to the end.
  const T = TIMELINE, R = RNG('score');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HEAT = [['D4', 0], ['A4', E8]];                                     // the hero (heat) motif: a rising fifth
  const motif = (t, vel) => HEAT.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const SIL = snap8(VL('link4').t1);                                        // the silence starts here, ends on SLAM

  // ================= MUSIC =================
  to = 'm';
  // 1-3 kitchen: warm, thin
  pad(0.0, ET('link1') + 0.1, ['D3', 'A3', 'Fs4'], 0.03, { type: 'triangle', cut: 850, att: 0.2, rel: 0.3 });
  motif(0.5, 0.16);
  motif(ET('intro') + E8, 0.13);
  each(ET('intro'), ET('link1'), BEAT, (t, k) => pluck(t, nz(['Fs4', 'A4', 'E4', 'A4'][k % 4]), 0.045, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  // 4-8 the loop: cold minor-ish colour, a soft 8th pulse that thickens station by station
  pad(ET('link1'), SIL, ['D3', 'A3', 'E4'], 0.028, { cut: 700, att: 0.4, rel: 0.02, send: 0.3 });
  each(ET('link1'), SIL, E8, (t, k) => {
    const st = t < ET('link2') ? 1 : t < ET('link3') ? 2 : t < ET('link4') ? 3 : 5;
    const on = [k % 4 === 0, k % 2 === 0, k % 2 === 0, k % 2 === 0, true, true][st];
    const dry = t >= SIL - BEAT ? 0.02 : 0.2;
    if (on) pluck(t, nz(['D4', 'A4', 'E4', 'A4', 'Fs4', 'A4', 'E4', 'B4'][k % 8]), 0.04 + st * 0.003, Math.sin(k * 0.9) * 0.3, t >= SIL - E8 ? 0.15 : 0.3, 2600 + st * 300, dry);
    if (st >= 2 && k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.1 + st * 0.008);
    if (st >= 5 && k % 4 === 0) sub(t, 0.05);
  });
  // the payoff: the click's chord stab on the SLAM, then a flat warm chord under the last line, the motif to close
  // SOFT payoff (owner feedback: "âm thanh to đột ngột"): a quiet swell inside the pause announces it, then the chord
  // blooms (0.3 s attack) instead of a stab — the payoff is the warmest moment, not a bang
  riser(SIL + 0.1, SLAM, 0.010);
  pad(SIL - 0.1, SLAM + 0.4, ['D3', 'A3', 'E4'], 0.010, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });   // a faint bed: the pause is quiet, never dead silent
  ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'].forEach((n, i) => pluck(SLAM + i * 0.03, nz(n), 0.11, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['D3', 'A3', 'D4', 'Fs4', 'A4'], 0.05, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });   // the warm chord blooms and holds through the payoff act
  pad(SLAM + 2.0, DURATION, ['D3', 'A3', 'D4', 'Fs4'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  motif(DURATION - 1.6, 0.07);

  // ================= SFX =================
  to = 's';
  // typing in the chat box (hook)
  for (let i = 0; i < 14; i++) blip(1.2 + i * E16, 1400 + (i % 3) * 300, 1200, 0.03, 0.03);
  // a chain link clicking in at the start of each link scene
  for (const id of ['link1', 'link2', 'link3', 'link4']) { noiseHit(ET(id) + 0.5, 0.05, 'bandpass', 2400, 4, 0.06, 0); blip(ET(id) + 0.52, 900, 600, 0.06, 0.03); }
  // bridge whooshes
  for (const id of ['intro', 'link1', 'link2', 'link3', 'link4', 'harm', 'lesson', 'fix']) sweep(ET(id) - 0.45, ET(id), 0.008, 600, 2200, 0);
  // the slam into the malicious extension (loudest)
  sub(SLAM, 0.08);   // a soft low bloom under the chord (no click)
  // the fix: a soft confirm chime when the key is masked
  chime(VW('fix', 'che'), [nz('D6'), nz('A5')], 0.03, 0);
