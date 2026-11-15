// =====================================================================
//  SCENES evap / comp / cond / valve — "inside the machine" close-ups (navy world). Owned by the machine agent.
//  Colour code: terracotta = heat (hero, motes, hot gas), cyan = cold (cold pipe, liquid, frost).
//  Bridges: evap in (540,820) out (800,820); comp in/out (540,760); cond in (540,760) out drop (540,1080,r90);
//  valve in drop (300,760,r90) out puff (700,800,r170).
// =====================================================================

// a polyline with rounded corners (quadratic bends of radius r)
function m_round(P, r, n = 8) {
  const out = [P[0]];
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[i - 1], b = P[i], c = P[i + 1];
    const la = dist(a, b), lc = dist(b, c), ra = Math.min(r, la / 2), rc = Math.min(r, lc / 2);
    const p0 = [b[0] + (a[0] - b[0]) * ra / la, b[1] + (a[1] - b[1]) * ra / la];
    const p2 = [b[0] + (c[0] - b[0]) * rc / lc, b[1] + (c[1] - b[1]) * rc / lc];
    for (let k = 0; k <= n; k++) { const t = k / n, u = 1 - t; out.push([u * u * p0[0] + 2 * u * t * b[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * b[1] + t * t * p2[1]]); }
  }
  out.push(P[P.length - 1]);
  return out;
}
// fraction along polyline Q nearest to point p
function m_near(Q, p) {
  let best = 1e9, bi = 0, L = 0, Lb = 0;
  for (let i = 0; i < Q.length; i++) { if (i) L += dist(Q[i - 1], Q[i]); const d = dist(Q[i], p); if (d < best) { best = d; bi = i; Lb = L; } }
  return Lb / (L || 1);
}
// point + unit normal at fraction f along Q
function m_at(Q, f) {
  const a = pointAt(Q, clamp(f - 0.002)), b = pointAt(Q, clamp(f + 0.002)), p = pointAt(Q, clamp(f));
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  return { p, n: [-dy / l, dx / l] };
}
// a liquid drop / ball in cold cyan: fill, pencil highlight, hatch shading bottom-right, a white glint
function m_drop(x, y, rx, ry, key) {
  paint(ellipsePts(x, y, rx, ry, 0, 48), {
    fill: C.cyan, key, line: C.peri, w: 4,
    tex: [{ k: 'hatch', c: '#1f6f78', a: 0.8, gap: 6, al: 0.55, dens: (px, py) => clamp(((px - x) + (py - y)) / Math.max(rx, ry) + 0.2) },
      { k: 'pencil', c: '#e6fffb', al: 0.5, per: 60, dens: (px, py) => clamp(((x - px) + (y - py)) / Math.max(rx, ry)) }],
  });
  ink(arcPts(x - rx * 0.1, y - ry * 0.1, Math.min(rx, ry) * 0.62, Math.PI * 1.08, Math.PI * 1.42, 10), { w: Math.max(3, rx * 0.08), color: C.white, key: key + 'gl', amt: 0.6 });
}
// a 6-armed frost crystal
function m_frost(x, y, s, key, rot = 0, col = C.white) {
  for (let k = 0; k < 6; k++) {
    const a = rot + k * Math.PI / 3, ex = x + Math.cos(a) * s, ey = y + Math.sin(a) * s;
    ink([[x, y], [ex, ey]], { w: Math.max(2.4, s * 0.14), color: col, key: key + k, amt: 0.4 });
    const bx = x + Math.cos(a) * s * 0.6, by = y + Math.sin(a) * s * 0.6;
    for (const t of [-0.7, 0.7]) ink([[bx, by], [bx + Math.cos(a + t) * s * 0.35, by + Math.sin(a + t) * s * 0.35]], { w: Math.max(2, s * 0.1), color: col, key: key + k + t, amt: 0.3 });
  }
}
// an inked arrow along P (arrowhead at the end)
function m_arrow(P, o = {}) {
  const Q = ink(P, { w: o.w ?? 6, color: o.color || C.peri, key: o.key || 'arr', frac: o.frac, amt: 1.4 });
  if ((o.frac ?? 1) < 0.98) return;
  const b = P[P.length - 1], a = P[P.length - 2], an = Math.atan2(b[1] - a[1], b[0] - a[0]), L = o.head ?? 34;
  ink([[b[0] + Math.cos(an + 2.6) * L, b[1] + Math.sin(an + 2.6) * L], b, [b[0] + Math.cos(an - 2.6) * L, b[1] + Math.sin(an - 2.6) * L]], { w: o.w ?? 6, color: o.color || C.peri, key: (o.key || 'arr') + 'h', amt: 1 });
}

// ---------------------------------------------------------------------
//  5 · EVAP — dàn lạnh: a big frosty zig-zag pipe across the inside of the fridge; the soup gives up its heat
// ---------------------------------------------------------------------
const m_EVAP_ARC = arcPts(660, 820, 110, -Math.PI / 2, 0, 12);
const m_EVAP_P = [...m_round([[-40, 470], [900, 470], [900, 590], [180, 590], [180, 710], [660, 710]], 60), ...m_EVAP_ARC.slice(1), [1120, 820]];
const m_EVAP_RIDE = [[540, 710], [660, 710], ...m_EVAP_ARC.slice(1), [800, 820]];
SCENES.evap = function () {
  const t0 = ET('evap'), t1 = EE('evap'), tBoil = VW('evap', 'sôi'), tSuck = VW('evap', 'hút');
  darkWorld('evap');
  // the fridge's inside: back wall panel, side walls in perspective, a wire shelf
  paint(rrectPts(70, 400, 940, 830, 26), { fill: C.navy2, line: C.periD, w: 3, key: 'ev_wall', tex: [{ k: 'hatch', c: C.periD, a: 1.1, gap: 9, al: 0.35, dens: (x, y) => clamp((x + y - 900) / 900) }, { k: 'stipple', c: C.periS, n: 260, s: 2 }] });
  ink([[70, 400], [20, 340]], { w: 3, color: C.periD, key: 'ev_c1' }); ink([[1010, 400], [1060, 340]], { w: 3, color: C.periD, key: 'ev_c2' });
  ink([[70, 1230], [20, 1290]], { w: 3, color: C.periD, key: 'ev_c3' }); ink([[1010, 1230], [1060, 1290]], { w: 3, color: C.periD, key: 'ev_c4' });
  // evaporator plate fins behind the pipe
  for (let x = 120; x <= 960; x += 42) ink([[x, 440], [x, 750]], { w: 2, color: 'rgba(200,208,240,0.22)', key: 'ev_fin' + x, amt: 1 });
  // the pipe: cold, picks up a hair of warmth toward the exit after the heat arrives
  const warm = 0.28 * ev(tSuck + 0.4, 1.2);
  pipe(m_EVAP_P, { w: 62, u: (f) => warm * clamp((f - 0.6) / 0.4), flow: 1.2, key: 'ev_pipe' });
  const Q = resample(m_EVAP_P, false, 8), L = pathLen(Q);
  // frost on the pipe: tiny white ticks along the top edge
  { const S = RNG('ev_fr'); for (let i = 0; i < 90; i++) { const f = S.f(), { p, n } = m_at(Q, f), s = S.r(4, 9), o = S.n(1) > 0 ? 31 : -31; ink([[p[0] + n[0] * o, p[1] + n[1] * o], [p[0] + n[0] * (o + Math.sign(o) * s), p[1] + n[1] * (o + Math.sign(o) * s)]], { w: 2.2, color: 'rgba(244,246,255,0.75)', key: 'ev_ft' + i, amt: 0.6 }); } }
  // boiling: bubbles grow in the pipe and travel with the flow
  const nb = Math.floor(40 * ev(tBoil, 0.6));
  for (let i = 0; i < nb; i++) {
    const S = RNG('ev_b', i), life = S.r(0.7, 1.3), ph = mod((TT - tBoil) / life + S.f(), 1), f = mod(S.f() + (TT - tBoil) * 0.035, 1);
    const { p, n } = m_at(Q, f), off = S.n(12), r = 5 + 12 * ph;
    if (p[0] < -10 || p[0] > W + 10) continue;
    ink(ellipsePts(p[0] + n[0] * off, p[1] + n[1] * off, r, r, 0, 14), { closed: true, w: 3.4, color: ph > 0.9 ? 'rgba(244,246,255,0.4)' : C.white, key: 'ev_bb' + i, amt: 0.5 });
  }
  if (TT >= tBoil) handText('sôi!', 940 - handW('sôi!', 64), 440, 64, C.white, { key: 'ev_soi', frac: ev(tBoil, 0.3), rot: -0.05 });
  // the shelf + the bowl of soup
  ink([[90, 1190], [990, 1190]], { w: 4, color: C.peri, key: 'ev_sh' });
  for (let x = 110; x < 990; x += 36) ink([[x, 1190], [x + 18, 1222]], { w: 2, color: C.periD, key: 'ev_shw' + x, amt: 0.6 });
  const soupU = lerp(0.85, 0.42, ev(tSuck, 1.6));
  paint([...arcPts(540, 1080, 170, 0, Math.PI, 24)], { fill: C.navy2, line: C.peri, w: 4, key: 'ev_bowl', tex: [{ k: 'hatch', c: C.periD, a: 0.7, gap: 6, al: 0.6, dens: (x) => clamp((x - 420) / 260) }, { k: 'pencil', c: C.peri, al: 0.25, per: 90 }] });
  paint(ellipsePts(540, 1080, 170, 34, 0, 40), { fill: tempCol(soupU), line: C.peri, w: 3.5, key: 'ev_soup', tex: [{ k: 'pencil', c: 'rgba(255,240,220,0.8)', al: 0.4, per: 40 }, { k: 'cross', c: 'rgba(0,0,0,0.3)', gap: 7, al: 0.35 }] });
  vapour(540, 1030, { n: 3, color: `rgba(240,170,140,${(0.55 * (1 - ev(tSuck, 1.2))).toFixed(2)})`, key: 'ev_st' });
  // heat motes: bob over the soup, then leap into the pipe on "hút" and ride away with the vapour
  const lands = [300, 380, 460, 620, 250, 420];
  lands.forEach((lx, i) => {
    const S = RNG('ev_m', i), bx = 420 + i * 48, by = 1010 + S.n(18) + Math.sin(TT * 3 + i) * 6, tl = tSuck + 0.12 + i * 0.14, dur = 0.5;
    const land = [lx, 710], fl = m_near(Q, land);
    let x, y;
    if (TT < tl) { x = bx; y = by; }
    else if (TT < tl + dur) { const k = (TT - tl) / dur; x = lerp(bx, lx, k); y = lerp(by, 710, k) - Math.sin(k * Math.PI) * 120; }
    else { const p = pointAt(Q, clamp(fl + (TT - tl - dur) * 300 / L)); x = p[0]; y = p[1] + Math.sin(TT * 6 + i) * 6; }
    if (x < W + 30) heatMote(x, y, 17, 'ev_mo' + i);
  });
  // the hero: over the soup, leaps up into the pipe on "hút", rides right to (800,820)
  const tJ = tSuck + 0.05, tR0 = tJ + 0.45, tR1 = t1 - 0.6;
  let hx = 540, hy = 820;
  if (TT >= tJ && TT < tR0) { hy = springMove(tJ, 820, 710, SPRING.playful) - Math.sin(clamp((TT - tJ) / 0.45) * Math.PI) * 60; }
  else if (TT >= tR0) { const p = pointAt(m_EVAP_RIDE, EZ.io(seg(TT, tR0, tR1))); hx = p[0]; hy = p[1]; }
  dotHero(hx, hy, HR, { key: 'hero', dark: true, mood: TT >= tJ && TT < tR1 ? 'wow' : undefined });
  inkTag('dàn lạnh');
};

// ---------------------------------------------------------------------
//  6 · COMP — máy nén: a piston squeezes the vapour; the gas turns cyan -> terracotta, hotter than the kitchen
// ---------------------------------------------------------------------
SCENES.comp = function () {
  const t0 = ET('comp'), t1 = EE('comp'), tP1 = VW('comp', 'ép'), tP2 = VW('comp', 'nén', 2), tHot = VW('comp', 'nóng'), tMore = VW('comp', 'hơn');
  darkWorld('comp');
  const X0 = 370, X1 = 710, TOP = 540;
  const pTop = springTrack([[0, 1120], [tP1, 1000], [tP2, 885]], SPRING.heavy);
  const u = 0.08 + 0.9 * smooth(tHot - 0.1, tHot + 0.9, TT);
  // pipes: cold in (left), out in the gas's colour (right)
  pipe([[-40, 610], [X0 - 40, 610]], { w: 40, u: 0.05, flow: 0.8, key: 'cp_in' });
  pipe([[X1 + 40, 610], [W + 40, 610]], { w: 40, u, flow: 0.8 + u, key: 'cp_out' });
  // the cylinder: thick inked walls + a head
  const wallTex = [{ k: 'cross', c: C.periD, gap: 7, al: 0.45 }, { k: 'pencil', c: C.peri, al: 0.2, per: 80 }];
  paint(rrectPts(X0 - 40, TOP - 60, X1 - X0 + 80, 60, 10), { fill: C.navy2, line: C.peri, w: 4, key: 'cp_head', tex: wallTex });
  paint(rrectPts(X0 - 40, TOP - 4, 40, 1300 - TOP, 4), { fill: C.navy2, line: C.peri, w: 4, key: 'cp_wl', tex: wallTex });
  paint(rrectPts(X1, TOP - 4, 40, 1300 - TOP, 4), { fill: C.navy2, line: C.peri, w: 4, key: 'cp_wr', tex: wallTex });
  for (let i = 0; i < 6; i++) ink([[X0 - 60, TOP + 60 + i * 110], [X0 - 40, TOP + 60 + i * 110]], { w: 3, color: C.periD, key: 'cp_bl' + i });
  // the gas chamber: colour of its temperature, hatching denser as it's squeezed
  const squeeze = clamp((1120 - pTop) / 235);
  paint(rrectPts(X0, TOP, X1 - X0, pTop - TOP, 2), {
    fill: tempCol(u), fillAl: 0.6, line: false, key: 'cp_gas',
    tex: [{ k: 'hatch', c: tempCol(u), a: 0.8, gap: lerp(12, 6, squeeze), al: 0.7 }, { k: 'stipple', c: 'rgba(255,255,255,0.5)', n: 220, s: 2.4 }],
  });
  if (u > 0.6) for (let i = 0; i < 4; i++) { const yy = TOP + 40 + i * ((pTop - TOP - 60) / 3); ink([[X0 + 20, yy], [X0 + 60, yy - 10], [X0 + 100, yy]], { w: 3, color: 'rgba(255,220,190,0.5)', key: 'cp_hw' + i }); }
  // motes: spread through the chamber, crowding as it shrinks, jittering faster as it heats
  for (let i = 0; i < 12; i++) {
    const S = RNG('cp_m', i), nx = S.r(0.08, 0.92), ny = S.r(0.06, 0.94), jt = 4 + 10 * u;
    let x = lerp(X0 + 24, X1 - 24, nx), y = lerp(TOP + 24, pTop - 24, ny);
    if (Math.abs(x - 540) < 95 && Math.abs(y - 760) < 95) x += x < 540 ? -95 : 95;
    x = clamp(x, X0 + 22, X1 - 22);
    heatMote(x + Math.sin(TT * (8 + u * 10) + i * 2.1) * jt, y + Math.cos(TT * (7 + u * 9) + i * 1.3) * jt, 17, 'cp_mo' + i);
  }
  // the piston + rod
  paint(rrectPts(530, pTop + 80, 40, 1400 - pTop, 6), { fill: C.navy2, line: C.peri, w: 3.5, key: 'cp_rod', tex: [{ k: 'hatch', c: C.periD, a: 1.57, gap: 6, al: 0.6 }] });
  paint(rrectPts(X0 + 2, pTop, X1 - X0 - 4, 92, 8), { fill: C.periD, line: C.peri, w: 4, key: 'cp_pis', tex: [{ k: 'cross', c: C.navy2, gap: 6, al: 0.55 }, { k: 'pencil', c: C.white, al: 0.3, per: 60, dens: (px, py) => clamp((pTop + 40 - py) / 40) }] });
  for (const k of [22, 46]) ink([[X0 + 6, pTop + k], [X1 - 6, pTop + k]], { w: 2.5, color: C.navy2, key: 'cp_ring' + k });
  // push arrows below the piston while it moves
  for (const tp of [tP1, tP2]) {
    const k = seg(TT, tp - 0.05, tp + 0.55); if (k <= 0 || k >= 1) continue;
    for (const sx of [450, 630]) m_arrow([[sx, pTop + 250], [sx, pTop + 130]], { key: 'cp_pa' + sx + tp, color: C.white, w: 7, head: 26 });
  }
  // the thermometer passes the kitchen's 25 °C
  const val = lerp(-10, 45, smooth(tHot - 0.1, tHot + 1.0, TT)), TX = 900, TY = 1110, TH = 300;
  thermo(TX, TY, val, '°C', { h: TH, key: 'cp_th', frac: 0 });
  const s = (val < 0 ? '−' : '') + Math.abs(Math.round(val)) + '°C';
  handText(s, TX - handW(s, 64) / 2, TY - TH - 26, 64, C.white, { key: 'cp_tv' });
  const yK = TY - 20 - (TH - 50) * 0.75;
  ctx.save(); ctx.setLineDash([10, 8]); ink([[840, yK], [990, yK]], { w: 3, color: C.peri, key: 'cp_k' }); ctx.restore();
  handText('bếp', 768, yK + 16, 50, C.peri, { key: 'cp_bep' });
  // the hero: squeezed in the middle, wiggling
  const wig = smooth(tP1, tP1 + 0.3, TT) * (1 - smooth(t1 - 0.9, t1 - 0.6, TT));
  dotHero(540 + Math.sin(TT * 9) * 7 * wig, 760 + Math.cos(TT * 7) * 5 * wig, HR, { key: 'hero', dark: true, mood: TT > tP1 ? 'wow' : undefined });
  if (TT >= tMore) stationLabel('nóng hơn bếp!', 640, 432, { s: popS(tMore), rot: 0.03 });
  inkTag('máy nén');
};

// ---------------------------------------------------------------------
//  7 · COND — dàn nóng sau lưng tủ: a finned coil glowing warm; the heat floats out into the room; the gas condenses
// ---------------------------------------------------------------------
const m_COND_P = m_round([[960, 360], [960, 520], [420, 520], [420, 640], [960, 640], [960, 760], [420, 760], [420, 880], [540, 880], [540, 975]], 58);
SCENES.cond = function () {
  const t0 = ET('cond'), t1 = EE('cond'), tGlow = VW('cond', 'nóng'), tFlow = VW('cond', 'chảy'), tRoom = VW('cond', 'phòng'), tCon = VW('cond', 'ngưng');
  darkWorld('cond');
  const k1 = smooth(tFlow, tFlow + 1.4, TT), k2 = smooth(tCon, tCon + 0.8, TT);
  const glow = (0.55 + 0.45 * smooth(tGlow, tGlow + 0.5, TT)) * (1 - 0.65 * k1) * (0.9 + 0.1 * Math.sin(TT * 9));
  // the back of the fridge: a panel, warm hatching glowing around the coil
  const runs = [520, 640, 760, 880];
  paint(rrectPts(380, 410, 640, 620, 14), {
    fill: C.navy2, line: C.periD, w: 3, key: 'cd_back',
    tex: [{ k: 'hatch', c: C.periD, a: 1.57, gap: 10, al: 0.3 },
      { k: 'hatch', c: C.terra, a: 0.75, gap: 5, al: 0.85 * glow, dens: (x, y) => clamp(1 - Math.min(...runs.map((r) => Math.abs(y - r))) / 70) * clamp((x - 380) / 60) },
      { k: 'hatch', c: C.orangeL, a: -0.75, gap: 7, al: 0.5 * glow, dens: (x, y) => clamp(1 - Math.min(...runs.map((r) => Math.abs(y - r))) / 45) }],
  });
  ink(m_COND_P, { w: 90, color: `rgba(217,119,87,${(0.22 * glow).toFixed(3)})`, key: 'cd_glow', amt: 2 });
  // wire fins across the coil
  for (let x = 450; x <= 940; x += 28) ink([[x, 490], [x, 905]], { w: 2.2, color: 'rgba(200,208,240,0.45)', key: 'cd_fin' + x, amt: 1 });
  for (const y of [470, 925]) ink([[400, y], [1000, y]], { w: 6, color: C.periD, key: 'cd_rail' + y });
  // the coil: hot at the inlet, cooler along it once heat leaves, cyan at the outlet once it condenses
  const uf = (f) => clamp(1 - f * (0.45 * k1 + 0.55 * k2) - 0.08 * f);
  pipe(m_COND_P, { w: 38, u: uf, flow: 1, key: 'cd_pipe' });
  const Q = resample(m_COND_P, false, 8), L = pathLen(Q);
  // condensing: liquid drops forming in the lower runs and flowing to the outlet
  const nd = Math.floor(14 * k2);
  for (let i = 0; i < nd; i++) {
    const S = RNG('cd_d', i), f = 0.55 + mod(S.f() + (TT - tCon) * 0.09, 0.45), { p } = m_at(Q, f), r = S.r(8, 13);
    m_drop(p[0], p[1] + 4, r * 1.1, r, 'cd_dr' + i);
  }
  // heat motes: ride in the coil, then float out into the room (left) on "chảy"
  const fH = m_near(Q, [540, 760]);
  for (let i = 0; i < 8; i++) {
    const S = RNG('cd_m', i), f0 = mod(S.f() * 0.8 + TT * 0.02, 0.85), tl = tFlow + 0.1 + i * 0.13;
    const { p } = m_at(Q, f0);
    const tgt = [S.r(80, 330), S.r(420, 1040)];
    let x = p[0], y = p[1];
    if (TT >= tl) { const k = springEase(TT - tl, 60, 14); const drift = Math.max(0, TT - tl - 1) * 30; x = lerp(p[0], tgt[0], k) - drift; y = lerp(p[1], tgt[1], k) - drift * 0.5 + Math.sin(TT * 3 + i) * 8; }
    if (x > -30) heatMote(x, y, 17, 'cd_mo' + i);
  }
  // warm wisps rising from the room side once the heat is out
  if (TT >= tFlow + 0.6) vapour(150, 1110, { n: 3, color: 'rgba(240,170,140,0.5)', key: 'cd_air', step: 18 });
  // the arrow + label: "ra phòng"
  m_arrow([[400, 680], [300, 660], [110, 672]], { key: 'cd_arr', frac: ev(tFlow, 0.5), color: C.white, w: 7 });
  if (TT >= tRoom) stationLabel('ra phòng', 215, 560, { s: popS(tRoom) });
  // the hero: in the coil, then floats out into the room
  const hx = springMove(tFlow + 0.15, 540, 205, SPRING.heavy), hy = springMove(tFlow + 0.15, 760, 830, SPRING.heavy);
  dotHero(hx, hy, HR, { key: 'hero', dark: true, mood: TT > tFlow + 0.8 ? 'happy' : undefined });
  // one drop forms at the outlet and hangs, centred at (540,1080) r 90 from EE - 0.6
  const r = springMove(tCon + 0.05, 0, 90, SPRING.snappy);
  if (r > 2) {
    const cy = 975 + r * 1.1667;
    ink([[540, 970], [540, cy - r]], { w: Math.min(26, r * 0.4), color: C.cyan, key: 'cd_neck', amt: 0.5 });
    m_drop(540, cy, r, r, 'cd_big');
  }
  inkTag('dàn nóng');
};

// ---------------------------------------------------------------------
//  8 · VALVE — ống mao: the drop squeezes into a hair-thin coiled tube, pressure falls, it bursts out as frosty spray
// ---------------------------------------------------------------------
const m_CAP = (() => {
  // mouth (390,760) -> climbs -> a long horizontal helix along y 530 -> turns down -> exits at (840,660) into the puff
  const P = m_round([[390, 760], [450, 760], [450, 560]], 40, 8).slice(0, -1);
  const n = 260, loops = 7.5, xa = 450, xb = 850;
  for (let k = 0; k <= n; k++) { const th = k / n * TAU * loops; P.push([xa + (xb - xa) * k / n + 16 * Math.sin(th), 530 + 30 * Math.cos(th)]); }
  P.push(...m_round([[850, 500], [890, 500], [890, 630], [840, 662]], 40, 8).slice(1));
  return P;
})();
SCENES.valve = function () {
  const t0 = ET('valve'), t1 = EE('valve'), tIn = VW('valve', 'ống'), tDrop = VW('valve', 'tụt'), tCold = VW('valve', 'lạnh');
  darkWorld('valve');
  const fz = ev(tDrop + 0.2, 0.8);
  // the fat pipe from the condenser, a funnel, then the hair-thin capillary
  pipe([[-40, 760], [300, 760]], { w: 54, u: 0.5, flow: 0.6, key: 'vl_fat' });
  paint([[296, 729], [392, 754], [392, 766], [296, 791]], { fill: tempCol(0.5), line: C.peri, w: 4, key: 'vl_fun', tex: [{ k: 'hatch', c: C.periD, a: 0.8, gap: 5, al: 0.5 }] });
  ink(m_CAP, { w: 12, color: C.peri, key: 'vl_capo', amt: 0.7 });
  ink(m_CAP, { w: 5, color: tempCol(lerp(0.35, 0, fz)), key: 'vl_cap', amt: 0.7 });
  const Qc = resample(m_CAP, false, 4), Lc = pathLen(Qc);
  // slugs of liquid racing through the tube while the drop squeezes in
  if (TT > tIn + 0.1 && TT < t1 - 0.3) for (let s = mod(TT * 900, 80); s < Lc; s += 80) {
    const a = pointAt(Qc, s / Lc), b = pointAt(Qc, Math.min(1, (s + 26) / Lc));
    ink([a, b], { w: 6, color: C.white, key: 'vl_sl' + Math.round(s), amt: 0.3 });
  }
  // frost creeping along the tube once the pressure drops
  { const S = RNG('vl_tf'); for (let i = 0; i < 70; i++) { const f = S.f(); if (f > 0.25 + 0.75 * fz || fz <= 0) continue; const p = pointAt(Qc, 1 - f), a = S.r(0, TAU), l = S.r(5, 11); ink([[p[0], p[1]], [p[0] + Math.cos(a) * l, p[1] + Math.sin(a) * l]], { w: 2.4, color: C.white, key: 'vl_tfi' + i, amt: 0.4 }); } }
  handText('nhỏ xíu', 560, 440, 54, C.peri, { key: 'vl_nx', frac: ev(VW('valve', 'nhỏ'), 0.35), rot: -0.03 });
  // the pressure gauge on the capillary
  const GX = 300, GY = 1080, GR = 110;
  ink([[GX, GY - GR], [GX, 930], [420, 900], [450, 790]], { w: 9, color: C.periD, key: 'vl_stem' });
  paint(ellipsePts(GX, GY, GR, GR, 0, 48), { fill: C.navy2, line: C.peri, w: 5, key: 'vl_g', tex: [{ k: 'hatch', c: C.periD, a: 0.8, gap: 6, al: 0.5, dens: (x, y) => clamp((x - GX + y - GY) / GR + 0.3) }, { k: 'pencil', c: C.peri, al: 0.2, per: 60 }] });
  for (let i = 0; i <= 8; i++) { const a = 0.75 * Math.PI + i / 8 * 1.5 * Math.PI, r0 = GR * (i % 2 ? 0.74 : 0.64); ink([[GX + Math.cos(a) * r0, GY + Math.sin(a) * r0], [GX + Math.cos(a) * GR * 0.86, GY + Math.sin(a) * GR * 0.86]], { w: 3.4, color: C.peri, key: 'vl_tk' + i, amt: 0.3 }); }
  const gv = springMove(tDrop, 0.88, 0.08, SPRING.playful) + (TT < tDrop ? Math.sin(TT * 20) * 0.015 : 0), ga = 0.75 * Math.PI + gv * 1.5 * Math.PI;
  ink([[GX - Math.cos(ga) * 16, GY - Math.sin(ga) * 16], [GX + Math.cos(ga) * GR * 0.8, GY + Math.sin(ga) * GR * 0.8]], { w: 8, color: C.white, key: 'vl_nd', amt: 0.4 });
  ctx.fillStyle = C.peri; ctx.beginPath(); ctx.arc(GX, GY, 12, 0, TAU); ctx.fill();
  handText('áp suất', 75, 935, 54, C.peri, { key: 'vl_ap' });
  if (TT >= tDrop) m_arrow([[GX + GR + 45, GY - 70], [GX + GR + 45, GY + 40]], { key: 'vl_down', color: C.white, w: 7, head: 24, frac: ev(tDrop, 0.3) });
  // the drop: holds at (300,760), then squeezes into the funnel
  const k = EZ.io(seg(TT, tIn, tIn + 1.4)), r = lerp(90, 0, k);
  if (r > 3) { const rx = r * (1 + 0.18 * Math.sin(k * Math.PI)), cx = lerp(300, 380 - rx * 0.6, k); m_drop(cx, 760, rx, r * (1 - 0.12 * Math.sin(k * Math.PI)), 'vl_drop'); }
  // the spray out of the far end, and the cold puff growing to r 170 at (700,800)
  const tS = tDrop + 0.1, EX = 840, EY = 662;
  if (TT >= tS) {
    const g = springEase(TT - tS, 90, 19), pr = lerp(26, 170, g), px = lerp(EX, 700, g), py = lerp(EY, 800, g);
    for (let i = 0; i < 30; i++) {
      const S = RNG('vl_sp', i), life = S.r(0.5, 0.9), ph = mod((TT - tS) / life + S.f(), 1), a = S.r(0.9, 3.0), d = 30 + ph * S.r(200, 330);
      const x = EX + Math.cos(a) * d, y = EY + Math.sin(a) * d, s = 5 + 6 * (1 - ph);
      ink([[x - s, y - s * 0.3], [x + s, y + s * 0.3]], { w: 4, color: i % 3 ? C.white : C.cyan, key: 'vl_spp' + i, amt: 0.3 });
    }
    const P = ellipsePts(px, py, pr, pr, 0, 72).map(([x, y], i) => { const b = 1 + 0.03 * Math.sin(i * 0.785 + TT * 3); return [px + (x - px) * b, py + (y - py) * b]; });
    paint(P, { fill: C.skyL, line: C.white, w: 5, key: 'vl_puff', tex: [{ k: 'hatch', c: C.teal, a: 0.8, gap: 6, al: 0.55, dens: (x, y) => clamp((x - px + y - py) / pr + 0.3) }, { k: 'stipple', c: C.white, n: 600, s: 3.4 }] });
    for (let i = 0; i < 12; i++) {
      const S = RNG('vl_cr', i), tc = tCold - 0.4 + i * 0.1, inside = i % 3 === 0, a = inside ? S.r(0, TAU) : S.r(2.1, 6.0), d = (inside ? S.r(0.1, 0.6) : S.r(1.12, 1.32)) * pr;
      if (TT >= tc) m_frost(px + Math.cos(a) * d, py + Math.sin(a) * d, S.r(18, 32) * popS(tc), 'vl_fc' + i, S.r(0, 1) + TT * 0.3, inside ? C.teal : C.white);
    }
  }
  // the thermometer: the liquid's temperature falls to −12 °C
  const val = springMove(tDrop + 0.15, 22, -12, SPRING.heavy);
  thermo(950, 1180, val, '°C', { h: 260, key: 'vl_th', labelLeft: true });
  inkTag('ống mao');
};
