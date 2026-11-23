  // SCORE BODY — vết thương (inside buildScore(); see kit/score-head.js). Under a voice: sparse, warm, out of the way.
  // a gentle pad + the hero motif -> plug/clot: soft plucks gathering (platelets arriving = small ticks) -> clean: a busier
  // pulse -> fill: a warm weaving arpeggio -> crawl: slow rising steps, a faint bed + small swell in the pause (never dead
  // silence) -> the payoff chord BLOOMS on the SLAM (0.3 s attack, no click) -> a warm low pad -> the motif to close.
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO = [['G4', 0], ['D5', E8], ['B4', BEAT]];
  const motif = (t, vel) => HERO.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2400, 0.35));
  const SIL = snap8(VL('crawl').t1);

  // ================= MUSIC =================
  to = 'm';
  pad(0.0, ET('plug') + 0.1, ['G3', 'D4', 'B4'], 0.024, { type: 'triangle', cut: 800, att: 0.3, rel: 0.3 });
  motif(0.5, 0.11);
  pad(ET('plug'), ET('fill') + 0.1, ['E3', 'B3', 'G4'], 0.022, { cut: 750, att: 0.4, rel: 0.1, send: 0.3 });
  each(ET('plug'), ET('fill'), E8, (t, k) => {
    const st = t < ET('clot') ? 0 : t < ET('clean') ? 1 : 2;
    const on = [k % 2 === 0, k % 2 === 0, true][st];
    if (on) pluck(t, nz([['E5', 'B4', 'G5', 'B4'], ['E5', 'B4', 'A5', 'B4'], ['E5', 'C5', 'G5', 'C5']][st][k % 4]), 0.03 + st * 0.003, Math.sin(k * 0.9) * 0.3, 0.3, 2200 + st * 300, 0.25);
    if (k % 4 === 0) bass(t, nz(st === 2 ? 'C2' : 'E2'), 0.08);
  });
  pad(ET('fill'), SIL, ['C3', 'G3', 'E4'], 0.022, { cut: 900, att: 0.4, rel: 0.1, send: 0.35 });
  each(ET('fill'), ET('crawl'), E8, (t, k) => pluck(t, nz(['C5', 'E5', 'G5', 'E5', 'D5', 'G5'][k % 6]), 0.028, Math.sin(k) * 0.4, 0.35, 2400, 0.3));
  each(ET('crawl'), SIL, BEAT, (t, k) => pluck(t, nz(['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C6', 'D6'][k % 12]), 0.03, Math.sin(k) * 0.3, 0.4, 2400, 0.3));
  // SOFT payoff: a faint bed + small swell through the pause, then a blooming chord (no stab)
  pad(SIL - 0.6, SLAM + 0.4, ['D3', 'A3', 'E4'], 0.009, { type: 'triangle', cut: 600, att: 0.3, rel: 0.3 });
  riser(SIL - 0.1, SLAM, 0.007);
  ['G3', 'D4', 'G4', 'B4', 'D5', 'G5'].forEach((n, i) => pluck(SLAM + 0.05 + i * 0.06, nz(n), 0.06, (i - 2.5) * 0.15, 0.9, 2600, 0.45));
  pad(SLAM, SLAM + 2.3, ['G3', 'D4', 'G4', 'B4'], 0.048, { cut: 2000, att: 0.35, rel: 0.7, send: 0.45 });
  pad(SLAM + 2.0, DURATION, ['C3', 'G3', 'E4', 'B4'], 0.016, { cut: 1000, att: 0.3, rel: 0.4, send: 0.45 });
  each(ET('end'), DURATION - 1.8, BEAT, (t, k) => pluck(t, nz(['B4', 'D5', 'G5', 'D5'][k % 4]), 0.028, Math.sin(k) * 0.3, 0.5, 2200, 0.35));
  motif(DURATION - 1.7, 0.07);

  // ================= SFX =================
  to = 's';
  each(VW('plug', 'tiểu'), VE('plug', 'nhau'), E16 * 2, (t, k) => blip(t, 1200 + k * 40, 1000 + k * 40, 0.03, 0.016, Math.sin(k) * 0.4));   // platelets arriving
  sweep(VW('clot', 'đan'), VW('clot', 'đan') + 0.9, 0.005, 500, 1500, 0.1);        // the net weaving
  blip(VW('clean', 'ăn'), 380, 240, 0.12, 0.03, 0.2);                               // a white cell gulps a germ
  blip(VW('clean', 'khuẩn') + 0.3, 360, 230, 0.12, 0.026, -0.2);
  chime(VW('fill', 'dệt'), [nz('E5'), nz('G5')], 0.012, 0);
  sweep(VW('crawl', 'bò'), VW('crawl', 'bò') + 1.6, 0.004, 300, 900, 0);
  for (const id of ['plug', 'clot', 'clean', 'fill', 'crawl', 'moist', 'scar', 'end']) sweep(ET(id) - 0.45, ET(id), 0.006, 600, 2200, 0);
  sub(SLAM, 0.07);
  chime(SLAM + 0.2, [nz('B5'), nz('D6')], 0.018, 0);
  blip(VW('moist', 'ẩm'), 900, 500, 0.15, 0.02, 0);                                 // a soft water drop
  chime(VW('end', 'bong') + 0.1, [nz('G5'), nz('B5')], 0.016, 0);                   // the scab falls off
