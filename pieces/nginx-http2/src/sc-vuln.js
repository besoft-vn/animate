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
  const tFlaw = VW('hook', 'lỗ'), tNg = VW('hook', 'NGINX'), tSu = VW('hook', 'suốt'), tH2 = VW('hook', 'HTTP'), tBat = VW('hook', 'bật');
  const tWho = VW('hook', 'không'), tMay = VW('hook', 'máy'), t1 = EE('hook');
  const lampX = SRV[0] + SW / 2 - 40, lampY = SRV[1] + SH / 2 - 48;

  // the calendar (top left): pages flip 2015 -> 2026 on "suốt mười năm"
  const cs = popS(tNg);
  if (cs > 0) {
    const fl0 = tSu, fl1 = tSu + 1.65, n = 11;
    const k = TT < fl0 ? 0 : Math.min(n, Math.floor(n * seg(TT, fl0, fl1) + 1e-6)), u = TT < fl0 || k >= n ? 1 : mod(n * seg(TT, fl0, fl1), 1);
    const cover = k < n ? 236 * (1 - EZ.i2(u)) : 0;   // how far the tearing page still hangs down
    const page = (yr, key, txt) => {
      paint(rrectPts(-160, -66, 320, 236, 10), { fill: C.cream, key: 'v_pg' + key, w: 3, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.6, per: 80 }] });
      if (txt) monoText(String(yr), -96, 50, 80, yr === 2026 ? C.red : C.ink, { key: 'v_yr' + yr });
    };
    ctx.save(); ctx.translate(228, 548); ctx.rotate(-0.04); ctx.scale(cs * 0.82, cs * 0.82);
    paint(rrectPts(-160 + 10, -130 + 12, 320, 300, 14), { fill: 'rgba(58,36,23,0.3)', line: false, key: 'v_calsh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
    page(2015 + (k < n ? k + 1 : n), 'n', cover < 40);                     // the page underneath (next year)
    if (k < n) {                                                // the current page tears off upward from the binding
      ctx.save(); ctx.translate(0, -66); ctx.scale(1, 1 - EZ.i2(u)); ctx.translate(0, 66);
      page(2015 + k, 'c', cover > 165);
      ctx.restore();
    }
    if (TT > fl1) handText('10 năm', -84, 150, 58, C.red, { key: 'v_10y', frac: ev(fl1, 0.5) });
    paint(rrectPts(-160, -130, 320, 66, 12), { fill: C.red, key: 'v_calh', w: 3, tex: [{ k: 'hatch', gap: 5, al: 0.3 }] });
    for (const sx of [-80, 80]) ink([[sx, -148], [sx, -110]], { w: 6, key: 'v_calr' + sx });
    ctx.restore();
  }

  // "lỗ hổng" (top right) with an arrow down to the red lamp
  const lw = handW('lỗ hổng', 76);
  handText('lỗ hổng', 900 - lw, 560, 76, C.red, { key: 'v_flaw', frac: ev(tFlaw, 0.5) });
  v_arrow(790, 600, lampX + 70, lampY - 40, { frac: ev(tFlaw + 0.45, 0.4), c: C.red, key: 'v_flarr', w: 6, head: 30 });

  // the dusty sticky note nobody reads (on the desk)
  ctx.save(); ctx.translate(610, 1080); ctx.rotate(0.06 + (TT > tWho ? 0.05 * Math.sin((TT - tWho) * 5) * Math.exp(-(TT - tWho) * 1.5) : 0));
  paint(box(0, 0, 300, 250), { fill: C.yellowL, key: 'v_sticky', w: 2.6, tex: [{ k: 'pencil', c: C.yellow, al: 0.5, per: 70 }, { k: 'stipple', c: 'rgba(90,70,50,0.55)', n: 320, s: 2 }] });
  handText('bật từ', 30, 100, 58, C.ink, { key: 'v_stk1' });
  handText('bao giờ?', 30, 180, 58, C.ink, { key: 'v_stk2' });
  ink([[220, 0], [300, 0], [300, 80]], { w: 1.4, color: 'rgba(58,36,23,0.5)', key: 'v_web1' });
  ink([[240, 0], [300, 60]], { w: 1.2, color: 'rgba(58,36,23,0.5)', key: 'v_web2' });
  ink(arcPts(300, 0, 40, Math.PI * 0.5, Math.PI, 8), { w: 1.2, color: 'rgba(58,36,23,0.5)', key: 'v_web3' });
  ctx.restore();
  if (TT >= tWho && TT < t1 - 0.4) {   // big question marks rise from the note on "không ai nhớ"
    for (let i = 0; i < 3; i++) {
      if (TT - tWho < i * 0.3) continue;
      const u = mod(TT - tWho - i * 0.3, 1.1) / 1.1;
      handText('?', 730 + i * 80, 1060 - u * 170, 100, C.ink, { key: 'v_q' + i, al: (1 - u) * (1 - seg(TT, t1 - 0.8, t1 - 0.4)) });
    }
  }

  // the server; the HTTP/2 chip swells and glints on "đang bật HTTP hai"
  const hp = seg(TT, tBat, t1 - 0.6);
  const h2s = 1 + (hp > 0 && hp < 1 ? 0.32 * Math.abs(Math.sin((TT - tBat) * 3.4)) * (1 - EZ.i2(seg(TT, t1 - 1.0, t1 - 0.6))) : 0);
  serverProp(SRV[0], SRV[1], { state: TT >= tFlaw ? 'vuln' : 'ok', h2: h2s });
  if (hp > 0 && hp < 1) {
    const cx0 = SRV[0] - SW / 2 - 10, cy0 = SRV[1] - SH / 2 - 20;
    ctx.save(); ctx.translate(cx0, cy0); ctx.scale(h2s, h2s);
    ctx.beginPath(); ctx.roundRect(0, -28, 150, 56, 28); ctx.clip();
    const gx = -80 + mod((TT - tBat) * 300, 330);
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.moveTo(gx, -30); ctx.lineTo(gx + 34, -30); ctx.lineTo(gx + 10, 30); ctx.lineTo(gx - 24, 30); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  planInk(ellipsePts(SRV[0] - SW / 2 + 70, SRV[1] - SH / 2 - 20, 140 * (h2s * 0.5 + 0.5), 62, -0.04, 40), { closed: true, key: 'v_h2ring', frac: ev(tH2, 0.5) });
  // the lamp: a red halo that keeps pulsing outward once the flaw is named
  if (TT >= tFlaw && TT < t1 - 0.5) {
    const fade = 1 - seg(TT, t1 - 0.9, t1 - 0.5);
    for (let j = 0; j < 2; j++) {
      const u = mod(TT - tFlaw - j * 0.6, 1.2) / 1.2; if (TT - tFlaw < j * 0.6) continue;
      ctx.save(); ctx.globalAlpha = 0.42 * (1 - u) * fade; ctx.fillStyle = C.red;
      ctx.beginPath(); ctx.arc(lampX, lampY, 22 + 120 * EZ.o2(u), 0, TAU); ctx.fill(); ctx.restore();
    }
  }

  // on the desk: "máy chủ của bạn" with an arrow up to the server
  handText('máy chủ', 70, 1190, 72, C.ink, { key: 'v_yours1', frac: ev(tMay, 0.4) });
  handText('của bạn', 70, 1280, 72, C.ink, { key: 'v_yours2', frac: ev(tMay + 0.35, 0.4) });
  v_arrow(250, 1110, 390, 990, { frac: ev(tMay + 0.6, 0.3), key: 'v_yarr', w: 6 });
  inkTag('lỗ hổng 10 năm');
};

// ---------------------------------------------------------------- cve (navy): CVE chip, 0–10 gauge to 9,2, chain of 5
// the gauge drawn around (0,0) at radius 300; sc < 0.6 hides the small labels
function v_gauge(gx, gy, sc, o) {
  const R = 300;
  ctx.save(); ctx.translate(gx, gy); ctx.scale(sc, sc);
  const gp = o.grow;
  // the swept wedge (0 -> needle): a red danger fill that breathes
  const na = Math.PI + o.val / 10 * Math.PI;
  if (o.val > 0.4) {
    const P = [...arcPts(0, 0, R - 30, Math.PI, na, 40), ...arcPts(0, 0, R - 100, na, Math.PI, 40)];
    paint(P, { fill: C.red, fillAl: o.wedgeA, key: 'v_wedge', line: false, tex: [{ k: 'hatch', gap: 6, al: 0.35, c: '#000' }] });
  }
  ink(arcPts(0, 0, R, Math.PI, Math.PI + Math.PI * gp, 40), { w: 6, color: C.peri, key: 'v_garc' });
  for (let v = 0; v <= 10; v++) {
    if (gp < v / 10) break;
    const a = Math.PI + v / 10 * Math.PI, r0 = v % 5 ? R - 24 : R - 42;
    ink([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * R, Math.sin(a) * R]], { w: v % 5 ? 3 : 5, color: C.peri, key: 'v_gt' + v, amt: 0.6 });
  }
  if (sc > 0.6) {
    if (gp > 0.02) monoText('0', -R - 46, 14, 44, C.peri, { key: 'v_g0' });
    if (gp > 0.5) monoText('5', -12, -R - 18, 44, C.peri, { key: 'v_g5' });
    if (gp >= 1) monoText('10', R + 10, 14, 44, C.peri, { key: 'v_g10' });
  }
  ink([[0, 0], [Math.cos(na) * (R - 50), Math.sin(na) * (R - 50)]], { w: 9, color: C.red, key: 'v_needle', amt: 0.8 });
  ctx.fillStyle = C.peri; ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fill();
  if (o.sp > 0) {
    ctx.save(); ctx.translate(-40, 130); ctx.scale(o.sp, o.sp);
    monoText('9,2', -105, 0, 120, C.red, { key: 'v_score' });
    ctx.restore();
  }
  if (o.s10 > 0) { ctx.save(); ctx.translate(76, 130); ctx.scale(o.s10, o.s10); monoText('/10', 0, 0, 64, C.peri, { key: 'v_score10' }); ctx.restore(); }
  if (o.cvss > 0 && sc > 0.6) monoText('CVSS 4.0', -106, -80, 48, C.peri, { key: 'v_cvss', count: Math.floor(o.cvss * 8) });
  ctx.restore();
}
SCENES.cve = function () {
  darkWorld('cve', { dust: 40 });
  const tScore = VW('cve', 'chín'), tHai = VW('cve', 'hai'), tTren = VW('cve', 'trên'), tMuoi = VW('cve', 'mười'), tNam = VW('cve', 'nằm');
  const tChain = VW('cve', 'chuỗi'), tName = VW('cve', 'các'), tRoot = VW('cve', 'nginx'), tRoot2 = VW('cve', 'root'), t1 = EE('cve');
  // the server steps aside (top right) to make room, and is back at SRV before the bridge
  const [sx, sy, ss] = v_track([[E0 + 0.5, SRV[0], SRV[1], 1], [E0 + 1.3, 846, 480, 0.66], [t1 - 1.45, 846, 480, 0.66], [t1 - 0.55, SRV[0], SRV[1], 1]]);

  // the big CVE chip
  chip('CVE-2026-123007', 80, 482, C.red, { size: 54, s: popS(E0 + 0.35), dark: true, key: 'v_cvechip' });

  // gauge: grows in the middle, needle sweeps to 9,2; at the end it swaps places with the server
  const sw = EZ.io(seg(TT, t1 - 1.45, t1 - 0.55));
  const gg = EZ.o3(seg(TT, E0 + 0.8, E0 + 1.4));
  if (gg > 0) {
    let val = 0.3 + 0.15 * Math.sin(TT * 6);
    if (TT >= tScore) val = lerp(val, 9.2, EZ.back(seg(TT, tScore, tScore + 0.8))) + (TT > tScore + 0.8 ? 0.06 * Math.sin(TT * 9) : 0);
    val = Math.min(val, 9.9);
    const wedgeA = TT < tScore ? 0.5 : 0.35 + 0.6 * (0.5 + 0.5 * Math.sin((TT - tScore) * 3.2));
    v_gauge(lerp(540, 820, sw), lerp(930, 560, sw), gg * lerp(1, 0.38, sw), {
      grow: seg(TT, E0 + 0.9, tScore - 0.1), val, wedgeA, sp: popS(tHai), s10: popS(tTren), cvss: ev(tMuoi + 0.1, 0.5),
    });
  }

  // the chain: 5 links pop on "nằm trong", light on "chuỗi"; a red pulse runs nginx -> root
  const LY = 1215;
  for (let i = 0; i < 5; i++) {
    const t = tNam + i * 0.12; if (TT < t) continue;
    const lx = 540 + (i - 2) * 112, p = popS(t), lit = TT > tChain + 0.1 + i * 0.1;
    const hot = TT > tRoot && Math.floor((TT - tRoot) * 6) % 7 === i;
    ink(ellipsePts(lx, LY, 66 * p, (i % 2 ? 24 : 38) * p, 0, 28), { closed: true, w: hot ? 9 : 6, color: lit ? (hot ? C.yellow : C.red) : C.peri, key: 'v_link' + i });
  }
  if (TT >= tRoot) monoText('nginx', 70, LY + 14, 42, C.peri, { key: 'v_lkn', count: Math.floor(ev(tRoot, 0.3) * 5) });
  if (TT >= tRoot2) monoText('root', 846, LY + 14, 42, C.red, { key: 'v_lkr', count: Math.floor(ev(tRoot2, 0.25) * 4) });
  const n1 = 'chuỗi 5 lỗi';
  handText(n1, v_cx(n1, 64), 1345, 64, C.white, { key: 'v_note', frac: ev(tChain, 0.6) });
  if (TT >= tName) {
    const nm = '"nginx2root"', fs = 62;
    monoText(nm, 540 - monoW(fs) * nm.length / 2, 1440, fs, C.yellow, { key: 'v_name', count: Math.floor(seg(TT, tName, tRoot) * nm.length + 1) });
  }

  serverProp(sx, sy, { state: 'vuln', dark: true, s: ss });
  inkTag('mức nguy hiểm');
};

// ---------------------------------------------------------------- since (paper): timeline 2015 -> 2026
SCENES.since = function () {
  paperSheet('since');
  const tFrom = VW('since', 'từ'), tNam = VW('since', 'năm'), tHai = VW('since', 'hai'), tVa = VW('since', 'và'), tAll = VW('since', 'mọi');
  const tDinh = VW('since', 'dính'), tFix = VW('since', 'vá'), tDate = VW('since', 'ngày'), tM2 = VW('since', 'mười', 2);
  const X0 = 120, X1 = 900, YT = 560;

  // dates above the line
  handText('22/9/2015', 70, 470, 60, C.ink, { key: 'v_d0', frac: ev(tFrom, 0.5) });
  if (TT >= tDate) { const s = '18/11/2026'; handText(s, 915 - handW(s, 60), 470, 60, C.green, { key: 'v_d1', frac: ev(tDate, 0.6) }); }
  ink([[X0 - 20, YT], [X1 + 20, YT]], { w: 5, key: 'v_tl' });
  for (let i = 1; i <= 11; i++) { const x = X0 + (i - 0.72) / 11.16 * (X1 - X0); ink([[x, YT - 14], [x, YT + 14]], { w: 3, key: 'v_tk' + i, amt: 0.6 }); }
  // a red pin drops on the start: 22/9/2015
  if (TT >= tFrom) {
    const py = lerp(380, YT - 34, EZ.back(seg(TT, tFrom, tFrom + 0.45)));
    ink([[X0, py], [X0, py + 34]], { w: 4, key: 'v_pinl' });
    paint(ellipsePts(X0, py, 20, 20, 0, 20), { fill: C.red, key: 'v_pin', w: 3, tex: [{ k: 'hatch', gap: 4, al: 0.35 }] });
  }
  // the red bar: every version is affected, until the fix; a marker shows the year travelling with it
  const bf = EZ.io(seg(TT, tVa, tFix - 0.1));
  if (bf > 0) {
    const fx = X0 + (X1 - X0) * bf;
    paint(rrectPts(X0, YT - 16, Math.max(10, fx - X0), 32, 12), { fill: C.red, key: 'v_bar', w: 2.5, tex: [{ k: 'hatch', gap: 5, al: 0.35 }] });
    if (TT < tFix + 0.2) paint([[fx - 22, YT - 62], [fx + 22, YT - 62], [fx, YT - 26]], { fill: C.red, key: 'v_mk', w: 3, closed: true });
    const yr = String(Math.min(2026, Math.floor(2015.72 + bf * 11.16))), yw = monoW(46) * 4;
    monoText(yr, clamp(fx - yw / 2, 64, 915 - yw), YT + 72, 46, yr === '2026' ? C.red : C.ink, { key: 'v_myr' + yr });
  }
  if (TT >= tFix) { const s = popS(tFix); paint(ellipsePts(X1, YT, 30 * s, 30 * s, 0, 24), { fill: C.green, key: 'v_fixdot', w: 3, tex: [{ k: 'hatch', gap: 4, al: 0.35 }] }); }

  // affected range (left column): 1.9.5 ... 1.31.8 in red
  if (TT >= tHai) v_arrow(X0, YT + 110, 140, 728, { frac: ev(tHai, 0.3), key: 'v_parr', w: 4, head: 18 });
  chip('1.9.5', 70, 800, C.red, { size: 54, s: popS(tHai + 0.2), key: 'v_c0' });
  if (TT >= tAll) {
    v_arrow(150, 860, 150, 950, { frac: ev(tAll, 0.4), key: 'v_carr', w: 5, head: 20 });
    handText('…', 200, 920, 64, C.red, { key: 'v_dots', frac: ev(tAll + 0.2, 0.3) });
  }
  chip('1.31.8', 70, 1030, C.red, { size: 54, s: popS(tAll + 0.45), key: 'v_c1' });
  // right column: "mọi bản / đều dính"
  { const s1 = 'mọi bản', s2 = 'đều dính';
    handText(s1, 915 - handW(s1, 58), 840, 58, C.red, { key: 'v_moi', frac: ev(tAll, 0.5) });
    handText(s2, 915 - handW(s2, 58), 930, 58, C.red, { key: 'v_dinh', frac: ev(tDinh, 0.5) }); }

  // the fix (bottom): green chips, mainline / stable, 18/11
  handText('bản vá 18/11', 70, 1180, 70, C.green, { key: 'v_fixl', frac: ev(tFix, 0.6) });
  chip('1.31.9', 70, 1300, C.green, { size: 56, s: popS(tDate), key: 'v_g0' });
  chip('1.30.7', 540, 1300, C.green, { size: 56, s: popS(tM2), key: 'v_g1' });
  if (TT >= tDate + 0.3) monoText('mainline', 80, 1400, 44, C.ink, { key: 'v_ml', count: Math.floor(ev(tDate + 0.3, 0.35) * 8) });
  if (TT >= tM2 + 0.3) monoText('stable', 550, 1400, 44, C.ink, { key: 'v_st', count: Math.floor(ev(tM2 + 0.3, 0.3) * 6) });

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
