// =====================================================================
//  SC-DESK — hook, intro, lesson, fix (paper world: the dev's desk, the editor, the chain, the checklist)
//  The red key (keyProp, KS, unrotated) sits exactly on the BR points for 0.5 s either side of each bridge.
// =====================================================================
const d_KEYSTR = 'API_KEY=', d_SECRET = 'sk-live-8f3a9c';
const d_MONO = 40;
// a gentle bob that is exactly 0 outside [a, b] (so the key is exact at the bridges)
const d_bob = (a, b, amp = 7, f = 0.55) => (TT <= a || TT >= b ? 0 : amp * Math.sin(TAU * f * (TT - a)) * clamp((TT - a) / 0.4) * clamp((b - TT) / 0.4));
// a green hand check mark, written on
function d_check(x, y, s, frac, key, w = 9) {
  if (frac <= 0) return;
  ink([[x - 0.5 * s, y], [x - 0.12 * s, y + 0.38 * s], [x + 0.6 * s, y - 0.5 * s]], { color: C.green, w, key, frac, amt: 1.2 });
}
// the dev's laptop on the desk (shared by hook and fix: end = start, changed)
function d_laptop(k) {
  woodSurface(-40, -40, W + 40, H + 40, k + 'wd', { gal: 0.22 });
  paint(rrectPts(130, 670, 860, 650, 34), { fill: 'rgba(58,36,23,0.28)', line: false, key: k + 'sh', tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.5 }] });
  // base
  paint([[110, 1236], [970, 1236], [1030, 1300], [50, 1300]], { fill: '#bcb7ab', key: k + 'base', w: 3.2, tex: [{ k: 'hatch', a: 0.15, gap: 6, al: 0.4, dens: (x, y) => clamp((y - 1236) / 64 + 0.2) }] });
  ink([[460, 1250], [620, 1250]], { w: 3, key: k + 'pad' });
  // lid + screen
  paint(rrectPts(110, 640, 860, 600, 30), { fill: '#6b6570', key: k + 'lid', w: 3.4, tex: [{ k: 'cross', c: '#2e2a33', al: 0.35, gap: 7, dens: (x, y) => clamp((x + y - 1300) / 900 + 0.3) }] });
  paint(rrectPts(140, 670, 800, 540, 16), { fill: C.cream, key: k + 'scr', w: 2.6, tex: [{ k: 'pencil', c: '#fffaf0', al: 0.5, per: 160 }, { k: 'hatch', a: 0.8, gap: 7, al: 0.1, dens: (x, y) => clamp((x + y - 1500) / 600) }] });
  // the assistant's header
  paint(ellipsePts(196, 726, 20, 20, 0, 24), { fill: '#9b95a0', key: k + 'av', w: 2.4, tex: [{ k: 'hatch', gap: 5, al: 0.4 }] });
  handText('Trợ lý AI', 232, 744, 48, C.ink, { key: k + 'hd' });
  ink([[170, 772], [910, 772]], { w: 2, color: 'rgba(58,36,23,0.45)', key: k + 'hl' });
}
// the chat box: "API_KEY=" + the secret (red once highlighted). count = characters shown
function d_chat(k, count, o = {}) {
  const x = 170, y = 1060, w = 740, h = 104, ty = y + h / 2 + 15, cw = monoW(d_MONO), tx = x + 30;
  paint(rrectPts(x, y, w, h, 22), { fill: C.paper, key: k + 'cb', w: 3.2, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.5, per: 90 }] });
  const n1 = Math.min(count, d_KEYSTR.length), n2 = clamp(count - d_KEYSTR.length, 0, d_SECRET.length);
  const sx = tx + cw * d_KEYSTR.length;
  if ((o.hl ?? 0) > 0 && n2 > 0) paint(rrectPts(sx - 8, ty - 36, (cw * n2 + 16) * clamp(o.hl), 50, 8), { fill: 'rgba(212,56,44,0.22)', line: false, key: k + 'hlr', tex: [{ k: 'hatch', c: C.red, a: -0.9, gap: 5, al: 0.45 }] });
  monoText(d_KEYSTR, tx, ty, d_MONO, C.ink, { key: k + 't1', count: n1 });
  if (n2 > 0) monoText(d_SECRET, sx, ty, d_MONO, (o.hl ?? 0) > 0.5 ? C.red : C.ink, { key: k + 't2', count: n2 });
  // caret
  if (o.caret !== false && (B % 12) < 7) { const cx = tx + cw * (n1 + n2) + 4; ink([[cx, ty - 34], [cx, ty + 8]], { w: 3, key: k + 'car', amt: 0.4 }); }
  // send button
  const ps = o.press ? 1 - 0.18 * Math.sin(Math.PI * clamp(o.press)) : 1;
  ctx.save(); ctx.translate(862, y + h / 2); ctx.scale(ps, ps);
  paint(ellipsePts(0, 0, 30, 30, 0, 28), { fill: '#9b95a0', key: k + 'sb', w: 2.6, tex: [{ k: 'hatch', gap: 5, al: 0.4 }] });
  ink([[-12, 0], [12, 0]], { w: 4, key: k + 'sa1', color: C.paper, amt: 0.5 }); ink([[2, -10], [12, 0], [2, 10]], { w: 4, key: k + 'sa2', color: C.paper, amt: 0.5 });
  ctx.restore();
  return { sx, ty, cw };
}

// ---------------------------------------------------------------------
//  HOOK (0–5.75): a dev types a secret into the AI chat; "lỗ hổng phức tạp" gets crossed out; on "khoá" the key pops out
// ---------------------------------------------------------------------
SCENES.hook = function () {
  d_laptop('dh');
  // the crossed-out note: no complex exploit needed
  const tN = VW('hook', 'không') + 0.2, tL = VW('hook', 'lỗ'), tX = VW('hook', 'nào');
  const ns = popS(tN);
  if (ns > 0) {
    ctx.save(); ctx.translate(340, 520); ctx.rotate(-0.05); ctx.scale(ns, ns);
    paint(rrectPts(-226, -80, 452, 150, 8), { fill: C.yellowL, key: 'd_note', w: 2.6, tex: [{ k: 'pencil', c: C.yellow, al: 0.5, per: 70 }] });
    handText('lỗ hổng phức tạp', -196, 18, 50, C.ink, { key: 'd_nt', frac: ev(tL, 0.85) });
    ink([[-206, 4], [206, -6]], { w: 7, key: 'd_nx', frac: EZ.o2(ev(tX, 0.3)) });
    ink([[-200, -26], [196, 30]], { w: 5, key: 'd_nx2', frac: EZ.o2(ev(tX + 0.25, 0.25)) });
    ctx.restore();
  }
  // typing the secret, then it reads red ("vài chiếc khoá")
  const tK = VW('hook', 'khoá'), total = d_KEYSTR.length + d_SECRET.length;
  const count = Math.floor(seg(TT, 0.35, 3.55) * total);
  const { sx, ty, cw } = d_chat('dhc', count, { hl: ev(VW('hook', 'chiếc') - 0.4, 0.55) });
  // the key pops out of the text and floats to the bridge point
  const ox = sx + cw * d_SECRET.length / 2 - 60, oy = ty - 14;
  if (TT >= tK) {
    const u = seg(TT, tK, tK + 0.75), e = EZ.o3(u);
    if (u < 0.5) { const R = 1 - u * 2; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.1 + 0.8 * i / 6); ink([[ox + 60 + Math.cos(a) * 40, oy + Math.sin(a) * 40], [ox + 60 + Math.cos(a) * (40 + 50 * (1 - R)), oy + Math.sin(a) * (40 + 50 * (1 - R))]], { color: C.red, w: 4, key: 'd_hr' + i }); } }
    const [bx, by] = BR.hookIntro.a;
    const x = lerp(ox, bx, e), y = lerp(oy, by, e) - 90 * Math.sin(Math.PI * e);
    const s = u >= 1 ? KS : lerp(0.35, KS, EZ.back(u)), rot = u >= 1 ? 0 : 0.5 * (1 - e) * Math.sin(u * 9);
    keyProp(x, y, s, { rot });
  }
  inkTag('khoá nằm sai chỗ');
};

// ---------------------------------------------------------------------
//  INTRO (5.75–11.5): the "Cursor" editor with an AI side panel; the key glides into the AI panel; stamp "BỊ XÂM NHẬP"
// ---------------------------------------------------------------------
SCENES.intro = function () {
  paperSheet('d_intro');
  const X0 = 80, Y0 = 560, X1 = 1000, Y1 = 1270, PX = 640;
  const tStamp = VW('intro', 'xâm'), hit = TT >= tStamp;
  paint(rrectPts(X0 + 14, Y0 + 18, X1 - X0, Y1 - Y0, 26), { fill: 'rgba(58,36,23,0.25)', line: false, key: 'd_esh', tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.5 }] });
  paint(rrectPts(X0, Y0, X1 - X0, Y1 - Y0, 26), { fill: C.cream, key: 'd_ew', w: hit ? 5 : 3.4, line: hit ? C.red : C.ink, tex: [{ k: 'pencil', c: '#fffaf0', al: 0.5, per: 200 }] });
  // title bar
  paint(rrectPts(X0, Y0, X1 - X0, 84, 26), { fill: '#d9d1c0', key: 'd_etb', w: 3, tex: [{ k: 'hatch', a: 0.2, gap: 6, al: 0.3 }] });
  for (let i = 0; i < 3; i++) paint(ellipsePts(X0 + 40 + i * 34, Y0 + 42, 11, 11, 0, 16), { fill: '#9b95a0', key: 'd_ed' + i, w: 2 });
  const tC = VW('intro', 'cursor');
  handText('Cursor', 215, Y0 + 60, 54, C.ink, { key: 'd_ect', weight: 700 });
  ink([[212, Y0 + 72], [380, Y0 + 70]], { w: 4, key: 'd_ecu', frac: EZ.o2(ev(tC, 0.35)) });
  // AI side panel
  paint([[PX, Y0 + 84], [X1, Y0 + 84], [X1, Y1 - 26], [X1 - 8, Y1 - 8], [X1 - 26, Y1], [PX, Y1]], { fill: '#e6dcc6', key: 'd_ep', w: 2.6, tex: [{ k: 'hatch', a: 0.8, gap: 7, al: 0.16 }] });
  const tAI = VW('intro', 'ai');
  handText('AI', 670, Y0 + 150, 50, C.ink, { key: 'd_eai', weight: 700 });
  ink([[662, Y0 + 168], [662 + 70 * EZ.o2(ev(tAI, 0.3)), Y0 + 168]], { w: 4, key: 'd_eaiu', frac: ev(tAI, 0.3) > 0 ? 1 : 0 });
  // chat bubbles in the panel (abstract lines, appearing)
  const bub = (y, w, t, kk) => { const s = popS(t); if (s <= 0) return; ctx.save(); ctx.translate(670, y); ctx.scale(s, s); paint(rrectPts(0, -26, w, 52, 20), { fill: C.paper, key: kk, w: 2.6, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.5, per: 90 }] }); for (let j = 0; j < 2; j++) ink([[18, -8 + j * 16], [18 + (w - 40) * (j ? 0.6 : 1), -8 + j * 16]], { w: 3, color: 'rgba(58,36,23,0.55)', key: kk + 'l' + j }); ctx.restore(); };
  bub(1060, 280, tAI + 0.1, 'd_b1');
  bub(1140, 220, tAI + 0.6, 'd_b2');
  // typing dots after the AI bubbles (keep the panel alive until the stamp)
  if (TT > tAI + 0.9 && !hit) for (let i = 0; i < 3; i++) { const yy = 1215 - 8 * Math.max(0, Math.sin(TT * 9 - i * 0.9)); paint(ellipsePts(690 + i * 26, yy, 7, 7, 0, 12), { fill: C.ink, key: 'd_td' + i, w: 1.5 }); }
  // code lines typing (leave y 830–960 empty: the key's slot)
  const code = [['const ai = agent()', 720], ['ai.read(src)', 790], ['log.save(trace)', 1010], ['ai.chat(prompt)', 1080], ['deploy(build)', 1150], ['// TODO', 1220]];
  let t0 = ET('intro') + 0.35;
  code.forEach(([s, y], i) => { const n = Math.floor(seg(TT, t0, t0 + s.length * 0.045) * s.length); t0 += s.length * 0.045 + 0.1; monoText(s, 120, y, 34, i === 2 ? '#8a5a3a' : C.ink, { key: 'd_cl' + i, count: n }); });
  // stamp under the window
  if (hit) {
    const u = seg(TT, tStamp, tStamp + 0.18), s = lerp(1.7, 1, EZ.o3(u));
    ctx.save(); ctx.translate(500, 1390); ctx.rotate(-0.06); ctx.scale(s, s);
    const str = 'BỊ XÂM NHẬP', w = handW(str, 74, 700) + 70;
    ink(rrectPts(-w / 2, -60, w, 120, 14), { closed: true, color: C.red, w: 8, key: 'd_st' });
    ink(rrectPts(-w / 2 + 12, -48, w - 24, 96, 10), { closed: true, color: C.red, w: 3, key: 'd_st2' });
    handText(str, -w / 2 + 35, 26, 74, C.red, { key: 'd_stt', weight: 700 });
    ctx.restore();
  }
  // the key: at the bridge, a small bob, then it glides into the AI panel
  const [ax, ay] = BR.hookIntro.b, [bx, by] = BR.introLink1.a, tm = tAI + 0.15;
  const m = EZ.io(seg(TT, tm, tm + 0.8));
  keyProp(lerp(ax, bx, m), lerp(ay, by, m) - 40 * Math.sin(Math.PI * m) + d_bob(ET('intro') + 0.5, tm, 16, 0.4) + d_bob(tm + 0.8, EE('intro') - 0.6, 5, 0.8), KS);
  inkTag('giữa tháng 11');
};

// ---------------------------------------------------------------------
//  LESSON (52.75–57.75): five ordinary grey links, then on "Ghép" they snap into one red chain; the key runs along it
// ---------------------------------------------------------------------
const d_LINK0 = [[400, 560, -0.5], [520, 830, 0.4], [660, 575, -0.3], [780, 820, 0.55], [880, 590, -0.2]];
function d_link(x, y, rot, s, red, key) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  paint(rrectPts(-82, -44, 164, 88, 44), { fill: red ? C.red : '#b9b3a8', key: key + 'o', w: 4, tex: [{ k: 'cross', c: red ? '#8f2018' : '#6e685f', al: 0.4, gap: 6 }] });
  paint(rrectPts(-50, -16, 100, 32, 16), { fill: C.paper, key: key + 'i', w: 3 });
  ctx.restore();
}
SCENES.lesson = function () {
  paperSheet('d_lesson');
  const tG = VW('lesson', 'ghép'), tW = VW('lesson', 'đường') - 0.55, tEnd = EE('lesson') - 0.6;
  const LY = 700, cx = (i) => 400 + i * 120;
  // red thread joining the rows on "Ghép"
  ink([[130, 964], [130, 1364]], { color: C.red, w: 6, key: 'd_lthr', frac: EZ.o2(ev(tG + 0.1, 0.6)) });
  // the list: one row per link, written on as the voice says "mỗi mắt xích"
  const tM = VW('lesson', 'mắt');
  CHAIN.forEach((s, i) => {
    const y = 980 + i * 100, t = tM + i * 0.26, on = TT >= tG + 0.15 + i * 0.1;
    const ps = popS(t); if (ps <= 0) return;
    ctx.save(); ctx.translate(130, y - 16); ctx.scale(ps, ps);
    paint(ellipsePts(0, 0, 26, 26, 0, 24), { fill: on ? C.red : '#cfc8bb', key: 'd_ln' + i, w: 2.6, tex: [{ k: 'hatch', gap: 5, al: 0.35, c: on ? '#8f2018' : C.ink }] });
    ctx.restore();
    handText(String(i + 1), 121, y - 1, 34, on ? C.paper : C.ink, { key: 'd_lnn' + i });
    handText(s, 180, y, 48, C.ink, { key: 'd_lt' + i, frac: ev(t, 0.45) });
  });
  // the links: scattered and bobbing, then snapping into a chain (left to right)
  for (let i = 0; i < 5; i++) {
    const [x0, y0, r0] = d_LINK0[i], ts = tG + i * 0.09;
    const u = springEase(TT - ts, SPRING.snappy.k, SPRING.snappy.d);
    const bob = TT < ts ? 6 * Math.sin(TT * 2.4 + i * 1.7) : 0;
    const passing = TT > tW ? Math.exp(-(((lerp(BR.harmLesson.b[0], BR.lessonFix.a[0], EZ.io(seg(TT, tW, tEnd - 0.05))) + 90 - cx(i)) / 60) ** 2)) : 0;
    d_link(lerp(x0, cx(i), u), lerp(y0 + bob, LY, u), lerp(r0, 0, u), 1 + 0.1 * passing, TT >= ts + 0.08, 'd_lk' + i);
  }
  // the key: at the start of the chain, then along it to the bridge point
  const [ax, ay] = BR.harmLesson.b, [bx, by] = BR.lessonFix.a;
  const m = EZ.io(seg(TT, tW, tEnd - 0.05));
  keyProp(lerp(ax, bx, m), lerp(ay, by, m) + d_bob(ET('lesson') + 0.5, tG - 0.1, 14, 0.5), KS);
  inkTag('bài học');
};

// ---------------------------------------------------------------------
//  FIX (57.75–69): the hook's chat box again; the key flies out of reach; three green items; the key is masked
// ---------------------------------------------------------------------
SCENES.fix = function () {
  d_laptop('df');
  const tD = VW('fix', 'dán'), tR = VW('fix', 'rời'), tDoi = VW('fix', 'đổi'), tBat = VW('fix', 'bật'), tChe = VW('fix', 'che');
  // checklist on the screen once the key is gone
  const rows = [['đổi khoá', tDoi, 0.45], ['bật chế độ riêng tư', tBat, 0.85], ['che dữ liệu trước khi gửi', tChe, 1.1]];
  const tBox = tR + 0.75;
  rows.forEach(([s, t, d], i) => {
    const y = 840 + i * 78;
    ink(rrectPts(176, y - 38, 44, 44, 8), { closed: true, w: 3.4, key: 'd_cb' + i, frac: EZ.o2(ev(tBox + i * 0.18, 0.3)) });
    handText(s, 244, y, 50, C.ink, { key: 'd_ct' + i, frac: ev(t, d) });
    d_check(198, y - 18, 34, EZ.o2(ev(t + d + 0.05, 0.25)), 'd_ck' + i, 7);
  });
  // chat box: the secret is there (red), wiped on "che", then the masked card + a green check
  const total = d_KEYSTR.length + d_SECRET.length;
  const wipe = seg(TT, tChe, tChe + 0.35), count = total - Math.round(wipe * d_SECRET.length);
  const { sx, ty } = d_chat('dfc', count, { hl: wipe < 1 ? 1 : 0, caret: wipe >= 1 || TT < tD, press: seg(TT, VW('fix', 'ai'), VW('fix', 'ai') + 0.3) });
  const tM = tChe + 0.4, ms = popS(tM);
  if (ms > 0) {
    ctx.save(); ctx.translate(sx + 60, ty - 14); ctx.scale(ms, ms); ctx.translate(-(sx + 60), -(ty - 14));
    keyProp(sx + 60, ty - 14, 0.72, { masked: true, key: 'd_mk' });
    ctx.restore();
    d_check(sx + 250, ty - 14, 40, EZ.o2(ev(tM + 0.35, 0.3)), 'd_mck', 9);
  }
  // a green outline writes around the chat box, then a slow green glow breathes (the last held second stays alive)
  const tG = tM + 1.1;
  if (TT >= tG) ink(rrectPts(160, 1050, 760, 124, 28), { closed: true, color: C.green, w: 5, key: 'd_gr', frac: EZ.o2(ev(tG, 0.7)) });
  // the key: exact at the bridge, dips toward the chat box on "dán", then flies away out of reach on "rời khỏi tay"
  const [kx, ky] = BR.lessonFix.b;
  if (TT < tR + 0.8) {
    const dip = 50 * EZ.io(seg(TT, tD, tD + 0.5)) * (1 - EZ.io(seg(TT, tD + 0.9, tR)));
    const f = EZ.i2(seg(TT, tR, tR + 0.75));
    const x = kx + 760 * f, y = ky + dip - 80 * EZ.io(seg(TT, tD + 0.9, tR)) * (1 - f) - 820 * f;
    if (TT < ET('fix') + 0.5) keyProp(kx, ky, KS);
    else keyProp(x, y, KS * (1 - 0.5 * f), { rot: -0.9 * f });
    if (f > 0 && f < 1) for (let i = 1; i <= 3; i++) { const g = Math.max(0, f - i * 0.07); ink([[kx + 760 * g + 30, ky - 820 * g - 80 * (1 - g)], [kx + 760 * (g + 0.04) + 30, ky - 820 * (g + 0.04) - 80 * (1 - g)]], { w: 3, color: 'rgba(58,36,23,0.5)', key: 'd_fl' + i }); }
  }
  // sign-off
  const tS = EE('fix') - 1.5;
  if (TT >= tS) handText('besoft.vn', 420, 1420, 46, '#6b5a4a', { key: 'd_bs', frac: ev(tS, 0.5) });
  inkTag('cách phòng tránh');
};
