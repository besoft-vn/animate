// =====================================================================
//  ERAS, CAMERAS, BRIDGES — tủ lạnh (director's file; read by kit/morph.js)
//  Every era boundary is a 1.0s bridge (d = 0.5), except "end": a hard cut on the thermostat click (the slam).
// =====================================================================
const ERA_BG = ['#f4ecd9', '#f4ecd9', '#ebb68f', '#0c0d1c', '#0c0d1c', '#0c0d1c', '#0c0d1c', '#0c0d1c', '#0c0d1c', '#f4ecd9'];
// scene files may register a camera: CAMS.<id> = (t) => null | push(...) — identity within 0.5s of either era edge
const CAMS = {};
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], HR / 0.6, 8);                // STYLE.heroPts draws r * 0.6
const ringPts = () => rrectPts(RING.x - RING.w / 2, RING.y - RING.h / 2, RING.w, RING.h, RING.r, 10);
const BRIDGES = [
  { tc: ET('turn'),  d: 0.5, A: () => HSP(BR.hookTurn.a),  B: () => HSP(BR.hookTurn.b) },
  { tc: ET('sweat'), d: 0.5, A: () => HSP(BR.turnSweat.a), B: () => HSP(BR.turnSweat.b) },
  { tc: ET('loop'),  d: 0.5, A: () => ({ P: ellipsePts(...BR.sweatLoop.a, 0, 64), c: C.sky }), B: () => ({ P: ringPts(), c: C.cyan }) },
  { tc: ET('evap'),  d: 0.5, A: () => HSP(BR.loopEvap.a),  B: () => HSP(BR.loopEvap.b) },
  { tc: ET('comp'),  d: 0.5, A: () => HSP(BR.evapComp.a),  B: () => HSP(BR.evapComp.b) },
  { tc: ET('cond'),  d: 0.5, A: () => HSP(BR.compCond.a),  B: () => HSP(BR.compCond.b) },
  { tc: ET('valve'), d: 0.5, A: () => ({ P: ellipsePts(BR.condValve.a[0], BR.condValve.a[1], BR.condValve.a[2], BR.condValve.a[2], 0, 64), c: C.cyan }),
                              B: () => ({ P: ellipsePts(BR.condValve.b[0], BR.condValve.b[1], BR.condValve.b[2], BR.condValve.b[2], 0, 64), c: C.cyan }) },
  { tc: ET('cycle'), d: 0.5, A: () => ({ P: ellipsePts(BR.valveCycle.a[0], BR.valveCycle.a[1], BR.valveCycle.a[2], BR.valveCycle.a[2], 0, 64), c: C.skyL }), B: () => ({ P: ringPts(), c: C.cyan }) },
];
