// =====================================================================
//  sc-heal.js — the healing scenes (owned by the sc-heal agent; prefix HL_).
//  fill  (25.5–30.75)   redness fades; 2 teal fibroblasts weave collagen as new tissue rises from the bottom;
//                       capillaries sprout up from the vessel stubs; "cô-la-gen", "mạch máu mới". Hero [290,650,60].
//  crawl (30.75–37.25)  the hero + partner hop on "tế bào da"; on "bò" they leave their slots, slide down under the
//                       scab rim to y 712 and inch toward each other along the top of the new tissue (new skin
//                       trailing); "luồn dưới vảy". Silence 36.5–37.25: still inching.
//  meet  (37.25–43.0)   SLAM, complete on its first frame: hero [500,712] touching partner [580,712], happy, a soft
//                       sparkle, "liền rồi!". On "liền lại" a hug; on "đẩy" the scab (with its dried clot) is pushed
//                       up and flicked off, gone by 42.4: new skin underneath. Hero exact at [500,712,50] at the end.
//  scar  (49.25–54.75)  healed slice; scar fibres messy -> straight on "sửa cả năm" + a calendar flipping 12 months,
//                       "≈ 1 năm"; strength bars "da cũ 100%" vs "sẹo ~80%" (exactly 4/5, teal).
// =====================================================================

// ---- the fibroblasts: two teal spindle cells riding just under the front of the new tissue, weaving side to side
function HL_fibros(fl, k1, k2, speed = 1) {
  const front = lerp(SK.bot + 10, SK.fillTop, fl);
  const F = [
    { k: k1, y: clamp(front + 64, 850, 995), ph: 0, key: 'hlfbA' },
    { k: k2, y: clamp(front + 150, 945, 1000), ph: 2.4, key: 'hlfbB' },
  ];
  ctx.save(); trace(skCutPts(0), true); ctx.clip();
  for (const f of F) {
    if (f.k <= 0.02) continue;
    const r = 40 * Math.min(1, f.k), [a, b] = skCutX(f.y), amp = Math.max(8, (b - a) / 2 - r * 1.45);
    const s = Math.sin(TT * 1.7 * speed + f.ph), x = (a + b) / 2 + amp * s;
    fibroblast(x, f.y + (1 - Math.min(1, f.k)) * 40, r, { key: f.key, a: 0.1 * Math.cos(TT * 1.7 * speed + f.ph) });
  }
  ctx.restore();
}

// ---------------------------------------------------------------------
//  FILL (25.5–30.75) — "Nguyên bào sợi dệt cô la gen, mạch máu mới mọc vào, lấp đầy chỗ trống."
// ---------------------------------------------------------------------
SCENES.fill = function () {
  const E = ET('fill'), tDet = VW('fill', 'dệt'), tCo = VW('fill', 'cô'), tMach = VW('fill', 'mạch'), tLap = VW('fill', 'lấp');
  const fl = 0.7 * EZ.io(seg(TT, E + 0.2, tLap)) + 0.3 * EZ.io(seg(TT, tLap, tLap + 0.9));
  const cg = EZ.io(seg(TT, tDet, tLap + 0.7));
  const cp = EZ.io(seg(TT, tMach, tMach + 1.5));
  const red = 1 - EZ.io(seg(TT, E, E + 1.1));
  skinSlice({ blood: 1, scab: 1, scabDry: 1, redness: red, fill: fl, collagen: cg, capil: cp, partnerO: { look: -0.7, mood: TT > tLap + 0.4 ? 'happy' : 'calm' } });
  HL_fibros(fl, pop(E + 0.15), pop(tDet - 0.1));
  // labels: collagen (teal) on "cô", new vessels (red) on "mạch"
  ptag('cô-la-gen', 800, 930, tCo, 52, { color: COL.colD, rot: 0.03 });
  simpleArrow(668, 955, 606, 985, { part: seg(TT, tCo + 0.1, tCo + 0.4), col: COL.colD, w: 6, head: 20, key: 'hlarc' });
  ptag('mạch máu mới', 235, 880, tMach, 52, { color: COL.bloodD, rot: -0.03 });
  simpleArrow(330, 912, 468, 955, { part: seg(TT, tMach + 0.1, tMach + 0.4), col: COL.bloodD, w: 6, head: 20, key: 'hlarm' });
  // the hero watches the hole fill: wow at the weavers, happy when it is full
  const mood = TT > tLap + 0.4 ? 'happy' : TT > E + 0.4 ? 'wow' : 'calm';
  heroCell(290, 650, 60, { mood, look: 0.5 + 0.35 * Math.sin(TT * 1.7) });
  viTag('5', TITLES.fill);
};

// ---------------------------------------------------------------------
//  CRAWL (30.75–37.25) — "Trong lúc đó, tế bào da ở hai mép bò dần vào giữa, luồn ngay dưới lớp vảy..."
// ---------------------------------------------------------------------
// the hero's crawl: [x, y, r, stretch] at time t (the partner mirrors it about x = 540)
function HL_crawlPos(t) {
  const tBo = VW('crawl', 'bò'), SIL = snap8(VL('crawl').t1);
  const p1 = seg(t, tBo, tBo + 0.9);                        // down-right under the scab rim
  const x1 = lerp(290, 385, EZ.io(p1)), y1 = lerp(650, SK.epiY, EZ.o2(p1));
  const p2 = EZ.io(seg(t, tBo + 0.9, SIL));                  // then right along the top of the new tissue
  const inch = 16 * seg(t, SIL, SLAM);                       // the silence: still inching closer
  const x = x1 + 70 * p2 + inch + 4 * Math.sin(t * TAU * 1.0) * seg(t, tBo + 0.9, tBo + 1.4);
  const st = EZ.io(p1) * (0.85 + 0.15 * Math.sin(t * TAU * 1.0));
  return [x, y1, lerp(60, 50, EZ.io(p1)), st];
}
SCENES.crawl = function () {
  const tTe = VW('crawl', 'tế'), tBo = VW('crawl', 'bò'), tLuon = VW('crawl', 'luồn');
  const [hx, hy, hr, st] = HL_crawlPos(TT), moved = TT >= tBo;
  const px = 1080 - hx;
  // a little hop on "tế bào da" (both edge cells), before they set off
  const hop = TT > tTe && TT < tBo ? -16 * Math.abs(Math.sin((TT - tTe) * Math.PI * 2.2)) * (1 - seg(TT, tBo - 0.4, tBo)) : 0;
  const mood = moved ? 'focus' : TT > tTe ? 'wow' : 'calm';
  skinSlice({
    blood: 1, scab: 1, scabDry: 1, fill: 1, collagen: 1, capil: 1,
    heroX: moved ? null : undefined,
    epiL: moved && hx > SK.cutL ? hx : null, epiR: moved && px < SK.cutR ? px : null,
    partner: [px, hy + hop, hr], partnerO: { stretch: st, dir: -1, mood, look: moved ? 0 : -0.6 },
  });
  HL_fibros(1, 1, 1, 0.6);
  // the edge cells light up on "tế bào da": a soft white ring around each
  const ring = seg(TT, tTe, tTe + 0.3) * (1 - seg(TT, tBo + 0.6, tBo + 1.2));
  if (ring > 0.01) for (const [cx, cy] of [[hx, hy + hop], [px, hy + hop]]) {
    ctx.save(); ctx.globalAlpha = 0.75 * ring; ctx.strokeStyle = '#fffaf0'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.ellipse(cx, cy, 92 + 5 * Math.sin(TT * 8), 76 + 4 * Math.sin(TT * 8), 0, 0, TAU); ctx.stroke(); ctx.restore();
  }
  // small arrows ahead of each cell, pointing to the middle (under the scab)
  const aa = seg(TT, tBo + 0.2, tBo + 0.5) * (1 - seg(TT, 35.0, 35.4));
  if (aa > 0.01) {
    simpleArrow(hx + 76, SK.epiY + 4, hx + 126, SK.epiY + 4, { col: '#fff3e6', w: 7, head: 18, al: aa, key: 'hlcaL' });
    simpleArrow(px - 76, SK.epiY + 4, px - 126, SK.epiY + 4, { col: '#fff3e6', w: 7, head: 18, al: aa, key: 'hlcaR' });
  }
  ptag('luồn dưới vảy', 540, 470, tLuon, 58, { rot: -0.03 });
  heroCell(hx, hy + hop, hr, { stretch: st, dir: 1, mood, look: moved ? 0 : 0.6 });
  viTag('6', TITLES.crawl);
};

// ---------------------------------------------------------------------
//  MEET (37.25–43.0, SLAM) — "Rồi chúng gặp nhau: da mới liền lại, đẩy vảy bong ra."  Complete on its first frame.
// ---------------------------------------------------------------------
// the lid: the scab with its dried clot underneath (the same torn shape as the slice's scab), moved/rotated
function HL_lid(dx, dy, rot) {
  ctx.save(); ctx.translate(540 + dx, SK.top + dy); ctx.rotate(rot); ctx.translate(-540, -SK.top);
  const U = [];
  for (let y = SK.top + 2; y <= 700; y += 14) U.push([skCutX(y)[0] - 2, y]);
  U.push([460, 704], [540, 698], [620, 704]);
  for (let y = 700; y >= SK.top + 2; y -= 14) U.push([skCutX(y)[1] + 2, y]);
  cut(U, COL.blood, { key: 'hlunder', tear: 0.8, sb: 4, sy: 2, grain: false });
  const S = [[SK.cutL - 26, SK.top + 4], [SK.cutL - 6, SK.top - 30], [470, SK.top - 44], [540, SK.top - 40], [610, SK.top - 46], [SK.cutR + 8, SK.top - 28], [SK.cutR + 26, SK.top + 6], [SK.cutR - 20, SK.top + 40], [610, SK.top + 50], [540, SK.top + 46], [470, SK.top + 52], [SK.cutL + 20, SK.top + 40]];
  cut(S, COL.scab, { key: 'skscab', tear: 2.2, sb: 8, sy: 5, grain: 0.5, crayon: COL.scabD, crAl: 0.3, crPer: 40 });
  ctx.restore();
}
SCENES.meet = function () {
  const tLien = VW('meet', 'liền'), tDay = VW('meet', 'đẩy');
  // the slice without its scab: blood only up to just under the new-skin row, the notch above it is open air
  skinSlice({ blood: 0.776, fill: 1, collagen: 1, capil: 1, heroX: null, partner: null });
  ctx.save(); trace(skCutPts(0), true); ctx.clip(); cut(rect(300, SK.top - 30, 480, 736 - SK.top, 0), COL.sky, { key: 'hlair', shadow: false, tear: 0, grain: 0.3 }); ctx.restore();
  // the lid: pushed up on "đẩy", then flicked off up-right (gone by ~42.4)
  const up = EZ.io(seg(TT, tDay, tDay + 0.7)), fly = EZ.i2(seg(TT, tDay + 0.7, 42.4));
  if (fly < 0.999) HL_lid(780 * fly, -46 * up - 760 * fly, 0.05 * up + 0.55 * fly);
  // the new skin row: trailing cells + the two edge cells, touching; a hug on "liền lại"
  const hug = 7 * Math.sin(Math.PI * seg(TT, tLien, tLien + 0.8));
  const hop = TT < tLien - 0.2 ? -9 * Math.abs(Math.sin((TT - SLAM) * Math.PI * 2)) : 0;
  const push = -10 * Math.sin(Math.PI * seg(TT, tDay, tDay + 0.9));   // the row nudges up as it pushes the scab
  for (const x of [364, 426]) skinCell(x, SK.epiY + push * 0.6, 32, { key: 'hlnL' + x, c: COL.skinNew });
  for (const x of [716, 654]) skinCell(x, SK.epiY + push * 0.6, 32, { key: 'hlnR' + x, c: COL.skinNew });
  heroCell(580 - hug, SK.epiY + hop + push, 50, { partner: true, mood: 'happy' });
  heroCell(500 + hug, SK.epiY + hop + push, 50, { mood: 'happy' });
  // one soft sparkle effect at the junction (3 twinkles)
  [[540, 652, 30, 0], [508, 782, 22, 2.1], [574, 790, 24, 4.2]].forEach(([x, y, s, ph]) => {
    const k = 0.7 + 0.3 * Math.sin(TT * 5 + ph); sparkle(x, y + push, s * k, '#fff4c8');
  });
  // the big tag in the sky, there from the first frame; a bounce on "liền"
  const bump = Math.sin(Math.PI * seg(TT, tLien, tLien + 0.5)) * 0.12;
  tag('liền rồi!', 540, 455, 88, { rot: -0.04 + 0.025 * Math.sin(TT * 2.2), s: 1 + bump });
  viTagNow('7', TITLES.meet);
};

// ---------------------------------------------------------------------
//  SCAR (49.25–54.75) — "Bên dưới còn được sửa cả năm, nhưng sẹo chỉ bền chừng tám mươi phần trăm da cũ."
// ---------------------------------------------------------------------
// a scar fibre: messy (wavy + tilted) -> straight with st 0..1, drawn in to fraction k
function HL_fibre(i, k, st) {
  if (k <= 0.01) return;
  const y = 790 + i * 50, [a, b] = skCutX(y), x0 = a - 34, x1 = b + 34, R = RNG('hlsc', i);
  const tilt = R.n(26) * (1 - st), A = 20 * (1 - st), ph = i * 1.7 + TT * 1.2 * (1 - st), P = [];
  for (let j = 0; j <= 14; j++) {
    const u = j / 14, x = lerp(x0, x1, u);
    P.push([x, y + tilt * (u - 0.5) * 2 + A * (Math.sin(u * 9 + ph) + 0.5 * Math.sin(u * 17 + ph * 1.3))]);
  }
  collagen(P, k, { key: 'hlsc' + i, w: 9, c: COL.col });
}
// a wall calendar page flipping through the months (m 1..12), at (x, y)
function HL_calendar(x, y, s, m) {
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.04);
  cut(rect(-100, -110, 200, 220, 8), PAL.paper, { key: 'hlcal', tear: 1.2, sb: 8, sy: 4 });
  cut(rect(-100, -110, 200, 64, 8), PAL.charcoal, { key: 'hlcalt', tear: 0.6, sb: 3, sy: 2, grain: false });
  for (const rx of [-50, 50]) cut(rect(rx - 7, -126, 14, 34, 6), PAL.grey, { key: 'hlcalr' + rx, sb: 2, sy: 1, grain: false });
  vtext('tháng', 0, -60, 50, { col: PAL.paper });
  const n = Math.min(12, Math.floor(m)), fr = m < 12 ? m - Math.floor(m) : 0;
  ctx.save(); ctx.translate(0, 40); ctx.scale(1, 1 - 0.85 * Math.sin(Math.PI * Math.min(1, fr * 2.5)) * (fr < 0.4 ? 1 : 0));
  vtext(String(Math.max(1, n)), 0, 34, 96, { col: COL.text });
  ctx.restore();
  ctx.restore();
}
SCENES.scar = function () {
  const E = ET('scar'), tSua = VW('scar', 'sửa'), tNam = VW('scar', 'năm'), tSeo = VW('scar', 'sẹo'), tTam = VW('scar', 'tám');
  skinSlice({ closed: 1, scar: 0, heroX: 490, partner: null });
  // scar fibres: messy at first, straightened on "sửa cả năm"
  const st = EZ.io(seg(TT, tSua, tSua + 1.7));
  for (let i = 0; i < 5; i++) HL_fibre(i, EZ.io(seg(TT, E + 0.1 + i * 0.1, E + 0.8 + i * 0.1)), st);
  // the calendar flips through 12 months, then "≈ 1 năm"
  const m = 1 + 11 * seg(TT, tNam, tNam + 1.3);
  HL_calendar(188, 868, pop(tSua - 0.1), m);
  ptag('≈ 1 năm', 192, 1092, tNam + 1.35, 56, { rot: 0.03 });
  // strength bars in the sky: old skin 100% (peach) vs scar ~80% (teal, exactly 4/5)
  const BX = 250, BL = 500, BH = 56, y1 = 452, y2 = 548;
  const g1 = EZ.io(seg(TT, tSeo, tSeo + 0.5)), g2 = EZ.io(seg(TT, tSeo + 0.2, tSeo + 0.9)) * 0.8;
  if (TT > tSeo) {
    vlabel('da cũ', 92, y1 + 18, tSeo, 54, { align: 'left' });
    vlabel('sẹo', 92, y2 + 18, tSeo + 0.2, 54, { align: 'left' });
    ctx.save(); ctx.strokeStyle = 'rgba(42,29,24,0.45)'; ctx.lineWidth = 3; trace(rect(BX, y2 - BH / 2, BL, BH, 6), true); ctx.stroke(); ctx.restore();
    if (g1 > 0.01) cut(rect(BX, y1 - BH / 2, BL * g1, BH, 6), COL.skin, { key: 'hlbar1', tear: 0.5, sb: 5, sy: 3, grain: 0.3 });
    if (g2 > 0.01) cut(rect(BX, y2 - BH / 2, BL * g2, BH, 6), COL.col, { key: 'hlbar2', tear: 0.5, sb: 5, sy: 3, grain: 0.3 });
    vlabel('100%', BX + BL - 16, y1 + 18, tSeo + 0.4, 52, { align: 'right' });
    const bob = TT > tTam ? 4 * Math.sin((TT - tTam) * TAU * 0.9) : 0;
    vlabel('~80%', BX + BL + 18, y2 + 18 + bob, tSeo + 0.8, 54, { align: 'left', col: COL.colD });
  }
  const mood = TT > tTam && TT < tTam + 1.4 ? 'wow' : TT > tSua && TT < tSua + 1.7 ? 'focus' : 'calm';
  heroCell(490, 650, 60, { mood, look: TT > tSeo ? -0.4 * Math.sin(TT * 1.3) : 0.3 * Math.sin(TT * 1.5) });
  viTag('9', TITLES.scar);
};
