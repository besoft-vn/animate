// =====================================================================
//  SC-PHONE — hook, grid, end: the phone lying flat in iso (the same drawing in all three; owned by the sc-phone agent).
//  World: the phone's long side along x (its top toward the upper left), short side along y; body z 0..PH_T, glass
//  plate PH_T..PH_T+PH_G. At rest its screen centre (glass top) projects exactly onto TOUCH_PT (540, 770).
//  Display face coords (u, v): u along +y (0..PH_S), v along +x (0..PH_L) — v runs from the phone's top to its bottom.
//  hook: drops in, the hero taps; "lực" gauge crossed out on "mạnh/nhẹ"; blue ring on "dẫn"; hero to HOVER.
//  grid: the glass lifts off (exploded), 5 row strips (hàng) then 4 column strips (cột) draw in; hero at HOVER.
//  end: hook pose; the grid shows faintly under the glass; a pale-blue dip ring + faint crosshair at the tip.
//  Colour: grey hairlines = phone, glass, electrodes, gauge; BLUE = the conducting touch / the field dip only.
// =====================================================================
const PH_L = 560, PH_S = 280, PH_T = 20, PH_G = 6, PH_R = 40;
const PH_ISO = { ox: TOUCH_PT[0], oy: TOUCH_PT[1] + (PH_T + PH_G) * ZK, u: 1 };
const PH_ROWS = 5, PH_COLS = 4;
const ph_rowV = (k) => 80 + k * (PH_L - 160) / (PH_ROWS - 1);       // row strip centres (along the long side)
const ph_colU = (k) => 46 + k * (PH_S - 92) / (PH_COLS - 1);        // column strip centres (along the short side)
// 0 within `pad` s of either end of the era, 1 in the middle (eased)
const ph_env = (id, pad = 0.5, ramp = 0.6) => EZ.io(seg(TT, ET(id) + pad, ET(id) + pad + ramp)) * (1 - EZ.io(seg(TT, EE(id) - pad - ramp, EE(id) - pad)));
// the display face (z = top of the body) and the glass top face, for the current ISO
const ph_disp = () => faceOf([-PH_L / 2, -PH_S / 2, PH_T], [0, 1, 0], [1, 0, 0]);
const ph_glassTop = (z0 = PH_T) => faceOf([-PH_L / 2, -PH_S / 2, z0 + PH_G], [0, 1, 0], [1, 0, 0]);

// ---------------------------------------------------------------------
//  the phone. o: { drop (screen px, whole phone raised), bodyDy (screen px, body pushed down), lift 0..1 (glass up),
//  tiles 0..1, gridAl 0..1, rows 0..1, cols 0..1 (draw-in), dip 0..1 (end), rings: [phase 0..1, ...] (blue touch
//  rings), blip 0..1 (a grey tap ripple). Returns screen points { rowEnd[k], colEnd[k],
//  glassEdge } for labels.
// ---------------------------------------------------------------------
function ph_phone(o = {}) {
  const keep = ISO, drop = o.drop ?? 0, bodyDy = o.bodyDy ?? 0, glassUp = 150 * clamp(o.lift ?? 0) + (o.float ?? 0);
  const out = {};
  // ---- the body (+ its display layer)
  setIso({ ...PH_ISO, oy: PH_ISO.oy - drop + bodyDy });
  isoBox(-PH_L / 2, -PH_S / 2, 0, PH_L, PH_S, PH_T, { r: PH_R });
  const fp = ph_disp();
  faceRR(fp, 12, 14, PH_S - 24, PH_L - 28, PH_R - 12, { stroke: PAL.inner });
  // app tiles (3 x 3) + a dock pill + the home bar
  const ta = clamp(o.tiles ?? 1);
  if (ta > 0.01) {
    ctx.save(); ctx.globalAlpha = ta;
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) faceRR(fp, 38 + i * 76, 74 + j * 86, 52, 52, 14, { fill: PAL.face, stroke: PAL.edge });
    faceRR(fp, 34, 400, PH_S - 68, 66, 22, { stroke: PAL.inner });
    for (let i = 0; i < 3; i++) faceRR(fp, 58 + i * 64, 412, 42, 42, 12, { stroke: PAL.edge });
    faceLine(fp, [[PH_S / 2 - 40, 508], [PH_S / 2 + 40, 508]], PAL.edge);
    faceLine(fp, [[PH_S / 2 - 24, 36], [PH_S / 2 + 24, 36]], PAL.inner);
    ctx.restore();
  }
  // a grey tap ripple on the display (the first tap)
  const bl = o.blip ?? 0;
  if (bl > 0 && bl < 1) { ctx.save(); ctx.globalAlpha = (1 - bl) * 0.9; faceEll(fp, PH_S / 2, PH_L / 2, 18 + 50 * bl, 18 + 50 * bl, { stroke: PAL.edge, w: 3 }); ctx.restore(); }
  // ---- the electrode grid on the display layer: rows (along u, drawn in from the screen-left end u = PH_S),
  // then columns (along v, top -> bottom). Grey hairline strips, white-filled.
  const ga = clamp(o.gridAl ?? 0);
  if (ga > 0.01) {
    ctx.save(); ctx.globalAlpha = ga;
    const rw = 16;
    for (let k = 0; k < PH_ROWS; k++) {
      const p = EZ.o2(clamp((o.rows ?? 0) * 1.6 - k * 0.15)), len = (PH_S - 40) * p;
      if (len > 2) faceRR(fp, PH_S - 20 - len, ph_rowV(k) - rw / 2, len, rw, rw / 2, { fill: PAL.face, stroke: PAL.edge });
    }
    for (let k = 0; k < PH_COLS; k++) {
      const p = EZ.o2(clamp((o.cols ?? 0) * 1.6 - k * 0.2)), len = (PH_L - 44) * p;
      if (len > 2) faceRR(fp, ph_colU(k) - rw / 2, 22, rw, len, rw / 2, { stroke: PAL.edge });
    }
    ctx.restore();
  }
  // a soft drive pulse running along the rows one after another (end: the chip still scanning), under the glass
  const sc = o.scan ?? 0;
  if (sc > 0.01) {
    const per = 0.6, cyc = (TT / per), k = Math.floor(cyc) % PH_ROWS, f = cyc - Math.floor(cyc), len = 90;
    const u0 = lerp(PH_S - 20 - len, 20, EZ.io(f));
    ctx.save(); ctx.globalAlpha = sc * Math.sin(Math.PI * f);
    faceRR(fp, 20, ph_rowV(k) - 11, PH_S - 40, 22, 11, { fill: COL.fieldL, stroke: COL.fieldM, w: 3 });
    faceRR(fp, u0, ph_rowV(k) - 9, len, 18, 9, { fill: COL.fieldM, stroke: COL.field, w: 3 });
    ctx.restore();
  }
  out.rowEnd = []; out.colEnd = [];                              // the screen-left end of each row / lower end of each column
  for (let k = 0; k < PH_ROWS; k++) out.rowEnd.push(isoP(fp(PH_S - 20, ph_rowV(k))));
  for (let k = 0; k < PH_COLS; k++) out.colEnd.push(isoP(fp(ph_colU(k), PH_L - 60)));   // on the strip, near its lower end
  // ---- the glass plate (a thin slab, translucent: what is under it shows through, paler)
  setIso({ ...PH_ISO, oy: PH_ISO.oy - drop - glassUp });
  isoBox(-PH_L / 2, -PH_S / 2, PH_T, PH_L, PH_S, PH_G, { r: PH_R, fill: 'rgba(255,255,255,0.32)' });
  const gp = ph_glassTop();
  // two short glints so the plate reads as glass
  const gl = 0.55 + 0.45 * clamp(o.lift ?? 0);
  ctx.save(); ctx.globalAlpha = gl;
  faceLine(gp, [[PH_S - 46, 40], [PH_S - 96, 120]], PAL.inner, 3);
  faceLine(gp, [[PH_S - 40, 82], [PH_S - 66, 124]], PAL.inner, 3);
  ctx.restore();
  out.glassEdge = isoP(gp(0, PH_L - 150));                       // a point on the glass's upper-right (screen) edge
  // ---- blue rings where the conducting tip touches (on the glass top)
  for (const ph of o.rings ?? []) {
    if (ph <= 0 || ph >= 1) continue;
    ctx.save(); ctx.globalAlpha = Math.sin(Math.PI * Math.min(1, ph * 1.4)) * 0.95 * (1 - ph * 0.5);
    const r = 26 + 92 * EZ.o2(ph);
    faceEll(gp, PH_S / 2, PH_L / 2, r, r, { stroke: COL.field, w: 5 });
    ctx.restore();
  }
  // ---- the dip (end): a HOLE in the signal — a white disc that hides the grid under the tip, a dashed pale-blue rim,
  // and a faint dashed ring closing in on it (the field being taken), once per 1.5 s
  const dp = clamp(o.dip ?? 0);
  if (dp > 0.01) {
    const r = (66 + 6 * Math.sin(TT * Math.PI)) * dp;
    const rp = mod(TT, 1.5) / 1.5, rr = (150 - 80 * EZ.io(rp)) * dp;
    ctx.save(); ctx.setLineDash([12, 12]); ctx.lineDashOffset = TT * 20;
    ctx.globalAlpha = dp * 0.6 * Math.sin(Math.PI * rp);
    facePath(gp, ellipsePts(PH_S / 2, PH_L / 2, rr, rr, 0, 40), true); hair(COL.fieldM, 4); ctx.stroke();
    ctx.globalAlpha = dp * 0.92;
    facePath(gp, ellipsePts(PH_S / 2, PH_L / 2, r, r, 0, 40), true); ctx.fillStyle = PAL.face; ctx.fill();
    ctx.globalAlpha = dp;
    hair(COL.fieldM, 4); ctx.stroke();
    ctx.restore();
  }
  ISO = keep;
  return out;
}

// ---- the "lực" (force) gauge the screen does NOT have: a grey dial with a swinging needle, a label, a grey X.
// k grow-in 0..1, xk 0..2 (the two X strokes), al fade
const PH_GAUGE = [250, 1010];
function ph_gauge(k, xk, al = 1) {
  if (k <= 0.01 || al <= 0.01) return;
  const [x, y] = PH_GAUGE, r = 72;
  ctx.save(); ctx.globalAlpha = clamp(al);
  ctx.translate(x, y + 40); ctx.scale(k, k); ctx.translate(-x, -y - 40);
  // the dial (a half disc on a small base)
  polyPath(arcPts(x, y, r, Math.PI, TAU, 24).concat([[x + r, y + 14], [x - r, y + 14]]), true);
  ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge, 5); ctx.stroke();
  for (let i = 0; i <= 4; i++) { const a = Math.PI + i * Math.PI / 4; polyPath([[x + Math.cos(a) * (r - 12), y + Math.sin(a) * (r - 12)], [x + Math.cos(a) * (r - 26), y + Math.sin(a) * (r - 26)]], false); hair(PAL.edge, 4); ctx.stroke(); }
  const na = Math.PI * 1.5 + 0.9 * Math.sin(TT * 3.1) * (xk > 0.01 ? 0.25 : 1);
  polyPath([[x, y], [x + Math.cos(na) * (r - 18), y + Math.sin(na) * (r - 18)]], false); hair(PAL.text, 5); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fillStyle = PAL.edge; ctx.fill();
  ctx.restore();
  vtext('lực', x, y + 100, 56, { col: PAL.text, al: clamp(al) * clamp(k) });
  // the X (grey, never the accent)
  const d = 86, cy = y + 20, a1 = clamp(xk), a2 = clamp(xk - 1);
  ctx.save(); ctx.globalAlpha = clamp(al);
  if (a1 > 0) { polyPath([[x - d, cy - d], [x - d + 2 * d * a1, cy - d + 2 * d * a1]], false); hair(PAL.text, 11); ctx.stroke(); }
  if (a2 > 0) { polyPath([[x + d, cy - d], [x + d - 2 * d * a2, cy - d + 2 * d * a2]], false); hair(PAL.text, 11); ctx.stroke(); }
  ctx.restore();
}

// a label (Pangolin) on a white pill, springing in at t0, with an optional hairline leader to `to`
function ph_label(str, x, y, t0, o = {}) {
  const size = o.size ?? 54, a = clamp(spring(TT, t0, { k: 140, damp: 0.8 })) * clamp(o.al ?? 1);
  if (a <= 0.001) return;
  const dy = (1 - a) * 14;
  ctx.save(); ctx.font = `400 ${size}px ${VFONT}`; const w = ctx.measureText(str).width; ctx.restore();
  ctx.save(); ctx.globalAlpha = a;
  if (o.to) {
    polyPath([[x, (o.to[1] > y ? y + size * 0.22 : y - size * 0.95) + dy], o.to], false);
    hair(PAL.edge, 3); ctx.stroke();
    ctx.beginPath(); ctx.arc(o.to[0], o.to[1], 5, 0, TAU); ctx.fillStyle = PAL.edge; ctx.fill();
  }
  polyPath(rrectPts(x - w / 2 - 14, y - size * 0.86 + dy, w + 28, size * 1.12, size * 0.3, 4), true); ctx.fillStyle = PAL.face; ctx.fill();
  ctx.restore();
  vtext(str, x, y + dy, size, { col: o.col ?? PAL.text, al: a });
}


// ---- a caption whose lines spring in on their own words (local variant of viCaption); the highlight block appears
// on its own word. ats: absolute times per line; o: { his: [[line, 'word', at, colour], ...] }
function ph_captionDraw(lines, ats, o) {
  ctx.save(); ctx.font = `400 60px ${VFONT}`; ctx.textBaseline = 'alphabetic';
  let any = 0;
  lines.forEach((s, i) => {
    const a = clamp(spring(TT, ats[i], { k: 120, damp: 0.8 })); if (a <= 0.001) return; any = Math.max(any, a);
    ctx.globalAlpha = a;
    const y = 1360 + i * 72 + (1 - a) * 16, w = ctx.measureText(s).width, x = CX - w / 2;
    for (const [li, word, at, col] of o.his ?? []) {
      const hk = li === i && s.includes(word) ? clamp(spring(TT, at, { k: 140, damp: 0.8 })) : 0;
      if (hk <= 0.001) continue;
      const k = s.indexOf(word), pre = ctx.measureText(s.slice(0, k)).width, hw = ctx.measureText(word).width;
      ctx.fillStyle = col; ctx.fillRect(x + pre - 8, y - 46, (hw + 16) * hk, 60);
    }
    ctx.fillStyle = PAL.text; ctx.textAlign = 'left'; ctx.fillText(s, x, y);
  });
  if (any > 0) { ctx.globalAlpha = any; polyPath([[CX - 22, 1290], [CX + 22, 1290]], false); hair(PAL.edge); ctx.stroke(); }
  ctx.restore();
}
const ph_caption = (lines, ats, o = {}) => { const f = () => ph_captionDraw(lines, ats, o); if (DEFER) DEFER.push(f); else f(); };

// ---------------------------------------------------------------------
//  HOOK (0–6.5) — "Màn hình cảm ứng không đo bạn ấn mạnh hay nhẹ, nó dò ngón tay dẫn điện của bạn."
// ---------------------------------------------------------------------
SCENES.hook = function () {
  const tMa = VW('hook', 'mạnh'), tNhe = VW('hook', 'nhẹ'), tNo = VW('hook', 'nó'), tDan = VW('hook', 'dẫn');
  const tUp = ET('grid') - 0.55;
  // the phone drops in on a spring
  const sp = spring(TT, 0.05, { k: 120, damp: 0.6 });
  // the hero: in from the top to HOVER, tap 1 (1.25–2.5), watches the gauge, tap 2 on "dẫn", back to HOVER by tUp
  const yE = lerp(-170, HOVER[1], spring(TT, 0.45, { k: 110, damp: 0.72 }));
  const tap1 = 1.6, d1 = EZ.io(seg(TT, tap1 - 0.32, tap1)) * (1 - EZ.io(seg(TT, tap1 + 0.4, tap1 + 0.95)));
  const d2 = EZ.io(seg(TT, tDan - 0.36, tDan)) * (1 - EZ.io(seg(TT, tDan + 0.32, tUp)));
  const hy = yE + (TOUCH[1] - HOVER[1]) * (d1 + d2);
  const sq = 0.55 * Math.max(0, kick(TT, tap1, { k: 220, damp: 0.35 })) * (TT < tap1 + 0.6 ? 1 : 0)
           + 0.55 * Math.max(0, kick(TT, tDan, { k: 220, damp: 0.35 })) * (TT < tDan + 0.6 ? 1 : 0)
           + 0.2 * (d1 + d2) * (d1 + d2 > 0.98 ? 1 : 0);
  ph_phone({
    drop: (1 - sp) * 760, tiles: 1,
    blip: TT > tap1 ? (TT - tap1) / 0.6 : 0,
    rings: [(TT - tDan) / 0.9, (TT - tDan - 0.4) / 0.9, (TT - tDan - 0.8) / 0.9],
  });
  // "ấn mạnh hay nhẹ": the force gauge springs in just before "mạnh" and is crossed out on "mạnh"; it leaves after "nó"
  const gk = clamp(spring(TT, tMa - 0.4, { k: 150, damp: 0.6 })), xT = tMa - 0.05;
  ph_gauge(gk, seg(TT, xT, xT + 0.4) * 2, 1 - seg(TT, tNo + 0.5, tNo + 0.95));
  // the hero last
  const look = TT > tMa - 0.2 && TT < tNo + 0.6 ? -0.8 : 0.15 * Math.sin(TT * 1.6);
  const mood = TT > tDan + 0.1 && TT < tDan + 1.0 ? 'wow' : TT > xT && TT < tNo + 0.4 ? 'happy' : 'calm';
  heroFinger(HOVER[0], hy, HR, { look: TT > tUp ? 0 : look, squash: sq, mood });
  viTag('01', 'không đo lực ấn');
  viCaption(['không đo lực ấn,', 'dò ngón tay dẫn điện'], [1, 'dẫn điện'], { at: 1.0, col: COL.fieldL });
};

// ---------------------------------------------------------------------
//  GRID (6.5–12.25) — "Dưới mặt kính là một lưới điện cực trong suốt: hàng nằm ngang, cột nằm dọc."
// ---------------------------------------------------------------------
SCENES.grid = function () {
  const t0 = ET('grid'), tK = VW('grid', 'kính'), tL = VW('grid', 'lưới'), tH = VW('grid', 'hàng'), tC = VW('grid', 'cột');
  const lift = clamp(spring(TT, tK - 0.1, { k: 80, damp: 0.72 }));
  // rows draw in as soon as the glass is off ("lưới"), columns next (done by ~10 s), so both read well before the
  // words "hàng" / "cột" name them; the labels land on their words (cột a little early) and leave before the bridge
  const tR = tK + 0.25, tCs = tR + 1.6, lOut = 1 - seg(TT, EE('grid') - 0.9, EE('grid') - 0.62);
  const rows = seg(TT, tR, tR + 0.75), cols = seg(TT, tCs, tCs + 0.85);
  // "lưới điện cực trong suốt": the strips' layer shows faintly first, then they draw in
  const fl = 16 * Math.sin((TT - t0) * Math.PI) * lift * ph_env('grid', 0.3, 0.5);
  const P = ph_phone({ bodyDy: 110 * lift - 0.4 * fl, float: fl, lift, tiles: 1 - EZ.io(seg(TT, tK + 0.2, tL + 0.2)), gridAl: 1, rows, cols });
  // labels
  const ge = P.glassEdge;
  ph_label('kính', 850, 520, tK + 0.15, { to: [ge[0] + 6, ge[1] - 4], al: lOut });
  ph_label('hàng', 190, 1010, tH - 0.1, { to: P.rowEnd[1], al: lOut });
  ph_label('cột', 700, 1180, Math.min(tC - 0.4, VE('grid', 'ngang')), { to: P.colEnd[3], al: lOut });
  // the hero: at HOVER the whole era, a gentle look-down bob, eyes following what is labelled
  const e = ph_env('grid');
  const look = TT < tK ? 0 : TT < tH ? -0.6 : TT < tC - 0.4 ? -0.45 : 0.4;
  const mood = TT > tK + 0.2 && TT < tK + 1.3 ? 'wow' : 'calm';
  heroFinger(HOVER[0] + 10 * Math.sin((TT - t0) * 1.3) * e, HOVER[1] + 14 * Math.cos((TT - t0) * Math.PI) * e, HR, { look: look * e, mood });
  viTag('02', 'lưới điện cực');
  viCaption(['dưới kính: một lưới', 'hàng ngang, cột dọc'], [0, 'lưới'], { at: tK - t0, col: '#e4e4ea' });
};

// ---------------------------------------------------------------------
//  END (≈54.25–61.5) — "Vậy đấy: màn hình không nhìn thấy ngón tay, nó chỉ thấy chỗ điện trường bị lấy mất."
// ---------------------------------------------------------------------
SCENES.end = function () {
  const t0 = ET('end'), tKh = VW('end', 'không'), tChi = VW('end', 'chỉ'), tDien = VW('end', 'điện'), tLay = VW('end', 'lấy');
  // "không nhìn thấy": the grid shows faintly under the glass (breathing a little); the tiles dim
  const gv = EZ.io(seg(TT, tKh - 0.3, tKh + 1.7)), gc = EZ.io(seg(TT, VE('end', 'tay') - 0.1, VE('end', 'tay') + 0.8));
  const dip = clamp(spring(TT, tLay - 0.15, { k: 90, damp: 0.7 })) + 0.6 * EZ.io(seg(TT, tDien, tLay)) * (1 - clamp(spring(TT, tLay - 0.15, { k: 90, damp: 0.7 })));
  ph_phone({ tiles: 1 - 0.85 * gv, gridAl: gv * (0.46 + 0.16 * Math.sin(TT * Math.PI)), rows: 1, cols: gc, dip, scan: EZ.io(seg(TT, VE('end', 'tay'), VE('end', 'tay') + 0.4)) });
  // the hero: touching the whole era (bare finger), a slow look around; a small press on "lấy"; happy at the end
  const e = ph_env('end', 0.5, 0.6);
  const sq = 0.35 * Math.max(0, kick(TT, tLay, { k: 120, damp: 0.5 })) * (TT < tLay + 1.2 ? 1 : 0);
  const look = (TT < tChi ? 0.4 * Math.sin((TT - t0) * 1.4) : -0.35 + 0.25 * Math.sin((TT - t0) * 1.1)) * e;
  heroFinger(TOUCH[0], TOUCH[1], HR, { look, squash: sq, tilt: 0.2 * Math.cos((TT - t0) * Math.PI) * e, mood: TT > tLay + 0.4 ? 'happy' : 'calm' });
  // the faint found point over the tip (after the hero)
  const ck = clamp(spring(TT, tLay + 0.1, { k: 140, damp: 0.6 }));
  crosshair(TOUCH_PT[0], TOUCH_PT[1], 30, ck, { al: 0.45 });
  viTag('10', 'chỗ bị lấy mất');
  // "hụt": the word from the grid scenes, beside the dip
  ph_label('hụt', 760, 690, tLay - 0.05, { col: PAL.text, to: [618, 752] });
  // "không nhìn thấy": the grid under the glass gets its name once the columns are in
  ph_label('lưới', 200, 600, VW('end', 'tay') + 0.1, { col: PAL.text, to: [290, 700] });
  ph_caption(['không thấy ngón tay,', 'chỉ thấy chỗ bị lấy mất'], [t0 + 0.1, tChi], { his: [[0, 'không thấy', tKh + 0.05, '#e4e4ea'], [1, 'bị lấy mất', tLay, COL.fieldL]] });
};
