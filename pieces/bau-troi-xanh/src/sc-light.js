// =====================================================================
//  sc-light.js — waves, air, scatter (KHUNG HÌNH GỌN: few big things, bare paper, ≤ 8 molecules, ≤ 8 arrows)
// =====================================================================
// a wave's polyline (same shape as props' waveLine, so the pencil can follow it)
function l_waveP(x0, x1, y, lam, amp, ph = 0) {
  const P = []; for (let x = x0; x <= x1; x += 6) P.push([x, y + Math.sin((x - x0 + ph) / lam * TAU) * amp]); return P;
}
// a graphite wavelength bracket with a lettered label above it, written on over k 0..1
function l_bracket(x0, x1, y, k, str, key, size = 62) {
  if (k <= 0) return;
  gpencil([[x0, y + 22], [x0, y], [x1, y], [x1, y + 22]], { key: key + 'b', w: 3.4, a: 0.95, part: seg(k, 0, 0.6), amp: 1.4 });
  label(str, (x0 + x1) / 2, y - 18, size, { reveal: seg(k, 0.45, 1), key: key + 'l' });
}
// a molecule drawn on: pencil loops, then ink, then paper + shading (k 0..1); full molecule() once settled
function l_mol(x, y, r, rot, key, k) {
  if (k <= 0) return;
  if (k >= 1) return molecule(x, y, r, { rot, key });
  const dx = Math.cos(rot) * r * 0.75, dy = Math.sin(rot) * r * 0.75;
  for (const [s, i] of [[-1, 0], [1, 1]]) {
    const P = loopPts(x + s * dx, y + s * dy, r, r, 0.05);
    if (k > 0.55) gfill(P, SK.sheet, { a: 1, key: key + 'f' + i });
    gpencil(P, { key: key + 'p' + i, w: 2.4, a: 0.7, part: seg(k, 0, 0.5) });
    gline(P, { w: 3.5, key: key + 'o' + i, part: seg(k, 0.45, 1) });
  }
}
const l_walk = (t0, t1) => (TT > t0 && TT < t1 ? Math.sin((TT - t0) * TAU * 2.2) : 0);

// ---------------------------------------------------------------------
//  WAVES — two big waves: red long (λ 300) on "đỏ", blue short (λ 150) on "xanh"; brackets on "dài"/"ngắn";
//  the hero walks under them from BR.whiteWaves.b to BR.wavesAir.a
// ---------------------------------------------------------------------
SCENES.waves = function () {
  sketchPage({ grid: 'plain' });
  const tg = VW('waves', 'làn'), tr = VW('waves', 'đỏ'), td = VW('waves', 'dài'), tb = VW('waves', 'xanh'), tn = VW('waves', 'sóng', 3) - 0.2;
  const X0 = 150, X1 = 930, RY = 590, BY = 850;
  const tw0 = tr + 0.25, tw1 = EE('waves') - 0.6, [hx0, hy0] = BR.whiteWaves.b, [hx1] = BR.wavesAir.a;
  // the ground the hero walks on
  gpencil([[110, 1106], [400, 1100], [700, 1108], [960, 1102]], { key: 'l_wgnd', w: 3, a: 0.7, part: ev(ET('waves') + 0.3, 0.6) });
  // "làn sóng": a graphite construction wave, then the red ink goes over it
  const rDone = tr + 0.9, rph = -55 * Math.max(0, TT - rDone);
  if (TT < rDone + 0.4) gpencil(l_waveP(X0, X1, RY, 300, 75), { key: 'l_wguide', w: 2.6, a: 0.75 * (1 - ev(rDone, 0.4)), part: ev(tg, 0.8) });
  const RP = l_waveP(X0, X1, RY, 300, 75, rph), rk = ev(tr, 0.9);
  if (rk > 0) gline(RP, { w: 8, col: COL.red, key: 'l_wred', part: rk, amp: 1.2 });
  l_bracket(X0, X0 + 300, RY - 125, ev(td, 0.5), 'dài', 'l_bd');
  // the blue wave, short
  const bDone = tb + 0.8, bph = -55 * Math.max(0, TT - bDone);
  const BP = l_waveP(X0, X1, BY, 150, 42, bph), bk = ev(tb, 0.8);
  if (bk > 0) gline(BP, { w: 8, col: COL.blue, key: 'l_wblue', part: bk, amp: 1.2 });
  l_bracket(X0, X0 + 150, BY - 92, ev(tn, 0.5), 'ngắn', 'l_bn');
  // the pencil that writes the waves on
  for (const [P, t, d] of [[l_waveP(X0, X1, RY, 300, 75), tg, 0.8], [RP, tr, 0.9], [BP, tb, 0.8]])
    if (TT >= t && TT < t + d + 0.15) { const e = writeEnd(P, ev(t, d)); pencilTool(e[0], e[1], -0.75, 1); }
  // the hero: watches, then walks along under the waves
  const wk = EZ.io(seg(TT, tw0, tw1)), hx = lerp(hx0, hx1, wk), st = l_walk(tw0, tw1), bob = Math.abs(st) * 8;
  const mood = TT < tr ? 'calm' : TT < tb ? 'wow' : 'happy';
  doodleHero(hx, hy0 - bob, HR, { key: 'hero', legs: true, step: st, mood, look: [TT < tb ? 0.3 : 0.6, -1], sy: 1 + 0.03 * Math.abs(st) });
  viTag('sóng ánh sáng');
  pageCaption(['đỏ: sóng dài', 'xanh: sóng ngắn'], [[1, 'ngắn']], { at: td - ET('waves') });
};

// ---------------------------------------------------------------------
//  AIR — 8 big molecules spaced over the page (ni-tơ, ô-xi); the hero walks to one and stands on it;
//  on "nhỏ": an inset — one blue wavelength vs a tiny molecule, "nhỏ hơn ~1000 lần" on "nghìn"
// ---------------------------------------------------------------------
const L_MOLS = [   // x, y, r, rot — the last is the one the hero stands on
  [170, 590, 34, -0.4], [450, 510, 34, 0.5], [750, 450, 36, -0.2], [870, 650, 34, 0.9],
  [700, 790, 34, 0.3], [880, 930, 32, -0.6], [300, 975, 32, 0.2], [540, 958, 38, 0],
];
SCENES.air = function () {
  sketchPage({ grid: 'plain' });
  const [hx0, hy0] = BR.wavesAir.b, [hx1] = BR.airScatter.a;
  const tm = VW('air', 'đầy') - 0.3, tn = VW('air', 'nhỏ'), tw = VW('air', 'bước'), tt = VW('air', 'ánh'), tk = VW('air', 'nghìn');
  const tw0 = VW('air', 'phân') + 0.3, tw1 = tw0 + 1.5;
  // the molecules, drawn on one after another, jiggling a little (thermal motion, on 2s)
  L_MOLS.forEach(([x, y, r, rot], i) => {
    const last = i === L_MOLS.length - 1, j = last ? 0 : 4;
    l_mol(x + j * Math.sin(TT * 2.4 + i * 1.7), y + j * Math.cos(TT * 2.1 + i * 2.3), r, rot + (last ? 0 : 0.06 * Math.sin(TT * 1.5 + i)), 'l_am' + i, ev(tm + i * 0.17, 0.4));
  });
  label('ni-tơ', 170, 690, 44, { reveal: ev(VW('air', 'phân'), 0.35), key: 'l_an', col: SK.graph });
  label('ô-xi', 750, 552, 44, { reveal: ev(VW('air', 'phân') + 0.25, 0.35), key: 'l_ao', col: SK.graph });
  // the inset: a sketched box, one blue wavelength, a tiny molecule
  const bx = 110, by = 1035, bw = 830, bh = 235, box = sketchBox(bx, by, bw, bh, 18);
  const kb = ev(tn - 0.2, 0.5);
  if (kb > 0) {
    gfill(box, SK.sheet, { a: clamp(kb * 2), key: 'l_aboxf', off: [6, 6] });
    gpencil(box, { key: 'l_aboxp', w: 2.4, a: 0.6, part: kb });
    gline(box, { key: 'l_abox', w: 4, part: ev(tn + 0.1, 0.4) });
  }
  const WP = l_waveP(170, 710, by + 150, 540, 50), kw = ev(tn + 0.3, 0.7);
  if (kw > 0) gline(WP, { w: 7, col: COL.blue, key: 'l_awave', part: kw, amp: 1.2 });
  l_bracket(170, 710, by + 62, ev(tw, 0.5), '1 bước sóng', 'l_abw', 42);
  const mx = 840, my = by + 150, km = ev(tt, 0.4);
  if (km > 0) {
    for (const s of [-1, 1]) { ctx.save(); ctx.globalAlpha = clamp(km * 2); ctx.fillStyle = SK.ink; ctx.beginPath(); ctx.arc(mx + s * 4, my, 4.5, 0, TAU); ctx.fill(); ctx.restore(); }
    gpencil(loopPts(mx, my, 30, 30, 0.12), { key: 'l_aring', w: 2.6, a: 0.85, part: km });
    label('phân tử', mx, my + 72, 36, { reveal: ev(tt + 0.2, 0.3), key: 'l_apt' });
  }
  label('nhỏ hơn ~1000 lần', 440, by + bh - 14, 44, { reveal: ev(tk, 0.45), key: 'l_a1000' });
  sparkle(mx, my, 46, seg(TT, tk + 0.1, tk + 0.6), 'l_aspk');            // the scene's one small particle effect
  // the hero: looks around, walks to the big molecule and stands on it
  const wk = EZ.io(seg(TT, tw0, tw1)), st = l_walk(tw0, tw1), hop = Math.sin(Math.PI * seg(TT, tw1 - 0.35, tw1));
  const hx = lerp(hx0, hx1, wk), hy = hy0 - Math.abs(st) * 8 - 40 * hop;
  const mood = TT >= tk ? 'wow' : TT < tw0 ? 'wow' : 'calm';
  const look = TT < tw0 ? [Math.sin(TT * 2.5), -0.6] : TT < tn ? [1, 0] : [0.2, 1];
  doodleHero(hx, hy, HR, { key: 'hero', legs: true, step: st, mood, look });
  viTag('không khí');
  pageCaption(['phân tử khí', 'nhỏ xíu'], [[1, 'nhỏ xíu']], { at: 1.5 });
};

// ---------------------------------------------------------------------
//  SCATTER — one big molecule; the blue wave arrives and on "hất" 8 blue arrows fly out; the hero is flung and lands;
//  the red wave passes straight through (1 faint arrow); card "xanh ≈ 6 × đỏ" on "sáu"; silence = everything holds
// ---------------------------------------------------------------------
SCENES.scatter = function () {
  sketchPage({ grid: 'plain' });
  const TS = TT, TF = Math.min(TT, VL('scatter').t1);   // after the line ends everything holds; only the boil goes on
  TT = TF;
  const MX = 540, MY = 1000, MR = 70;
  const tb = VW('scatter', 'sóng') - 0.35, th = VW('scatter', 'hất'), tr = VW('scatter', 'mạnh') - 0.1, td = VW('scatter', 'đỏ'), t6 = VW('scatter', 'sáu');
  // the red wave: straight through, behind the molecule
  const rk = ev(tr, 0.8), rph = -60 * Math.max(0, TT - tr - 0.8);
  if (rk > 0) gline(l_waveP(60, 940, MY, 300, 45, rph), { w: 7, col: COL.red, key: 'l_sred', part: rk, amp: 1.2 });
  // the blue wave arriving from the left; it is used up when it is knocked away
  const bk = ev(tb, th - tb), bph = -70 * (TT - tb);
  if (bk > 0 && TT < th + 0.4) {
    ctx.save(); ctx.globalAlpha = 1 - ev(th, 0.4);
    gline(l_waveP(60, 410, MY, 150, 42, bph), { w: 8, col: COL.blue, key: 'l_sblue', part: bk, amp: 1.2 });
    ctx.restore();
  }
  // the molecule, shaken by the hit
  const shk = Math.exp(-6 * Math.max(0, TT - th)) * (TT >= th ? 1 : 0);
  molecule(MX + 10 * shk * Math.sin(TT * 60), MY, MR, { rot: 0.04 * shk * Math.sin(TT * 45), key: 'l_smol' });
  sparkle(MX - 120, MY - 10, 60, seg(TT, th - 0.05, th + 0.4), 'l_sspk');   // the impact: the scene's one particle effect
  // 8 blue arrows, every direction
  for (let i = 0; i < 8; i++) {
    const a = (i * 45 + 22.5) * DEG, ca = Math.cos(a), sa = Math.sin(a);
    const P = [[MX + ca * 165, MY + sa * 150], [MX + ca * 335, MY + sa * 320]];
    const k = ev(th + 0.03 + i * 0.045, 0.32);
    if (k > 0) arrowPencil(P, k, { col: COL.blue, w: 6, key: 'l_sar' + i });
  }
  // the one faint red arrow
  const kr = ev(td + 0.05, 0.4);
  if (kr > 0) { ctx.save(); ctx.globalAlpha = 0.55; arrowPencil([[MX + 125, MY + 125], [MX + 205, MY + 205]], kr, { col: COL.redL, w: 4, key: 'l_sarr' }); ctx.restore(); }
  // the card: xanh ≈ 6 × đỏ
  const kc = ev(t6, 0.35), cx = 420, cy = 500;
  if (kc > 0) {
    const C = sketchBox(cx - 230, cy - 75, 460, 140, 16);
    gfill(C, SK.sheet, { a: clamp(kc * 2), key: 'l_scf', off: [6, 6] });
    gline(C, { w: 4, key: 'l_sc', part: kc });
    const s = 66, parts = [['xanh', COL.blue], [' ≈ 6 × ', SK.ink], ['đỏ', COL.red]];
    const ws = parts.map(([p]) => letterW(p, s, 'hand')), tot = ws.reduce((a, b) => a + b, 0);
    let x = cx - tot / 2;
    parts.forEach(([p, c], i) => { label(p, x, cy + 22, s, { align: 'left', col: c, reveal: ev(t6 + 0.2 + i * 0.15, 0.25), key: 'l_sct' + i }); x += ws[i]; });
    const x6 = cx - tot / 2 + ws[0] + letterW(' ≈ ', s, 'hand') + letterW('6', s, 'hand') / 2;
    gpencil(loopPts(x6, cy + 2, 38, 44, 0.15), { key: 'l_s6', w: 3, a: 0.9, part: ev(t6 + 1.1, 0.45) });
  }
  // the hero: on the molecule, watching the wave; flung on "hất", lands top right
  const [hx0, hy0] = BR.airScatter.b, LX = 835, LY = 600, fk = seg(TT, th, th + 0.6), land = Math.sin(Math.PI * seg(TT, th + 0.6, th + 0.85));
  const hx = lerp(hx0, LX, EZ.o2(fk)), hy = lerp(hy0, LY, fk) - 260 * Math.sin(Math.PI * fk);
  const flying = fk > 0 && fk < 1, mood = TT < th ? 'calm' : TT < t6 ? 'wow' : 'happy';
  const look = TT < th ? [-1, 0.5] : TT < t6 ? [-0.8, 0.8] : [-1, -0.2];
  doodleHero(hx, hy, HR, { key: 'hero', legs: true, mood, look, rot: flying ? TAU * EZ.o2(fk) : 0, sx: 1 + 0.12 * land, sy: 1 - 0.12 * land, arms: flying ? [1.3, 1.3] : null });
  if (TT >= th + 0.6) label('!', LX + 95, LY - 70 - 10 * popS(th + 0.6), 90, { key: 'l_sbang', reveal: ev(th + 0.6, 0.1) });
  TT = TS;
  viTag('tán xạ');
  pageCaption(['sóng xanh', 'bị hất văng'], [[1, 'hất văng']], { at: th + 0.2 - ET('scatter') });
};
