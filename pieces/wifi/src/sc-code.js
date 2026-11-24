// =====================================================================
//  sc-code.js — eras qam · ofdm · ack (owned by the sc-code agent). Every state is a function of TT.
//   qam  (25.75–30.5)  a plane (faint axes): each wave shape = a point; distance from the centre = height (red
//                      segment), angle = shift (green arc). 4 points -> they split into the 4×4 grid (16 big points)
//                      -> "nghìn": the grid shrinks into a tinted square "32 × 32 = 1024 kiểu" (no 1024 dots) ->
//                      "1024 = 2¹⁰" -> one point is picked (yellow track dot) and carries a row of 10 yellow bits.
//   ofdm (30.5–35.75)  6 blue sub-waves stacked (slightly different frequencies, "⋮" between the 5th and 6th for the
//                      hundreds), each with a small yellow bit group; all drift RIGHT together; a brace "hơn 200 /
//                      sóng con" and a small line "Wi-Fi 6: 234 / kênh 20 MHz". "cùng lúc": all bit groups pulse at once.
//   ack  (50.0–56.0)   small router left, phone right; packets (box + 3 yellow bits) fly router -> phone; each arrival
//                      sends a teal "đã nhận ✓" block back LEFT. Packet 3 breaks (grey, cracked, ✗), no teal; the router
//                      re-sends it -> arrives -> teal ✓. The phone's screen shows 3 slots filling (slot 3 waits).
//  The hero stays at HOME at every boundary (±0.5 s); in between it looks, changes mood, hops once.
// =====================================================================
let CD_Wc = null;
function CD_W() {
  if (CD_Wc) return CD_Wc;
  CD_Wc = {
    q0: ET('qam'), q1: EE('qam'), co: VW('qam', 'có'), nghin: VW('qam', 'nghìn'), kieu: VW('qam', 'kiểu'),
    moi: VW('qam', 'mỗi'), muoi: VW('qam', 'mười'),
    o0: ET('ofdm'), o1: EE('ofdm'), song: VW('ofdm', 'sóng'), chay: VW('ofdm', 'chạy'), cung: VW('ofdm', 'cùng'),
    nhieu: VW('ofdm', 'nhiều'),
    a0: ET('ack'), a1: EE('ack'), dien: VW('ack', 'điện'), da: VW('ack', 'đã'), hong: VW('ack', 'hỏng'),
    gui: VW('ack', 'gửi'),
  };
  return CD_Wc;
}
const CD_hero = (o = {}) => heroAt(...HOME, o);
// a stroked check mark / cross (no font dependency)
function CD_check(x, y, s, c, p = 1, w = 6) {
  if (p <= 0) return;
  const P = [[x - 0.5 * s, y], [x - 0.15 * s, y + 0.35 * s], [x + 0.55 * s, y - 0.4 * s]];
  showCreation(P, p, { c, w });
}
function CD_cross(x, y, s, c, p = 1, w = 6) {
  if (p <= 0) return;
  segLine(x - s / 2, y - s / 2, x + s / 2, y + s / 2, c, w, smoothM(p * 2));
  segLine(x + s / 2, y - s / 2, x - s / 2, y + s / 2, c, w, smoothM(p * 2 - 1));
}

// =====================================================================  QAM
const CD_Q4 = [[2, 2], [-2, 2], [-2, -2], [2, -2]];
const CD_BITS = '1011001110';
SCENES.qam = function () {
  const w = CD_W(), t = TT;
  // the plane slides left and scales once it becomes the square
  const us = EZ.io(seg(t, w.nghin + 0.05, w.nghin + 0.8));
  const ox = lerp(470, 300, us), oy = lerp(740, 720, us), u = lerp(68, 52, us);
  const ax = axes2({ at: [ox, oy], u, x: [-4.2, 4.2], y: [-4.2, 4.2], ext: 0.25, step: 1, tick: 6, p: runS(w.q0, 0.7), al: 0.55, c: MC.grey, w: 3 });
  const to = (x, y) => [ox + x * u, oy - y * u];
  // the square (1024 shapes) fades up while the 16 points shrink into it
  const sq = EZ.io(seg(t, w.nghin + 0.1, w.nghin + 0.8));
  if (sq > 0) {
    const [l, tp] = to(-4, 4), [r, b] = to(4, -4);
    showCreation([[l, tp], [r, tp], [r, b], [l, b]], sq, { c: COL.wave, w: 4, closed: true, fill: 0.2, al: 0.9 });
  }
  // the points: 4 (QAM-4) -> split into 16 (4×4) -> shrink into the square
  const split = EZ.io(seg(t, w.co - 0.05, w.co + 0.45));
  const gone = EZ.io(seg(t, w.nghin + 0.05, w.nghin + 0.6));
  const SAMPLE = [2, 0, 0, 1];   // parent 0 (upper right), child (3, 1)
  CD_Q4.forEach(([px, py], i) => {
    const app = EZ.o2(seg(t, w.q0 + 0.1 + i * 0.08, w.q0 + 0.45 + i * 0.08));
    for (let j = 0; j < 4; j++) {
      const cx = px + Math.sign(px) * (j % 2 ? 1 : -1), cy = py + Math.sign(py) * (j < 2 ? 1 : -1);
      if (split <= 0 && j > 0) continue;
      const isS = i === 0 && cx === 3 && cy === 1;
      if (isS) continue;
      const x = lerp(px, cx, split) * (1 - 0.15 * gone), y = lerp(py, cy, split) * (1 - 0.15 * gone);
      const [sx, sy] = to(x, y);
      mDot(sx, sy, 20 * app * lerp(1, 0.3, gone), COL.wave, 1 - gone);
    }
  });
  // the sample point: white, with its height (red, from the centre) and its shift (green angle arc)
  const pick = EZ.io(seg(t, w.kieu + 0.5, w.moi + 0.2));
  let spx = lerp(2, 3, split), spy = lerp(2, 1, split);
  const mv = EZ.io(seg(t, w.nghin + 0.1, w.nghin + 0.8));
  spx = lerp(spx, 2.625, mv); spy = lerp(spy, 1.375, mv);
  const [sx, sy] = to(spx, spy), app0 = EZ.o2(seg(t, w.q0 + 0.1, w.q0 + 0.45));
  const rp = runS(w.q0 + 0.35, 0.6), gp = runS(w.q0 + 0.6, 0.6);
  segLine(ox, oy, sx, sy, COL.amp, 6, rp);
  const ang = Math.atan2(-(sy - oy), sx - ox);
  angleArc(ox, oy, 62, 0, -ang, COL.phase, gp, 6);
  if (pick < 1) mDot(sx, sy, lerp(20, 14, mv) * app0, COL.text, 1 - pick);
  if (pick > 0) trackDot(sx, sy, COL.bit, { r: lerp(14, 16, pick) * (1 + 0.12 * Math.sin(t * 5)), al: pick });
  // legend: the two meanings, in their colours
  vt([{ s: 'độ cao', c: COL.amp }], 210, 445, 56, runS(w.q0 + 0.4, 0.8));
  vt([{ s: 'độ lệch', c: COL.phase }], 720, 445, 56, runS(w.q0 + 0.65, 0.8));
  // the count
  vt([{ s: '32 × 32 = ', c: COL.text }, { s: '1024', c: COL.wave }, { s: ' kiểu', c: COL.text }], 470, 1035, 60, runS(w.nghin + 0.3, 0.9));
  const ftx = writeTex([mn('1024', COL.wave), '=', mn('2', MC.white, { sup: '10', supC: COL.bit })], 470, 1140, 72, runS(w.kieu - 0.05, 0.8));
  // the picked point carries 10 bits
  const bp = runS(w.kieu + 0.45, 0.8);
  if (bp > 0) segLine(sx + 20, sy - 4, 585, 630, COL.bit, 3, smoothM(bp * 2), 0.8);
  const fl = seg(t, w.muoi, w.muoi + 0.45);
  ctx.save();
  const k = indicateS(seg(t, w.muoi, w.muoi + 0.6), 0.12);
  ctx.translate(752, 640); ctx.scale(k, k); ctx.translate(-752, -640);
  bitRow(CD_BITS, 752, 660, 54, bp, { gap: 33 });
  ctx.restore();
  flashAt(sx, sy, fl, MC.yellowP, 30, 4);
  // brace under the bits: 10 of them
  mBrace(595, 690, 910, 690, { side: -1, p: runS(w.moi + 0.25, 0.6), c: COL.bit, w: 3, h: 20, al: 0.9 });
  // hero: watches the plane, "wow" at a thousand, a hop at "mười bit" (home again by q1 - 0.5)
  const mood = t < w.nghin ? 'calm' : t < w.kieu + 0.4 ? 'wow' : t < w.muoi ? 'calm' : 'happy';
  CD_hero({ look: t < w.kieu + 0.4 ? [ox, oy] : [sx, sy], mood, hop: seg(t, w.muoi, Math.min(w.muoi + 0.4, w.q1 - 0.55)) });
  viTag('5', TITLES.qam);
};

// =====================================================================  OFDM
const CD_ROWS = [480, 572, 664, 756, 848, 1010];
const CD_LAM = [150, 132, 118, 104, 92, 80];
const CD_OB = ['101', '011', '110', '001', '100', '111'];
SCENES.ofdm = function () {
  const w = CD_W(), t = TT;
  const sp = lerp(70, 150, EZ.io(seg(t, w.chay - 0.2, w.chay + 0.5)));
  const drift = 70 * (t - w.o0) + (sp - 70) * Math.max(0, t - w.chay);
  const pulse = seg(t, w.cung, w.cung + 0.7);
  CD_ROWS.forEach((y, i) => {
    const t0 = w.o0 + 0.05 + i * 0.12;
    const p = runS(t0, 0.7);
    const amp = 24 * (1 + 0.35 * thereBack(pulse));
    sineWave(232, 650, y, { lam: CD_LAM[i], amp, drift: drift + i * 23, p, w: 5, al: 0.95 });
    // a small arrow at the right end: the waves travel right
    if (p > 0.95) mArrow(662, y, 690, y, COL.wave, 3, 1, 0.6);
    // the bit group this sub-wave carries (Written, then all pulse together at "cùng lúc")
    const k = indicateS(pulse, 0.18), cx = 150, cy = y;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy);
    bitRow(CD_OB[i], cx, y + 17, 50, runS(t0 + 0.35, 0.7), { gap: 30 });
    ctx.restore();
  });
  // the hundreds in between: a vertical ellipsis
  const ep = runS(w.o0 + 0.9, 0.6);
  [0, 1, 2].forEach((j) => mDot(440, 912 + j * 20 + (1 - ep) * 6, 6, COL.wave, ep * 0.85));
  // the brace + label
  const bp = runS(w.song - 0.05, 0.6);
  mBrace(712, 450, 712, 1040, { side: 1, h: 26, p: bp, c: MC.white, w: 3.5 });
  vt('hơn 200', 820, 730, 54, runS(w.song + 0.2, 0.8));
  vt('sóng con', 820, 800, 54, runS(w.song + 0.4, 0.8));
  vt([{ s: 'Wi-Fi 6: ', c: COL.textD }, { s: '234', c: COL.text }, { s: ' / kênh 20 MHz', c: COL.textD }], 400, 1150, 50, runS(w.chay - 0.1, 0.9));
  const mood = t < w.cung ? 'calm' : t < w.o1 - 0.6 ? 'happy' : 'calm';
  CD_hero({ look: [440, 700 + 200 * Math.sin(t * 1.3)], mood });
  viTag('6', TITLES.ofdm);
};

// =====================================================================  ACK
const CD_RT = [200, 870, 0.85], CD_PH = [770, 640, 0.8];
const CD_LANE = 600, CD_ALANE = 820, CD_PX0 = 370, CD_PX1 = 572;
function CD_packet(x, y, bits, o = {}) {
  const al = o.al ?? 1, br = o.broken ?? 0, wd = 150, h = 78;
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha = al;
  const c = br > 0.5 ? COL.devD : COL.dev;
  // broken: the box splits into two halves that tilt apart
  const halves = br > 0 ? [[-1, -br * 0.18], [1, br * 0.22]] : [[0, 0]];
  halves.forEach(([sd, rot]) => {
    ctx.save();
    ctx.translate(x + sd * br * 14, y + Math.abs(sd) * br * 10);
    ctx.rotate(rot);
    const l = sd > 0 ? 0 : -wd / 2, r = sd < 0 ? 0 : wd / 2;
    showCreation([[l, -h / 2], [r, -h / 2], [r, h / 2], [l, h / 2]], 1, { c, w: 4, closed: true, fill: br > 0 ? 0.06 : 0.1, fillC: br > 0 ? COL.devD : COL.bit });
    ctx.restore();
  });
  ctx.restore();
  bitRow(bits, x, y + 18, 50, o.bp ?? 1, { gap: 34, col: br > 0 ? mixHex(COL.bit, COL.devD, clamp(br * 1.5)) : COL.bit, al });
}
function CD_ackBlock(x, y, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha = al;
  showCreation([[x - 40, y - 30], [x + 44, y - 30], [x + 44, y + 30], [x - 40, y + 30]], 1, { c: COL.ack, w: 4, closed: true, fill: 0.22 });
  ctx.fillStyle = COL.ack; ctx.beginPath(); ctx.moveTo(x - 66, y); ctx.lineTo(x - 42, y - 18); ctx.lineTo(x - 42, y + 18); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.globalAlpha = al; CD_check(x + 2, y, 40, COL.ack, 1, 6); ctx.restore();
}
// the flights: [depart, arrive, bits, slot, broken?]
function CD_flights() {
  const w = CD_W();
  return [
    { d: w.a0 + 0.1, a: w.a0 + 0.85, bits: '101', slot: 0 },
    { d: w.a0 + 0.95, a: w.a0 + 1.7, bits: '011', slot: 1 },
    { d: w.da + 0.15, a: w.hong - 0.05, bits: '110', slot: 2, broken: true },
    { d: w.gui - 0.3, a: w.gui + 0.25, bits: '110', slot: 2, rd: 0.5 },
  ];
}
SCENES.ack = function () {
  const w = CD_W(), t = TT, F = CD_flights();
  const rt = router(CD_RT[0], CD_RT[1], CD_RT[2]);
  // the phone, with 3 slots on its screen that fill as packets arrive
  phone(CD_PH[0], CD_PH[1], CD_PH[2], {
    screen: (l, tp, sw) => {
      for (let s = 0; s < 3; s++) {
        const y = tp + 50 + s * 80, x0 = l + 16, x1 = l + sw - 16;
        const fl = F.filter((f) => f.slot === s && !f.broken).map((f) => EZ.o2(seg(t, f.a, f.a + 0.3)));
        const k = Math.max(0, ...fl);
        const wait = s === 2 ? EZ.io(seg(t, F[2].d, F[2].d + 0.3)) * (0.5 + 0.5 * Math.sin((t - F[2].d) * 7)) : 0;
        ctx.save(); ctx.setLineDash([10, 8]); segLine(x0, y, x1, y, COL.devD, 3, 1, 1 - k); ctx.restore();
        if (wait > 0 && k < 1) { ctx.save(); ctx.setLineDash([10, 8]); showCreation([[x0, y - 18], [x1, y - 18], [x1, y + 18], [x0, y + 18]], 1, { c: COL.dev, w: 3, closed: true, al: wait * (1 - k) }); ctx.restore(); }
        if (k > 0) { ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = rgbaM(COL.bit, 0.85); ctx.fillRect(x0, y - 18, (x1 - x0) * k, 36); ctx.restore(); }
      }
    },
  });
  // the packets
  let look = [CD_PX0, CD_LANE];
  F.forEach((f) => {
    if (t < f.d) return;
    const u = EZ.io(seg(t, f.d, f.a));
    if (f.broken) {
      const xb = lerp(CD_PX0, CD_PX1 - 40, u);
      const br = EZ.o2(seg(t, f.a - 0.1, f.a + 0.25));
      const al = 1 - EZ.io(seg(t, w.hong + 0.55, w.hong + 0.95)), drop = 170 * EZ.io(seg(t, w.hong + 0.35, w.hong + 0.85));
      CD_packet(xb, CD_LANE + br * 16 + drop, f.bits, { broken: br, al });
      if (br > 0) CD_cross(xb, CD_LANE - 84 + drop, 56, MC.white, seg(t, f.a + 0.05, f.a + 0.4) * al, 7);
      if (t < f.a + 0.6) look = [xb, CD_LANE];
      return;
    }
    const x = lerp(CD_PX0, CD_PX1, u), into = EZ.i2(seg(t, f.a, f.a + 0.3));
    if (into < 1) {
      ctx.save(); const s = 1 - 0.6 * into; ctx.translate(x, CD_LANE); ctx.scale(s, s); ctx.translate(-x, -CD_LANE);
      CD_packet(x + 60 * into, CD_LANE, f.bits, { al: 1 - into, bp: runS(f.d - 0.15, 0.4) });
      ctx.restore();
    }
    if (t < f.a + 0.2) look = [x, CD_LANE];
    // the reply: teal block flies back LEFT to the router
    const r0 = f.a + 0.15, r1 = r0 + (f.rd ?? 0.65), ru = EZ.io(seg(t, r0, r1));
    if (t >= r0) {
      const al = EZ.o2(seg(t, r0, r0 + 0.15)) * (1 - EZ.io(seg(t, r1, r1 + 0.3)));
      CD_ackBlock(lerp(600, 385, ru), CD_ALANE, al);
      if (t < r1) look = [lerp(640, 360, ru), CD_ALANE];
      flashAt(rt.box[2] - 10, CD_ALANE, seg(t, r1 - 0.05, r1 + 0.4), COL.ack, 26, 4);
    }
  });
  // the router "re-sends": a small flash on it
  flashAt(CD_RT[0], CD_RT[1] - 40, seg(t, w.gui - 0.25, w.gui + 0.2), MC.white, 40, 4);
  // the meaning of teal, Written once
  const lp = runS(w.dien - 0.1, 0.8);
  const lw = textW('đã nhận', 60);
  vt([{ s: 'đã nhận', c: COL.ack }], 430, 960, 60, lp);
  CD_check(430 + lw / 2 + 42, 940, 44, COL.ack, smoothM(lp * 2 - 1), 6);
  const bad = t > F[2].a - 0.1 && t < w.gui + 0.1;
  const happy = F.some((f) => !f.broken && t > f.a + 0.8 && t < f.a + 1.4);
  CD_hero({ look, mood: bad ? 'wow' : happy ? 'happy' : 'calm', hop: seg(t, w.hong - 0.05, w.hong + 0.4) });
  viTag('9', TITLES.ack);
};
