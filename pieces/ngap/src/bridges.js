// =====================================================================
//  ERAS, CAMERAS, BRIDGES — ngáp (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5) on the hero (the brain), except "payoff": a hard cut on the slam.
// =====================================================================
const ERA_BG = IDS.map(() => STYLE.paper);
const CAMS = {};                                                 // scene files may set CAMS.<id> = (t) => null | camOf(...)
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], p[2], 8);
const BRIDGES = [
  { tc: ET('warm'),   d: 0.5, A: () => HSP(BR.hookWarm.a),     B: () => HSP(BR.hookWarm.b) },
  { tc: ET('jaw'),    d: 0.5, A: () => HSP(BR.warmJaw.a),      B: () => HSP(BR.warmJaw.b) },
  { tc: ET('air'),    d: 0.5, A: () => HSP(BR.jawAir.a),       B: () => HSP(BR.jawAir.b) },
  { tc: ET('cool'),   d: 0.5, A: () => HSP(BR.airCool.a),      B: () => HSP(BR.airCool.b) },
  { tc: ET('season'), d: 0.5, A: () => HSP(BR.coolSeason.a),   B: () => HSP(BR.coolSeason.b) },
  { tc: ET('lay'),    d: 0.5, A: () => HSP(BR.seasonLay.a),    B: () => HSP(BR.seasonLay.b) },
  { tc: ET('social'), d: 0.5, A: () => HSP(BR.payoffSocial.a), B: () => HSP(BR.payoffSocial.b) },
  { tc: ET('end'),    d: 0.5, A: () => HSP(BR.socialEnd.a),    B: () => HSP(BR.socialEnd.b) },
];
// KHÔNG ĐƠ: every era breathes: a slow push-in and back out (≤ 6%) with a small drift, identity within 0.5 s of both
// boundaries. "lay" keeps drifting THROUGH the silence and "payoff" opens at the same zoom, so the hard cut changes the
// picture, not the scale.
const BREATHE = (id, z = 0.05, dy = 26) => (t) => {
  const u = seg(t, ET(id) + 0.5, EE(id) - 0.5), k = Math.sin(Math.PI * u);
  return camOf({ z: 1 + z * k, p: [540, 900], to: [540, 900 + dy * Math.sin(2 * Math.PI * u)] });
};
const LAY_U = (t) => seg(t, ET('lay') + 0.5, SLAM);
CAMS.lay = (t) => camOf({ z: 1 + 0.06 * LAY_U(t), p: [640, 800], to: [640, 800 + 30 * Math.sin(2 * Math.PI * LAY_U(t))] });
CAMS.payoff = (t) => { const u = seg(t, SLAM + 1.0, EE('payoff') - 0.5); return camOf({ z: lerp(1.06, 1.0, EZ.io(seg(t, SLAM, EE('payoff') - 0.5))), p: [640, 800], to: [640, 800 + 24 * Math.sin(2 * Math.PI * u)] }); };
CAMS.hook = (t) => { const u = seg(t, 0, EE('hook') - 0.5), k = Math.sin(Math.PI * u); return camOf({ z: 1 + 0.06 * k, p: [540, 900], to: [540 + 20 * Math.sin(3 * Math.PI * u), 900 + 40 * Math.sin(2 * Math.PI * u)] }); };
CAMS.end = (t) => { const u = seg(t, ET('end') + 0.5, DURATION); return camOf({ z: 1 + 0.07 * EZ.io(u), p: [540, 820], to: [540 + 30 * Math.sin(3 * Math.PI * u), 820 + 50 * Math.sin(2.5 * Math.PI * u)] }); };
for (const id of IDS) if (!CAMS[id]) CAMS[id] = BREATHE(id);
