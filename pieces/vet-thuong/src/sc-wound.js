// =====================================================================
//  sc-wound.js — eras plug · clot · clean (owned by the sc-wound agent).
//  ONE place: the skin slice, evolving. Every state is a function of the absolute time TT (WD_state), and ONE stage
//  function (WD_stage) draws everything in all three eras, so the morph bridges inside this block join identical
//  pictures. The hero never moves: [290, 650, 60] (BR.hookPlug.b ... BR.cleanFill.a); it only looks and reacts.
//   plug  (7.0–12.5)  "cắt": blood spurts from the two vessel stubs and fills the empty cut · "co lại": the stubs
//                     narrow (inward ink arrows), the spurts shrink · "tiểu cầu": 8 platelets float up from the stubs
//                     · "dính vào nhau": they sprout arms and clump across the cut at the top of the blood · "bịt kín":
//                     the last trickle stops.
//   clot  (12.5–18.75) "sợi huyết": cream threads grow across the cut, the blood swells to the top (the plug rides up)
//                     · 5 red cells drift out of the stubs and get caught ("giữ") · "khô dần": the top crusts into
//                     the scab (red -> dark brown); the platelets sink into it, the trapped cells melt into the clot.
//   clean (18.75–25.5) 3 germs wriggle in at the scab edges · "bạch cầu": 2 white cells squeeze out of the stubs and
//                     roll to them · "ăn": one swallows a germ (it vanishes inside), then the other, then the third ·
//                     "đỏ / sưng / ấm": the vessels widen, orange glow, the cut sides puff, a thermometer rises.
//                     The white cells roll back into the stubs; by the end: blood 1, scab 1, dry 1, redness 1, no germs.
// =====================================================================
const WD_HERO = [290, 650, 60];
let WD_Wc = null;
function WD_W() {   // spoken-word cue times (absolute s), computed once VOICE is available
  if (WD_Wc) return WD_Wc;
  WD_Wc = {
    cat: VW('plug', 'cắt'), co: VW('plug', 'co'), tieu: VW('plug', 'tiểu'), dinh: VW('plug', 'dính'), nhau: VW('plug', 'nhau'),
    bit: VW('plug', 'bịt'),
    soi: VW('clot', 'sợi'), huyet: VW('clot', 'huyết'), luoi: VW('clot', 'lưới'), giu: VW('clot', 'giữ'), roi: VW('clot', 'rồi'),
    kho: VW('clot', 'khô'), vay: VW('clot', 'vảy'),
    cau: VW('clean', 'cầu'), an: VW('clean', 'ăn'), khuan: VW('clean', 'khuẩn'), the: VW('clean', 'thế'),
    quanh: VW('clean', 'quanh'), do: VW('clean', 'đỏ'), sung: VW('clean', 'sưng'), am: VW('clean', 'ấm'),
    c0: ET('clean'), cEnd: EE('clean'),
  };
  return WD_Wc;
}
const WD_top = (bl) => lerp(SK.bot + 10, SK.top - 6, bl);          // y of the blood surface for a blood level
// an ink arrow that grows and shrinks with k (ink ignores alpha, so the stroke and head scale with k instead)
const WD_arrow = (x0, y0, x1, y1, k, o = {}) => { if (k > 0.2) simpleArrow(x0, y0, x1, y1, { ...o, part: k, w: (o.w ?? 6) * (0.4 + 0.6 * k), head: (o.head ?? 18) * k }); };
const WD_bump = (t, a, b) => Math.sin(Math.PI * seg(t, a, b));       // 0 -> 1 -> 0 over [a, b]

// ---- the slice state at time t (continuous over the three eras)
function WD_state(t) {
  const w = WD_W();
  const bleed = 0.9 * EZ.o2(seg(t, w.cat, w.cat + 0.35)) * lerp(1, 0.3, EZ.io(seg(t, w.co, w.co + 0.6))) * (1 - EZ.io(seg(t, w.bit, w.bit + 0.5)));
  const squash = EZ.io(seg(t, w.co, w.co + 0.5)) * (1 - EZ.io(seg(t, w.do - 0.1, w.do + 0.7)));   // widens again: inflammation
  const blood = 0.6 * EZ.o2(seg(t, w.cat, w.co + 0.5)) + 0.12 * EZ.io(seg(t, w.co + 0.3, w.bit + 0.4)) + 0.28 * EZ.io(seg(t, w.huyet, w.giu + 0.4));
  const scab = EZ.io(seg(t, w.kho, w.vay + 0.2));
  const scabDry = EZ.io(seg(t, w.kho + 0.4, w.vay + 0.9));
  const redness = 0.6 * EZ.io(seg(t, w.do, w.do + 0.7)) + 0.4 * EZ.io(seg(t, w.sung, w.sung + 0.6));
  return { bleed, squash, blood, scab, scabDry, redness };
}

// ---- hero + partner reactions (shared by the three eras)
function WD_mood(t) {
  const w = WD_W();
  if (t < w.cat) return ['calm', 0.5];
  if (t < w.tieu) return ['wow', 1];
  if (t < w.bit) return ['calm', 1];
  if (t < w.huyet) return ['happy', 0.6];
  if (t < w.kho) return ['calm', 1];
  if (t < w.vay + 0.6) return ['wow', 0.8];
  if (t < w.c0 + 0.15) return ['calm', 0.6];
  if (t < w.khuan + 0.6) return ['sad', 1];
  return ['happy', 0.7];
}

// ---- a red cell drawn a shade darker than the liquid blood so it reads on it; m 0..1 melts it into the clot
function WD_redCell(x, y, r, a, m, key) {
  if (m >= 0.999) return;
  const rr = r * (1 - 0.35 * m);
  cut(ellipsePts(x, y, rr, rr * 0.66, a, 20), mixHex(COL.bloodD, COL.blood, m), { key, tear: 0.4, sb: 4 * (1 - m), sy: 2 * (1 - m), sx: 1, grain: false, shade: false });
  ctx.fillStyle = `rgba(233,141,147,${0.6 * (1 - m)})`; ctx.beginPath(); ctx.ellipse(x, y, rr * 0.45, rr * 0.3, a, 0, TAU); ctx.fill();
}

// ---- a short label that springs in at t0 and sinks away at t1 (Pangolin, coloured underline)
function WD_label(str, x, y, t0, t1, under, size = 56) {
  const a = clamp(pop(t0, SPRING.smooth)) * (1 - EZ.io(seg(TT, t1 - 0.3, t1)));
  if (a <= 0.001) return;
  const dy = (1 - clamp(pop(t0, SPRING.smooth))) * 14 + 10 * EZ.i2(seg(TT, t1 - 0.3, t1));
  const wdt = vtext(str, x, y + dy, size, { al: a });
  if (under && a > 0.03) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = under; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - wdt / 2 * a, y + 16 + dy); ctx.quadraticCurveTo(x, y + 17 + dy, x + wdt / 2 * a, y + 12 + dy); ctx.stroke(); ctx.restore(); }
}

// ---- platelets: rise from the stubs, clump across the cut at the top of the blood, sink into the scab
const WD_PL_LY = [830, 880, 800, 860, 815, 885, 840, 805];
function WD_platelets(t, S) {
  const w = WD_W(), N = 8, bt = WD_top(S.blood);
  for (let i = 0; i < N; i++) {
    const ts = w.tieu + i * 0.11;
    const r = 24 * EZ.o2(seg(t, ts, ts + 0.25)) * (1 - EZ.io(seg(t, w.kho + 0.1, w.kho + 1.1)));
    if (r < 2) continue;
    const sx = i % 2 ? 592 : 488, sy = 1005;
    const lx = lerp(445, 635, i / (N - 1)), ly = WD_PL_LY[i];
    const u = EZ.o3(seg(t, ts, ts + 1.0));
    const cu = EZ.io(seg(t, w.dinh + i * 0.03, w.nhau + 0.45));
    const cy = Math.max(bt + (i % 2 ? 44 : 16), 610 + (i % 2 ? 28 : 0)), [a, b] = skCutX(cy);
    const sqz = 0.06 * WD_bump(t, w.bit, w.bit + 0.6);
    let cx = lerp(a + 32, b - 32, i / (N - 1)); cx = lerp(cx, 540, sqz);
    const wob = 1 - cu;
    const x = lerp(lerp(sx, lx, u), cx, cu) + 12 * Math.sin(t * 3 + i * 1.9) * wob + 2.5 * Math.sin(t * 1.6 + i) * cu;
    const y = lerp(lerp(sy, ly, u), cy, cu) + 6 * Math.cos(t * 2.4 + i) * wob + 3 * Math.sin(t * 2.1 + i * 0.7) * cu;
    platelet(x, y, r, { stick: EZ.o2(seg(t, w.dinh + i * 0.03, w.dinh + 0.5)), rot: i * 0.6, face: i === 2 || i === 5, key: 'wdpl' + i });
  }
}

// ---- red cells: drift out of the stubs, get caught in the net, melt into the drying clot
const WD_RC = [[452, 748], [592, 752], [530, 818], [478, 915], [592, 902]];
function WD_redCells(t) {
  const w = WD_W();
  const m = EZ.io(seg(t, w.kho + 0.3, w.vay + 0.8));
  for (let i = 0; i < WD_RC.length; i++) {
    const ts = w.huyet + i * 0.2;
    const g = EZ.o2(seg(t, ts, ts + 0.25)); if (g <= 0.01 || m >= 0.999) continue;
    const sx = i % 2 ? 594 : 486, sy = 1010, [tx, ty] = WD_RC[i];
    const u = EZ.io(seg(t, ts, w.giu + 0.25));
    const caught = EZ.o2(seg(t, w.giu - 0.1, w.giu + 0.4));
    const jig = t > w.giu ? Math.sin((t - w.giu) * 16 + i) * 5 * Math.exp(-(t - w.giu) * 3) : 0;
    const x = lerp(sx, tx, u) + 20 * Math.sin(t * 2.1 + i * 1.7) * (1 - caught) + jig;
    const y = lerp(sy, ty, u) + 10 * Math.cos(t * 1.7 + i) * (1 - caught);
    const a = i * 0.9 + 1.2 * Math.min(t, w.giu + 0.2);
    WD_redCell(x, y, 22 * g, a, m, 'wdrc' + i);
  }
}

// ---- germs + white cells
const WD_GERMS = [   // s: start in the sky, e: rest spot in the clot under the scab edge
  { s: [372, 470], e: [432, 706], a: 0.4 },
  { s: [726, 455], e: [654, 716], a: -0.5 },
  { s: [800, 515], e: [550, 834], a: 0.2 },
];
function WD_wbcPos(i, t) {   // [x, y, r] of white cell i at t (null = not out). They squeeze out of a stub and slip
  const w = WD_W();           // back into it at the end (drawn clipped to the cut, so the vessel wall hides them)
  const R0 = i === 0 ? 58 : 56, sx = i === 0 ? 400 : 680, ox = i === 0 ? 505 : 578;
  const e0 = w.c0 + (i === 0 ? 0.2 : 0.45), k = EZ.o2(seg(t, e0, e0 + 0.6));
  const gT0 = w.cEnd - (i === 0 ? 1.05 : 1.15), gT1 = gT0 + 0.5;
  if (k <= 0.01 || t > gT1) return null;
  let p = [lerp(sx, ox, k), lerp(1020, 985, k)];
  const mv = (q, u) => { p = [lerp(p[0], q[0], u), lerp(p[1], q[1], u)]; };
  if (i === 0) {
    mv([474, 712], EZ.io(seg(t, e0 + 0.45, w.an - 0.02)));
    mv([516, 820], EZ.io(seg(t, w.khuan + 0.3, w.the - 0.05)));
    mv([ox, 985], EZ.io(seg(t, w.the + 1.0, gT0)));
  } else {
    mv([620, 712], EZ.io(seg(t, e0 + 0.45, w.khuan - 0.02)));
    mv([ox, 985], EZ.io(seg(t, w.khuan + 1.2, gT0)));
  }
  const gone = EZ.i2(seg(t, gT0, gT1)); mv([sx, 1020], gone);
  return [p[0], p[1], R0 * lerp(0.8, 1, k) * lerp(1, 0.85, gone)];
}
const WD_EATS = () => { const w = WD_W(); return [{ by: 0, te: w.an + 0.05 }, { by: 1, te: w.khuan + 0.02 }, { by: 0, te: w.the + 0.02 }]; };
function WD_germPos(i, t) {
  const w = WD_W(), G = WD_GERMS[i], t0 = w.c0 + 0.05 + i * 0.3, u = seg(t, t0, t0 + 1.1), eu = EZ.io(u);
  const dx = G.e[0] - G.s[0], dy = G.e[1] - G.s[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, wig = 16 * Math.sin(u * Math.PI * 3) * (1 - u);
  const x = lerp(G.s[0], G.e[0], eu) + nx * wig + 5 * Math.sin(t * 4 + i * 2) * u;
  const y = lerp(G.s[1], G.e[1], eu) + ny * wig + 3 * Math.cos(t * 3.3 + i) * u;
  return { x, y, s: EZ.o2(seg(t, t0, t0 + 0.2)), a: G.a + 0.3 * Math.sin(t * 5 + i * 1.3) };
}
function WD_cleaners(t, S) {
  const w = WD_W(), E = WD_EATS();
  if (t < w.c0 - 0.6) return;
  const P = [WD_wbcPos(0, t), WD_wbcPos(1, t)];
  const eatOf = (b) => { let e = 0, g = 0; for (const x of E) if (x.by === b) { e = Math.max(e, EZ.o2(seg(t, x.te - 0.15, x.te + 0.1)) * (1 - EZ.io(seg(t, x.te + 0.4, x.te + 0.62)))); g = Math.max(g, WD_bump(t, x.te + 0.4, x.te + 0.9)); } return [e, g]; };
  // germs not yet being eaten (under the white cells)
  const pending = [];
  for (let i = 0; i < 3; i++) {
    const { te, by } = E[i]; if (t >= te + 0.35) continue;
    const g = WD_germPos(i, t); if (g.s <= 0.01) continue;
    if (t >= te - 0.05 && P[by]) pending.push([i, g, by, te]); else germ(g.x, g.y, 26 * g.s, { a: g.a, key: 'wdg' + i });
  }
  ctx.save(); trace(skCutPts(S.redness), true); ctx.clip();
  for (let b = 0; b < 2; b++) {
    const p = P[b]; if (!p) continue;
    const [e, gl] = eatOf(b);
    // the target germ (closest uneaten) for the look direction
    let look = 0; for (let i = 0; i < 3; i++) if (E[i].by === b && t < E[i].te + 0.35) { look = clamp((WD_germPos(i, t).x - p[0]) / 60, -1, 1); break; }
    const r = p[2] * (1 + 0.08 * gl);
    wbc(p[0], p[1], r, { eat: e, look, key: 'wdwb' + b });
    // a swallowed germ shows faintly inside, then is digested
    for (let i = 0; i < 3; i++) if (E[i].by === b) {
      const d = seg(t, E[i].te + 0.35, E[i].te + 1.4); if (d <= 0 || d >= 1) continue;
      ctx.fillStyle = `rgba(127,176,74,${0.55 * (1 - d)})`; ctx.beginPath(); ctx.ellipse(p[0] + 6, p[1] + r * 0.32, 22 * (1 - 0.6 * d), 12 * (1 - 0.6 * d), 0.3, 0, TAU); ctx.fill();
    }
  }
  // germs being pulled into a mouth (drawn over the cell, shrinking into it)
  for (const [i, g, by, te] of pending) {
    const p = P[by], r = p[2], mouth = [p[0], p[1] - r * 0.15 + 26 * r / 64];
    const u = EZ.io(seg(t, te - 0.05, te + 0.35));
    germ(lerp(g.x, mouth[0], u), lerp(g.y, mouth[1], u), 26 * g.s * lerp(1, 0.35, u), { a: g.a, key: 'wdg' + i });
  }
  ctx.restore();
  // "bạch cầu" pointer onto the right-hand white cell
  const ba = seg(t, w.an + 0.2, w.an + 0.5) * (1 - seg(t, w.do - 0.8, w.do - 0.5)), q = P[1];
  if (ba > 0.01 && q) { const ax = 730, ay = 500, L = Math.hypot(q[0] - ax, q[1] - ay); WD_arrow(ax, ay, q[0] + (ax - q[0]) / L * q[2] * 1.05, q[1] + (ay - q[1]) / L * q[2] * 1.05, ba, { w: 6, head: 18, key: 'wdba' }); }
}

// ---- the stage (everything that lives in the slice), drawn identically in all three eras
function WD_stage() {
  const t = TT, w = WD_W(), S = WD_state(t);
  skinSlice({ squash: S.squash, bleed: S.bleed, blood: S.blood, scab: S.scab, scabDry: S.scabDry, redness: S.redness,
    partnerO: { mood: WD_mood(t)[0], look: -WD_mood(t)[1] } });
  // fibrin threads across the cut (they settle into the clot colour as the wound matures)
  const fk = EZ.io(seg(t, w.soi + 0.4, w.luoi + 0.4));
  if (fk > 0.01) fibrinNet(345, 660, 735, 1062, fk, { inCut: true, puff: S.redness, n: 7, w: 6, key: 'wdfn', c: mixHex(COL.fib, COL.blood, 0.85 * EZ.io(seg(t, w.do, w.cEnd - 0.6))) });
  WD_redCells(t);
  WD_platelets(t, S);
  // the cut ends of the vessel stay visible (dark caps) until new vessels grow in (fill)
  const hw = SK.vw / 2 * (1 - 0.6 * S.squash);
  for (const x of [SK.botL + 5, SK.botR - 5]) { ctx.fillStyle = COL.bloodD; ctx.beginPath(); ctx.ellipse(x, SK.vy, 7, hw, 0, 0, TAU); ctx.fill(); }
  WD_cleaners(t, S);
  // "sưng": orange swelling contours bulge out on both sides of the cut, with small outward arrows
  const sw = EZ.o2(seg(t, w.sung - 0.05, w.sung + 0.5));
  if (sw > 0.01) for (const d of [-1, 1]) {
    const P = []; for (let k = 0; k <= 16; k++) { const u = k / 16, y = lerp(640, 1010, u), cx = skCutX(y, S.redness)[d < 0 ? 0 : 1]; P.push([cx + d * (34 + 62 * Math.sin(Math.PI * u) * (1 + 0.06 * Math.sin(t * 5))), y]); }
    ink(subPath(P, sw), { w: 7, color: COL.heat, amt: 0.3, key: 'wdsw' + d });
    const ex = skCutX(825, S.redness)[d < 0 ? 0 : 1] + d * 112;
    simpleArrow(ex, 825, ex + d * 50, 825, { part: sw, w: 6, head: 16, col: COL.heat, key: 'wdswa' + d });
  }
  const [mood, look] = WD_mood(t);
  heroCell(WD_HERO[0], WD_HERO[1], WD_HERO[2], { mood, look, key: 'hero' });

  // "co lại": the stubs squeeze (ink arrows pressing in on both stubs)
  const ca = seg(t, w.co, w.co + 0.3) * (1 - seg(t, w.co + 2.0, w.co + 2.4));
  if (ca > 0.01) for (const x of [436, 644]) {
    WD_arrow(x, 948, x, 992, ca, { w: 6, head: 16, key: 'wdsq1' + x });
    WD_arrow(x, 1092, x, 1048, ca, { w: 6, head: 16, key: 'wdsq2' + x });
  }
  WD_label('co lại', 250, 950, w.co + 0.05, w.co + 2.4, COL.bloodL);
  // "tiểu cầu"
  WD_label('tiểu cầu', 735, 480, w.tieu + 0.1, ET('clot') - 0.55, COL.plt);
  const pa = seg(t, w.nhau, w.nhau + 0.4) * (1 - seg(t, ET('clot') - 0.85, ET('clot') - 0.55));
  if (pa > 0.01) WD_arrow(705, 510, 618, 716, pa, { w: 6, head: 18, key: 'wdpa' });
  // "sợi huyết"
  WD_label('sợi huyết', 735, 480, w.huyet + 0.05, w.kho - 0.25, COL.fibD);
  const fa = seg(t, w.huyet + 0.4, w.huyet + 0.8) * (1 - seg(t, w.kho - 0.55, w.kho - 0.25));
  if (fa > 0.01) WD_arrow(700, 510, 598, 838, fa, { w: 6, head: 18, key: 'wdfa' });
  // "vảy"
  const vs = pop(w.kho - 0.15) * (1 - EZ.i2(seg(t, EE('clot') - 0.75, EE('clot') - 0.5)));
  if (vs > 0.01) {
    tag('vảy', 760, 470, 62, { s: vs, rot: 0.04, color: COL.scabD });
    WD_arrow(722, 512, 652, 566, clamp(vs), { w: 6, head: 18, key: 'wdva' });
  }
  // "bạch cầu"
  WD_label('bạch cầu', 745, 470, w.an - 0.1, w.do - 0.5, COL.wbcD);
  // "đỏ · sưng · ấm" (orange = inflammation) + a thermometer + two heat squiggles
  const words = [['đỏ', 175, w.do], ['·', 245, w.do], ['sưng', 330, w.sung - 0.1], ['·', 418, w.sung - 0.1], ['ấm', 485, w.am - 0.2]];
  for (const [s, x, t0] of words) { const k = pop(t0); if (k <= 0.01) continue; ctx.save(); ctx.translate(x, 470); ctx.scale(k, k); vtext(s, 0, 0, 64, { col: COL.heat }); ctx.restore(); }
  const th = pop(w.sung - 0.1, SPRING.smooth);
  if (th > 0.01) {
    ctx.save(); ctx.translate(870, 560); ctx.scale(th, th); ctx.translate(-870, -560);
    thermo(870, 560, 170, 0.25 + 0.6 * EZ.io(seg(t, w.am - 0.1, w.am + 0.6)) + 0.03 * Math.sin(t * 4), { key: 'wdth' });
    ctx.restore();
  }
  const hs = seg(t, w.am - 0.05, w.am + 0.45);
  if (hs > 0.01) { waveArrow(625, 578, 615, 480, { part: hs, w: 7, amp: 7, head: 16, key: 'wdh1' }); waveArrow(705, 578, 715, 485, { part: hs, w: 7, amp: 7, head: 16, ph: 1.6, key: 'wdh2' }); }
}

SCENES.plug = function () { WD_stage(); viTag('2', TITLES.plug); };
SCENES.clot = function () { WD_stage(); viTag('3', TITLES.clot); };
SCENES.clean = function () { WD_stage(); viTag('4', TITLES.clean); };
