// =====================================================================
//  ERAS, CAMERAS, BRIDGES — nồi cơm điện (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5) on the hero, except "click": a hard cut on the payoff (the slam).
// =====================================================================
const ERA_BG = IDS.map(() => PAL.paper);
const CAMS = {};                                                 // scene files may set CAMS.<id> = (t) => null | camOf(...)
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], HR, 8);
const BRIDGES = [
  { tc: ET('magnet'), d: 0.5, A: () => HSP(BR.hookMagnet.a),  B: () => HSP(BR.hookMagnet.b) },
  { tc: ET('heat'),   d: 0.5, A: () => HSP(BR.magnetHeat.a),  B: () => HSP(BR.magnetHeat.b) },
  { tc: ET('boil'),   d: 0.5, A: () => HSP(BR.heatBoil.a),    B: () => HSP(BR.heatBoil.b) },
  { tc: ET('steam'),  d: 0.5, A: () => HSP(BR.boilSteam.a),   B: () => HSP(BR.boilSteam.b) },
  { tc: ET('dry'),    d: 0.5, A: () => HSP(BR.steamDry.a),    B: () => HSP(BR.steamDry.b) },
  { tc: ET('curie'),  d: 0.3, m: 0.04, A: () => HSP(BR.dryCurie.a),    B: () => HSP(BR.dryCurie.b) },
  { tc: ET('warm'),   d: 0.5, A: () => HSP(BR.clickWarm.a),   B: () => HSP(BR.clickWarm.b) },
  { tc: ET('end'),    d: 0.5, A: () => HSP(BR.warmEnd.a),     B: () => HSP(BR.warmEnd.b) },
];
// KHÔNG ĐƠ: slow push-ins (≤ 4%), so quiet stretches breathe. curie keeps drifting THROUGH the silence and click opens
// at the same zoom, so the hard cut changes the picture, not the scale.
const CU_U = (t) => seg(t, ET('curie') + 0.5, SLAM);
CAMS.curie = (t) => camOf({ z: 1 + 0.07 * CU_U(t), p: [540, 1000], to: [540, 1000 + 34 * Math.sin(2 * Math.PI * CU_U(t))] });
CAMS.click = (t) => { const u = seg(t, SLAM + 1.0, EE('click') - 0.5); return camOf({ z: lerp(1.07, 1.0, EZ.io(seg(t, SLAM, SLAM + 3.5))), p: [540, 1000], to: [540, 1000 + 30 * Math.sin(2 * Math.PI * u)] }); };
CAMS.end = (t) => { const u = seg(t, ET('end') + 0.5, DURATION); return camOf({ z: 1 + 0.08 * EZ.io(u), p: [540, 800], to: [540 + 40 * Math.sin(3 * Math.PI * u), 800 + 60 * Math.sin(2.5 * Math.PI * u)] }); };
// KHÔNG ĐƠ (stillcheck, 19/11): hairlines on white barely change the picture, so every era without its own camera
// breathes: a slow push-in and back out (≤ 5%) with a small drift, identity within 0.5 s of both boundaries.
const BREATHE = (id, z = 0.05, dy = 26) => (t) => {
  const u = seg(t, ET(id) + 0.5, EE(id) - 0.5), k = Math.sin(Math.PI * u);
  return camOf({ z: 1 + z * k, p: [540, 900], to: [540, 900 + dy * Math.sin(2 * Math.PI * u)] });
};
for (const id of IDS) if (!CAMS[id]) CAMS[id] = ['hook', 'warm'].includes(id) ? BREATHE(id, 0.07, 44) : BREATHE(id);
// the hook has no bridge in: let it breathe from the first frame
CAMS.hook = (t) => { const u = seg(t, 0, EE('hook') - 0.5), k = Math.sin(Math.PI * u); return camOf({ z: 1 + 0.07 * k, p: [540, 900], to: [540 + 20 * Math.sin(3 * Math.PI * u), 900 + 44 * Math.sin(2 * Math.PI * u)] }); };
