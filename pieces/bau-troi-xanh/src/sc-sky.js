// =====================================================================
//  SC-SKY — hook, white, end. Clean frames: one subject, big shapes, bare paper (KHUNG HÌNH GỌN).
//  hook and end share one page: the same horizon (y 1190), the same hero spot (620, 1060), the same sky shape.
// =====================================================================
const s_HORIZON = 1190, s_HERO = [620, 1060], s_HR = 90, s_PEACH = '#f6c49c';
// the sky: one big soft shape above the horizon (scribbled blue in the hook, orange/peach at the end)
const s_SKY = (() => { const P = [], R = RNG('s_sky'); for (let i = 0; i < 48; i++) { const a = i / 48 * TAU, c = Math.cos(a), si = Math.sin(a), e = 0.32; P.push([540 + 450 * Math.sign(c) * Math.abs(c) ** e + R.n(6), 790 + 345 * Math.sign(si) * Math.abs(si) ** e + R.n(6)]); } return P; })();
// the horizon: one long ink stroke, pencilled first; two small grass tufts
function s_horizon(part) {
  const P = [[70, s_HORIZON + 4], [330, s_HORIZON - 3], [640, s_HORIZON + 2], [1010, s_HORIZON - 2]];
  gpencil(P, { key: 's_hzc', w: 2.6, a: 0.6, part: clamp(part * 1.6) });
  gline(P, { key: 's_hz', w: 5, part: seg(part, 0.35, 1) });
  if (part >= 1) for (const [x, k] of [[250, 0], [880, 1]]) gline([[x - 14, s_HORIZON - 2], [x - 8, s_HORIZON - 26], [x, s_HORIZON - 4], [x + 8, s_HORIZON - 22], [x + 14, s_HORIZON]], { key: 's_tuft' + k, w: 3, second: false, amp: 0.6, step: 6, col: SK.graph });
}
// a sun with a paper disc under it (so a scribbled sky doesn't tint it)
function s_sun(x, y, r, o = {}) {
  gfill(loopPts(x, y, r * 1.02, r * 1.02, 0), SK.paper, { a: o.paper ?? 1, off: [0, 0], key: (o.key || 'sun') + 'p' });
  sunDoodle(x, y, r, o);
}
// a straight light ray with an arrowhead, written on
function s_ray(a, b, col, part, key, o = {}) {
  const Q = gline([a, b], { w: o.w ?? 6, col, key, part, second: false, amp: 1 });
  if (Q && part > 0.85) {
    const an = Math.atan2(b[1] - a[1], b[0] - a[0]), hk = seg(part, 0.85, 1), e = Q[Q.length - 1];
    for (const s of [-1, 1]) gline([e, [e[0] - Math.cos(an + s * 0.45) * 30 * hk, e[1] - Math.sin(an + s * 0.45) * 30 * hk]], { w: o.w ?? 6, col, key: key + 'h' + s, second: false, amp: 0.5, step: 6 });
  }
}

// ---- HOOK: "Nắng mặt trời màu trắng, vậy sao bầu trời lại xanh?"
SCENES.hook = function () {
  sketchPage({ grid: 'plain' });
  const [sx, sy, sr] = BR.hookWhite.a, [hx, hy] = s_HERO;
  const tSun = 0.15, tRay = VW('hook', 'trắng'), tSky = VW('hook', 'bầu'), tQ = VW('hook', 'xanh'), tWhy = VW('hook', 'sao');
  // the sky: one big blue scribble, written on as the voice says "bầu trời"
  const sk = ev(tSky, 0.6);
  if (sk > 0) scribbleFill(s_SKY, COL.blueL, { key: 's_skyb', gap: 30, w: 6, a: 0.8, base: 0.28, part: sk, ang: -0.45 });
  if (sk > 0) gpencil(s_SKY, { key: 's_skyc', closed: true, w: 2.2, a: 0.35, part: sk });
  s_horizon(ev(0, 0.5));
  // the sun: pencil construction, then the inked, scribbled disc, then its ticks
  gpencil(loopPts(sx, sy, sr, sr, 0.06), { key: 's_hsunc', w: 2.4, a: 0.6, part: ev(0, tSun + 0.25) });
  const sp = ev(tSun + 0.2, 0.5);
  if (sp > 0) s_sun(sx, sy, sr, { key: 's_hsun', part: sp, rays: ev(tSun + 0.65, 0.4), paper: sk > 0 ? 1 : 0 });
  // white sunlight toward the hero: three graphite rays with a thin yellow core
  const ux = hx - sx, uy = (hy - 70) - sy, L = Math.hypot(ux, uy), u = [ux / L, uy / L], n = [-u[1], u[0]];
  for (let i = -1; i <= 1; i++) {
    const p = ev(tRay + (i + 1) * 0.08, 0.45), o = i * 46;
    const a = [sx + u[0] * 200 + n[0] * o, sy + u[1] * 200 + n[1] * o], b = [sx + u[0] * (560 - Math.abs(i) * 40) + n[0] * o, sy + u[1] * (560 - Math.abs(i) * 40) + n[1] * o];
    gline([a, b], { key: 's_hry' + i, w: 4, col: COL.sun, part: p, second: false, amp: 0.8 });
    gpencil([[a[0] + n[0] * 7, a[1] + n[1] * 7], [b[0] + n[0] * 7, b[1] + n[1] * 7]], { key: 's_hrg' + i, w: 2.6, a: 0.75, part: p });
  }
  // the pencil: draws the sun, then scribbles the sky
  if (TT < tSun + 0.7) { const tip = TT < tSun + 0.2 ? writeEnd(loopPts(sx, sy, sr, sr, 0.06), ev(0, tSun + 0.25)) : writeEnd(loopPts(sx, sy, sr, sr, 0.06), sp); pencilTool(tip[0], tip[1], -0.75, 1); }
  else if (TT >= tSky && TT < tSky + 0.7) { const k = ev(tSky, 0.6); pencilTool(lerp(160, 900, k), 560 + 420 * Math.abs(Math.sin(B * 1.7)) * (1 - k * 0.3), -0.75, 1); }
  // the hero on the horizon, looking up at the sun; puzzled from "sao", a "?" pops on "xanh"
  const hop = Math.sin(Math.PI * ev(tQ, 0.25)), why = TT >= tWhy;
  doodleHero(hx, hy - 30 * hop, s_HR, { key: 'hero', legs: true, mood: why ? 'puzzled' : 'calm', look: TT >= tSky ? [-0.2, -1] : [0.6, -1], sx: 1 - 0.04 * hop, sy: 1 + 0.06 * hop + 0.015 * Math.sin(TT * 3), arms: why ? [-0.6, 0.9] : [-0.9, -0.9] });
  const q = popS(tQ);
  if (q > 0) { ctx.save(); ctx.translate(hx + 120, hy - 140); ctx.scale(q, q); ctx.rotate(0.12); handLetter('?', 0, 40, 150, { face: 'hand', col: SK.ink, key: 's_hq', jit: 1.2 }); ctx.restore(); }
  viTag('câu hỏi');
  pageCaption(['nắng trắng…', 'sao trời xanh?'], [[1, 'xanh']], { at: 0.5 });
};

// ---- WHITE: "Vì ánh sáng trắng thật ra là cả cầu vồng trộn lại với nhau."
const s_PRISM = [[640, 590], [780, 920], [500, 920]];
const s_BANDS = [COL.red, COL.orange, COL.sun, '#5fa65a', COL.blue, '#4f5fb5', COL.violet];
SCENES.white = function () {
  sketchPage({ grid: 'plain' });
  const [sx, sy, sr] = BR.hookWhite.b, [hx, hy] = BR.whiteWaves.a, E = ET('white');
  const tPrism = E + 0.45, tBeam = VW('white', 'trắng'), tBow = VW('white', 'cầu'), tMix = VW('white', 'trộn');
  // ground under the hero
  gline([[380, hy + HR * 1.45], [560, hy + HR * 1.42 - 3], [720, hy + HR * 1.45]], { key: 's_wgr', w: 4.5 });
  // the sun (the bridge object) — fully there from the first frame
  s_sun(sx, sy, sr, { key: 's_wsun', paper: 0 });
  // the glass prism: pencilled, then inked; two glints
  const pc = ev(tPrism, 0.4), pi = ev(tPrism + 0.4, 0.35);
  if (pi > 0) gfill(s_PRISM, SK.sheet, { a: 0.9 * pi, key: 's_wpf' });
  gpencil(s_PRISM, { key: 's_wpc', closed: true, w: 2.6, a: 0.65, part: pc });
  gline(s_PRISM, { key: 's_wp', closed: true, w: 5.5, part: pi });
  if (pi >= 1) { gline([[618, 660], [600, 704]], { key: 's_wgl1', w: 3, col: SK.graph, second: false, amp: 0.4 }); gline([[592, 726], [585, 744]], { key: 's_wgl2', w: 3, col: SK.graph, second: false, amp: 0.4 }); }
  // one white beam from the sun into the glass (graphite edges, thin yellow core), and through it
  const IN = [591, 706], OUT = [692, 712], du = [IN[0] - sx, IN[1] - sy], dl = Math.hypot(...du), A = [sx + du[0] / dl * 118, sy + du[1] / dl * 118];
  const bp = ev(tBeam, 0.45);
  gline([A, IN], { key: 's_wbc', w: 8, col: COL.sun, part: bp, second: false, amp: 0.6 });
  for (const s of [-1, 1]) gpencil([[A[0], A[1] + s * 9], [IN[0], IN[1] + s * 9]], { key: 's_wbe' + s, w: 2.6, a: 0.8, part: bp });
  gpencil([IN, OUT], { key: 's_wbi', w: 3, a: 0.5, part: ev(tBeam + 0.45, 0.2) });
  // the rainbow: seven bands fanning out of the far face, written on one after another on "cầu vồng"
  s_BANDS.forEach((c, i) => {
    const t = 0.34 + i * 0.022, a = [640 + 140 * t, 590 + 330 * t], b = [930, 630 + i * 62];
    gline([a, b], { key: 's_wband' + i, w: 15, col: c, part: ev(tBow + i * 0.07, 0.4), second: false, amp: 0.9 });
  });
  // the pencil: draws the glass, then sweeps the bands
  if (TT >= tPrism && TT < tPrism + 0.75) { const tip = writeEnd(closeP(s_PRISM), TT < tPrism + 0.4 ? pc : pi); pencilTool(tip[0], tip[1], -0.75, 1); }
  else if (TT >= tBow && TT < tBow + 0.9) { const k = ev(tBow, 0.85); pencilTool(lerp(720, 930, EZ.o2(k)), 630 + 372 * k, -0.75, 1); }
  // "trộn lại": a graphite bracket gathers the seven bands back into one
  const mp = ev(tMix, 0.4);
  if (mp > 0) {
    gpencil([[955, 622], [975, 630], [975, 1002], [955, 1010]], { key: 's_wbr', w: 3, a: 0.85, part: mp });
    gpencil([[982, 816], [1004, 816]], { key: 's_wbt', w: 3, a: 0.85, part: seg(mp, 0.7, 1) });
  }
  // the hero watches; wow on the rainbow, a hop, then happy
  const hop = Math.sin(Math.PI * ev(tBow + 0.1, 0.25)), wow = TT >= tBow, happy = TT >= tMix;
  doodleHero(hx, hy - 34 * hop, HR, { key: 'hero', legs: true, mood: happy ? 'happy' : wow ? 'wow' : 'calm', look: wow ? [0.8, -0.9] : [-0.6, -1], sx: 1 - 0.04 * hop, sy: 1 + 0.06 * hop + 0.015 * Math.sin(TT * 3), arms: wow ? [1.1, 1.2] : [-0.9, -0.9] });
  sparkle(hx + 90, hy - 90, 34, ev(tBow + 0.15, 0.5), 's_wspk');
  viTag('ánh sáng trắng');
  pageCaption(['trắng = 7 màu', 'trộn lại'], [[1, 'trộn']], { at: 0.6 });
};

// ---- END: "Chỉ còn cam và đỏ tới được mắt bạn. Cùng một bầu trời, chỉ khác đường đi của ánh sáng."
SCENES.end = function () {
  sketchPage({ grid: 'plain' });
  const [sx, sy, sr] = BR.sunsetEnd.b, [hx, hy] = s_HERO, ghost = BR.hookWhite.a;
  const tCam = VW('end', 'cam'), tDo = VW('end', 'đỏ'), tEye = VW('end', 'mắt'), tSame = VW('end', 'cùng'), tPath = VW('end', 'đường');
  // the same sky shape as the hook, now peach and orange
  gfill(s_SKY, s_PEACH, { a: 0.3, off: [0, 0], key: 's_eskp' });
  scribbleFill(s_SKY, s_PEACH, { key: 's_esko', gap: 30, w: 6, a: 0.9, base: 0.1, ang: -0.45 });
  gpencil(s_SKY, { key: 's_eskc', closed: true, w: 2.2, a: 0.35 });
  // the low orange sun, sitting on the horizon (nothing drawn below the ground line)
  ctx.save(); ctx.beginPath(); ctx.rect(-200, -200, W + 400, s_HORIZON - 2 + 200); ctx.clip();
  s_sun(sx, sy, sr, { key: 's_esun', col: COL.orange });
  ctx.restore();
  s_horizon(1);
  // the noon sun's ghost: same sky, the light came straight down (dashed graphite), on "Cùng một bầu trời"
  const gp = ev(tSame, 0.5);
  if (gp > 0) {
    ctx.save(); ctx.setLineDash([16, 14]);
    gpencil(loopPts(ghost[0], ghost[1], ghost[2], ghost[2], 0.04), { key: 's_eghost', w: 3, a: 0.6, part: gp });
    gpencil([[ghost[0] - 30, ghost[1] + 150], [hx + 30, hy - 140]], { key: 's_eghr', w: 3, a: 0.55, part: ev(tSame + 0.45, 0.4) });
    ctx.restore();
    if (TT < tSame + 0.55) { const tip = writeEnd(loopPts(ghost[0], ghost[1], ghost[2], ghost[2], 0.04), gp); pencilTool(tip[0], tip[1], -0.75, 1); }
  }
  // what reaches the eye: an orange ray on "cam", a red one on "đỏ" (long, low paths); they pulse on "đường đi"
  const pulse = 1 + 0.6 * Math.sin(Math.PI * ev(tPath, 0.5));
  s_ray([sx + 140, sy - 22], [hx - 112, hy - 10], COL.orange, ev(tCam, 0.45), 's_ero', { w: 7 * pulse });
  s_ray([sx + 136, sy + 26], [hx - 112, hy + 22], COL.red, ev(tDo, 0.45), 's_err', { w: 7 * pulse });
  // the hero, content: looks at the sunset, a little wow when it reaches the eye, then happy
  const hop = Math.sin(Math.PI * ev(tPath + 0.3, 0.25)), wow = TT >= tEye && TT < tEye + 0.6;
  doodleHero(hx, hy - 30 * hop, s_HR, { key: 'hero', legs: true, mood: wow ? 'wow' : TT >= tEye ? 'happy' : 'calm', look: TT >= tSame && TT < tSame + 1.2 ? [0.5, -1] : [-1, -0.2], sx: 1 - 0.04 * hop, sy: 1 + 0.06 * hop + 0.015 * Math.sin(TT * 3), arms: TT >= tPath + 0.3 ? [-0.9, 1.0] : [-0.9, -0.9] });
  sparkle(hx - 50, hy - 100, 36, ev(tEye, 0.5), 's_espk');
  viTag('hoàng hôn');
  pageCaption(['cùng một bầu trời', 'khác đường đi'], [[1, 'đường đi']], { at: tSame - ET('end') });
};
