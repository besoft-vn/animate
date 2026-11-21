// =====================================================================
//  sc-field.js — the CROSS-SECTION (flat side view): glass on a thin insulator, a row (drive) pad and a column
//  (sense) pad underneath, and the BLUE field arcs from the row pad to the column pad (owned by the sc-field agent).
//  Scenes: cap (03), finger (05), glove (09). Prefix fd_.
//  Geometry: glass top EXACTLY at y 770 (TOUCH puts the hero's tip on (540, 770)); pads' top at y 860.
//  Physics: arcs flow row -> column; the finger STEALS the upper 3 (they end in its tip, then go up into the body);
//  the column reading drops (shorter + paler bar). The glove steals nothing: all arcs still reach the column.
// =====================================================================
const FD_GLASS = { x: 140, y: 770, w: 800, h: 60 };
const FD_PADY = 860, FD_ROW = [330, 500], FD_COLP = [580, 750];
// nested arcs, inner -> outer: start x on the row pad, end x on the column pad, full height, height while "inside"
const FD_ARCS = [
  { a: 476, b: 604, h: 50, h0: 38 },
  { a: 450, b: 630, h: 76, h0: 54 },
  { a: 420, b: 660, h: 148, h0: 66 },
  { a: 392, b: 688, h: 204, h0: 76 },
  { a: 362, b: 718, h: 258, h0: 84 },
];
// where the stolen arcs (index 2, 3, 4) end inside the finger, the arc height on the way, and their way up the body
const FD_STEAL = {
  2: { e: [552, 758], h: 75, up: [[552, 700], [560, 600], [578, 472]] },
  3: { e: [540, 752], h: 110, up: [[540, 700], [540, 600], [540, 462]] },
  4: { e: [528, 750], h: 150, up: [[528, 700], [520, 600], [502, 472]] },
};
// 0 within `pad` s of either end of the era, 1 in the middle (eased)
// text alpha: in after the bridge's window has opened, out by EE − 0.6 (the morph never shows half-cut text)
const fd_txt = (id) => seg(TT, ET(id) + 0.45, ET(id) + 0.75) * (1 - seg(TT, EE(id) - 0.9, EE(id) - 0.6));
const fd_env = (id, pad = 0.5, ramp = 0.6) => EZ.io(seg(TT, ET(id) + pad, ET(id) + pad + ramp)) * (1 - EZ.io(seg(TT, EE(id) - pad - ramp, EE(id) - pad)));

// a flat slab seen from the side in the isometric look: a light thickness line below, white face, grey hairline
function fd_slab(x, y, w, h, r, o = {}) {
  const P = rrectPts(x, y, w, h, r, 6);
  ctx.save(); ctx.globalAlpha = clamp(o.al ?? 1);
  if (o.drop !== false) { polyPath(thickDrop(P, o.drop ?? 8), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.inner); ctx.stroke(); }
  polyPath(P, true); ctx.fillStyle = o.fill ?? PAL.face; ctx.fill(); hair(o.edge ?? PAL.edge); ctx.stroke();
  ctx.restore();
}
// the whole section. o: { kG, kI, kP (0..1 draw-in of glass / insulator+base / pads) }
function fd_section(o = {}) {
  const kG = clamp(o.kG ?? 1), kI = clamp(o.kI ?? 1), kP = o.kP ?? 1;
  // base (substrate) + insulator: wipe in from the left
  if (kI > 0.001) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 150 + 800 * EZ.io(kI), H); ctx.clip();
    fd_slab(170, 896, 740, 20, 8, { edge: PAL.inner, drop: false });
    fd_slab(165, 842, 750, 12, 5, { edge: PAL.inner, drop: false });
    ctx.restore();
  }
  // the two electrode pads: spring up into place
  [FD_ROW, FD_COLP].forEach(([x0, x1], i) => {
    const s = clamp(typeof kP === 'number' ? kP : kP[i], 0, 1.3); if (s <= 0.01) return;
    ctx.save(); ctx.globalAlpha = clamp(s * 2);
    ctx.translate((x0 + x1) / 2, FD_PADY + 13); ctx.scale(s, s); ctx.translate(-(x0 + x1) / 2, -(FD_PADY + 13));
    fd_slab(x0, FD_PADY, x1 - x0, 26, 7, { fill: '#f2f2f4', drop: 6 });
    ctx.restore();
  });
  // the glass: wipes in from the left, label set inside its edge
  if (kG > 0.001) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, FD_GLASS.x + (FD_GLASS.w + 20) * EZ.io(kG), H); ctx.clip();
    fd_slab(FD_GLASS.x, FD_GLASS.y, FD_GLASS.w, FD_GLASS.h, 14);
    // a few faint glints on the glass top (inner lines), so it reads as glass
    polyPath([[FD_GLASS.x + 30, 784], [FD_GLASS.x + 110, 784]], false); hair(PAL.inner); ctx.stroke();
    polyPath([[FD_GLASS.x + FD_GLASS.w - 140, 784], [FD_GLASS.x + FD_GLASS.w - 40, 784]], false); hair(PAL.inner); ctx.stroke();
    vtext('kính', FD_GLASS.x + 34, 818, 50, { align: 'left', col: PAL.text, al: clamp(kG * 3 - 2) * (o.tal ?? 1) });
    ctx.restore();
  }
}
// pad labels (below the pads); t0s = [row, column] spring-in times (or now)
function fd_padLabels(tRow, tCol, now, al = 1) {
  if (al <= 0.001) return;
  if (now) { vtext('hàng (phát)', 515, 985, 50, { align: 'right', col: PAL.text, al }); vtext('cột (nhận)', 565, 985, 50, { align: 'left', col: PAL.text, al }); return; }
  vlabel('hàng (phát)', 515, 985, tRow, 50, { align: 'right', col: PAL.text, al });
  vlabel('cột (nhận)', 565, 985, tCol, 50, { align: 'left', col: PAL.text, al });
}
// the arc i as points (n = 24 -> 25 points). hk 0..1: from the low height (inside the glass) to the full height
const fd_arcPts = (i, hk = 1) => { const A = FD_ARCS[i]; return arcBetween([A.a, FD_PADY], [A.b, FD_PADY], lerp(A.h0, A.h, hk)); };
// arc i morphed toward the finger (s 0..1), plus its way up the body (up 0..1)
function fd_stolenPts(i, s, up) {
  const P = fd_arcPts(i), S = FD_STEAL[i]; if (!S || s <= 0) return P;
  const T = arcBetween([FD_ARCS[i].a, FD_PADY], S.e, S.h);
  const Q = P.map((p, j) => [lerp(p[0], T[j][0], s), lerp(p[1], T[j][1], s)]);
  if (up > 0.001 && s >= 0.999) {
    // the lines drawn up into the body sway gently (more toward the top), like a ribbon being pulled
    const sw = 34 * Math.sin((TT - VW('finger', 'cơ')) * TAU / 1.7 + i * 0.7) * ev(VW('finger', 'cơ') + 0.8, 0.6) * (1 - seg(TT, EE('finger') - 0.9, EE('finger') - 0.6));
    const UP = S.up.map(([x, y], k) => [x + sw * (k / (S.up.length - 1)) ** 1.5, y]);
    const U = subPath(resample([S.e, ...UP], false, 6), up); for (const p of U.slice(1)) Q.push(p); }
  return Q;
}
// the column reading: a bar under the column label (v 0..1; weaker = shorter AND paler)
function fd_meter(v, al = 1, pulse = 0, tal = 1) {
  if (al <= 0.001) return;
  const x = 580, y = 1032, w = 220, h = 34;
  ctx.save(); ctx.globalAlpha = clamp(al);
  polyPath(rrectPts(x, y, w, h, 10, 4), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge); ctx.stroke();
  const vv = clamp(v), fw = Math.max(8, (w - 10) * vv);
  polyPath(rrectPts(x + 5, y + 5, fw, h - 10, 6, 4), true); ctx.fillStyle = mixHex(COL.fieldM, COL.field, seg(vv, 0.6, 1)); ctx.fill();
  if (pulse > 0 && pulse < 1) { polyPath(rrectPts(x - 12 * pulse, y - 12 * pulse, w + 24 * pulse, h + 24 * pulse, 10 + 8 * pulse, 4), true); ctx.globalAlpha = clamp(al) * (1 - pulse) * 0.9; hair(COL.field, 3); ctx.stroke(); }
  ctx.restore();
  vtext('tín hiệu', 552, 1062, 50, { align: 'right', col: PAL.text, al: al * tal });
}
// a big grey "?" that pops in
function fd_pop(str, x, y, t0, size = 96, al = 1) {
  const s = spring(TT, t0, { k: 240, damp: 0.5 }); if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(0.08 + 0.05 * Math.sin(TT * 2.2)); ctx.scale(Math.max(0, s), Math.max(0, s)); ctx.translate(-x, -y);
  vtext(str, x, y, size, { col: PAL.textD, al: clamp(s * 1.5) * al });
  ctx.restore();
}

// ---------------------------------------------------------------------
//  CAP (12.25–18.25) — "Mỗi chỗ hàng cắt cột là một tụ điện tí hon, có điện trường nhô lên qua lớp kính."
//  The section draws in; hàng / cột: pad labels; tụ: a bracket + "tụ điện tí hon"; điện trường: 5 arcs grow (inside
//  the glass); nhô: the upper 3 rise up through the glass and above it. Hero hovers, watching.
// ---------------------------------------------------------------------
SCENES.cap = function () {
  const t0 = ET('cap'), tH = VW('cap', 'hàng'), tC = VW('cap', 'cột'), tT = VW('cap', 'tụ'), tE = VW('cap', 'điện', 2), tN = VW('cap', 'nhô'), tK = VW('cap', 'kính');
  const ta = fd_txt('cap');
  fd_section({ tal: ta, kG: ev(t0 + 0.05, 0.7), kI: ev(t0 + 0.2, 0.6), kP: [spring(TT, tH - 0.35, { k: 150, damp: 0.6 }), spring(TT, tC - 0.3, { k: 150, damp: 0.6 })] });
  fd_padLabels(tH - 0.1, tC - 0.05, false, ta);
  // the capacitor bracket under both pads + its name
  const kb = EZ.o2(ev(tT - 0.15, 0.5));
  if (kb > 0) {
    const xm = 540, half = 210 * kb;
    polyPath([[xm - half, 1004], [xm - half, 1018], [xm + half, 1018], [xm + half, 1004]], false); hair(PAL.edge, 3); ctx.stroke();
    vlabel('tụ điện tí hon', 540, 1092, tT, 58, { al: ta });
  }
  // the field: grows on "điện trường" (inside the glass), the upper arcs rise on "nhô lên"
  const rise = EZ.io(ev(tN - 0.05, 0.9));
  FD_ARCS.forEach((A, i) => {
    const part = EZ.o2(ev(tE - 0.1 + i * 0.1, 0.7));
    const hk = i >= 2 ? clamp(rise - (i - 2) * 0.08) / (1 - (i - 2) * 0.08 || 1) : 1;
    // "kính": a soft swell of the arcs that now stand above the glass
    const sw = i >= 2 ? 1 + 0.4 * Math.sin(Math.PI * ev(tK - 0.1, 0.6)) : 1;
    fieldLine(fd_arcPts(i, i >= 2 ? hk : 1), { part, w: 4 * sw });
  });
  // "nhô lên": a small grey up-arrow beside the risen arcs
  const ua = ev(tN, 0.3) * ta;
  if (ua > 0) simpleArrow(790, 770, 790, 770 - 110 * EZ.o2(ev(tN, 0.5)), { al: ua, w: 5 });
  vlabel('nhô lên', 790, 630, tN + 0.1, 50, { al: ta });
  // the hero hovering, watching (drifts a little in the middle of the era)
  const e = fd_env('cap'), [hx, hy] = HOVER, u = TT - t0;
  const look = TT < tH ? 0 : TT < tC ? -0.6 : TT < tT ? 0.6 : TT < tN ? 0 : -0.2;
  heroFinger(hx + 22 * Math.sin(u * 1.3) * e, hy - 12 * Math.sin(u * 1.7) * e, HR,
    { mood: TT >= tN && TT < tN + 1.5 ? 'wow' : 'calm', look: look * e });
  viTag('03', 'tụ điện');
  viCaption(['mỗi chỗ hàng cắt cột:', 'một tụ điện tí hon'], [1, 'tụ điện'], { at: tT - t0 - 0.2, col: '#e4e4ea' });
};

// ---------------------------------------------------------------------
//  FINGER (25.25–32.75) — "Ngón tay chạm vào sẽ kéo một phần điện trường đó đi, dẫn vào cơ thể bạn."
//  chạm: the hero comes down to TOUCH (tip on the glass at (540, 770), squash); kéo: the upper 3 arcs re-route into
//  its tip (the lower 2 still reach the column), the column reading drops to ~60%; cơ thể: the stolen lines go on up
//  through the hero, a grey arrow "vào cơ thể".
// ---------------------------------------------------------------------
SCENES.finger = function () {
  const t0 = ET('finger'), t1 = EE('finger'), tC = VW('finger', 'chạm'), tK = VW('finger', 'kéo'), tB = VW('finger', 'cơ'), tD = VW('finger', 'điện');
  const ta = fd_txt('finger');
  fd_section({ tal: ta });
  fd_padLabels(0, 0, true, ta);
  // the field: the upper 3 arcs bend into the tip, one after another
  const up = EZ.io(ev(tB - 0.1, 0.9));
  FD_ARCS.forEach((A, i) => {
    const s = i >= 2 ? EZ.io(ev(tK - 0.05 + (i - 2) * 0.14, 1.0)) : 0;
    // "điện trường": a soft swell along the stolen lines
    let sw = i >= 2 ? 1 + 0.35 * Math.sin(Math.PI * ev(tD, 0.6)) : 1;
    // after "bạn": the stolen lines keep throbbing as the body drains them (not on a 1 s period)
    if (i >= 2) sw += 0.6 * Math.max(0, Math.sin((TT - tB) * TAU / 1.4 - (i - 2) * 0.5)) * ev(tB + 0.6, 0.4) * (1 - seg(TT, t1 - 0.9, t1 - 0.6));
    fieldLine(fd_stolenPts(i, s, up), { w: 4 * sw, head: s < 0.05 || up > 0.9 });
  });
  vlabel('bị kéo đi', 250, 660, tK + 0.35, 52, { al: ta });
  // the column reading: full, then down to ~60% as the lines are pulled away
  const v = 1 - 0.4 * EZ.io(ev(tK + 0.2, 1.1)) + 0.015 * Math.sin(TT * 4) + 0.06 * Math.sin((TT - tB) * TAU / 1.3) * ev(tB + 0.6, 0.5) * fd_env('finger');
  fd_meter(v, ev(t0 + 0.4, 0.5), 0, ta);
  // "vào cơ thể": a grey arrow up beside the hero + label
  const ka = EZ.o2(ev(tB - 0.05, 0.6));
  if (ka > 0) simpleArrow(440, 610, 440, 610 - 150 * ka, { w: 5, head: 22, al: ta });
  // keeps pulling: a second short arrow climbs the shaft once a beat
  if (ka >= 1) { const q = mod(TT - tB - 0.6, 1.4) / 1.4, qa = Math.sin(Math.PI * q) * (1 - seg(TT, t1 - 0.9, t1 - 0.6));
    if (qa > 0.01) simpleArrow(462, 610 - 130 * q, 462, 570 - 130 * q, { w: 4, head: 12, al: qa * 0.8 * ta }); }
  vlabel('vào cơ thể', 420, 525, tB + 0.1, 52, { align: 'right', al: ta });
  // the hero: HOVER -> TOUCH on "chạm" (tip on the glass), squash while pressing, back to plain near the bridge
  const d = EZ.io(seg(TT, Math.max(t0 + 0.5, tC - 0.12), tC + 0.32));
  const hy = lerp(HOVER[1], TOUCH[1], d);
  const sq = (0.22 * EZ.o2(ev(tC + 0.3, 0.12)) + 0.12 * kick(TT, tC + 0.3, { k: 260, damp: 0.35 }) + 0.2 * Math.sin(Math.PI * seg(mod(TT - tB - 0.5, 1.6), 0, 0.8)) * ev(tB + 0.5, 0.01)) * (1 - EZ.io(seg(TT, t1 - 1.2, t1 - 0.55)));
  const mood = TT >= tK + 0.1 && TT < tK + 1.6 ? 'wow' : TT >= tB + 0.3 && TT < tB + 1.6 ? 'happy' : 'calm';
  const e = fd_env('finger');
  // once touching, cancel heroFinger's idle bob so the tip sits exactly ON the glass top (y 770)
  const sqc = Math.max(0, sq), bobF = (1 - sqc) * Math.sin(TT * TAU * 0.7) * HR * 0.05 * d * (1 - EZ.io(seg(TT, t1 - 1.2, t1 - 0.55)));
  heroFinger(TOUCH[0], hy - bobF, HR, { squash: sqc, mood, look: (TT < tK ? 0 : TT < tB ? -0.5 : 0.3 + 0.5 * Math.sin((TT - tB) * 2.4)) * e, tilt: 0.11 * Math.sin((TT - tB - 0.5) * TAU / 1.7) * ev(tB + 0.5, 0.6) * e });
  viTag('05', 'ngón tay kéo đi');
  // the caption follows the line: first the pull, then where it goes (summary of "dẫn vào cơ thể bạn")
  if (TT < tB + 0.9) viCaption(['ngón tay kéo', 'điện trường đi'], [1, 'điện trường'], { at: tC - t0 });
  else viCaption(['điện trường đi', 'vào cơ thể bạn'], [1, 'cơ thể'], { at: tB + 0.9 - t0, col: '#e4e4ea' });
};

// ---------------------------------------------------------------------
//  GLOVE (47.5–54.25) — "Đeo găng len thì khác: len không dẫn điện, điện trường chẳng hụt, màn hình làm ngơ."
//  The gloved hero touches the whole era; ALL arcs still go row -> column (none bend into the glove); len: "len không
//  dẫn điện"; chẳng hụt: the column reading pulses and stays FULL ("đủ"); làm ngơ: a grey "?" and a sad hero.
// ---------------------------------------------------------------------
SCENES.glove = function () {
  const t0 = ET('glove'), t1 = EE('glove'), tL = VW('glove', 'len', 2), tD = VW('glove', 'điện', 2), tCh = VW('glove', 'chẳng'), tLa = VW('glove', 'làm');
  const ta = fd_txt('glove');
  fd_section({ tal: ta });
  fd_padLabels(0, 0, true, ta);
  vlabel('len không dẫn điện', 540, 540, tL - 0.05, 52, { al: ta });
  fd_meter(1 + 0.01 * Math.sin(TT * 4), ev(t0 + 0.4, 0.5), ev(tCh, 0.8), ta);
  vlabel('đủ', 822, 1062, tCh + 0.25, 52, { align: 'left', col: COL.field, al: ta });
  fd_pop('?', 660, 640, tLa + 0.05, 96, ta);
  // the hero: gloved, touching all era; a soft press in the middle, sad on "làm ngơ"
  const e = fd_env('glove');
  const sq = 0.16 * e + 0.05 * e * Math.sin(Math.PI * ev(tL, 0.5));
  const mood = TT >= tLa - 0.4 && TT < t1 - 0.6 ? 'sad' : 'calm';
  // tip exactly on the glass while touching (cancel the idle bob in the middle of the era)
  const bobG = (1 - sq) * Math.sin(TT * TAU * 0.7) * HR * 0.05;
  heroFinger(TOUCH[0], TOUCH[1] - bobG * e, HR, { glove: 1, squash: sq, mood, look: (TT < tCh ? -0.3 : TT < tLa ? 0.5 : 0.2) * e });
  // the field passes STRAIGHT THROUGH the wool, unchanged: the arcs are drawn over the glove (director's call)
  FD_ARCS.forEach((A, i) => {
    const sw = 1 + 0.35 * Math.sin(Math.PI * ev(tD + i * 0.08, 0.6));
    fieldLine(fd_arcPts(i), { w: 4 * sw });
  });
  viTag('09', 'găng len');
  viCaption(['len không dẫn điện:', 'màn hình làm ngơ'], [1, 'làm ngơ'], { at: tL - t0, col: '#e4e4ea' });
};
