// =====================================================================
//  sc-vuln.js — hook · cve · since · how · impact (scene agent "vuln")
//  Paper: hook, since. Navy: cve, how, impact. The server sits at SRV (s = 1, no shake) at every bridge window.
// =====================================================================

// keyframed server track: keys [[t, x, y, s], ...]; eased between consecutive keys, held outside
function v_track(keys) {
  if (TT <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (TT < b[0]) { const u = EZ.io(seg(TT, a[0], b[0])); return [lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)]; }
  }
  return keys[keys.length - 1].slice(1);
}
// an ink arrow (shaft + head), written on with frac
function v_arrow(x1, y1, x2, y2, o = {}) {
  const f = o.frac ?? 1; if (f <= 0) return;
  const ex = lerp(x1, x2, f), ey = lerp(y1, y2, f), a = Math.atan2(y2 - y1, x2 - x1), hl = o.head ?? 26;
  ink([[x1, y1], [ex, ey]], { w: o.w ?? 5, color: o.c ?? C.ink, key: (o.key ?? 'va') + 's' });
  ink([[ex - Math.cos(a - 0.45) * hl, ey - Math.sin(a - 0.45) * hl], [ex, ey], [ex - Math.cos(a + 0.45) * hl, ey - Math.sin(a + 0.45) * hl]], { w: o.w ?? 5, color: o.c ?? C.ink, key: (o.key ?? 'va') + 'h', amt: 1 });
}
const v_cx = (str, size, weight) => 540 - handW(str, size, weight) / 2;

// ---------------------------------------------------------------- hook (paper): the forgotten HTTP/2 chip
SCENES.hook = function () {
  paperSheet('hook');
  woodSurface(-40, 1022, W + 40, H + 40, 'v_desk');
  ink([[-20, 1022], [W + 20, 1024]], { w: 4, key: 'v_deskedge' });
  const tFlaw = VW('hook', 'lỗ'), tH2 = VW('hook', 'HTTP'), tWho = VW('hook', 'không'), tMay = VW('hook', 'máy');

  // calendar: the years tick 2015 -> 2026 on "suốt mười năm"
  const cs = popS(VW('hook', 'NGINX'));
  if (cs > 0) {
    ctx.save(); ctx.translate(780, 540); ctx.rotate(0.05); ctx.scale(cs, cs);
    paint(rrectPts(-130 + 8, -110 + 10, 260, 250, 14), { fill: 'rgba(58,36,23,0.3)', line: false, key: 'v_calsh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
    paint(rrectPts(-130, -110, 260, 250, 14), { fill: C.cream, key: 'v_cal', w: 3, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.6, per: 80 }] });
    paint(rrectPts(-130, -110, 260, 56, 12), { fill: C.red, key: 'v_calh', w: 3, tex: [{ k: 'hatch', gap: 5, al: 0.3 }] });
    for (const sx of [-70, 70]) ink([[sx, -126], [sx, -92]], { w: 6, key: 'v_calr' + sx });
    const yr = 2015 + Math.floor(11 * seg(TT, VW('hook', 'suốt'), VE('hook', 'năm') + 0.3));
    monoText(String(yr), -82, 22, 60, yr === 2026 ? C.red : C.ink, { key: 'v_yr' + yr });
    if (TT > VE('hook', 'năm') + 0.3) handText('10 năm', -78, 110, 50, C.red, { key: 'v_10y', frac: ev(VE('hook', 'năm') + 0.3, 0.5) });
    ctx.restore();
  }

  // the dusty sticky note nobody reads
  ctx.save(); ctx.translate(706, 770); ctx.rotate(0.07);
  paint(box(0, 0, 220, 190), { fill: C.yellowL, key: 'v_sticky', w: 2.6, tex: [{ k: 'pencil', c: C.yellow, al: 0.5, per: 70 }, { k: 'stipple', c: 'rgba(90,70,50,0.55)', n: 260, s: 2 }] });
  handText('bật từ', 22, 78, 46, C.ink, { key: 'v_stk1' });
  handText('bao giờ?', 22, 140, 46, C.ink, { key: 'v_stk2' });
  ink([[160, 0], [220, 0], [220, 60]], { w: 1.4, color: 'rgba(58,36,23,0.5)', key: 'v_web1' });
  ink([[175, 0], [220, 45]], { w: 1.2, color: 'rgba(58,36,23,0.5)', key: 'v_web2' });
  ink(arcPts(220, 0, 30, Math.PI * 0.5, Math.PI, 8), { w: 1.2, color: 'rgba(58,36,23,0.5)', key: 'v_web3' });
  ctx.restore();
  if (TT >= tWho) {   // question marks drift up on "không ai nhớ"
    for (let i = 0; i < 3; i++) {
      const u = mod(TT - tWho - i * 0.35, 1.2) / 1.2; if (TT - tWho < i * 0.35) continue;
      handText('?', 760 + i * 52, 740 - u * 90, 60, C.ink, { key: 'v_q' + i, al: 1 - u });
    }
  }

  const h2s = 1 + 0.12 * Math.sin(seg(TT, tH2, tH2 + 0.6) * Math.PI);
  serverProp(SRV[0], SRV[1], { state: TT >= tFlaw ? 'vuln' : 'ok', h2: h2s });
  if (TT >= tFlaw && TT < tFlaw + 0.5) burst(SRV[0] + SW / 2 - 40, SRV[1] + SH / 2 - 48, 26, 26 + 50 * ev(tFlaw, 0.3), { c: C.red, w: 4, key: 'v_lampb' });
  planInk(ellipsePts(SRV[0] - SW / 2 + 62, SRV[1] - SH / 2 - 20, 118, 52, -0.04, 40), { closed: true, key: 'v_h2ring', frac: ev(tH2, 0.5) });

  // on the desk: "máy chủ của bạn" with an arrow up to the server
  handText('máy chủ của bạn', v_cx('máy chủ của bạn', 58), 1230, 58, C.ink, { key: 'v_yours', frac: ev(tMay, 0.6) });
  v_arrow(540, 1170, 540, 1060, { frac: ev(tMay + 0.4, 0.3), key: 'v_yarr' });
  inkTag('lỗ hổng 10 năm');
};

// ---------------------------------------------------------------- cve (navy): CVE chip, 0–10 gauge to 9,2
SCENES.cve = function () {
  darkWorld('cve', { dust: 40 });
  const tScore = VW('cve', 'chín'), tChain = VW('cve', 'chuỗi'), tRoot = VW('cve', 'nginx');

  // the big CVE chip
  const cw = monoW(50) * 15 + 40;
  chip('CVE-2026-123007', 540 - cw / 2, 480, C.red, { size: 50, s: popS(E0 + 0.35), dark: true, key: 'v_cvechip' });

  // the note: nginx2root = chain of 5 bugs, and a 5-link chain
  const note = 'nginx2root = chuỗi 5 lỗi';
  handText(note, v_cx(note, 50), 600, 50, C.white, { key: 'v_note', frac: ev(tChain, 0.7) });
  for (let i = 0; i < 5; i++) {
    const t = tChain + 0.25 + i * 0.12; if (TT < t) continue;
    const lx = 540 + (i - 2) * 58, hot = Math.floor((TT - tRoot) * 5) % 6 === i && TT > tRoot;
    ink(ellipsePts(lx, 650, 34 * popS(t), 16 * popS(t), 0, 24), { closed: true, w: hot ? 6 : 4.5, color: i === 0 || hot ? C.red : C.peri, key: 'v_link' + i });
  }

  // gauge: 0..10 (CVSS 4.0), needle sweeps to 9,2 on "chín phẩy hai"
  const gx = 540, gy = 1380, gr = 220;
  const band = [...arcPts(gx, gy, gr, Math.PI * 1.9, Math.PI * 2, 8), ...arcPts(gx, gy, gr - 34, Math.PI * 2, Math.PI * 1.9, 8)];
  paint(band, { fill: C.red, key: 'v_gband', line: C.peri, w: 2, tex: [{ k: 'hatch', gap: 5, al: 0.35, c: '#000' }] });
  ink(arcPts(gx, gy, gr, Math.PI, Math.PI * 2, 40), { w: 5, color: C.peri, key: 'v_garc' });
  for (let v = 0; v <= 10; v++) {
    const a = Math.PI + v / 10 * Math.PI, r0 = v % 5 ? gr - 18 : gr - 30;
    ink([[gx + Math.cos(a) * r0, gy + Math.sin(a) * r0], [gx + Math.cos(a) * gr, gy + Math.sin(a) * gr]], { w: v % 5 ? 2.5 : 4, color: C.peri, key: 'v_gt' + v, amt: 0.6 });
  }
  monoText('0', gx - gr - 40, gy + 12, 34, C.peri, { key: 'v_g0' });
  monoText('10', gx + gr + 8, gy + 12, 34, C.peri, { key: 'v_g10' });
  monoText('5', gx - 9, gy - gr - 14, 34, C.peri, { key: 'v_g5' });
  let val = 0.3 + 0.15 * Math.sin(TT * 6);
  if (TT >= tScore) val = lerp(val, 9.2, EZ.back(seg(TT, tScore, tScore + 0.8))) + (TT > tScore + 0.8 ? 0.07 * Math.sin(TT * 9) : 0);
  val = Math.min(val, 9.9);
  const na = Math.PI + val / 10 * Math.PI;
  ink([[gx, gy], [gx + Math.cos(na) * (gr - 40), gy + Math.sin(na) * (gr - 40)]], { w: 7, color: C.red, key: 'v_needle', amt: 0.8 });
  ctx.fillStyle = C.peri; ctx.beginPath(); ctx.arc(gx, gy, 14, 0, TAU); ctx.fill();
  const sp = popS(VW('cve', 'hai'));
  if (sp > 0) {
    ctx.save(); ctx.translate(gx, gy - 70); ctx.scale(sp, sp);
    monoText('9,2', -84, 0, 84, C.red, { key: 'v_score' });
    monoText('/10', 66, 0, 40, C.peri, { key: 'v_score10' });
    ctx.restore();
  }
  monoText('CVSS 4.0', gx - 66, gy + 54, 30, C.peri, { key: 'v_cvss' });

  serverProp(SRV[0], SRV[1], { state: 'vuln', dark: true });
  inkTag('mức nguy hiểm');
};

// ---------------------------------------------------------------- since (paper): timeline 2015 -> 2026
SCENES.since = function () {
  paperSheet('since');
  const tFrom = VW('since', 'từ'), tAll = VW('since', 'mọi'), tFix = VW('since', 'vá'), tDate = VW('since', 'ngày');
  const X0 = 110, X1 = 905, YT = 545;
  const xAt = (y) => X0 + (y - 2015.72) / (2026.88 - 2015.72) * (X1 - X0);

  handText('22/9/2015', 90, 480, 52, C.ink, { key: 'v_d0', frac: ev(tFrom, 0.5) });
  if (TT >= tDate) { const s = '18/11/2026'; handText(s, 930 - handW(s, 52), 480, 52, C.green, { key: 'v_d1', frac: ev(tDate, 0.6) }); }
  ink([[X0 - 20, YT], [X1 + 20, YT]], { w: 4, key: 'v_tl' });
  for (let y = 2016; y <= 2026; y++) ink([[xAt(y), YT - 12], [xAt(y), YT + 12]], { w: 2.5, key: 'v_tk' + y, amt: 0.6 });
  // the red bar: every version is affected, until the fix
  const bf = EZ.o2(seg(TT, tAll - 0.1, tFix - 0.1));
  if (bf > 0) paint(rrectPts(X0, YT - 13, Math.max(8, (X1 - X0) * bf), 26, 10), { fill: C.red, key: 'v_bar', w: 2.5, tex: [{ k: 'hatch', gap: 5, al: 0.35 }] });
  const fx = X0 + (X1 - X0) * bf;
  if (bf > 0 && bf < 1) burst(fx, YT, 18, 34, { c: C.red, w: 3, n: 8, key: 'v_barb' });
  if (TT >= tFix) {   // the fix lands at the end of the line
    const s = popS(tFix);
    paint(ellipsePts(X1, YT, 26 * s, 26 * s, 0, 24), { fill: C.green, key: 'v_fixdot', w: 3, tex: [{ k: 'hatch', gap: 4, al: 0.35 }] });
  }

  // affected range: red chips
  chip('1.9.5', 90, 670, C.red, { s: popS(VW('since', 'hai')), key: 'v_c0' });
  const aw = ev(tAll + 0.3, 0.3);
  if (aw > 0) v_arrow(255, 660, 335, 660, { frac: aw, key: 'v_carr', w: 4, head: 18 });
  chip('1.31.8', 350, 670, C.red, { s: popS(VW('since', 'dính')), key: 'v_c1' });
  if (TT >= VW('since', 'dính')) handText('đều dính', 560, 680, 52, C.red, { key: 'v_dinh', frac: ev(VW('since', 'dính'), 0.5) });

  // the fix: green chips (mainline / stable), 18/11
  handText('bản vá 18/11', 90, 1130, 56, C.green, { key: 'v_fixl', frac: ev(tFix, 0.6) });
  chip('1.31.9', 90, 1240, C.green, { s: popS(tDate), key: 'v_g0' });
  chip('1.30.7', 420, 1240, C.green, { s: popS(VW('since', 'mười', 2)), key: 'v_g1' });
  if (TT >= tDate + 0.3) monoText('mainline', 100, 1320, 30, C.ink, { key: 'v_ml', count: Math.floor(ev(tDate + 0.3, 0.3) * 8) });
  if (TT >= VW('since', 'mười', 2) + 0.3) monoText('stable', 430, 1320, 30, C.ink, { key: 'v_st', count: Math.floor(ev(VW('since', 'mười', 2) + 0.3, 0.3) * 6) });

  serverProp(SRV[0], SRV[1], { state: 'vuln' });
  inkTag('từ 2015');
};

// ---------------------------------------------------------------- how (navy): frames in, window miscounted, heap overflows
SCENES.how = function () {
  darkWorld('how', { dust: 40 });
  const tFlow = VW('how', 'lưu'), tH2 = VW('how', 'HTTP'), tWin = VW('how', 'cửa'), tWrong = VW('how', 'tính'), tSpill = VW('how', 'tràn');
  const shake = TT > tSpill && TT < tSpill + 0.6 ? 0.6 : 0;

  // flow-control window bar with its maximum
  handText('cửa sổ luồng', 90, 470, 50, C.white, { key: 'v_winl', frac: ev(tWin - 0.2, 0.5) });
  handText('tối đa', 690, 470, 46, C.peri, { key: 'v_max' });
  const bx = 90, bw = 810, lim = 0.74;
  paint(rrectPts(bx, 505, bw, 60, 12), { fill: C.navy2, key: 'v_winbox', line: C.peri, w: 3, tex: [{ k: 'hatch', gap: 7, al: 0.2, c: C.periD }] });
  let fill = 0.12;
  if (TT >= tFlow) fill = 0.22 + 0.26 * (0.5 + 0.5 * Math.sin((TT - tFlow) * 5.2));
  if (TT >= tWrong - 0.3) fill = lerp(fill, 1.0, EZ.o2(seg(TT, tWrong - 0.3, tWrong + 0.4))) + (TT > tWrong + 0.4 ? 0.012 * Math.sin(TT * 14) : 0);
  fill = Math.min(fill, 0.995);
  const fw = bw * Math.min(fill, lim);
  paint(rrectPts(bx + 6, 511, fw - 6, 48, 8), { fill: C.cyan, key: 'v_winf', line: false, tex: [{ k: 'hatch', gap: 5, al: 0.3, c: '#0c3' }] });
  if (fill > lim) paint(rrectPts(bx + bw * lim, 511, bw * (fill - lim), 48, 8), { fill: C.red, key: 'v_winr', line: false, tex: [{ k: 'hatch', gap: 5, al: 0.35, c: '#000' }] });
  ctx.save(); ctx.setLineDash([10, 8]); ink([[bx + bw * lim, 488], [bx + bw * lim, 585]], { w: 4, color: C.yellow, key: 'v_limln' }); ctx.restore();
  if (TT >= tWrong) handText('tính sai!', 640, 650, 54, C.red, { key: 'v_wrong', frac: ev(tWrong, 0.4) });

  // HTTP/2 traffic: frames flow INTO the server from the left
  chip('HTTP/2', 80, 770, C.yellow, { s: popS(tH2), tc: C.ink, dark: true, key: 'v_h2' });
  if (TT >= tFlow) {
    v_arrow(90, 950, 380, 950, { frac: ev(tFlow, 0.4), c: C.peri, key: 'v_flowarr', w: 4, head: 22 });
    for (let i = 0; i < 8; i++) {
      const x = -130 + ((TT - tFlow) * 240 - i * 165);
      if (x < -130 || x > 420) continue;
      paint(rrectPts(x, 832, 112, 56, 10), { fill: C.yellow, key: 'v_fr' + i, line: C.ink, w: 2.5, tex: [{ k: 'hatch', gap: 5, al: 0.25 }] });
      monoText('DATA', x + 20, 870, 30, C.ink, { key: 'v_frt' + i });
    }
  }

  // the heap box: cells fill, then overflow spills OUT over the wall
  const hx = 130, hy = 1150, hw = 460, hh = 250;
  ctx.save(); ctx.setLineDash([6, 10]); ink([[520, 1020], [430, 1150]], { w: 2.5, color: C.periD, key: 'v_hlink' }); ctx.restore();
  paint(rrectPts(hx, hy, hw, hh, 14), { fill: C.navy2, key: 'v_heap', line: C.peri, w: 4, tex: [{ k: 'hatch', gap: 8, al: 0.2, c: C.periD }] });
  monoText('heap', hx + 18, hy + 42, 34, C.peri, { key: 'v_heapl' });
  const nFill = TT < tFlow ? 0 : Math.floor(lerp(0, 14, seg(TT, tFlow + 0.4, tWrong)) + (TT >= tWrong ? lerp(0, 4, seg(TT, tWrong, tSpill)) : 0));
  for (let i = 0; i < 18; i++) {
    if (i >= nFill) break;
    const c = i % 6, r = 2 - Math.floor(i / 6), x = hx + 18 + c * 72, y = hy + 62 + r * 60;
    const red = i >= 14;
    paint(rrectPts(x, y, 64, 50, 6), { fill: red ? C.red : C.cyan, key: 'v_cell' + i, line: red ? C.white : C.navy, w: 2, tex: [{ k: 'hatch', gap: 5, al: 0.3, c: '#000' }] });
  }
  if (TT >= tSpill) {   // red blocks pour over the top-right wall and fall outside the box
    handText('tràn heap', 620, 1110, 56, C.red, { key: 'v_spilll', frac: ev(tSpill, 0.5) });
    for (let i = 0; i < 10; i++) {
      const t0 = tSpill + i * 0.16; if (TT < t0) continue;
      const R = RNG('v_spill', i), vx = R.r(150, 330), vy = -R.r(120, 260), dt = TT - t0;
      const floor = 1400 - 25 - (i % 3) * 0;
      let x = hx + hw - 40 + vx * dt, y = hy + 20 + vy * dt + 700 * dt * dt;
      const landT = (-vy + Math.sqrt(vy * vy + 4 * 700 * (floor - hy - 20))) / (2 * 700);
      let rot = dt * R.r(4, 8);
      if (dt >= landT) { x = hx + hw - 40 + vx * landT; y = floor; rot = landT * 6; }
      x = Math.min(x, 880);
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      paint(rrectPts(-26, -21, 52, 42, 6), { fill: C.red, key: 'v_sp' + i, line: C.white, w: 2, tex: [{ k: 'hatch', gap: 5, al: 0.3, c: '#000' }] });
      ctx.restore();
    }
  }

  serverProp(SRV[0], SRV[1], { state: 'vuln', dark: true, shake });
  inkTag('cơ chế');
};

// ---------------------------------------------------------------- impact (navy): worker crashes; ASLR cracks; code runs; no login
SCENES.impact = function () {
  darkWorld('impact', { dust: 40 });
  const tCrash = VW('impact', 'sập'), tAslr = VW('impact', 'ASLR'), tPast = VW('impact', 'vượt'), tAtk = VW('impact', 'kẻ');
  const tRun = VW('impact', 'chạy'), tNo = VW('impact', 'mà'), t1 = EE('impact');
  const [sx, sy, ss] = v_track([[E0 + 0.5, SRV[0], SRV[1], 1], [tCrash + 0.75, SRV[0], SRV[1], 1], [tPast + 0.1, 790, 560, 0.5], [tNo + 0.35, 790, 560, 0.5], [t1 - 0.55, SRV[0], SRV[1], 1]]);

  // 1) the worker falls over
  const wOut = 1 - EZ.i2(seg(TT, tPast - 0.35, tPast - 0.05));
  if (wOut > 0) {
    ink([[80, 1022], [400, 1022]], { w: 3, color: C.periD, key: 'v_floor' });
    ctx.save(); ctx.setLineDash([8, 8]); if (TT < tCrash) ink([[362, 900], [408, 900]], { w: 3, color: C.peri, key: 'v_wl' }); ctx.restore();
    const fall = TT < tCrash ? Math.sin(TT * 4) * 0.03 : -Math.PI / 2 * EZ.back(seg(TT, tCrash, tCrash + 0.35));
    ctx.save(); ctx.translate(240, 1020); ctx.rotate(fall); ctx.scale(wOut, wOut);
    paint(rrectPts(0, -180, 120, 180, 16), { fill: C.navy2, key: 'v_worker', line: C.peri, w: 4, tex: [{ k: 'cross', gap: 8, al: 0.25, c: C.periD }] });
    if (TT < tCrash) { ctx.fillStyle = C.white; for (const ex of [38, 82]) { ctx.beginPath(); ctx.arc(ex, -128, 8, 0, TAU); ctx.fill(); } }
    else for (const ex of [38, 82]) { ink([[ex - 9, -137], [ex + 9, -119]], { w: 4, color: C.red, key: 'v_x1' + ex }); ink([[ex + 9, -137], [ex - 9, -119]], { w: 4, color: C.red, key: 'v_x2' + ex }); }
    monoText('worker', 10, -40, 30, C.white, { key: 'v_wt' });
    ctx.restore();
    if (TT >= tCrash + 0.25) {
      if (TT < tCrash + 0.7) burst(150, 1000, 40, 40 + 60 * ev(tCrash + 0.25, 0.3), { c: C.red, w: 4, key: 'v_crb' });
      handText('sập!', 90, 860, 62, C.red, { key: 'v_sap', frac: ev(tCrash + 0.25, 0.3) });
    }
  }

  // 2) ASLR shield takes hits, cracks, splits
  const shS = popS(tPast), split = EZ.i2(seg(TT, tAslr + 0.6, tAtk + 0.3));
  if (shS > 0 && split < 1) {
    const cx = 480, cy = 900;
    const P = [[cx - 170, cy - 200], [cx + 170, cy - 200], [cx + 170, cy + 10], [cx + 120, cy + 120], [cx, cy + 220], [cx - 120, cy + 120], [cx - 170, cy + 10]];
    const crack = [[cx, cy - 210], [cx - 22, cy - 120], [cx + 18, cy - 40], [cx - 16, cy + 50], [cx + 14, cy + 140], [cx, cy + 230]];
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(cx, cy); ctx.scale(shS, shS); ctx.translate(-cx, -cy);
      ctx.translate(side * 260 * split, 700 * split * split); ctx.rotate(side * 0.5 * split);
      ctx.beginPath(); const edge = side < 0 ? -400 : 400;
      ctx.moveTo(cx + edge, cy - 300); crack.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(cx + edge, cy + 300); ctx.closePath(); ctx.clip();
      paint(resample(P, true, 30), { fill: C.navy2, key: 'v_shield', line: C.peri, w: 5, tex: [{ k: 'cross', gap: 7, al: 0.3, c: C.periD, dens: (px, py) => clamp((px - cx + py - cy) / 300 + 0.6) }] });
      handText('ASLR', cx - handW('ASLR', 96, 700) / 2, cy + 20, 96, C.white, { key: 'v_aslr', weight: 700 });
      ctx.restore();
    }
    const cf = ev(tAslr, 0.35);
    if (cf > 0 && split <= 0) ink(crack, { w: 5, color: C.red, key: 'v_crack', frac: cf });
  }
  // the attack: a red arrow from outside hits the shield, then goes on to the server
  if (TT >= tPast + 0.1 && TT < tRun - 0.1) {
    v_arrow(90, 1400, 330, 1100, { frac: ev(tPast + 0.1, 0.3), c: C.red, key: 'v_atk1', w: 6 });
    const hit = (TT - tPast - 0.4) % 0.5;
    if (TT > tPast + 0.4 && split <= 0 && hit < 0.2) burst(340, 1090, 16, 44, { c: C.red, w: 3, n: 9, key: 'v_hit' });
    if (split > 0.3) v_arrow(340, 1090, sx - SW * ss / 2 - 10, sy + SH * ss / 2 + 10, { frac: ev(tAslr + 1.1, 0.4), c: C.red, key: 'v_atk2', w: 6 });
  }

  // 3) code runs (red cursor) — slides off before the login card
  const termOut = EZ.i2(seg(TT, tNo + 0.3, tNo + 0.65));
  if (TT >= tRun - 0.15 && termOut < 0.98) {
    ctx.save(); ctx.translate(480, 880); ctx.scale(1 - termOut, 1 - termOut); ctx.translate(-480, -880);
    const h = termCard(100, 780, 760, [{ s: '$ ./payload', c: C.red }], { t0: tRun, cps: 20, key: 'v_term' });
    const typed = seg(TT, tRun, tRun + 11 / 20);
    if (Math.floor(TT * 4) % 2 === 0 || typed < 1) { ctx.fillStyle = C.red; ctx.fillRect(128 + monoW(34) * Math.floor(typed * 11) + 4, 780 + 70 - 20, 20, 34); }
    handText('chạy mã trên máy chủ', 100, 780 + h + 75, 52, C.red, { key: 'v_run', frac: ev(tRun + 0.25, 0.5) });
    ctx.restore();
  }

  // 4) no login needed: a login form, crossed out
  const lg = popS(tNo - 0.05);
  if (lg > 0) {
    ctx.save(); ctx.translate(540, 1210); ctx.scale(lg, lg);
    paint(rrectPts(-230 + 8, -120 + 10, 460, 240, 16), { fill: 'rgba(0,0,0,0.35)', line: false, key: 'v_lgsh' });
    paint(rrectPts(-230, -120, 460, 240, 16), { fill: C.cream, key: 'v_lg', line: C.peri, w: 3, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.5, per: 80 }] });
    handText('đăng nhập', -200, -62, 46, C.ink, { key: 'v_lgt' });
    for (let i = 0; i < 2; i++) paint(rrectPts(-200, -30 + i * 64, 400, 48, 8), { fill: '#fffaf0', key: 'v_lgf' + i, w: 2.5, tex: [{ k: 'hatch', gap: 6, al: 0.15 }] });
    const xf = ev(tNo + 0.35, 0.25), xf2 = ev(tNo + 0.55, 0.25);
    if (xf > 0) ink([[-200, -100], [200, 100]], { w: 9, color: C.red, key: 'v_lx1', frac: xf });
    if (xf2 > 0) ink([[200, -100], [-200, 100]], { w: 9, color: C.red, key: 'v_lx2', frac: xf2 });
    ctx.restore();
    const s = 'không cần đăng nhập';
    handText(s, v_cx(s, 56), 1420, 56, C.white, { key: 'v_nolog', frac: ev(tNo + 0.4, 0.5) });
  }

  serverProp(sx, sy, { state: 'vuln', dark: true, s: ss });
  inkTag('hậu quả');
};
