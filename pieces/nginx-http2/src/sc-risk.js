// =====================================================================
//  SCENES risk · root · barrier · check · version — nginx-http2 (one agent's file; globals prefixed r_)
//  risk / root / barrier: navy (inside the server). check / version: paper (the ops team's checks).
//  Bridges at ET(risk), ET(barrier), ET(check), ET(version), EE(version): the server sits at SRV, s = 1.
//  "root" opens on the hard cut (SLAM): complete on its first frame.
// =====================================================================
// ---- helpers
const r_io = (t, a, b) => EZ.io(seg(TT, a, b));
// an arrow: a sketchy path written on (frac) with a head at its current tip
function r_arrow(P, o = {}) {
  const frac = o.frac ?? 1; if (frac <= 0) return;
  const Q = resample(P, false, 8), S = subPath(Q, frac);
  if (o.dash) { ctx.save(); ctx.setLineDash(o.dash); }
  ink(S, { w: o.w ?? 5, color: o.c ?? C.ink, key: o.key ?? 'arr', amt: 1.4 });
  if (o.dash) ctx.restore();
  if (S.length < 2) return;
  const a = S[S.length - 1], b = S[Math.max(0, S.length - 3)], ang = Math.atan2(a[1] - b[1], a[0] - b[0]), L = o.head ?? 26;
  ink([[a[0] - Math.cos(ang - 0.5) * L, a[1] - Math.sin(ang - 0.5) * L], a, [a[0] - Math.cos(ang + 0.5) * L, a[1] - Math.sin(ang + 0.5) * L]], { w: o.w ?? 5, color: o.c ?? C.ink, key: (o.key ?? 'arr') + 'h', amt: 0.8 });
}
// a smooth curve through control points (Catmull-Rom), for arrows
function r_curve(pts, n = 14) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
// the tag drawn complete (no pop) — same spot as inkTag; used on the hard cut into "root"
const r_tagNow = (str) => { const f = () => inkCard(str, 70 + (handW(str, 80) + 72) / 2, 330, 80, { rot: -0.04 }); if (DEFER) DEFER.push(f); else f(); };
// a bumpy cloud outline
function r_cloudPts(x, y, rx, ry) {
  const P = [];
  for (let i = 0; i < 72; i++) { const a = i / 72 * TAU, k = 0.86 + 0.14 * Math.abs(Math.cos(a * 3.5)); P.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]); }
  return P;
}
// a key (the attacker's foothold), centred on its ring
function r_key(x, y, s, key) {
  ink(ellipsePts(x, y, 30 * s, 30 * s, 0, 24), { closed: true, w: 18 * s, color: 'rgba(212,56,44,0.25)', key: key + 'g' });
  paint(ellipsePts(x, y, 22 * s, 22 * s, 0, 24), { fill: C.red, key: key + 'r', line: C.white, w: 3, tex: [{ k: 'cross', c: '#7a1a12', al: 0.45, gap: 5 }] });
  ctx.fillStyle = C.navy; ctx.beginPath(); ctx.arc(x, y, 8 * s, 0, TAU); ctx.fill();
  paint(rrectPts(x + 18 * s, y - 6 * s, 52 * s, 12 * s, 4), { fill: C.red, key: key + 's', line: C.white, w: 2.5 });
  paint(rrectPts(x + 52 * s, y + 4 * s, 9 * s, 16 * s, 2), { fill: C.red, key: key + 't1', line: C.white, w: 2 });
  paint(rrectPts(x + 36 * s, y + 4 * s, 9 * s, 12 * s, 2), { fill: C.red, key: key + 't2', line: C.white, w: 2 });
}

// =====================================================================
//  RISK — "Chưa ghi nhận vụ tấn công nào, nhưng mã khai thác thử đã công khai trên GitHub."
//  navy; the server stays at SRV; calm monitoring rings, "0" attacks, not in KEV; then the PoC repo card.
//  From VL('risk').t1 to the hard cut everything freezes (TT held), only the line boil keeps going.
// =====================================================================
SCENES.risk = function () {
  const keepTT = TT, tFreeze = VL('risk').t1;
  TT = Math.min(TT, tFreeze);
  darkWorld('risk', { dust: 40 });
  // monitoring rings around the server (calm: nothing found)
  if (TT > 40.3 && TT < 42.0) {
    for (let i = 0; i < 3; i++) {
      const u = mod((TT - 40.3) / 1.2 + i / 3, 1), r = 190 + u * 260;
      ctx.save(); ctx.strokeStyle = C.periD; ctx.globalAlpha = (1 - u) * 0.55 * (1 - seg(TT, 41.6, 42.0)); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(SRV[0], SRV[1], r, r * 0.9, 0, 0, TAU); ctx.stroke(); ctx.restore();
    }
  }
  // "0 vụ tấn công được ghi nhận"
  const zs = popS(40.25);
  if (zs > 0) {
    ctx.save(); ctx.translate(150, 545); ctx.scale(zs, zs);
    handText('0', -55, 55, 160, C.white, { key: 'r0', weight: 700 });
    ctx.restore();
  }
  handText('vụ tấn công', 230, 505, 54, C.white, { key: 'rv1', frac: ev(40.6, 0.45) });
  handText('được ghi nhận', 230, 575, 54, C.peri, { key: 'rv2', frac: ev(40.9, 0.45) });
  // CISA KEV list card: scanned, not listed
  const ks = popS(41.0);
  if (ks > 0) {
    ctx.save(); ctx.translate(790, 520); ctx.scale(ks, ks); ctx.rotate(0.03);
    paint(rrectPts(-150, -110, 300, 210, 14), { fill: C.navy2, key: 'rkev', line: C.peri, w: 3, tex: [{ k: 'hatch', gap: 7, al: 0.2, c: C.periD }] });
    monoText('CISA KEV', -122, -62, 36, C.peri, { key: 'rkevt' });
    for (let i = 0; i < 3; i++) ink([[-122, -18 + i * 30], [-122 + [210, 170, 190][i], -18 + i * 30]], { w: 4, color: 'rgba(200,208,240,0.45)', key: 'rkl' + i });
    ctx.restore();
    // a scan bar sweeping the list while the voice says "chưa ghi nhận"
    const sc = seg(TT, 41.1, 42.0);
    if (sc > 0 && sc < 1) { const yy = 495 + Math.sin(sc * Math.PI * 2) * 40; ink([[655, yy], [925, yy]], { w: 4, color: C.cyan, key: 'rscan' }); }
  }
  handText('chưa có trong KEV', 530, 688, 48, C.cyan, { key: 'rkev2', frac: ev(41.5, 0.5), rot: -0.02 });
  // THE SERVER — at SRV all scene (lamp red)
  serverProp(SRV[0], SRV[1], { state: 'vuln', dark: true });
  // the PoC repo card (Rapid7's PoC, public on GitHub)
  const gs = popS(42.2);
  if (gs > 0) {
    ctx.save(); ctx.translate(520, 1250); ctx.scale(gs, gs); ctx.translate(-520, -1250);
    paint(rrectPts(110, 1085, 820, 335, 18), { fill: C.navy2, key: 'rgh', line: C.peri, w: 3.5, tex: [{ k: 'hatch', gap: 8, al: 0.16, c: C.periD, dens: (x, y) => clamp((x - 110) / 820) }] });
    paint(rrectPts(110, 1085, 22, 335, 8), { fill: C.red, key: 'rghs', line: false, tex: [{ k: 'cross', c: '#7a1a12', al: 0.4, gap: 5 }] });
    monoText('github.com', 160, 1145, 36, C.periD, { key: 'rghu' });
    chip('PoC', 420, 1145, C.red, { size: 34, dark: true, key: 'rpoc' });
    handText('của Rapid7', 640, 1150, 46, C.peri, { key: 'rr7' });
    handText('mã khai thác thử', 160, 1230, 56, C.white, { key: 'rgh1', frac: ev(42.5, 0.5) });
    handText('đã công khai trên GitHub', 160, 1305, 56, C.redL, { key: 'rgh2', frac: ev(43.3, 1.2) });
    handText('ai cũng tải về được', 160, 1385, 48, C.peri, { key: 'rghc', frac: ev(43.6, 1.2) });
    ctx.restore();
    // it is aimed at servers like this one
    r_arrow(r_curve([[850, 1080], [880, 990], [700, 930]]), { c: C.red, w: 6, frac: ev(44.5, 0.4), key: 'rarr' });
  }
  inkTag('PoC đã công khai');
  TT = keepTT;
};

// =====================================================================
//  ROOT — "Và nhờ một lỗi khác trong nhân Linux, người ta đã leo lên được quyền root, kể cả khi NGINX chạy trong Docker."
//  HARD CUT: complete on frame one (tag drawn, no pops). A Docker container around the server; a red key climbs
//  the ladder: worker -> SCTP (nhân Linux) at the lid -> root above. The lid cracks: container ≠ lá chắn.
//  The server stays at SRV (s = 1) for the bridge into "barrier".
// =====================================================================
SCENES.root = function () {
  darkWorld('root', { dust: 40 });
  const LX0 = 795, LX1 = 885, LID = 640, cx = (LX0 + LX1) / 2;
  const tSCTP = VW('root', 'Linux'), tRoot = VW('root', 'root'), tDock = VW('root', 'kể');
  const crack = ev(tSCTP + 0.15, 0.3);
  // the Docker container (box with ribs)
  paint(rrectPts(140, LID, 800, 480, 16), { fill: '#141838', key: 'rcont', line: C.peri, w: 4, tex: [{ k: 'hatch', gap: 9, al: 0.18, c: C.periD, dens: (x, y) => clamp((x - 140 + y - LID) / 1000 + 0.2) }] });
  for (let i = 1; i < 6; i++) ink([[140 + i * 133, LID + 10], [140 + i * 133, LID + 470]], { w: 1.6, color: 'rgba(124,134,196,0.35)', key: 'rrib' + i });
  monoText('docker', 170, LID + 52, 36, C.periD, { key: 'rdock' });
  // the lid turns red and cracks where the ladder breaks through
  if (crack > 0) {
    ink([[140, LID], [940, LID]], { w: 5, color: C.red, key: 'rlid', frac: crack });
    const R = RNG('rcrk', 1);
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + R.n(1.3), L = 40 + R.r(0, 50) * crack; ink([[cx, LID], [cx + Math.cos(a) * L * 0.6, LID + Math.sin(a) * L * 0.5 + 6], [cx + Math.cos(a) * L, LID + Math.sin(a) * L]], { w: 3, color: C.redL, key: 'rck' + i }); }
  }
  // the server inside the container (at SRV for the bridge)
  serverProp(SRV[0], SRV[1], { state: 'vuln', dark: true });
  // the worker chip: the code runs as the worker
  chip('worker', 300, 1075, C.red, { size: 34, dark: true, key: 'rwk' });
  ctx.save(); ctx.setLineDash([10, 9]); ink([[475, 1068], [LX0, 1068]], { w: 3, color: C.redL, key: 'rwkl' }); ctx.restore();
  // the ladder
  ink([[LX0, 1100], [LX0, 470]], { w: 5, color: C.peri, key: 'rlad0' });
  ink([[LX1, 1100], [LX1, 470]], { w: 5, color: C.peri, key: 'rlad1' });
  for (let y = 1070; y > 480; y -= 60) ink([[LX0, y], [LX1, y]], { w: 3.5, color: C.peri, key: 'rrung' + y });
  // SCTP (nhân Linux) at the lid
  handText('SCTP (nhân Linux)', 300, LID - 22, 50, crack > 0 ? C.redL : C.peri, { key: 'rsctp' });
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(LX0 - 26, LID, 10 + 3 * Math.sin(TT * 8), 0, TAU); ctx.fill();
  // root at the top
  const rp = TT >= tRoot ? 1 + 0.25 * Math.exp(-(TT - tRoot) * 6) * Math.sin((TT - tRoot) * 20) : 1;
  ctx.save(); ctx.translate(840, 440); ctx.scale(rp, rp);
  paint(rrectPts(-100, -42, 200, 84, 14), { fill: TT >= tRoot ? C.red : '#3a1c2a', key: 'rroot', line: C.white, w: 3.5, tex: [{ k: 'cross', c: '#7a1a12', al: 0.4, gap: 6 }] });
  monoText('root', -54, 18, 52, C.white, { key: 'rroott' });
  ctx.restore();
  if (TT >= tRoot && TT < tRoot + 0.5) sparkBurst(840, 440, 90 + (TT - tRoot) * 160, { key: 'rspk', c: '#ff9a8a', glow: 'rgba(212,56,44,0.25)', core: false });
  // the key climbs: worker -> lid (SCTP) -> root
  const ky = springTrack([[0, 1068], [VW('root', 'nhờ'), 1068], [VW('root', 'trong'), 860], [tSCTP, LID], [VW('root', 'đã'), 580], [tRoot - 0.25, 535]], SPRING.snappy) + Math.sin(TT * 5) * 4;
  r_key(cx - 20, ky, 1, 'rkey');
  // the payoff text: present from the first frame; underlined in red on "kể cả khi … Docker"
  inkCard('container ≠ lá chắn', 540, 1250, 60, { rot: -0.015 });
  if (TT > tDock) ink([[300, 1300], [780, 1296]], { w: 6, color: C.red, key: 'rul', frac: ev(tDock, 0.7) });
  handText('mọi container dùng chung nhân Linux', 120, 1385, 46, C.peri, { key: 'rshare' });
  r_tagNow('leo lên root');
};

// =====================================================================
//  BARRIER — "Bản thử cần khoảng 128 GB lưu lượng. Đó là rào cản, không phải lý do để chờ."
//  navy; the server stays at SRV; a data meter fills to ~128 GB; a hurdle rises — and a red arc still clears it.
// =====================================================================
SCENES.barrier = function () {
  darkWorld('barrier', { dust: 40 });
  const t0 = VW('barrier', 'cần'), t1 = VE('barrier', 'lượng'), tH = VW('barrier', 'rào'), tN = VW('barrier', 'không');
  const fill = EZ.o2(seg(TT, t0, t1)), x0 = 100, x1 = 940, bw = x1 - x0, HX = 250, GY = 1022;
  handText('bản thử cần', x0, 458, 52, C.peri, { key: 'rb1', frac: ev(ET('barrier') + 0.1, 0.4) });
  const v = Math.round(128 * fill), lab = '~' + v + ' GB', cw = monoW(64);
  monoText(lab, x1 - 16 - cw * lab.length, 462, 64, fill >= 1 ? C.yellow : C.white, { key: 'rbn' });
  // the meter
  paint(rrectPts(x0, 495, bw, 96, 18), { fill: C.navy2, key: 'rbm', line: C.peri, w: 3.5 });
  if (fill > 0.01) paint(rrectPts(x0 + 8, 503, (bw - 16) * fill, 80, 12), { fill: C.red, key: 'rbf', line: false, tex: [{ k: 'hatch', gap: 7, al: 0.35, c: '#7a1a12' }, { k: 'pencil', c: C.redL, al: 0.3, per: 80 }] });
  // packets streaming through the meter (the scene's one particle effect) — they keep flowing once it is full
  const fx = x0 + 8 + (bw - 16) * fill;
  if (TT > t0 - 0.2) {
    ctx.fillStyle = C.yellow;
    for (let i = 0; i < 9; i++) { const u = mod(TT * 0.9 + i / 9, 1), px = x0 + 14 + u * Math.max(20, fx - x0 - 40); if (px < fx - 26) ctx.fillRect(px, 522 + ((i * 7) % 3) * 10, 24, 14); }
    if (fill < 1) { ctx.globalAlpha = 0.5 + 0.5 * Math.sin(TT * 9); ctx.fillStyle = C.yellowL; ctx.fillRect(fx - 6, 508, 6, 70); ctx.globalAlpha = 1; }
  }
  // the full meter becomes the hurdle: a marching dashed line drops from the meter to where the hurdle rises
  const dropF = ev(t1, 0.5), dropA = 1 - ev(tH + 0.4, 0.4);
  if (dropF > 0 && dropA > 0) {
    ctx.save(); ctx.globalAlpha = dropA; ctx.strokeStyle = C.yellow; ctx.lineWidth = 6; ctx.setLineDash([18, 14]); ctx.lineDashOffset = -TT * 60; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(HX, 600); ctx.lineTo(HX, 600 + (800 - 600) * dropF); ctx.stroke();
    if (dropF >= 1) ink([[HX - 18, 782], [HX, 806], [HX + 18, 782]], { w: 6, color: C.yellow, key: 'rbdh' });
    ctx.restore();
  }
  // the ground
  ink([[80, GY], [1000, GY]], { w: 3.5, color: C.periD, key: 'rbg' });
  // the hurdle grows slowly out of the ground while "Đó là…" (built from the 128 GB), settles on "rào cản"
  const hs = EZ.io(seg(TT, t1 + 0.15, tH + 0.1));
  if (hs > 0) {
    ctx.save(); ctx.translate(HX, GY); ctx.scale(1, hs);
    paint(rrectPts(-96, -156, 16, 156, 4), { fill: C.peri, key: 'rhp0', line: C.white, w: 2.5 });
    paint(rrectPts(80, -156, 16, 156, 4), { fill: C.peri, key: 'rhp1', line: C.white, w: 2.5 });
    paint(rrectPts(-125, -190, 250, 52, 10), { fill: C.yellow, key: 'rhb', line: C.white, w: 3, tex: [{ k: 'hatch', a: 0.9, gap: 22, w: 6, c: C.navy, al: 0.35 }] });
    ctx.restore();
    if (hs > 0.98) { const tw = monoW(32) * 6; ctx.fillStyle = C.yellow; ctx.fillRect(HX - tw / 2 - 8, GY - 186, tw + 16, 44); monoText('128 GB', HX - tw / 2, GY - 152, 32, C.navy, { key: 'rhbt' }); }
  }
  handText('rào cản,', 110, 1170, 64, C.yellow, { key: 'rbt1', frac: ev(tH, 0.5) });
  handText('không phải lý do để chờ', 110, 1270, 64, C.white, { key: 'rbt2', frac: ev(tN, 0.9) });
  if (TT > tN + 0.8) ink([[110, 1298], [800, 1294]], { w: 6, color: C.red, key: 'rbul', frac: ev(tN + 0.8, 0.5) });
  handText('(thử nghiệm của Rapid7)', 110, 1390, 46, C.periD, { key: 'rb7', frac: ev(t1 + 0.3, 0.8) });
  // THE SERVER at SRV
  serverProp(SRV[0], SRV[1], { state: 'vuln', dark: true });
  // a red arc still clears the hurdle into the server
  const arc = r_curve([[75, 1010], [110, 860], [HX, 700], [395, 905]]);
  if (TT > tN) {
    r_arrow(arc, { c: C.red, w: 6, frac: ev(tN, 0.5), key: 'rbarc', dash: [16, 12] });
    if (TT > tN + 0.5) { const p = pointAt(resample(arc, false, 8), mod(TT - tN - 0.5, 1.1) / 1.1); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(p[0], p[1], 13, 0, TAU); ctx.fill(); ctx.strokeStyle = C.white; ctx.lineWidth = 2.5; ctx.stroke(); }
  }
  inkTag('~128 GB');
};

// =====================================================================
//  CHECK — "Kiểm tra trước: tìm chữ http2 trong cấu hình, và hỏi máy chủ từ bên ngoài xem nó có nhận HTTP/2 không.
//          Có CDN phía trước thì kiểm tra thẳng máy chủ gốc."
//  paper; the server shrinks to the corner for two terminal cards (grep, openssl), then returns to SRV as the
//  origin behind a CDN cloud, with a green arrow that bypasses the cloud.
// =====================================================================
SCENES.check = function () {
  paperSheet('check');
  const E = ET('check'), tOut = 71.3, tCDN = VW('check', 'cdn'), tBy = VW('check', 'thẳng');
  const go = r_io(0, E + 0.5, E + 1.1) * (1 - r_io(0, tOut, tOut + 0.7));
  const sx = lerp(SRV[0], 830, go), sy = lerp(SRV[1], 1300, go), ss = lerp(1, 0.45, go);
  // ---- phase A: two terminal cards (slide away left at tOut)
  const slide = -1200 * EZ.i2(seg(TT, tOut, tOut + 0.45));
  if (slide > -1150) {
    ctx.save(); ctx.translate(slide, 0);
    const a0 = E + 0.6;
    if (TT > E + 0.45) {
      termCard(70, 390, 920, [{ s: '$ grep -rnE "http2" /etc/nginx/' }, { s: '/etc/nginx/sites-enabled/default:12:', out: true, c: C.periD }, { s: '  listen 443 ssl http2;', out: true, c: C.yellow }], { t0: a0, cps: 22, key: 'rt1', size: 38 });
      // an illustrative result (path:line: prefix as grep -rn prints it)
      if (slide === 0) handText('ví dụ', 925 - handW('ví dụ', 46), 372, 46, C.ink, { key: 'rvd1', frac: ev(a0 + 31 / 22 + 0.25, 0.3) });
      // reading: this line, or "http2 on;" = HTTP/2 on
      const nt = a0 + 31 / 22 + 1.0;
      let x = 80; const y = 705;
      if (slide === 0) {
      x += handText('dòng này, hoặc', x, y, 48, C.ink, { key: 'rn1', frac: ev(nt, 0.4) }) + 16;
      if (TT > nt + 0.4) monoText('http2 on;', x, y, 36, C.ink, { key: 'rn2', count: Math.floor(seg(TT, nt + 0.4, nt + 0.8) * 9) });
      x += monoW(36) * 9 + 16;
      if (TT > nt + 0.8) {
        const hw = handW('= HTTP/2 bật', 48);
        paint(rrectPts(x - 10, y - 46, hw + 20, 62, 12), { fill: C.yellow, key: 'rn3b', line: C.ink, w: 2.5, tex: [{ k: 'pencil', c: C.yellowL, al: 0.5, per: 70 }] });
        handText('= HTTP/2 bật', x, y, 48, C.ink, { key: 'rn3', frac: ev(nt + 0.8, 0.4) });
      }
      }
    }
    const b0 = VW('check', 'hỏi') - 0.3;
    if (TT > b0 - 0.2) {
      termCard(70, 775, 920, [
        { s: '$ openssl s_client -alpn h2 -connect' }, { s: '  example.com:443 </dev/null', gap: 0.05 }, { s: '  2>/dev/null | grep "ALPN"', gap: 0.05 },
        { s: 'ALPN protocol: h2', out: true, c: C.yellow }], { t0: b0, cps: 30, key: 'rt2', size: 38 });
      // asked from outside: a dashed arrow from the card to the (small) server
      if (slide === 0) handText('hỏi từ bên ngoài', 90, 1150, 48, C.ink, { key: 'rn4', frac: ev(b0 + 0.4, 0.5) });
      r_arrow(r_curve([[490, 1135], [630, 1190], [735, 1265]]), { c: C.ink, w: 4, dash: [12, 10], frac: ev(b0 + 0.7, 0.5), key: 'rn5' });
    }
    ctx.restore();
  }
  // ---- phase B: the CDN in front; check the origin directly
  const cs = popS(tCDN);
  const cdnPath = r_curve([[290, 1290], [330, 1215], [385, 1185]]);
  const byPath = r_curve([[290, 1355], [560, 1300], [860, 1190], [870, 1000], [690, 920]]);
  if (TT > tOut + 0.5) handText('máy chủ gốc (origin)', 540 - handW('máy chủ gốc (origin)', 52) / 2, 670, 52, C.ink, { key: 'rorg', frac: ev(tOut + 0.6, 0.6) });
  if (TT > tOut + 0.3) {
    // the tester: a little laptop terminal with a blinking cursor
    const ls = popS(tOut + 0.3);
    ctx.save(); ctx.translate(190, 1330); ctx.scale(ls, ls);
    paint(rrectPts(-95, -65, 190, 120, 12), { fill: '#11132a', key: 'rlap', line: C.ink, w: 3.5 });
    paint(rrectPts(-120, 55, 240, 22, 8), { fill: '#d8cfbb', key: 'rlapb', line: C.ink, w: 3, tex: [{ k: 'hatch', gap: 5, al: 0.35 }] });
    monoText('$', -70, 8, 40, C.white, { key: 'rlapt' });
    if (Math.floor(TT * 3) % 2 === 0) { ctx.fillStyle = C.cyan; ctx.fillRect(-36, -22, 20, 32); }
    ctx.restore();
  }
  if (cs > 0) {
    // the usual path goes through the CDN (it answers for itself)
    r_arrow(cdnPath, { c: C.ink, w: 4, frac: ev(tCDN + 0.2, 0.4), key: 'rcp' });
    ctx.save(); ctx.translate(540, 1160); ctx.scale(cs, cs); ctx.translate(-540, -1160);
    const bob = Math.sin(TT * 2.2) * 5;
    paint(r_cloudPts(540, 1160 + bob, 200, 82), { fill: '#e9eef3', key: 'rcloud', line: C.ink, w: 4, tex: [{ k: 'pencil', c: C.skyL, al: 0.6, per: 70 }, { k: 'hatch', gap: 6, al: 0.25, dens: (x, y) => clamp((y - 1110) / 110) }] });
    handText('CDN', 540 - handW('CDN', 62, 700) / 2, 1182 + bob, 62, C.skyD, { key: 'rcdn', weight: 700 });
    ctx.restore();
    r_arrow([[540, 1080], [540, 1030]], { c: C.ink, w: 4, frac: ev(tCDN + 0.5, 0.25), key: 'rcp2' });
    // a request goes the usual way: laptop -> CDN (and the CDN answers it; the origin never sees it)
    if (TT > tCDN + 0.6) {
      const u = mod(TT - tCDN - 0.6, 1.0), p = u < 0.5 ? pointAt(resample(cdnPath, false, 8), u / 0.5) : pointAt(resample([[385, 1185], [540, 1160]], false, 8), (u - 0.5) / 0.5);
      ctx.fillStyle = C.skyD; ctx.beginPath(); ctx.arc(p[0], p[1], 13, 0, TAU); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke();
    }
  }
  const tB0 = tCDN + 0.95;
  if (TT > tB0) {
    r_arrow(byPath, { c: C.green, w: 8, frac: ev(tB0, 0.9), key: 'rby', head: 32 });
    handText('kiểm tra thẳng origin', 560 - handW('kiểm tra thẳng origin', 52) / 2, 1430, 52, C.green, { key: 'rbyt', frac: ev(tB0 + 0.4, 0.7), weight: 700 });
    if (TT > tB0 + 0.9) { const p = pointAt(resample(byPath, false, 8), mod(TT - tB0 - 0.9, 0.9) / 0.9); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(p[0], p[1], 12, 0, TAU); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke(); }
  }
  // THE SERVER (paper): SRV at the bridges, the corner while the cards are up
  serverProp(sx, sy, { state: 'vuln', s: ss, key: 'srv' });
  inkTag('kiểm tra HTTP/2');
};

// =====================================================================
//  VERSION — "Xem phiên bản. Với gói của Ubuntu, hãy so cả chuỗi phiên bản gói, vì con số chính có thể không đổi."
//  paper; the server stays at SRV; a terminal card above (nginx -v, dpkg -l), a magnifier on the package version
//  below: compare the WHOLE string; the upstream number can stay the same.
// =====================================================================
SCENES.version = function () {
  paperSheet('version');
  const E = ET('version'), size = 38, lh = size * 1.45, cw = monoW(size);
  const tU = VW('version', 'ubuntu'), tS = VW('version', 'so'), tN = VW('version', 'con');
  const L4 = 'ii  nginx  1.24.0-2ubuntu7.5  amd64', vStr = '1.24.0-2ubuntu7.5';
  const t0 = E + 0.6;
  const CY = 380;
  termCard(70, CY, 920, [{ s: '$ nginx -v' }, { s: 'nginx version: nginx/1.24.0', out: true }, { s: '$ dpkg -l nginx | tail -n 1', gap: 0.1 }, { s: L4, out: true }],
    { t0, cps: 20, key: 'rv', size });
  if (TT > tU) chip('Ubuntu', 790, CY + 36, C.orange, { size: 30, s: popS(tU), key: 'rub' });
  // highlight of the package version on the card
  const vx = 70 + 28 + 11 * cw, vy = CY + 70 + 3 * lh + size * 0.4;
  if (TT > tS - 0.2) {
    ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 4; ctx.globalAlpha = 0.9;
    const k = ev(tS - 0.2, 0.4); ctx.strokeRect(vx - 8, vy - size - 2, (vStr.length * cw + 16) * k, size + 16); ctx.restore();
  }
  // THE SERVER at SRV
  serverProp(SRV[0], SRV[1], { state: 'vuln' });
  // the magnifier: the full package version string, big
  const ms = popS(tS);
  if (ms > 0) {
    const big = 60, bcw = monoW(big), bw = bcw * vStr.length, bx = 540 - bw / 2, by = 1212;
    ctx.save(); ctx.translate(540, 1190); ctx.scale(ms, ms); ctx.translate(-540, -1190);
    handText('ví dụ', 120, 1106, 46, C.ink, { key: 'rvd' });
    ink([[bx + bw + 30, 1140], [bx + bw + 100, 1080]], { w: 16, color: C.woodD, key: 'rmh' });
    paint(rrectPts(bx - 36, 1130, bw + 72, 120, 60), { fill: '#fbf6ea', key: 'rmg', line: C.ink, w: 7, tex: [{ k: 'pencil', c: C.skyL, al: 0.5, per: 60 }, { k: 'hatch', gap: 6, al: 0.15, dens: (x, y) => clamp((x - bx) / bw - 0.3) }] });
    monoText(vStr, bx, by, big, C.ink, { key: 'rvbig' });
    ink([[bx - 4, by + 18], [bx + bw + 4, by + 18]], { w: 5, color: '#2f6db5', key: 'rvul', frac: ev(tS + 0.2, 0.8) });
    // the upstream number (can stay the same with Ubuntu backports)
    if (TT > tN) { ink([[bx - 4, by - 52], [bx + 6 * bcw, by - 52]], { w: 5, color: C.skyD, key: 'rvmaj', frac: ev(tN, 0.4) }); }
    ctx.restore();
  }
  handText('so cả chuỗi phiên bản gói', 540 - handW('so cả chuỗi phiên bản gói', 54, 700) / 2, 1330, 54, '#2f6db5', { key: 'rvs', frac: ev(tS + 0.3, 0.8), weight: 700 });
  handText('số chính có thể không đổi', 540 - handW('số chính có thể không đổi', 48) / 2, 1420, 48, C.skyD, { key: 'rvn', frac: ev(tN + 0.2, 0.7) });
  inkTag('xem phiên bản');
};
