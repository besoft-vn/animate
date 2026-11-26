// =====================================================================
//  sc-hydro.js — beats 2, 3, 4: lever, fluid, caliper (one animation agent owns this file)
//  lever   : cut-away of the RIGHT handlebar: grip + hand (mitten) + lever. The lever pivots at the perch (left); a
//            short crank arm under the pivot swings RIGHT when the fingers pull the lever up to the grip, and its
//            pushrod drives the small steel piston INTO the master cylinder's BLUE fluid (reservoir cup on top; the
//            piston slides past the reservoir port). Red: "bóp" at the fingers (up), "ép" along the piston (right).
//            Opens on grip + hand + lever in [540,820,250]; ends on the master cylinder centred in [540,1020,170].
//  fluid   : system diagram: master cylinder in [300,520,100] -> a fat hose full of 8 touching BLUE balls -> the
//            caliper on the front disc in [720,1080,110]. On "không nén được" the piston pushes ball 1 and ball 8
//            moves at the same instant (the chain moves rigidly); on "chạy theo ống" a light-blue pulse runs DOWN to
//            the caliper. Flow is always master cylinder -> caliper.
//  caliper : big U-tube cross-section centred [540,860]: small piston (60 wide, left) and big piston (200 wide,
//            right) joined by the same blue fluid. The small piston moves 90 px down, the big one 27 px up (60/200).
//            Thin red arrow into the small piston, a much thicker one out of the big piston (toward the pad/disc).
//  Colour: BLUE = fluid only · RED forceArrow = forces only · steel greys = metal · brown COL.pad = the pad.
// =====================================================================

const HY_CREAM = '#efe5cf';
const HY_SLEEVE = '#7a8fb0';
const HY_mix = (a, b, u) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], clamp(u)))).join(',')})`; };
const HY_arrow = (ax, ay, bx, by, o) => { if ((o.frac ?? 1) > 0.02) forceArrow(ax, ay, bx, by, o); };
const HY_rect = (x, y, w, h) => resample([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, 24);

// a pipe-like double stroke (ink outline + colour core)
function HY_rod(P, w, col, key, o = {}) {
  ink(P, { w: w + 8, color: C.ink, key: key + 'o', amt: o.amt ?? 1, alpha: o.al ?? 1 });
  ink(P, { w, color: col, key, amt: o.amt ?? 1, alpha: o.al ?? 1 });
}
// light ripples drifting through a fluid region (x0..x1 at height y)
function HY_shimmer(x0, x1, y, key, o = {}) {
  if (x1 - x0 < 30) return;
  const P = [], amp = o.amp ?? 5, lam = o.lam ?? 70, sp = o.sp ?? 60;
  for (let x = x0; x <= x1; x += 8) P.push([x, y + Math.sin((x - TT * sp) / lam * TAU) * amp]);
  ink(P, { w: o.w ?? 4, color: 'rgba(214,234,250,0.85)', key, amt: 0.4, alpha: o.al ?? 1 });
}

// =====================================================================
//  2 LEVER — "Bóp tay phanh, bạn đẩy một pít-tông nhỏ ép vào dầu phanh."
// =====================================================================
const HY_PIV = [330, 830], HY_LEN = 470, HY_ARM = 190, HY_MCY = 1020, HY_ROD = 100, HY_PL = 70;
function HY_lever(sq) {
  const a = lerp(0.22, -0.06, sq), c = Math.cos(a), s = Math.sin(a);
  return {
    a, tip: [HY_PIV[0] + c * HY_LEN, HY_PIV[1] + s * HY_LEN],
    arm: [HY_PIV[0] - s * HY_ARM, HY_PIV[1] + c * HY_ARM],          // the crank arm rotates WITH the lever
    yAt: (x) => HY_PIV[1] + Math.tan(a) * (x - HY_PIV[0]),
  };
}

SCENES.lever = function () {
  paperSheet('lv', { ruled: false });
  const tTay = VW('lever', 'tay'), tDay = VW('lever', 'đẩy'), tPit = VW('lever', 'pít-tông'), tNho = VW('lever', 'nhỏ'), tEp = VW('lever', 'ép');
  // the squeeze: fingers pull the lever toward the grip on "tay phanh … đẩy", a last firm squeeze on "ép"
  const sq = 0.8 * EZ.io(seg(TT, tTay + 0.05, tDay + 0.15)) + 0.2 * EZ.io(seg(TT, tEp - 0.05, tEp + 0.35));
  const G = HY_lever(sq), back = G.arm[0] + HY_ROD, front = back + HY_PL;
  const prs = ev(tEp, 0.35);

  // ---- handlebar tube + the lever perch (bolted to the bar)
  HY_rod([[30, 725], [345, 725]], 40, COL.steel, 'lvbar', { amt: 0.8 });
  paint(rrectPts(296, 700, 68, 160, 14), { fill: COL.steelD, key: 'lvperch', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.35 }] });
  // ---- the grip (rubber) + bar end
  paint(rrectPts(330, 690, 452, 70, 30), { fill: '#3a3530', key: 'lvgrip', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.3, c: '#000' }] });
  for (let i = 0; i < 9; i++) ink([[372 + i * 46, 698], [372 + i * 46, 752]], { w: 3, color: 'rgba(239,229,207,0.35)', key: 'lvrib' + i, amt: 0.5 });
  paint(rrectPts(776, 680, 32, 90, 10), { fill: COL.steelD, key: 'lvend', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.35 }] });

  // ---- the master cylinder (cut-away), under the bar, centred ~[545,1020]
  paint(rrectPts(400, 965, 290, 110, 16), { fill: COL.steel, key: 'lvmc', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.35, dens: (x, y) => clamp((x - 400 + y - 965) / 300) }] });
  paint(HY_rect(405, 990, 278, 60), { fill: HY_CREAM, key: 'lvbore', w: 3 });
  const oil = HY_mix(COL.oil, '#2c62a6', prs * 0.7);
  // fluid: in front of the piston, through the outlet channel, in the reservoir and its port
  paint(HY_rect(front, 992, 681 - front, 56), { fill: oil, line: false, key: 'lvoil', tex: [{ k: 'hatch', a: 0.8, gap: 7, al: 0.25, c: '#1f3f6a' }] });
  HY_shimmer(front + 14, 670, 1010 + 3 * Math.sin(TT * 2), 'lvsh1', { amp: 4, lam: 46, sp: 30 + 60 * prs });
  HY_shimmer(front + 30, 670, 1032, 'lvsh2', { amp: 3, lam: 60, sp: -24 - 40 * prs, al: 0.7 });
  if (prs > 0) ink(HY_rect(front + 2, 994, 677 - front, 52), { closed: true, w: 8, color: COL.oilL, key: 'lvglow', alpha: prs * (0.45 + 0.35 * Math.sin(TT * 7)) });
  // the reservoir cup on top + its port into the bore (the piston slides past it)
  paint(rrectPts(462, 900, 96, 68, 10), { fill: COL.steelL, key: 'lvres', w: 3.5 });
  paint(HY_rect(470, 912, 80, 52), { fill: HY_CREAM, key: 'lvresi', w: 2 });
  const lvl = 930 + 2.5 * Math.sin(TT * 2.6);
  paint([[471, lvl], [490, lvl - 2 * Math.sin(TT * 3.1)], [510, lvl], [530, lvl + 2 * Math.sin(TT * 3.1)], [549, lvl], [549, 963], [471, 963]], { fill: COL.oil, line: false, key: 'lvreso', tex: [{ k: 'hatch', a: 0.8, gap: 7, al: 0.25, c: '#1f3f6a' }] });
  ink([[456, 900], [564, 900]], { w: 8, color: COL.steelD, key: 'lvlid' });
  paint(HY_rect(498, 962, 18, 30), { fill: COL.oil, line: false, key: 'lvport' });
  // outlet: a banjo bolt under the right end, the hose leaving down-right
  paint(HY_rect(652, 1046, 18, 32), { fill: oil, line: false, key: 'lvout' });
  paint(rrectPts(636, 1072, 52, 40, 9), { fill: COL.steelD, key: 'lvbanjo', w: 3 });
  const hose = [[662, 1108], [700, 1138], [790, 1146], [900, 1146]];
  ink(hose, { w: 34, color: C.ink, key: 'lvhoseo' });
  ink(hose, { w: 26, color: '#4a4440', key: 'lvhose' });
  ink(hose, { w: 10, color: oil, key: 'lvhosef' });
  // the piston (steel) with its dark rubber seal at the front, and the pushrod from the crank arm
  HY_rod([G.arm, [back + 6, HY_MCY]], 10, COL.steelD, 'lvrod');
  paint(rrectPts(back, 994, HY_PL, 52, 8), { fill: COL.steelL, key: 'lvpis', w: 3.5, tex: [{ k: 'hatch', a: -0.7, gap: 6, al: 0.3 }] });
  paint(HY_rect(front - 10, 992, 10, 56), { fill: '#2e2a27', key: 'lvseal', w: 2 });

  // ---- the lever + its crank arm: one rigid piece turning about the pivot
  // an L-shaped bellcrank: lever (along u) + arm (along v) + a gusset in the corner, filled and outlined as one part
  {
    const u = [Math.cos(G.a), Math.sin(G.a)], v = [-u[1], u[0]], h = 14, g = 58;
    const L = (p, q) => [HY_PIV[0] + u[0] * p + v[0] * q, HY_PIV[1] + u[1] * p + v[1] * q];
    const shape = [L(-32, -h), L(HY_LEN, -h), ...arcPts(0, 0, h, -Math.PI / 2, Math.PI / 2, 6).map(([p, q]) => L(HY_LEN + p, q)).slice(1, -1),
      L(HY_LEN, h), L(h + g, h), L(h, h + g), L(h, HY_ARM), ...arcPts(0, 0, h, 0, Math.PI, 6).map(([p, q]) => L(-p, HY_ARM + q)).slice(1, -1), L(-h, HY_ARM), L(-h, h), L(-32, h)];
    paint(resample(shape, true, 14), { fill: COL.steel, key: 'lvlev', w: 4, amt: 0.8, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.3 }] });
  }
  paint(ellipsePts(HY_PIV[0], HY_PIV[1], 13, 13, 0, 14), { fill: COL.steelD, key: 'lvpiv', w: 3.5 });

  // ---- the hand: sleeve from the top-left, the back of the hand over the grip, four fingers round the lever
  HY_rod([[-20, 470], [250, 575], [455, 660]], 104, HY_SLEEVE, 'lvsleeve', { amt: 1.2 });
  paint(ellipsePts(452, 664, 30, 60, 0.35, 20), { fill: '#5f7192', key: 'lvcuff', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.3 }] });
  paint(ellipsePts(600, 690, 160, 72, -0.04, 40), { fill: C.skin, key: 'lvhand', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.35, c: C.skinD, dens: (x, y) => clamp((y - 660) / 90 + (x - 600) / 400) }] });
  paint(ellipsePts(500, 740, 56, 26, 0.25, 20), { fill: C.skin, key: 'lvthumb', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.3, c: C.skinD }] });
  for (let i = 0; i < 4; i++) {
    const x = 540 + i * 58, y1 = G.yAt(x + 4) + 6;
    const P = [[x - 6, 712], [x, 760], [x + 4, y1]];
    ink(P, { w: 56, color: C.ink, key: 'lvfo' + i, amt: 0.8 });
    ink(P, { w: 47, color: C.skin, key: 'lvf' + i, amt: 0.8 });
    ink([[x - 14, y1 - 6], [x + 14, y1 - 6]], { w: 3, color: C.skinD, key: 'lvnail' + i, amt: 0.6 });
  }

  // ---- forces (red): the fingers pull the lever UP to the grip; the pushrod/piston pushes RIGHT into the fluid
  const bx = 768, by = G.yAt(bx);
  HY_arrow(bx, by + 112, bx, by + 18, { w: 14, frac: ev(tTay + 0.1, 0.35), key: 'lvfb' });
  if (TT >= tEp) HY_arrow(G.arm[0] + 14, HY_MCY, front + 28, HY_MCY, { w: 12 + 4 * Math.sin(Math.PI * seg(TT, tEp, tEp + 0.6)), head: 32, frac: ev(tEp, 0.3), key: 'lvfe' });

  // ---- labels
  { // "tay phanh": the leader runs down beside the bar end and ends ON the lever bar, just left of the red arrow
    const fT = ev(tTay + 0.15, 0.5), tw = handW('tay phanh', 64), x0 = Math.min(930 - tw, 600), lx = 742, ly = G.yAt(lx);
    handText('tay phanh', x0, 600, 64, C.ink, { key: 'lvlbt', frac: fT });
    ink([[x0 + tw - 14, 618], [838, 700], [834, 790], [lx, ly - 4]], { w: 2.6, color: 'rgba(58,36,23,0.8)', key: 'lvlbtl', frac: fT, amt: 1 });
  }
  label('pít-tông nhỏ', 70, 1165, back + 30, 1050, { size: 64, frac: ev(tPit, 0.5), key: 'lvlbp', lx: 180, ly: -54 });
  label('dầu phanh', 440, 1215, 600, 1050, { size: 64, frac: ev(tNho + 0.05, 0.5), key: 'lvlbd', lx: 150, ly: -56 });
  inkTag('bóp tay phanh');
};

// =====================================================================
//  3 FLUID — "Dầu gần như không nén được, nên lực ép chạy theo ống xuống bánh trước."
// =====================================================================
const HY_N = 8;
const HY_WC = [720 - Math.cos(-2.25) * 112, 1080 - Math.sin(-2.25) * 112];   // wheel centre (caliper at angle -2.25 on the disc)
const HY_PATH = (() => {
  const P0 = [250, 520], P1 = [430, 520], d = [Math.cos(-2.25), Math.sin(-2.25)];
  const P3 = [720 + d[0] * 40, 1080 + d[1] * 40], P2 = [P3[0] + d[0] * 170, P3[1] + d[1] * 170];
  const P = [], cum = [0];
  for (let i = 0; i <= 240; i++) {
    const t = i / 240, u = 1 - t;
    P.push([0, 1].map((k) => u * u * u * P0[k] + 3 * u * u * t * P1[k] + 3 * u * t * t * P2[k] + t * t * t * P3[k]));
    if (i) cum.push(cum[i - 1] + dist(P[i - 1], P[i]));
  }
  return { P, cum, L: cum[cum.length - 1] };
})();
const HY_R = HY_PATH.L / (2 * HY_N);
function HY_at(s) {   // point + direction at arc length s along the hose
  const { P, cum } = HY_PATH; s = clamp(s, 0, HY_PATH.L);
  let i = 1; while (i < cum.length - 1 && cum[i] < s) i++;
  const k = (s - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]), a = P[i - 1], b = P[i];
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0])];
}
// the rigid push of the whole fluid chain (px along the hose): push on "không", ease back, push again on "chạy"
function HY_push(t) {
  const tK = VW('fluid', 'không'), tC = VW('fluid', 'chạy');
  return 26 * EZ.io(seg(t, tK, tK + 0.3)) - 16 * EZ.io(seg(t, tK + 0.9, tK + 1.5)) + 18 * EZ.io(seg(t, tC - 0.05, tC + 0.4));
}

SCENES.fluid = function () {
  paperSheet('fl', { ruled: false });
  const tK = VW('fluid', 'không'), tC = VW('fluid', 'chạy'), tB = VW('fluid', 'trước');
  const R = HY_R, dlt = HY_push(TT), vel = (HY_push(TT + 0.05) - HY_push(TT - 0.05)) / 0.1;
  const sp = (HY_PATH.L + R) * EZ.io(seg(TT, tC, tB + 0.1)), pOn = seg(TT, tC - 0.1, tC + 0.1) * (1 - seg(TT, tB + 0.1, tB + 0.6));
  const arrived = ev(tB, 0.4);

  // ---- the front wheel, drawn simply: tyre, rim, the disc turning CLOCKWISE (slows a little once the pressure arrives)
  const [wx, wy] = HY_WC;
  const t0 = ET('fluid'), ang = 0.9 * (Math.min(TT, tB) - t0) + 0.45 * Math.max(0, TT - tB);
  paint(ellipsePts(wx, wy, 196, 196, 0, 56), { fill: COL.tyre, key: 'flty', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.3, c: '#000' }] });
  paint(ellipsePts(wx, wy, 162, 162, 0, 52), { fill: COL.steelL, key: 'flrim', w: 3.5, tex: [{ k: 'hatch', a: -0.7, gap: 7, al: 0.22 }] });
  brakeDisc(wx, wy, 128, ang, { key: 'fldisc' });

  // ---- the hose: a fat tube full of fluid (light blue between the balls)
  const tube = [[205, 520], ...HY_PATH.P];
  ink(tube, { w: 2 * R + 22, color: C.ink, key: 'fltubo', amt: 1 });
  ink(tube, { w: 2 * R + 10, color: '#4a4440', key: 'fltubr', amt: 1 });
  ink(tube, { w: 2 * R + 2, color: COL.oilL, key: 'fltubf', amt: 1 });
  // the pressure pulse: a light ring that runs DOWN the hose (master cylinder -> caliper)
  if (pOn > 0 && sp < HY_PATH.L) {
    const [px, py] = HY_at(sp);
    ink(ellipsePts(px, py, R + 22, R + 22, 0, 28), { closed: true, w: 12, color: 'rgba(169,205,238,0.9)', key: 'flpr', alpha: pOn });
  }
  // the balls of fluid: they all move together (incompressible)
  for (let i = 0; i < HY_N; i++) {
    const s = dlt + R + 2 * R * i, [x, y] = HY_at(s), g = pOn * Math.exp(-(((s - sp) / (1.4 * R)) ** 2));
    paint(ellipsePts(x, y, R - 1, R - 1, 0, 30), { fill: HY_mix(COL.oil, '#d6eafa', g * 0.75), key: 'flb' + i, w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 7, al: 0.3, c: '#1f3f6a', dens: (px, py) => clamp((px - x + py - y) / (2 * R) + 0.35) }] });
    ink(arcPts(x, y, R * 0.62, Math.PI * 1.05, Math.PI * 1.45, 6), { w: 6, color: 'rgba(240,248,255,0.85)', key: 'flbh' + i, amt: 0.4 });
  }
  // "at the same instant": motion marks on the FIRST and the LAST ball while the chain moves
  const mv = clamp(Math.abs(vel) / 60);
  if (mv > 0.05) for (const i of [0, HY_N - 1]) {
    const s = dlt + R + 2 * R * i, [x, y, a] = HY_at(s);
    for (let j = 0; j < 2; j++) ink(arcPts(x, y, R + 12 + j * 13, a + Math.PI - 0.6, a + Math.PI + 0.6, 8), { w: 4.5, color: C.ink, key: 'flmm' + i + j, alpha: mv, amt: 0.6 });
  }

  // ---- the master cylinder (top-left): steel walls around the bore, reservoir cup, piston + pushrod
  const MCX0 = 212, MCX1 = 392, top = 520 - R - 6, bot = 520 + R + 6;
  paint(HY_rect(MCX0, top - 20, MCX1 - MCX0, 22), { fill: COL.steel, key: 'flmct', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.35 }] });
  paint(HY_rect(MCX0, bot - 2, MCX1 - MCX0, 22), { fill: COL.steel, key: 'flmcb', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.35 }] });
  const pf = 250 + dlt;                                          // piston face
  HY_rod([[110, 520], [pf - 30, 520]], 12, COL.steelD, 'flrod');
  paint(rrectPts(pf - 36, 520 - R + 2, 36, 2 * R - 4, 6), { fill: COL.steelL, key: 'flpis', w: 3.5, tex: [{ k: 'hatch', a: -0.7, gap: 6, al: 0.3 }] });
  paint(HY_rect(pf - 9, 520 - R + 2, 9, 2 * R - 4), { fill: '#2e2a27', key: 'flseal', w: 2 });
  if (TT >= tK - 0.05) HY_arrow(110, 520, pf - 8, 520, { w: 12, head: 30, frac: ev(tK - 0.05, 0.25), key: 'flfa' });

  // ---- the caliper on the disc's upper-rear edge (the hose ends in it)
  const cal = xform(rrectPts(-74, -52, 148, 104, 18), 720, 1080, -2.25 + Math.PI / 2);
  paint(cal, { fill: COL.steelD, key: 'flcal', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.35 }] });
  paint(ellipsePts(720, 1080, 13, 13, 0, 12), { fill: COL.steelL, key: 'flcalb', w: 3 });
  if (arrived > 0) ink(cal, { closed: true, w: 10, color: COL.oilL, key: 'flcalg', alpha: arrived * (0.55 + 0.35 * Math.sin(TT * 6)) });

  // ---- labels
  const [lx, ly] = HY_at(R + 2 * R * 4);
  label('không nén được', 66, 990, lx - R - 4, ly + 8, { size: 68, frac: ev(tK + 0.1, 0.6), key: 'fllbk', lx: handW('không nén được', 68) + 12, ly: -22 });
  label('bánh trước', 90, 1190, wx - 196, wy + 6, { size: 68, frac: ev(tC + 0.05, 0.5), key: 'fllbb', lx: handW('bánh trước', 68) + 12, ly: -22 });
  inkTag('dầu truyền lực');
};

// =====================================================================
//  4 CALIPER — "Ở cùm phanh, pít-tông to hơn nhiều, nên lực được nhân lên vài lần."
// =====================================================================
const HY_SX0 = 345, HY_SW = 60, HY_BX0 = 540, HY_BW = 200, HY_BOT = 1040, HY_CH = 1098;
SCENES.caliper = function () {
  paperSheet('cp', { ruled: false });
  const tPit = VW('caliper', 'pít-tông'), tTo = VW('caliper', 'to'), tNen = VW('caliper', 'nên'), tLuc = VW('caliper', 'lực'), tNhan = VW('caliper', 'nhân');
  // the push: small piston 90 px DOWN, big piston 90 * 60/200 = 27 px UP (same volume)
  const k = EZ.io(seg(TT, tNen, tNen + 0.9)) * 0.85 + 0.15 * EZ.io(seg(TT, tNhan - 0.05, tNhan + 0.4));
  const Ps = 660 + 90 * k, Pb = 690 - 90 * k * HY_SW / HY_BW;
  const prs = clamp(k * 1.6);

  // ---- the steel block with the two bores and the channel (cut-away)
  paint(rrectPts(292, 600, 500, 520, 28), { fill: COL.steel, key: 'cpblk', w: 4.5, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.35, dens: (x, y) => clamp((x - 292 + y - 600) / 760 + 0.15) }] });
  ink([[288, 600], [796, 600]], { w: 6, color: C.ink, key: 'cptop', amt: 0.6 });
  const boreP = resample([[HY_SX0, 590], [HY_SX0, HY_CH], [HY_BX0 + HY_BW, HY_CH], [HY_BX0 + HY_BW, 590], [HY_BX0, 590], [HY_BX0, HY_BOT], [HY_SX0 + HY_SW, HY_BOT], [HY_SX0 + HY_SW, 590]], true, 24);
  paint(boreP, { fill: HY_CREAM, key: 'cpbore', w: 3.5 });
  // ---- the fluid: one blob, one blue (same pressure everywhere)
  const oil = HY_mix(COL.oil, '#2c62a6', prs * 0.7);
  const fl = resample([[HY_SX0 + 2, Ps + 70], [HY_SX0 + 2, HY_CH - 2], [HY_BX0 + HY_BW - 2, HY_CH - 2], [HY_BX0 + HY_BW - 2, Pb + 80], [HY_BX0 + 2, Pb + 80], [HY_BX0 + 2, HY_BOT + 2], [HY_SX0 + HY_SW - 2, HY_BOT + 2], [HY_SX0 + HY_SW - 2, Ps + 70]], true, 24);
  paint(fl, { fill: oil, line: false, key: 'cpoil', amt: 0.8, tex: [{ k: 'hatch', a: 0.8, gap: 7, al: 0.25, c: '#1f3f6a' }] });
  HY_shimmer(HY_SX0 + 16, HY_BX0 + HY_BW - 16, 1070, 'cpsh1', { amp: 5, lam: 70, sp: 40 + 120 * prs * (1 - seg(TT, tNen + 0.9, tNen + 1.4)) });
  HY_shimmer(HY_BX0 + 16, HY_BX0 + HY_BW - 16, Pb + 150 + 4 * Math.sin(TT * 2.2), 'cpsh2', { amp: 4, lam: 54, sp: -30 });
  HY_shimmer(HY_BX0 + 16, HY_BX0 + HY_BW - 16, Pb + 220, 'cpsh3', { amp: 4, lam: 64, sp: 26, al: 0.7 });
  if (prs > 0) ink(fl, { closed: true, w: 9, color: COL.oilL, key: 'cpglow', alpha: prs * (0.4 + 0.3 * Math.sin(TT * 6)) });

  // ---- the pistons (steel): small one + its pushrod, big one + the brake pad on top
  HY_rod([[HY_SX0 + HY_SW / 2, Ps - 70], [HY_SX0 + HY_SW / 2, Ps]], 14, COL.steelD, 'cprod');
  paint(rrectPts(HY_SX0 + 2, Ps, HY_SW - 4, 70, 8), { fill: COL.steelL, key: 'cppis', w: 3.5, tex: [{ k: 'hatch', a: -0.7, gap: 6, al: 0.3 }] });
  paint(HY_rect(HY_SX0 + 2, Ps + 60, HY_SW - 4, 10), { fill: '#2e2a27', key: 'cpseal', w: 2 });
  paint(rrectPts(HY_BX0 + 2, Pb, HY_BW - 4, 80, 10), { fill: COL.steelL, key: 'cpbig', w: 4, tex: [{ k: 'hatch', a: -0.7, gap: 6, al: 0.3, dens: (x, y) => clamp((x - HY_BX0) / HY_BW + 0.2) }] });
  paint(HY_rect(HY_BX0 + 2, Pb + 68, HY_BW - 4, 12), { fill: '#2e2a27', key: 'cpbseal', w: 2 });
  paint(rrectPts(HY_BX0 + 12, Pb - 34, HY_BW - 24, 34, 6), { fill: COL.pad, key: 'cppad', w: 3.5, tex: [{ k: 'cross', a: 0.8, gap: 6, al: 0.35, c: '#2e2118' }] });
  // the disc's edge just above the pad: the pad is pushed up against it
  paint(rrectPts(462, 538, 360, 40, 8), { fill: COL.steel, key: 'cpdisc', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.4 }] });
  handText('đĩa', 836, 576, 60, C.ink, { key: 'cplbd' });

  // ---- "pít-tông to": circle the big piston, width brackets under both bores
  const fTo = ev(tTo - 0.05, 0.6);
  if (fTo > 0) ink(ellipsePts(HY_BX0 + HY_BW / 2, Pb + 20, 150 + 4 * Math.sin(TT * 3), 92, -0.05, 40, -2.4, -2.4 + TAU * 1.04), { w: 5.5, color: C.ink, key: 'cpring', frac: fTo, amt: 1.2 });
  const brk = (x0, x1, f, key) => ink([[x0, 1146], [x0, 1164], [x1, 1164], [x1, 1146]], { w: 4.5, key, frac: f, amt: 0.8 });
  brk(HY_SX0, HY_SX0 + HY_SW, ev(tPit, 0.4), 'cpbrs');
  brk(HY_BX0, HY_BX0 + HY_BW, ev(tTo - 0.05, 0.5), 'cpbrb');
  { const s = 'nhỏ', w = handW(s, 64); handText(s, HY_SX0 + HY_SW / 2 - w / 2, 1232, 64, C.ink, { key: 'cplbs', frac: ev(tPit + 0.2, 0.4) }); }
  { const s = 'pít-tông to', w = handW(s, 66); handText(s, HY_BX0 + HY_BW / 2 - w / 2, 1234, 66, C.ink, { key: 'cplbb', frac: ev(tTo, 0.6) }); }

  // ---- forces (red): a thin push INTO the small piston, a much thicker push OUT of the big one (toward the disc)
  HY_arrow(HY_SX0 + HY_SW / 2, Ps - 190, HY_SX0 + HY_SW / 2, Ps - 74, { w: 9, head: 28, frac: ev(tNen, 0.35), key: 'cpfs' });
  const tw = 40 + 12 * Math.sin(Math.PI * seg(TT, tNhan, tNhan + 0.9));
  HY_arrow(HY_BX0 + HY_BW / 2, Pb + 46, HY_BX0 + HY_BW / 2, 552, { w: tw, head: 84, frac: EZ.o2(ev(tNen + 0.3, 0.6)), key: 'cpfb' });
  { const s = 'lực × vài lần', w = handW(s, 66); handText(s, clamp(HY_BX0 + HY_BW / 2 - w / 2, 60, 930 - w), 510, 66, C.ink, { key: 'cplbf', frac: ev(tNen + 0.4, 0.6) }); }
  inkTag('cùm phanh');
};
