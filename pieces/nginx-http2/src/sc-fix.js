// =====================================================================
//  disable · trade · upgrade · four · defend · today — the fix half (paper, except defend = navy).
//  The server leaves SRV after each bridge (shrinks to the bottom), cards take the frame, then it comes back.
//  Lamp: red until "upgrade" turns it green after the restart (≈ 'Chỉ reload'); green to the end.
// =====================================================================

// ---- server path: starts at SRV (s 1); keys [t, x, y, s, d] eased in turn; a finished key lands exactly
function f_srvPath(keys, tt = TT) {
  let x = SRV[0], y = SRV[1], s = 1;
  for (const [t, X, Y, S, d] of keys) {
    const k = EZ.io(clamp((tt - t) / (d ?? 0.6)));
    if (k >= 1) { x = X; y = Y; s = S; } else if (k > 0) { x = lerp(x, X, k); y = lerp(y, Y, k); s = lerp(s, S, k); }
  }
  return { x, y, s };
}
// scale a group about (cx, cy): in with a pop at tin, out at tout
const f_inout = (tin, tout) => popS(tin) * (1 - EZ.i2(seg(TT, tout, tout + 0.25)));
function f_sc(cx, cy, s, fn) {
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); fn(); ctx.restore();
}
// a paper card with a hatched shadow
function f_card(x, y, w, h, key, o = {}) {
  if (!o.dark) paint(rrectPts(x + 8, y + 10, w, h, 16), { fill: 'rgba(58,36,23,0.28)', line: false, key: key + 'sh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
  paint(rrectPts(x, y, w, h, 16), o.dark
    ? { fill: C.navy2, key, line: o.line || C.peri, w: o.w ?? 3, tex: [{ k: 'hatch', c: C.periD, al: 0.16, gap: 7, dens: (px, py) => clamp((px - x + py - y) / (w + h)) }] }
    : { fill: o.fill || C.cream, key, line: o.line || C.ink, w: o.w ?? 3, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.5, per: 90 }, { k: 'hatch', gap: 6, al: 0.12, dens: (px, py) => clamp((px - x + py - y) / (w + h) * 1.4 - 0.4) }] });
}
function f_tick(x, y, sz, frac, col = C.green, key = 'tk') {
  if (frac <= 0) return;
  ink([[x - sz * 0.45, y - sz * 0.02], [x - sz * 0.12, y + sz * 0.32], [x + sz * 0.5, y - sz * 0.42]], { w: sz * 0.14, color: col, key, frac, amt: 1.2 });
}
function f_arrow(x1, y1, x2, y2, col, frac = 1, key = 'ar', w = 4) {
  if (frac <= 0) return;
  ink([[x1, y1], [x2, y2]], { w, color: col, key, frac, amt: 1 });
  if (frac >= 1) { const a = Math.atan2(y2 - y1, x2 - x1), L = 16; ink([[x2 - L * Math.cos(a - 0.5), y2 - L * Math.sin(a - 0.5)], [x2, y2], [x2 - L * Math.cos(a + 0.5), y2 - L * Math.sin(a + 0.5)]], { w, color: col, key: key + 'h', amt: 0.6 }); }
}
function f_strike(x, y, w, frac, key) { if (frac > 0) ink([[x - 6, y - 12], [x + w + 6, y - 10]], { w: 5, color: C.red, key, frac, amt: 1 }); }
function f_brace(x, y0, y1, col, key, frac = 1) {
  const m = (y0 + y1) / 2;
  ink([[x, y0], [x + 16, y0 + 12], [x + 16, m - 14], [x + 32, m], [x + 16, m + 14], [x + 16, y1 - 12], [x, y1]], { w: 3.5, color: col, key, frac });
}
// the yellow HTTP/2 chip exactly as serverProp draws it, anchored at its top-left corner (ax, ay)
function f_h2chip(ax, ay, s, rot) {
  ctx.save(); ctx.translate(ax, ay); ctx.rotate(rot);
  paint(rrectPts(0, -28 * s, 150 * s, 56 * s, 28 * s), { fill: C.yellow, key: 'fh2', line: C.ink, w: 3 });
  monoText('HTTP/2', 18 * s, 12 * s, 34 * s, C.ink, { key: 'fh2t' });
  ctx.restore();
}
function f_lampAt(P) { return [P.x + SW * P.s / 2 - 40 * P.s, P.y + SH * P.s / 2 - 48 * P.s]; }
// a small worker box (upgrade's reload / restart panels): state 'old' (red lamp), 'new' (green), ghost = dashed, floating
function f_worker(x, y, state, key, o = {}) {
  const w = 70, h = 62;
  if (o.ghost) {
    const bob = Math.sin(TT * 5 + 1) * 6;
    ctx.save(); ctx.setLineDash([9, 7]);
    paint(rrectPts(x, y + bob, w, h, 10), { fill: 'rgba(160,150,140,0.22)', key, line: 'rgba(58,36,23,0.6)', w: 3, tex: [{ k: 'hatch', gap: 6, al: 0.25, c: '#8a8070' }] });
    ctx.restore();
    ctx.globalAlpha = 0.55 + 0.45 * Math.sin(TT * 8); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(x + w - 16, y + bob + 18, 8, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    for (let i = 0; i < 3; i++) ink([[x + 8 + i * 22, y + h + bob + 4], [x + 16 + i * 22, y + h + bob + 14 + Math.sin(TT * 6 + i) * 4]], { w: 2.5, color: 'rgba(58,36,23,0.45)', key: key + 'gt' + i, amt: 0.8 });
    return;
  }
  paint(rrectPts(x, y, w, h, 10), { fill: '#e9e2d2', key, line: C.ink, w: 3, tex: [{ k: 'hatch', gap: 6, al: 0.22, dens: (px, py) => clamp((px - x + py - y) / (w + h)) }] });
  ink([[x + 10, y + 40], [x + 46, y + 40]], { w: 3, color: 'rgba(58,36,23,0.6)', key: key + 'l', amt: 0.6 });
  ctx.fillStyle = state === 'new' ? C.green : C.red; ctx.beginPath(); ctx.arc(x + w - 16, y + 18, 8, 0, TAU); ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.stroke();
}

// =====================================================================
//  disable — Ubuntu / Debian: no fixed package yet → turn HTTP/2 off, nginx -t, restart; the HTTP/2 chip falls off
// =====================================================================
SCENES.disable = function () {
  const id = 'disable', t0 = ET(id), t1 = EE(id), vw = (w, n) => VW(id, w, n);
  paperSheet(id);
  const tFall = vw('khởi');                         // "khởi động lại": the restart, the chip falls
  const tOutA = vw('trong') - 0.3, tStamp = vw('chưa'), tCfg = tOutA + 0.35;
  const keys = [[t0 + 0.5, 540, 1270, 0.85], [tCfg, 540, 1330, 0.55], [t1 - 1.1, SRV[0], SRV[1], 1]];
  const P = f_srvPath(keys);

  // ---- A: the two badges + the stamp "chưa có gói vá"
  f_sc(510, 620, 1 - EZ.i2(seg(TT, tOutA, tOutA + 0.25)), () => {
    f_sc(330, 525, popS(vw('ubuntu')), () => {
      f_card(80, 450, 500, 150, 'fdU');
      handText('Ubuntu', 110, 518, 58, C.ink, { key: 'fdUt', weight: 700 });
      monoText('16.04 → 26.10', 112, 578, 34, C.woodD, { key: 'fdUs' });
    });
    f_sc(330, 715, popS(vw('debian')), () => {
      f_card(80, 640, 500, 150, 'fdD');
      handText('Debian', 110, 708, 58, C.ink, { key: 'fdDt', weight: 700 });
      handText('bản chính thức', 112, 770, 46, C.woodD, { key: 'fdDs' });
    });
    if (TT >= tStamp - 0.3) f_brace(598, 465, 775, C.ink, 'fdbr', ev(tStamp - 0.3, 0.3));
    if (TT >= tStamp) {
      const k = EZ.o3(seg(TT, tStamp, tStamp + 0.2)), s = 1 + 0.6 * (1 - k);
      ctx.save(); ctx.translate(790, 620); ctx.rotate(-0.07); ctx.scale(s, s);
      paint(rrectPts(-140, -88, 280, 176, 18), { fill: 'rgba(244,236,217,0.9)', key: 'fdst', line: C.red, w: 6, tex: [{ k: 'hatch', c: C.red, al: 0.14, gap: 7 }] });
      ink(rrectPts(-128, -76, 256, 152, 12), { closed: true, w: 2.5, color: C.red, key: 'fdst2' });
      handText('chưa có', -98, -10, 62, C.red, { key: 'fdst3', weight: 700 });
      handText('gói vá', -82, 58, 62, C.red, { key: 'fdst4', weight: 700 });
      ctx.restore();
      const b = seg(TT, tStamp + 0.1, tStamp + 0.5);
      if (b > 0 && b < 1) burst(790, 620, 170 + 40 * b, 210 + 60 * b, { c: C.red, n: 14, w: 4, al: 1 - b, key: 'fdbu' });   // the scene's one particle effect
    }
  });

  // ---- B: the config card (≥ 1.25.1 and the older listen form) — lower half, under the command
  const tOutB = t1 - 1.2, tOff = vw('tắt'), tOld = tOff + 0.6, T0 = 740;   // card 740–1120, under the command + note
  f_sc(520, 930, f_inout(tCfg, tOutB), () => {
    f_card(70, T0, 900, 380, 'fdC');
    handText('NGINX ≥ 1.25.1', 100, T0 + 60, 46, C.ink, { key: 'fdCa', frac: ev(tCfg + 0.2, 0.4), weight: 700 });
    inkCard('bước 1', 820, T0 + 40, 46, { rot: -0.03, s: popS(tCfg + 0.1) });
    const s1 = 'listen 443 ssl;';
    monoText(s1, 100, T0 + 124, 40, C.ink, { key: 'fdC1', count: Math.floor(clamp((TT - tCfg - 0.5) * 30 / s1.length) * s1.length) });
    if (TT >= tCfg + 0.7) {
      monoText('http2 on;', 100, T0 + 186, 40, C.ink, { key: 'fdC2', al: TT >= tOff + 0.2 ? 0.55 : 1 });
      f_strike(100, T0 + 186, monoW(40) * 9, ev(tOff, 0.2), 'fdC2s');
      f_arrow(345, T0 + 174, 398, T0 + 174, C.ink, ev(tOff + 0.15, 0.15), 'fdC2a');
      const s2 = 'http2 off;';
      monoText(s2, 412, T0 + 186, 40, C.green, { key: 'fdC2n', count: Math.floor(clamp((TT - tOff - 0.3) * 24 / s2.length) * s2.length) });
    }
    ctx.save(); ctx.setLineDash([10, 9]); ink([[96, T0 + 222], [944, T0 + 224]], { w: 2, color: 'rgba(58,36,23,0.35)', key: 'fdCd' }); ctx.restore();
    handText('1.9.5 – 1.25.0', 100, T0 + 282, 46, C.ink, { key: 'fdCb', frac: ev(tOld, 0.4), weight: 700 });
    if (TT >= tOld + 0.2) {
      const s3 = 'listen 443 ssl http2;', s4 = 'listen 443 ssl;', cw = monoW(34);
      monoText(s3, 100, T0 + 346, 34, C.ink, { key: 'fdC3', al: TT >= tOld + 0.6 ? 0.55 : 1 });
      f_strike(100, T0 + 346, cw * s3.length, ev(tOld + 0.4, 0.2), 'fdC3s');
      f_arrow(100 + cw * s3.length + 10, T0 + 335, 100 + cw * s3.length + 52, T0 + 335, C.ink, ev(tOld + 0.55, 0.15), 'fdC3a');
      monoText(s4, 100 + cw * s3.length + 64, T0 + 346, 34, C.green, { key: 'fdC4', count: Math.floor(clamp((TT - tOld - 0.7) * 30 / s4.length) * s4.length) });
    }
  });

  // ---- the command: on screen from ~89 s (slides down from the top) and held until the bridge
  const tTerm = tCfg + 1.2, tEndT = t1 - 0.5;   // on screen ≥ 2 s (review MUST-FIX); order shown by the 'bước 1 / bước 2' tags
  const slide = EZ.o3(seg(TT, tTerm - 0.35, tTerm)), fadeT = 1 - EZ.i2(seg(TT, tEndT - 0.05, tEndT + 0.2));
  if (TT >= tTerm - 0.35 && fadeT > 0.01) {
    ctx.save(); ctx.globalAlpha = fadeT; ctx.translate(0, -260 * (1 - slide));
    const L1 = '$ sudo nginx -t &&', L2 = '  sudo systemctl restart nginx', cw = monoW(36), ty = 432;
    termCard(60, ty, 900, [{ s: L1 }, { s: L2 }], { size: 36, t0: tTerm + 0.1, cps: 34, key: 'fdT' });
    inkCard('bước 2', 820, ty + 26, 46, { rot: 0.03, s: popS(tTerm) });
    // markers under the words as the voice says them: "kiểm tra cấu hình" → nginx -t, "khởi động lại" → restart
    const lh = 36 * 1.45, by1 = ty + 70 + 36 * 0.4 + 10, by2 = by1 + lh;
    ink([[88 + cw * 7, by1], [88 + cw * 15, by1 + 1]], { w: 5, color: '#5de37a', key: 'fdTu1', frac: ev(vw('kiểm'), 0.35), amt: 0.8 });
    ink([[88 + cw * 18, by2], [88 + cw * 25, by2 + 1]], { w: 5, color: '#5de37a', key: 'fdTu2', frac: ev(tFall - 0.1, 0.35), amt: 0.8 });
    ctx.restore();
  }
  // the follow-up check (fades just before the server rises into it)
  const tNote = vw('kiểm') - 0.1, fadeN = 1 - EZ.i2(seg(TT, t1 - 1.0, t1 - 0.8));
  if (TT >= tNote && fadeN > 0.01) {
    ctx.save(); ctx.globalAlpha = fadeN;
    handText('chạy lại lệnh openssl:', 80, 655, 46, C.ink, { key: 'fdN1', frac: ev(tNote, 0.45) });
    handText('không còn h2 = xong', 80, 708, 46, C.green, { key: 'fdN2', frac: ev(tNote + 0.4, 0.45), weight: 700 });
    ctx.restore();
  }

  // ---- the server; at the restart its yellow HTTP/2 chip drops off
  serverProp(P.x, P.y, { state: 'vuln', s: P.s, h2: TT < tFall ? 1 : 0 });
  if (TT >= tFall) {
    const Q = f_srvPath(keys, tFall), dt = TT - tFall;
    const ax = Q.x - SW * Q.s / 2 - 10 * Q.s, ay = Q.y - SH * Q.s / 2 - 20 * Q.s;
    if (dt < 1.4) f_h2chip(ax - 70 * dt, ay + 60 * dt + 900 * dt * dt, Q.s, -2.4 * dt);
  }
  inkTag('tạm tắt HTTP/2');
};

// =====================================================================
//  trade — blocks 2 of the 5 (123007, 123633), not the other three; HTTP/1.1 is a little slower
// =====================================================================
SCENES.trade = function () {
  const id = 'trade', t0 = ET(id), t1 = EE(id), vw = (w, n) => VW(id, w, n);
  paperSheet(id);
  const P = f_srvPath([[t0 + 0.5, 830, 1150, 0.65], [t1 - 1.1, SRV[0], SRV[1], 1]]);
  const IDS5 = ['CVE-2026-123007', 'CVE-2026-123633', 'CVE-2026-121810', 'CVE-2026-113425', 'CVE-2026-123634'];
  const tChk = [vw('được'), vw('hai')], tOut = t1 - 1.2;
  IDS5.forEach((s, i) => {
    const y = 480 + i * 95, ok = i < 2 && TT >= tChk[i];
    chip(s, 70, y, ok ? C.green : C.red, { size: 34, s: popS(t0 + 0.35 + i * 0.08), key: 'ftc' });
    if (i < 2) f_tick(420, y - 8, 56, ev(tChk[i], 0.25), C.green, 'ftt' + i);
  });
  f_sc(560, 620, 1 - EZ.i2(seg(TT, tOut, tOut + 0.25)), () => {
    if (TT >= tChk[1] + 0.15) f_brace(462, 440, 590, C.green, 'ftb1', ev(tChk[1] + 0.15, 0.25));
    handText('chặn được', 508, 532, 50, C.green, { key: 'ftl1', frac: ev(tChk[1] + 0.3, 0.4), weight: 700 });
    const tU = vw('đổi') - 0.5;
    if (TT >= tU) f_brace(462, 630, 875, C.ink, 'ftb2', ev(tU, 0.25));
    handText('chưa chặn', 508, 770, 50, C.ink, { key: 'ftl2', frac: ev(tU + 0.15, 0.4), weight: 700 });
  });
  // the speed gauge: HTTP/2 → HTTP/1.1, the needle dips a little
  const gx = 280, gy = 1330, gr = 160, tD = vw('tải');
  f_sc(gx, gy - 60, popS(vw('đổi')), () => {
    const band = [...arcPts(gx, gy, gr, Math.PI, TAU, 30), ...arcPts(gx, gy, gr - 46, TAU, Math.PI, 30)];
    paint(band, { fill: C.cream, key: 'ftg', w: 3.5, tex: [{ k: 'hatch', gap: 6, al: 0.3, dens: (px) => clamp((gx + gr - px) / (2 * gr)) }] });
    const fast = [...arcPts(gx, gy, gr, TAU - 0.75, TAU, 10), ...arcPts(gx, gy, gr - 46, TAU, TAU - 0.75, 10)];
    paint(fast, { fill: C.greenL, key: 'ftgf', w: 3, tex: [{ k: 'pencil', c: C.green, al: 0.5, per: 50 }] });
    for (let i = 0; i <= 6; i++) { const a = Math.PI + i / 6 * Math.PI; ink([[gx + Math.cos(a) * (gr + 6), gy + Math.sin(a) * (gr + 6)], [gx + Math.cos(a) * (gr + 22), gy + Math.sin(a) * (gr + 22)]], { w: 3, key: 'ftgk' + i, amt: 0.5 }); }
    const ang = lerp(TAU - 0.38, TAU - 0.8, EZ.io(seg(TT, tD, tD + 0.6))) + 0.025 * Math.sin(TT * 11);
    ink([[gx, gy], [gx + Math.cos(ang) * (gr - 20), gy + Math.sin(ang) * (gr - 20)]], { w: 7, color: C.red, key: 'ftgn', amt: 0.6 });
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(gx, gy, 12, 0, TAU); ctx.fill();
    const lab = TT < tD ? 'HTTP/2' : 'HTTP/1.1';
    monoText(lab, gx - monoW(34) * lab.length / 2, gy + 62, 34, C.ink, { key: 'ftgl' + lab });
  });
  handText('chậm hơn chút', 480, 1320, 46, C.ink, { key: 'ftsl', frac: ev(vw('chậm'), 0.45) });
  serverProp(P.x, P.y, { state: 'vuln', s: P.s });
  inkTag('đánh đổi');
};

// =====================================================================
//  upgrade — docker pull / compose recreate → 1.31.9 / 1.30.7 go INTO the server; only the restart makes it GREEN;
//  restart = all new workers, reload = an old worker lingers
// =====================================================================
// a reload / restart panel drawn in local coords (300 × 470), placed at (x0, y0) and scaled by k
function f_panel(x0, y0, k, s, fn) {
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(x0 + 150 * k, y0 + 235 * k); ctx.scale(k * s, k * s); ctx.translate(-150, -235); fn(); ctx.restore();
}
SCENES.upgrade = function () {
  const id = 'upgrade', t0 = ET(id), t1 = EE(id), vw = (w, n) => VW(id, w, n);
  paperSheet(id);
  const tR = vw('khởi'), tL = vw('reload'), tOutA = tR - 0.5, tOutB = t1 - 0.55;
  const tIn = vw('và') - 0.75;                      // the two versions fly into the server (installed, not yet running)
  const tGreen = vw('chỉ') + 0.15;                  // the lamp turns green only after "restart → tất cả mới"
  const P = f_srvPath([[t0 + 0.5, 540, 1270, 0.85], [t1 - 1.1, SRV[0], SRV[1], 1]]);
  // ---- A: the commands (typed slowly with the version numbers) + the two fixed versions
  f_sc(510, 520, f_inout(t0 + 0.4, tOutA), () => {
    termCard(60, 440, 900, [{ s: '$ docker pull nginx:1.30.7' }, { s: '$ docker compose up -d --force-recreate' }], { size: 36, t0: t0 + 0.6, cps: 19, key: 'fuT' });
  });
  const t1v = vw('một', 1), t2v = vw('một', 2), fly = EZ.io(seg(TT, tIn, tIn + 0.6));
  const into = (x, y) => [lerp(x, P.x - 60, fly), lerp(y, P.y - 40, fly)];
  if (TT < tIn + 0.6) {
    const so = 1 - 0.75 * fly;
    let [x, y] = into(90, 830);
    f_sc(x + 130, y, so, () => {
      chip('1.31.9', x, y, C.green, { size: 60, s: popS(t1v), key: 'fuc' });
      if (TT >= t1v + 0.2) handText('mainline', x + 10, y + 108, 52, C.ink, { key: 'fucl1', frac: ev(t1v + 0.2, 0.35), weight: 700 });
    });
    [x, y] = into(560, 830);
    f_sc(x + 130, y, so, () => {
      chip('1.30.7', x, y, C.green, { size: 60, s: popS(t2v), key: 'fuc' });
      if (TT >= t2v + 0.2) handText('stable', x + 10, y + 108, 52, C.ink, { key: 'fucl2', frac: ev(t2v + 0.2, 0.35), weight: 700 });
    });
    if (TT >= vw('hoặc')) handText('hoặc', 400, 846, 50, C.woodD, { key: 'fuho', frac: ev(vw('hoặc'), 0.3), al: 1 - fly });
    // a dashed arrow from the commands down to the versions while they are typed
    if (TT < tIn) { ctx.save(); ctx.setLineDash([12, 10]); ctx.lineDashOffset = -TT * 40; f_arrow(510, 640, 510, 740, C.woodD, ev(t1v - 0.3, 0.3), 'fuda', 3.5); ctx.restore(); }
  }
  // ---- B: reload (left) vs restart (right), big panels
  const wx = (x0) => [x0 + 20, x0 + 104, x0 + 188], K = 1.25;
  f_panel(525, 410, K, f_inout(tR, tOutB), () => {      // restart → all new
    const x0 = 0, Y = 0;
    f_card(x0, Y, 300, 470, 'fuPR');
    paint(rrectPts(x0 + 40, Y + 25, 200, 62, 31), { fill: C.greenL, key: 'fuPRp', w: 3, tex: [{ k: 'pencil', c: C.green, al: 0.45, per: 50 }] });
    monoText('restart', x0 + 60, Y + 68, 38, C.ink, { key: 'fuPRt' });
    f_arrow(x0 + 140, Y + 100, x0 + 140, Y + 170, C.ink, ev(tR + 0.2, 0.2), 'fuPRa');
    const tSwap = tR + 0.6;
    wx(x0).forEach((x, i) => {
      const so = (1 - EZ.i2(seg(TT, tSwap + i * 0.08, tSwap + 0.2 + i * 0.08))) * popS(tR + 0.15);
      f_sc(x + 35, Y + 220, so, () => f_worker(x, Y + 190, 'old', 'fuwo' + i));
      f_sc(x + 35, Y + 220, popS(tSwap + 0.25 + i * 0.1), () => f_worker(x, Y + 190, 'new', 'fuwn' + i));
    });
    handText('tất cả', x0 + 22, Y + 345, 50, C.green, { key: 'fuPRl', frac: ev(tSwap + 0.6, 0.3), weight: 700 });
    handText('mới', x0 + 22, Y + 405, 50, C.green, { key: 'fuPRl2', frac: ev(tSwap + 0.8, 0.3), weight: 700 });
    f_tick(x0 + 220, Y + 380, 70, ev(tGreen - 0.15, 0.25), C.green, 'fuPRk');
  });
  // the restart reaches the server: a green arrow from the panel down to the lamp
  const [lx, ly] = f_lampAt(P);
  if (TT >= tGreen - 0.45 && TT < tOutB) f_arrow(780, 1010, lx + 6, ly - 40, C.green, ev(tGreen - 0.45, 0.4), 'fuga', 5);
  f_panel(95, 410, K, f_inout(tL, tOutB), () => {       // reload → an old worker keeps running
    const x0 = 0, Y = 0;
    f_card(x0, Y, 300, 470, 'fuPL');
    paint(rrectPts(x0 + 40, Y + 25, 190, 62, 31), { fill: C.yellowL, key: 'fuPLp', w: 3, tex: [{ k: 'pencil', c: C.yellow, al: 0.5, per: 50 }] });
    monoText('reload', x0 + 62, Y + 68, 38, C.ink, { key: 'fuPLt' });
    f_arrow(x0 + 135, Y + 100, x0 + 135, Y + 170, C.ink, ev(tL + 0.2, 0.2), 'fuPLa');
    const tSwap = tL + 0.5;
    wx(x0).forEach((x, i) => {
      if (i < 2) {
        const so = (1 - EZ.i2(seg(TT, tSwap + i * 0.08, tSwap + 0.2 + i * 0.08))) * popS(tL + 0.1);
        f_sc(x + 35, Y + 220, so, () => f_worker(x, Y + 190, 'old', 'fulo' + i));
        f_sc(x + 35, Y + 220, popS(tSwap + 0.25 + i * 0.1), () => f_worker(x, Y + 190, 'new', 'fuln' + i));
      } else if (TT < tSwap + 0.2) f_sc(x + 35, Y + 220, popS(tL + 0.1), () => f_worker(x, Y + 190, 'old', 'fulo2'));
      else f_worker(x, Y + 190, 'old', 'fulg', { ghost: true });
    });
    const tW = vw('worker');
    handText('worker cũ', x0 + 22, Y + 345, 50, C.red, { key: 'fuPLl1', frac: ev(tW, 0.35), weight: 700 });
    handText('vẫn chạy', x0 + 22, Y + 410, 50, C.red, { key: 'fuPLl2', frac: ev(vw('vẫn'), 0.35), weight: 700 });
  });
  // ---- the server: the versions land in it (lamp still red: old workers) → green only after the restart
  serverProp(P.x, P.y, { state: TT >= tGreen ? 'patched' : 'vuln', s: P.s });
  if (TT >= tIn + 0.5) {                            // the installed versions, tagged beside the server (grey until it runs)
    const s = popS(tIn + 0.5) * (1 - EZ.i2(seg(TT, t1 - 1.3, t1 - 1.05)));
    chip('1.31.9 / 1.30.7', 80, 1290, TT >= tGreen ? C.green : '#8a8070', { size: 32, s, key: 'fuvt' });
  }
  const b = seg(TT, tGreen, tGreen + 0.45);
  if (b > 0 && b < 1) burst(lx, ly, 26 + 20 * b, 50 + 40 * b, { c: C.green, n: 12, w: 4, al: 1 - b, key: 'fubu' });   // the scene's one particle effect
  inkTag('nâng cấp');
};

// =====================================================================
//  four — the two releases also fix 4 more bugs, each behind its own config; ticked with the voice
// =====================================================================
SCENES.four = function () {
  const id = 'four', t0 = ET(id), t1 = EE(id), vw = (w, n) => VW(id, w, n);
  paperSheet(id);
  const P = f_srvPath([[t0 + 0.5, 845, 1385, 0.42], [t1 - 1.1, SRV[0], SRV[1], 1]]);
  const ROWS = [['HTTP/3', 'CVE-2026-121810', vw('http')], ['mail proxy', 'CVE-2026-113425', vw('mail')], ['resolver (biến + SSI/mirror)', 'CVE-2026-123634', vw('resolver')], ['HTTP/2 + worker_connections', 'CVE-2026-123633', vw('worker')]];
  const tC = vw('bốn'), tOut = t1 - 1.05;
  let act = -1; ROWS.forEach((r, i) => { if (TT >= r[2]) act = i; });
  f_sc(520, 860, 1 - EZ.i2(seg(TT, tOut, tOut + 0.25)), () => {
    ROWS.forEach(([title, cve, tk], i) => {
      const top = 425 + i * 222, h = 200;
      // each card slides in from the left with the count ("bốn lỗi khác")
      const sl = EZ.o3(seg(TT, tC + i * 0.15, tC + i * 0.15 + 0.4));
      if (sl <= 0) return;
      ctx.save(); ctx.globalAlpha = sl; ctx.translate(110 * (1 - sl), 0);
      f_card(70, top, 880, h, 'ffc' + i);
      if (i === act) ink(rrectPts(64, top - 6, 892, h + 12, 20), { closed: true, w: 7, color: `rgba(95,156,92,${(0.45 + 0.3 * Math.sin(TT * 6)).toFixed(3)})`, key: 'ffhl' });
      handText(title, 100, top + 70, 50, C.ink, { key: 'fft' + i, weight: 700 });
      chip(cve, 100, top + 150, TT >= tk ? C.green : C.red, { size: 38, key: 'ffch' });
      paint(rrectPts(840, top + 62, 76, 76, 10), { fill: '#fbf6ea', key: 'ffb' + i, w: 3.5, tex: [{ k: 'hatch', gap: 6, al: 0.15 }] });
      f_tick(878, top + 98, 80, ev(tk, 0.25), C.green, 'ffk' + i);
      ctx.restore();
    });
    chip('1.31.9 / 1.30.7', 80, 1395, C.green, { size: 36, s: popS(vw('vá')), key: 'ffv' });
  });
  serverProp(P.x, P.y, { state: 'patched', s: P.s });
  inkTag('4 lỗi khác');
};

// =====================================================================
//  defend (navy) — block the SCTP module; watch for 4 signs; a clean access log is not proof
// =====================================================================
SCENES.defend = function () {
  const id = 'defend', t0 = ET(id), t1 = EE(id), vw = (w, n) => VW(id, w, n);
  darkWorld('defend', { dust: 40 });
  const P = f_srvPath([[t0 + 0.5, 800, 840, 0.55], [t1 - 1.1, SRV[0], SRV[1], 1]]);
  f_sc(510, 520, popS(t0 + 0.45), () => {
    termCard(60, 430, 900, [{ s: "$ echo 'install sctp /bin/false' |" }, { s: '  sudo tee /etc/modprobe.d/disable-sctp.conf' }], { size: 31, t0: t0 + 0.7, cps: 40, key: 'fdfT' });
  });
  // the SCTP module, crossed out
  const tB = vw('chặn'), tX = vw('sctp') + 0.3, tOutA = vw('và') - 0.25;
  f_sc(270, 860, f_inout(tB, tOutA), () => {
    f_card(120, 745, 300, 120, 'fdfS', { dark: true });
    monoText('SCTP', 270 - monoW(48) * 2, 822, 48, C.white, { key: 'fdfSt' });
    handText('nhân Linux', 150, 925, 46, C.peri, { key: 'fdfSl' });
    const k = ev(tX, 0.18), k2 = ev(tX + 0.15, 0.18);
    if (k > 0) ink([[110, 735], [430, 875]], { w: 9, color: C.red, key: 'fdfx1', frac: k, amt: 1 });
    if (k2 > 0) ink([[430, 735], [110, 875]], { w: 9, color: C.red, key: 'fdfx2', frac: k2, amt: 1 });
    const b = seg(TT, tX + 0.2, tX + 0.65);
    if (b > 0 && b < 1) sparkBurst(270, 805, 80 + 90 * b, { c: C.redL, glow: 'rgba(212,56,44,0.25)', core: false, key: 'fdfsp' });   // the scene's one particle effect
    handText('nếu không dùng', 150, 1005, 46, C.yellow, { key: 'fdfSn', frac: ev(vw('nếu'), 0.45) });
  });
  // the four signs
  const SIGNS = ['worker chạy chương trình lạ', 'worker sập / core dump', 'kết nối HTTP/2 lâu, ít log', 'kết nối ra ngoài / DNS lạ'];
  const tLit = [vw('worker'), vw('sập'), vw('hay'), vw('kết')], tS = vw('và') + 0.05;
  if (TT >= tS) handText('dấu hiệu:', 80, 1080, 46, C.cyan, { key: 'fdfh', frac: ev(tS, 0.35), weight: 700 });
  SIGNS.forEach((s, i) => {
    const y = 1165 + i * 80, lit = TT >= tLit[i];
    f_sc(110, y - 14, popS(tS + 0.15 + i * 0.1), () => {
      if (lit) {   // the lit sign gets a red band that sweeps on under it
        const bw = (handW(s, 46) + 90) * EZ.o3(seg(TT, tLit[i], tLit[i] + 0.45));
        paint(rrectPts(76, y - 50, bw, 64, 14), { fill: 'rgba(212,56,44,0.22)', key: 'fdfband' + i, line: false });
        const g = 0.5 + 0.5 * Math.sin(TT * 7 + i); ctx.fillStyle = `rgba(212,56,44,${(0.18 + 0.2 * g).toFixed(3)})`; ctx.beginPath(); ctx.arc(102, y - 15, 22, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = lit ? C.red : 'rgba(124,134,196,0.5)'; ctx.beginPath(); ctx.arc(102, y - 15, 11, 0, TAU); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = C.peri; ctx.stroke();
      handText(s, 136, y, 46, lit ? C.white : 'rgba(200,208,240,0.45)', { key: 'fdfs' + i });
    });
  });
  // "access log sạch ≠ an toàn": a paper note slides in early (≈124 s) and holds to the bridge
  const tN = vw('chương') - 0.15, sl = EZ.o3(seg(TT, tN, tN + 0.5)), fadeN = 1 - EZ.i2(seg(TT, t1 - 0.6, t1 - 0.4));
  if (TT >= tN && fadeN > 0.01) {
    const str = 'access log sạch ≠ an toàn', tw = handW(str, 50, 700);
    ctx.save(); ctx.globalAlpha = fadeN; ctx.translate(-760 * (1 - sl), 0); ctx.translate(80, 604); ctx.rotate(-0.015);
    paint(rrectPts(0, 0, tw + 50, 96, 12), { fill: C.cream, key: 'fdfnc', line: C.yellow, w: 4, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.5, per: 90 }] });
    handText(str, 25, 64, 50, C.red, { key: 'fdfn', frac: ev(tN + 0.35, 0.5), weight: 700 });
    ink([[25, 78], [25 + tw, 80]], { w: 4, color: C.red, key: 'fdfnu', frac: ev(tN + 0.9, 0.3) });
    ctx.restore();
  }
  serverProp(P.x, P.y, { state: 'patched', s: P.s, dark: true });
  inkTag('phòng thủ thêm');
};

// =====================================================================
//  today — the 5-item checklist ticking with the voice; a row of servers listed and searched for HTTP/2/3;
//  randomize_va_space → 2 held to the end; the end card
// =====================================================================
SCENES.today = function () {
  const id = 'today', t0 = ET(id), vw = (w, n) => VW(id, w, n);
  paperSheet(id);
  const P = f_srvPath([[t0 + 0.5, 830, 1360, 0.55], [vw('đang'), 720, 1335, 0.62, 0.8]]);   // the finale: the green server steps forward
  const ITEMS = ['liệt kê máy chạy NGINX', 'tìm máy bật HTTP/2, HTTP/3', 'Ubuntu: tắt tạm, chờ USN', 'Docker: kéo 1.30.7 / 1.31.9', 'kiểm tra SCTP, ASLR'];
  const tW = [vw('liệt') - 0.2, vw('tìm') - 0.2, vw('tắt') - 0.3, vw('nâng') - 0.2, vw('kiểm') - 0.2];
  const C1 = '$ cat /proc/sys/kernel/randomize_va_space', CPS = 30, TY = 960;   // ONE line (32 px): a wrapped path invites a typo
  const tTerm = vw('tắt') + 0.55;                   // ≈134.5: typed early so the answer stays up to the end
  const tOutp = tTerm + C1.length / CPS + 0.25;
  const tK = [vw('nginx') + 0.1, vw('ba') + 0.1, vw('hoặc', 2), vw('và'), tOutp + 0.1];
  const RY = (i) => 470 + i * 96;
  let cur = -1;
  ITEMS.forEach((s, i) => {
    const y = RY(i);
    if (TT >= tW[i]) cur = i;
    // the line being spoken gets a marker band that sweeps on with the writing, then fades when the next starts
    if (TT >= tW[i]) {
      const nxt = i < 4 ? tW[i + 1] : 1e9, al = 0.6 * (1 - seg(TT, nxt, nxt + 0.4));
      if (al > 0.01) paint(rrectPts(150, y - 50, (handW(s, 46) + 30) * EZ.o3(seg(TT, tW[i], tW[i] + 0.6)), 66, 12), { fill: `rgba(247,221,146,${al.toFixed(3)})`, key: 'fymk' + i, line: false });
    }
    f_sc(106, y - 16, popS(t0 + 0.55 + i * 0.08), () => {
      paint(rrectPts(80, y - 44, 54, 54, 9), { fill: '#fbf6ea', key: 'fyb' + i, w: 3.5, tex: [{ k: 'hatch', gap: 6, al: 0.15 }] });
    });
    if (TT >= tW[i]) handText(s, 160, y, 46, C.ink, { key: 'fyt' + i, frac: ev(tW[i], 0.6) });
    f_tick(108, y - 18, 60, ev(tK[i], 0.25), C.green, 'fyk' + i);
  });
  // the pencil follows the line being written, then idles beside it
  if (cur >= 0 && TT < tW[4] + 0.8) {
    const y = RY(cur), wv = handW(ITEMS[cur], 46), f = ev(tW[cur], 0.6);
    drawPencil(170 + wv * f + 6 * Math.sin(TT * 9), y - 6 + 4 * Math.cos(TT * 7), 0.55, 220, 0.8, 'fyp');
  }

  // ---- items 1–2 illustrated: every NGINX machine listed in a row, then searched for HTTP/2 / HTTP/3
  const tOutR = tTerm - 0.5, outR = EZ.i2(seg(TT, tOutR, tOutR + 0.35));
  if (TT < tOutR + 0.35) {
    const MX = [180, 400, 620, 840], tPop = [vw('mọi'), vw('máy'), vw('chạy'), vw('nginx')];
    const tMag0 = vw('tìm'), tMag1 = vw('ba') + 0.1, HAS = [1, 0, 1, 0];
    const magX = lerp(110, 910, EZ.io(seg(TT, tMag0, tMag1)));
    ctx.save(); ctx.globalAlpha = 1 - outR; ctx.translate(510, 1060); ctx.scale(1 - 0.35 * outR, 1 - 0.35 * outR); ctx.translate(-510, -1060 + 160 * outR);
    MX.forEach((x, i) => {
      const found = (HAS[i] || i === 3) && TT >= tMag0 && magX > x;
      f_sc(x, 1060, popS(tPop[i]), () => serverProp(x, 1060, { s: 0.42, state: found ? 'vuln' : 'down', h2: HAS[i] ? popS(vw('bật') + i * 0.12) : 0, key: 'fym' + i }));
      if (found) ink(ellipsePts(x, 1062, 92, 100, 0, 40), { closed: true, w: 4.5, color: C.red, key: 'fymr' + i, frac: ev(tMag0 + 0.01 + (x - 110) / 800 * (tMag1 - tMag0), 0.3) });
    });
    chip('HTTP/3', 770, 972, C.yellow, { size: 30, s: popS(vw('ba')), tc: C.ink, key: 'fyh3' });
    if (TT >= tMag0 - 0.2 && TT < tMag1 + 0.6) {   // the magnifier sweeps the row
      const my = 1050 + 10 * Math.sin(TT * 3), a = popS(tMag0 - 0.2) * (1 - seg(TT, tMag1 + 0.3, tMag1 + 0.6));
      f_sc(magX, my, a, () => {
        ink([[magX + 56, my + 56], [magX + 120, my + 120]], { w: 14, color: C.woodD, key: 'fymgh', amt: 0.6 });
        paint(ellipsePts(magX, my, 78, 78, 0, 40), { fill: 'rgba(255,255,255,0.28)', key: 'fymg', line: C.ink, w: 6 });
      });
    }
    ctx.restore();
  }

  // ---- item 5: the ASLR check, typed from ≈134.5 and held to the end (the end card shares the last seconds)
  f_sc(510, TY + 110, popS(tTerm - 0.3), () => {
    termCard(60, TY, 900, [{ s: C1 }, { s: '2', out: true, c: '#5de37a' }], { size: 32, t0: tTerm, cps: CPS, key: 'fyT' });
    if (TT >= tOutp) {   // ring the answer
      const by = TY + 70 + 1 * 32 * 1.45 + 32 * 0.4;
      ink(ellipsePts(99, by - 13, 32, 34, 0, 30), { closed: true, w: 5, color: '#5de37a', key: 'fy2r', frac: ev(tOutp + 0.1, 0.35) });
    }
  });
  if (TT >= tOutp) {
    handText('ASLR đang bật', 90, 1268, 50, C.green, { key: 'fyas', frac: ev(tOutp, 0.4), weight: 700 });
    f_tick(90 + handW('ASLR đang bật', 50, 700) + 44, 1250, 54, ev(tOutp + 0.35, 0.2), C.green, 'fyask');
  }
  serverProp(P.x, P.y, { state: 'patched', s: P.s });
  const tB = DURATION - 1.5;
  if (TT >= tB) {
    const s = 'besoft.vn', w = handW(s, 56, 700);
    handText(s, 540 - w / 2 - 60, 1410, 56, C.ink, { key: 'fyend', frac: ev(tB, 0.5), weight: 700 });
    ink([[480 - w / 2, 1428], [480 + w / 2, 1430]], { w: 3, color: C.terra, key: 'fyendu', frac: ev(tB + 0.4, 0.35) });
  }
  inkTag('việc hôm nay');
};
