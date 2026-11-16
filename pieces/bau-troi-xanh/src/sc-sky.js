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
  // the sky's pencil outline creeps in from "sao" (the question forming), before the blue goes in on "bầu trời"
  const skc = ev(tWhy - 0.1, tSky - tWhy + 0.5);
  if (skc > 0) gpencil(s_SKY, { key: 's_skyc', closed: true, w: 2.2, a: 0.35 + 0.1 * (1 - sk), part: skc });
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
    // the light keeps travelling: one bright dash runs down each ray toward the hero (stepped on 2s)
    if (p >= 1) { const ph = ((Math.floor(TT * 12) / 12 - tRay) / 0.9 + (i + 1) * 0.33) % 1, d0 = clamp(ph - 0.12), d1 = clamp(ph + 0.06);
      gline([[lerp(a[0], b[0], d0), lerp(a[1], b[1], d0)], [lerp(a[0], b[0], d1), lerp(a[1], b[1], d1)]], { key: 's_hrd' + i, w: 9, col: COL.sun, second: false, amp: 0.5, step: 8 }); }
  }
  // the pencil: draws the sun, then scribbles the sky
  if (TT < tSun + 0.7) { const tip = TT < tSun + 0.2 ? writeEnd(loopPts(sx, sy, sr, sr, 0.06), ev(0, tSun + 0.25)) : writeEnd(loopPts(sx, sy, sr, sr, 0.06), sp); pencilTool(tip[0], tip[1], -0.75, 1); }
  else if (TT >= tWhy - 0.1 && TT < tSky) { const tip = writeEnd(closeP(s_SKY), skc); pencilTool(tip[0], tip[1], -0.75, 1); }
  else if (TT >= tSky && TT < tSky + 0.7) { const k = ev(tSky, 0.6); pencilTool(lerp(160, 900, k), 560 + 420 * Math.abs(Math.sin(B * 1.7)) * (1 - k * 0.3), -0.75, 1); }
  // the hero on the horizon, looking up at the sun; puzzled from "sao", a "?" pops on "xanh"
  // on "vậy" it shades its eyes and leans back to look up at the bright sun; puzzled from "sao"
  const tShade = VW('hook', 'vậy') - 0.3, sh = ev(tShade, 0.35) * (1 - ev(tWhy, 0.3)), lean = -0.07 * sh;
  const hop = Math.sin(Math.PI * ev(tQ, 0.25)), why = TT >= tWhy;
  const arms = why ? [-0.6, 0.9] : [-0.9, lerp(-0.9, 1.68, sh)];
  doodleHero(hx, hy - 30 * hop, s_HR, { key: 'hero', legs: true, mood: why ? 'puzzled' : 'calm', rot: lean, look: TT >= tSky ? [-0.2, -1] : [0.6, -1], sx: 1 - 0.04 * hop, sy: 1 + 0.06 * hop + 0.015 * Math.sin(TT * 3), arms });
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
  // the beam keeps flowing: three bright dashes run from the sun into the glass (stepped on 2s)
  if (bp >= 1) for (let j = 0; j < 3; j++) { const ph = ((Math.floor(TT * 12) / 12 - tBeam) / 1.2 + j / 3) % 1, d0 = clamp(ph - 0.07), d1 = clamp(ph + 0.05);
    gline([[lerp(A[0], IN[0], d0), lerp(A[1], IN[1], d0)], [lerp(A[0], IN[0], d1), lerp(A[1], IN[1], d1)]], { key: 's_wbd' + j, w: 14, col: COL.sun, second: false, amp: 0.4, step: 8 }); }
  // the rainbow: seven bands fanning out of the far face, written on one after another on "cầu vồng"
  // pencil guides for the fan go in first ("là cả…"), then the colour; drawn bands shimmer in turn
  const tGuide = VW('white', 'là');
  s_BANDS.forEach((c, i) => {
    const t = 0.34 + i * 0.022, a = [640 + 140 * t, 590 + 330 * t], b = [930, 630 + i * 62], bk = ev(tBow + i * 0.07, 0.4);
    if (bk < 1) gpencil([a, b], { key: 's_wgd' + i, w: 2.2, a: 0.45, part: ev(tGuide + i * 0.08, 0.35) });
    const sh = bk >= 1 ? 1 + 0.22 * Math.max(0, Math.sin((Math.floor(TT * 12) / 12) * 3.2 - i * 0.9)) : 1;
    gline([a, b], { key: 's_wband' + i, w: 15 * sh, col: c, part: bk, second: false, amp: 0.9 });
  });
  // the pencil: draws the glass, then sweeps the bands
  if (TT >= tPrism && TT < tPrism + 0.75) { const tip = writeEnd(closeP(s_PRISM), TT < tPrism + 0.4 ? pc : pi); pencilTool(tip[0], tip[1], -0.75, 1); }
  else if (TT >= tGuide && TT < tBow) { const i = Math.min(6, Math.floor((TT - tGuide) / 0.08)), t = 0.34 + i * 0.022, a = [640 + 140 * t, 590 + 330 * t], k = ev(tGuide + i * 0.08, 0.35); pencilTool(lerp(a[0], 930, k), lerp(a[1], 630 + i * 62, k), -0.75, 1); }
  else if (TT >= tBow && TT < tBow + 0.9) { const k = ev(tBow, 0.85); pencilTool(lerp(720, 930, EZ.o2(k)), 630 + 372 * k, -0.75, 1); }
  // "trộn lại": a graphite bracket gathers the seven bands back into one
  const mp = ev(tMix, 0.4);
  if (mp > 0) {
    gpencil([[955, 622], [975, 630], [975, 1002], [955, 1010]], { key: 's_wbr', w: 3, a: 0.85, part: mp });
    gpencil([[982, 816], [1004, 816]], { key: 's_wbt', w: 3, a: 0.85, part: seg(mp, 0.7, 1) });
  }
  // the hero watches; wow on the rainbow, a hop, then happy
  // it walks in along the ground ("thật ra…") to its spot under the rainbow (bridge spot from 7.3s on)
  const wk = ev(VW('white', 'thật'), 1.3), walking = wk > 0 && wk < 1, wx = lerp(400, hx, EZ.io(wk));
  const stp = walking ? Math.sin(wk * Math.PI * 5) : 0, bob = walking ? Math.abs(stp) * 8 : 0;
  const hop = Math.sin(Math.PI * ev(tBow + 0.1, 0.25)), wow = TT >= tBow, happy = TT >= tMix;
  doodleHero(wx, hy - 34 * hop - bob, HR, { step: stp, key: 'hero', legs: true, mood: happy ? 'happy' : wow ? 'wow' : 'calm', look: wow ? [0.8, -0.9] : walking ? [0.7, -0.5] : [-0.6, -1], sx: 1 - 0.04 * hop, sy: 1 + 0.06 * hop + 0.015 * Math.sin(TT * 3), arms: wow ? [1.1, 1.2] : [-0.9, -0.9] });
  sparkle(hx + 90, hy - 90, 34, ev(tBow + 0.15, 0.5), 's_wspk');
  viTag('ánh sáng trắng');
  pageCaption(['trắng = 7 màu', 'trộn lại'], [[1, 'trộn']], { at: 0.6 });
};

// ---- END: "Chỉ còn cam và đỏ tới được mắt bạn. Cùng một bầu trời, chỉ khác đường đi của ánh sáng."
//  The same sea as "sunset" (seaHorizon, horizon y = SEA.y): the low orange sun at left on the water, the hero at right on
//  a little rock — the hook's question answered. Calm motion all the way: the sun sinks, glitter shimmers, the swell drifts.
const s_ROCK = [[636, 1264], [676, 1244], [750, 1236], [830, 1240], [884, 1252], [902, 1272], [872, 1288], [760, 1293], [652, 1287]];
const s_NOTE = [[170, 1306], [830, 1300], [836, 1468], [164, 1472]];
// a caption written on slowly, letter by letter (same look as pageCaption; DEFER so it sits over the camera)
function s_caption(lines, hi, t0s, durs, o = {}) {
  const f = () => {
    const size = o.size ?? 80, y0 = o.y ?? 1330, lh = size * 1.12;
    lines.forEach((line, li) => {
      const y = y0 + li * lh, xs = glyphX(line, skFont(size, 'hand')), x0 = CX - xs[xs.length - 1] / 2;
      for (const [hl, word, th] of hi) if (hl === li) { const k = line.indexOf(word); if (k >= 0) highlight(x0 + xs[k], x0 + xs[k + word.length], y - size * 0.28, size * 0.55, ev(th, 0.3), { key: 's_caph' + li }); }
      handLetter(line, CX, y, size, { face: 'hand', reveal: ev(t0s[li], durs[li]), key: 's_cap' + li + line });
    });
  };
  if (DEFER) DEFER.push(f); else f();
}
SCENES.end = function () {
  sketchPage({ grid: 'plain' });
  const E = ET('end'), [sx0, sy0, sr] = BR.sunsetEnd.b, ghost = BR.hookWhite.a, HX = 760, HY = 1110;
  const tCam = VW('end', 'cam'), tDo = VW('end', 'đỏ'), tEye = VW('end', 'mắt'), tBan = VW('end', 'bạn'), tSame = VW('end', 'cùng');
  const tSky = VW('end', 'bầu'), tKhac = VW('end', 'khác'), tPath = VW('end', 'đường'), tEndV = VL('end').t1;
  // the sea at sunset (shared with "sunset"), a glitter path under the sun
  seaHorizon();
  seaGlitter(200);
  // the low orange sun: on the bridge spot until E + 0.5, then sinking slowly into the sea (clipped at the horizon)
  const sk = seg(TT, E + 0.5, DURATION - 0.6), sy = sy0 + 70 * sk * sk * (3 - 2 * sk), sx = sx0;
  ctx.save(); ctx.beginPath(); ctx.rect(-200, -200, W + 400, SEA.y - 2 + 200); ctx.clip();
  s_sun(sx, sy, sr, { key: 's_esun', col: COL.orange });
  ctx.restore();
  // the little rock the hero stands on (paper fill, inked, graphite shade under it)
  smudge(770, 1292, 140, 12, 0.12, 0);
  gfill(s_ROCK, SK.paper, { off: [0, 0], key: 's_erkp' });
  litHatch(s_ROCK, { ang: -0.85, gap: 12, col: SK.graph, w: 2, a: 0.45, key: 's_erkh' });
  gline(s_ROCK, { key: 's_erk', closed: true, w: 4.5 });
  // the hero's pose over time: stands, wow on "mắt", waves at the sun, points up on "bầu trời", sits down after the line,
  // then turns to camera and smiles (the last ~1 s holds)
  const tSit = tEndV - 0.2, tTurn = DURATION - 1.45;
  const sit = EZ.io(ev(tSit, 0.5)), hy = lerp(HY, 1152, sit), hx = HX;
  const eye = [hx - 104, hy - 6];
  // the noon sun's ghost: same sky, light came straight down (dashed graphite), on "Cùng một bầu trời"
  const gp = ev(tSame, 0.6);
  if (gp > 0) {
    ctx.save(); ctx.setLineDash([16, 14]);
    gpencil(loopPts(ghost[0], ghost[1], ghost[2], ghost[2], 0.04), { key: 's_eghost', w: 3, a: 0.6, part: gp });
    gpencil([[ghost[0], ghost[1] + 130], [hx, HY - 150]], { key: 's_eghr', w: 3, a: 0.55, part: ev(tSame + 0.6, 0.5) });
    ctx.restore();
    if (TT < tSame + 1.1) { const tip = TT < tSame + 0.6 ? writeEnd(loopPts(ghost[0], ghost[1], ghost[2], ghost[2], 0.04), gp) : [ghost[0], lerp(ghost[1] + 130, HY - 150, ev(tSame + 0.6, 0.5))]; pencilTool(tip[0], tip[1], -0.75, 1); }
  }
  // what reaches the eye: an orange ray on "cam", a red one on "đỏ" (long, low paths across the sky); light keeps flowing
  // along them as travelling dashes, and on "đường đi" they swell
  const pulse = 1 + 0.5 * Math.sin(Math.PI * ev(tPath, 0.7));
  const rays = [[[sx + 140, sy - 22], [eye[0] - 8, eye[1] - 4], COL.orange, ev(tCam, 0.45), 's_ero'], [[sx + 136, sy + 26], [eye[0] - 8, eye[1] + 28], COL.red, ev(tDo, 0.45), 's_err']];
  rays.forEach(([a, b, c, p, k], j) => {
    s_ray(a, b, c, p, k, { w: 7 * pulse });
    if (p >= 1) { const ph = ((Math.floor(TT * 12) / 12 - tCam) / 1.4 + j * 0.5) % 1, d0 = clamp(ph - 0.06), d1 = clamp(ph + 0.04);
      gline([[lerp(a[0], b[0], d0), lerp(a[1], b[1], d0)], [lerp(a[0], b[0], d1), lerp(a[1], b[1], d1)]], { key: k + 'd', w: 13 * pulse, col: c, second: false, amp: 0.5, step: 8 }); }
  });
  // sitting legs dangle over the rock's front edge
  if (sit > 0.5) for (const s of [-1, 1]) gline([[hx + s * 28, hy + 70], [hx + s * 34, 1246], [hx + s * 40 - 6, 1278], [hx + s * 40 + 14, 1280]], { key: 's_eleg' + s, w: 5.5, amp: 0.8, second: false, step: 8 });
  const wow = TT >= tEye && TT < tEye + 0.5;
  const hop = Math.sin(Math.PI * ev(tBan + 0.1, 0.3));
  const wave = TT >= tBan + 0.3 && TT < tSame ? 1.6 + 0.45 * Math.sin((TT - tBan) * 9) : null;              // waves at the sun
  const point = ev(tSky - 0.1, 0.3) * (1 - ev(tKhac, 0.3));                                              // points up at the ghost
  const toward = ev(tKhac, 0.3) * (1 - ev(tSit - 0.1, 0.3));                                              // points along the long path
  const turn = ev(tTurn, 0.35), hi2 = Math.sin(Math.PI * ev(tTurn + 0.4, 0.5));                            // to camera, a small wave
  let arms = [-0.9, -0.9];
  if (wave != null) arms = [wave, -0.9];
  if (point > 0) arms = [-0.9, lerp(-0.9, 1.45, point)];
  if (toward > 0) arms = [lerp(-0.9, 0.25, toward), -0.9];
  if (sit > 0.5) arms = [-0.4, turn > 0 ? lerp(-0.4, 1.3 + 0.35 * hi2, turn) : -0.4];
  let look = [-1, -0.2];
  if (TT >= tSame && TT < tKhac) look = [0, -1];
  if (turn > 0) look = [lerp(-1, 0, turn), lerp(-0.2, 0.25, turn)];
  const mood = wow ? 'wow' : TT >= tEye ? 'happy' : 'calm';
  doodleHero(hx, hy - 30 * hop, s_HR, { key: 'hero', legs: sit <= 0.5, mood, look, rot: 0.04 * hi2, sx: 1 - 0.04 * hop, sy: 1 + 0.06 * hop + 0.015 * Math.sin(TT * 3), arms });
  // a scrap of paper on the water for the caption (so the lettering reads over the sea), taped on as the line begins
  const nk = ev(tSame - 0.3, 0.3);
  if (nk > 0) { gfill(s_NOTE, SK.paper, { a: 0.9 * nk, off: [0, 0], key: 's_enote' }); gpencil(s_NOTE, { key: 's_enotec', closed: true, w: 2.2, a: 0.5, part: nk }); }
  viTag('hoàng hôn');
  s_caption(['cùng một bầu trời', 'khác đường đi'], [[1, 'đường đi', tPath + 0.25]], [tSame, tKhac - 0.1], [1.1, 0.9], { y: 1372 });
};
