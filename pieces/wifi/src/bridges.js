// =====================================================================
//  ERAS, CAMERAS, BRIDGES — wifi (director's file; read by kit/morph.js; loads AFTER the scene files)
//  Every boundary is a 1.0s bridge (d = 0.5) on the hero (the pi creature at HOME), except "read": a hard cut on the slam.
//  Math style: the camera stays nearly still — a slow push (≤ 4%) and back inside each era, identity near boundaries.
// =====================================================================
const ERA_BG = IDS.map(() => STYLE.paper);
const CAMS = {};
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], p[2], 8);
const BRIDGES = [
  { tc: ET('bits'), d: 0.5, A: () => HSP(BR.hookBits.a), B: () => HSP(BR.hookBits.b) },
  { tc: ET('wave'), d: 0.5, A: () => HSP(BR.bitsWave.a), B: () => HSP(BR.bitsWave.b) },
  { tc: ET('mod'),  d: 0.5, A: () => HSP(BR.waveMod.a),  B: () => HSP(BR.waveMod.b) },
  { tc: ET('qam'),  d: 0.5, A: () => HSP(BR.modQam.a),   B: () => HSP(BR.modQam.b) },
  { tc: ET('ofdm'), d: 0.5, A: () => HSP(BR.qamOfdm.a),  B: () => HSP(BR.qamOfdm.b) },
  { tc: ET('fly'),  d: 0.5, A: () => HSP(BR.ofdmFly.a),  B: () => HSP(BR.ofdmFly.b) },
  { tc: ET('ack'),  d: 0.5, A: () => HSP(BR.readAck.a),  B: () => HSP(BR.readAck.b) },
  { tc: ET('end'),  d: 0.5, A: () => HSP(BR.ackEnd.a),   B: () => HSP(BR.ackEnd.b) },
];
const BREATHE = (id, z = 0.035) => (t) => {
  const u = seg(t, ET(id) + 0.5, EE(id) - 0.5), k = Math.sin(Math.PI * u);
  return camOf({ z: 1 + z * k, p: [500, 800], to: [500, 800] });
};
// fly keeps pushing in THROUGH the silence; read opens at the same zoom and eases back, so the cut changes the picture,
// not the scale.
const FL_U = (t) => seg(t, ET('fly') + 0.5, SLAM);
CAMS.fly = (t) => camOf({ z: 1 + 0.04 * EZ.io(FL_U(t)), p: [500, 800], to: [500, 800] });
CAMS.read = (t) => camOf({ z: lerp(1.04, 1.0, EZ.io(seg(t, SLAM + 1.0, EE('read') - 0.5))), p: [500, 800], to: [500, 800] });
CAMS.hook = (t) => { const u = seg(t, 0, EE('hook') - 0.5); return camOf({ z: 1 + 0.035 * Math.sin(Math.PI * u), p: [500, 800], to: [500, 800] }); };
CAMS.end = (t) => { const u = seg(t, ET('end') + 0.5, DURATION); return camOf({ z: 1 + 0.04 * EZ.io(u), p: [500, 800], to: [500, 800] }); };
for (const id of IDS) if (!CAMS[id]) CAMS[id] = BREATHE(id);
