// =====================================================================
//  SC-PLANE — hook, engine, takeoff, end. The same airliner drawing (planeSide, nose LEFT) in all four.
//  Clean frames: one plane, one runway (or a far ground line), bare paper; motion is always tied to the words.
// =====================================================================
const p_PL = () => [PLANE.x, PLANE.y, PLANE.s];
// a rough pencil silhouette of the plane (construction lines drawn before the ink)
const p_SIL = [[-400, 10], [-380, -40], [-320, -60], [300, -60], [330, -225], [398, -225], [412, -54], [416, -36], [230, 60], [-330, 60], [-395, 30]];
const p_silW = (x, y) => p_SIL.map(([a, b]) => [x + a, y + b]);
// a small hand-drawn arrow in graphite pencil (construction / "question" arrows), with a head
function p_pencilArrow(a, b, part, key, o = {}) {
  gpencil([a, b], { key, w: o.w ?? 4, a: o.a ?? 0.8, part });
  if (part > 0.8) {
    const an = Math.atan2(b[1] - a[1], b[0] - a[0]), k = seg(part, 0.8, 1), hl = (o.head ?? 34) * k;
    for (const s of [-1, 1]) gpencil([b, [b[0] - Math.cos(an + s * 0.5) * hl, b[1] - Math.sin(an + s * 0.5) * hl]], { key: key + 'h' + s, w: o.w ?? 4, a: o.a ?? 0.8 });
  }
}
// thrust gets its own ink (teal): grey = weight, yellow = lift, blue = air
const p_THR = '#2f8f86';
// the centre of gravity / the shared vertical line of lift & weight: local (80, 4) inside the fuselage over the wing root
const p_CG = [80, 4];
function p_cgDot(x, y, k, key) {
  if (k <= 0) return;
  gfill(loopPts(x, y, 9 * k, 9 * k, 0.05), SK.ink, { key: key + 'f', a: 0.9 });
  gline(loopPts(x, y, 15 * k, 15 * k, 0.05), { key: key + 'o', w: 3.5, second: false });
}
// a cubic Bezier point / tangent (for the hero's sweeps)
const p_bz = (t, A, B, C, D) => [0, 1].map((j) => (1 - t) ** 3 * A[j] + 3 * (1 - t) ** 2 * t * B[j] + 3 * (1 - t) * t * t * C[j] + t ** 3 * D[j]);
const p_bzd = (t, A, B, C, D) => [0, 1].map((j) => 3 * (1 - t) ** 2 * (B[j] - A[j]) + 6 * (1 - t) * t * (C[j] - B[j]) + 3 * t * t * (D[j] - C[j]));
// hook: a faint airflow line over the plane (air streams nose -> tail, humps over the wing, bends down behind it)
const p_hookFlow = (i) => { const y0 = 885 - i * 50, d = 1 - i * 0.3, P = [];
  for (let x = 60; x <= 770; x += 20) { const hb = Math.exp(-(((x - 470) / 170) ** 2)), dn = clamp((x - 600) / 170); P.push([x, y0 - 22 * d * hb + 28 * d * dn * dn]); }
  return P; };
// the hero's gentle breath (shape only, never position)
const p_breath = () => ({ sx: 1 - 0.012 * Math.sin(TT * 3), sy: 1 + 0.018 * Math.sin(TT * 3) });

// ---- HOOK: "Một chiếc máy bay nặng hàng trăm tấn, vậy mà thứ nâng nó lên lại là không khí."
SCENES.hook = function () {
  sketchPage({ grid: 'plain' });
  const [px, py, ps] = p_PL(), [hx, hy] = BR.hookEngine.a;
  const tHeavy = VW('hook', 'nặng'), tLift = VW('hook', 'nâng'), tAir = VW('hook', 'không');
  // the runway: pencil, then ink
  const rp = ev(0, 0.5);
  gpencil([[40, RUNWAY_Y], [1040, RUNWAY_Y]], { key: 'p_hrwc', w: 2.6, a: 0.5, part: clamp(rp * 1.5) });
  runway({ part: seg(rp, 0.3, 1), slide: 6 * TT });
  // the plane: graphite silhouette first, then the ink wipes on left -> right with its outline writing on
  const sc = ev(0.05, 0.55), ik = ev(0.3, 0.9);
  if (ik < 1) gpencil(p_silW(px, py), { key: 'p_hsil', w: 2.6, a: 0.55 * (1 - ik * 0.7), part: sc, closed: true });
  if (ik > 0) {
    const wx = lerp(60, 1000, EZ.io(ik));
    ctx.save(); ctx.beginPath(); ctx.rect(-200, 0, wx + 200, H); ctx.clip();
    planeSide(px, py, ps, { part: ik, exhaust: 0.25 * ev(1.3, 0.5) });
    ctx.restore();
  }
  // the air around the wing: 3 faint thin blue lines write on, a small chevron rides each (air is in the picture)
  for (let i = 0; i < 3; i++) {
    const k = ev(1.15 + i * 0.2, 0.8); if (k <= 0) continue;
    const P = p_hookFlow(i);
    gline(P, { key: 'p_hfl' + i, w: 3, col: COL.air, a: 0.4, part: k, second: false });
    if (k >= 1) flowChevron(P, ((TT - 1.15) * 0.32 + i * 0.37) % 1, { key: 'p_hfc' + i, s: 12, w: 3, col: COL.air });
  }
  if (TT < 0.6) { const tip = writeEnd(p_silW(px, py), sc); pencilTool(tip[0], tip[1], -0.75, 1); }
  else if (ik < 1) pencilTool(lerp(60, 1000, EZ.io(ik)), py - 60 + 90 * Math.sin(ik * 9), -0.75, 1);
  // "nặng": a luggage tag tied to the roof — "hàng trăm tấn" with a graphite down arrow; it sways gently
  const tg = ev(tHeavy, 0.4);
  if (tg > 0) {
    const ax = planePt(120, -60)[0], ay = planePt(120, -60)[1], sw = 0.035 * Math.sin(TT * 1.9) * tg, tx = 220, ty = 470;
    gpencil([[ax, ay], [tx + 300, ty + 120]], { key: 'p_hstr', w: 3, a: 0.75, part: tg });
    ctx.save(); ctx.translate(tx + 300, ty + 120); ctx.rotate(sw); ctx.translate(-(tx + 300), -(ty + 120));
    const TAG = [[tx, ty], [tx + 560, ty], [tx + 620, ty + 60], [tx + 560, ty + 120], [tx, ty + 120]];
    const k2 = popS(tHeavy + 0.05);
    ctx.translate(tx + 300, ty + 60); ctx.scale(k2, k2); ctx.translate(-(tx + 300), -(ty + 60));
    gfill(TAG, SK.sheet, { key: 'p_htagf' });
    gline(TAG, { key: 'p_htag', w: 4.5, closed: true });
    gline(loopPts(tx + 580, ty + 60, 11, 11, 0.1), { key: 'p_hhole', w: 3.5, second: false });
    forceArrow(tx + 50, ty + 22, tx + 50, ty + 104, { w: 26, head: 34, key: 'p_hwa', part: ev(tHeavy + 0.2, 0.3) });
    label('hàng trăm tấn', tx + 96, ty + 82, 60, { align: 'left', reveal: ev(VW('hook', 'hàng'), 0.6), key: 'p_htagl' });
    ctx.restore();
  }
  // "nâng": a dashed graphite question — what lifts it? (pencil up arrow from the wing + "?")
  const qa = ev(tLift, 0.45), wingTop = planePt(-90, -64);
  if (qa > 0) {
    ctx.save(); ctx.setLineDash([18, 14]);
    p_pencilArrow([wingTop[0] - 40, wingTop[1] - 10], [wingTop[0] - 40, wingTop[1] - 190], qa, 'p_hqa', { a: 0.75 });
    ctx.restore();
    const qk = popS(tLift + 0.35);
    if (qk > 0) { ctx.save(); ctx.translate(wingTop[0] + 30, wingTop[1] - 160); ctx.scale(qk, qk); ctx.rotate(0.1 + 0.05 * Math.sin(TT * 2.5)); handLetter('?', 0, 30, 96, { face: 'hand', col: SK.graph, key: 'p_hq', jit: 1 }); ctx.restore(); }
  }
  // "không khí": the hero pops up beside the engine, looks up at the plane, puzzled -> "!"
  const hp = popS(tAir);
  if (hp > 0) {
    const bang = TT >= tAir + 0.5, br = p_breath();
    doodleHero(hx, hy, HR * hp, { key: 'hero', mood: bang ? 'wow' : 'puzzled', look: bang ? [-0.4, -1] : [-0.8, -0.7], sx: br.sx, sy: br.sy });
    const bk = popS(tAir + 0.5);
    if (bk > 0) { ctx.save(); ctx.translate(hx + 92, hy - 92); ctx.scale(bk, bk); ctx.rotate(0.15); handLetter('!', 0, 30, 92, { face: 'hand', col: SK.ink, key: 'p_hbang', jit: 1 }); ctx.restore(); }
  }
  viTag('máy bay');
  pageCaption(['hàng trăm tấn', 'mà bay được?'], [[1, 'bay']], { at: 2.0 });
};

// ---- ENGINE: "Động cơ chỉ đẩy máy bay lao về phía trước, chứ không hề nhấc nó lên."
SCENES.engine = function () {
  sketchPage({ grid: 'plain' });
  const [px, py, ps] = p_PL(), E = ET('engine'), [h0x, h0y] = BR.hookEngine.a, [h1x, h1y] = BR.engineWing.a;
  const tPush = VW('engine', 'đẩy'), tGo = VW('engine', 'lao'), tNot = VW('engine', 'không'), tLiftW = VW('engine', 'nhấc');
  // runway dashes slide (the plane rolls forward a little after "đẩy")
  const sl = 6 * TT + 260 * EZ.i2(seg(TT, tPush, EE('engine'))) * (TT - tPush > 0 ? 1 : 0);
  runway({ slide: sl });
  // exhaust: idle shimmer, swelling on "đẩy"
  planeSide(px, py, ps, { exhaust: 0.25 + 0.75 * ev(tPush, 0.4) });
  // a short graphite whoosh behind the engine on "đẩy"
  const eng = planePt(40, 97), wk = ev(tPush, 0.35);
  if (wk > 0 && TT < tPush + 1.6) for (let i = 0; i < 2; i++) gpencil([[eng[0] + 120, eng[1] - 24 + i * 46], [eng[0] + 230 + i * 30, eng[1] - 24 + i * 46]], { key: 'p_ewh' + i, w: 3.5, a: 0.7 * (1 - seg(TT, tPush + 1.0, tPush + 1.6)), part: wk });
  // thrust: a teal arrow out of the engine's intake, pointing LEFT (forward), labelled "lực đẩy" under the runway
  const ta = ev(tPush + 0.1, 0.45), tb = Math.sin(TT * 5) * ta, ei = planePt(-112, 97);
  forceArrow(ei[0], ei[1], ei[0] - 140 - 6 * tb, ei[1], { key: 'p_eth', col: p_THR, part: ta, w: 38, head: 52 });
  label('lực đẩy', ei[0] - 90, 1205, 60, { reveal: ev(tPush + 0.4, 0.5), key: 'p_ethl' });
  // "không hề nhấc": a pencilled UP arrow from the engine ... crossed out once with a red X
  const ua = ev(tNot - 0.15, 0.4), top = planePt(-40, -62), ux = top[0];
  if (ua > 0) p_pencilArrow([ux, top[1] - 8], [ux, top[1] - 200], ua, 'p_eup', { w: 7, a: 0.9, head: 46 });
  const xa = ev(tLiftW, 0.18), xb = ev(tLiftW + 0.18, 0.18), cy = top[1] - 104;
  if (xa > 0) gline([[ux - 52, cy - 52], [ux + 52, cy + 52]], { key: 'p_ex1', w: 9, col: SK.red, part: xa, second: false });
  if (xb > 0) gline([[ux + 52, cy - 52], [ux - 52, cy + 52]], { key: 'p_ex2', w: 9, col: SK.red, part: xb, second: false });
  // the hero: on the bridge spot, watching the exhaust; on "lao" the jet blows it back past the tail, it loops up over
  // the top and lands ahead of the nose (never across the gear or the tail)
  const mv = EZ.io(seg(TT, tGo, tNot + 0.4)), BZ = [[h0x, h0y], [1200, 1080], [1010, 160], [h1x, h1y]];
  const [bx, by] = p_bz(mv, ...BZ), bd = p_bzd(Math.min(0.999, Math.max(0.001, mv)), ...BZ);
  const moving = mv > 0 && mv < 1, br = p_breath(), hop = Math.sin(Math.PI * ev(tPush, 0.3));
  const look = TT < tGo ? [0.9, 0.1] : moving ? [-1, -0.3] : TT < tNot ? [0.8, 0] : [1, -0.6];
  heroAir(bx, by, HR, { key: 'hero', wind: moving ? 1 : 0, dir: Math.atan2(bd[1], bd[0]), mood: TT >= tLiftW ? 'puzzled' : moving ? 'wow' : 'calm', look, sx: br.sx * (1 - 0.05 * hop), sy: br.sy * (1 + 0.07 * hop) });
  viTag('động cơ');
  pageCaption(['động cơ chỉ đẩy', 'không nhấc lên'], [[0, 'đẩy']], { at: 1.2 });
};

// ---- TAKEOFF: "Đủ nhanh, phi công nâng mũi lên, lực nâng vượt trọng lượng, và bánh xe rời đường băng."
SCENES.takeoff = function () {
  sketchPage({ grid: 'plain' });
  const [px0, py0, ps] = p_PL(), E = ET('takeoff'), END = EE('takeoff'), [h0x, h0y] = BR.speedTakeoff.b, [h1x, h1y] = BR.takeoffEnd.a;
  const tNose = VW('takeoff', 'nâng'), tLift = VW('takeoff', 'lực'), tOver = VW('takeoff', 'vượt'), tWt = VW('takeoff', 'trọng'), tOff = VW('takeoff', 'rời');
  // rolling fast: the runway dashes race to the right (plane moves left)
  // accelerating: ~450 px/s at the start -> ~1700 px/s by liftoff (24 fps: < 0.35 dash period per frame), then held
  // (the dashes repeat every 220 px and we draw on 2s = 12 steps/s: above ~1300 px/s a step passes half a dash period and
  //  the eye reads it as slower — the old 450→1700 ramp aliased into "constant". Ramp 150 → 1200 px/s instead.)
  const rt = TT - E, t1 = (1200 - 150) / 210, ra = Math.min(rt, t1);
  runway({ slide: -(150 * ra + 105 * ra * ra + 1200 * Math.max(0, rt - t1)) });
  // nose up on "nâng mũi" (about the main wheels), wheels leave on "rời", climbing ~120 px, gear up
  const climb = 125 * EZ.io(seg(TT, tOff, END - 0.2)) + 4 * Math.sin(TT * 2.2) * seg(TT, tOff + 0.5, tOff + 1.5);
  // planeSide rotates by -rot and the nose points LEFT: a NEGATIVE rot lifts the nose (fixed 18/11 — it used to pitch nose-down)
  const rot = -(0.12 * EZ.io(ev(tNose, 0.8)) - 0.03 * EZ.io(seg(TT, tOff + 1, END))), gear = 1 - EZ.io(seg(TT, tOff + 0.6, tOff + 2.4));
  const px = px0 - 40 * EZ.io(ev(tNose, 1.0)), py = py0 - climb;   // it rolls FORWARD (left), never back
  const vib = TT < tOff ? 1.5 * Math.sin(TT * 40) : 0;
  planeSide(px, py + vib, ps, { rot, gear, exhaust: 1 });
  // 3 graphite speed lines streaming off behind the tail, longer as it speeds up (gone soon after liftoff)
  const spk = ev(E + 0.3, 0.4) * (1 - seg(TT, tOff + 0.6, tOff + 1.4)), spd = clamp(ra / 5);
  if (spk > 0) for (let i = 0; i < 3; i++) {
    const yy = 965 + i * 40 - climb * 0.5, x0 = 930 + 20 * i + ((TT * (90 + 160 * spd) + i * 37) % 50), L = (40 + 80 * spd) * spk;
    gpencil([[x0, yy], [Math.min(1060, x0 + L), yy]], { key: 'p_tsp' + i, w: 3, a: 0.6 * spk });
  }
  // lift & weight on ONE vertical line at the wing root: weight DOWN from the centre-of-gravity dot inside the fuselage,
  // lift UP from the roof over the wing. Lift starts at 0.6 x weight; on "vượt" it grows to ~1.45 x and stays there.
  const cg = planePt(p_CG[0], p_CG[1], px, py, ps, rot), roof = planePt(p_CG[0], -62, px, py, ps, rot), WL = 120;
  const wa = ev(E + 0.6, 0.45), wk = Math.sin(Math.PI * ev(tWt, 0.4)) * 3;   // a little shake on "trọng" (not longer)
  forceArrow(cg[0] + wk, cg[1] + 16, cg[0] + wk, cg[1] + 16 + WL, { key: 'p_tw', part: wa, w: 38, head: 52 });
  p_cgDot(cg[0], cg[1], popS(E + 0.6), 'p_tcg');
  if (ev(E + 0.9, 0.6) > 0) { const lw = letterW('trọng lượng', 52); gfill(sketchBox(cg[0] + 36, cg[1] + 74, lw + 26, 66, 10), SK.sheet, { a: 0.92, off: [0, 0], key: 'p_twlb' }); }
  label('trọng lượng', cg[0] + 48, cg[1] + 118, 52, { align: 'left', reveal: ev(E + 0.9, 0.6), key: 'p_twl' });
  const lg = WL * (0.6 + 0.85 * EZ.back(ev(tOver, 0.4))) + 5 * Math.sin(TT * 3) * ev(tOver + 0.4, 0.3);
  forceArrow(cg[0], roof[1] - 6, cg[0], roof[1] - 6 - lg, { key: 'p_tl', col: COL.lift, part: ev(tLift, 0.4), w: 46 });
  label('lực nâng', cg[0], roof[1] - 6 - lg - 46, 58, { reveal: ev(tLift + 0.25, 0.5), key: 'p_tll' });
  // the hero: from the bridge spot (by the engine) it is blown back and up behind the tail and rides the wake there
  // (gear + wheels stay clear), then swoops down under the rear fuselage to the bridge spot under the wing
  const RIDE = [1000, 780], m1 = EZ.io(seg(TT, E + 0.5, E + 1.6)), m2 = EZ.io(seg(TT, END - 2.1, END - 0.55));
  const bob = Math.sin((TT - E) * 2.4) * seg(TT, E + 1.6, E + 2.2) * (1 - m2);
  const A1 = [lerp(h0x, RIDE[0], m1) + (1 - m1) * m1 * 4 * 90, lerp(h0y, RIDE[1], m1)];
  const hx = m2 > 0 ? (1 - m2) ** 2 * RIDE[0] + 2 * m2 * (1 - m2) * 1000 + m2 * m2 * h1x : A1[0] + 10 * bob;
  const hy = m2 > 0 ? (1 - m2) ** 2 * RIDE[1] + 2 * m2 * (1 - m2) * 1180 + m2 * m2 * h1y : A1[1] - 12 * Math.abs(bob), br = p_breath();
  const hdir = m2 > 0 && m2 < 1 ? Math.atan2(2 * (1 - m2) * (1180 - RIDE[1]) + 2 * m2 * (h1y - 1180), 2 * (1 - m2) * (1000 - RIDE[0]) + 2 * m2 * (h1x - 1000)) : m1 < 1 ? -0.9 : 0;
  heroAir(hx, hy, HR, { key: 'hero', wind: 0.4 + 0.6 * clamp(bob * bob + m1 * (1 - m1) * 4 + m2 * (1 - m2) * 4), dir: hdir, mood: TT >= tOff ? 'happy' : TT >= tOver ? 'wow' : 'calm', look: [-0.6, -1], sx: br.sx, sy: br.sy });
  // "rời": a little graphite gap marker under the main wheels (the wheels are off the ground)
  const gp = ev(tOff + 0.2, 0.3) * (1 - seg(TT, tOff + 1.6, tOff + 2.2));
  if (gp > 0) { const mw = planePt(40, 140, px, py, ps, rot); for (const s of [-1, 1]) gpencil([[mw[0] + s * 26, RUNWAY_Y - 10], [mw[0] + s * 40, RUNWAY_Y - 34]], { key: 'p_tgap' + s, w: 3.5, a: 0.8, part: gp }); }
  viTag('cất cánh');
  pageCaption(['lực nâng', 'vượt trọng lượng'], [[1, 'vượt']], { at: tLift - E + 0.2 });
};

// ---- END: "Lần tới thấy máy bay trên trời, hãy nhớ: nó đang được cả một dòng không khí đỡ lên."
//  The same plane drawing, now up in the sky (gear up), the ground far below; under the wing the stream of air going
//  DOWN (3 blue strokes), a modest yellow lift arrow up from the wing, the hero happy in the stream.
const p_EY = 790;
const p_down = (i, x, y) => {     // one down-flow stroke under/behind the wing, curving down and back (air flows right)
  const x0 = 430 + i * 110, y0 = 950 + i * 18;
  return [[x0, y0], [x0 + 70, y0 + 40], [x0 + 130, y0 + 110], [x0 + 165, y0 + 200]].map(([a, b]) => [a + x, b + y]);
};
SCENES.end = function () {
  sketchPage({ grid: 'plain', tint: COL.sky, tintA: 0.22 });
  const E = ET('end'), END = DURATION, [hx0, hy0] = BR.takeoffEnd.b;
  const tSee = VW('end', 'thấy'), tSky = VW('end', 'trời'), tRem = VW('end', 'nhớ'), tStream = VW('end', 'dòng'), tHold = VW('end', 'đỡ');
  const calm = 1 - seg(TT, END - 1.6, END - 0.9);                       // the last ~1 s resolves (everything settles)
  // the far ground: one faint line low, a tiny runway sliding slowly right (the plane flies left)
  const gs = 14 * ((TT - E) * calm + (END - 1.25 - E) * (1 - calm));
  gpencil([[60, 1238], [1020, 1232]], { key: 'p_ngr', w: 3, a: 0.45 });
  const rx = 560 + gs;
  gpencil([[rx, 1222], [rx + 190, 1220]], { key: 'p_nrw', w: 3, a: 0.5 });
  for (let i = 0; i < 3; i++) gpencil([[rx + 20 + i * 60, 1228], [rx + 46 + i * 60, 1228]], { key: 'p_nrd' + i, w: 2.5, a: 0.45 });
  // the plane, up high: gentle bob, tiny pitch
  const bob = 7 * Math.sin((TT - E) * 1.6) * calm, rot = -(0.04 + 0.008 * Math.sin((TT - E) * 1.1) * calm);   // nose slightly UP (negative rot, nose LEFT)
  const py = p_EY + bob;
  planeSide(PLANE.x, py, PLANE.s, { rot, gear: 0, exhaust: 0.5 });
  // the stream: 3 blue down-flow strokes under the wing, written on from "nhớ", swelling on "dòng", chevrons ride them
  const sw = 1 + 0.35 * Math.sin(Math.PI * ev(tStream, 0.7));
  for (let i = 0; i < 3; i++) {
    const P = p_down(i, 0, bob * 0.6), k = ev(tRem + i * 0.15, 0.5);
    if (k <= 0) continue;
    gline(P, { key: 'p_ndf' + i, w: 6 * sw, col: COL.air, part: k, a: 0.9 });
    if (k >= 1) { const u = (((Math.floor(TT * 12) / 12 - tRem) * 0.55 + i * 0.33) % 1) * calm + 0.7 * (1 - calm); flowChevron(resample(P, false, 6), u, { key: 'p_nch' + i }); }
  }
  // weight DOWN from the centre-of-gravity dot (from "cả một dòng"), then on "đỡ lên" the lift UP from the wing on the
  // same line, just as long: in level flight the air holds the whole weight
  const cg = planePt(p_CG[0], p_CG[1], PLANE.x, py, PLANE.s, rot), roof = planePt(p_CG[0], -62, PLANE.x, py, PLANE.s, rot), NL = 160;
  forceArrow(cg[0], cg[1] + 16, cg[0], cg[1] + 16 + NL, { key: 'p_nw', part: ev(tStream - 0.5, 0.45), w: 36, head: 50 });
  p_cgDot(cg[0], cg[1], popS(tStream - 0.5), 'p_ncg');
  forceArrow(cg[0], roof[1] - 6, cg[0], roof[1] - 6 - NL, { key: 'p_nl', col: COL.lift, part: EZ.o2(ev(tStream - 0.5, 0.45)), w: 40, head: 50 });   // with the weight: in level flight the air holds it all
  // the hero, happy in the stream: holds the bridge spot, then drifts gently (a slow loop), settling for the last second
  const d = seg(TT, E + 0.5, E + 1.5) * calm, ph = (TT - E - 0.5) * 1.2;
  const hx = hx0 + 22 * Math.sin(ph) * d, hy = hy0 + 12 * Math.sin(ph * 2) * d + 0 * bob, br = p_breath();
  const hop = Math.sin(Math.PI * ev(tHold + 0.2, 0.3));
  heroAir(hx, hy - 20 * hop, HR, { key: 'hero', wind: 0.6 * d, dir: 0.9, mood: TT >= tSee ? 'happy' : 'calm', look: TT < tSky ? [-0.5, -1] : TT < tRem + 0.6 ? [0, 0.2] : [-0.3, -0.9], sx: br.sx * (1 - 0.04 * hop), sy: br.sy * (1 + 0.06 * hop), arms: TT >= tHold + 0.2 ? [1.0, 1.0] : null });
  viTag('trên trời');
  pageCaption(['không khí', 'đỡ máy bay'], [[1, 'đỡ']], { at: tStream - E - 0.6 });
};
