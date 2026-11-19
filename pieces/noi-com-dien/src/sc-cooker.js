// =====================================================================
//  SC-COOKER — hook, warm, end: the rice cooker seen from OUTSIDE (the same drawing in all three).
//  hook: cooking (knob DOWN, "nấu" lamp lit, steam wisps). warm/end: knob UP, "giữ ấm" lamp lit, the hero = steam.
//  Clean frames: one cooker on a plinth, white ground; one moving thing tied to each word.
// =====================================================================

// ---- a local variant of props' cookerIso: a smaller plinth (the shared one runs off both frame edges), separate
// drop-in lifts for the plinth and the body, bigger lamps, a breathing halo ring on a lit lamp, and canvas (world)
// coordinates returned (so labels drawn under the camera line up).
// o: { cook, warm, knobUp, steam (0..1 vent wisps), liftP, liftB (px, drop-in), halo: 'cook' | 'warm' }
function ck_cooker(o = {}) {
  const keep = ISO, R = 190, Hb = 250, lz = Hb - 8;
  setIso({ ...COOKER, oy: COOKER.oy - (o.liftP ?? 0) });
  isoPlates(-225, -225, -40, 450, 450, [{ h: 14, r: 44 }, { h: 12, gap: 6, inset: 14, r: 38 }]);
  setIso({ ...COOKER, oy: COOKER.oy - (o.liftB ?? 0) });
  isoCyl(0, 0, -8, R, Hb);
  facePath(faceOf([0, 0, Hb - 30], [1, 0, 0], [0, 1, 0]), ellipsePts(0, 0, R, R, 0, 40).filter(([u, v]) => u + v > -20), false); hair(PAL.inner); ctx.stroke();
  isoCyl(0, 0, lz, R - 6, 20);
  const D = []; for (let i = 0; i <= 24; i++) { const a = Math.PI * (i / 24); D.push(isoP([Math.cos(a) * (R - 6) * 0.7071, -Math.cos(a) * (R - 6) * 0.7071, lz + 20 + Math.sin(a) * 70])); }
  polyPath(D, false); hair(PAL.edge); ctx.stroke();
  isoBox(-40, -12, lz + 82, 80, 24, 16, { r: 10 });
  const vent = isoP([60, -90, lz + 64]);
  ctx.beginPath(); ctx.ellipse(vent[0], vent[1], 16, 8, 0, 0, TAU); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge); ctx.stroke();
  const st = clamp(o.steam ?? 0);
  if (st > 0.01) for (let i = 0; i < 2; i++) {
    // two soft wisps rising UP out of the vent, each re-growing on its own slow cycle
    const cyc = mod(TT * 0.55 + i * 0.5, 1), len = 150 * st * (0.55 + 0.45 * Math.sin(cyc * Math.PI));
    const P = []; for (let k = 0; k <= 16; k++) { const q = k / 16; P.push([vent[0] - 9 + i * 18 + Math.sin(q * 5 - TT * 3.2 + i * 2) * 12 * q, vent[1] - 12 - q * len]); }
    ctx.save(); ctx.globalAlpha = st * 0.9; polyPath(P, false); hair(COL.waterM, 5); ctx.stroke(); ctx.restore();
  }
  // the front control panel (faces the viewer)
  const c0 = [R * 0.7071, R * 0.7071, 0];
  const fp = faceOf(vadd(c0, [-75 * 0.7071, 75 * 0.7071, 160]), [0.7071, -0.7071, 0], [0, 0, -1]);
  faceRR(fp, 0, 0, 150, 130, 20, { fill: PAL.face, stroke: PAL.edge });
  const cook = clamp(o.cook ?? 0), warm = clamp(o.warm ?? 0);
  const lamp = (u, on, halo) => {
    if (halo > 0.01) faceEll(fp, u, 26, 20 + 3 * Math.sin(TT * 4), 20 + 3 * Math.sin(TT * 4), { stroke: COL.heatM, w: 3 });
    faceEll(fp, u, 26, 13, 13, { fill: mixHex('#ffffff', COL.heat, on), stroke: PAL.edge });
  };
  lamp(38, cook, o.halo === 'cook' ? cook : 0); lamp(112, warm, o.halo === 'warm' ? warm : 0);
  faceRR(fp, 65, 50, 20, 70, 8, { stroke: PAL.inner });
  const kv = lerp(104, 64, clamp(o.knobUp ?? 0));
  faceSlab(fp, 56, kv - 12, 38, 24, 10, {});
  const out = { vent, knob: isoP(fp(75, kv)), lampCook: isoP(fp(38, 26)), lampWarm: isoP(fp(112, 26)) };
  ISO = keep;
  return out;
}

// ---- the timer that the cooker does NOT have: a flat round clock face in hairlines (two little bells, 4 ticks,
// two hands), crossed out with a grey X. k = grow-in 0..1, spin = hand angle (rad), xk = X stroke progress 0..2
const ck_CLK = [170, 490];
function ck_clock(k, spin, xk, al = 1) {
  if (k <= 0.01 || al <= 0.01) return;
  const [x, y] = ck_CLK, r = 70;
  ctx.save(); ctx.globalAlpha = clamp(al);
  ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
  for (const s of [-1, 1]) { polyPath(arcPts(x + s * 46, y - 60, 20, Math.PI * (s < 0 ? 1.1 : 1.35), Math.PI * (s < 0 ? 1.65 : 1.9), 10), false); hair(PAL.edge, 5); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge, 5); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r - 14, 0, TAU); hair(PAL.inner, 3); ctx.stroke();
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; polyPath([[x + Math.cos(a) * (r - 26), y + Math.sin(a) * (r - 26)], [x + Math.cos(a) * (r - 40), y + Math.sin(a) * (r - 40)]], false); hair(PAL.edge, 4); ctx.stroke(); }
  const hand = (a, L, w) => { polyPath([[x, y], [x + Math.sin(a) * L, y - Math.cos(a) * L]], false); hair(PAL.edge, w); ctx.stroke(); };
  hand(spin * 0.08 + 1.9, 28, 6); hand(spin, 44, 4.5);
  ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fillStyle = PAL.edge; ctx.fill();
  // the X (grey, never red / never the accent)
  const d = 74, a1 = clamp(xk), a2 = clamp(xk - 1);
  if (a1 > 0) { polyPath([[x - d, y - d], [x - d + 2 * d * a1, y - d + 2 * d * a1]], false); hair(PAL.text, 8); ctx.stroke(); }
  if (a2 > 0) { polyPath([[x + d, y - d], [x + d - 2 * d * a2, y - d + 2 * d * a2]], false); hair(PAL.text, 8); ctx.stroke(); }
  ctx.restore();
}

// ---- a caption whose lines spring in on their own words, and can fade out (local variant of viCaption)
// ats: absolute times per line; o: { hi: [line, 'word'], col, out (absolute fade-out time) }
function ck_captionDraw(lines, ats, o) {
  const fo = o.out ? 1 - seg(TT, o.out, o.out + 0.3) : 1;
  if (fo <= 0.001) return;
  ctx.save(); ctx.font = `400 60px ${VFONT}`; ctx.textBaseline = 'alphabetic';
  let any = 0;
  lines.forEach((s, i) => {
    const a = clamp(spring(TT, ats[i], { k: 120, damp: 0.8 })) * fo; if (a <= 0.001) return; any = Math.max(any, a);
    ctx.globalAlpha = a;
    const y = 1360 + i * 72 + (1 - a) * 16, w = ctx.measureText(s).width, x = CX - w / 2;
    if (o.hi && o.hi[0] === i && s.includes(o.hi[1])) {
      const k = s.indexOf(o.hi[1]), pre = ctx.measureText(s.slice(0, k)).width, hw = ctx.measureText(o.hi[1]).width;
      ctx.fillStyle = o.col ?? COL.heatL; ctx.fillRect(x + pre - 8, y - 46, hw + 16, 60);
    }
    ctx.fillStyle = PAL.text; ctx.textAlign = 'left'; ctx.fillText(s, x, y);
  });
  if (any > 0) { ctx.globalAlpha = any; polyPath([[CX - 22, 1290], [CX + 22, 1290]], false); hair(PAL.edge); ctx.stroke(); }
  ctx.restore();
}
const ck_caption = (lines, ats, o = {}) => { const f = () => ck_captionDraw(lines, ats, o); if (DEFER) DEFER.push(f); else f(); };

// ---- a hand-set "?" / mark that springs in and sways a little
function ck_mark(str, x, y, t0, size = 84) {
  const k = popS(t0); if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(0.12 + 0.07 * Math.sin(TT * 2.6)); ctx.scale(k, k);
  vtext(str, 0, size * 0.35, size, { col: PAL.text }); ctx.restore();
}

// ---- a short grey leader + label that springs in (and optionally fades out)
function ck_tagLine(str, from, to, t0, tOut, o = {}) {
  const a = clamp(spring(TT, t0, { k: 140, damp: 0.8 })) * (tOut ? 1 - seg(TT, tOut, tOut + 0.35) : 1);
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha = a;
  polyPath([from, [lerp(from[0], to[0], a), lerp(from[1], to[1], a)]], false); hair(PAL.edge, 3); ctx.stroke();
  ctx.restore();
  vtext(str, to[0] + (o.dx ?? 0), to[1] + (o.dy ?? 0) + (1 - a) * 14, o.size ?? 56, { col: o.col ?? PAL.text, al: a, align: o.align ?? 'left' });
}

// ---- warmth: two short soft orange wisps beside the body (no arrowheads — "chút nhiệt nhỏ")
function ck_warmWisps(k) {
  if (k <= 0.01) return;
  for (const [x0, ph] of [[232, 0], [848, 1.7]]) {
    const cyc = mod(TT * 0.45 + ph * 0.3, 1), len = 120 * (0.7 + 0.3 * Math.sin(cyc * TAU));
    const P = []; for (let i = 0; i <= 16; i++) { const q = i / 16; P.push([x0 + Math.sin(q * 6 - TT * 3 + ph) * 9 * Math.min(1, q * 3), 820 - q * len * k]); }
    ctx.save(); ctx.globalAlpha = 0.85 * k; polyPath(P, false); hair(COL.heatM, 5); ctx.stroke(); ctx.restore();
  }
}

// ---- the hero as a steam cloud that can show its old drop shape (dashed ghost) and wave (rock side to side)
function ck_steamHero(x, y, o = {}) {
  const g = clamp(o.ghost ?? 0), wv = o.wave ?? 0;
  ctx.save();
  if (wv) { ctx.translate(x, y + HR); ctx.rotate(wv); ctx.translate(-x, -(y + HR)); }
  heroDrop(x, y, HR * (o.s ?? 1), { steam: 1, look: o.look ?? 0, mood: o.mood ?? 'calm', squash: o.squash ?? 0 });
  ctx.restore();
  if (g > 0.01) {
    ctx.save(); ctx.globalAlpha = 0.75 * g; ctx.setLineDash([12, 9]); ctx.lineDashOffset = -TT * 12;
    const s = 0.92 + 0.08 * g; polyPath(dropPts(x, y - 4, HR * s), true); hair(COL.water, 4); ctx.stroke(); ctx.restore();
  }
  // little wave marks beside the cloud while waving
  const wm = clamp(o.marks ?? 0);
  if (wm > 0.01) {
    ctx.save(); ctx.globalAlpha = wm;
    for (const s of [-1, 1]) { polyPath(arcPts(x + s * 100, y - 6, 30 + 5 * Math.sin(TT * 9), s < 0 ? Math.PI * 0.8 : -Math.PI * 0.2, s < 0 ? Math.PI * 1.2 : Math.PI * 0.2, 8), false); hair(COL.waterM, 4); ctx.stroke(); }
    ctx.restore();
  }
}

// ---- HOOK: "Nồi cơm điện không hề hẹn giờ, vậy mà nó biết đúng lúc cơm vừa cạn nước."
SCENES.hook = function () {
  const tTimer = VW('hook', 'hẹn'), tClock = VW('hook', 'giờ'), tYet = VW('hook', 'vậy'), tRight = VW('hook', 'đúng');
  const tDry = VW('hook', 'cạn'), [hx, hy] = BR.hookMagnet.a;
  // the cooker drops in on a spring: plinth first, then the body; the cook lamp breathes, steam wisps rise
  const sp = spring(TT, 0.05, { k: 120, damp: 0.6 }), sb = spring(TT, 0.15, { k: 140, damp: 0.55 });
  ck_cooker({ cook: 0.85 + 0.15 * Math.sin(TT * 3.2), warm: 0, knobUp: 0, steam: ev(0.9, 0.6), halo: 'cook', liftP: (1 - sp) * 160, liftB: (1 - sb) * 300 });
  // "hẹn giờ": a timer springs in beside it, its hands spinning ... then crossed out on "giờ"; it fades on "đúng"
  const ck = clamp(spring(TT, tTimer - 0.1, { k: 150, damp: 0.6 })), crossT = tClock + 0.05;
  const spin = (Math.min(TT, crossT) - tTimer) * 9;
  ck_clock(ck, spin, seg(TT, crossT, crossT + 0.3) * 2, 1 - seg(TT, tRight, tRight + 0.45));
  // "cạn nước": the hero (one drop) pops up on the lid, squashes as it lands, looks at the vent, "?"
  const hp = popS(tDry);
  if (hp > 0) {
    heroDrop(hx, hy, HR * hp, { steam: 0, look: TT < tDry + 0.45 ? 0 : 0.6, mood: TT > tDry + 0.45 ? 'wow' : 'calm', squash: 0.7 * Math.max(0, kick(TT, tDry + 0.22, { k: 220, damp: 0.35 })) });
    ck_mark('?', hx - 100, hy - 60, tDry + 0.4, 88);
  }
  viTag('01', 'nồi cơm điện');
  ck_caption(['không hẹn giờ', 'vẫn biết cạn nước'], [VW('hook', 'không'), tYet], { hi: [1, 'cạn nước'], col: COL.waterL });
};

// ---- WARM: "Mạch nấu ngắt, chỉ còn chút nhiệt nhỏ giữ cho cơm ấm."
SCENES.warm = function () {
  const E = ET('warm'), END = EE('warm'), [hx, hy] = BR.clickWarm.b;
  const tOff = VW('warm', 'ngắt'), tOnly = VW('warm', 'chỉ'), tHeat = VW('warm', 'chút'), tKeep = VW('warm', 'giữ');
  const C = ck_cooker({ cook: 0, warm: 0.82 + 0.18 * Math.sin(TT * 3), knobUp: 1, steam: 0, halo: 'warm' });
  // "chút nhiệt nhỏ": two short soft warmth wisps beside the body
  ck_warmWisps(ev(tHeat, 0.6));
  // "ngắt": the cook lamp is labelled "tắt" (off) for a moment; "giữ": the warm lamp gets its label
  const lc = C.lampCook, lw = C.lampWarm;
  ck_tagLine('tắt', [lc[0], lc[1] - 24], [lc[0], lc[1] - 46], tOff, tKeep - 0.4, { align: 'center', dy: -12 });
  ck_tagLine('giữ ấm', [lw[0], lw[1] - 24], [lw[0], lw[1] - 46], tKeep, 0, { align: 'center', dy: -12 });
  // the hero (steam) drifts a little above the vent, back on its mark for the bridge
  const u = seg(TT, E + 0.5, END - 0.5), dx = 26 * Math.sin(TAU * EZ.io(u)), dy = -12 * Math.sin(Math.PI * EZ.io(u));
  ck_steamHero(hx + dx, hy + dy, { look: dx / 40 });
  viTag('09', 'giữ ấm');
  ck_caption(['chỉ còn chút nhiệt', 'giữ cho cơm ấm'], [tOnly, tKeep], { hi: [1, 'ấm'] });
};

// ---- END: "Vậy đấy: nồi cơm không đếm phút, nó chờ giọt nước cuối cùng biến mất."
SCENES.end = function () {
  const E = ET('end'), [hx, hy] = BR.warmEnd.b;
  const tNo = VW('end', 'không'), tMin = VW('end', 'phút'), tWait = VW('end', 'chờ'), tDrop = VW('end', 'giọt');
  const tLast = VW('end', 'cuối'), tGone = VW('end', 'biến');
  ck_cooker({ cook: 0, warm: 0.82 + 0.18 * Math.sin(TT * 3), knobUp: 1, steam: 0, halo: 'warm' });
  ck_warmWisps(0.7);
  // "không đếm phút": the crossed-out clock returns, faint, then leaves before the hero's line
  const ca = clamp(spring(TT, tNo - 0.1, { k: 140, damp: 0.7 }));
  ck_clock(0.9 + 0.1 * ca, 1.2, 2, 0.55 * ca * (1 - seg(TT, tWait - 0.1, tWait + 0.4)));
  // "giọt nước cuối cùng": the hero shows its old drop shape (ghost), waves goodbye; on "biến mất" it floats up a little
  const gh = clamp(spring(TT, tDrop, { k: 120, damp: 0.75 })) * (1 - seg(TT, tGone, tGone + 0.6));
  const wv = seg(TT, tLast, tLast + 0.2) * (1 - seg(TT, tGone + 0.9, tGone + 1.4)), wave = 0.16 * Math.sin((TT - tLast) * 9) * wv;
  const up = 30 * EZ.io(seg(TT, tGone, tGone + 1.6));
  const lk = TT < tDrop ? 0.25 * Math.sin(TT * 1.4) : 0;
  ck_steamHero(hx, hy - up, { ghost: gh, wave, marks: wv, look: lk, mood: wv > 0.3 ? 'wow' : 'calm' });
  viTag('10', 'giọt cuối cùng');
  ck_caption(['không đếm phút'], [tNo], { out: tWait - 0.35 });
  ck_caption(['chờ giọt nước', 'cuối cùng'], [tWait, tLast], { hi: [0, 'giọt nước'], col: COL.waterL });
};
