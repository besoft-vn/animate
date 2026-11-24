// =====================================================================
//  sc-room.js — the room scenes (owned by the sc-room agent; prefix RM_).
//  hook (0–7.25)       router (left) sends 3 blue arcs to the phone (right); a blue "Wi‑Fi" label glides down onto a
//                      spectrum strip drawn on "ánh sáng": a long blue radio band ("sóng vô tuyến", Wi‑Fi tick) … a
//                      NARROW rainbow slit ("mắt thấy"). On "không nhìn thấy" the rest dims and the slit is boxed.
//  fly  (35.75–41.75)  room: router | wall | phone. A blue sine leaves the router's antenna and runs RIGHT, through the
//                      wall (a little weaker after it), and touches the phone's antenna on "chạm". "≈ 300 000 km/s".
//                      Pause: the crests keep arriving, the antenna tip pulses.
//  read (41.75–50, SLAM) close-up of the phone: the (modulated) wave arrives at the antenna; the purple electron rides
//                      the wave's value at the antenna; 4 yellow bit groups are written; the gold photo builds band by
//                      band on the screen; flash; the hero hops (happy).
//  end  (56–63.5)      the hook's room, changed: the photo is on the phone; the arcs carry small bit groups; on "sóng vô
//                      hình" the spectrum strip comes back (Wi‑Fi far from the visible slit).
// =====================================================================

// ---- the shared room (hook / end): router left, phone right
const RM_R = { x: 220, y: 720, s: 0.8 }, RM_P = { x: 760, y: 600, s: 0.72 };
const RM_TIP = () => [RM_R.x + (300 * RM_R.s) / 2 - 50 * RM_R.s, RM_R.y - 110 * RM_R.s - 170 * RM_R.s];   // right antenna tip

// ---- the spectrum strip: one continuous band (same family): radio (blue, long) … a narrow visible slit (rainbow)
const RM_SP = { x0: 70, x1: 700, y: 990, h: 50, radio: 470, v0: 600, v1: 636, wifi: 430 };
function RM_spectrum(p, o = {}) {
  if (p <= 0) return;
  const S = RM_SP, dim = o.dim ?? 0, xe = lerp(S.x0, S.x1, clamp(p));
  ctx.save(); ctx.beginPath(); ctx.rect(S.x0 - 10, S.y - 20, xe - S.x0 + 20, S.h + 40); ctx.clip();
  // fills: radio = blue; the rest of the invisible spectrum = grey; the visible slit = rainbow
  ctx.globalAlpha = 0.55; ctx.fillStyle = COL.wave; ctx.fillRect(S.x0, S.y, S.radio - S.x0, S.h);
  ctx.globalAlpha = 0.22 * (1 - 0.5 * dim); ctx.fillStyle = COL.dev;
  ctx.fillRect(S.radio, S.y, S.v0 - S.radio, S.h); ctx.fillRect(S.v1, S.y, S.x1 - S.v1, S.h);
  const g = ctx.createLinearGradient(S.v0, 0, S.v1, 0);
  ['#ff3b30', '#ff9500', '#ffd60a', '#34c759', '#0a84ff', '#5e5ce6', '#bf5af2'].forEach((c, i) => g.addColorStop(i / 6, c));
  ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(S.v0, S.y, S.v1 - S.v0, S.h);
  ctx.restore();
  showCreation([[S.x0, S.y], [S.x1, S.y], [S.x1, S.y + S.h], [S.x0, S.y + S.h]], clamp(p), { c: COL.devD, w: 3, closed: true });
  // the Wi‑Fi tick under the radio band
  segLine(S.wifi, S.y + S.h, S.wifi, S.y + S.h + 22, COL.wave, 5, seg(p, 0.6, 0.8));
}
// the labels of the strip (each with its own Write progress)
function RM_spLabels(pRadio, pEye, pWifi, box = 0) {
  const S = RM_SP;
  if (pRadio > 0) vt('sóng vô tuyến', (S.x0 + S.radio) / 2, S.y - 26, 52, pRadio, { col: COL.wave });
  if (pEye > 0) vt('mắt thấy', (S.v0 + S.v1) / 2 - 4, S.y + S.h + 76, 52, pEye);
  if (pWifi > 0) vt('Wi‑Fi', S.wifi - 40, S.y + S.h + 76, 52, pWifi, { col: COL.wave });
  if (box > 0) {   // the narrow slit, boxed: "only this sliver is visible"
    const pad = 10, P = [[S.v0 - pad, S.y - pad], [S.v1 + pad, S.y - pad], [S.v1 + pad, S.y + S.h + pad], [S.v0 - pad, S.y + S.h + pad]];
    showCreation(P, box, { c: COL.text, w: 4, closed: true });
  }
}

// ---- arcs from (x, y) to the right; o.bits: a bit group rides in a gap at the middle of each arc
function RM_arcs(x, y, t, o = {}) {
  const n = 3, r0 = o.r0 ?? 40, r1 = o.r1 ?? 400, sp = o.speed ?? 150, A = o.span ?? 0.42, al = o.al ?? 1, span = r1 - r0, gap = span / n;
  if (al <= 0) return;
  for (let i = 0; i < n; i++) {
    const k0 = Math.floor((t * sp + i * gap) / span), r = r0 + mod(t * sp + i * gap, span), f = 1 - (r - r0) / span;
    const k = Math.min(1, (r - r0) / 40) * Math.min(1, f * 3) * al; if (k <= 0.02) continue;
    if (o.bits && r > 90) {
      const ga = Math.asin(Math.min(1, 34 / r));
      showCreation(arcPts(x, y, r, -A, -ga, 18), 1, { c: COL.wave, w: 12, al: k });
      showCreation(arcPts(x, y, r, ga, A, 18), 1, { c: COL.wave, w: 12, al: k });
      const B = ['01', '10', '11', '00', '10', '01'][mod(k0 * 3 + i, 6)];
      mText([{ s: B, c: COL.bit }], x + r, y + 17, 50, { align: 'center', alpha: Math.min(1, k * 1.6) });
    } else showCreation(arcPts(x, y, r, -A, A, 24), 1, { c: COL.wave, w: 12, al: k });
  }
}

// ---- a travelling wave with an amplitude envelope in the wave's own frame. Crests move RIGHT at v px/s.
// value(x) = A(x − v t) · sin(2π (x − v t) / lam). xFront: the wave exists only left of it (taper over 40 px).
function RM_waveVal(x, t, o) {
  const u = x - o.v * t, A = typeof o.amp === 'function' ? o.amp(u, x) : o.amp;
  return A * Math.sin(TAU * u / o.lam);
}
function RM_wave(x0, x1, y, t, o) {
  if (x1 <= x0 + 2) return;
  const P = [];
  for (let x = x0; x <= x1 + 0.1; x += 3) {
    const tap = o.front != null ? clamp((o.front - x) / 40) : 1, tl = clamp((x - x0) / 30);
    P.push([x, y - RM_waveVal(x, t, o) * tap * (o.tail === false ? 1 : tl)]);
  }
  RM_fill(P, y, o.al ?? 1);
  showCreation(P, 1, { c: COL.wave, w: o.w ?? 8, al: o.al ?? 1 });
}
function RM_fill(P, base, al = 1) {
  ctx.save(); ctx.globalAlpha = 0.22 * al; ctx.fillStyle = COL.wave; ctx.beginPath(); ctx.moveTo(P[0][0], typeof base === 'function' ? base(P[0][0]) : base);
  P.forEach(([x, y]) => ctx.lineTo(x, y)); for (let i = P.length - 1; i >= 0; i--) ctx.lineTo(P[i][0], typeof base === 'function' ? base(P[i][0]) : base);
  ctx.closePath(); ctx.fill(); ctx.restore();
}
// the receiver lights up each time a wave front arrives (period = arc gap / speed)
const RM_pulse = (t, period) => 0.5 + 0.5 * Math.cos(TAU * t / period);

// ---- a phone antenna: a grey rod standing on the phone's top-left, with a tip ball. Returns [x, yTop, yBot].
function RM_rod(ph, s, p = 1, glow = 0) {
  const x = ph.l + 40 * s, yb = ph.t + 4, yt = ph.t - 100 * s;
  segLine(x, yb, x, lerp(yb, yt, p), COL.dev, 8 * s, 1);
  if (p > 0.95) mDot(x, yt, 9 * s, COL.dev);
  if (glow > 0) glowAt(x, (yt + ph.t) / 2, 60 * s, COL.wave, 0.5 * glow);
  return [x, yt, yb];
}

// =====================================================================
//  HOOK (0–7.25) — "Wi‑Fi cùng một họ với ánh sáng, chỉ là loại sóng mà mắt ta không nhìn thấy."
// =====================================================================
SCENES.hook = function () {
  const tWifi = VW('hook', 'Wi-Fi'), tAnh = VW('hook', 'ánh'), tChi = VW('hook', 'chỉ'), tKhong = VW('hook', 'không');
  router(RM_R.x, RM_R.y, RM_R.s);
  const ph = phone(RM_P.x, RM_P.y, RM_P.s);
  const [tx, ty] = RM_TIP();
  // the arcs fade a little (not out) on "không nhìn thấy": still there, just not for our eyes
  RM_arcs(tx, ty, TT, { r1: 360, speed: 160, al: clamp(TT / 0.4) * (1 - 0.35 * seg(TT, tKhong, tKhong + 0.6)) });
  // a soft blue glow at the phone: the arcs reach it
  glowAt(RM_P.x, RM_P.y - 40, 190, COL.wave, clamp(TT / 0.6) * (0.08 + 0.3 * RM_pulse(TT - 0.33, 320 / 3 / 160)));
  // "Wi‑Fi" is written over the arcs, then glides down onto the strip's Wi‑Fi tick
  const g = EZ.io(seg(TT, tAnh + 0.4, tAnh + 1.3));
  vt('Wi‑Fi', lerp(480, RM_SP.wifi - 40, g), lerp(770, RM_SP.y + RM_SP.h + 76, g), 56 - 4 * g, runS(tWifi, 0.7), { col: COL.wave });
  // the spectrum strip on "ánh sáng"
  const sp = runS(tAnh, 1.0), dim = seg(TT, tKhong, tKhong + 0.5);
  RM_spectrum(sp, { dim });
  RM_spLabels(runS(tAnh + 0.7, 0.9), runS(tChi, 0.9), 0, runS(tKhong, 0.6));
  // the hero: looks at the arcs, then at the strip, then at the slit; wow from "ánh sáng"
  const look = TT < tAnh ? [ph.l, RM_P.y - 80] : TT < tKhong ? [RM_SP.wifi, RM_SP.y] : [(RM_SP.v0 + RM_SP.v1) / 2, RM_SP.y];
  heroAt(...HOME, { look, mood: TT > tAnh + 0.2 && TT < EE('hook') - 0.5 ? 'wow' : 'calm' });
  viTag('1', TITLES.hook);
};

// =====================================================================
//  FLY (35.75–41.75) — "Sóng lao đi với tốc độ ánh sáng, xuyên qua tường, chạm vào ăng-ten điện thoại..."
// =====================================================================
const RM_F = { rx: 190, ry: 700, rs: 0.8, wx: 500, wy0: 410, wy1: 1000, ww: 80, px: 780, py: 720, ps: 0.78 };
function RM_flyFront(t) {
  return keysM([[VW('fly', 'lao') - 0.1, RM_F.rx + 80], [VW('fly', 'xuyên'), RM_F.wx - 20], [VW('fly', 'chạm'), 712]], t);
}
SCENES.fly = function () {
  const E = ET('fly'), tLao = VW('fly', 'lao'), tToc = VW('fly', 'tốc'), tXuyen = VW('fly', 'xuyên'), tCham = VW('fly', 'chạm'), tAng = VW('fly', 'ăng-ten');
  const F = RM_F, pb = runS(E + 0.05, 0.9);
  const rt = router(F.rx, F.ry, F.rs, { p: lagged(pb, 0, 3, 0.5) });
  wall(F.wx, F.wy0, F.wy1, F.ww, { p: lagged(pb, 1, 3, 0.5) });
  const ph = phone(F.px, F.py, F.ps, { p: lagged(pb, 2, 3, 0.5) });
  const hit = seg(TT, tCham - 0.05, tCham + 0.25);
  const [ax, ayt, ayb] = RM_rod(ph, F.ps, lagged(pb, 2, 3, 0.5), hit * (0.75 + 0.25 * Math.sin(TT * 7.1)));
  const [sx, sy] = rt.tips[1], wy = (ayt + ayb) / 2 - 8;
  // the wave: leaves the router tip, bends to the antenna's height, runs RIGHT; weaker after the wall
  const front = Math.min(RM_flyFront(TT), ax);
  const amp = (u, x) => lerp(58, 36, smoothM((x - (F.wx - F.ww / 2)) / F.ww));
  const yOf = (x) => lerp(sy, wy, smoothM((x - sx) / 60));
  if (TT > tLao - 0.1 && front > sx + 4) {
    const P = [], o = { v: 225, lam: 150, amp };
    for (let x = sx; x <= front; x += 3) P.push([x, yOf(x) - RM_waveVal(x, TT, o) * clamp((front - x) / 40) * clamp((x - sx) / 30)]);
    RM_fill(P, yOf); showCreation(P, 1, { c: COL.wave, w: 8 });
  }
  // the router's antenna rings at the wave's own rhythm while it sends
  if (TT > tLao - 0.1) glowAt(sx, sy, 120, COL.wave, 0.12 + 0.3 * RM_pulse(TT, 150 / 225));
  // direction: a blue arrow under the wave, router -> phone
  mArrow(300, 590, 420, 590, COL.wave, 5, runS(tLao, 0.6));
  // labels
  vt('tường', F.wx, F.wy1 + 64, 52, runS(tXuyen, 0.7), { col: COL.dev });
  vt('ăng-ten', ax + 112, ayt - 6, 52, runS(tAng - 0.1, 0.7), { col: COL.dev });
  vt('≈ 300 000 km/s', 330, 1160, 58, runS(tToc, 0.9));
  if (hit > 0) flashAt(ax, wy, seg(TT, tCham, tCham + 0.45), COL.wave, 34);
  // the hero: follows the wave front, wow; a little hop when it touches
  const hop = seg(TT, tCham + 0.1, tCham + 0.7);
  heroAt(...HOME, { look: [front, wy], mood: TT > tLao && TT < EE('fly') ? 'wow' : 'calm', hop: TT > E + 0.6 ? hop : 0 });
  viTag('7', TITLES.fly);
};

// =====================================================================
//  READ (41.75–50, SLAM) — "Electron trong đó rung theo, và điện thoại dịch ngược ra số không, số một!"
// =====================================================================
const RM_D = { px: 580, py: 810, ps: 1.2, lam: 150, v: 225, L: 225 };
const RM_GROUPS = ['0110', '1011', '0010', '1101'];
const RM_AMPS = [62, 34, 50, 40];
function RM_readAmp(u) {   // symbol amplitudes in the wave's frame, blended over 50 px
  const L = RM_D.L, i = Math.floor(u / L), f = u / L - i, a = RM_AMPS[mod(i, 4)], b = RM_AMPS[mod(i + 1, 4)];
  return lerp(a, b, smoothM((f - 0.85) / 0.15));
}
SCENES.read = function () {
  const tE = VW('read', 'Electron'), tDich = VW('read', 'dịch'), tMot = VW('read', 'một');
  const D = RM_D, ph = phone(D.px, D.py, D.ps, { screen: RM_screen });
  const [ax, ayt, ayb] = RM_rod(ph, D.ps, 1, 0.55 + 0.2 * Math.sin(TT * 4.3));
  const wy = (ayt + ayb) / 2;
  const o = { v: D.v, lam: D.lam, amp: RM_readAmp };
  RM_wave(60, ax, wy, TT, o);
  // the electron rides the wave's value right at the antenna (scaled to the rod)
  const ey = wy - 0.5 * RM_waveVal(ax, TT, o);
  glowAt(ax, ey, 110, COL.elec, 0.45);
  electron(ax, ey, 24);
  vt('electron', ax + 170, wy + 10, 54, runS(tE - 0.1, 0.8), { col: COL.elec });
  // the decoded bit groups: one per wave shape, written left of the phone, then pointed at the screen
  RM_GROUPS.forEach((b, i) => bitRow(b, 230, 660 + i * 110, 64, runS(tDich + i * 0.5, 0.6), { gap: 38 }));
  mArrow(340, 800, 410, 800, COL.devD, 5, runS(tDich + 0.2, 0.5));
  // done: flash on the photo
  const done = RM_bandT(3) + 0.55;
  if (TT > done) flashAt(D.px, 740, seg(TT, done, done + 0.5), COL.photo, 60);
  // the hero: happy, looks at the screen; two little hops on "số một!" (back home well before 49.5)
  const h = seg(TT, tMot + 0.1, tMot + 0.6), h2 = seg(TT, tMot + 0.75, tMot + 1.25);
  heroAt(...HOME, { look: [D.px, 760], mood: 'happy', hop: TT < EE('read') - 0.6 ? Math.max(h < 1 ? h : 0, h2 < 1 ? h2 : 0) : 0 });
  viTag('8', TITLES.read);
};
const RM_bandT = (i) => VW('read', 'dịch') + i * 0.5 + 0.35;
function RM_screen(l, t, w, h) {
  // the photo builds band by band (4 bands = 4 bit groups); a faint dashed frame waits for it
  const pw = 220, phh = 170, cx = l + w / 2, cy = t + 160, pl = cx - pw / 2, pt = cy - phh / 2;
  ctx.save(); ctx.setLineDash([10, 10]); ctx.globalAlpha = 0.5; ctx.strokeStyle = COL.devD; ctx.lineWidth = 3; ctx.strokeRect(pl, pt, pw, phh); ctx.restore();
  let k = 0; for (let i = 0; i < 4; i++) k += 0.25 * smoothM(seg(TT, RM_bandT(i), RM_bandT(i) + 0.4));
  if (k > 0.001) {
    ctx.save(); ctx.beginPath(); ctx.rect(pl - 10, pt - 10, pw + 20, (phh + 20) * k); ctx.clip();
    photoCard(cx, cy, pw, phh, 1); ctx.restore();
  }
}

// =====================================================================
//  END (56–63.5) — "Vậy đấy: bức ảnh của bạn vừa bay qua căn phòng, trên một làn sóng vô hình."
// =====================================================================
SCENES.end = function () {
  const E = ET('end'), tAnh = VW('end', 'ảnh'), tBay = VW('end', 'bay'), tSong = VW('end', 'sóng'), tVo = VW('end', 'vô');
  router(RM_R.x, RM_R.y, RM_R.s);
  const ph = phone(RM_P.x, RM_P.y, RM_P.s, {
    screen: (l, t, w, h) => {
      const s = indicateS(seg(TT, tAnh, tAnh + 0.6), 0.12);
      ctx.save(); ctx.translate(l + w / 2, t + 120); ctx.scale(s, s); photoCard(0, 0, w - 30, (w - 30) * 0.77, 1); ctx.restore();
    },
  });
  const [tx, ty] = RM_TIP();
  RM_arcs(tx, ty, TT, { bits: true, r1: 350, speed: 155 });
  glowAt(RM_P.x, RM_P.y - 40, 190, COL.wave, 0.08 + 0.3 * RM_pulse(TT - 0.33, 310 / 3 / 155));
  // the spectrum comes back on "sóng vô hình": Wi‑Fi sits far from the narrow visible slit
  RM_spectrum(runS(tSong, 0.9), { dim: seg(TT, tVo + 0.6, tVo + 1.1) });
  RM_spLabels(0, runS(tVo + 0.3, 0.8), runS(tSong + 0.3, 0.8), runS(tVo + 0.7, 0.6));
  // the hero: happy; hops on "bay qua căn phòng" (clear of the bridge at 56)
  const h = seg(TT, tBay, tBay + 0.55);
  heroAt(...HOME, { look: TT < tSong ? [ph.l + 40, RM_P.y] : [RM_SP.wifi, RM_SP.y], mood: TT > E + 0.5 ? 'happy' : 'calm', hop: h < 1 ? h : 0 });
  viTag('10', TITLES.end);
};
