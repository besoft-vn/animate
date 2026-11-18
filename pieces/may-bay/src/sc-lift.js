// =====================================================================
//  sc-lift.js — push (the wing throws air DOWN, the air pushes the wing UP) -> SLAM -> lift (the big yellow arrow)
//  -> speed (×2 speed = ×4 lift). KHUNG HÌNH GỌN: the same wing, ≤ 4 flow lines, few big arrows, bare paper.
//  Colour: terracotta = hero · COL.air blue = air (flow lines, the air pushed down) · COL.lift yellow = LIFT only.
// =====================================================================
const L_FLOWS = [-360, -130, 150, 300];                         // 4 flow lines past the wing (≤ 6)
const L_UPX = 560, L_UPY0 = 838;                                // the up arrow stands on the wing's top surface here
const L_DN = [840, 990];                                        // the blue down arrow starts under the trailing edge
// the outline of a forceArrow (same shape as props' forceArrow), for the graphite ghost
function l_arrowPts(x0, y0, x1, y1, w) {
  const D = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / D, uy = (y1 - y0) / D, hl = Math.min(w * 1.6, D * 0.6), sl = D - hl, nx = -uy, ny = ux;
  const pt = (s, n) => [x0 + ux * s + nx * n, y0 + uy * s + ny * n];
  return [pt(0, -w / 2), pt(sl, -w / 2), pt(sl, -w), pt(D, 0), pt(sl, w), pt(sl, w / 2), pt(0, w / 2)];
}
// the flow lines with chevrons riding them (u advances with time; `tt` lets a scene freeze them)
function l_flows(down, tt, o = {}) {
  L_FLOWS.forEach((h, i) => {
    const P = flowPts(h, { down });
    flowLine(h, { down, key: 'l_fl' + i, part: o.part ?? 1, a: o.a ?? 0.85 });
    if ((o.part ?? 1) >= 1) for (const s of [0, 0.5]) flowChevron(P, (tt * 0.16 + i * 0.27 + s) % 1, { key: 'l_ch' + i + s });
  });
}
const l_hop = (t0, d = 0.4) => Math.sin(Math.PI * seg(TT, t0, t0 + d));

// ---------------------------------------------------------------------
//  PUSH — the default wing, flow lines bent down (down 1.0 -> 1.3); on "đẩy không khí xuống" a big BLUE arrow grows
//  DOWN under the trailing edge; on "đẩy ngược cánh lên" a graphite ghost of an up arrow pencils on over the wing.
//  The hero sits at BR.pressurePush.b, reacts (look, hop), drifts aside to make room. After the line: the pause.
// ---------------------------------------------------------------------
const L_HPUSH = [760, 630];                                     // where the hero waits through the pause
SCENES.push = function () {
  sketchPage({ grid: 'plain' });
  const TS = TT; TT = Math.min(TT, VL('push').t1);              // after the line: everything holds (the pause), only the boil goes on
  const e0 = ET('push'), tk = VW('push', 'không'), tx = VW('push', 'xuống'), tth = VW('push', 'thì');
  const tn = VW('push', 'đẩy', 2), tl = VW('push', 'lên');
  // the light low-pressure zone from the previous scene fades out as the arrows take over
  const za = 0.7 * (1 - ev(e0 + 0.6, 0.7));
  if (za > 0.02) airZone(540, 700, 260, 80, { a: za, key: 'l_pz' });
  const down = 1 + 0.3 * EZ.io(seg(TT, tk, tx + 0.4));
  l_flows(down, TT);
  airfoil();
  // the BLUE arrow: the air pushed down (grows on "không khí xuống", then breathes a little)
  const kd = EZ.o2(ev(tk, 0.7)), br = TT > tk + 0.7 ? 8 * Math.sin(TAU * (TT - tk - 0.7) / 1.3) : 0;
  forceArrow(L_DN[0], L_DN[1], 870, 1240 + br, { col: COL.air, w: 62, part: kd, key: 'l_dn' });
  // the graphite GHOST of the push back up (not yellow yet): pencilled on over "đẩy ngược cánh lên"
  const kg = ev(tn, VE('push', 'lên') - tn);
  if (kg > 0) {
    const G = l_arrowPts(L_UPX, L_UPY0, L_UPX, 470, 70);
    gpencil(G, { key: 'l_ghost', w: 3.4, a: 0.85, part: kg, closed: true, amp: 1.4 });
    gpencil([[L_UPX - 18, L_UPY0 - 40], [L_UPX - 18, 600]], { key: 'l_ghh', w: 2.4, a: 0.5 * seg(kg, 0.6, 1), part: seg(kg, 0.6, 1) });
  }
  // the hero: exactly at BR.pressurePush.b for the first 0.5 s; looks down the wing on "đẩy", hops when the blue
  // arrow lands, drifts aside on "thì", looks up at the ghost arrow and hops on "lên"
  const [hx0, hy0] = BR.pressurePush.b, wk = EZ.io(seg(TT, tth - 0.2, tth + 0.8));
  let hx = lerp(hx0, L_HPUSH[0], wk), hy = lerp(hy0, L_HPUSH[1], wk) - 34 * l_hop(tx + 0.25) - 30 * l_hop(tl, 0.3);
  if (TT > e0 + 0.5) hy += 5 * Math.sin(TAU * (TT - e0 - 0.5) / 1.6) * (1 - seg(TT, tl - 0.3, tl));   // gentle float
  const look = TT < e0 + 0.35 ? [0, 0] : TT < tth ? [0.9, 0.8] : TT < tn - 0.1 ? [0.6, 0.9] : [-0.9, -0.7];
  const mood = TT < tx ? 'calm' : TT < tn ? 'wow' : 'puzzled';
  const sq = l_hop(tx + 0.25) + l_hop(tl, 0.3);
  heroAir(hx, hy, HR, { key: 'hero', look, mood, wind: 0.6 * Math.sin(Math.PI * wk), dir: Math.atan2(L_HPUSH[1] - hy0, L_HPUSH[0] - hx0), sx: 1 - 0.06 * sq, sy: 1 + 0.08 * sq });
  TT = TS;
  viTag('cánh đẩy khí');
  pageCaption(['cánh đẩy khí xuống'], [[0, 'xuống']], { at: VW('push', 'đẩy') - e0, size: 74 });
  pageCaption(['khí đẩy cánh lên'], [], { at: tth - e0, size: 74, y: 1330 + 74 * 1.12 });
};

// ---------------------------------------------------------------------
//  LIFT — opens COMPLETE on the slam: the same wing, a HUGE yellow arrow up (where the ghost was), "LỰC NÂNG",
//  the blue arrow down smaller. The arrow pulses, the hero cheers and hops over to BR.liftSpeed.a.
// ---------------------------------------------------------------------
SCENES.lift = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('lift'), e1 = EE('lift'), u = TT - e0, tl = VW('lift', 'lực');
  l_flows(1.3, TT);
  airfoil();
  // the air pushed down: smaller now, still breathing
  forceArrow(L_DN[0], L_DN[1], 858, 1150 + 5 * Math.sin(TAU * u / 1.3), { col: COL.air, w: 42, key: 'l_dn2' });
  // LIFT: the huge yellow arrow, a slow pulse (stronger once "lực nâng" is spoken)
  const pk = 1 + seg(TT, tl, tl + 0.3) * 0.8;
  const tip = 395 - 9 * pk * Math.sin(TAU * u / 1.2);
  forceArrow(L_UPX, L_UPY0, L_UPX, tip, { col: COL.lift, w: 106, key: 'l_up' });
  sparkle(L_UPX, tip - 30, 70, seg(TT, e0, e0 + 0.55), 'l_lspk');            // the one small effect: on the slam
  // the label, already written (the hard cut)
  label('LỰC NÂNG', 70, 640, 86, { align: 'left', key: 'l_lbl' });
  // the hero: cheering beside the arrow, hopping over to BR.liftSpeed.a, still there for the last 0.5 s
  const [hx1, hy1] = BR.liftSpeed.a, wk = EZ.io(seg(TT, e0 + 0.3, e1 - 0.7));
  const hx = lerp(L_HPUSH[0], hx1, wk), hops = TT < e1 - 0.5 ? Math.abs(Math.sin(Math.PI * u / 0.5)) * (1 - seg(TT, e1 - 0.75, e1 - 0.5)) : 0;
  const hy = lerp(L_HPUSH[1], hy1, wk) - 30 * hops;
  const wave = Math.sin(TAU * u / 0.5);
  heroAir(hx, hy, HR, { key: 'hero', mood: 'happy', look: [-0.7, -0.8], arms: [1.15 + 0.3 * wave, 1.15 - 0.3 * wave], sx: 1 - 0.05 * hops, sy: 1 + 0.06 * hops });
  viTagNow('lực nâng');
  pageCaption(['khí đẩy cánh lên', '= lực nâng'], [[1, 'lực nâng']], { at: -2, size: 74 });
};

// ---------------------------------------------------------------------
//  SPEED — a chart on the page: "tốc độ ×1" with a small yellow lift arrow, "tốc độ ×2" whose arrow grows to 4× as
//  tall on "gấp bốn" (dashed graphite unit lines); card "×2 → ×4"; on "chạy đà" a small graphite runway sketch with
//  speed lines. The hero floats left -> right above the chart from BR.liftSpeed.b to BR.speedTakeoff.a.
// ---------------------------------------------------------------------
const L_BASE = 1090, L_UNIT = 110, L_C1 = 280, L_C2 = 600;
SCENES.speed = function () {
  sketchPage({ grid: 'plain' });
  const e0 = ET('speed'), e1 = EE('speed');
  const tb = VW('speed', 'bay'), td = VW('speed', 'gấp'), tln = VW('speed', 'lực'), t4 = VW('speed', 'gấp', 2), t4e = VE('speed', 'bốn');
  const tc = VW('speed', 'chạy');
  // the chart's base line (graphite, then ink)
  gpencil([[150, L_BASE], [720, L_BASE + 3]], { key: 'l_basep', w: 3, a: 0.7, part: ev(e0 + 0.1, 0.4) });
  gline([[150, L_BASE], [720, L_BASE + 3]], { key: 'l_base', w: 5, part: ev(e0 + 0.35, 0.45) });
  // the two columns: labels under the base line
  label('tốc độ ×1', L_C1, 1170, 56, { reveal: ev(tb - 0.05, 0.45), key: 'l_s1' });
  label('tốc độ ×2', L_C2, 1170, 56, { reveal: ev(td, 0.45), key: 'l_s2' });
  // ×1: a small yellow lift arrow (1 unit), growing from the base on "Bay nhanh"
  const p1 = 4 * Math.sin(TAU * (TT - tb) / 1.4) * seg(TT, tb + 0.6, tb + 1);
  forceArrow(L_C1, L_BASE - 4, L_C1, L_BASE - L_UNIT - p1, { col: COL.lift, w: 66, part: EZ.o2(ev(tb + 0.25, 0.4)), key: 'l_a1' });
  // the dashed unit line at the ×1 height, then (on "gấp bốn") the 4-unit ruler beside the ×2 column
  const kd = ev(tln, 0.45);
  if (kd > 0) for (let i = 0; i < 7; i++) gpencil([[L_C1 + 60 + i * 50, L_BASE - L_UNIT], [L_C1 + 84 + i * 50, L_BASE - L_UNIT]], { key: 'l_dash' + i, w: 2.6, a: 0.7, part: seg(kd * 7 - i, 0, 1) });
  // ×2: the arrow appears at 1 unit on "lực nâng", then grows to 4 units on "gấp bốn"
  const g4 = EZ.o2(seg(TT, t4, t4e + 0.1)), h2 = L_UNIT * (1 + 3 * g4) + 5 * Math.sin(TAU * (TT - t4e) / 1.4) * seg(TT, t4e + 0.2, t4e + 0.6);
  forceArrow(L_C2, L_BASE - 4, L_C2, L_BASE - h2, { col: COL.lift, w: 66, part: EZ.o2(ev(tln, 0.4)), key: 'l_a2' });
  // the ruler: 4 ticks (1..4) at the right of the ×2 column, ticking in as the arrow passes each unit
  for (let i = 1; i <= 4; i++) {
    const k = ev(i === 1 ? tln + 0.3 : t4 + (i - 1) / 3 * (t4e + 0.1 - t4) * 0.8, 0.2);
    if (k <= 0) continue;
    const y = L_BASE - L_UNIT * i;
    gpencil([[L_C2 + 82, y], [L_C2 + 112, y]], { key: 'l_tk' + i, w: 3, a: 0.9, part: k });
    if (i === 4) label('4', L_C2 + 140, y + 18, 54, { reveal: k, key: 'l_tk4l', col: SK.graph });
    if (i === 1) label('1', L_C2 + 140, y + 18, 54, { reveal: k, key: 'l_tk1l', col: SK.graph });
  }
  if (g4 > 0) gpencil([[L_C2 + 97, L_BASE], [L_C2 + 97, L_BASE - L_UNIT * (1 + 3 * g4)]], { key: 'l_rul', w: 2.4, a: 0.6 });
  // the card "×2 → ×4" (on "bốn")
  const kc = ev(VW('speed', 'bốn'), 0.35), cx = 730, cy = 455;
  if (kc > 0) {
    const C = sketchBox(cx - 165, cy - 60, 330, 120, 14);
    gfill(C, SK.sheet, { a: clamp(kc * 2), key: 'l_cf', off: [6, 6] });
    gline(C, { w: 4, key: 'l_c', part: kc });
    label('×2 → ×4', cx, cy + 24, 70, { reveal: ev(VW('speed', 'bốn') + 0.15, 0.35), key: 'l_ct' });
  }
  // "chạy đà": a small graphite runway sketch with a tiny plane and speed lines, dashes sliding left
  const kr = ev(tc, 0.4);
  if (kr > 0) {
    const RY = 940, rx0 = 770, rx1 = 935, sl = 140 * Math.max(0, TT - tc);
    gpencil([[rx0, RY], [rx1, RY]], { key: 'l_rw', w: 3.4, a: 0.9, part: kr });
    for (let i = 0; i < 3; i++) {
      const x = rx0 + (((i * 70 - sl) % 210) + 210) % 210;
      if (x + 34 < rx1) gpencil([[x, RY + 22], [x + 34, RY + 22]], { key: 'l_rwd' + i, w: 4, a: 0.6 * kr });
    }
    const pk = ev(tc + 0.15, 0.4), px = 815, py = RY - 30;
    gpencil(loopPts(px, py, 56, 15, 0.06), { key: 'l_pb', w: 3, a: 0.9, part: pk });
    gpencil([[px + 34, py - 10], [px + 52, py - 42], [px + 62, py - 12]], { key: 'l_pf', w: 3, a: 0.9, part: pk });
    gpencil([[px - 12, py + 5], [px + 20, py + 7]], { key: 'l_pw', w: 3, a: 0.9, part: pk });
    for (const wx of [px - 22, px + 18]) gpencil(loopPts(wx, RY - 8, 7, 7, 0.1), { key: 'l_pwh' + wx, w: 2.4, a: 0.9, part: pk });
    for (let i = 0; i < 3; i++) {
      const L = 50 + 18 * Math.sin(TT * 9 + i * 2);
      gpencil([[px + 74, py - 16 + i * 14], [px + 74 + L * 0.8, py - 16 + i * 14]], { key: 'l_spd' + i, w: 2.8, a: 0.8, part: ev(tc + 0.3 + i * 0.08, 0.25) });
    }
    label('chạy đà', 852, 830, 54, { reveal: ev(VW('speed', 'đà'), 0.35), key: 'l_cd' });
  }
  // the hero floats left -> right above the chart: watches ×1, stops over ×2 as it grows, then on to the right
  const [ax, ay] = BR.liftSpeed.b, [bx, by] = BR.speedTakeoff.a, mx = 470;
  const w1 = EZ.io(seg(TT, e0 + 0.5, t4 - 0.2)), w2 = EZ.io(seg(TT, t4e + 0.4, e1 - 0.55));
  const hx = lerp(lerp(ax, mx, w1), bx, w2);
  const moving = (TT > e0 + 0.5 && TT < t4 - 0.2) || (TT > t4e + 0.4 && TT < e1 - 0.55);
  const fl = TT > e0 + 0.5 && TT < e1 - 0.5 ? Math.sin(TAU * (TT - e0 - 0.5) / 1.1) * (1 - seg(TT, e1 - 0.8, e1 - 0.5)) : 0;
  const hop = l_hop(t4e - 0.05, 0.4);
  const hy = lerp(ay, by, w2) - 7 * fl - 36 * hop;
  const look = TT < tb ? [0.3, 0.5] : TT < t4 - 0.2 ? [0.5, 0.9] : TT < t4e + 0.4 ? [0.6, 1] : TT < tc ? [0.4, 0.6] : [1, 0.7];
  const mood = TT < t4 ? 'calm' : TT < t4e + 0.6 ? 'wow' : 'happy';
  heroAir(hx, hy, HR, { key: 'hero', look, mood, wind: moving ? 0.7 : 0, dir: 0, sx: 1 - 0.06 * hop, sy: 1 + 0.08 * hop });
  viTag('tốc độ');
  pageCaption(['nhanh gấp đôi'], [], { at: tb - e0, size: 74 });
  pageCaption(['lực nâng gấp bốn'], [[0, 'gấp bốn']], { at: t4 - e0, size: 74, y: 1330 + 74 * 1.12 });
};
