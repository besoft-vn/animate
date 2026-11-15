// =====================================================================
//  scenes (loop, cycle) — the refrigerant loop map, navy "inside the machine".
//  The ring (RING / ringPts) is the bridge counterpart at ET('loop') and ET('cycle'): it is complete from frame 0.
//  Path parameter f runs clockwise from the top centre: 0 dàn lạnh (top) · .25 máy nén (right) · .5 dàn nóng (bottom) · .75 ống mao (left).
// =====================================================================
let l_RQc = null;
function l_ring() {                                  // closed polyline from the top centre, clockwise
  if (!l_RQc) { const P = ringPts(); l_RQc = resample([[RING.x, RING.y - RING.h / 2], ...P, [RING.x, RING.y - RING.h / 2]], false, 6); }
  return l_RQc;
}
const l_at = (f) => pointAt(l_ring(), mod(f, 1));
// temperature along the loop: cold after the capillary and in the evaporator, hot after the compressor, cooling in the condenser
function l_temp(f) {
  f = mod(f, 1);
  if (f < 0.2) return lerp(0.08, 0.22, f / 0.2);
  if (f < 0.3) return lerp(0.22, 1, smooth(0.2, 0.3, f));
  if (f < 0.42) return 1;
  if (f < 0.6) return lerp(1, 0.55, (f - 0.42) / 0.18);
  if (f < 0.71) return 0.55;
  if (f < 0.79) return lerp(0.55, 0, smooth(0.71, 0.79, f));
  return lerp(0, 0.08, (f - 0.79) / 0.21);
}
const l_shade = (x0, y0, s) => (x, y) => clamp((x - x0 + y - y0) / s);   // light from the top-left

// ---- the fridge interior hint (top, inside the ring) + the bowl of soup in it
function l_fridgeBox(fr, warm) {
  if (fr <= 0) return;
  ctx.save(); ctx.setLineDash([14, 12]);
  ink(rrectPts(262, 486, 556, 236, 26), { closed: true, w: 3, color: 'rgba(200,208,240,0.55)', key: 'l_fbox', frac: fr });
  ctx.restore();
  ink([[600, 700], [800, 700]], { w: 3, color: 'rgba(200,208,240,0.45)', key: 'l_shelf', frac: fr });   // the shelf
  if (fr < 0.6) return;
  // the bowl (cross-section): cream rim, soup surface by temperature
  const x = 712, y = 668;
  paint([[x - 66, y - 18], [x + 66, y - 18], [x + 50, y + 22], [x - 50, y + 22]], { fill: C.navy2, line: C.peri, w: 3, key: 'l_bowl',
    tex: [{ k: 'hatch', a: 0.8, gap: 5, c: C.periD, al: 0.6, dens: l_shade(x - 60, y - 20, 120) }] });
  paint(ellipsePts(x, y - 18, 66, 12, 0, 28), { fill: tempCol(warm), line: C.peri, w: 2.6, key: 'l_soup',
    tex: [{ k: 'cross', c: 'rgba(0,0,0,0.3)', al: 0.4, gap: 5 }] });
}
// ---- dàn lạnh: a meander coil hanging from the top pipe, frost around it
function l_evapCoil(fr, boil) {
  if (fr <= 0) return;
  const P = [[292, 456]]; const xs = [292, 318, 344, 370, 396, 422];
  xs.forEach((x, i) => { if (i % 2 === 0) { P.push([x, 670]); P.push([x + 26, 670]); } else { P.push([x, 500]); if (i < xs.length - 1) P.push([x + 26, 500]); } });
  P.push([448, 500]); P.push([448, 456]);
  ink(P, { w: 20, color: C.peri, key: 'l_coilo', frac: fr, amt: 1 });
  ink(P, { w: 13, color: C.cyan, key: 'l_coil', frac: fr, amt: 1 });
  if (fr < 1) return;
  for (let i = 0; i < 7; i++) { const R = RNG('l_fr', i); star4(R.r(280, 460), R.r(510, 700), R.r(5, 9) * (0.75 + 0.25 * ((B + i) % 2)), C.skyL); }
  // boiling: little bubbles rising in the coil legs
  if (boil > 0) for (let i = 0; i < 9; i++) {
    const R = RNG('l_bub', i), x = xs[i % 6], ph = mod(TT * R.r(0.7, 1.2) + R.f(), 1), y = 665 - ph * 160;
    const r = R.r(3, 6) * boil; ctx.beginPath(); ctx.arc(x + Math.sin(ph * 9 + i) * 2, y, r, 0, TAU);
    ctx.strokeStyle = C.white; ctx.lineWidth = 2; ctx.stroke();
  }
}
// ---- máy nén: a squat can sitting on the right pipe, with a tiny shudder
function l_comp(fr, run) {
  if (fr <= 0) return;
  const [cx, cy] = STATION.comp, s = EZ.back(clamp(fr)), jx = run ? RNG('l_cj', B).n(1.6) : 0;
  ctx.save(); ctx.translate(cx + jx, cy); ctx.scale(s, s);
  paint(rrectPts(-72, -70, 144, 150, 34), { fill: C.navy2, line: C.peri, w: 4, key: 'l_can',
    tex: [{ k: 'cross', c: C.periD, al: 0.55, gap: 6, dens: l_shade(-70, -70, 200) }, { k: 'pencil', c: C.peri, al: 0.25, per: 60, dens: (x, y) => 1 - clamp((x + 70 + y + 70) / 160) }] });
  paint(ellipsePts(0, -70, 72, 22, 0, 30), { fill: C.navy2, line: C.peri, w: 3.4, key: 'l_cantop', tex: [{ k: 'hatch', a: 0.2, gap: 5, c: C.periD, al: 0.6 }] });
  ink([[-72, 40], [72, 40]], { w: 3, color: C.peri, key: 'l_canband' });
  paint(rrectPts(-90, 80, 180, 18, 6), { fill: C.periD, line: C.peri, w: 2.6, key: 'l_canfoot', tex: [{ k: 'hatch', a: 0.8, gap: 4, c: C.navy, al: 0.6 }] });
  // the hot outlet: a short terracotta stub to the pipe below
  ctx.restore();
}
// ---- dàn nóng: fins across the bottom pipe, warm shimmer under them
function l_cond(fr, warm) {
  if (fr <= 0) return;
  const y = STATION.cond[1], n = 15;
  for (let i = 0; i < n; i++) {
    const x = 384 + i * 22, k = clamp(fr * n - i);
    if (k <= 0) break;
    ink([[x, y - 36], [x, y - 36 + 72 * k]], { w: 5, color: C.peri, key: 'l_fin' + i, amt: 0.8 });
  }
  ink([[372, y - 36], [384 + (n - 1) * 22 + 12, y - 36]], { w: 3, color: C.peri, key: 'l_finbar', frac: fr });
  if (warm > 0 && fr >= 1) for (let i = 0; i < 5; i++) {   // heat wavering off the fins into the room
    const P = []; for (let k = 0; k <= 8; k++) P.push([400 + i * 70 + k * 7, y + 46 + Math.sin(k * 1.1 + TT * 5 + i) * 5]);
    ink(P, { w: 3.4, color: 'rgba(217,119,87,0.75)', key: 'l_shim' + i, frac: warm });
  }
}
// ---- ống mao: the fat pipe is replaced by a thin coiled tube on the left
function l_valve(fr) {
  if (fr <= 0) return;
  const x = STATION.valve[0], y0 = 742, y1 = 918;
  ctx.save(); ctx.fillStyle = C.navy; ctx.fillRect(x - 32, y0, 64, y1 - y0); ctx.restore();
  ink([[x, y0 - 6], [x, y0 + 8]], { w: 14, color: C.peri, key: 'l_vstub0' }); ink([[x, y1 - 8], [x, y1 + 6]], { w: 14, color: C.peri, key: 'l_vstub1' });
  const P = []; for (let k = 0; k <= 80; k++) { const u = k / 80; P.push([x + Math.sin(u * TAU * 5) * 22, lerp(y0 + 8, y1 - 8, u)]); }
  ink(P, { w: 9, color: C.peri, key: 'l_capo', frac: fr, amt: 0.7 });
  ink(P, { w: 4.5, color: C.cyan, key: 'l_cap', frac: fr, amt: 0.7 });
}
// the whole map (static parts); o: { ev, comp, cond, valve, box, warm, boil, run, flow }
function l_map(o) {
  l_fridgeBox(o.box, o.warm);
  pipe(l_ring(), { key: 'l_pipe', w: 34, u: l_temp, flow: o.flow, dark: true });
  l_evapCoil(o.ev, o.boil);
  l_valve(o.valve);
  l_cond(o.cond, o.condWarm ?? 0);
  l_comp(o.comp, o.run);
}

// a thermometer that pops in (thermo() has no scale of its own)
function l_thermo(x, y, val, s, o = {}) {
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y);
  thermo(x, y, val, '°C', o);
  ctx.restore();
}
// a heat mote with a soft warm halo (reads on navy)
function l_mote(x, y, r, key) {
  ink(ellipsePts(x, y, r, r, 0, 14), { closed: true, w: r * 0.9, color: 'rgba(240,150,110,0.22)', key: key + 'g' });
  heatMote(x, y, r, key);
}

// =====================================================================
//  4 · loop — "Trong tủ có một vòng ống kín, chứa chất làm lạnh sôi ở khoảng âm mười hai độ."
// =====================================================================
SCENES.loop = function () {
  darkWorld('loop');
  const tV = VW('loop', 'vòng'), tSoi = VW('loop', 'sôi'), tAm = VW('loop', 'âm'), tChat = VW('loop', 'chất');
  const tS = [tV + 0.12, tV + 0.36, tV + 0.6, tV + 0.84];          // stations pop clockwise, quickly
  const box = ev(VW('loop', 'tủ') - 0.1, 0.5);
  // the soup gives off a few slow heat motes that drift up to the coil (it is still warm)
  l_map({ box, warm: 0.8, ev: ev(tS[0] - 0.15, 0.35), comp: ev(tS[1] - 0.1, 0.3), cond: ev(tS[2] - 0.15, 0.35), valve: ev(tS[3] - 0.15, 0.35),
    boil: ev(tSoi, 0.3), run: TT > tS[1], flow: 1, condWarm: ev(tS[2] + 0.2, 0.4) });
  if (box >= 1) for (let i = 0; i < 3; i++) {
    const ph = mod(TT * 0.45 + i / 3, 1), x = 712 - ph * 250 + Math.sin(ph * 7 + i) * 10, y = 640 - ph * 120;
    if (ph < 0.92) l_mote(x, y, 9 + 3 * Math.sin(ph * Math.PI), 'l_lm' + i);
  }
  // R600a on "chất", the thermometer on "âm": the reading falls to −12
  const sR = popS(tChat);
  if (sR > 0) inkCard('R600a', 610, 1000, 50, { rot: 0.03, s: sR });
  const val = lerp(6, -12, EZ.o3(ev(tAm + 0.05, 0.6)));
  l_thermo(470, 985, val, popS(tAm - 0.08), { h: 170, key: 'l_th' });
  // labels (clockwise, after "vòng")
  stationLabel('dàn lạnh', 555, 616, { s: popS(tS[0]), rot: -0.03 });
  stationLabel('máy nén', 700, 770, { s: popS(tS[1]), rot: 0.025 });
  stationLabel('dàn nóng', 540, 1128, { s: popS(tS[2]), rot: -0.02 });
  stationLabel('ống mao', 382, 770, { s: popS(tS[3]), rot: 0.02 });
  // the hero arrives at the evaporator on "sôi" and waits there for the bridge
  const hs = popS(tSoi - 0.1);
  if (hs > 0) { const [hx, hy] = BR.loopEvap.a; ctx.save(); ctx.translate(hx, hy); ctx.scale(hs, hs); ctx.translate(-hx, -hy); dotHero(hx, hy, HR, { key: 'hero', dark: true, mood: TT > tAm ? 'wow' : undefined }); ctx.restore(); }
  inkTag('vòng ống kín');
};

// =====================================================================
//  9 · cycle — "Vòng ấy cứ quay mãi, cho tới khi trong tủ chỉ còn bốn độ."  Then silence: a held frame until the SLAM.
// =====================================================================
const l_MSP = 0.42;                                   // motes: laps per second along the pipe
SCENES.cycle = function () {
  darkWorld('cycle');
  const tStop = VL('cycle').t1, tBon = VW('cycle', 'bốn'), t0 = ET('cycle');
  const realT = TT; TT = Math.min(TT, tStop);         // after the line: everything holds; only the boil (B) goes on
  const cool = EZ.io(seg(TT, VW('cycle', 'quay'), tBon)), temp = lerp(25, 4, cool);
  l_map({ box: 1, warm: lerp(0.8, 0.12, cool), ev: 1, comp: 1, cond: 1, valve: 1, boil: 1, run: realT < tStop, flow: 3, condWarm: 1 });
  // heat motes: rise out of the soup into the pipe, ride clockwise, and are thrown out of the dàn nóng into the room
  const per = 0.26, fIn = 0.068, life = 2.6;
  for (let k = Math.floor((TT - t0 - life) / per); ; k++) {
    const tb = t0 - 0.6 + k * per; if (tb > TT) break;
    const a = TT - tb; if (a < 0 || a > life) continue;
    const R = RNG('l_cm', k), fEx = R.r(0.44, 0.56), x0 = 712 + R.n(30), y0 = 650;
    let x, y, r = 11;
    if (a < 0.35) { const u = EZ.o2(a / 0.35), p = l_at(fIn); x = lerp(x0, p[0], u); y = lerp(y0, p[1], u) - Math.sin(u * Math.PI) * 30; }
    else {
      const f = fIn + (a - 0.35) * l_MSP;
      if (f < fEx) { [x, y] = l_at(f); }
      else {                                           // out through the fins, into the room
        const tEx = 0.35 + (fEx - fIn) / l_MSP, u = (a - tEx) / 0.7; if (u > 1) continue;
        const p = l_at(fEx), side = R.f() < 0.5 ? -1 : 1;
        x = p[0] + side * R.r(40, 150) * EZ.o2(u) + Math.sin(u * 8 + k) * 6; y = p[1] + 30 + R.r(15, 45) * EZ.o2(u); r = 11 * (1 - u * 0.6);
      }
    }
    l_mote(x, y, r, 'l_cm' + (k % 12));
  }
  // the fridge thermometer: 25 → 4 °C, landing on "bốn"
  l_thermo(500, 1010, temp, 1, { h: 300, key: 'l_th2' });
  handText('trong tủ', 562, 930, 52, C.peri, { key: 'l_trongtu' });
  if (TT >= tBon) {                                    // frost ticks around the bulb when it lands
    const k = ev(tBon, 0.35);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.3; star4(500 + Math.cos(a) * (70 + 24 * k), 1040 + Math.sin(a) * (70 + 24 * k), 8 * k, C.skyL); }
  }
  // the hero rides the loop with the heat
  const hf = (TT - (t0 + 0.2)) * 0.3, hp = l_at(hf);
  const hs = popS(t0 + 0.1);
  if (hs > 0) { ctx.save(); ctx.translate(hp[0], hp[1]); ctx.scale(hs, hs); ctx.translate(-hp[0], -hp[1]); dotHero(hp[0], hp[1], HR, { key: 'hero', dark: true, mood: 'happy' }); ctx.restore(); }
  TT = realT;
  inkTag('cứ thế quay');
};
