// =====================================================================
//  SCENES — hook, tyre, front, end (the street + the big front-wheel close-up). World 1080x1920.
//  The scooter faces RIGHT and moves RIGHT: the road dashes and the backdrop slide LEFT, the wheels turn CLOCKWISE.
//  Motion is integrated analytically from a speed profile (ST_dist), so every frame depends on t only.
//  Colour code: RED forceArrow = forces only · terracotta (tempCol, heatWisps) = heat only · steel = metal.
//  Bridges: hook ends stopped with the hand on GRIP; tyre opens on the warm disc [540,800,150];
//  front + end hold FW (the scooter never moves in the frame; the world moves around it).
// =====================================================================

// ---- speed profile: v0 until t1, then a cosine ease down to 0 at t2. Distance travelled since ts (analytic integral).
function ST_dist(t, ts, v0, t1, t2) {
  const D = t2 - t1, u = seg(t, t1, t2);
  return v0 * (clamp(t, ts, t1) - ts) + (t > t1 ? v0 * D * (u + Math.sin(Math.PI * u) / Math.PI) / 2 : 0);
}
const ST_speed = (t, v0, t1, t2) => (t < t1 ? v0 : v0 * (1 + Math.cos(Math.PI * seg(t, t1, t2))) / 2);

// ---- the road (like props.road, but the lane dashes sit lower so labels fit just under the ground line)
function ST_road(y0, scroll, o = {}) {
  const key = o.key || 'str', gap = o.gap ?? 260, len = o.len ?? 120, dy = o.dy ?? 150, dh = o.dh ?? 16;
  paint(box(-60, y0, W + 120, H - y0 + 60), { fill: COL.road, key: key + 'b', w: 4, tex: [{ k: 'hatch', a: 0.15, gap: 9, al: 0.25, dens: (px, py) => clamp((py - y0) / 300) }] });
  for (let i = -1; i < Math.ceil(W / gap) + 2; i++) {
    const x = mod(i * gap - scroll, gap * (Math.ceil(W / gap) + 3)) - gap;
    paint(box(x, y0 + dy, len, dh), { fill: '#f4ecd9', key: key + 'd' + i, w: 2.4, amt: 0.6 });
  }
}

// ---- the street backdrop: a few big pale blocks + trees, sliding LEFT with parallax (off = road scroll)
const ST_PER = 1500;
const ST_BLD = [
  { x: 0, w: 300, top: 600, fill: '#e6d9bf' },
  { x: 560, w: 260, top: 520, fill: '#ddcfb3' },
  { x: 900, w: 330, top: 690, fill: '#e9ddc6' },
];
const ST_TREES = [{ x: 450, r: 100, top: 690 }, { x: 1340, r: 115, top: 660 }];
function ST_backdrop(off, key = 'stbd') {
  const sh = off * 0.35, X = (bx) => mod(bx - sh, ST_PER) - 360, line = 'rgba(58,36,23,0.4)';
  for (let i = 0; i < ST_BLD.length; i++) {
    const b = ST_BLD[i], x = X(b.x);
    paint(box(x, b.top, b.w, GROUND_Y - b.top), { fill: b.fill, line, w: 2.5, key: key + 'b' + i, tex: [{ k: 'hatch', a: 0.8, gap: 9, al: 0.18, dens: (px, py) => clamp((px - x) / b.w * 0.8 + 0.1) }] });
    // a roof line + a few big windows (two per floor, three floors), very light
    ink([[x - 8, b.top], [x + b.w + 8, b.top]], { w: 5, color: line, key: key + 'r' + i, amt: 0.5 });
    for (let f = 0; f < 3; f++) for (let c = 0; c < 2; c++) {
      const wx = x + b.w * (0.18 + c * 0.42), wy = b.top + 50 + f * 120;
      if (wy + 70 > GROUND_Y - 40) continue;
      paint(box(wx, wy, b.w * 0.24, 70), { fill: '#f1e8d6', line: 'rgba(58,36,23,0.25)', w: 2, key: key + 'w' + i + f + c, amt: 0.5 });
    }
  }
  for (let i = 0; i < ST_TREES.length; i++) {
    const t = ST_TREES[i], x = X(t.x);
    ink([[x, GROUND_Y], [x + 4, t.top + t.r * 0.6]], { w: 18, color: '#a08a70', key: key + 'tt' + i, amt: 0.5 });
    paint(ellipsePts(x, t.top, t.r, t.r * 0.92, 0, 30), { fill: '#cfd6b2', line, w: 2.5, key: key + 'tc' + i, tex: [{ k: 'hatch', a: 0.8, gap: 8, al: 0.2, dens: (px, py) => clamp((px - x + py - t.top) / (2 * t.r) + 0.5) }] });
  }
}

// a label whose right edge stays inside x ≤ 930
function ST_label(str, x, y, px, py, o = {}) {
  const sz = o.size ?? 56, w = handW(str, sz);
  const xx = Math.min(x, 930 - w);
  label(str, xx, y, px, py, { size: sz, frac: o.frac, al: o.al, key: o.key, lx: o.lx ?? (o.right ? w - 24 : w / 2), ly: o.ly ?? 14 });
}

// =====================================================================
//  1 HOOK — "Phanh không xóa tốc độ của xe: nó biến tốc độ thành hơi nóng."
//  Riding right; on "Phanh" the lever squeezes and the bike eases to a stop by ~3.3 s, the nose dips then settles;
//  the front disc warms while braking. Ends stopped, lever released, the hand on GRIP (bridge).
// =====================================================================
const ST_HV0 = 520;   // px/s, cruising
function ST_hookMotion(t) {
  const t1 = VW('hook', 'Phanh') + 0.1, t2 = 3.3;
  return { x: ST_dist(t, 0, ST_HV0, t1, t2), v: ST_speed(t, ST_HV0, t1, t2), t1, t2 };
}
SCENES.hook = function () {
  paperSheet('hook', { ruled: false });
  const m = ST_hookMotion(TT), tP = VW('hook', 'Phanh'), tNo = VW('hook', 'nó'), tHot = VW('hook', 'nóng');
  ST_backdrop(m.x);
  ST_road(GROUND_Y, m.x);
  const sq = ev(tP - 0.05, 0.3) * (1 - EZ.io(seg(TT, 3.9, 4.5)));
  const dive = 0.035 * EZ.o2(seg(TT, m.t1, m.t1 + 0.5)) * (1 - EZ.io(seg(TT, m.t2 - 0.3, m.t2 + 0.35)));
  const rebound = -0.009 * Math.sin(Math.PI * seg(TT, m.t2 - 0.05, m.t2 + 0.9));
  const heat = 0.8 * EZ.io(seg(TT, 1.2, 3.8));
  scooter({ spin: m.x / FW[2], speed: m.v / ST_HV0, squeeze: sq, pitch: dive + rebound, heat, key: 'hksc' });
  // "tốc độ" over the speed lines, gone as they fade; "→ nhiệt" at the warming disc
  const aSp = 1 - EZ.io(seg(TT, 2.9, 3.4));
  if (aSp > 0) {   // a paper patch behind it (the backdrop is busy there) + a short ink arrow down to the speed lines
    const fs = ev(0.15, 0.5), lw = handW('tốc độ', 64);
    if (aSp > 0.5 && fs > 0) paint(rrectPts(52, 632, lw + 36, 84, 18), { fill: C.paper, line: false, key: 'hkspbg', tex: [{ k: 'pencil', c: '#fffaf0', al: 0.4, per: 200 }] });
    label('tốc độ', 70, 695, null, null, { size: 64, frac: fs, al: aSp, key: 'hksp' });
    const fa = ev(0.5, 0.3);
    if (fa > 0) { ink([[110, 712], [96, 748]], { w: 4, key: 'hkspa', frac: fa, alpha: aSp }); if (fa >= 1) ink([[82, 734], [96, 750], [112, 736]], { w: 4, key: 'hkspah', alpha: aSp }); }
  }
  const aH = 1 - ev(4.55, 0.2);
  if (aH > 0) ST_label('→ nhiệt', 700, 520, FW[0] + 62, FW[1] - DISC_R - 34, { frac: ev(tNo - 0.05, 0.4), al: aH, key: 'hkht', size: 60, right: true });
  // a small glow ring pulse on the disc on "nóng"
  const g = Math.sin(Math.PI * seg(TT, tHot - 0.1, tHot + 0.5));
  if (g > 0) ink(ellipsePts(FW[0], FW[1], DISC_R + 10 + 8 * g, DISC_R + 10 + 8 * g, 0, 32), { closed: true, w: 6, color: `rgba(217,119,87,${0.6 * g})`, key: 'hkglo' });
  inkTag('bóp phanh!');
};

// =====================================================================
//  7 TYRE — "Bánh quay chậm dần, và chính lốp bám vào mặt đường mới kéo cả xe dừng lại."
//  The big front wheel on the road (centre [540,800], tyre r 330, warm disc r 150). Spin + road slow to 0 by ~34.4 s.
//  On "lốp bám" the contact patch lights up; a red friction arrow ON THE GROUND points LEFT (backward);
//  on "kéo … dừng lại" it thickens. Pause: wheel still, only the heat wisps live. Then the SLAM.
// =====================================================================
const ST_TC = [540, 800], ST_TR = 330, ST_TG = ST_TC[1] + ST_TR, ST_TV0 = 620;
function ST_tyreMotion(t) {
  const ts = ET('tyre'), t1 = ts + 0.15, t2 = 34.4;
  return { x: ST_dist(t, ts, ST_TV0, t1, t2), v: ST_speed(t, ST_TV0, t1, t2) };
}
SCENES.tyre = function () {
  paperSheet('tyre', { ruled: false });
  const [cx, cy] = ST_TC, m = ST_tyreMotion(TT), spin = m.x / ST_TR + 0.6, sp = m.v / ST_TV0;
  const tLop = VW('tyre', 'lốp'), tBam = VW('tyre', 'bám'), tMat = VW('tyre', 'mặt'), tKeo = VW('tyre', 'kéo');
  ST_road(ST_TG, m.x, { key: 'tyrd', gap: 640, len: 300, dy: 170, dh: 26 });
  // ground shadow
  paint(ellipsePts(cx, ST_TG + 6, 300, 20, 0, 40), { fill: 'rgba(58,36,23,0.25)', line: false, key: 'tysh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
  // the front fender over the tyre (the scooter's paint)
  ink(arcPts(cx, cy, ST_TR + 34, Math.PI * 1.18, Math.PI * 1.78, 22), { w: 26, color: C.ink, key: 'tyff0' });
  ink(arcPts(cx, cy, ST_TR + 34, Math.PI * 1.18, Math.PI * 1.78, 22), { w: 17, color: COL.bodyD, key: 'tyff' });
  // tyre, rim, tread marks + spokes turning clockwise
  paint(ellipsePts(cx, cy, ST_TR, ST_TR, 0, 64), { fill: COL.tyre, key: 'tyty', w: 5, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.3, c: '#000' }] });
  for (let i = 0; i < 12; i++) {
    const a = spin + i * TAU / 12;
    ink([[cx + Math.cos(a) * (ST_TR - 30), cy + Math.sin(a) * (ST_TR - 30)], [cx + Math.cos(a + 0.06) * (ST_TR - 6), cy + Math.sin(a + 0.06) * (ST_TR - 6)]], { w: 7, color: '#6d645c', key: 'tytr' + i, amt: 0.5 });
  }
  paint(ellipsePts(cx, cy, 245, 245, 0, 60), { fill: COL.steelL, key: 'tyrim', w: 5, tex: [{ k: 'hatch', a: -0.7, gap: 7, al: 0.25 }] });
  for (let i = 0; i < 5; i++) {
    const a = spin + i * TAU / 5;
    ink([[cx + Math.cos(a) * 150, cy + Math.sin(a) * 150], [cx + Math.cos(a) * 238, cy + Math.sin(a) * 238]], { w: 26, color: COL.steelD, key: 'tysp' + i, amt: 0.6 });
  }
  // the warm disc (the bridge object, [540,800,150]) + caliper on its upper-rear edge + wisps
  const heat = 0.75 + 0.05 * Math.sin(TT * 2.2);
  brakeDisc(cx, cy, 150, spin, { heat, key: 'tydisc' });
  ctx.save(); ctx.translate(cx + Math.cos(-2.25) * 136, cy + Math.sin(-2.25) * 136); ctx.rotate(-2.25 + Math.PI / 2);
  paint(rrectPts(-62, -38, 124, 76, 18), { fill: COL.steelD, key: 'tycal', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.35 }] });
  ctx.restore();
  heatWisps(cx + 70, cy - 120, { n: 3, amt: 0.8, spread: 40, key: 'tyhw', w: 7 });
  // the wheel turns clockwise: an ink rotation arrow at lower right, fading as the wheel slows
  if (sp > 0.03) {
    const r = ST_TR + 46, a0 = 0.12, a1 = 0.95, al = sp * 0.85;
    ink(arcPts(cx, cy, r, a0, a1, 18), { w: 6, color: C.ink, key: 'tyrot', alpha: al });
    const hx = cx + Math.cos(a1) * r, hy = cy + Math.sin(a1) * r, tx = -Math.sin(a1), ty = Math.cos(a1), nx = Math.cos(a1), ny = Math.sin(a1);
    ink([[hx - tx * 30 + nx * 18, hy - ty * 30 + ny * 18], [hx, hy], [hx - tx * 30 - nx * 18, hy - ty * 30 - ny * 18]], { w: 6, color: C.ink, key: 'tyroth', alpha: al });
  }
  // on "lốp bám": the contact patch lights up (ink outline written on)
  const fP = ev(tLop - 0.05, 0.45);
  if (fP > 0) ink(ellipsePts(cx, ST_TG, 120, 24, 0, 40), { closed: true, w: 6, color: C.ink, key: 'typatch', frac: fP });
  // on "bám": the grip force ON THE GROUND, at the contact patch, pointing LEFT (backward); thicker on "kéo"
  const fA = ev(tBam, 0.5), thick = EZ.o2(ev(tKeo, 0.6));
  if (fA > 0) forceArrow(cx + 40, ST_TG + 14, cx - 290 - 30 * thick, ST_TG + 14, { w: 14 + 14 * thick, head: 40 + 16 * thick, frac: fA, key: 'tyfa' });
  if (TT >= tMat - 0.1) label('lực bám mặt đường', 100, ST_TG + 116, null, null, { size: 70, frac: ev(tMat - 0.1, 0.6), key: 'tylb' });
  inkTag('lốp bám đường');
};

// =====================================================================
//  9 FRONT — "Khi phanh, sức nặng dồn về trước, nên bánh trước gánh khoảng bảy phần mười lực hãm."
//  The street scooter brakes from slow to a stop; on "dồn" the nose dips (pitch → 0.045) and the red weight arrow
//  (down) slides from the middle to over the front wheel; two ground arrows (LEFT): front thick ≈ 7, rear thin ≈ 3.
//  Ends stopped, pitch back to 0, labels gone ≥ 0.5 s before the bridge (FW).
// =====================================================================
const ST_FV0 = 300;
function ST_frontMotion(t) {
  const ts = ET('front'), t1 = VW('front', 'phanh'), t2 = 46.6;
  return { x: ST_dist(t, ts, ST_FV0, t1, t2), v: ST_speed(t, ST_FV0, t1, t2), t1, t2 };
}
SCENES.front = function () {
  paperSheet('front', { ruled: false });
  const m = ST_frontMotion(TT), tSuc = VW('front', 'sức'), tDon = VW('front', 'dồn'), tTr = VW('front', 'trước');
  const tBanh = VW('front', 'bánh'), tBay = VW('front', 'bảy'), out = 1 - ev(47.4, 0.35);
  const bgOff = ST_hookMotion(5.25).x;   // the same street as the hook, continuing
  ST_backdrop(bgOff + m.x, 'stbd');
  ST_road(GROUND_Y, m.x);
  const pitch = (0.012 * ev(m.t1, 0.4) + 0.033 * EZ.io(seg(TT, tDon - 0.05, tDon + 0.45))) * (1 - EZ.io(seg(TT, m.t2, m.t2 + 0.9)));
  const sq = ev(m.t1 - 0.1, 0.3) * (1 - EZ.io(seg(TT, 46.9, 47.5)));
  const heat = lerp(0.35, 0.6, EZ.io(seg(TT, m.t1, m.t2)));
  scooter({ spin: m.x / FW[2], speed: 0.6 * m.v / ST_FV0, squeeze: sq, pitch, heat, key: 'frsc' });
  // the weight: a red arrow pointing DOWN, sliding from the middle toward the front wheel on "dồn về trước"
  const fW = ev(tSuc, 0.4);
  if (fW > 0 && out > 0) {
    const wx = lerp(450, 650, EZ.io(seg(TT, tDon, tDon + 0.7)));
    // the centre of mass (an ink dot under the torso) and the weight hanging DOWN from it; both slide forward on "dồn"
    if (out > 0.5) paint(ellipsePts(wx, 800, 16 * popS(tSuc - 0.1), 16 * popS(tSuc - 0.1), 0, 18), { fill: C.ink, key: 'frcm', w: 3 });
    forceArrow(wx, 818, wx, 1010, { w: 18, head: 44, frac: fW, key: 'frwt', al: out });
    label('sức nặng', wx - 30 - handW('sức nặng', 62), 925, null, null, { size: 62, frac: ev(tSuc, 0.4), al: out * (1 - ev(tTr + 0.3, 0.3)), key: 'frwl' });
  }
  // braking forces on the ground, both pointing LEFT (backward): front ≈ 7 parts (long, thick), rear ≈ 3 (short, thin)
  const fG = ev(tTr, 0.5), bump = 1 + 0.18 * Math.sin(Math.PI * seg(TT, tBay, tBay + 0.8));
  if (fG > 0 && out > 0) {
    const gy = GROUND_Y + 20;
    forceArrow(FW[0] + 30, gy, FW[0] + 30 - 280, gy, { w: 26 * bump, head: 52 * bump, frac: fG, key: 'frgf', al: out });
    forceArrow(RW[0] + 30, gy, RW[0] + 30 - 120, gy, { w: 9, head: 30, frac: fG, key: 'frgr', al: out });
  }
  const fL = ev(tBanh, 0.5);
  if (fL > 0 && out > 0) {
    ST_label('≈ 7/10', 560, GROUND_Y + 100, null, null, { size: 76 * (1 + 0.4 * (bump - 1)), frac: fL, al: out, key: 'frl7' });
    ST_label('≈ 3/10', 70, GROUND_Y + 100, null, null, { size: 66, frac: fL, al: out, key: 'frl3' });
  }
  inkTag('dồn về trước');
};

// =====================================================================
//  10 END — "Lần tới dừng đèn đỏ, hãy nhớ: tốc độ của bạn vừa hóa thành hơi ấm trên đĩa phanh."
//  The hook's street, the bike stopped at a traffic light (ahead, right) that goes RED on "đèn đỏ"; the front disc stays warm,
//  wisps rise; "tốc độ → hơi ấm" points at the disc. After the narration (~54.7 s) it turns green.
// =====================================================================
function ST_light(t, key = 'stl') {
  const px = 905, top = 420, fPole = ev(ET('end') + 0.35, 0.45);
  if (fPole <= 0) return;
  ink([[px, GROUND_Y], [px, top + 200]], { w: 16, color: C.ink, key: key + 'p0', frac: fPole });
  ink([[px, GROUND_Y], [px, top + 200]], { w: 9, color: COL.steelD, key: key + 'p', frac: fPole });
  const s = popS(ET('end') + 0.7);
  if (s <= 0.01) return;
  const tRed = VW('end', 'đèn'), tGreen = 54.7;
  const red = ev(tRed - 0.05, 0.2) * (1 - ev(tGreen, 0.25)), amber = 1 - ev(tRed - 0.05, 0.2), green = ev(tGreen, 0.25);
  ctx.save(); ctx.translate(px, top + 103); ctx.scale(s, s); ctx.translate(-px, -(top + 103));
  paint(rrectPts(px - 36, top, 72, 206, 16), { fill: '#4a423b', key: key + 'h', w: 4, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.3, c: '#000' }] });
  const lamp = (y, on, col, k) => {
    if (on > 0.02) ink(ellipsePts(px, y, 30, 30, 0, 24), { closed: true, w: 12, color: col.replace('A', String(0.35 * on)), key: key + 'g' + k });
    paint(ellipsePts(px, y, 22, 22, 0, 22), { fill: on > 0.5 ? col.replace('A', '1') : '#6b625a', key: key + 'l' + k, w: 3, amt: 0.5 });
  };
  const pulse = 1 - 0.15 * (0.5 + 0.5 * Math.sin(TT * 3));
  lamp(top + 38, red * pulse, 'rgba(226,64,48,A)', 'r');
  lamp(top + 103, amber, 'rgba(240,190,70,A)', 'a');
  lamp(top + 168, green, 'rgba(95,180,90,A)', 'g');
  ctx.restore();
}
SCENES.end = function () {
  paperSheet('end', { ruled: false });
  const bgOff = ST_hookMotion(5.25).x + ST_frontMotion(EE('front')).x;
  ST_backdrop(bgOff, 'stbd');
  ST_road(GROUND_Y, ST_frontMotion(EE('front')).x);
  ST_light(TT);
  const tToc = VW('end', 'tốc'), tAm = VW('end', 'ấm'), tHoi = VW('end', 'hơi');
  const heat = 0.6 + 0.15 * Math.sin(Math.PI * seg(TT, tHoi - 0.1, tAm + 0.9)) + 0.04 * Math.sin(TT * 1.7);
  scooter({ heat, pitch: 0.003 * Math.sin(TT * 2.1), key: 'ensc' });
  const g = Math.sin(Math.PI * seg(TT, tHoi - 0.1, tAm + 0.9));
  if (g > 0) ink(ellipsePts(FW[0], FW[1], DISC_R + 10 + 8 * g, DISC_R + 10 + 8 * g, 0, 32), { closed: true, w: 6, color: `rgba(217,119,87,${0.6 * g})`, key: 'englo' });
  if (TT >= tToc - 0.1) ST_label('tốc độ → hơi ấm', 390, 440, FW[0] + 62, FW[1] - DISC_R - 34, { size: 58, frac: ev(tToc - 0.1, 1.0), key: 'enlb', right: true });
  inkTag('đèn đỏ');
};
