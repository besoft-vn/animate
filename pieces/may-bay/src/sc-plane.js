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
  if (TT < 0.6) { const tip = writeEnd(p_silW(px, py), sc); pencilTool(tip[0], tip[1], -0.75, 1); }
  else if (ik < 1) pencilTool(lerp(60, 1000, EZ.io(ik)), py - 60 + 90 * Math.sin(ik * 9), -0.75, 1);
  // "nặng": a luggage tag tied to the roof — "hàng trăm tấn" with a graphite down arrow; it sways gently
  const tg = ev(tHeavy, 0.4);
  if (tg > 0) {
    const ax = planePt(-140, -60)[0], ay = planePt(-140, -60)[1], sw = 0.035 * Math.sin(TT * 1.9) * tg, tx = 300, ty = 470;
    gpencil([[ax, ay], [tx + 260, ty + 120]], { key: 'p_hstr', w: 3, a: 0.75, part: tg });
    ctx.save(); ctx.translate(tx + 260, ty + 120); ctx.rotate(sw); ctx.translate(-(tx + 260), -(ty + 120));
    const TAG = [[tx, ty], [tx + 470, ty], [tx + 520, ty + 60], [tx + 470, ty + 120], [tx, ty + 120]];
    const k2 = popS(tHeavy + 0.05);
    ctx.translate(tx + 260, ty + 60); ctx.scale(k2, k2); ctx.translate(-(tx + 260), -(ty + 60));
    gfill(TAG, SK.sheet, { key: 'p_htagf' });
    gline(TAG, { key: 'p_htag', w: 4.5, closed: true });
    gline(loopPts(tx + 478, ty + 60, 11, 11, 0.1), { key: 'p_hhole', w: 3.5, second: false });
    forceArrow(tx + 50, ty + 22, tx + 50, ty + 104, { w: 26, head: 34, key: 'p_hwa', part: ev(tHeavy + 0.2, 0.3) });
    label('hàng trăm tấn', tx + 92, ty + 82, 62, { align: 'left', reveal: ev(VW('hook', 'hàng'), 0.6), key: 'p_htagl' });
    ctx.restore();
  }
  // "nâng": a dashed graphite question — what lifts it? (pencil up arrow from the wing + "?")
  const qa = ev(tLift, 0.45), wingTop = planePt(-60, -64);
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
  // thrust: a graphite arrow pointing LEFT (forward) above the plane, labelled "lực đẩy"
  const ta = ev(tPush + 0.1, 0.5), tb = 0.04 * Math.sin(TT * 5) * ta;
  forceArrow(900, 680, 560 - 20 * tb * 10, 680, { key: 'p_eth', part: ta, w: 46 });
  label('lực đẩy', 735, 615, 64, { reveal: ev(tPush + 0.4, 0.5), key: 'p_ethl' });
  // "không hề nhấc": a pencilled UP arrow from the engine ... crossed out once with a red X
  const ua = ev(tNot - 0.15, 0.4), top = planePt(-40, -62), ux = top[0];
  if (ua > 0) p_pencilArrow([ux, top[1] - 8], [ux, top[1] - 200], ua, 'p_eup', { w: 5, a: 0.8, head: 40 });
  const xa = ev(tLiftW, 0.18), xb = ev(tLiftW + 0.18, 0.18), cy = top[1] - 104;
  if (xa > 0) gline([[ux - 70, cy - 70], [ux + 70, cy + 70]], { key: 'p_ex1', w: 9, col: SK.red, part: xa, second: false });
  if (xb > 0) gline([[ux + 70, cy - 70], [ux - 70, cy + 70]], { key: 'p_ex2', w: 9, col: SK.red, part: xb, second: false });
  // the hero: on the bridge spot, watching the exhaust; on "lao" it is swept along under the nose and up ahead of it
  const mv = EZ.io(seg(TT, tGo, tNot + 0.4));
  const bx = (1 - mv) ** 2 * h0x + 2 * mv * (1 - mv) * 260 + mv * mv * h1x, by = (1 - mv) ** 2 * h0y + 2 * mv * (1 - mv) * 1090 + mv * mv * h1y;
  const moving = mv > 0 && mv < 1, br = p_breath(), hop = Math.sin(Math.PI * ev(tPush, 0.3));
  const look = TT < tGo ? [0.9, 0.1] : moving ? [-1, -0.3] : TT < tNot ? [0.8, 0] : [1, -0.6];
  heroAir(bx, by, HR, { key: 'hero', wind: moving ? 1 : 0, dir: Math.atan2(h1y - 1090, h1x - 260) * mv + Math.PI * (1 - mv), mood: TT >= tLiftW ? 'puzzled' : moving ? 'wow' : 'calm', look, sx: br.sx * (1 - 0.05 * hop), sy: br.sy * (1 + 0.07 * hop) });
  viTag('động cơ');
  pageCaption(['động cơ chỉ đẩy', 'không nhấc lên'], [[0, 'đẩy']], { at: 1.2 });
};

// ---- TAKEOFF: "Đủ nhanh, phi công nâng mũi lên, lực nâng vượt trọng lượng, và bánh xe rời đường băng."
SCENES.takeoff = function () {
  sketchPage({ grid: 'plain' });
  const [px, py0, ps] = p_PL(), E = ET('takeoff'), END = EE('takeoff'), [h0x, h0y] = BR.speedTakeoff.b, [h1x, h1y] = BR.takeoffEnd.a;
  const tNose = VW('takeoff', 'nâng'), tLift = VW('takeoff', 'lực'), tOver = VW('takeoff', 'vượt'), tWt = VW('takeoff', 'trọng'), tOff = VW('takeoff', 'rời');
  // rolling fast: the runway dashes race to the right (plane moves left)
  runway({ slide: -1 * (900 * (TT - E) + 120 * (TT - E) ** 2) });
  // nose up on "nâng mũi" (about the main wheels), wheels leave on "rời", climbing ~120 px, gear up
  const climb = 125 * EZ.io(seg(TT, tOff, END - 0.2)) + 4 * Math.sin(TT * 2.2) * seg(TT, tOff + 0.5, tOff + 1.5);
  const rot = 0.12 * EZ.io(ev(tNose, 0.8)) - 0.03 * EZ.io(seg(TT, tOff + 1, END)), gear = 1 - EZ.io(seg(TT, tOff + 0.6, tOff + 2.4));
  const py = py0 - climb, vib = TT < tOff ? 1.5 * Math.sin(TT * 40) : 0;
  planeSide(px, py + vib, ps, { rot, gear, exhaust: 1 });
  // weight: a graphite arrow pressing DOWN onto the roof (behind the wing), "trọng lượng"
  const wP = planePt(170, -62, px, py, ps, rot), wa = ev(E + 0.6, 0.45), wpulse = 1 + 0.12 * Math.sin(Math.PI * ev(tWt, 0.4));
  forceArrow(wP[0] + 20, wP[1] - 300, wP[0] + 20, wP[1] - 300 + 285 * wpulse, { key: 'p_tw', part: wa, w: 44 });
  label('trọng lượng', 760, wP[1] - 330, 58, { reveal: ev(E + 0.9, 0.6), key: 'p_twl' });
  // lift: yellow, UP from the roof over the wing; on "lực nâng" it's smaller than the weight, on "vượt" it grows past it
  const lP = planePt(-80, -62, px, py, ps, rot), lg = lerp(150, 330, EZ.back(ev(tOver, 0.5))) + 6 * Math.sin(TT * 3) * ev(tOver + 0.5, 0.3);
  forceArrow(lP[0], lP[1] - 6, lP[0], lP[1] - 6 - lg, { key: 'p_tl', col: COL.lift, part: ev(tLift, 0.4), w: 52 });
  label('lực nâng', lP[0] - 10, lP[1] - 30 - lg - 30, 58, { reveal: ev(tLift + 0.25, 0.5), key: 'p_tll' });
  // the hero: from the bridge spot (by the engine) it slides along under the wing and rides there; holds on the bridge spot
  const mv = EZ.io(seg(TT, E + 0.6, tNose + 0.4)), bob = Math.sin((TT - E) * 2.4) * seg(TT, tNose + 0.4, tNose + 1) * (1 - seg(TT, END - 1.4, END - 0.6));
  const hx = lerp(h0x, h1x, mv) + 14 * bob, hy = lerp(h0y, h1y, mv) - 10 * Math.abs(bob), br = p_breath();
  heroAir(hx, hy, HR, { key: 'hero', wind: 0.4 + 0.6 * clamp(bob * bob + mv * (1 - mv) * 4), dir: 0, mood: TT >= tOff ? 'happy' : TT >= tOver ? 'wow' : 'calm', look: [-0.6, -1], sx: br.sx, sy: br.sy });
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
  const gs = 40 * (TT - E) * calm + 40 * (END - 1.25 - E) * (1 - calm);
  gpencil([[60, 1238], [1020, 1232]], { key: 'p_ngr', w: 3, a: 0.45 });
  const rx = 640 + gs;
  gpencil([[rx, 1222], [rx + 190, 1220]], { key: 'p_nrw', w: 3, a: 0.5 });
  for (let i = 0; i < 3; i++) gpencil([[rx + 20 + i * 60, 1228], [rx + 46 + i * 60, 1228]], { key: 'p_nrd' + i, w: 2.5, a: 0.45 });
  // the plane, up high: gentle bob, tiny pitch
  const bob = 7 * Math.sin((TT - E) * 1.6) * calm, rot = 0.04 + 0.008 * Math.sin((TT - E) * 1.1) * calm;
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
  // a modest lift arrow up from the wing on "đỡ lên"
  const lP = planePt(-60, -62, PLANE.x, py, PLANE.s, rot);
  forceArrow(lP[0], lP[1] - 6, lP[0], lP[1] - 210, { key: 'p_nl', col: COL.lift, part: EZ.o2(ev(tHold, 0.5)), w: 46 });
  // the hero, happy in the stream: holds the bridge spot, then drifts gently (a slow loop), settling for the last second
  const d = seg(TT, E + 0.5, E + 1.5) * calm, ph = (TT - E - 0.5) * 1.2;
  const hx = hx0 + 22 * Math.sin(ph) * d, hy = hy0 + 12 * Math.sin(ph * 2) * d + 0 * bob, br = p_breath();
  const hop = Math.sin(Math.PI * ev(tHold + 0.2, 0.3));
  heroAir(hx, hy - 20 * hop, HR, { key: 'hero', wind: 0.6 * d, dir: 0.9, mood: TT >= tSee ? 'happy' : 'calm', look: TT < tSky ? [-0.5, -1] : TT < tRem + 0.6 ? [0, 0.2] : [-0.3, -0.9], sx: br.sx * (1 - 0.04 * hop), sy: br.sy * (1 + 0.06 * hop), arms: TT >= tHold + 0.2 ? [1.0, 1.0] : null });
  viTag('trên trời');
  pageCaption(['không khí', 'đỡ máy bay'], [[1, 'đỡ']], { at: tStream - E - 0.6 });
};
