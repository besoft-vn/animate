// =====================================================================
//  ERAS, CAMERAS, BRIDGES — vết thương (director's file; read by kit/morph.js; loads AFTER the scene files)
//  Every boundary is a 1.0s bridge (d = 0.5) on the hero (the skin cell), except "meet": a hard cut on the slam.
// =====================================================================
const ERA_BG = IDS.map(() => STYLE.paper);
const CAMS = {};
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], p[2], 8);
const BRIDGES = [
  { tc: ET('plug'),  d: 0.5, A: () => HSP(BR.hookPlug.a),  B: () => HSP(BR.hookPlug.b) },
  { tc: ET('clot'),  d: 0.5, A: () => HSP(BR.plugClot.a),  B: () => HSP(BR.plugClot.b) },
  { tc: ET('clean'), d: 0.5, A: () => HSP(BR.clotClean.a), B: () => HSP(BR.clotClean.b) },
  { tc: ET('fill'),  d: 0.5, A: () => HSP(BR.cleanFill.a), B: () => HSP(BR.cleanFill.b) },
  { tc: ET('crawl'), d: 0.5, A: () => HSP(BR.fillCrawl.a), B: () => HSP(BR.fillCrawl.b) },
  { tc: ET('moist'), d: 0.5, A: () => HSP(BR.meetMoist.a), B: () => HSP(BR.meetMoist.b) },
  { tc: ET('scar'),  d: 0.5, A: () => HSP(BR.moistScar.a), B: () => HSP(BR.moistScar.b) },
  { tc: ET('end'),   d: 0.5, A: () => HSP(BR.scarEnd.a),   B: () => HSP(BR.scarEnd.b) },
];
// KHÔNG ĐƠ: every era breathes: a slow push-in and back out (≤ 6%) with a small drift, identity within 0.5 s of both
// boundaries. "crawl" keeps drifting in THROUGH the silence and "meet" opens at the same zoom, so the hard cut changes
// the picture, not the scale.
const BREATHE = (id, z = 0.05, dy = 26) => (t) => {
  const u = seg(t, ET(id) + 0.5, EE(id) - 0.5), k = Math.sin(Math.PI * u);
  return camOf({ z: 1 + z * k, p: [540, 860], to: [540 + 16 * Math.sin(3 * Math.PI * u), 860 + dy * Math.sin(2 * Math.PI * u)] });
};
const CR_U = (t) => seg(t, ET('crawl') + 0.5, SLAM);
CAMS.crawl = (t) => camOf({ z: 1 + 0.06 * EZ.io(CR_U(t)), p: [540, 760], to: [540, 760 + 20 * Math.sin(2 * Math.PI * CR_U(t))] });
CAMS.meet = (t) => { const u = seg(t, SLAM + 1.0, EE('meet') - 0.5); return camOf({ z: lerp(1.06, 1.0, EZ.io(seg(t, SLAM, EE('meet') - 0.5))), p: [540, 760], to: [540, 760 + 20 * Math.sin(2 * Math.PI * u)] }); };
CAMS.hook = (t) => { const u = seg(t, 0, EE('hook') - 0.5), k = Math.sin(Math.PI * u); return camOf({ z: 1 + 0.05 * k, p: [540, 860], to: [540 + 18 * Math.sin(3 * Math.PI * u), 860 + 30 * Math.sin(2 * Math.PI * u)] }); };
CAMS.end = (t) => { const u = seg(t, ET('end') + 0.5, DURATION); return camOf({ z: 1 + 0.06 * EZ.io(u), p: [540, 760], to: [540 + 20 * Math.sin(2 * Math.PI * u), 760 + 30 * Math.sin(1.5 * Math.PI * u)] }); };
for (const id of IDS) if (!CAMS[id]) CAMS[id] = BREATHE(id);
