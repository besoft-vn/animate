// =====================================================================
//  ERAS, BRIDGES — mã QR (director's file; read by kit/morph.js and the pixel STYLE hooks)
//  One resolution for the whole piece (RES 270x480, 4 px per pixel), PAL16. Every boundary is a 1.0s bridge (d = 0.5)
//  on the hero, which stands at the same spot (HERO) in every scene; "payoff" is a hard cut (the slam).
// =====================================================================
const ERA_BG = IDS.map(() => PAL16.night);
const ERA_RES = IDS.map(() => RES);
const ERA_POST = IDS.map(() => ({ pal: PAL16, scan: 0.08, rim: [PAL16.white, PAL16.ink] }));
function pieceCam() { return null; }   // pixel art: no camera, things move instead
const HSP = (p) => SP(p[0], p[1], HR / 0.6, 8);   // STYLE.hero draws r * 0.6 = HR
const BRIDGES = [
  { tc: ET('bit'),    d: 0.5, A: () => HSP(BR.hookBit.a),      B: () => HSP(BR.hookBit.b) },
  { tc: ET('byte'),   d: 0.5, A: () => HSP(BR.bitByte.a),      B: () => HSP(BR.bitByte.b) },
  { tc: ET('finder'), d: 0.5, A: () => HSP(BR.byteFinder.a),   B: () => HSP(BR.byteFinder.b) },
  { tc: ET('zigzag'), d: 0.5, A: () => HSP(BR.finderZigzag.a), B: () => HSP(BR.finderZigzag.b) },
  { tc: ET('mask'),   d: 0.5, A: () => HSP(BR.zigzagMask.a),   B: () => HSP(BR.zigzagMask.b) },
  { tc: ET('ecc'),    d: 0.5, A: () => HSP(BR.maskEcc.a),      B: () => HSP(BR.maskEcc.b) },
  { tc: ET('end'),    d: 0.5, A: () => HSP(BR.payoffEnd.a),    B: () => HSP(BR.payoffEnd.b) },
];
