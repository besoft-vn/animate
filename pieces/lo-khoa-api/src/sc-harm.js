// =====================================================================
//  fake + harm — the payoff (hard cut at SLAM) and the damage.
//  fake: navy marketplace, 6 grey tiles + one wide red tile "Claude Code 2.1.312"; the red key sits on it at (540,900).
//  harm: a big laptop, the key slides into a door "SSH"; pull back to a ring of 12 laptop icons + counter "tối đa ~5.000".
// =====================================================================

// the scene tag, drawn complete from the first frame (inkTag pops in; "fake" starts on a hard cut and must be whole)
function h_tagNow(str) {
  const f = () => inkCard(str, 70 + (handW(str, 80) + 72) / 2, 330, 80, { rot: -0.04, s: 1 });
  if (DEFER) DEFER.push(f); else f();
}

// a dim marketplace tile (another extension): an icon shape and two grey "text" bars, no words
function h_tile(x, y, w, h, i) {
  const k = 'htl' + i;
  paint(rrectPts(x, y, w, h, 22), { fill: C.navy2, key: k, line: 'rgba(200,208,240,0.55)', w: 3, tex: [{ k: 'hatch', c: C.periD, al: 0.16, gap: 7, dens: (px, py) => clamp((px - x + py - y) / (w + h)) }] });
  const ix = x + 62, iy = y + h / 2, r = 34;
  let P;
  if (i % 3 === 0) P = ellipsePts(ix, iy, r, r, 0, 28);
  else if (i % 3 === 1) P = rrectPts(ix - r, iy - r, r * 2, r * 2, 10);
  else P = [[ix, iy - r * 1.1], [ix + r, iy], [ix, iy + r * 1.1], [ix - r, iy]];
  paint(P, { fill: 'rgba(124,134,196,0.55)', key: k + 'i', line: 'rgba(200,208,240,0.6)', w: 2.5, tex: [{ k: 'hatch', c: C.peri, al: 0.25, gap: 6 }] });
  const bw = w - 140;
  ink([[x + 116, iy - 18], [x + 116 + bw * 0.9, iy - 18]], { w: 10, color: 'rgba(200,208,240,0.30)', key: k + 'b1' });
  ink([[x + 116, iy + 20], [x + 116 + bw * (0.45 + 0.08 * (i % 4)), iy + 20]], { w: 10, color: 'rgba(200,208,240,0.18)', key: k + 'b2' });
}

// the clock on the red tile: hand sweeps 0 -> 11 h (p 0..1), elapsed wedge in red pencil
function h_clock(cx, cy, r, p) {
  paint(ellipsePts(cx, cy, r, r, 0, 48), { fill: '#101233', key: 'hclk', line: C.peri, w: 4, tex: [{ k: 'hatch', c: C.periD, al: 0.2, gap: 7 }] });
  const a0 = -Math.PI / 2, a1 = a0 + p * (11 / 12) * TAU;
  if (p > 0.01) {
    const P = [[cx, cy], ...arcPts(cx, cy, r - 10, a0, a1, Math.max(4, Math.ceil(p * 40)))];
    paint(P, { fill: 'rgba(212,56,44,0.55)', key: 'hclkw', line: false, raw: true, tex: [{ k: 'pencil', c: C.redL, al: 0.5, per: 40 }] });
  }
  for (let i = 0; i < 12; i++) {
    const a = a0 + (i / 12) * TAU, r0 = i % 3 === 0 ? r - 22 : r - 14;
    ink([[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * (r - 5), cy + Math.sin(a) * (r - 5)]], { w: i % 3 === 0 ? 4 : 2.5, color: C.peri, key: 'hck' + i, amt: 0.6 });
  }
  ink([[cx, cy], [cx + Math.cos(a1) * (r - 26), cy + Math.sin(a1) * (r - 26)]], { w: 7, color: C.white, key: 'hclkh', amt: 0.8 });
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, TAU); ctx.fill();
}

SCENES.fake = function () {
  darkWorld('fake', { dust: 40 });
  const t0 = ET('fake'), tEnd = EE('fake');
  const vw = (w, n) => VW('fake', w, n);

  // header + the date card
  handText('Chợ tiện ích của Cursor', 80, 570, 48, C.peri, { key: 'hhead' });
  const ulF = ev(vw('chợ'), 0.5);
  if (ulF > 0) ink([[80, 588], [80 + handW('Chợ tiện ích của Cursor', 48), 590]], { w: 4, color: C.cyan, key: 'hhul', frac: ulF });
  inkCard('29/10', 820, 330, 64, { rot: 0.03 });
  const dF = ev(vw('hai'), 0.6);
  if (dF > 0) ink([[742, 376], [900, 372]], { w: 5, color: C.red, key: 'hdul', frac: dF });

  // six other extensions, dim
  const TX = [80, 400, 720], TW = 280;
  TX.forEach((x, i) => h_tile(x, 600, TW, 180, i));
  TX.forEach((x, i) => h_tile(x, 1210, TW, 180, i + 3));

  // the malicious tile: wide, red outline, glowing; a pulse ring on "độc hại"
  const RX = 80, RY = 820, RW = 920, RH = 350, rcx = RX + RW / 2, rcy = RY + RH / 2;
  const bump = 1 + 0.025 * Math.sin(Math.PI * seg(TT, vw('độc'), vw('độc') + 0.35));
  ctx.save(); ctx.translate(rcx, rcy); ctx.scale(bump, bump); ctx.translate(-rcx, -rcy);
  const glow = 0.24 + 0.1 * Math.sin(TT * 4);
  ink(rrectPts(RX, RY, RW, RH, 28), { closed: true, color: `rgba(212,56,44,${glow.toFixed(3)})`, w: 30, key: 'hrg' });
  paint(rrectPts(RX, RY, RW, RH, 28), { fill: '#1d1430', key: 'hrt', line: C.red, w: 6, tex: [{ k: 'cross', c: C.red, al: 0.14, gap: 9 }, { k: 'hatch', c: C.periD, al: 0.18, gap: 6, dens: (px, py) => clamp((px - RX + py - RY - 300) / 900) }] });
  // the icon: a terminal prompt ">_" drawn in ink, not text
  paint(rrectPts(110, 850, 140, 140, 22), { fill: '#2a1a2c', key: 'hri', line: C.redL, w: 3.5, tex: [{ k: 'hatch', c: C.red, al: 0.3, gap: 6 }] });
  ink([[145, 890], [180, 920], [145, 950]], { w: 7, color: C.white, key: 'hrp1', amt: 0.8 });
  ink([[192, 956], [222, 956]], { w: 7, color: C.white, key: 'hrp2', amt: 0.8 });
  // name + version (+ 2.1.313 appears beside it)
  handText('Claude Code', 110, 1068, 66, C.white, { key: 'hrn' });
  const nF = ev(vw('claude'), 0.5);
  if (nF > 0) ink([[110, 1084], [110 + handW('Claude Code', 66), 1086]], { w: 4, color: C.red, key: 'hrnu', frac: nF });
  handText('2.1.312', 110, 1142, 52, C.redL, { key: 'hrv1' });
  const v2 = popS(vw('ích', 1) + 0.1);
  if (v2 > 0.01) {
    const vx = 110 + handW('2.1.312', 52) + 26;
    ctx.save(); ctx.translate(vx, 1124); ctx.scale(v2, v2); ctx.translate(-vx, -1124);
    handText('· 2.1.313', vx, 1142, 48, C.redL, { key: 'hrv2' });
    ctx.restore();
  }
  // the clock: 0 -> ~11 h from "suốt" to "giờ"
  const cp = EZ.io(seg(TT, vw('suốt'), vw('giờ')));
  h_clock(860, 965, 92, cp);
  handText('~11 giờ', 780, 1142, 46, cp > 0.02 ? C.white : 'rgba(200,208,240,0.55)', { key: 'hclkl' });
  ctx.restore();

  // one effect: a single red outline ring expanding off the tile on "độc hại"
  const pr = seg(TT, vw('độc'), vw('độc') + 0.8);
  if (pr > 0 && pr < 1) {
    const s = 1 + 0.08 * EZ.o2(pr);
    ink(xform(rrectPts(RX, RY, RW, RH, 28).map(([x, y]) => [x - rcx, y - rcy]), rcx, rcy, 0, s, 1 + 0.2 * EZ.o2(pr)), { closed: true, color: C.red, w: 4, key: 'hpr', alpha: 1 - pr });
  }

  chainStrip(5, { dark: true });

  // the red key sits on the red tile; a slow bob that settles exactly on BR.fakeHarm.a before the bridge
  const settle = 1 - seg(TT, tEnd - 1.4, tEnd - 0.7);
  const ky = BR.fakeHarm.a[1] + Math.sin((TT - t0) * 2.6) * 5 * settle;
  keyProp(BR.fakeHarm.a[0], ky, KS, { dark: true });

  h_tagNow('bản độc hại');
};

// ---- harm
// a laptop centred (cx, cy) at scale s. o: door (draw the door), red (door taken over), key (texture key)
function h_laptop(cx, cy, s, o = {}) {
  const k = o.key || 'hlp', lw = Math.max(2.2, 4 * s);
  const L = (x, y) => [cx + x * s, cy + y * s];
  const R = (x, y, w, h, r) => rrectPts(cx + x * s, cy + y * s, w * s, h * s, r * s);
  // base
  paint([L(-380, 200), L(380, 200), L(450, 262), L(-450, 262)], { fill: C.navy2, key: k + 'bs', line: C.peri, w: lw, tex: [{ k: 'hatch', c: C.periD, al: 0.3, gap: 6 }] });
  // lid + screen
  paint(R(-380, -280, 760, 480, 26), { fill: C.navy2, key: k + 'ld', line: C.peri, w: lw, tex: [{ k: 'hatch', c: C.periD, al: 0.22, gap: 7, dens: (px, py) => clamp((px - cx + py - cy) / (500 * s) + 0.4) }] });
  paint(R(-345, -248, 690, 416, 14), { fill: '#0b0e26', key: k + 'sc', line: 'rgba(200,208,240,0.6)', w: Math.max(1.6, 2.5 * s), tex: [{ k: 'hatch', c: C.cyan, al: 0.08, gap: 9 }] });
  if (o.cursor && Math.floor(TT * 2) % 2 === 0) { ctx.fillStyle = C.cyan; const [x, y] = L(-310, -210); ctx.fillRect(x, y, 22 * s, 36 * s); }
  if (o.door === false) return;
  // the door with a keyhole (SSH): red outline once taken over
  const red = !!o.red, dl = red ? C.red : C.peri;
  if (red && s > 0.5) ink(R(220, -200, 140, 360, 10), { closed: true, color: `rgba(212,56,44,${(0.22 + 0.08 * Math.sin(TT * 5)).toFixed(3)})`, w: 22 * s, key: k + 'dg' });
  paint(R(220, -200, 140, 360, 10), { fill: red ? '#2a1424' : '#1a1e48', key: k + 'dr', line: dl, w: Math.max(2, 4 * s), tex: [{ k: 'hatch', c: red ? C.red : C.periD, al: red ? 0.3 : 0.28, gap: 6 }] });
  if (s > 0.92) handText('SSH', cx + 250 * s, cy - 120 * s, 50, red ? C.redL : C.white, { key: k + 'ssh' });
}
// keyhole plate drawn over the key tip so the key reads as "inside" the door
function h_keyhole(x, y, red) {
  paint(ellipsePts(x, y, 20, 20, 0, 20), { fill: '#0b0e26', key: 'hkh', line: red ? C.red : C.peri, w: 3.5 });
  ctx.fillStyle = red ? C.red : C.peri; ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y); ctx.lineTo(x + 8, y + 14); ctx.lineTo(x - 8, y + 14); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y - 2, 6, 0, TAU); ctx.fill();
}
// the attacker, remote: a plain red bust (no face, no gore)
function h_remote(x, y, s) {
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y);
  paint(arcPts(x, y + 92, 66, Math.PI, TAU, 18), { fill: C.red, key: 'hrmb', line: C.peri, w: 3.5, tex: [{ k: 'cross', c: '#8f2018', al: 0.45, gap: 6 }] });
  paint(ellipsePts(x, y + 20, 36, 38, 0, 28), { fill: C.red, key: 'hrmh', line: C.peri, w: 3.5, tex: [{ k: 'cross', c: '#8f2018', al: 0.45, gap: 6 }] });
  ctx.restore();
}
const h_fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

SCENES.harm = function () {
  darkWorld('harm', { dust: 40 });
  const vw = (w, n) => VW('harm', w, n), tEnd = EE('harm');
  const tIn = vw('cài'), tPull = vw('và'), tCount = tPull + 0.7, tFull = VE('harm', 'nghìn');
  const inK = EZ.io(seg(TT, tIn, tIn + 0.45));          // key slides into the door
  const taken = past(TT, tIn + 0.45);
  const z = EZ.io(seg(TT, tPull, tPull + 0.8));          // pull back 0..1

  // ring of 12 laptop icons around the key (the main laptop shrinks into the top slot)
  const RC = [540, 940], RXr = 370, RYr = 430, S0 = 0.2;
  const slot = (i) => { const a = (i / 12) * TAU; return [RC[0] + RXr * Math.sin(a), RC[1] - RYr * Math.cos(a)]; };
  for (let i = 1; i < 12; i++) {
    const s = popS(tCount + (i - 1) * 0.19);
    if (s <= 0.01) continue;
    const [x, y] = slot(i);
    h_laptop(x, y, S0 * s, { key: 'hlp' + i, red: true });
  }

  // the main laptop: big, then shrinking to the top slot
  const [tx, ty] = slot(0);
  const ms = lerp(1, S0, z), mx = lerp(540, tx, z), my = lerp(920, ty, z);
  h_laptop(mx, my, ms, { key: 'hlp0', red: taken, cursor: z < 0.5 });

  // the remote line + the attacker (on "từ xa" / "kẻ tấn công"), gone on the pull back
  const out = 1 - ev(tPull, 0.3);
  const lF = ev(vw('từ'), 0.6) * out;
  if (lF > 0 && z < 1) { ctx.save(); ctx.setLineDash([16, 12]); ink([[830, 720], [850, 640], [868, 560]], { w: 4, color: C.red, key: 'hrl', frac: lF }); ctx.restore(); }
  h_remote(880, 430, popS(vw('kẻ')) * out);

  // the label for "khoá đăng nhập từ xa"
  const cS = 1 - ev(tPull, 0.25);
  if (cS > 0.01) inkCard('khoá đăng nhập từ xa', 500, 1300, 52, { rot: 0.012, s: cS, frac: ev(vw('khoá'), 0.8) });

  // the key: (540,900) -> into the door -> back to centre while the view pulls back
  const kxIn = BR.fakeHarm.b[0] + 96 * inK;
  const kx = lerp(kxIn, BR.harmLesson.a[0], z);
  keyProp(kx, BR.fakeHarm.b[1], KS, { dark: true });
  if (z < 0.05 && inK > 0.6) h_keyhole(816, 900, taken);

  // counter: climbs to ~5.000 on "năm nghìn"
  if (TT >= tCount) {
    const n = Math.round(5000 * EZ.o2(seg(TT, tCount, tFull)) / 100) * 100;
    const pop = 1 + 0.12 * Math.sin(Math.PI * seg(TT, tFull, tFull + 0.3));
    const str = '~' + h_fmt(n), size = 96, w = handW(str, size);
    ctx.save(); ctx.translate(500, 1150); ctx.scale(pop, pop);
    handText(str, -w / 2, 30, size, C.redL, { key: 'hcnt' });
    ctx.restore();
    const tw = handW('tối đa', 56);
    handText('tối đa', 500 - tw / 2, 1060, 56, C.peri, { key: 'hcap', frac: ev(vw('tối'), 0.4) });
  }

  inkTag('cài khoá SSH lạ');
};
