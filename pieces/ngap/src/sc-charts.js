// =====================================================================
//  sc-charts.js — the two "study" charts (owned by the sc-charts agent). Prefix CH_.
//  season (06): Arizona — winter card (blue, 22°C) vs summer card (sand, sun, 37°C); 8 small faces each;
//               4/8 winter faces yawn on "nửa" + "45%" (blue bar), 2/8 summer faces yawn on "hè" + "24%" (orange bar).
//  social (09): who catches it — người thân (mom) > bạn bè (Lan) > người lạ (stranger): bars grow on "mạnh" (no
//               numbers: an order, not values), each person yawns as its bar grows; on "trẻ" a kid + "từ ~4 tuổi".
//  The hero stays exactly at its BR spot the whole era (only `look` changes), cool (pink).
// =====================================================================

// a small round face (r ≥ 26): skin disc, hair cap, blinking eyes, smile or a held yawn; breathes gently
function CH_face(x, y, r, i, yw, o = {}) {
  const skins = [PAL.skin1, PAL.skin2, PAL.skin3], hairs = ['#2b211d', '#3a2420', '#1e1714', '#4a3028'];
  const br = 1 + 0.025 * Math.sin(TT * TAU * 0.45 + i * 1.7);
  const rr = r * br, key = (o.key ?? 'chf') + i;
  y += -yw * r * 0.06;
  cut(ellipsePts(x, y, rr, rr * 1.04, 0, 22), skins[i % 3], { key: key + 's', sb: 5, sy: 3, tear: 0.5, grain: false });
  const H = arcPts(x, y, rr * 1.03, Math.PI * 1.0, Math.PI * 2.0, 14);
  H.push([x + rr * 0.9, y - rr * 0.45], [x + rr * 0.2, y - rr * 0.62], [x - rr * 0.7, y - rr * 0.5]);
  cut(H, hairs[(i * 3 + 1) % 4], { key: key + 'h', shadow: false, tear: 0.5, grain: false });
  const I = PAL.ink, ey = y - rr * 0.02, s = rr / 34;
  const blink = mod(TT * 0.9 + i * 0.77, 3.4) < 0.11;
  for (const ex of [-0.36, 0.36]) {
    const cx = x + ex * rr;
    if (yw > 0.4) ink(arcPts(cx, ey + 3 * s, 6 * s, Math.PI * 1.15, Math.PI * 1.85, 6), { w: 3.4 * s, color: I, amt: 0.2, key: key + 'ec' + ex });
    else if (blink) ink([[cx - 6 * s, ey], [cx + 6 * s, ey]], { w: 3.4 * s, color: I, amt: 0.2, key: key + 'eb' + ex });
    else dot(cx, ey, 4.6 * s, I);
  }
  const my = y + rr * 0.42;
  if (yw > 0.05) {
    ctx.fillStyle = COL.mouth; ctx.beginPath(); ctx.ellipse(x, my + 2 * s * yw, lerp(4, 10, yw) * s, lerp(3, 14, yw) * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = COL.tongue; ctx.beginPath(); ctx.ellipse(x, my + lerp(2, 9, yw) * s, lerp(2, 6, yw) * s, lerp(1, 3.5, yw) * s, 0, 0, TAU); ctx.fill();
  } else ink(arcPts(x, my - 8 * s, 8 * s, Math.PI * 0.25, Math.PI * 0.75, 6), { w: 3 * s, color: I, amt: 0.2, key: key + 'm' });
}
// a yawn that opens slowly and stays (gently "breathing") open — so the count stays readable
const CH_held = (t0, i) => { const k = EZ.io(seg(TT, t0, t0 + 0.9)); return k * (0.82 + 0.18 * Math.sin((TT - t0) * 2.2 + i)); };
// a big number popping (scale spring)
function CH_num(str, x, y, t0, size, col) {
  const s = pop(t0); if (s <= 0.01) return;
  ctx.save(); ctx.translate(x, y - size * 0.35); ctx.scale(s, s); ctx.translate(-x, -(y - size * 0.35));
  vtext(str, x, y, size, { col, al: clamp(s * 1.6) });
  ctx.restore();
}
// a horizontal paper bar: pale track (0..50%) + filled part growing from t0
function CH_pctBar(x, y, w, frac, t0, col, key) {
  cut(rect(x, y, w, 34, 6), 'rgba(255,255,255,0.55)', { key: key + 'tr', shadow: false, tear: 0.5, grain: false, shade: false });
  const g = clamp(springEase(TT - t0, 120, 18), 0, 1.05);
  if (g > 0.01) cut(rect(x, y, w * frac * g, 34, 6), col, { key: key + 'b', sb: 5, sy: 3, tear: 0.6 });
}
function CH_card(x, y, w, h, fill, key) { cut(rect(x, y, w, h, 10), fill, { key, sb: 14, sy: 8, tear: 1.1 }); }

// ---------------------------------------------------------------------
//  SEASON 29.0–35.5 — "Ở Arizona, mùa đông gần một nửa số người ngáp lây, mùa hè chưa tới một phần tư."
// ---------------------------------------------------------------------
SCENES.season = function () {
  const tA = VW('season', 'arizona'), tW = VW('season', 'đông'), tN = VW('season', 'nửa');
  const tS = VW('season', 'hè'), tS2 = VW('season', 'chưa');
  // NOTE: 'tư' falls 0.66 s before the outgoing bridge — the summer yawns + "24%" land on "hè" so they stay ≥ 2 s.
  room('#efe5cf', 2000, '#efe5cf', 'chs');
  // ---- LEFT: winter
  const L = { x: 60, w: 455 }, R = { x: 545, w: 455 }, cy0 = 600, ch = 625;
  const Lc = L.x + L.w / 2, Rc = R.x + R.w / 2;
  CH_card(L.x, cy0, L.w, ch, COL.coolL, 'chcw');
  CH_card(R.x, cy0, R.w, ch, '#f4e3b5', 'chcs');
  vtext('mùa đông', Lc, 678, 54, { col: COL.coolD });
  vtext('mùa hè', Rc, 678, 54, { col: '#8a6a2a' });
  // bare winter tree (sways a hair)
  const sw = Math.sin(TT * 1.3) * 3, tx = L.x + 95, tb = 905;
  ink([[tx, tb], [tx + 2, tb - 70], [tx - 1 + sw * 0.3, tb - 150]], { w: 12, color: PAL.woodD, amt: 0.3, key: 'chtr0' });
  ink([[tx + 1, tb - 80], [tx + 40 + sw, tb - 130], [tx + 58 + sw, tb - 165]], { w: 7, color: PAL.woodD, amt: 0.3, key: 'chtr1' });
  ink([[tx, tb - 100], [tx - 38 + sw, tb - 145], [tx - 50 + sw, tb - 178]], { w: 7, color: PAL.woodD, amt: 0.3, key: 'chtr2' });
  ink([[tx - 1 + sw * 0.3, tb - 150], [tx + 14 + sw, tb - 190]], { w: 5, color: PAL.woodD, amt: 0.3, key: 'chtr3' });
  ink([[tx + 40 + sw, tb - 130], [tx + 72 + sw, tb - 128]], { w: 5, color: PAL.woodD, amt: 0.3, key: 'chtr4' });
  ink([[L.x + 30, tb + 2], [L.x + 200, tb - 4]], { w: 6, color: COL.coolD, amt: 0.3, key: 'chgr' });
  thermo(L.x + 245, 880, 150, 0.32, { col: COL.cool, key: 'chtw' });
  vtext('22°C', L.x + 360, 845, 60, { col: COL.coolD });
  // summer sun (rays turn slowly)
  const sx = R.x + 95, sy = 790, rot = TT * 0.35;
  for (let k = 0; k < 8; k++) {
    const a = rot + k * TAU / 8;
    ink([[sx + Math.cos(a) * 62, sy + Math.sin(a) * 62], [sx + Math.cos(a) * 84, sy + Math.sin(a) * 84]], { w: 8, color: '#e2ac2c', amt: 0.3, key: 'chsr' + k });
  }
  cut(ellipsePts(sx, sy, 50, 50, 0, 24), PAL.yellow, { key: 'chsun', sb: 6, sy: 4 });
  thermo(R.x + 245, 880, 150, 0.86, { col: COL.heat, key: 'chts' });
  vtext('37°C', R.x + 355, 845, 60, { col: COL.heatD });
  // faces: 2 rows × 4
  const winterY = [0, 2, 5, 7], summerY = [1, 6];
  for (let i = 0; i < 8; i++) {
    const col = i % 4, row = (i / 4) | 0, fx = col * 102 - 153, fy = 965 + row * 90;
    const wi = winterY.indexOf(i), si = summerY.indexOf(i);
    CH_face(Lc + fx, fy, 34, i, wi >= 0 ? CH_held(tN + 0.1 * wi, i) : 0, { key: 'chfw' });
    CH_face(Rc + fx, fy, 34, i + 3, si >= 0 ? CH_held(tS + 0.15 + 0.1 * si, i) : 0, { key: 'chfs' });
  }
  // the numbers + bars (bar length ∝ %, track = 50%)
  CH_num('45%', L.x + 92, 1180, tN + 0.25, 72, COL.coolD);
  CH_pctBar(L.x + 175, 1145, 255, 0.45 / 0.5, tN + 0.3, COL.cool, 'chbw');
  CH_num('24%', R.x + 92, 1180, tS + 0.4, 72, COL.heatD);
  CH_pctBar(R.x + 175, 1145, 255, 0.24 / 0.5, tS + 0.45, COL.heat, 'chbs');
  // tag Arizona (top right, below the scene tag line)
  ptag('Arizona', 800, 430, tA, 54, { rot: 0.04 });
  // the hero: exact spot all era, looks at winter then at summer
  const look = springTrack([[0, 0], [tW - 0.1, -1], [tS - 0.15, 1], [EE('season') - 1.0, 0]], SPRING.smooth);
  heroBrain(540, 500, 80, { warm: heroWarmAt(TT), mood: 'calm', look, key: 'hero' });
  viTag('06', TITLES.season);
  viCaption(['trời mát hơn', 'ngáp lây nhiều hơn'], [1, 'nhiều hơn'], { col: COL.coolL });
};

// ---------------------------------------------------------------------
//  SOCIAL 47.25–53.0 — "Ngáp lây mạnh nhất giữa người thân, và trẻ thường chỉ bị lây từ khoảng bốn tuổi."
// ---------------------------------------------------------------------
// a round portrait: a bust clipped into a circle (head + shoulders)
function CH_avatar(x, y, R, who, yw, bg, key, sc = 0.44) {
  cut(ellipsePts(x, y, R + 6, R + 6, 0, 26), '#fbf6ea', { key: key + 'rim', sb: 6, sy: 4, tear: 0.5, grain: false });
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.clip();
  ctx.fillStyle = bg; ctx.fillRect(x - R, y - R, 2 * R, 2 * R);
  bust(x, y + 118 * sc - 2, sc, { who, yawn: yw, key });
  ctx.restore();
}
SCENES.social = function () {
  const tM = VW('social', 'mạnh'), tK = VW('social', 'trẻ');
  room('#cfe3c4', 2000, '#cfe3c4', 'chso');
  CH_card(70, 595, 940, 640, '#fbf6ea', 'chsc');
  const rows = [
    { who: 'mom', lab: 'người thân', len: 600, amp: 1.0 },
    { who: 'lan', lab: 'bạn bè', len: 390, amp: 0.7 },
    { who: 'stranger', lab: 'người lạ', len: 180, amp: 0.38 },
  ];
  rows.forEach((r, i) => {
    const yc = 680 + i * 152, t0 = tM + 0.1 + i * 0.3;
    const yw = yawnCurve(TT, t0 + 0.15, 2.6 - i * 0.3) * r.amp;
    CH_avatar(165, yc, 62, r.who, yw, '#e6efdc', 'chav' + r.who);
    vtext(r.lab, 270, yc - 12, 54, { align: 'left' });
    cut(rect(270, yc + 18, 620, 40, 6), '#ece4d0', { key: 'chtrk' + i, shadow: false, tear: 0.5, grain: false, shade: false });
    const g = clamp(springEase(TT - t0, 90, 17), 0, 1.04);
    if (g > 0.01) cut(rect(270, yc + 18, r.len * g, 40, 6), PAL.greenD, { key: 'chbar' + i, sb: 5, sy: 3, tear: 0.6 });
  });
  // the kid (lower right of the card) + "từ ~4 tuổi"
  const kp = pop(tK);
  if (kp > 0.01) {
    const kx = 868, ky = 1155;
    ctx.save(); ctx.translate(kx, ky); ctx.scale(kp, kp); ctx.translate(-kx, -ky);
    const kyw = yawnCurve(TT, tK + 1.0, 2.2) * 0.75;
    CH_avatar(kx, ky, 60, 'kid', kyw, '#e6efdc', 'chavkid', 0.4);
    ctx.restore();
    ptag('từ ~4 tuổi', 630, 1158, tK + 0.15, 52, { rot: -0.03 });
  }
  // hero: exact spot all era; glances at the kid when he arrives
  const look = springTrack([[0, 0], [tM, -0.6], [tK, 1], [EE('social') - 1.0, 0]], SPRING.smooth);
  heroBrain(540, 480, 70, { warm: heroWarmAt(TT), mood: 'calm', look, key: 'hero' });
  viTag('09', TITLES.social);
  viCaption(['người thân', 'lây mạnh nhất'], [0, 'người thân'], { col: '#d7e9c8' });
};
