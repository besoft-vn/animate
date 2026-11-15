// =====================================================================
//  SCENES — hook, turn, sweat, end (the kitchen act + the payoff). World 1080x1920, time TT on 2s.
//  Colour code: terracotta = heat (hero, motes, warm coil), cyan/sky = cold (frost, cold pipe, sweat).
//  Bridges: hook ends with the hero on the bowl (700,1010); turn opens on it at (540,820) and ends at the back
//  coil (880,760); sweat opens on the forearm at (600,820) and ends on a big cyan drop (540,900, 105x140).
//  end is a hard cut (the slam): complete on its first frame.
// =====================================================================

const K_COUNTER_Y = 1160;                                      // the counter top (wood) in the kitchen shots

// ---- a little hand-drawn wavy heat line (terracotta), rising
function k_heatWave(x, y, len, key, o = {}) {
  const P = [];
  for (let k = 0; k <= 10; k++) P.push([x + Math.sin(k * 0.9 + TT * 4 + key.length) * (o.amp ?? 9), y - k * len / 10]);
  ink(P, { w: o.w ?? 4, color: o.color || 'rgba(217,119,87,0.85)', key, amt: 0.8, frac: o.frac });
}
// ---- a frost crystal (cyan), small asterisk-like star
function k_frost(x, y, r, key) {
  for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3 + 0.2; ink([[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], { w: 3, color: C.skyD, key: key + i, amt: 0.5 }); }
}

// ---- the kitchen wall: cream paper, a tile band, a window with a moving cloud
function k_kitchenWall(key, o = {}) {
  paperSheet(key, { ruled: false });
  // tile band behind the counter
  paint(box(-20, 960, W + 40, K_COUNTER_Y - 960), { raw: true, line: false, fill: '#efe5cf', key: key + 'tile', tex: [{ k: 'pencil', c: C.skyL, al: 0.5, per: 260 }] });
  ctx.save(); ctx.strokeStyle = 'rgba(58,36,23,0.35)'; ctx.lineWidth = 2; ctx.beginPath();
  for (let y = 960; y <= K_COUNTER_Y; y += 66) { ctx.moveTo(0, y + RNG('kt', key, y, B).n(1)); ctx.lineTo(W, y); }
  for (let x = 30; x < W; x += 66) { ctx.moveTo(x, 960); ctx.lineTo(x + RNG('ktx', key, x, B).n(1.2), K_COUNTER_Y); }
  ctx.stroke(); ctx.restore();
  // window, upper right
  const wx = o.wx ?? 620, wy = 420, ww = o.ww ?? 300, wh = 300;
  paint(box(wx - 18, wy - 18, ww + 36, wh + 36), { fill: C.cream, key: key + 'wf', w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 6, al: 0.3, dens: (x, y) => clamp((x - wx + y - wy) / 600) }] });
  paint(box(wx, wy, ww, wh), { fill: C.skyL, key: key + 'wg', w: 3, tex: [{ k: 'pencil', c: C.sky, al: 0.6, per: 120 }, { k: 'hatch', a: -0.6, gap: 9, al: 0.18, c: C.skyD }] });
  const cx = wx + 60 + mod(TT * 18, ww - 60), cy = wy + 90;
  ctx.save(); trace(box(wx, wy, ww, wh), true); ctx.clip();
  paint(ellipsePts(cx, cy, 70, 30, 0, 24), { fill: '#fffaf0', key: key + 'cl', w: 2.4, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.2 }] });
  paint(ellipsePts(cx - 260, cy + 110, 50, 22, 0, 24), { fill: '#fffaf0', key: key + 'cl2', w: 2.4, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.2 }] });
  ctx.restore();
  ink([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], { w: 4, key: key + 'wm1' });
  ink([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], { w: 4, key: key + 'wm2' });
  // a little potted plant on the sill, its leaves sway
  const px = wx + ww - 70, py = wy + wh + 18;
  for (let i = 0; i < 4; i++) {
    const a = -1.9 + i * 0.45 + Math.sin(TT * 2 + i) * 0.06;
    paint(ellipsePts(px + Math.cos(a) * 46, py - 60 + Math.sin(a) * 40, 34, 13, a, 16), { fill: C.green, key: key + 'lf' + i, w: 2.2, tex: [{ k: 'hatch', a: 0.4, gap: 4, al: 0.4, c: '#2f5a2e' }] });
  }
  paint([[px - 40, py - 62], [px + 40, py - 62], [px + 30, py], [px - 30, py]], { fill: C.rose, key: key + 'pot', w: 2.6, tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.45, c: C.roseD }] });
}

// ---- the counter (wood), from x0 to the right edge, and the floor under the fridge
function k_counter(key, x0 = 520) {
  woodSurface(-40, 1270, W + 40, H + 40, key + 'fl', { fill: C.woodD });
  woodSurface(x0, K_COUNTER_Y, W + 40, H + 40, key + 'ct');
  paint(box(x0 - 10, K_COUNTER_Y - 4, W + 60 - x0, 34), { fill: C.woodL, key: key + 'edge', w: 3, tex: [{ k: 'pencil', c: C.wood, al: 0.5, per: 90, a: 0.02, len: 40 }] });
  paint(box(x0, K_COUNTER_Y + 30, W + 60 - x0, 26), { raw: true, line: false, fill: 'rgba(58,36,23,0.35)', key: key + 'csh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
}

// ---- the fridge, front 3/4. o: side (px of side face), note (cross-out 0..1), fix (rewrite 0..1), coil (glow 0..1)
function k_fridge(key, o = {}) {
  const x0 = 110, x1 = 470, y0 = 380, y1 = 1285, sw = o.side ?? 60;
  // back coil peeking out behind the side (only when turned)
  if (o.coil) {
    const cx0 = x1 + sw - 30, cx1 = x1 + sw + 70, top = 440, bot = 1230, glow = o.coil;
    const P = []; for (let y = top, i = 0; y <= bot; y += 46, i++) { P.push([i % 2 ? cx1 : cx0, y]); P.push([i % 2 ? cx1 : cx0, y + 30]); }
    ink(P, { w: 46, color: 'rgba(217,119,87,' + (0.18 + 0.12 * glow * (0.6 + 0.4 * Math.sin(TT * 5))) + ')', key: key + 'cglow', amt: 2 });
    ink(P, { w: 18, color: C.ink, key: key + 'co', amt: 1 });
    ink(P, { w: 11, color: C.terra, key: key + 'ci', amt: 1 });
    for (let x = cx0 + 10; x < cx1; x += 18) ink([[x, top - 10], [x, bot + 20]], { w: 1.6, color: 'rgba(58,36,23,0.55)', key: key + 'fin' + x, amt: 0.6 });
    // compressor dome at the bottom back
    paint(ellipsePts(cx0 + 40, 1235, 62, 46, 0, 28), { fill: '#5a4636', key: key + 'comp', w: 3, tex: [{ k: 'cross', c: '#1e130b', al: 0.4, gap: 5 }] });
  }
  // side face
  paint([[x1, y0], [x1 + sw, y0 + 22], [x1 + sw, y1 - 16], [x1, y1]], { fill: '#e3d6bb', key: key + 'side', w: 3.5, tex: [{ k: 'hatch', a: 1.2, gap: 5, al: 0.45 }, { k: 'pencil', c: '#c9b796', al: 0.4, per: 80 }] });
  // front: freezer + main door
  const shade = (x, y) => clamp((x - x0) / (x1 - x0) * 0.6 + (y - y0) / (y1 - y0) * 0.5 - 0.25);
  paint(rrectPts(x0, y0, x1 - x0, y1 - y0, 26), { fill: '#f6efdf', key: key + 'body', w: 4.5, tex: [{ k: 'pencil', c: '#e4d7bd', al: 0.55, per: 70 }, { k: 'hatch', a: 0.75, gap: 6, al: 0.35, dash: [10, 40], dens: shade }] });
  ink([[x0 + 6, 610], [x1 - 6, 610]], { w: 4, key: key + 'split' });
  ink([[x0 + 40, 470], [x0 + 40, 560]], { w: 12, color: C.ink, key: key + 'h1' });
  ink([[x0 + 40, 680], [x0 + 40, 880]], { w: 12, color: C.ink, key: key + 'h2' });
  ink([[x0 + 40, 470], [x0 + 40, 560]], { w: 5, color: '#cfc3a8', key: key + 'h1b' });
  ink([[x0 + 40, 680], [x0 + 40, 880]], { w: 5, color: '#cfc3a8', key: key + 'h2b' });
  // feet
  paint(box(x0 + 20, y1 - 4, 50, 18), { fill: C.ink, key: key + 'ft1', w: 2 });
  paint(box(x1 - 70, y1 - 4, 50, 18), { fill: C.ink, key: key + 'ft2', w: 2 });
  // magnets: a small yellow star and a green round magnet (background life)
  paint(ellipsePts(400, 470, 22, 22, 0, 16), { fill: C.green, key: key + 'mg1', w: 2.4, tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.45, c: '#2f5a2e' }] });
  paint(ellipsePts(390, 1150, 24, 24, 0, 16), { fill: C.yellow, key: key + 'mg2', w: 2.4, tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.45, c: C.woodD }] });
  // the note: "máy tạo lạnh", crossed out on "không hề"
  const nx = 300, ny = 780;
  inkCard('máy tạo lạnh', nx, ny, 54, { rot: -0.05 });
  const cr = o.note ?? 0, nw = handW('máy tạo lạnh', 54) / 2 + 30;
  if (cr > 0) {
    planInk([[nx - nw, ny - 30], [nx + nw, ny + 24]], { key: key + 'x1', frac: clamp(cr * 2), w: 7, dash: [400, 1] });
    planInk([[nx - nw, ny + 26], [nx + nw, ny - 28]], { key: key + 'x2', frac: clamp(cr * 2 - 1), w: 7, dash: [400, 1] });
  }
  if ((o.fix ?? 0) > 0) handText('máy bê nhiệt', nx - handW('máy bê nhiệt', 56) / 2, ny + 110, 56, C.ink, { key: key + 'fix', rot: -0.04, frac: o.fix });
  // the fridge hum: tiny lines over the top on 2s
  if (B % 6 < 3) for (let i = 0; i < 3; i++) ink([[200 + i * 80, y0 - 20], [210 + i * 80, y0 - 44]], { w: 3, color: 'rgba(58,36,23,0.6)', key: key + 'hum' + i, amt: 0.6 });
}

// ---- a bowl of canh. hot: steam + rising motes. cold: frost, no steam.
function k_bowl(x, y, rx, key, o = {}) {
  const ry = rx * 0.22, depth = rx * 0.62;
  paint(ellipsePts(x + 20, y + depth + 8, rx * 0.9, ry * 0.9, 0, 30), { fill: 'rgba(58,36,23,0.3)', line: false, key: key + 'sh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.5 }] });
  const bodyP = []; for (let i = 0; i <= 20; i++) { const a = i / 20 * Math.PI; bodyP.push([x + Math.cos(a) * rx, y + Math.sin(a) * depth]); }
  paint(bodyP, { fill: o.cold ? '#e8eef0' : '#f2ede2', key: key + 'b', w: 3.5, tex: [{ k: 'pencil', c: o.cold ? C.skyL : '#d9cdb8', al: 0.6, per: 60 }, { k: 'hatch', a: 0.7, gap: 5, al: 0.35, dash: [8, 24], dens: (px, py) => clamp((px - x) / rx + (py - y) / depth * 0.6) }] });
  // blue rim stripe (a Vietnamese rice bowl pattern)
  ink(bodyP.slice(3, 18).map(([px, py]) => [px, py - depth * 0.35 + (py - y) * 0.05]), { w: 5, color: C.skyD, key: key + 'stripe', amt: 0.8 });
  paint(ellipsePts(x, y, rx, ry, 0, 36), { fill: '#f6f1e6', key: key + 'rim', w: 3.5 });
  paint(ellipsePts(x, y + 3, rx * 0.88, ry * 0.75, 0, 36), { fill: o.cold ? '#c9a46a' : '#d99a4e', key: key + 'soup', w: 2, tex: [{ k: 'cross', c: o.cold ? '#7a6a50' : C.orangeD, al: 0.35, gap: 5 }] });
  // herbs floating
  for (let i = 0; i < 4; i++) { const R = RNG('herb', key, i); paint(ellipsePts(x + R.r(-rx * 0.6, rx * 0.6), y + R.r(-ry * 0.3, ry * 0.5), 12, 5, R.r(0, 3), 10), { fill: C.green, key: key + 'hb' + i, w: 1.6, tex: [{ k: 'hatch', a: 0.5, gap: 3, al: 0.4, c: '#2f5a2e' }] }); }
  if (o.cold) {
    ink(ellipsePts(x, y + 3, rx * 0.8, ry * 0.6, 0, 30), { closed: true, w: 4, color: C.skyL, key: key + 'ice', amt: 1 });
    [[-0.7, 0.3], [0.6, 0.5], [-0.2, 0.75], [0.8, 0.1]].forEach(([u, v], i) => k_frost(x + u * rx, y + v * depth, 12 + (i % 2) * 5, key + 'fr' + i));
    for (let i = 0; i < 3; i++) if ((B + i * 5) % 14 < 4) star4(x - rx * 0.5 + i * rx * 0.5, y - 30 - i * 10, 9, C.skyD);
  } else if (o.steam !== false) {
    const n = o.steamN ?? 2;
    vapour(x - rx * 0.62, y - 20, { n, color: 'rgba(58,36,23,0.42)', key: key + 'st1', w: 3.4, step: 15 });
    vapour(x + rx * 0.62, y - 20, { n, color: 'rgba(58,36,23,0.42)', key: key + 'st2', w: 3.4, step: 15 });
  }
}

// ---- heat motes rising from a point and vanishing (skip when off their life)
function k_risingMotes(x, y, n, key, o = {}) {
  const life = o.life ?? 1.6, h = o.h ?? 260;
  for (let i = 0; i < n; i++) {
    const R = RNG('rm', key, i), ph = R.f() * life, u = mod(TT + ph, life) / life;
    if (u > 0.85) continue;
    const mx = x + R.r(-(o.spread ?? 60), o.spread ?? 60) + Math.sin(u * 6 + i) * 14, my = y - u * h;
    heatMote(mx, my, (o.r ?? 13) * (1 - u * 0.4), key + i);
  }
}

// =====================================================================
//  1 HOOK — "Tủ lạnh không hề tạo ra hơi lạnh."  kitchen; the note gets crossed out
// =====================================================================
SCENES.hook = function () {
  k_kitchenWall('kw');
  k_counter('kc');
  const tx = VW('hook', 'không');
  k_fridge('fr', { side: 60, note: ev(tx, 0.45) });
  // a ladle on the counter (background life: it doesn't move, but the line boils)
  ink([[880, 1200], [1040, 1140]], { w: 9, key: 'ladle' });
  paint(ellipsePts(870, 1205, 34, 18, -0.3, 20), { fill: '#b9b2a6', key: 'ladleb', w: 3, tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.45 }] });
  k_bowl(700, 1075, 150, 'bowl', { steamN: 2 });
  k_risingMotes(700, 1000, 3, 'hm', { spread: 120, h: 300, r: 12 });
  const [hx, hy] = BR.hookTurn.a;
  dotHero(hx, hy, HR, { key: 'hero', mood: TT > tx + 0.2 ? 'wow' : 'happy' });
  // on "hơi lạnh": a cyan question mark over the fridge (cold? no)
  const q = popS(VW('hook', 'lạnh', 2));
  if (q > 0) { ctx.save(); ctx.translate(300, 960); ctx.scale(q, q); handText('?', -26, 40, 130, C.skyD, { key: 'hq', rot: 0.1 }); ctx.restore(); }
  inkTag('bếp');
};

// =====================================================================
//  2 TURN — "Nó làm một việc lạ hơn: bê hơi nóng trong tủ, đổ ra ngoài bếp."
//  cut-away fridge: motes rise from the bowl, ride the cold pipe along the back, get dumped out the back coil
// =====================================================================
const K_TURN_PATH = [[540, 820], [540, 640], [580, 540], [700, 505], [790, 520], [830, 600], [880, 760]];
function k_turnAt(u) { return pointAt(resample(K_TURN_PATH, false, 6), u); }
SCENES.turn = function () {
  k_kitchenWall('tw');
  woodSurface(-40, 1250, W + 40, H + 40, 'tfl', { fill: C.woodD });
  const tDump = VW('turn', 'đổ'), tGo = 3.6, tArr = 6.25;
  // fridge shell (side view, cut away)
  paint(rrectPts(170, 400, 680, 850, 30), { fill: '#f6efdf', key: 'tshell', w: 5, tex: [{ k: 'pencil', c: '#e4d7bd', al: 0.55, per: 70 }, { k: 'hatch', a: 0.75, gap: 6, al: 0.4, dash: [10, 40], dens: (x, y) => clamp((y - 400) / 850 * 0.8) }] });
  // the inside: cold (cyan pencil), cut-away edge zig-zag
  paint(rrectPts(220, 450, 580, 750, 16), { fill: '#dcebef', key: 'tin', w: 3.5, tex: [{ k: 'pencil', c: C.sky, al: 0.55, per: 110 }, { k: 'hatch', a: -0.7, gap: 8, al: 0.25, c: C.skyD, dens: (x, y) => clamp((y - 450) / 750 + 0.2) }] });
  // the open door, swung toward us on the left
  paint([[170, 430], [92, 470], [92, 1210], [170, 1240]], { fill: '#efe5cf', key: 'tdoor', w: 4, tex: [{ k: 'hatch', a: 1.3, gap: 5, al: 0.45 }] });
  for (let y = 600; y < 1200; y += 190) ink([[100, y], [160, y - 12]], { w: 3, key: 'tdsh' + y });
  // shelves
  ink([[225, 960], [795, 960]], { w: 6, key: 'tsh1' }); ink([[225, 1110], [795, 1110]], { w: 6, key: 'tsh2' });
  // food: bottle, carton, jar
  paint([[300, 960], [300, 830], [318, 800], [318, 760], [342, 760], [342, 800], [360, 830], [360, 960]], { fill: C.greenL, key: 'tbot', w: 3, tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.4, c: C.green }] });
  paint(box(680, 860, 80, 100), { fill: C.yellowL, key: 'tcart', w: 3, tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.4, c: C.woodD }] });
  paint(rrectPts(300, 1020, 120, 90, 14), { fill: C.roseL, key: 'tjar', w: 3, tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.4, c: C.roseD }] });
  paint(rrectPts(560, 1040, 160, 70, 10), { fill: C.greenL, key: 'tveg', w: 3, tex: [{ k: 'cross', a: 0.8, gap: 6, al: 0.35, c: C.green }] });
  // the cold pipe across the top (cyan) and through the back wall into the warm back coil (terracotta)
  const Ev = []; for (let x = 250, i = 0; x <= 780; x += 38, i++) Ev.push([x, i % 2 ? 478 : 506]);
  Ev.push([800, 492], [870, 492]);
  pipe(Ev, { w: 20, dark: false, key: 'tev', flow: 1, u: (f) => (f < 0.88 ? 0.0 : lerp(0, 0.9, (f - 0.88) / 0.12)) });
  const Co = []; for (let y = 492, i = 0; y <= 1180; y += 46, i++) { Co.push([i % 2 ? 950 : 862, y]); Co.push([i % 2 ? 950 : 862, y + 26]); }
  const dumping = ev(tDump - 0.2, 0.5);
  if (dumping > 0) ink(Co, { w: 50, color: 'rgba(217,119,87,' + (0.15 + 0.12 * dumping) + ')', key: 'tcglow', amt: 2 });
  pipe(Co, { w: 18, dark: false, key: 'tco', flow: 1, u: 0.95 });
  // the bowl on the shelf (its steam thins as the heat leaves)
  const leave = ev(tGo, 2.5);
  k_bowl(540, 900, 125, 'tbowl', { steamN: leave < 0.6 ? 2 : 1 });
  // motes: each rises off the soup and rides the same road as the hero, then drifts out into the kitchen
  for (let i = 0; i < 7; i++) {
    const s = 3.3 + i * 0.42, d = 2.2, u = (TT - s) / d;
    if (u < 0) continue;
    const R = RNG('tm', i);
    let x, y;
    if (u <= 1) { const p = k_turnAt(EZ.io(u)); x = p[0] + R.n(18); y = p[1] + R.n(14) - 60; }
    else { const k = (u - 1) * d; x = 900 + k * 160 + R.n(10); y = 700 - k * 120 + Math.sin(k * 5 + i) * 18 - (i % 3) * 60; }
    if (x > W + 30 || y < 380) continue;
    heatMote(x, y, 15, 'tmo' + i);
  }
  // warm air out the back into the kitchen, after "đổ"
  if (dumping > 0) for (let i = 0; i < 4; i++) k_heatWave(985 + (i % 2) * 40, 1120 - i * 170, 120, 'thw' + i, { frac: clamp(dumping * 2 - i * 0.3) });
  // the hero rides
  const p = k_turnAt(EZ.io(seg(TT, tGo, tArr)));
  const moving = TT > tGo && TT < tArr;
  dotHero(p[0], p[1], HR, { key: 'hero', mood: moving ? 'wow' : TT >= tArr ? 'happy' : undefined, shadow: false });
  // the note: "hơi nóng → bếp" on the outside, written on at "đổ ra ngoài bếp"
  const nf = ev(tDump, 0.6);
  if (nf > 0) inkCard('ra bếp →', 735, 1180, 58, { rot: -0.04, frac: nf, s: popS(tDump) });
  inkTag('bên trong tủ');
};

// =====================================================================
//  3 SWEAT — "Bí mật thì bạn đã biết rồi: mồ hôi bay hơi, mang hơi nóng đi, nên da thấy mát."
//  extreme close-up of a forearm; a drop evaporates and carries heat (and the hero) away; ends on a big drop
// =====================================================================
const K_DROPS = [[290, 610, 40], [800, 560, 34], [240, 1050, 44], [830, 1090, 40], [430, 1190, 30], [620, 1150, 28], [960, 820, 30]];
function k_drop(x, y, r, key, o = {}) {
  const ry = r * 1.2, P = ellipsePts(x, y, r, ry, 0, 32);
  paint(ellipsePts(x + r * 0.25, y + r * 0.3, r, ry, 0, 24), { fill: 'rgba(120,70,40,0.25)', line: false, key: key + 'sh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.4 }] });
  paint(P, { fill: C.skyL, key, w: o.w ?? 3, tex: [{ k: 'pencil', c: C.sky, al: 0.7, per: 40 }, { k: 'hatch', a: -0.7, gap: 5, al: 0.5, c: C.skyD, dens: (px, py) => clamp((px - x) / r * 0.7 + (py - y) / ry * 0.7 + 0.2) }] });
  paint(ellipsePts(x - r * 0.38, y - ry * 0.4, r * 0.2, ry * 0.26, -0.5, 14), { fill: '#ffffff', line: false, key: key + 'hl' });
}
SCENES.sweat = function () {
  const tBi = VW('sweat', 'mồ'), tEvap = VW('sweat', 'bay'), tCarry = VW('sweat', 'mang'), tCool = VW('sweat', 'mát');
  const tBig = VW('sweat', 'nên');
  paperSheet('sp', { ruled: false, fill: '#e9d9c0' });
  // the forearm: a huge diagonal band of skin
  const top = [[-60, 330], [1140, 230]], bot = [[1140, 1390], [-60, 1480]];
  const arm = resample([...top, ...bot], true, 40);
  const warm = 1 - 0.75 * ev(tCool - 0.4, 0.9);
  paint(arm, {
    fill: C.skin, key: 'arm', w: 5,
    tex: [
      { k: 'pencil', c: C.skinL, al: 0.55, per: 260, a: -0.2, len: 30 },
      { k: 'pencil', c: C.skinD, al: 0.5, per: 300, a: -0.2, len: 30, dens: (x, y) => clamp((y - 300 - x * -0.08) / 1200) },
      { k: 'hatch', a: 0.65, gap: 7, c: C.orangeD, al: 0.42, w: 1.4, dash: [14, 50], dens: (x, y) => warm * clamp(0.9 - Math.abs(y - 820) / 900) },
      { k: 'stipple', c: C.skinD, n: 900, s: 2.6, al: 0.7 },
    ],
  });
  // after "mát": a cool pencil wash creeps in
  const cool = ev(tCool - 0.3, 0.8);
  if (cool > 0) paint(arm, { raw: true, line: false, key: 'armc', tex: [{ k: 'pencil', c: C.sky, al: 0.35, per: 380, a: 0.5, len: 26, dens: () => cool * 0.8 }] });
  // fine arm hairs, swaying a touch
  for (let i = 0; i < 26; i++) {
    const R = RNG('hair', i), x = R.r(60, 1020), y = R.r(420, 1330) - x * 0.08, a = -0.5 + R.n(0.2) + Math.sin(TT * 2 + i) * 0.05, l = R.r(30, 50);
    if (Math.hypot(x - 540, y - 900) < 170) continue;
    ink([[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]], { w: 2.2, color: 'rgba(90,50,30,0.6)', key: 'hr' + i, amt: 0.8 });
  }
  // the sweat beads well up from "mồ hôi" (a few already there)
  K_DROPS.forEach(([x, y, r], i) => {
    const s = i < 3 ? 1 : popS(tBi - 0.6 + i * 0.12);
    if (s <= 0) return;
    const sw = 1 + 0.04 * Math.sin(TT * 3 + i);
    k_drop(x, y, r * s * sw, 'sd' + i);
  });
  // the evaporating drop near the hero: shrinks into wisps that carry heat motes away
  const ex = 400, ey = 700, er = 54, ek = ev(tEvap, 1.3);
  if (ek < 1) k_drop(ex, ey, er * (1 - ek) * (1 + 0.15 * popS(tBi) - 0.15), 'sevap');
  if (TT > tEvap) {
    for (let i = 0; i < 4; i++) {
      const P = [], len = clamp((TT - tEvap - i * 0.15) / 0.8) * 340;
      if (len <= 10) continue;
      for (let k = 0; k <= 14; k++) { const yy = ey - 20 - k * len / 14; P.push([ex - 45 + i * 30 + Math.sin(k * 0.7 + TT * 4 + i) * 16, yy]); }
      ink(P, { w: 5, color: 'rgba(150,190,210,0.85)', key: 'wisp' + i, amt: 1 });
    }
    // heat motes riding the wisps up and away
    for (let i = 0; i < 5; i++) {
      const u = (TT - tEvap - 0.3 - i * 0.22) / 1.6;
      if (u < 0 || u > 1) continue;
      heatMote(ex - 40 + i * 22 + Math.sin(u * 8 + i) * 18, ey - 30 - u * 520, 14, 'smo' + i);
    }
  }
  // card: "bay hơi" pops by the wisps
  if (TT > tEvap) inkCard('bay hơi', 240, 470, 60, { rot: -0.05, s: popS(tEvap + 0.1) });
  // the hero sits on the skin, then hops into a wisp on "mang" and is carried off the top
  const [hx, hy] = BR.turnSweat.b;
  let x = hx, y = hy;
  const up = seg(TT, tCarry, tCarry + 1.2);
  if (up > 0) {
    const hop = EZ.o2(seg(TT, tCarry, tCarry + 0.35));
    x = lerp(hx, ex + 10, hop) + Math.sin(TT * 6) * 10 * up;
    y = lerp(hy, ey - 120, hop) - EZ.i2(seg(TT, tCarry + 0.3, tCarry + 1.2)) * 1000;
  }
  if (y > -120) dotHero(x, y, HR, { key: 'hero', mood: TT > tEvap - 0.2 ? (up > 0 ? 'happy' : 'wow') : undefined, shadow: up <= 0 });
  // the big cyan drop: wells up on "nên da thấy mát", the bridge object (540,900, 105x140)
  const [bx, by, brx, bry] = BR.sweatLoop.a;
  const bs = popS(tBig);
  if (bs > 0) {
    const P = ellipsePts(bx, by, brx * bs, bry * bs, 0, 48);
    paint(ellipsePts(bx + 26, by + 34, brx * bs, bry * bs, 0, 32), { fill: 'rgba(120,70,40,0.25)', line: false, key: 'bigsh', tex: [{ k: 'hatch', a: 0.8, gap: 4, al: 0.45 }] });
    paint(P, { fill: C.sky, key: 'big', w: 5, tex: [{ k: 'pencil', c: C.skyL, al: 0.7, per: 30 }, { k: 'hatch', a: -0.7, gap: 6, al: 0.5, c: C.skyD, dens: (px, py) => clamp((px - bx) / brx * 0.6 + (py - by) / bry * 0.6 + 0.3) }] });
    paint(ellipsePts(bx - 38 * bs, by - 55 * bs, 20 * bs, 32 * bs, -0.5, 16), { fill: '#ffffff', line: false, key: 'bighl' });
  }
  inkTag('mồ hôi');
};

// =====================================================================
//  10 END — "Vì thế sau lưng tủ lạnh luôn ấm: đó chính là hơi nóng từ đồ ăn của bạn."
//  the same kitchen, the fridge turned to show its warm back coil; the hero sits content by it; the soup is cold
// =====================================================================
SCENES.end = function () {
  k_kitchenWall('ew', { wx: 720, ww: 220 });
  k_counter('ec', 560);
  const tWarm = VW('end', 'ấm'), tHeat = VW('end', 'hơi'), tFood = VW('end', 'đồ'), tBack = VW('end', 'sau');
  k_fridge('efr', { side: 110, note: 1, fix: ev(ET('end') + 0.6, 0.8), coil: 0.6 + 0.4 * ev(tWarm, 0.4) });
  // heat shimmer rising off the coil, stronger on "ấm"
  const nW = TT > tWarm ? 4 : 2;
  for (let i = 0; i < nW; i++) k_heatWave(600 + i * 26, 430, 110, 'ehw' + i, { amp: 8 });
  k_risingMotes(620, 820, TT > tBack ? 4 : 2, 'emo', { spread: 40, h: 380, life: 2.4, r: 13 });
  // the soup: back on the counter, cold — no steam, a little frost
  k_bowl(855, 1105, 100, 'ebowl', { cold: true });
  // the hero, content, warming itself by the coil
  const [hx, hy] = [680, 1065];
  dotHero(hx, hy, HR, { key: 'hero', mood: 'happy' });
  // two little motes keep it company, circling slowly
  for (let i = 0; i < 2; i++) { const a = TT * 1.4 + i * Math.PI; heatMote(hx + Math.cos(a) * 125, hy - 40 + Math.sin(a) * 40, 14, 'eorb' + i); }
  // the payoff card: "hơi nóng" / "của đồ ăn", written on with the voice
  const f1 = ev(tHeat - 0.1, 0.5), f2 = ev(tFood - 0.1, 0.5);
  if (f1 > 0) inkCard('hơi nóng', 770, 800, 62, { rot: -0.04, frac: f1, s: popS(tHeat - 0.15) });
  if (f2 > 0) inkCard('của đồ ăn', 790, 900, 62, { rot: 0.02, frac: f2, s: popS(tFood - 0.15) });
  // a tiny arrow from the card to the coil
  if (f1 > 0) ink([[640, 770], [610, 700]], { w: 4, key: 'earr', frac: f1 });
  // hard cut: the tag is drawn finished on the first frame (same place and look as inkTag)
  const tg = 'sau lưng tủ', f = () => inkCard(tg, 70 + (handW(tg, 80) + 72) / 2, 330, 80, { rot: -0.04 });
  if (DEFER) DEFER.push(f); else f();
};
