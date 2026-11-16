// =====================================================================
//  ERAS, CAMERAS, BRIDGES — bầu trời xanh (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5), except "dome": a hard cut on the big hit (the slam).
// =====================================================================
const ERA_BG = ['#f2ead8', '#f2ead8', '#f2ead8', '#f2ead8', '#f2ead8', '#e6eef6', '#f2ead8', '#f6e3cf', '#f6e3cf'];
const CAMS = {};                                                 // scene files may set CAMS.<id> = (t) => null | push(...)
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], HR / 0.6, 8);                // STYLE.heroPts draws r * 0.6
const SUNP = (s, c) => ({ P: ellipsePts(s[0], s[1], s[2], s[2], 0, 64), c });
const BRIDGES = [
  { tc: ET('white'),   d: 0.5, A: () => SUNP(BR.hookWhite.a, COL.sun), B: () => SUNP(BR.hookWhite.b, COL.sun) },
  { tc: ET('waves'),   d: 0.5, A: () => HSP(BR.whiteWaves.a),   B: () => HSP(BR.whiteWaves.b) },
  { tc: ET('air'),     d: 0.5, A: () => HSP(BR.wavesAir.a),     B: () => HSP(BR.wavesAir.b) },
  { tc: ET('scatter'), d: 0.5, A: () => HSP(BR.airScatter.a),   B: () => HSP(BR.airScatter.b) },
  { tc: ET('violet'),  d: 0.5, A: () => HSP(BR.domeViolet.a),   B: () => HSP(BR.domeViolet.b) },
  { tc: ET('sunset'),  d: 0.5, A: () => HSP(BR.violetSunset.a), B: () => HSP(BR.violetSunset.b) },
  { tc: ET('end'),     d: 0.5, A: () => SUNP(BR.sunsetEnd.a, COL.orange), B: () => SUNP(BR.sunsetEnd.b, COL.orange) },
];
// KHUNG HÌNH GỌN: the kit's boiling page grain (1800 specks a frame) reads as noise on a phone — keep it faint
STYLE.post = () => grain({ n: 260, dark: 'rgba(60,56,52,0.08)', light: 'rgba(255,253,245,0.10)' });
