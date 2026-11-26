// =====================================================================
//  sc-disc.js — beats 5, 6, 8: clamp, heat, payoff (one animation agent owns this file)
//  clamp  : the disc face-on (540,860,300) turning CLOCKWISE; the caliper over its upper-right edge; an inset
//           cross-section (top-left) of the disc's edge: two brown pads close from BOTH sides, red arrows inward on
//           "kẹp chặt". Labels "má phanh", "đĩa phanh".
//  heat   : the same disc; the spin slows on "hãm đĩa lại" (never reverses); on "động năng … nhiệt" steel ->
//           terracotta, 3 heat wisps from the pads; "động năng → nhiệt"; a thermometer (no number) rises on "nóng lên".
//  payoff : SLAM, complete on the first frame: a 3-storey building + "gần 10 m" bracket + a ghost scooter on the
//           roof with a dashed (ink) fall path, a big "=", the scooter on the ground with a "50 km/h" speedometer.
//           Ends with the front wheel exactly at [820,1100,70] (scale 70/92).
// =====================================================================
const DS_X = 540, DS_Y = 860, DS_R = 300;
const DS_CA = -2.25;                                               // the caliper's angle on the disc (upper LEFT, behind the fork, as in scooter())

// ---- the disc's turning speed (rad/s): steady in clamp, slows on "hãm" in heat but keeps turning clockwise
function DS_omega(t) {
  const tHam = VW('heat', 'hãm');
  if (t < tHam) return 3.0;
  return lerp(3.0, 0.55, EZ.o2(seg(t, tHam, tHam + 1.8))) - 0.2 * seg(t, tHam + 1.8, EE('heat'));
}
function DS_ang(t) {                                               // integrated angle from the clamp era start
  const t0 = ET('clamp'), dt = 1 / 48; let a = 0.3, s = t0;
  for (; s + dt <= t; s += dt) a += DS_omega(s + dt / 2) * dt;
  return a + DS_omega((s + t) / 2) * Math.max(0, t - s);
}

// ---- draw a group at reduced opacity (paint()/ink() reset globalAlpha, so render offscreen and blit)
let DS_cv = null;
// world-space fade: draws fn under the current camera into an offscreen canvas, then blits in screen space
function DS_fadeW(alpha, fn) {
  if (alpha <= 0.01) return;
  if (alpha >= 0.99) { fn(); return; }
  if (!DS_cv) { DS_cv = document.createElement('canvas'); DS_cv.width = W; DS_cv.height = H; }
  const saved = ctx, m = saved.getTransform();
  ctx = DS_cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); ctx.setTransform(m);
  ctx.save(); fn(); ctx.restore();
  ctx = saved; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = alpha; ctx.drawImage(DS_cv, 0, 0); ctx.restore();
}

// ---- a label whose text and leader can fade (label() in props resets alpha)
function DS_label(str, x, y, px, py, o = {}) {
  const sz = o.size ?? 56, al = o.al ?? 1, fr = o.frac ?? 1, key = o.key || 'dsl' + str;
  if (al <= 0.01 || fr <= 0) return;
  if (px != null) ink([[o.lx ?? x + 20, o.ly ?? y + 12], [px, py]], { w: 2.8, color: 'rgba(58,36,23,0.8)', key: key + 'l', frac: clamp(fr * 1.4), alpha: al, amt: 1 });
  handText(str, x, y, sz, o.color || C.ink, { key, frac: fr, al });
}

// ---- the caliper on the face-on disc (straddling the edge at DS_CA), with a window onto the brown pad
function DS_caliper(heat = 0, press = 0) {
  const c = Math.cos(DS_CA), s = Math.sin(DS_CA), rr = DS_R * 0.9, cx = DS_X + c * rr, cy = DS_Y + s * rr;
  const rot = DS_CA + Math.PI / 2;                                  // long side along the tangent
  const body = xform(rrectPts(-95, -66, 190, 132, 34), cx, cy, rot);
  paint(xform(rrectPts(-95, -66, 190, 132, 34), cx + 10, cy + 14, rot), { fill: 'rgba(58,36,23,0.28)', line: false, key: 'dscalsh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
  paint(body, { fill: COL.steelD, key: 'dscal', w: 4.5, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.4 }, { k: 'pencil', c: COL.steelL, al: 0.35, per: 60 }] });
  // the window: the pad (friction material) seen through the caliper, an arc band on the disc's rubbing ring
  const a0 = DS_CA - 0.2, a1 = DS_CA + 0.2, r0 = DS_R * 0.7, r1 = DS_R * 0.96;
  const pad = [...arcPts(DS_X, DS_Y, r1, a0, a1, 12), ...arcPts(DS_X, DS_Y, r0, a1, a0, 12)];
  paint(pad, { fill: heat > 0.05 ? `rgb(${Math.round(lerp(107, 168, heat))},${Math.round(lerp(84, 82, heat))},${Math.round(lerp(66, 58, heat))})` : COL.pad, key: 'dspadw', w: 3.5 + 1.5 * press, tex: [{ k: 'cross', c: 'rgba(0,0,0,0.35)', al: 0.45, gap: 5 }] });
  // two bolts
  for (const k of [-1, 1]) { const p = xform([[k * 70, -40]], cx, cy, rot)[0]; paint(ellipsePts(p[0], p[1], 10, 10, 0, 12), { fill: COL.steelL, key: 'dscb' + k, w: 2.5 }); }
  return { cx, cy, rot };
}

// ---- the inset: a cross-section of the disc's edge, the pads closing from both sides (gap 1 open -> 0 clamped)
const DS_IN = { x: 548, y: 418, w: 390, h: 245 };
function DS_inset(gap, arrowF, heat = 0) {
  const { x, y, w, h } = DS_IN, mx = x + w / 2;
  paint(rrectPts(x + 8, y + 10, w, h, 16), { fill: 'rgba(58,36,23,0.25)', line: false, key: 'dsinsh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
  paint(rrectPts(x, y, w, h, 16), { fill: '#fbf5e6', key: 'dsin', w: 4, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.45, per: 90 }] });
  ctx.save(); trace(rrectPts(x + 3, y + 3, w - 6, h - 6, 14), true); ctx.clip();
  // the disc's edge, seen end-on: a vertical steel bar (its rim at the top, it runs on down toward the hub)
  const bw = 40, top = y + 70;
  paint(rrectPts(mx - bw / 2, top, bw, h + 40, 8), { fill: tempCol(heat * 0.85), key: 'dsinbar', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.35 }] });
  // the caliper bridge over the rim (ink outline, steel)
  const bx0 = x + 50, bx1 = x + w - 50;
  paint([[bx0, y + 175], [bx0, y + 26], [bx1, y + 26], [bx1, y + 175], [bx1 - 20, y + 175], [bx1 - 20, y + 48], [bx0 + 20, y + 48], [bx0 + 20, y + 175]], { fill: COL.steelD, key: 'dsinbr', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.4 }] });
  // the pads + their steel backing plates, closing from BOTH sides
  const g = 44 * gap, pw = 38, ph = 130, py = top + 18;
  const padC = heat > 0.05 ? `rgb(${Math.round(lerp(107, 168, heat))},${Math.round(lerp(84, 82, heat))},${Math.round(lerp(66, 58, heat))})` : COL.pad;
  for (const sd of [-1, 1]) {
    const inner = mx + sd * (bw / 2 + g), outer = inner + sd * pw, bp = outer + sd * 14;
    paint(box(Math.min(inner, outer), py, pw, ph), { fill: padC, key: 'dsinp' + sd, w: 3.5, tex: [{ k: 'cross', c: 'rgba(0,0,0,0.35)', al: 0.45, gap: 5 }] });
    paint(box(Math.min(outer, bp), py - 6, 14, ph + 12), { fill: COL.steelL, key: 'dsinbp' + sd, w: 3 });
  }
  ctx.restore();
  ink(rrectPts(x, y, w, h, 16), { closed: true, w: 4, key: 'dsinol' });
  // red FORCE arrows, inward from both sides, onto the backing plates
  if (arrowF > 0) {
    const ay = py + ph / 2, wv = 13 + 2.5 * Math.sin(TT * 6);
    forceArrow(x + 12, ay, mx - bw / 2 - g - pw - 16, ay, { w: wv, frac: arrowF, key: 'dsfaL' });
    forceArrow(x + w - 12, ay, mx + bw / 2 + g + pw + 16, ay, { w: wv, frac: arrowF, key: 'dsfaR' });
  }
}
// thin dashed "magnifier" lines from the inset to the caliper
function DS_magLines(cal, al = 1) {
  ctx.save(); ctx.setLineDash([14, 12]);
  const { x, y, w, h } = DS_IN;
  const P = xform([[-95, -66], [95, 66]], cal.cx, cal.cy, cal.rot);
  ink([[x, y + 30], [cal.cx + 30, cal.cy - 72]], { w: 2.4, color: 'rgba(58,36,23,0.6)', key: 'dsmg1', alpha: al, amt: 0.8 });
  ink([[x, y + h - 20], [cal.cx + 74, cal.cy + 6]], { w: 2.4, color: 'rgba(58,36,23,0.6)', key: 'dsmg2', alpha: al, amt: 0.8 });
  ctx.restore();
}
function DS_shadow() {
  paint(ellipsePts(DS_X + 16, DS_Y + 22, DS_R, DS_R, 0, 64), { fill: 'rgba(58,36,23,0.25)', line: false, key: 'dsdsh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
}

// =====================================================================
//  5 CLAMP — "Hai má phanh kẹp chặt lấy đĩa phanh đang quay."
// =====================================================================
SCENES.clamp = function () {
  paperSheet('clamp', { ruled: false });
  const tMa = VW('clamp', 'má'), tKep = VW('clamp', 'kẹp'), tDia = VW('clamp', 'đĩa');
  const ang = DS_ang(TT);
  const close = EZ.io(seg(TT, tKep, tKep + 0.4));                   // pads close on "kẹp chặt"
  DS_shadow();
  brakeDisc(DS_X, DS_Y, DS_R, ang, { key: 'dsdisc' });
  const cal = DS_caliper(0, close);
  // motion marks: two curved clockwise arrows (ink) riding just outside the disc, lower left
  const inA = ev(ET('clamp') + 0.55, 0.4);
  for (let i = 0; i < 2; i++) {
    const a0 = Math.PI * (-0.05 + i * 0.5) + mod(ang * 0.15, 0.25), a1 = a0 + 0.42;
    const P = arcPts(DS_X, DS_Y, DS_R + 40, a0, a1, 14), tip = P[P.length - 1], tg = a1 + Math.PI / 2;
    ink(P, { w: 5, key: 'dsrot' + i, alpha: inA, amt: 1 });
    ink([[tip[0] - Math.cos(tg - 0.5) * 22, tip[1] - Math.sin(tg - 0.5) * 22], tip, [tip[0] - Math.cos(tg + 0.5) * 22, tip[1] - Math.sin(tg + 0.5) * 22]], { w: 5, key: 'dsroth' + i, alpha: inA, amt: 0.6 });
  }
  // the inset grows in after the bridge, then the pads close on "kẹp"
  const inS = EZ.o3(seg(TT, ET('clamp') + 0.55, ET('clamp') + 0.95));
  if (inS > 0.01) {
    DS_magLines(cal, inS);
    ctx.save(); ctx.translate(DS_IN.x, DS_IN.y + DS_IN.h); ctx.scale(inS, inS); ctx.translate(-DS_IN.x, -(DS_IN.y + DS_IN.h));
    DS_inset(1 - close, EZ.o2(seg(TT, tKep - 0.05, tKep + 0.35)));
    ctx.restore();
  }
  DS_label('má phanh', 70, 500, cal.cx - 6, cal.cy - 40, { size: 66, frac: ev(Math.max(tMa, ET('clamp') + 0.8), 0.5), lx: 200, ly: 514, key: 'dslma' });
  DS_label('đĩa phanh', 600, 1238, 700, 1120, { size: 66, frac: ev(Math.min(tDia - 0.05, 21.0), 0.5), lx: 700, ly: 1180, key: 'dsldia' });
  inkTag('má phanh kẹp đĩa');
};

// =====================================================================
//  6 HEAT — "Ma sát hãm đĩa lại, động năng của xe biến thành nhiệt, đĩa nóng lên."
// =====================================================================
function DS_thermo(x, y, u, al) {
  const hgt = 300;
  const f = () => {
    paint(rrectPts(x - 22, y - hgt, 44, hgt + 10, 22), { fill: '#fffaf0', w: 3.5, key: 'dsthb', tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.4, per: 90 }] });
    for (let i = 1; i < 6; i++) ink([[x + 8, y - i * hgt / 6], [x + 22, y - i * hgt / 6]], { w: 2.4, key: 'dstk' + i, amt: 0.5 });
    paint(ellipsePts(x, y + 26, 36, 36, 0, 28), { fill: tempCol(0.35 + 0.65 * u), w: 3.5, key: 'dsthbulb', tex: [{ k: 'cross', c: 'rgba(0,0,0,0.25)', al: 0.4, gap: 5 }] });
    ink([[x, y + 10], [x, y - 10 - (hgt - 40) * u]], { w: 16, color: tempCol(0.35 + 0.65 * u), key: 'dsthc', amt: 0.6 });
  };
  DS_fadeW(al, f);
}
SCENES.heat = function () {
  paperSheet('heat', { ruled: false });
  const t0 = ET('heat'), tEnd = EE('heat');
  const tHam = VW('heat', 'hãm'), tDong = VW('heat', 'động'), tBien = VW('heat', 'biến'), tNhiet = VW('heat', 'nhiệt');
  const tDia = VW('heat', 'đĩa', 2), tNong = VW('heat', 'nóng');
  const ang = DS_ang(TT);
  const heat = EZ.io(seg(TT, tDong, tNhiet + 0.3));                 // steel -> terracotta on "động năng … nhiệt"
  DS_shadow();
  brakeDisc(DS_X, DS_Y, DS_R, ang, { key: 'dsdisc', heat });
  const cal = DS_caliper(heat, 1);
  // the clockwise motion marks, shortening as the disc slows
  const sp = DS_omega(TT) / 3;
  for (let i = 0; i < 2; i++) {
    const a0 = Math.PI * (-0.05 + i * 0.5) + mod(ang * 0.15, 0.25), a1 = a0 + 0.12 + 0.3 * sp;
    const P = arcPts(DS_X, DS_Y, DS_R + 40, a0, a1, 14), tip = P[P.length - 1], tg = a1 + Math.PI / 2;
    ink(P, { w: 5, key: 'dsrot' + i, amt: 1 });
    ink([[tip[0] - Math.cos(tg - 0.5) * 22, tip[1] - Math.sin(tg - 0.5) * 22], tip, [tip[0] - Math.cos(tg + 0.5) * 22, tip[1] - Math.sin(tg + 0.5) * 22]], { w: 5, key: 'dsroth' + i, amt: 0.6 });
  }
  // the inset (pads clamped) stays through the bridge, then fades on "hãm đĩa lại"
  const inA = 1 - EZ.io(seg(TT, tHam + 0.2, tHam + 0.7));
  if (inA > 0.01) DS_fadeW(inA, () => { DS_magLines(cal); DS_inset(0, 1); });
  // heat wisps rising from the pad zone (above the caliper)
  const hw = heat * (0.8 + 0.2 * Math.sin(TT * 2.4));
  if (hw > 0.05) heatWisps(cal.cx - 30, cal.cy - 92, { n: 3, amt: hw, spread: 46, key: 'dshw', w: 7 });
  // labels
  const lab = 'động năng → nhiệt';
  const fr = 0.6 * EZ.o2(seg(TT, tDong, tDong + 0.6)) + 0.4 * EZ.o2(seg(TT, tBien, tNhiet + 0.2));
  DS_label(lab, 425, 506, null, null, { size: 60, frac: fr, key: 'dsldn' });
  DS_label('đĩa phanh', 600, 1238, 700, 1120, { size: 66, lx: 700, ly: 1180, key: 'dsldia', al: 1 - ev(tDong - 0.4, 0.4) });
  // the thermometer: appears on "nhiệt", rises on "đĩa nóng lên" (no number)
  const thA = ev(tNhiet - 0.1, 0.35);
  if (thA > 0) DS_thermo(150, 1100, 0.12 + 0.2 * heat + 0.6 * EZ.io(seg(TT, tDia, tNong + 0.6)), thA);
  inkTag('ma sát → nhiệt');
};

// =====================================================================
//  8 PAYOFF — "Dừng xe từ năm mươi cây số giờ tốn năng lượng bằng một cú rơi cao gần mười mét!"   (SLAM: complete on frame 1)
// =====================================================================
const DS_GND = 1170, DS_BX0 = 130, DS_BX1 = 330, DS_ROOF = 640;
const DS_GS = 0.24, DS_GFX = 318;                                   // the rooftop scooter's scale + its front-wheel x (at the roof edge)
function DS_building(pulse) {
  // shadow + facade (graphite hatch), 3 storeys, 2 windows each, a door
  paint(box(DS_BX0 + 14, DS_ROOF + 14, DS_BX1 - DS_BX0, DS_GND - DS_ROOF - 14), { fill: 'rgba(58,36,23,0.22)', line: false, key: 'dsbsh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.4 }] });
  paint(box(DS_BX0, DS_ROOF, DS_BX1 - DS_BX0, DS_GND - DS_ROOF), { fill: '#ece2cc', key: 'dsbld', w: 4.5, tex: [{ k: 'hatch', a: 0.8, gap: 7, al: 0.4, dens: (px, py) => clamp((px - DS_BX0) / 260 + 0.25) }, { k: 'hatch', a: -0.75, gap: 9, al: 0.2 }] });
  ink([[DS_BX0 - 12, DS_ROOF], [DS_BX1 + 12, DS_ROOF]], { w: 7, key: 'dsroof' });
  const fh = (DS_GND - DS_ROOF) / 3;
  for (let f = 0; f < 3; f++) {
    const y0 = DS_ROOF + f * fh;
    if (f > 0) ink([[DS_BX0, y0], [DS_BX1, y0]], { w: 2.6, key: 'dsfl' + f, color: 'rgba(58,36,23,0.7)' });
    for (let k = 0; k < 2; k++) {
      if (f === 2 && k === 1) continue;
      paint(box(DS_BX0 + 32 + k * 100, y0 + 50, 56, 84), { fill: '#d9e4e6', key: 'dsw' + f + k, w: 3, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.35 }] });
    }
  }
  paint(box(DS_BX1 - 80, DS_GND - 120, 52, 120), { fill: '#b98e62', key: 'dsdoor', w: 3, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.4 }] });
  // the measuring bracket on the left: roof -> ground, end ticks, arrowheads; pulses gently
  const bx = 88, wv = 3.5 + 1.5 * pulse;
  ink([[bx, DS_ROOF + 6], [bx, DS_GND - 6]], { w: wv, key: 'dsbrk' });
  for (const yy of [DS_ROOF, DS_GND]) ink([[bx - 22, yy], [bx + 22, yy]], { w: wv, key: 'dsbrt' + yy });
  for (const [yy, s] of [[DS_ROOF + 4, 1], [DS_GND - 4, -1]]) ink([[bx - 14, yy + s * 24], [bx, yy], [bx + 14, yy + s * 24]], { w: wv, key: 'dsbrh' + yy, amt: 0.6 });
}
function DS_ghost(dy, al, dx = 0) {
  DS_fadeW(al, () => {
    ctx.save(); ctx.translate(DS_GFX + dx - FW[0] * DS_GS, DS_ROOF - GROUND_Y * DS_GS + dy); ctx.scale(DS_GS, DS_GS);
    scooter({ key: 'dsgh' });
    ctx.restore();
  });
}
function DS_speedo(x, y, r, kmh) {
  paint(ellipsePts(x + 8, y + 10, r, r, 0, 40), { fill: 'rgba(58,36,23,0.25)', line: false, key: 'dsspsh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
  paint(ellipsePts(x, y, r, r, 0, 40), { fill: '#fbf5e6', key: 'dssp', w: 4.5, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.45, per: 90 }] });
  const A0 = Math.PI * 0.8, A1 = Math.PI * 2.2, am = (v) => lerp(A0, A1, v / 120);   // 0..120 km/h over a 252° arc
  ink(arcPts(x, y, r * 0.8, A0, A1, 30), { w: 3, key: 'dsspa' });
  for (let v = 0; v <= 120; v += 10) { const a = am(v), l = v % 50 === 0 ? 0.6 : 0.7; ink([[x + Math.cos(a) * r * l, y + Math.sin(a) * r * l], [x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8]], { w: v % 50 === 0 ? 4.5 : 2.4, key: 'dsspt' + v, amt: 0.4 }); }
  const a = am(kmh);
  ink([[x - Math.cos(a) * r * 0.12, y - Math.sin(a) * r * 0.12], [x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74]], { w: 7, key: 'dsspn', amt: 0.5 });
  paint(ellipsePts(x, y, 10, 10, 0, 12), { fill: C.ink, key: 'dsspc', w: 2 });
}
SCENES.payoff = function () {
  paperSheet('payoff', { ruled: false });
  const t0 = ET('payoff'), tEnd = EE('payoff'), u = TT - t0;
  const tNam = VW('payoff', 'năm'), tRoi = VW('payoff', 'rơi'), tMuoi = VW('payoff', 'mười');
  // the ground line
  paint(box(-40, DS_GND, W + 80, 90), { fill: COL.road, key: 'dsgnd', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 8, al: 0.25 }] });
  // the building with its bracket (pulses on "năm mươi" and "cao gần mười mét")
  const pulse = Math.max(0.5 + 0.5 * Math.sin(u * 3), EZ.o2(1 - seg(TT, tRoi, tRoi + 0.8)) * (TT > tRoi ? 1 : 0));
  DS_building(pulse);
  // the dashed fall path (ink: a path, not a force), beside the building, pulsing with a running dash
  const fx = 366, fy1 = DS_GND - 14;
  ctx.save(); ctx.setLineDash([22, 16]); ctx.lineDashOffset = -u * 60;
  ink([[DS_GFX + 24, DS_ROOF + 4], [fx - 6, DS_ROOF + 36], [fx, DS_ROOF + 90], [fx, fy1 - 20]], { w: 5 + 1.5 * Math.sin(u * 4), key: 'dsfall', raw: true });
  ctx.restore();
  ink([[fx - 20, fy1 - 34], [fx, fy1], [fx + 20, fy1 - 34]], { w: 5, key: 'dsfallh', amt: 0.6 });
  // the scooter on the roof edge, right above the dashed fall path
  DS_ghost(0, 1);
  // the "gần 10 m" card on the façade (written already on frame 1)
  const mlab = 'gần 10 m', mw = handW(mlab, 56) + 30;
  paint(rrectPts(230 - mw / 2, 790, mw, 84, 12), { fill: '#fbf5e6', key: 'dsmc', w: 3.5, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.45, per: 90 }] });
  handText(mlab, 230 - mw / 2 + 15, 850, 56, C.ink, { key: 'dsmt' });
  ink([[88, 832], [230 - mw / 2, 832]], { w: 2.6, key: 'dsml', color: 'rgba(58,36,23,0.7)' });
  // the big "=" with a soft glow (swells on "bằng")
  const tBang = VW('payoff', 'bằng'), gl = 0.35 + 0.25 * Math.sin(u * 2.5) + 0.4 * Math.sin(Math.PI * seg(TT, tBang - 0.1, tBang + 0.9));
  const ex = 528, ey = 610;
  paint(ellipsePts(ex, ey, 92, 74, 0, 32), { fill: `rgba(247,221,146,${0.35 + 0.45 * gl})`, line: false, key: 'dseqg', tex: [{ k: 'pencil', c: C.yellow, al: 0.4 * gl, per: 60 }] });
  for (const dy of [-22, 22]) paint(rrectPts(ex - 62, ey + dy - 10, 124, 20, 8), { fill: C.ink, key: 'dseq' + dy, w: 2.5 });
  // the scooter on the ground, going 50 km/h (wheels turning clockwise), front wheel at x 820 on the ground;
  // at the end it grows to scale 70/92 so its front wheel sits exactly on the bridge circle [820,1100,70]
  const sEnd = 70 / 92, s = lerp(0.56, sEnd, EZ.io(seg(TT, tMuoi - 0.1, tEnd - 0.55)));
  const wy = DS_GND - FW[2] * s;
  const spin = 0.4 + u * lerp(9, 5, seg(TT, t0, tEnd));
  ctx.save(); ctx.translate(820 - FW[0] * s, wy - FW[1] * s); ctx.scale(s, s);
  scooter({ spin, speed: 0.6 * (1 - seg(TT, tMuoi - 0.2, tEnd - 0.6)), key: 'dssc' });
  ctx.restore();
  // the speedometer bubble: needle settles on 50
  const settle = seg(TT, t0, t0 + 2.2), kmh = 50 + 14 * Math.exp(-3 * settle * 2.2) * Math.cos(settle * 14) * (1 - settle) + 0.8 * Math.sin(u * 5);
  const spA = 1 - seg(TT, tMuoi - 0.1, tEnd - 0.6);
  DS_fadeW(spA, () => {
    DS_speedo(775, 600, 92, kmh);
    handText('50 km/h', 775 - handW('50 km/h', 58) / 2, 760, 58, C.ink, { key: 'dsspl' });
  });
  // the tag, finished on the first frame (hard cut): no pop
  const tg = 'năng lượng = rơi 10 m';
  const f = () => inkCard(tg, 70 + (handW(tg, 80) + 72) / 2, 330, 80, { rot: -0.04 });
  if (DEFER) DEFER.push(f); else f();
};
