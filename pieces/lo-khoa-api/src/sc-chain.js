// =====================================================================
//  sc-chain.js — link1..link4: navy "inside the systems" scenes. The red key hops link to link;
//  each scene clicks one more link into the chain strip at the top on its key voice word.
//  link1: servers Cursor -> Fireworks AI, the key is handed over, then slips out ("lộ").
//  link2: a vault; the key turns in its lock, the door swings open, log cards slide out.
//  link3: close-up of one log card; lines scroll; key strings light red, more keys pop out.
//  link4: three service doors open one by one; an account card "quyền xuất bản" turns red; freeze.
// =====================================================================
const c_X = (i) => 120 + 190 * i;                                   // chain link centre x
const c_pop = (t, d = 0.3) => (TT < t ? 0 : EZ.back(seg(TT, t, t + d)));
function c_at(x, y, s, fn) { if (s <= 0.01) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); fn(); ctx.restore(); }
// piecewise eased track: K rows [t, v0, v1, ...] -> values at TT
function c_path(K) {
  if (TT <= K[0][0]) return K[0].slice(1);
  for (let i = 1; i < K.length; i++) if (TT < K[i][0]) {
    const a = K[i - 1], b = K[i], u = EZ.io((TT - a[0]) / Math.max(1e-6, b[0] - a[0]));
    return a.slice(1).map((v, j) => lerp(v, b[j + 1], u));
  }
  return K[K.length - 1].slice(1);
}
// idle float, faded to zero at the window ends (so bridge holds stay exact)
function c_bob(a, b, amp = 9, f = 2.3) {
  const w = clamp(Math.min(TT - a, b - TT) / 0.35);
  return [Math.sin(TT * f) * amp * 0.6 * w, Math.sin(TT * f * 1.3 + 1) * amp * w];
}
// the red key; sy = vertical squash (turning in a lock)
function c_key(x, y, s = 1, rot = 0, sy = 1, key) {
  ctx.save(); ctx.translate(0, y); ctx.scale(1, Math.sign(sy || 1) * Math.max(0.07, Math.abs(sy))); ctx.translate(0, -y);
  keyProp(x, y, s, { dark: true, rot, key });
  ctx.restore();
}
// chain strip: link n clicks in at tc (with a red ring flash)
function c_chain(n, tc) {
  chainStrip(TT >= tc ? n : n - 1, { dark: true });
  const u = seg(TT, tc, tc + 0.45);
  if (u > 0 && u < 1) ink(rrectPts(c_X(n - 1) - 62 - 30 * u, 440 - 18 * u, 124 + 60 * u, 60 + 36 * u, 30 + 18 * u), { closed: true, color: `rgba(234,122,108,${(1 - u).toFixed(2)})`, w: 4, key: 'c_clk' + n });
}
// short caption card at the bottom, written on at t
function c_cap(str, t) {
  const f = () => { if (TT >= t) inkCard(str, CX, 1418, 50, { rot: 0.012, frac: ev(t, 0.5) }); };
  if (DEFER) DEFER.push(f); else f();
}
const c_dens = (x, y, w, h) => (px, py) => clamp(((px - x) / w + (py - y) / h) * 0.7 - 0.15);

// ---- link1 prop: a server box with a name plate and blinking slots
function c_server(x, y, w, h, label, key, o = {}) {
  paint(rrectPts(x, y, w, h, 20), { fill: C.navy2, line: C.peri, w: 3.5, key, tex: [{ k: 'hatch', c: C.periD, al: 0.4, gap: 7, dens: c_dens(x, y, w, h) }] });
  const sz = o.size ?? 52;
  handText(label, x + w / 2 - handW(label, sz) / 2, y + 72, sz, C.white, { key: key + 'l' });
  ink([[x + 18, y + 100], [x + w - 18, y + 100]], { color: C.periD, w: 2.5, key: key + 'd' });
  for (let i = 0; i < 3; i++) {
    const sy = y + 135 + i * 70;
    paint(rrectPts(x + 30, sy, w - 60, 46, 8), { fill: '#1d2050', line: C.periD, w: 2, key: key + 's' + i, tex: [{ k: 'hatch', c: C.periD, al: 0.3, gap: 5, a: 0 }] });
    const on = (B + i * 3 + key.length) % 7 < 4;
    ctx.fillStyle = on ? C.cyan : 'rgba(82,214,196,0.22)'; ctx.beginPath(); ctx.arc(x + w - 62, sy + 23, 8, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(200,208,240,0.35)'; ctx.fillRect(x + 50, sy + 20, 120, 6);
  }
  if (o.crack > 0) {   // the leak: a red crack in the lid
    const P = [[x + w * 0.38, y + 2], [x + w * 0.46, y + 26], [x + w * 0.53, y + 6], [x + w * 0.61, y + 34], [x + w * 0.7, y + 8], [x + w * 0.78, y + 28]];
    ink(P, { color: C.red, w: 6, frac: o.crack, key: key + 'cr' });
  }
}

// ---- link2 prop: a storage vault; open 0..1 swings the door (hinge right), wheel 0..1 spins the handle
function c_vault(open, wheel) {
  const x = 400, y = 1000, w = 480, h = 380;
  paint(rrectPts(x, y, w, h, 24), { fill: C.navy2, line: C.peri, w: 4, key: 'c_vb', tex: [{ k: 'cross', c: C.periD, al: 0.3, gap: 8, dens: c_dens(x, y, w, h) }] });
  handText('kho lưu trữ', x + w / 2 - handW('kho lưu trữ', 50) / 2, y + 58, 50, C.white, { key: 'c_vl' });
  // the recess and what it holds (sheets of log)
  paint(rrectPts(425, 1085, 430, 275, 14), { fill: '#06070f', line: C.periD, w: 2.5, key: 'c_vr', tex: [{ k: 'hatch', c: C.periD, al: 0.25, gap: 6, a: 0.2 }] });
  for (let i = 0; i < 4; i++) paint(rrectPts(470 + i * 6, 1290 - i * 34, 340, 26, 5), { fill: C.cream, line: C.periD, w: 2, key: 'c_vs' + i, tex: [{ k: 'hatch', gap: 4, al: 0.25, a: 0 }] });
  if (open > 0) ink(rrectPts(430, 1090, 420, 265, 12), { closed: true, color: `rgba(82,214,196,${(0.35 * open).toFixed(2)})`, w: 10, key: 'c_vg' });
  // the door
  ctx.save(); ctx.translate(855, 0); ctx.scale(Math.max(0.07, 1 - 0.93 * open), 1);
  paint(rrectPts(-430, 1085, 430, 275, 14), { fill: '#22265a', line: C.peri, w: 3.5, key: 'c_vd', tex: [{ k: 'cross', c: C.periD, al: 0.35, gap: 7 }] });
  const wx = -150, wy = 1222, a0 = wheel * Math.PI * 1.5;
  ink(ellipsePts(wx, wy, 66, 66, 0, 36), { closed: true, color: C.peri, w: 5, key: 'c_vw' });
  for (let k = 0; k < 4; k++) { const a = a0 + k * Math.PI / 2; ink([[wx, wy], [wx + Math.cos(a) * 82, wy + Math.sin(a) * 82]], { color: C.peri, w: 5, key: 'c_vwk' + k }); }
  paint(ellipsePts(wx, wy, 16, 16, 0, 16), { fill: C.cyan, line: C.peri, w: 2.5, key: 'c_vwc' });
  paint(ellipsePts(-375, wy - 6, 13, 13, 0, 16), { fill: '#05060c', line: C.peri, w: 2.5, key: 'c_vk' });
  paint([[-380, wy], [-370, wy], [-366, wy + 26], [-384, wy + 26]], { fill: '#05060c', line: C.peri, w: 2, key: 'c_vk2' });
  ctx.restore();
}

// ---- link2/link3 prop: a log card (cream sheet) with scrolling mono lines; o.red(i) -> 0..1 highlights a line red
function c_card(cx, cy, w, h, rot, s, o = {}) {
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s, s);
  const x = -w / 2, y = -h / 2, k = o.key || 'c_card', hh = o.hh ?? 80;
  paint(rrectPts(x + 8, y + 10, w, h, 16), { fill: 'rgba(0,0,0,0.4)', line: false, key: k + 'sh' });
  paint(rrectPts(x, y, w, h, 16), { fill: C.cream, key: k, line: C.peri, w: 3.5, tex: [{ k: 'pencil', c: '#e0d2b4', al: 0.5, per: 90 }, { k: 'hatch', gap: 5, al: 0.16, dens: c_dens(x, y, w, h) }] });
  if (o.header) handText(o.header, x + 28, y + hh * 0.7, o.hs ?? 46, C.ink, { key: k + 'h' });
  ink([[x + 18, y + hh], [x + w - 18, y + hh]], { w: 2.5, key: k + 'hl' });
  const L = o.lines || [], rh = o.rh ?? 44, fs = o.fs ?? 26, top = y + hh + 14, bot = y + h - 12;
  ctx.save(); ctx.beginPath(); ctx.rect(x + 10, top, w - 20, bot - top); ctx.clip();
  for (let i = 0; i < L.length; i++) {
    const ly = top + 40 + i * rh - (o.scroll ?? 0);
    if (ly < top + fs * 0.3 || ly - fs * 0.8 > bot) continue;
    const red = o.red ? o.red(i) : 0;
    if (red > 0) paint(rrectPts(x + 18, ly - fs * 0.95, (w - 36) * red, fs * 1.35, 8), { fill: 'rgba(212,56,44,0.2)', line: false, key: k + 'rb' + i, tex: [{ k: 'hatch', c: C.red, al: 0.4, gap: 5 }] });
    const ch = L[i][0];
    if (o.bars) { ink([[x + 30, ly - fs * 0.35], [x + 30 + Math.min(w - 80, L[i].length * fs * 0.55), ly - fs * 0.35]], { color: 'rgba(58,36,23,0.45)', w: fs * 0.38, key: k + 'b' + i }); continue; }
    monoText(L[i], x + 30, ly, fs, red > 0.5 ? C.red : ch === '$' || ch === '>' ? '#8a5a3a' : C.ink, { key: k + 't' + i, weight: red > 0.5 ? 700 : 400 });
  }
  ctx.restore();
  ctx.restore();
}
const c_LOG2 = ['$ agent run --task fix-login', 'read src/auth/login.ts', 'edit login.ts (+12 -4)', '> bash: npm test', '  14 passing, 1 failing', 'read .env', 'edit api/client.ts', '> bash: npm test', '  15 passing', '$ agent run --task deploy', 'read deploy.yml', '> bash: git push'];
const c_LOG3 = ['$ agent run --task fix-login', 'read src/auth/login.ts', 'edit login.ts (+12 -4)', '> bash: npm test',
  'OPENAI_API_KEY=sk-live-9f2a…', 'read package.json', 'STRIPE_KEY=sk_live_51Hq…', '> bash: curl api/pay',
  'GITHUB_TOKEN=ghp_7Rk2x…', 'edit README.md', 'DB_PASS=Tr0ub4dor&3…', '> bash: git commit', 'read docs/setup.md',
  '> bash: npm run build', 'edit src/app.ts', '> bash: npm test', '  16 passing'];

// ---- link4 props: a service door (hinge left) and the account card
function c_door(x, y, w, h, open, icon, key) {
  paint(rrectPts(x - 12, y - 12, w + 24, h + 24, 16), { fill: C.navy2, line: C.peri, w: 3, key: key + 'f', tex: [{ k: 'hatch', c: C.periD, al: 0.35, gap: 7, dens: c_dens(x, y, w, h) }] });
  paint(rrectPts(x, y, w, h, 10), { fill: open > 0 ? '#0f4650' : '#07080f', line: C.periD, w: 2, key: key + 'in', tex: [{ k: 'pencil', c: '#8ff5e6', al: 0.5 * open, per: 60, a: -0.4 }] });
  if (open > 0) { paint(ellipsePts(x + w * 0.6, y + h * 0.55, w * 0.28 * open, h * 0.3 * open, 0, 28), { fill: 'rgba(143,245,230,0.35)', line: false, key: key + 'lt' }); ink(rrectPts(x + 6, y + 6, w - 12, h - 12, 8), { closed: true, color: `rgba(82,214,196,${(0.6 * open).toFixed(2)})`, w: 9, key: key + 'gl' }); }
  ctx.save(); ctx.translate(x, 0); ctx.scale(Math.max(0.07, 1 - 0.78 * open), 1);
  paint(rrectPts(0, y, w, h, 10), { fill: '#262a63', line: C.peri, w: 3.5, key: key + 'p', tex: [{ k: 'cross', c: C.periD, al: 0.35, gap: 7 }] });
  const cx = w / 2, cy = y + h * 0.38, o = { color: C.peri, w: 4.5 };
  if (icon === 0) { ink(rrectPts(cx - 52, cy - 36, 104, 72, 6), { ...o, closed: true, key: key + 'i0' }); ink([[cx - 50, cy - 32], [cx, cy + 6], [cx + 50, cy - 32]], { ...o, key: key + 'i1' }); }
  else if (icon === 1) { for (const [dx, dy, r] of [[-30, 10, 28], [6, -10, 36], [40, 12, 26]]) ink(arcPts(cx + dx, cy + dy, r, Math.PI, TAU, 14), { ...o, key: key + 'c' + dx }); ink([[cx - 58, cy + 38], [cx + 66, cy + 38]], { ...o, key: key + 'cb' }); }
  else { ink(ellipsePts(cx, cy, 34, 34, 0, 28), { ...o, closed: true, key: key + 'g' }); for (let k = 0; k < 8; k++) { const a = k * TAU / 8; ink([[cx + Math.cos(a) * 38, cy + Math.sin(a) * 38], [cx + Math.cos(a) * 52, cy + Math.sin(a) * 52]], { ...o, key: key + 'gt' + k }); } }
  paint(ellipsePts(w - 32, y + h * 0.6, 11, 11, 0, 14), { fill: C.cyan, line: C.peri, w: 2, key: key + 'k' });
  ctx.restore();
}
function c_account(cx, cy, s, badge, red) {
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  const w = 720, h = 250, hot = red > 0.5;
  if (red > 0) ink(rrectPts(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16, 26), { closed: true, color: `rgba(212,56,44,${(0.3 * red).toFixed(2)})`, w: 22, key: 'c_acg' });
  paint(rrectPts(-w / 2 + 8, -h / 2 + 10, w, h, 22), { fill: 'rgba(0,0,0,0.4)', line: false, key: 'c_acs' });
  paint(rrectPts(-w / 2, -h / 2, w, h, 22), { fill: '#dfe3f7', line: hot ? C.red : C.peri, w: hot ? 6 : 4, key: 'c_ac', tex: [{ k: 'pencil', c: '#b9c0e6', al: 0.5, per: 80 }, { k: 'hatch', gap: 5, al: 0.18, dens: c_dens(-w / 2, -h / 2, w, h) }] });
  paint(ellipsePts(-250, 0, 74, 74, 0, 32), { fill: '#9aa3d6', line: C.ink, w: 3, key: 'c_aav', tex: [{ k: 'cross', c: C.periD, al: 0.5, gap: 6 }] });
  paint(ellipsePts(-250, -22, 26, 26, 0, 20), { fill: C.cream, line: C.ink, w: 3, key: 'c_aah' });
  paint([...arcPts(-250, 46, 44, Math.PI, TAU, 14)], { fill: C.cream, line: C.ink, w: 3, key: 'c_aab' });
  handText('tài khoản', -150, -30, 54, C.ink, { key: 'c_atk' });
  const bs = c_pop(badge, 0.3);
  if (bs > 0.01) {
    const bw = handW('quyền xuất bản', 50) + 50, bx = -150, by = 12, bh = 78;
    ctx.save(); ctx.translate(bx + bw / 2, by + bh / 2); ctx.scale(bs, bs); ctx.translate(-(bx + bw / 2), -(by + bh / 2));
    paint(rrectPts(bx, by, bw, bh, 39), { fill: hot ? C.red : C.periD, line: C.ink, w: 3, key: 'c_ab', tex: [{ k: 'hatch', c: hot ? '#8f2018' : '#4c558f', al: 0.4, gap: 6 }] });
    handText('quyền xuất bản', bx + 25, by + bh * 0.68, 50, C.white, { key: 'c_abt' });
    ctx.restore();
  }
  ctx.restore();
}

// =====================================================================
SCENES.link1 = function () {
  const id = 'link1', T0 = ET(id), T1 = EE(id);
  const tKhoa = VW(id, 'khoá'), tCap = VW(id, 'cấp'), tLo = VW(id, 'lộ');
  darkWorld(id, { dust: 40 });
  c_chain(1, tLo);
  c_at(250, 1140, c_pop(T0 + 0.1), () => c_server(80, 960, 340, 360, 'Cursor', 'c_s1'));
  c_at(750, 1140, c_pop(T0 + 0.35), () => c_server(580, 960, 340, 360, 'Fireworks AI', 'c_s2', { size: 46, crack: seg(TT, tLo, tLo + 0.3) }));
  // KHÔNG ĐƠ: a live data cable between the two boxes, dashes always flowing
  { const off = (TT * 120) % 40; ctx.save(); ctx.setLineDash([18, 22]); ctx.lineDashOffset = -off; ink([[420, 1150], [580, 1150]], { color: 'rgba(82,214,196,0.8)', w: 5, key: 'c_cab' }); ctx.restore(); }
  // the handover arc (dashed), written on with "cấp"
  const P0 = [300, 830], P1 = [500, 620], P2 = [700, 860], q = (u) => [lerp(lerp(P0[0], P1[0], u), lerp(P1[0], P2[0], u), u), lerp(lerp(P0[1], P1[1], u), lerp(P1[1], P2[1], u), u)];
  const arc = []; for (let i = 0; i <= 24; i++) arc.push(q(i / 24));
  const fa = seg(TT, tCap - 0.2, tCap + 0.5);
  if (fa > 0) {
    ctx.save(); ctx.setLineDash([14, 12]); ink(arc, { color: 'rgba(200,208,240,0.7)', w: 3.5, frac: fa, key: 'c_arc' }); ctx.restore();
    if (fa >= 1) ink([[668, 822], [702, 862], [650, 866]], { color: 'rgba(200,208,240,0.7)', w: 3.5, key: 'c_arh' });
  }
  // the key
  let x, y, rot = 0, s = 1;
  const tA = tCap, tB = tCap + 0.9;
  if (TT < tA) { [x, y] = c_path([[T0 + 0.5, 300, 820], [tKhoa - 0.2, 300, 820], [tKhoa + 0.5, 250, 1000], [tA - 0.45, 250, 1000], [tA, 300, 830]]); s = 1 + 0.15 * Math.sin(Math.PI * seg(TT, tKhoa, tKhoa + 0.4)); }   // KHÔNG ĐƠ: the key drops into Cursor's box on 'khoá', rises on 'cấp'
  else if (TT < tB) { const u = EZ.io(seg(TT, tA, tB)); [x, y] = q(u); rot = -0.25 * Math.sin(Math.PI * u); }
  else [x, y, rot] = c_path([[tB, 700, 860, 0], [tB + 0.45, 690, 1165, 0], [tLo, 690, 1165, 0], [tLo + 0.6, 770, 880, -0.5], [T1 - 0.6, 780, 820, 0]]);
  const [bx, by] = TT < tLo ? c_bob(T0 + 0.5, tA) : c_bob(tLo + 0.6, T1 - 0.6, 7);
  const [bx2, by2] = c_bob(tB + 0.45, tLo, 5);
  c_key(x + bx + bx2, y + by + by2, s, rot);
  // the leak: a few red ticks at the crack (the scene's one particle effect)
  const bu = seg(TT, tLo + 0.1, tLo + 0.55);
  if (bu > 0 && bu < 1) burst(780, 955, 30 + 40 * bu, 60 + 70 * bu, { c: C.redL, w: 4, n: 9, key: 'c_lk', al: 1 - bu });
  c_cap('lộ từ phía Fireworks', tLo + 0.15);
  inkTag('Mắt xích 1');
};

SCENES.link2 = function () {
  const id = 'link2', T0 = ET(id), T1 = EE(id);
  const tMo = VW(id, 'mở'), tKho = VW(id, 'kho'), tChua = VW(id, 'chứa');
  darkWorld(id, { dust: 40 });
  c_chain(2, tMo + 0.35);
  const wheel = EZ.io(seg(TT, tMo + 0.4, tMo + 0.9)), open = EZ.io(seg(TT, tKho - 0.05, tKho + 0.55));
  c_at(640, 1190, c_pop(T0 + 0.15), () => c_vault(open, wheel));
  // the log cards slide out of the vault (back first), then their lines scroll
  const fin = [[580, 680, 0.05], [480, 708, -0.02], [380, 738, -0.05]], scroll = 32 * Math.max(0, TT - (tChua + 0.8));
  fin.forEach(([fx, fy, fr], j) => {
    const t = tChua + j * 0.24; if (TT < t) return;
    const u = EZ.o3(seg(TT, t, t + 0.55));
    c_card(lerp(640, fx, u), lerp(1222, fy, u), 480, 300, fr * u, lerp(0.2, 1, EZ.back(seg(TT, t, t + 0.55))), {
      key: 'c_lc' + j, header: j === 2 && u > 0.8 ? 'nhật ký AI agent' : '', lines: c_LOG2.slice(j * 3).concat(c_LOG2.slice(0, j * 3)), scroll: scroll + j * 13, fs: 26, rh: 42, bars: j < 2,
    });
  });
  // the key: in, down to the lock, turns, out, then drifts up to the exit spot
  const [x, y, rot, ang] = c_path([[T0 + 0.5, 300, 820, 0, 0], [tMo + 0.1, 300, 1222, 0, 0], [tMo + 0.5, 300, 1222, 0, Math.PI], [tMo + 0.8, 230, 1222, 0, Math.PI],
    [tMo + 1.2, 230, 1222, 0, TAU], [tChua + 1.0, 290, 985, 0.1, TAU], [T1 - 0.6, 780, 820, 0, TAU]]);
  const [bx, by] = c_bob(tMo + 1.2, T1 - 0.6, 8);
  c_key(x + bx, y + by, 1, rot, Math.cos(ang));
  inkTag('Mắt xích 2');
};

SCENES.link3 = function () {
  const id = 'link3', T0 = ET(id), T1 = EE(id);
  const tKey = VW(id, 'khoá'), tChua = VW(id, 'chưa'), tHe = VW(id, 'hề'), tChe = VW(id, 'che');
  darkWorld(id, { dust: 40 });
  c_chain(3, tKey);
  const SC = (t) => 45 * (t - T0), lineY = (i, t) => 704 + 64 * i - SC(t), ext = [[6, tChua], [8, tHe], [10, tChe]];
  const redOf = (i) => (i === 4 ? seg(TT, tKey, tKey + 0.35) : (ext.find((e) => e[0] === i) ? seg(TT, ext.find((e) => e[0] === i)[1], ext.find((e) => e[0] === i)[1] + 0.3) : 0));
  c_at(445, 950, c_pop(T0 + 0.1, 0.35), () => c_card(445, 950, 710, 780, 0, 1, { key: 'c_big', header: 'nhật ký AI agent', hs: 50, hh: 90, lines: c_LOG3, scroll: SC(TT), fs: 30, rh: 64, red: redOf }));
  // keys multiply: smaller red keys pop out of the newly lit lines and escape to the card's edge
  const cw = monoW(30), fins = [[805, 905, -0.35], [830, 1065, 0.25], [800, 1225, -0.15]];
  ext.forEach(([i, t], j) => {
    if (TT < t) return;
    const x0 = 120 + c_LOG3[i].length * cw - 40, y0 = lineY(i, t) - 12, u = EZ.o3(seg(TT, t + 0.05, t + 0.65));
    const [fx, fy, fr] = fins[j], fl = Math.sin(TT * 2.1 + j * 2) * 6 * u;
    c_key(lerp(x0, fx, u), lerp(y0, fy, u) + fl, 0.6 * c_pop(t, 0.3), fr * u, 1, 'c_xk' + j);
  });
  // the main key: rests, then settles on the first lit line and rides it up, then leaves
  const tIn = tKey, tOut = tChe + 0.3;
  let x, y, s;
  if (TT < tIn) { x = 300; y = 820; s = 1; const [bx, by] = c_bob(T0 + 0.5, tIn); x += bx; y += by; }
  else if (TT < tIn + 0.5) { const u = EZ.io(seg(TT, tIn, tIn + 0.5)); x = lerp(300, 640, u); y = lerp(820, lineY(4, TT) - 12, u); s = lerp(1, 0.7, u); }
  else if (TT < tOut) { x = 640; y = lineY(4, TT) - 12; s = 0.7; }
  else { const u = EZ.io(seg(TT, tOut, T1 - 0.6)); x = lerp(640, 780, u); y = lerp(lineY(4, tOut) - 12, 820, u); s = lerp(0.7, 1, u); }
  c_key(x, y, s, 0);
  c_cap('chưa hề được che', tChua);
  inkTag('Mắt xích 3');
};

SCENES.link4 = function () {
  const id = 'link4', T0 = ET(id), tF = VL(id).t1;
  const realTT = TT; TT = Math.min(TT, tF);                     // silence before the slam: everything holds (only the boil)
  const tVao = VW(id, 'vào'), tVai = VW(id, 'vài'), tDv = VW(id, 'dịch'), tLay = VW(id, 'lấy'), tQ = VW(id, 'quyền');
  darkWorld(id, { dust: 40 });
  c_chain(4, tQ);
  const dx = [110, 390, 670], tOpen = [tVao + 0.1, tVai + 0.1, tDv + 0.12];
  dx.forEach((x, j) => c_at(x + 110, 1115, c_pop(T0 + 0.1 + j * 0.2), () => c_door(x, 960, 220, 310, EZ.io(seg(TT, tOpen[j], tOpen[j] + 0.35)), j, 'c_d' + j)));
  handText('vài dịch vụ', CX - handW('vài dịch vụ', 50) / 2, 1360, 50, C.peri, { key: 'c_dvl', frac: seg(TT, tVai, tVai + 0.5) });
  // the account card comes out of the last door and grows
  if (TT >= tLay) { const u = EZ.o3(seg(TT, tLay, tLay + 0.6)); c_account(lerp(780, 540, u), lerp(1110, 720, u), lerp(0.2, 1, EZ.back(seg(TT, tLay, tLay + 0.6))), tQ, seg(TT, tQ + 0.35, tQ + 0.75)); }
  const bu = seg(TT, tQ + 0.6, tQ + 1.0);
  if (bu > 0 && bu < 1) burst(560, 770, 230 + 40 * bu, 270 + 90 * bu, { c: C.redL, w: 4, n: 14, key: 'c_pb', al: 1 - bu });
  // the key taps each door, then follows the account card
  const [x, y, rot] = c_path([[T0 + 0.5, 300, 820, 0], [tVao - 0.6, 300, 820, 0], [tVao, 165, 1100, 0], [tVai - 0.25, 165, 1100, 0], [tVai + 0.05, 445, 1100, 0],
    [tDv - 0.15, 445, 1100, 0], [tDv + 0.1, 725, 1100, 0], [tDv + 0.4, 725, 1100, 0], [tLay, 770, 890, -0.2], [tLay + 0.9, 640, 900, -0.12]]);
  const [bx, by] = c_bob(T0 + 0.5, tVao - 0.6, 8), [bx2, by2] = c_bob(tLay + 0.9, tF, 7);
  c_key(x + bx + bx2, y + by + by2, 1, rot);
  TT = realTT;
  inkTag('Mắt xích 4');
};
