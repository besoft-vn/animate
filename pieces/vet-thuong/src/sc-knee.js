// =====================================================================
//  sc-knee.js — the knee scenes (owned by the sc-knee agent; prefix KN_).
//  hook  (0–7.0)       a scraped knee in a playground: a brown scab; "vảy = da mới?" crossed out; a torn cut-away window
//                      opens on the scab and shows the skin slice (scab on top, new skin tongue under it); the window
//                      grows to fill the frame: the slice IS the picture, hero at [290, 650, 60].
//  moist (43.0–49.25)  mint wall, the hero narrator at [540, 470, 60] over two cards: LEFT "khô" (thick cracked crust,
//                      a cell creeps slowly down under it), RIGHT "đủ ẩm" (plaster over a moist bed, water drops, a
//                      cell glides across fast).
//  end   (54.75–61.5)  the hook's knee again (ball moved, plaster box open); the hero sits on the scab, the scab peels
//                      and falls DOWN off frame; pink new skin underneath; the hero waves from it; "da mới ✓".
// =====================================================================
const KN_KNEE = [540, 700];            // knee centre (hook + end)
const KN_SCAB = [540, 560];            // scab centre on the knee (the hero tucks under its lower edge in the end)
const KN_WIN = [540, 720];             // the cut-away window centre (top stays below y 380 until it grows)
const KN_PATCH = [572, 612];           // the pink new-skin patch under the scab (end)
const KN_SLICE_P0 = [540, 615];        // the slice point that sits under the knee scab when the window opens
const KN_GRASS_Y = 1060;

// ---- the scab shape on the knee (≈ 250 × 140), centred at (x, y), rotated a about its own centre
function KN_scabPts(x, y, s = 1, a = 0) {
  const R = [[-125, -10], [-108, -50], [-60, -68], [-5, -62], [48, -72], [100, -52], [128, -12], [118, 34], [76, 62], [18, 70], [-40, 64], [-96, 46]];
  const c = Math.cos(a), si = Math.sin(a);
  return R.map(([px, py]) => [x + (px * c - py * si) * s, y + (px * si + py * c) * s]);
}

// ---- the playground world + the bent leg (hook and end). o.later: the end's version (ball elsewhere, box open)
function KN_world(o = {}) {
  const later = !!o.later;
  // sky wall
  cut(rect(-40, -40, W + 80, KN_GRASS_Y + 80, 0), PAL.sky, { key: 'knsky', shadow: false, tear: 0, grain: 0.3 });
  // two clouds drifting slowly right
  for (const [i, cy, sp, ph] of [[0, 470, 14, 0], [1, 600, 9, 520]]) {
    const cx = -160 + mod(ph + TT * sp + (later ? 300 : 0), 1400);
    cut(ellipsePts(cx, cy, 90, 34, 0, 20), PAL.paper, { key: 'kncl' + i, sb: 6, sy: 3, grain: false });
    cut(ellipsePts(cx + 40, cy - 22, 52, 32, 0, 18), PAL.paper, { key: 'kncm' + i, shadow: false, grain: false });
  }
  // a bike wheel edge at the right (turning slowly), behind the grass
  const wa = TT * 0.6;
  ctx.save(); ctx.translate(1030, 880);
  for (let k = 0; k < 4; k++) { const a = wa + k * Math.PI / 4; ink([[-Math.cos(a) * 200, -Math.sin(a) * 200], [Math.cos(a) * 200, Math.sin(a) * 200]], { w: 6, color: PAL.grey, amt: 0.3, key: 'knsp' + k }); }
  ctx.lineWidth = 34; ctx.strokeStyle = PAL.charcoal; ctx.beginPath(); ctx.arc(0, 0, 210, 0, TAU); ctx.stroke();
  cut(ellipsePts(0, 0, 30, 30, 0, 16), PAL.grey, { key: 'knhub', sb: 4, sy: 2, grain: false });
  ctx.restore();
  // grass
  cut(rect(-40, KN_GRASS_Y, W + 80, H - KN_GRASS_Y + 40, 0), PAL.green, { key: 'kngrass', tear: 0.8, sy: -4, grain: 0.3 });
  // the plaster box on the grass (between the shorts and the shin); open in the end
  const bx = 360, by = 1190;
  cut(rect(bx - 95, by - 60, 190, 120, 8), '#e9d7b4', { key: 'knbox', sb: 6, sy: 4, grain: 0.3 });
  if (later) {
    cut(rot(rect(bx - 100, by - 108, 200, 40, 6), bx - 100, by - 68, -0.5 + 0.03 * Math.sin(TT * 2)), '#dcc69d', { key: 'knlid', sb: 5, sy: 3, grain: 0.3 });
    cut(rot(rect(bx - 30, by - 100, 120, 34, 14), bx + 30, by - 83, 0.25), '#f0c9a4', { key: 'knpl', sb: 4, sy: 2, grain: false });
  } else {
    cut(rect(bx - 100, by - 74, 200, 30, 6), '#dcc69d', { key: 'knlid0', sb: 5, sy: 3, grain: 0.3 });
  }
  cut(rect(bx - 60, by - 22, 120, 40, 18), '#f0c9a4', { key: 'knplb', shadow: false, grain: false });
  cut(rect(bx - 22, by - 16, 44, 28, 6), PAL.paper, { key: 'knplp', shadow: false, grain: false });
  // the ball rolling on the grass (angle = x / r: rolls the right way both directions)
  const br = 62, bxx = o.ballX ?? 900, byy = KN_GRASS_Y + 70 - br;
  ctx.save(); ctx.translate(bxx, byy); ctx.rotate(bxx / br);
  cut(ellipsePts(0, 0, br, br, 0, 28), PAL.paper, { key: 'knball', sb: 8, sy: 5, grain: false });
  ctx.save(); trace(ellipsePts(0, 0, br - 2, br - 2, 0, 28), true); ctx.clip();
  ctx.fillStyle = PAL.navy; ctx.fillRect(-br, -16, 2 * br, 32); ctx.restore();
  ctx.restore();
  // the bent leg (seen from the side, knee up): a tapered shin down to a sneaker, the thigh from the lower left in
  // shorts, the round knee on top (clearly wider than the shin). The shin sways a little about the knee.
  const sw = 0.025 * Math.sin(TT * TAU * 0.3) + (o.sway ?? 0);
  const [kx, ky] = KN_KNEE, sl = 500, sa = 1.22 + sw;
  const ux = Math.cos(sa), uy = Math.sin(sa), nx = -uy, ny = ux;
  const ax = kx + ux * sl, ay = ky + uy * sl;                      // the ankle
  const shin = [[kx + nx * 130, ky + ny * 130], [ax + nx * 72, ay + ny * 72], [ax - nx * 72, ay - ny * 72], [kx - nx * 130, ky - ny * 130]];
  cut(shin, COL.skin, { key: 'knshin', tear: 0.6, sb: 10, sy: 6, grain: 0.3 });
  // the sneaker: sock cuff, an L-shaped shoe (heel under the ankle, toe forward to the right), white sole, laces
  cut(capsulePts(ax - nx * 80, ay - ny * 80, ax + nx * 80, ay + ny * 80, 46, 6), PAL.paper, { key: 'knsock', sb: 4, sy: 2, grain: false });
  const sx0 = ax - 95, sy0 = ay + 10;
  const shoe = [[sx0, sy0], [sx0 + 150, sy0 - 12], [sx0 + 190, sy0 + 40], [sx0 + 300, sy0 + 70], [sx0 + 318, sy0 + 118], [sx0 - 6, sy0 + 118], [sx0 - 16, sy0 + 60]];
  cut(shoe, PAL.navy, { key: 'knshoe', tear: 0.5, sb: 8, sy: 5, grain: 0.3 });
  cut(rect(sx0 - 22, sy0 + 108, 350, 34, 14), PAL.paper, { key: 'knsole', sb: 5, sy: 3, grain: false });
  for (let i = 0; i < 3; i++) ink([[sx0 + 150 + i * 30, sy0 + 10 + i * 12], [sx0 + 182 + i * 30, sy0 + 28 + i * 12]], { w: 6, color: PAL.paper, amt: 0.2, key: 'knlace' + i });
  cut(capsulePts(-160, 1000, kx, ky, 330, 10), COL.skin, { key: 'knthigh', tear: 0.6, sb: 10, sy: 6, grain: 0.3 });
  cut(capsulePts(-220, 1080, 120, 920, 400, 10), PAL.navy, { key: 'knshorts', tear: 0.7, sb: 8, sy: 5, grain: 0.3, pat: pat.stripes('rgba(255,255,255,0.10)', 10, 46, 0.4) });
  cut(ellipsePts(kx, ky - 10, 228, 212, -0.1, 40), COL.skin, { key: 'knknee', tear: 0.5, shadow: false, grain: 0.3, shade: false });
  ctx.fillStyle = 'rgba(214,138,99,0.16)'; ctx.beginPath(); ctx.ellipse(kx + 40, ky + 120, 170, 64, -0.2, 0, TAU); ctx.fill();
}

// ---- the torn cut-away window: centre c, radius r; content() is drawn clipped inside
function KN_window(c, r, content) {
  if (r < 2) return;
  const n = 72, P = [];
  for (let i = 0; i < n; i++) { const a = i / n * TAU, j = 1 + 0.035 * Math.sin(5 * a + 1.3) + 0.02 * Math.sin(11 * a); P.push([c[0] + Math.cos(a) * r * j, c[1] + Math.sin(a) * r * j]); }
  const Q = torn(P, 'knwin', Math.min(10, r * 0.03));
  ctx.save(); ctx.shadowColor = 'rgba(35,20,10,0.35)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; trace(Q, true); ctx.fillStyle = COL.skinD; ctx.fill(); ctx.restore();
  ctx.save(); trace(Q, true); ctx.clip(); content(); ctx.restore();
  ctx.save(); ctx.lineJoin = 'round';
  ctx.strokeStyle = COL.skinD; ctx.lineWidth = 18; trace(Q, true); ctx.stroke();
  ctx.strokeStyle = '#fbf6ea'; ctx.lineWidth = 7; trace(Q, true); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------
//  HOOK (0–7.0) — "Lớp vảy trên vết xước không phải da mới: da mới đang mọc ngay bên dưới nó."
// ---------------------------------------------------------------------
SCENES.hook = function () {
  const tVay = VW('hook', 'vảy'), tKhong = VW('hook', 'không'), tDa2 = VW('hook', 'da', 2), tMoc = VW('hook', 'mọc');
  const tOpen = tDa2 + 0.15;                        // the window tears open on the second "da mới"
  const tGrow = 5.55, tFull = 6.35;                 // grows to fill the frame, still well before the bridge (6.5)
  // the ball rolls in from the right and settles
  const ballX = lerp(1180, 860, EZ.o3(seg(TT, 0.2, 3.6))) + 10 * Math.sin(TT * 1.3) * seg(TT, 3.6, 4.5);
  KN_world({ ballX });
  // the scab on the knee (breathes a hair with the leg)
  cut(KN_scabPts(KN_SCAB[0], KN_SCAB[1], 1 + 0.015 * Math.sin(TT * 2.2)), COL.scab, { key: 'knscab', tear: 2.2, sb: 8, sy: 5, grain: 0.5, crayon: COL.scabD, crAl: 0.3, crPer: 40 });

  // the window: opens (spring), then breathes a little, then grows to fill the frame
  const op = TT < tOpen ? 0 : springEase(TT - tOpen, 140, 18);
  const g = EZ.io(seg(TT, tGrow, tFull));
  const r = lerp(296 * op + 20 * seg(TT, tOpen + 0.5, tGrow), 1500, g);
  const k = lerp(0.72 + 0.06 * seg(TT, tOpen, tGrow), 1, g);
  const Q = [KN_SCAB[0], lerp(KN_SCAB[1], KN_SLICE_P0[1], g)];
  const wc = [KN_WIN[0], lerp(KN_WIN[1], 860, g)];
  const epiL = lerp(432, 482, EZ.io(seg(TT, tMoc - 0.4, tMoc + 0.8)));
  const toS = (x, y) => [Q[0] + (x - KN_SLICE_P0[0]) * k, Q[1] + (y - KN_SLICE_P0[1]) * k];
  if (op > 0.001) {
    KN_window(wc, r, () => {
      ctx.save(); ctx.translate(Q[0], Q[1]); ctx.scale(k, k); ctx.translate(-KN_SLICE_P0[0], -KN_SLICE_P0[1]);
      skinSlice({ blood: 1, scab: 1, scabDry: 1, fill: 0.6, collagen: 0.6, epiL, partnerO: { look: -0.6 } });
      // the hero: waves hello from its slot, then settles (normal, no wave) before the bridge
      const wv = EZ.o2(seg(TT, tOpen + 0.3, tOpen + 0.8)) * (1 - EZ.io(seg(TT, 5.7, 6.25)));
      heroCell(290, 650, 60, { mood: TT < 6.1 ? 'happy' : 'calm', wave: wv, look: TT < 6.1 ? 0.4 * Math.sin(TT * 2) : 0 });
      ctx.restore();
    });
  }
  // "da mới" points at the new skin tongue under the scab (in the window)
  const dm = pop(tOpen + 0.55) * (1 - EZ.i2(seg(TT, 5.75, 5.95)));
  if (dm > 0.01) {
    const [tx, ty] = toS(364, 712), [lx, ly] = toS(470, 880);
    simpleArrow(lx - 40, ly - 50, tx + 14, ty + 30, { col: PAL.ink, w: 6, head: 20, key: 'kndma', al: clamp(dm) });
    tag('da mới', lx + 10, ly + 6, 54, { s: dm, rot: -0.03, fill: COL.skinL });
  }
  // the question tag above the knee, crossed out (red-brown ink) on "không phải"; gone as the window grows
  const qs = pop(tVay) * (1 - EZ.i2(seg(TT, 5.3, 5.55)));
  if (qs > 0.01) {
    const TX = 560, TY = 418;
    ctx.save(); ctx.translate(TX, TY); ctx.scale(qs, qs); ctx.translate(-TX, -TY);
    if (TT < tOpen + 0.2) simpleArrow(TX - 20, TY + 44, 545, 500, { col: PAL.ink, w: 6, head: 18, key: 'knqa' });
    tag('vảy = da mới?', TX, TY, 58, { rot: -0.03 });
    if (TT > tKhong) {
      const w = handW('vảy = da mới?', 58) + 52;
      ink([[TX - w / 2 - 4, TY - 38], [TX + w / 2 + 4, TY + 42]], { w: 11, color: COL.bloodD, amt: 0.5, key: 'knx1', frac: seg(TT, tKhong, tKhong + 0.25) });
      ink([[TX - w / 2 - 4, TY + 42], [TX + w / 2 + 4, TY - 40]], { w: 11, color: COL.bloodD, amt: 0.5, key: 'knx2', frac: seg(TT, tKhong + 0.2, tKhong + 0.45) });
    }
    ctx.restore();
  }
  viTag('1', TITLES.hook);
};

// ---------------------------------------------------------------------
//  MOIST (43.0–49.25) — "Giữ vết thương sạch và đủ ẩm, tế bào bò dễ hơn, nên thường lành nhanh hơn để khô."
// ---------------------------------------------------------------------
const KN_MINT = '#cfe9dc', KN_SAND = '#ecd9a8';
// a small skin cell in a card (a heroCell with its own key; the real hero is drawn last so it owns the anchor)
const KN_mini = (x, y, o) => heroCell(x, y, 28, { key: 'knmini' + o.key, ...o });
// the mini skin slice in a card at x offset ox: skin band, dermis, the notch
function KN_cardSlice(ox, key) {
  cut(rect(ox + 20, 880, 400, 200, 10), COL.dermis, { key: key + 'd', shadow: false, tear: 0.5, grain: false });
  cut(rect(ox + 20, 860, 112, 52, 14), COL.skin, { key: key + 'sl', sb: 4, sy: 2, grain: false });
  cut(rect(ox + 308, 860, 112, 52, 14), COL.skin, { key: key + 'sr', sb: 4, sy: 2, grain: false });
  const U = [[ox + 132, 862]]; for (let i = 0; i <= 10; i++) { const a = Math.PI - i / 10 * Math.PI; U.push([ox + 220 + Math.cos(a) * 88, 930 + Math.sin(a) * 70]); } U.push([ox + 308, 862]);
  cut(U, '#e7a99d', { key: key + 'u', shadow: false, tear: 0.4, grain: false });
}
function KN_cardIn(cx, fn) {
  ctx.save(); trace(rect(cx - 210, 622, 420, 520, 18), true); ctx.clip();
  ctx.translate(cx, 900); ctx.scale(1.25, 1.25); ctx.translate(-cx, -900); fn(); ctx.restore();
}
SCENES.moist = function () {
  const tAm = VW('moist', 'ẩm'), tBo = VW('moist', 'bò'), tDe = VW('moist', 'dễ'), tNen = VW('moist', 'nên'), tNhanh = VW('moist', 'nhanh');
  cut(rect(-40, -40, W + 80, H + 80, 0), KN_MINT, { key: 'knmw', shadow: false, tear: 0, grain: 0.3 });
  // the two cards
  cut(rect(70, 612, 440, 540, 20), KN_SAND, { key: 'kncl', sb: 10, sy: 6, grain: 0.3 });
  cut(rect(570, 612, 440, 540, 20), COL.waterL, { key: 'kncr', sb: 10, sy: 6, grain: 0.3 });
  vlabel('khô', 290, 688, E0 + 0.35, 62);
  vlabel('đủ ẩm', 790, 688, tAm - 0.2, 62);

  // LEFT: dry — a thick cracked crust, the cell creeps slowly down and under it (card content drawn 1.25x, clipped to the card)
  KN_cardIn(290, () => {
  KN_cardSlice(70, 'knsl');
  const pL = [[175, 884], [212, 930], [250, 968], [300, 978], [360, 968]];
  const uL = 0.08 * seg(TT, E0, tBo) + 0.42 * EZ.io(seg(TT, tBo, EE('moist'))) + 0.02 * Math.sin(TT * 5) * seg(TT, tBo, tBo + 0.5);
  const [lx, ly] = pointAt(resample(pL, false, 4), clamp(uL));
  KN_mini(lx, ly + 3 * Math.sin(TT * 7), { key: 'L', mood: TT > tBo ? 'focus' : 'calm', stretch: 0.5 + 0.3 * Math.sin(TT * 3), dir: 1 });
  // effort marks over the struggling cell (ink, not drops)
  if (TT > tBo) for (let i = 0; i < 2; i++) { const a = -2.2 + i * 0.6, d = 44 + 6 * Math.sin(TT * 8 + i); ink([[lx + Math.cos(a) * d, ly - 10 + Math.sin(a) * d], [lx + Math.cos(a) * (d + 18), ly - 10 + Math.sin(a) * (d + 18)]], { w: 4, color: PAL.ink, amt: 0.2, key: 'kneff' + i }); }
  // the crust: thick, bulging, cracked (drawn over the cell: the cell is under it)
  const crust = [[248, 826], [300, 812], [360, 818], [410, 834], [430, 868], [400, 920], [360, 946], [300, 952], [240, 946], [200, 922], [182, 878], [200, 840]].map(([x, y]) => [x, y + 1.5 * Math.sin(TT * 2 + x)]);
  cut(crust, COL.scab, { key: 'kncrust', tear: 2.6, sb: 8, sy: 5, grain: 0.5, crayon: COL.scabD, crAl: 0.35, crPer: 36 });
  ink([[260, 822], [278, 860], [262, 900]], { w: 5, color: COL.scabD, amt: 0.4, key: 'kncr1' });
  ink([[350, 818], [336, 862], [362, 905], [350, 940]], { w: 5, color: COL.scabD, amt: 0.4, key: 'kncr2' });
  });
  // RIGHT: moist — a moist bed under a plaster, water drops, the cell glides across fast
  KN_cardIn(790, () => {
  KN_cardSlice(570, 'knsr');
  const gel = []; for (let i = 0; i <= 10; i++) { const a = Math.PI - i / 10 * Math.PI; gel.push([790 + Math.cos(a) * 86, 932 + Math.sin(a) * 66]); }
  gel.unshift([700, 876]); gel.push([880, 876]);
  cut(gel, '#9cc6ea', { key: 'kngel', shadow: false, tear: 0.4, grain: false });
  // the moisture stays IN the bed under the dressing: drops pop on "ẩm" and wobble inside the gel
  for (let i = 0; i < 3; i++) {
    const s = pop(tAm + i * 0.12); if (s <= 0.01) continue;
    const x = [742, 792, 842][i], y = [918, 952, 918][i] + 3 * Math.sin(TT * 3 + i * 2);
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + 0.06 * Math.sin(TT * 6 + i)), s * (1 - 0.06 * Math.sin(TT * 6 + i))); waterDrop(0, 0, 18, { key: 'knwd' + i }); ctx.restore();
  }
  const uR = EZ.io(seg(TT, tBo, tNen - 0.1));
  const gx = lerp(662, 905, uR), gliding = uR > 0.02 && uR < 0.98;
  const hop = TT > tNen ? Math.abs(Math.sin((TT - tNen) * 5)) * 10 * (1 - seg(TT, tNen, tNen + 2)) : 0;
  KN_mini(gx + 6 * Math.sin(TT * 2.4) * (gliding ? 0 : 1), 852 - hop, { key: 'R', mood: TT > tBo ? 'happy' : 'calm', stretch: gliding ? 1 : 0, dir: 1 });
  // the plaster (over the cell's top: the cell glides under it)
  cut(rect(640, 796, 300, 40, 16), '#f0c9a4', { key: 'knpls', sb: 6, sy: 4, grain: 0.3 });
  cut(rect(730, 800, 120, 32, 8), PAL.paper, { key: 'knplsp', shadow: false, grain: false });
  });
  // under the cards: "chậm" + a snail (left), "nhanh hơn ✓" (right)
  const sn = pop(tDe, SPRING.smooth);
  if (sn > 0.01) {
    const sx = 140 + 14 * seg(TT, tDe, EE('moist')), sy = 1212;
    ctx.save(); ctx.translate(sx, sy); ctx.scale(sn, sn);
    cut(capsulePts(-34, 14, 40, 14, 22, 6), PAL.cream, { key: 'knsnb', sb: 3, sy: 2, grain: false });
    cut(ellipsePts(0, -6, 28, 26, 0, 20), PAL.grey, { key: 'knsns', sb: 4, sy: 2, grain: false });
    ink(arcPts(0, -6, 13, 0, TAU * 0.8, 14), { w: 4, color: PAL.ink, amt: 0.2, key: 'knsnsp' });
    ink([[34, 6], [44, -14 + 2 * Math.sin(TT * 4)]], { w: 3, color: PAL.ink, amt: 0.2, key: 'knsna' });
    ctx.restore();
  }
  vlabel('chậm', 290, 1232, tDe, 58, { col: COL.textD });
  const nh = tNen;
  vlabel('nhanh hơn', 760, 1232, nh, 58, { col: COL.text, weight: 700 });
  if (TT > nh + 0.2) ink([[886, 1206], [902, 1224], [930, 1186]], { w: 8, color: PAL.ink, amt: 0.3, key: 'kncheck', frac: seg(TT, nh + 0.2, nh + 0.45) });

  // the hero narrator: at [540, 470, 60] at both ends; in between drifts and looks at the cards
  const free = EZ.io(seg(TT, E0 + 0.5, E0 + 1.1)) * (1 - EZ.io(seg(TT, EE('moist') - 1.1, EE('moist') - 0.5)));
  const look = TT < tAm - 0.1 ? 0.6 * Math.sin(TT * 2.2) : TT < tBo ? 1 : TT < tDe + 0.2 ? -1 : TT < tNhanh + 0.6 ? 1 : 0;
  const hx = 540 + free * (look * 34 + 10 * Math.sin(TT * 1.7));
  heroCell(hx, 470, 60, { mood: TT > tNhanh - 0.1 && TT < EE('moist') - 0.6 ? 'happy' : TT > tAm - 0.1 && TT < tBo ? 'wow' : 'calm', look: look * free });
  viTag('8', TITLES.moist);
};

// ---------------------------------------------------------------------
//  END (54.75–61.5) — "Vậy đấy: vảy bong đi, để lộ làn da hồng do chính cơ thể bạn tự dệt nên."
// ---------------------------------------------------------------------
SCENES.end = function () {
  const tBong = VW('end', 'bong'), tLo = VW('end', 'lộ'), tHong = VW('end', 'hồng'), tTu = VW('end', 'tự');
  // later: the ball rests further left and rocks; the box is open
  KN_world({ later: true, ballX: 960 + 40 * Math.sin(TT * 0.7) });
  // the pink new skin patch under the scab (it pulses when "hồng")
  const ps = 1 + 0.07 * Math.sin(Math.PI * seg(TT, tHong, tHong + 0.6)) + 0.012 * Math.sin(TT * 2.5);
  cut(KN_scabPts(KN_PATCH[0], KN_PATCH[1], 1.08 * ps), COL.skinNew, { key: 'knnew', tear: 1.2, sb: 4, sy: 2, grain: 0.3 });
  const tPeel = tBong - 0.15, tDrop = tBong + 0.3;
  const peel = EZ.o2(seg(TT, tPeel, tDrop)), ft = Math.max(0, TT - tDrop);
  // the two cells live UNDER the scab: the hero (contract spot [540, 640]) and the partner, peeking out below its edge.
  // Once the scab is gone they hop for joy on the pink patch and wave.
  const hu = seg(TT, tDrop + 0.25, tDrop + 0.85), hop = 60 * Math.sin(Math.PI * hu);
  const pu = seg(TT, tDrop + 0.4, tDrop + 1.0), phop = 50 * Math.sin(Math.PI * pu);
  const wave = EZ.o2(seg(TT, tLo - 0.1, tLo + 0.4));
  const freed = TT > tDrop + 0.25;
  const look = TT < tPeel ? 0.5 * Math.sin(TT * 1.8) : 0;
  heroCell(668, 652 - phop, 48, { partner: true, mood: freed ? 'happy' : 'calm', wave: EZ.o2(seg(TT, tLo + 0.2, tLo + 0.7)), look: freed ? -0.5 : 0.3 * Math.sin(TT * 1.5 + 1) });
  const drawHero = () => heroCell(540, 640 - hop, 60, { mood: hu > 0 && hu < 1 ? 'wow' : freed ? 'happy' : 'calm', wave, look });
  drawHero();
  // the scab (over the cells): peels up at its left edge, lets go, falls DOWN (gravity) tumbling off frame
  if (ft < 1.3) {
    const piv = [KN_SCAB[0] + 125, KN_SCAB[1]];
    const th = 0.32 * peel + 2.0 * ft, dy = 0.5 * 2600 * ft * ft, dx = 70 * ft;
    const P = KN_scabPts(KN_SCAB[0], KN_SCAB[1], 1 + 0.015 * Math.sin(TT * 2.2) * (1 - peel)).map(([x, y]) => {
      const c = Math.cos(th), s = Math.sin(th), qx = x - piv[0], qy = y - piv[1];
      return [piv[0] + qx * c - qy * s + dx, piv[1] + qx * s + qy * c + dy];
    });
    cut(P, COL.scab, { key: 'knscab', tear: 2.2, sb: 8 + 10 * peel, sy: 5 + 10 * peel, grain: 0.5, crayon: COL.scabD, crAl: 0.3, crPer: 40 });
    if (TT < tDrop + 0.25) SPARK_AT = toScreen(540, 640);
  }
  // a soft sparkle on the new skin when it shows (the one effect)
  const sp = seg(TT, tHong - 0.1, tHong + 1.1);
  if (sp > 0 && sp < 1) for (let i = 0; i < 3; i++) { const a = -2.6 + i * 1.1, d = 150 + 40 * sp, s = 26 * Math.sin(Math.PI * sp); sparkle(KN_PATCH[0] + Math.cos(a) * d * 1.1, KN_PATCH[1] + Math.sin(a) * d * 0.6, s, '#fff4c8'); }
  // "da mới ✓" with an arrow INTO the pink patch
  const dm = pop(tTu);
  if (dm > 0.01) {
    simpleArrow(770, 500, 690, 572, { col: PAL.ink, w: 6, head: 20, key: 'knenda', part: seg(TT, tTu, tTu + 0.3) });
    tag('da mới    ', 800, 450, 56, { s: dm, rot: -0.04, fill: COL.skinL });
    if (TT > tTu + 0.25) ink([[860, 442], [876, 462], [906, 422]], { w: 8, color: PAL.ink, amt: 0.3, key: 'knendck', frac: seg(TT, tTu + 0.25, tTu + 0.5) });
  }
  viTag('10', TITLES.end);
};
