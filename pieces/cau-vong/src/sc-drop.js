// =====================================================================
//  SC-DROP — enter (refraction in: violet bends most, red least), reflect (bounce off the back, out at the bottom:
//  the colours fan apart), angle (red returns at ~42°, violet ~40° to the sunlight continued).
//  ONE continuous close-up of ONE raindrop: all three eras draw through d_drop(), a pure function of TT, so the
//  picture is the same on both sides of 24.5 and 30.5 (the morphs read as one shot).
//  Colour: PALE YELLOW = the white sunbeam · SPEC = the colours of light · GREY-BLUE = the drop · graphite = normal,
//  bounce mark, guide line, angle arcs · TERRACOTTA = the hero (viewer) at DROP_EYE, looking up-right.
//  Geometry: dropTrace(DROP_C, DROP_R, n) for every colour (verified: P0 upper-left, P1 back/right, P2 bottom,
//  d3 down-left; red ≈ 42.4°, violet drawn ≈ 32.3° — exaggerated, hence "(vẽ phóng đại)").
// =====================================================================
const d_TR = SPEC.map((c) => dropTrace(DROP_C[0], DROP_C[1], DROP_R, c.n));
const d_P0 = d_TR[0].P0;
const d_EXIT = (i) => (i === 0 ? 330 : 300);                       // red reaches the hero's head; the rest pass above
const d_END = (i) => { const T = d_TR[i]; return [T.P2[0] + T.d3[0] * d_EXIT(i), T.P2[1] + T.d3[1] * d_EXIT(i)]; };
// a label written on at t0, faded out over [t1 - 0.25, t1]
function d_label(str, x, y, size, t0, t1, o = {}) {
  const f = t1 == null ? 1 : 1 - seg(TT, t1 - 0.25, t1); if (TT < t0 || f <= 0) return;
  alphaDo(f * (o.a ?? 1), () => label(str, x, y, size, { reveal: ev(t0, o.d ?? 0.35), key: 'd_lb' + str, col: o.col, align: o.align }));
}
// the cue times (from the voice)
const d_T = () => ({
  E: ET('enter'), R: ET('reflect'), A: ET('angle'), Z: EE('angle'),
  vao: VW('enter', 'vào'), be: VW('enter', 'bẻ'), tim: VW('enter', 'tím'), do_: VW('enter', 'đỏ'),
  doi: VW('reflect', 'dội'), sau: VW('reflect', 'sau'), lo: VW('reflect', 'ló'), cac: VW('reflect', 'các'), tach: VW('reflect', 'tách'),
  aDo: VW('angle', 'đỏ'), lech: VW('angle', 'lệch'), bon: VW('angle', 'bốn'), aTim: VW('angle', 'ánh', 2), bon2: VW('angle', 'bốn', 2),
});
// the hero: still at DROP_EYE within 0.5 s of every boundary, a gentle bob in between
function d_hero(t) {
  const T = d_T(), bnd = [T.E, T.R, T.A, T.Z];
  let w = 1; for (const b of bnd) w = Math.min(w, seg(Math.abs(t - b), 0.5, 1.0));
  const bob = w * 4 * Math.sin(TAU * (t - T.E) / 1.6);
  const wow = (t > T.tach && t < T.tach + 0.7) || (t > T.bon + 0.1 && t < T.bon + 0.9);
  const lookUp = t > T.bon - 0.3 && t < T.Z - 1 ? 0.75 : 1;         // eyes follow the red ray down to the face
  heroSide(DROP_EYE[0], DROP_EYE[1] + bob, HR, { up: lookUp, legs: true, mood: wow ? 'wow' : 'calm', key: 'd_hero' });
}
// THE DROP CLOSE-UP (all three eras)
function d_drop() {
  const t = TT, T = d_T();
  // the drop (draws on as we arrive), then stays
  raindrop(DROP_C[0], DROP_C[1], DROP_R, { key: 'd_rd', part: EZ.io(seg(t, T.E + 0.1, T.E + 0.9)) });
  // the white sunbeam from the left, stopping at the entry point P0
  const beamL = 60;
  sunBeam([beamL, d_P0[1]], [d_P0[0] + 4, d_P0[1]], 40, { key: 'd_beam', part: EZ.o2(seg(t, T.E + 0.4, T.be - 0.2)) });
  // the normal at P0 (dashed graphite), shown while the light bends
  const nx = (d_P0[0] - DROP_C[0]) / DROP_R, ny = (d_P0[1] - DROP_C[1]) / DROP_R;
  const nA = 1 - seg(t, T.R - 0.75, T.R - 0.5);
  if (t > T.be - 0.4 && nA > 0) guideLine([d_P0[0] + nx * 80, d_P0[1] + ny * 80], [d_P0[0] - nx * 95, d_P0[1] - ny * 95], { key: 'd_nrm', a: nA, part: seg(t, T.be - 0.4, T.be) });
  // dimming of the middle colours in "angle" (red & violet stay bold)
  const dim = seg(t, T.A + 0.5, T.A + 1.1);
  // the inside path: P0 -> P1 (on "bẻ": red & violet first, then the other four), P1 -> P2 (on "dội vào mặt sau")
  const order = [5, 4, 3, 2, 1, 0];                                    // violet first, red on top
  for (const i of order) {
    const Tr = d_TR[i], col = SPEC[i].col, edge = i === 0 || i === 5;
    const a = edge ? 1 : 1 - 0.72 * dim;
    const st1 = edge ? T.be : T.be + 0.8, p1 = EZ.io(seg(t, st1, st1 + 0.7));
    const pulse = i === 5 ? Math.sin(Math.PI * seg(t, T.tim, T.tim + 0.8)) : i === 0 ? Math.sin(Math.PI * seg(t, T.do_ - 0.1, T.do_ + 0.7)) : 0;
    const w = 5 + 3 * pulse + (edge ? 1.5 * dim : 0);
    lightRay([Tr.P0, Tr.P1], col, { key: 'd_in' + i, part: p1, w, a, head: p1 < 1 });
    const st2 = T.doi + 0.2 + i * 0.06, p2 = EZ.io(seg(t, st2, st2 + 0.9));
    lightRay([Tr.P1, Tr.P2], col, { key: 'd_bk' + i, part: p2, w, a, head: p2 < 1 });
    // out of the drop at the bottom, down-left toward the viewer (arrow heads)
    const st3 = T.lo + i * 0.08, p3 = EZ.o2(seg(t, st3, st3 + 1.0));
    lightRay([Tr.P2, d_END(i)], col, { key: 'd_out' + i, part: p3, w: edge ? 6 + 2 * dim : 6, a });
  }
  // the bounce mark at P1 (graphite ticks outside the back of the drop)
  const P1 = d_TR[2].P1, bm = EZ.back(seg(t, T.doi + 0.1, T.doi + 0.5)), bA = 1 - seg(t, T.A - 0.75, T.A - 0.5);
  if (bm > 0 && bA > 0) {
    const on = [(P1[0] - DROP_C[0]) / DROP_R, (P1[1] - DROP_C[1]) / DROP_R], an0 = Math.atan2(on[1], on[0]);
    const wig = 3 * Math.sin(TT * 5);
    for (const da of [-0.45, 0, 0.45]) {
      const an = an0 + da, r0 = 16, r1 = 16 + (30 + wig) * bm;
      gpencil([[P1[0] + Math.cos(an) * r0, P1[1] + Math.sin(an) * r0], [P1[0] + Math.cos(an) * r1, P1[1] + Math.sin(an) * r1]], { w: 4, key: 'd_bm' + da, a: bA });
    }
  }
  // labels — enter
  d_label('tím: cong nhiều', 250, 590, 54, T.tim - 0.4, T.R - 0.55, { col: SPEC_VIOLET });
  d_label('đỏ: cong ít', 250, 670, 54, T.tim + 0.4, T.R - 0.55, { col: SPEC_RED });
  // reflect
  d_label('phản xạ', 745, 660, 54, T.sau - 0.1, T.A - 0.55);
  if (t > T.sau && t < T.A - 0.55) {                                   // a short graphite pointer from the label to P1
    const k = ev(T.sau + 0.2, 0.3), f = 1 - seg(t, T.A - 0.8, T.A - 0.55);
    gpencil([[830, 640], [lerp(830, P1[0] - 14, k), lerp(640, P1[1] + 18, k)]], { w: 3.5, key: 'd_ptr', a: f });
  }
  d_label('tách màu', 720, 1085, 56, T.cac, T.A - 0.55);
  // the "exaggerated" note: from the moment the fan shows until just before the last bridge
  d_label('(vẽ phóng đại)', 740, 390, 56, T.tim + 0.2, T.Z - 0.55, { col: SK.ink, a: 0.9 });
  // angle: the sunlight's line continued (horizontal, going LEFT from the exit point) + the two arcs
  const angOff = T.Z - 0.55;
  const R2 = d_TR[0].P2, V2 = d_TR[5].P2;
  if (t > T.lech - 0.2 && t < angOff) {
    const f = 1 - seg(t, angOff - 0.25, angOff);
    guideLine(R2, [R2[0] - 400, R2[1]], { key: 'd_gl', a: f, part: EZ.io(seg(t, T.lech - 0.2, T.lech + 0.6)) });
    const aR = Math.atan2(d_TR[0].d3[1], d_TR[0].d3[0]), aV = Math.atan2(d_TR[5].d3[1], d_TR[5].d3[0]);
    angleArc(R2[0], R2[1], 150, Math.PI, aR, { key: 'd_arR', col: SPEC_RED, a: f, part: EZ.io(seg(t, T.bon - 0.3, T.bon + 0.3)) });
    angleArc(V2[0], V2[1], 255, Math.PI, aV, { key: 'd_arV', col: SPEC_VIOLET, a: f, part: EZ.io(seg(t, T.aTim, T.aTim + 0.6)) });
  }
  d_label('42°', 668, 1010, 60, T.bon - 0.05, angOff, { col: SPEC_RED });
  d_label('40°', 405, 965, 60, T.aTim + 0.35, angOff, { col: SPEC_VIOLET });
  d_hero(t);
}

SCENES.enter = function () {
  sketchPage({ grid: 'plain' });
  d_drop();
  viTag('khúc xạ');
  pageCaption(['Khúc xạ:', 'tím cong nhiều hơn đỏ'], [[0, 'Khúc xạ']], { size: 62, at: 0.25 });
};
SCENES.reflect = function () {
  sketchPage({ grid: 'plain' });
  d_drop();
  viTag('phản xạ');
  pageCaption(['Dội mặt sau, ló ra:', 'các màu tách hẳn'], [[1, 'tách hẳn']], { size: 62, at: 0.25 });
};
SCENES.angle = function () {
  sketchPage({ grid: 'plain' });
  d_drop();
  viTag('góc lệch');
  pageCaption(['Đỏ lệch khoảng 42°,', 'tím khoảng 40°'], [[0, '42°'], [1, '40°']], { size: 62, at: 0.25 });
};
