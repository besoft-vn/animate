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
  { tc: ET('curie'),  d: 0.5, A: () => HSP(BR.dryCurie.a),    B: () => HSP(BR.dryCurie.b) },
  { tc: ET('warm'),   d: 0.5, A: () => HSP(BR.clickWarm.a),   B: () => HSP(BR.clickWarm.b) },
  { tc: ET('end'),    d: 0.5, A: () => HSP(BR.warmEnd.a),     B: () => HSP(BR.warmEnd.b) },
];
// KHÔNG ĐƠ: slow push-ins (≤ 4%), so quiet stretches breathe. curie keeps drifting THROUGH the silence and click opens
// at the same zoom, so the hard cut changes the picture, not the scale.
const CU_Z = (t) => 1 + 0.04 * seg(t, ET('curie') + 0.5, SLAM);
CAMS.curie = (t) => camOf({ z: CU_Z(t), p: [540, 1000], to: [540, 1000] });
CAMS.click = (t) => camOf({ z: lerp(1.04, 1.0, EZ.io(seg(t, SLAM, SLAM + 3.0))), p: [540, 1000], to: [540, 1000] });
CAMS.end = (t) => camOf({ z: 1 + 0.04 * seg(t, ET('end') + 0.5, DURATION - 1), p: [540, 800], to: [540, 800] });
