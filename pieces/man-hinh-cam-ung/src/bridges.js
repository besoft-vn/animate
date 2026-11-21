// =====================================================================
//  ERAS, CAMERAS, BRIDGES — màn hình cảm ứng (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5) on the hero, except "locate": a hard cut on the payoff (the slam).
// =====================================================================
const ERA_BG = IDS.map(() => PAL.paper);
const CAMS = {};                                                 // scene files may set CAMS.<id> = (t) => null | camOf(...)
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], HR, 8);
const BRIDGES = [
  { tc: ET('grid'),   d: 0.5, A: () => HSP(BR.hookGrid.a),    B: () => HSP(BR.hookGrid.b) },
  { tc: ET('cap'),    d: 0.5, A: () => HSP(BR.gridCap.a),     B: () => HSP(BR.gridCap.b) },
  { tc: ET('scan'),   d: 0.5, A: () => HSP(BR.capScan.a),     B: () => HSP(BR.capScan.b) },
  { tc: ET('finger'), d: 0.5, A: () => HSP(BR.scanFinger.a),  B: () => HSP(BR.scanFinger.b) },
  { tc: ET('drop'),   d: 0.5, A: () => HSP(BR.fingerDrop.a),  B: () => HSP(BR.fingerDrop.b) },
  { tc: ET('sweep'),  d: 0.5, A: () => HSP(BR.dropSweep.a),   B: () => HSP(BR.dropSweep.b) },
  { tc: ET('glove'),  d: 0.5, A: () => HSP(BR.locateGlove.a), B: () => HSP(BR.locateGlove.b) },
  { tc: ET('end'),    d: 0.5, A: () => HSP(BR.gloveEnd.a),    B: () => HSP(BR.gloveEnd.b) },
];
// sweep keeps drifting in THROUGH the silence and locate opens at the same zoom, so the hard cut changes the
// picture, not the scale; locate then eases back to identity before its bridge out.
const SW_U = (t) => seg(t, ET('sweep') + 0.5, SLAM);
CAMS.sweep = (t) => camOf({ z: 1 + 0.06 * SW_U(t), p: TOUCH_PT, to: [TOUCH_PT[0], TOUCH_PT[1] + 26 * Math.sin(2 * Math.PI * SW_U(t))] });
CAMS.locate = (t) => { const u = seg(t, SLAM + 1.0, EE('locate') - 0.5); return camOf({ z: lerp(1.06, 1.0, EZ.io(seg(t, SLAM, EE('locate') - 0.5))) + 0.04 * Math.sin(Math.PI * u), p: TOUCH_PT, to: [TOUCH_PT[0] + 24 * Math.sin(2 * Math.PI * u), TOUCH_PT[1] + 36 * Math.sin(Math.PI * u)] }); };
CAMS.end = (t) => { const u = seg(t, ET('end') + 0.5, DURATION); return camOf({ z: 1 + 0.08 * EZ.io(u) + 0.03 * Math.sin(3 * Math.PI * u), p: TOUCH_PT, to: [540 + 40 * Math.sin(3 * Math.PI * u), TOUCH_PT[1] + 56 * Math.sin(2.5 * Math.PI * u)] }); };
// KHÔNG ĐƠ: hairlines on white barely change the picture, so every era without its own camera breathes: a slow
// push-in and back out (≤ 5%) with a small drift, identity within 0.5 s of both boundaries.
// stillcheck (mp4, 27×48) needs more than hairlines: z ≤ 8 %, a vertical drift and a small sideways sway.
const BREATHE = (id, z = 0.08, dy = 50, dx = 26) => (t) => {
  const u = seg(t, ET(id) + 0.5, EE(id) - 0.5), k = Math.sin(Math.PI * u);
  return camOf({ z: 1 + z * k, p: [540, 820], to: [540 + dx * Math.sin(3 * Math.PI * u), 820 + dy * Math.sin(2 * Math.PI * u)] });
};
for (const id of IDS) if (!CAMS[id]) CAMS[id] = BREATHE(id);
CAMS.hook = (t) => { const u = seg(t, 0, EE('hook') - 0.5), k = Math.sin(Math.PI * u); return camOf({ z: 1 + 0.08 * k, p: [540, 820], to: [540 + 30 * Math.sin(3 * Math.PI * u), 820 + 50 * Math.sin(2 * Math.PI * u)] }); };
