// =====================================================================
//  sc-grid.js — the flat TOP VIEW of the electrode grid + the controller chip (owned by the sc-grid agent).
//  Eras: scan (04: the chip pulses each row in turn, every column meter fills to the same level), drop (06: the
//  readings at the crossings under the tip shrink and pale), sweep (07: a scan line sweeps the grid ~120×/s, the dip
//  zone is ringed), locate (08, HARD CUT on the SLAM: the dark crosshair lands on the tip = the dip's centre).
//  Layout: 5 rows (y 590..1070) × 4 columns (x 330..750); the tip TOUCH_PT (540, 770) sits exactly between the four
//  crossings (470|610, 710|830), so the dip spans 4 crossings. Rows are driven from their LEFT ends (the pulse runs
//  left -> right, away from the chip wiring); the columns' readings show as meters at their TOP ends.
//  Colour: BLUE = the drive pulse / the readings; dark = the crosshair (locate only); grey = glass, strips, chip.
// =====================================================================
const GR_COLS = [330, 470, 610, 750];
const GR_ROWS = [590, 710, 830, 950, 1070];
const GR_X0 = 280, GR_X1 = 800, GR_Y0 = 555, GR_Y1 = 1105;      // strip extents (= the grid edges)
const GR_PHONE = [225, 465, 630, 670, 44];                       // the phone outline (x, y, w, h, r)
const GR_CHIP = [540, 1192, 90];                                 // chipIcon centre + side
const GR_MT = 480, GR_MH = 64;                                   // column meters: top y, height
const GR_DIP_C = [1, 2], GR_DIP_R = [1, 2];                      // the 4 crossings around the tip (col, row index)
const gr_isDip = (i, j) => GR_DIP_C.includes(i) && GR_DIP_R.includes(j);
const GR_PULSE_P = 0.55;                                         // s per row for the drive pulse
const GR_FAINT = '#f1f1f4';

// 0 within `pad` s of either end of the era, 1 in the middle (eased)
const gr_env = (id, pad = 0.5, ramp = 0.6) => EZ.io(seg(TT, ET(id) + pad, ET(id) + pad + ramp)) * (1 - EZ.io(seg(TT, EE(id) - pad - ramp, EE(id) - pad)));

// a label on a soft white pill, springing in at t0 (now: already in)
function gr_label(str, x, y, t0, o = {}) {
  const size = o.size ?? 54;
  const a = (o.now ? 1 : clamp(spring(TT, t0, { k: 140, damp: 0.8 }))) * clamp(o.al ?? 1);
  if (a <= 0.001) return;
  const dy = o.now ? 0 : (1 - clamp(spring(TT, t0, { k: 140, damp: 0.8 }))) * 14;
  ctx.save(); ctx.font = `400 ${size}px ${VFONT}`; const w = ctx.measureText(str).width; ctx.restore();
  const al = o.align ?? 'center', x0 = al === 'left' ? x : al === 'right' ? x - w : x - w / 2;
  ctx.save(); ctx.globalAlpha = a;
  polyPath(rrectPts(x0 - 12, y - size * 0.92 + dy, w + 24, size * 1.2, size * 0.3, 4), true); ctx.fillStyle = PAL.face; ctx.fill();
  ctx.restore();
  vtext(str, x, y + dy, size, { col: o.col ?? PAL.text, align: al, al: a });
}

// the drive pulse phase: rows in turn from t0, GR_PULSE_P s per row
const gr_pulsePh = (t0) => (TT - t0) / GR_PULSE_P;

// the sweep's scan-line phase (in sweeps): fast from "quét", slows almost to a hold in the pause, continues in locate
const GR_R0 = 1 / 0.42, GR_R1 = 1 / 9;
function gr_scanRaw(t) {
  const tq = VW('sweep', 'quét'), a = VL('sweep').t1 - 0.1, b = a + 0.55;
  if (t < tq) return null;
  let p = GR_R0 * (Math.min(t, a) - tq);
  if (t > a) { const u = Math.min(t, b) - a, D = b - a; p += GR_R0 * u + (GR_R1 - GR_R0) * u * u / (2 * D); }
  if (t > b) p += GR_R1 * (t - b);
  return p;
}
let GR_OFF = null;
function gr_scanPh(t) {
  const p = gr_scanRaw(t); if (p == null) return null;
  if (GR_OFF == null) { const q = gr_scanRaw(SLAM); GR_OFF = 0.76 - (q - Math.floor(q)); }
  return p + GR_OFF;
}

// ---------------------------------------------------------------------
//  THE BOARD (one shared drawing). o: { build 0..1 (strips draw in), pulse (phase | null), pulseAl,
//  meters [4 fills 0..1] | null, discs 0..1, dip 0..1, ring 0..1, scan (phase | null), scanAl }
// ---------------------------------------------------------------------
function gr_board(o = {}) {
  const bd = o.build ?? 1;
  // phone outline
  const [px, py, pw, ph, pr] = GR_PHONE;
  polyPath(rrectPts(px, py, pw, ph, pr, 8), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge, 3); ctx.stroke();
  // wiring: rows (left ends) -> chip left pins; columns (bottom ends) -> chip top pins
  const [cx, cy, cs] = GR_CHIP;
  ctx.save(); ctx.globalAlpha = clamp(bd * 1.5);
  // rows: short stubs into ONE vertical trunk at x 250, down to the chip's left side
  const TX = 250, TY = GR_Y1 + 16;
  GR_ROWS.forEach((y) => { polyPath([[GR_X0, y], [TX, y]], false); hair(PAL.edge, 2.5); ctx.stroke(); });
  polyPath([[TX, GR_ROWS[0]], [TX, cy], [cx - cs / 2 - 16, cy]], false); hair(PAL.edge, 2.5); ctx.stroke();
  // columns: short stubs into ONE horizontal trunk, then down into the chip's top
  GR_COLS.forEach((x) => { polyPath([[x, GR_Y1], [x, TY]], false); hair(PAL.edge, 2.5); ctx.stroke(); });
  polyPath([[GR_COLS[0], TY], [GR_COLS[3], TY]], false); hair(PAL.edge, 2.5); ctx.stroke();
  polyPath([[cx, TY], [cx, cy - cs / 2 - 16]], false); hair(PAL.edge, 2.5); ctx.stroke();
  ctx.restore();
  chipIcon(cx, cy, cs, { al: clamp(bd * 1.5) });
  // row strips (horizontal), then column strips (vertical) on top
  GR_ROWS.forEach((y, j) => {
    const k = EZ.o2(seg(bd, j * 0.08, j * 0.08 + 0.6)); if (k <= 0.01) return;
    polyPath(rrectPts(GR_X0, y - 9, (GR_X1 - GR_X0) * k, 18, 8, 3), true); ctx.fillStyle = GR_FAINT; ctx.fill(); hair(PAL.edge, 2.5); ctx.stroke();
  });
  GR_COLS.forEach((x, i) => {
    const k = EZ.o2(seg(bd, 0.3 + i * 0.08, 0.9 + i * 0.08)); if (k <= 0.01) return;
    polyPath(rrectPts(x - 9, GR_Y0, 18, (GR_Y1 - GR_Y0) * k, 8, 3), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge, 2.5); ctx.stroke();
  });
  // the drive pulse: a short bright segment running along one row at a time (left -> right)
  if (o.pulse != null && o.pulse >= 0) {
    const j = Math.floor(o.pulse) % GR_ROWS.length, u = o.pulse - Math.floor(o.pulse), y = GR_ROWS[j];
    const L = 120, xh = lerp(GR_X0 - 20, GR_X1 + L, u), xa = clamp(xh - L, GR_X0, GR_X1), xb = clamp(xh, GR_X0, GR_X1);
    if (xb - xa > 2) {
      ctx.save(); ctx.globalAlpha = clamp(o.pulseAl ?? 1);
      polyPath([[xa, y], [xb, y]], false); hair(COL.fieldM, 14); ctx.stroke();
      polyPath([[lerp(xa, xb, 0.45), y], [xb, y]], false); hair(COL.field, 10); ctx.stroke();
      ctx.restore();
    }
  }
  // the column meters at the top ends: equal unless dipped
  if (o.meters) GR_COLS.forEach((x, i) => {
    const f = clamp(o.meters[i]);
    ctx.save(); ctx.globalAlpha = clamp(o.meterAl ?? 1);
    polyPath(rrectPts(x - 14, GR_MT, 28, GR_MH, 6, 3), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge, 2.5); ctx.stroke();
    if (f > 0.02) {
      const h = (GR_MH - 8) * f;
      polyPath(rrectPts(x - 10, GR_MT + GR_MH - 4 - h, 20, h, 4, 3), true); ctx.fillStyle = COL.fieldM; ctx.fill(); hair(COL.field, 2.5); ctx.stroke();
    }
    ctx.restore();
  });
  // the reading discs at every crossing (the dip: smaller + paler)
  const kd = o.discs ?? 0;
  if (kd > 0.01) GR_COLS.forEach((x, i) => GR_ROWS.forEach((y, j) => {
    const k = clamp(spring(kd * 2.5, (i + j) * 0.12, { k: 140, damp: 0.6 })); if (k <= 0.01) return;
    const dp = gr_isDip(i, j) ? clamp(o.dip ?? 0) : 0, r = lerp(22, 10, dp) * k;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = mixHex(COL.fieldM, COL.fieldL, dp); ctx.fill(); hair(mixHex(COL.field, COL.fieldM, dp), 3); ctx.stroke();
  }));
  // the scan line (sweep): a bright line moving top -> bottom with a pale band behind it
  if (o.scan != null) {
    const u = o.scan - Math.floor(o.scan), y = lerp(GR_Y0 - 10, GR_Y1 + 10, u);
    const dim = clamp(Math.min((y - 660) / 40, (880 - y) / 40)), a = clamp(o.scanAl ?? 1) * (1 - 0.72 * dim);
    ctx.save(); ctx.globalAlpha = a * 0.16;
    ctx.fillStyle = COL.fieldL; ctx.fillRect(GR_X0 - 14, Math.max(GR_Y0 - 10, y - 70), GR_X1 - GR_X0 + 28, Math.min(70, y - GR_Y0 + 10));
    ctx.globalAlpha = a;
    polyPath([[GR_X0 - 14, y], [GR_X1 + 14, y]], false); hair(COL.field, 5); ctx.stroke();
    ctx.restore();
  }
  // the dip zone ring (pale outline)
  const kr = clamp(o.ring ?? 0);
  if (kr > 0.01) {
    ctx.save(); ctx.globalAlpha = kr;
    polyPath(ellipsePts(TOUCH_PT[0], TOUCH_PT[1], 128 * (0.8 + 0.2 * kr), 116 * (0.8 + 0.2 * kr), 0, 72), true);
    ctx.setLineDash([14, 12]); ctx.lineDashOffset = -TT * 18; hair(COL.fieldM, 4); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  }
}

// ---------------------------------------------------------------------
//  SCAN (04) — "Con chip lần lượt gửi xung điện vào từng hàng, rồi đo xem mỗi cột nhận lại bao nhiêu."
//  The board draws in; "xung": a BLUE pulse runs along row 1, row 2, ... in turn (keeps running); "mỗi cột": the
//  column meters fill to the SAME level, label "bình thường". Hero hovers, following the pulse / the meters.
// ---------------------------------------------------------------------
SCENES.scan = function () {
  const t0 = ET('scan'), tX = VW('scan', 'xung'), tM = VW('scan', 'mỗi'), tB = VW('scan', 'bao');
  const meters = GR_COLS.map((_, i) => EZ.o3(ev(tM + 0.1 + i * 0.14, 0.6)) * (1 + 0.03 * Math.sin((TT - tM) * 3.2) * ev(tM + 1.2, 0.5)));
  gr_board({
    build: seg(TT, t0, t0 + 1.0),
    pulse: TT >= tX - 0.15 ? gr_pulsePh(tX - 0.15) : null, pulseAl: ev(tX - 0.15, 0.15),
    meters: TT >= tM ? meters : null, meterAl: ev(tM, 0.2),
  });
  gr_label('bình thường', 750, 440, tB - 0.1, { size: 52 });
  // hero hovering above the grid: drifts a little, eyes follow the pulse, then the meters
  const e = gr_env('scan'), [hx, hy] = HOVER;
  const ph = TT >= tX ? gr_pulsePh(tX - 0.15) : 0, pu = ph - Math.floor(ph);
  const look = TT < tX ? 0 : TT < tM ? lerp(-0.8, 0.8, pu) : 0.4 * Math.sin((TT - tM) * 1.4);
  heroFinger(hx + 18 * Math.sin((TT - t0) * 1.1) * e, hy - 10 * Math.sin((TT - t0) * 1.7) * e, HR,
    { key: 'hero', look: look * e, mood: TT >= tM + 0.3 && TT < tM + 1.5 ? 'wow' : 'calm' });
  viTag('04', 'chip dò lưới');
  viCaption(['xung vào từng hàng,', 'cột đo nhận lại'], [0, 'xung'], { at: tX - t0 });
};

// ---------------------------------------------------------------------
//  DROP (06) — "Vì vậy, các điểm giao ngay dưới ngón tay nhận được ít tín hiệu hơn hẳn."
//  Hero at TOUCH all era. Reading discs spring in at every crossing ("điểm giao"); "ngay dưới": the 4 crossings
//  around the tip shrink + pale, label "hụt"; those two columns' meters drop. The pulse keeps running, fainter.
// ---------------------------------------------------------------------
const gr_meters = (dip) => GR_COLS.map((_, i) => (GR_DIP_C.includes(i) ? lerp(1, 0.5, dip) : 1));
SCENES.drop = function () {
  const t0 = ET('drop'), tG = VW('drop', 'điểm'), tN = VW('drop', 'ngay'), tI = VW('drop', 'ít');
  const dip = EZ.io(ev(tN + 0.1, 0.7));
  gr_board({
    pulse: gr_pulsePh(t0), pulseAl: 0.55,
    meters: gr_meters(dip), discs: seg(TT, Math.min(t0 + 0.3, tG - 0.6), Math.min(t0 + 0.3, tG - 0.6) + 1.2), dip,
  });
  gr_label('hụt', 665, 670, tN + 0.5, { align: 'left' });
  const [hx, hy] = TOUCH;
  heroFinger(hx, hy, HR, { key: 'hero', look: (TT < tN ? 0 : 0.6 * Math.sin((TT - tN) * 1.6)) * gr_env('drop'), mood: TT >= tI - 0.1 && TT < tI + 1.3 ? 'wow' : 'calm' });
  viTag('06', 'tín hiệu hụt');
  viCaption(['dưới ngón tay:', 'tín hiệu hụt'], [1, 'hụt'], { at: tN - t0 });
};

// ---------------------------------------------------------------------
//  SWEEP (07) — "Chip quét cả lưới chừng một trăm hai mươi lần mỗi giây, tìm vùng bị hụt."
//  Drop's end state. "quét": a scan line sweeps the grid top -> bottom fast and repeatedly; "một": "~120 lần/giây";
//  "hụt": a pale dashed outline rings the dip zone. The pause: the line slows almost to a hold. Camera: CAMS.sweep.
// ---------------------------------------------------------------------
function gr_sweepState(t) {
  const ph = gr_scanPh(t), tq = VW('sweep', 'quét');
  return { meters: gr_meters(1), discs: 1, dip: 1, scan: ph, scanAl: ph == null ? 0 : clamp((t - tq) / 0.15), ring: EZ.o3(clamp((t - VW('sweep', 'hụt') + 0.05) / 0.6)) };
}
SCENES.sweep = function () {
  const t0 = ET('sweep'), tQ = VW('sweep', 'quét');
  const S = gr_sweepState(TT);
  // before "quét", the drive pulse is still ticking (as in drop); it hands over to the scan line
  gr_board({ ...S, pulse: TT < tQ + 0.2 ? gr_pulsePh(ET('drop')) : null, pulseAl: 0.55 * (1 - ev(tQ, 0.2)) });
  gr_label('hụt', 665, 670, 0, { now: true, align: 'left' });
  gr_label('~120 lần/giây', 690, 445, VW('sweep', 'một') - 0.05, { size: 54 });
  const [hx, hy] = TOUCH, tH = VW('sweep', 'hụt');
  heroFinger(hx, hy, HR, { key: 'hero', look: 0.5 * Math.sin((TT - t0) * 2.2) * gr_env('sweep', 0.5) * (1 - ev(tH, 0.5)), mood: TT >= tH ? 'wow' : 'calm' });
  viTag('07', 'quét cả lưới');
  viCaption(['quét ~120 lần/giây,', 'tìm vùng hụt'], [1, 'vùng hụt'], { at: tQ - t0 });
};

// ---------------------------------------------------------------------
//  LOCATE (08) — HARD CUT on the SLAM. "Tâm của vùng hụt ấy chính là chỗ ngón tay bạn đang chạm."
//  Complete on frame 1: sweep's last board (dip, ring, slow scan line) + the dark crosshair (r 86) circling the tip
//  BEHIND the hero (springs in big, settles, gentle pulse + echo rings), grey guide lines to the left / bottom grid edges ("y" / "x");
//  "chỗ": the label "chỗ chạm" replaces "hụt". Hero happy at TOUCH. Camera: CAMS.locate (starts at sweep's zoom).
// ---------------------------------------------------------------------
SCENES.locate = function () {
  const t0 = SLAM, tC = VW('locate', 'chỗ');
  const S = gr_sweepState(TT);
  // after the hold, the chip goes back to scanning (gently faster again) under the found point
  const uR = Math.max(0, TT - (t0 + 1.2)), DR = 1.2, R2 = 0.4;
  S.scan += R2 * (uR < DR ? uR * uR / (2 * DR) : DR / 2 + (uR - DR));
  gr_board({ ...S, scanAl: S.scanAl * (1 - 0.45 * EZ.io(seg(TT, t0 + 0.6, t0 + 1.6))), ring: 1 });
  // guide lines from the crosshair to the left and bottom grid edges, with "y" / "x"
  const [tx, ty] = TOUCH_PT;
  ctx.save(); ctx.setLineDash([12, 10]); ctx.lineDashOffset = -(TT - t0) * 20;
  polyPath([[tx - 130, ty], [GR_X0 - 10, ty]], false); hair(PAL.edge, 3); ctx.stroke();
  polyPath([[tx, ty + 130], [tx, GR_Y1 + 4]], false); hair(PAL.edge, 3); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();
  for (const [ex, ey] of [[GR_X0 - 10, ty], [tx, GR_Y1 + 4]]) { ctx.beginPath(); ctx.arc(ex, ey, 6, 0, TAU); ctx.fillStyle = PAL.edge; ctx.fill(); }
  // the crosshair circles the tip BEHIND the hero (the hero hides its centre): big at the cut, settles, breathes
  const s = 1 + 0.35 * Math.exp(-(TT - t0) * 5) * Math.cos((TT - t0) * 14) + 0.06 * Math.sin((TT - t0) * TAU * 0.8) * ev(t0 + 0.8, 0.5);
  crosshair(tx, ty, 86 * s, 1);
  // from "chỗ": a soft echo ring leaves the crosshair once a beat-pair (the found point keeps "pinging")
  if (TT > tC) { const u = mod(TT - tC, 1.5) / 1.5; ctx.save(); ctx.globalAlpha = 0.45 * (1 - u) * ev(tC, 0.3); ctx.beginPath(); ctx.arc(tx, ty, 92 + 70 * EZ.o2(u), 0, TAU); hair(PAL.accent, 3); ctx.stroke(); ctx.restore(); }
  gr_label('y', 250, 752, 0, { now: true, size: 50 });
  gr_label('~120 lần/giây', 690, 445, 0, { now: true, size: 54, al: 1 - EZ.io(seg(TT, t0 + 1.0, t0 + 1.8)) });
  gr_label('x', 570, 1040, 0, { now: true, size: 50, align: 'left' });
  // "hụt" hands over to "chỗ chạm"
  gr_label('hụt', 665, 670, 0, { now: true, align: 'left', al: 1 - ev(tC - 0.45, 0.25) });
  gr_label('chỗ chạm', 665, 670, tC - 0.05, { align: 'left' });
  const [hx, hy] = TOUCH;
  heroFinger(hx, hy, HR, { key: 'hero', mood: 'happy', look: 0.35 * Math.sin((TT - t0) * 1.5) * gr_env('locate', 0.5, 0.5) });
  viTagNow('08', 'chỗ chạm');
  viCaption(['tâm vùng hụt', '= chỗ chạm'], [1, 'chỗ chạm'], { now: true, col: '#e4e4ea' });
};
