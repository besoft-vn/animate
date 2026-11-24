// =====================================================================
//  sc-wave.js — eras bits · wave · mod (owned by the sc-wave agent).
//  Every state is a pure function of TT. The hero stays at HOME the whole time (looks, one hop mid-era, moods);
//  within 0.6 s of an era boundary it is calm, looks straight and does not hop (the bridge contract).
//   bits (7.25–13.5)  the gold photo is drawn · "trước hết": a grid splits it into 2 × 8 cells · "biến thành": each
//                     cell flies down, shrinks and becomes a yellow digit: 01101001 / 11001010 · the photo dims.
//   wave (13.5–19.75) a grey antenna on a small router (left) · "electron": one purple electron in it · "rung": it
//                     jiggles up and down (slow motion, note "quay chậm") and a blue sine leaves it to the right; the
//                     wave at the antenna always equals the electron's offset · "hai tỷ…": f = 2,4 GHz and
//                     = 2 400 000 000 lần / giây · brace "λ ≈ 12,5 cm" · "tỏa ra sóng": a blue arrow to the right.
//   mod  (19.75–25.75) a drifting carrier split into 4 parts by faint dividers · "độ cao": part 2 gets lower
//                     (red envelope + red brace "độ cao") · "độ lệch": part 3 slides (grey ghost, green arrow, green
//                     brace "độ lệch") · part 4 does both · the bit groups 00 01 11 10 under the parts (one SHAPE =
//                     one GROUP; never "big = 1") · "nhóm bit": a yellow box closes round each group.
// =====================================================================
let WV_Cc = null;
function WV_C() {   // spoken-word cue times (absolute s)
  if (WV_Cc) return WV_Cc;
  WV_Cc = {
    truoc: VW('bits', 'trước'), bien: VW('bits', 'biến'), mot: VW('bits', 'một', 2),
    elec: VW('wave', 'electron'), rung: VW('wave', 'rung'), hai: VW('wave', 'hai'), lan: VW('wave', 'lần'), toa: VW('wave', 'tỏa'),
    doi: VW('mod', 'đổi'), cao: VW('mod', 'cao'), lech: VW('mod', 'lệch'), song: VW('mod', 'sóng'), moi: VW('mod', 'mỗi'), nhom: VW('mod', 'nhóm'),
  };
  return WV_Cc;
}
const WV_bump = (t, a, b) => Math.sin(Math.PI * seg(t, a, b));
// the hero at HOME; near either end of era `id` it is calm, looks ahead, never hops
function WV_hero(id, look, mood, hop) {
  const t = TT, near = t < ET(id) + 0.6 || t > EE(id) - 0.6;
  heroAt(HOME[0], HOME[1], HOME[2], near ? { mood: 'calm' } : { look, mood: mood || 'calm', hop: hop || 0 });
}
function WV_rect(cx, cy, w, h, c, lw, al, fill) {
  if (al <= 0.001) return;
  ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineJoin = 'round';
  if (fill) { ctx.fillStyle = rgbaM(c, fill); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.strokeRect(cx - w / 2, cy - h / 2, w, h); ctx.restore();
}

// =====================================================================  bits
const WV_BITS = ['01101001', '11001010'];
const WV_PH = { x: 440, y: 620, w: 560, h: 340 };          // the photo
const WV_DIG = { size: 86, y: [1000, 1115] };               // digit rows (baselines)
const WV_digX = (c) => { const g = WV_DIG.size * 0.62; return WV_PH.x - g * 3.5 + c * g; };
const WV_flyT = (k) => WV_C().bien + 0.05 + k * 0.085;      // when cell k (row-major) leaves the photo
SCENES.bits = function () {
  const t = TT, C = WV_C(), P = WV_PH, l = P.x - P.w / 2, tp = P.y - P.h / 2, cw = P.w / 8, ch = P.h / 2;
  // the photo: drawn, then dims as it is turned into digits
  const dim = lerp(1, 0.42, EZ.io(seg(t, C.bien + 0.3, C.mot + 0.8)));
  photoCard(P.x, P.y, P.w, P.h, runS(ET('bits') + 0.1, 1.1), { al: dim });
  // "trước hết": the grid that splits it into 2 × 8 cells
  for (let i = 1; i < 8; i++) segLine(l + i * cw, tp, l + i * cw, tp + P.h, COL.devD, 3, runS(C.truoc + i * 0.06, 0.5), 0.85 * dim);
  segLine(l, P.y, l + P.w, P.y, COL.devD, 3, runS(C.truoc, 0.6), 0.85 * dim);
  // "biến thành": every cell flies down, shrinks into a digit box, and the digit is Written
  let lookAt = [P.x, P.y];
  for (let k = 0; k < 16; k++) {
    const r = Math.floor(k / 8), c = k % 8, t0 = WV_flyT(k), u = EZ.io(seg(t, t0, t0 + 0.55));
    const sx = l + cw * (c + 0.5), sy = tp + ch * (r + 0.5), ex = WV_digX(c), ey = WV_DIG.y[r] - WV_DIG.size * 0.34;
    if (t >= t0 && t < t0 + 0.9) {
      const x = lerp(sx, ex, u), y = lerp(sy, ey, u) - 40 * Math.sin(Math.PI * u), w = lerp(cw - 8, 44, u), h = lerp(ch - 8, 64, u);
      const out = 1 - seg(t, t0 + 0.5, t0 + 0.85);
      WV_rect(x, y, w, h, COL.photo, 4, out * (1 - u * 0.6), 0.22);
      WV_rect(x, y, w, h, COL.bit, 4, out * u * 0.6, 0);
      if (u < 1) lookAt = [x, y];
    }
    const p = runS(t0 + 0.45, 0.5);
    if (p > 0) writeText([{ s: WV_BITS[r][c], c: COL.bit }], ex, WV_DIG.y[r], WV_DIG.size, p, { align: 'center' });
  }
  // the finished string is read out in order: a thin yellow frame steps along the 16 digits
  const ts = WV_flyT(15) + 1.0, sk = Math.floor(seg(t, ts, EE('bits') - 0.35) * 16 - 1e-6);
  if (t > ts && t < EE('bits') - 0.35) { const r = Math.floor(sk / 8), c = sk % 8; WV_rect(WV_digX(c), WV_DIG.y[r] - WV_DIG.size * 0.32, 54, 84, COL.bit, 3, 0.75 * clamp((t - ts) / 0.2) * clamp((EE('bits') - 0.35 - t) / 0.2), 0.12); }
  if (t > WV_flyT(15) + 0.6) lookAt = [WV_PH.x, 990];
  const mood = t > C.bien + 0.4 && t < C.mot + 0.9 ? 'wow' : t > C.mot + 0.9 ? 'happy' : 'calm';
  WV_hero('bits', lookAt, mood, thereBack(seg(t, C.mot + 0.6, C.mot + 1.1)));
  viTag('2', TITLES.bits);
};

// =====================================================================  wave
const WV_W = { ax: 130, y: 760, A: 120, x0: 160, x1: 920, lam: 200, f: 0.75 };   // slow motion: 0.75 jiggles per second
const WV_ramp = (tau) => EZ.io(clamp(tau / 0.35));
function WV_waveState(t) {
  const C = WV_C(), tr = C.elec + 0.3, w = TAU * WV_W.f, v = WV_W.lam * WV_W.f;
  const ey = WV_W.y - WV_W.A * WV_ramp(t - tr) * Math.sin(w * (t - tr)) * (t > tr ? 1 : 0);
  return { tr, w, v, ey };
}
SCENES.wave = function () {
  const t = TT, C = WV_C(), S = WV_waveState(t), Wv = WV_W, e0 = ET('wave');
  // the router (small box) and the antenna (a tall bar) — grey devices
  const pr = runS(e0 + 0.15, 0.9);
  showCreation([[62, 928], [198, 928], [198, 996], [62, 996]], pr, { c: COL.dev, w: 5, closed: true, fill: 0.08 });
  const led = 0.55 + 0.45 * Math.sin(t * 9);
  mDot(150, 962, 9, MC.green, led * clamp(pr * 2 - 1)); mDot(176, 962, 9, COL.devD, 0.7 * clamp(pr * 2 - 1));
  const pa = runS(e0 + 0.35, 0.9);
  showCreation([[Wv.ax - 30, 910], [Wv.ax - 30, 610], [Wv.ax + 30, 610], [Wv.ax + 30, 910]], pa, { c: COL.dev, w: 5, closed: true, fill: 0.1 });
  segLine(Wv.ax, 910, Wv.ax, 928, COL.dev, 5, pa);
  // the electron: appears on "electron", jiggles from "rung"
  const ep = EZ.o2(seg(t, C.elec, C.elec + 0.35));
  if (ep > 0) electron(Wv.ax, S.ey, 26 * ep, ep);
  // the wave: emitted at the antenna from t = tr; the value at x is the electron's offset (x - x0) / v seconds ago
  if (t > S.tr) {
    const xf = Math.min(Wv.x1, Wv.x0 + S.v * (t - S.tr)), P = [];
    for (let x = Wv.x0; x <= xf + 0.1; x += 4) { const tau = t - S.tr - (x - Wv.x0) / S.v; P.push([x, Wv.y - Wv.A * WV_ramp(tau) * Math.sin(S.w * tau)]); }
    if (P.length > 1) showCreation(P, 1, { c: COL.wave, w: 7 });
  }
  // a faint baseline guide
  segLine(Wv.x0, Wv.y, Wv.x1, Wv.y, COL.guide, 2, runS(C.rung - 0.2, 0.8), 0.7);
  // "quay chậm" note under the router
  vt('(quay chậm)', 70, 1075, 50, runS(C.elec + 0.8, 0.8), { col: COL.textD, align: 'left' });
  // readouts on "hai tỷ…"
  writeText([{ s: 'f', c: COL.wave, it: true }, { s: ' = ', c: COL.text }, { s: '2,4 GHz', c: COL.wave }], 90, 445, 70, runS(C.rung, 0.8), { align: 'left' });
  writeText([{ s: '= ', c: COL.text }, { s: '2 400 000 000', c: COL.wave }, { s: ' lần / giây', c: COL.text }], 120, 528, 54, runS(C.hai + 0.35, 1.1), { align: 'left', lag: 1.0 });
  // one wavelength: brace under the wave, x 280 -> 440
  const bt = Math.max(C.hai + 0.6, S.tr + (480 - Wv.x0) / S.v + 0.1), bp = runS(bt, 0.6);
  segLine(280, 900, 280, 922, COL.devD, 3, bp); segLine(480, 900, 480, 922, COL.devD, 3, bp);
  mBrace(480, 912, 280, 912, { c: COL.text, p: bp, h: 22, w: 3.5 });
  writeText([{ s: 'λ', c: COL.wave, it: true }, { s: ' ≈ 12,5 cm', c: COL.text }], 380, 992, 52, runS(bt + 0.25, 0.8), { align: 'center' });
  // "tỏa ra sóng": a blue arrow pointing away from the antenna
  const ap = runS(C.toa - 0.05, 0.6);
  mArrow(660, 592, 920, 592, COL.wave, 6, ap);
  // the hero
  const look = t < C.elec ? [Wv.ax, 760] : t < C.hai ? [Wv.ax, S.ey] : t < C.toa ? [200, 500] : [920, 592];
  const mood = t > C.rung + 0.2 && t < C.toa ? 'wow' : 'calm';
  WV_hero('wave', look, mood, thereBack(seg(t, C.toa + 0.05, C.toa + 0.55)));
  viTag('3', TITLES.wave);
};

// =====================================================================  mod
const WV_M = { y: 720, xs: [100, 300, 500, 700, 900], lam: 160, hi: 90, lo: 45, ph: -0.75 * Math.PI, sp: 25 };
const WV_GROUPS = ['00', '01', '11', '10'];
function WV_modState(t) {
  const C = WV_C(), M = WV_M;
  const a2 = EZ.io(seg(t, C.cao - 0.15, C.cao + 0.45));            // part 2: lower
  const p3 = EZ.io(seg(t, C.lech - 0.15, C.lech + 0.45));          // part 3: slid
  const b4 = EZ.io(seg(t, C.song - 0.1, C.song + 0.5));             // part 4: both
  const segs = [
    { x0: M.xs[0], x1: M.xs[1], amp: M.hi, ph: 0 },
    { x0: M.xs[1], x1: M.xs[2], amp: lerp(M.hi, M.lo, a2), ph: 0 },
    { x0: M.xs[2], x1: M.xs[3], amp: M.hi, ph: M.ph * p3 },
    { x0: M.xs[3], x1: M.xs[4], amp: lerp(M.hi, M.lo, b4), ph: M.ph * b4 },
  ];
  return { segs, drift: 85 + M.sp * (t - (C.lech + 0.3)),   // a ghost trough sits at x 525 when the arrow appears
 a2, p3, b4 };
}
SCENES.mod = function () {
  const t = TT, C = WV_C(), M = WV_M, S = WV_modState(t), e0 = ET('mod');
  // faint dividers between the 4 parts
  for (let i = 1; i < 4; i++) { ctx.save(); ctx.setLineDash([10, 10]); segLine(M.xs[i], 615, M.xs[i], 830, COL.guide, 3, runS(e0 + 0.3 + i * 0.08, 0.6)); ctx.restore(); }
  segLine(M.xs[0], M.y, M.xs[4], M.y, COL.guide, 2, 1, 0.6);
  // part 3's ghost: where the unshifted wave would be (grey, dashed)
  const gA = EZ.io(seg(t, C.lech - 0.3, C.lech + 0.1));
  if (gA > 0) {
    const G = []; for (let x = M.xs[2] + 12; x <= M.xs[3] - 12; x += 4) G.push([x, M.y - M.hi * Math.sin(TAU * (x - S.drift) / M.lam)]);
    ctx.save(); ctx.setLineDash([9, 9]); showCreation(G, 1, { c: COL.dev, w: 3, al: 0.55 * gA }); ctx.restore();
  }
  // the carrier, modulated
  sineWave(M.xs[0], M.xs[4], M.y, { lam: M.lam, drift: S.drift, segs: S.segs, blend: 26, w: 6 });
  // "độ cao" (red): part 2's envelope + brace + label
  const rA = runS(C.cao + 0.1, 0.6);
  if (rA > 0) {
    const a = S.segs[1].amp;
    ctx.save(); ctx.setLineDash([12, 10]);
    segLine(M.xs[1] + 12, M.y - a, M.xs[2] - 12, M.y - a, COL.amp, 3, rA, 0.9);
    segLine(M.xs[1] + 12, M.y + a, M.xs[2] - 12, M.y + a, COL.amp, 3, rA, 0.9);
    ctx.restore();
  }
  mBrace(M.xs[1] + 14, 606, M.xs[2] - 14, 606, { c: COL.amp, p: runS(C.cao + 0.2, 0.6), h: 22, w: 4 });
  vt('độ cao', 400, 560, 54, runS(C.cao + 0.3, 0.8), { col: COL.amp });
  // "độ lệch" (green): an arrow from the ghost's trough to the slid trough, brace + label
  const xg = M.xs[2] + 12 + mod(S.drift + 0.75 * M.lam - (M.xs[2] + 12), M.lam), shift = -M.ph / TAU * M.lam;    // ghost trough, slide (px)
  const arA = runS(C.lech + 0.3, 0.5) * clamp((xg - (M.xs[2] + 12)) / 12) * clamp((M.xs[3] - 12 - (xg + shift)) / 12);
  if (arA > 0) {
    segLine(xg, M.y + M.hi + 6, xg, M.y + M.hi + 34, COL.dev, 3, 1, 0.7 * arA);
    segLine(xg + shift, M.y + M.hi + 6, xg + shift, M.y + M.hi + 34, COL.phase, 4, 1, arA);
    mArrow(xg, M.y + M.hi + 22, xg + shift, M.y + M.hi + 22, COL.phase, 4, runS(C.lech + 0.35, 0.4), arA);
  }
  mBrace(M.xs[2] + 14, 606, M.xs[3] - 14, 606, { c: COL.phase, p: runS(C.lech + 0.15, 0.6), h: 22, w: 4 });
  vt('độ lệch', 600, 560, 54, runS(C.lech + 0.25, 0.8), { col: COL.phase });
  // one shape = one bit GROUP, under each part; on "nhóm bit" a yellow box closes round each group
  for (let i = 0; i < 4; i++) {
    const cx = (M.xs[i] + M.xs[i + 1]) / 2, tw = C.song + 0.35 + i * 0.2;
    writeText([{ s: WV_GROUPS[i], c: COL.bit }], cx, 918, 68, runS(tw, 0.55), { align: 'center', lag: 0.6 });
    const bp = runS(C.nhom - 0.15 + i * 0.08, 0.5);
    if (bp > 0) showCreation([[cx - 56, 857], [cx + 56, 857], [cx + 56, 937], [cx - 56, 937]], bp, { c: COL.bit, w: 3, closed: true, al: 0.8 });
  }
  // the hero
  const look = t < C.cao ? [400, 720] : t < C.lech ? [400, 680] : t < C.song + 0.3 ? [600, 760] : [500, 900];
  const mood = t > C.cao && t < C.song + 0.3 ? 'wow' : t >= C.song + 0.3 ? 'happy' : 'calm';
  WV_hero('mod', look, mood, thereBack(seg(t, C.moi + 0.9, C.moi + 1.4)));
  viTag('4', TITLES.mod);
};
