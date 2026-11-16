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
// KHÔNG ĐƠ: a slow push-in (≤ 4%) on scenes with quiet stretches, so the frame always breathes. Centred on the frame,
// continuous through the bridges (kit/morph.js maps bridge shapes through each era's camera); stops at the silence.
const DRIFT = (t0, t1, z = 1.04) => (t) => camOf({ z: 1 + (z - 1) * EZ.io(seg(t, t0, t1)), p: [540, 900], to: [540, 900] });
CAMS.hook = DRIFT(0, ET('white') + 0.5);
// scatter keeps drifting THROUGH the silence (a frozen camera reads as a stall) and the dome opens at the same zoom,
// so the hard cut changes the picture, not the scale
const SC_Z = (t) => 1 + 0.05 * seg(t, ET('scatter') + 0.5, SLAM);
CAMS.scatter = (t) => camOf({ z: SC_Z(t), p: [540, 900], to: [540, 900] });
CAMS.dome = (t) => camOf({ z: lerp(1.05, 1.0, EZ.io(seg(t, SLAM, SLAM + 3.0))), p: [540, 900], to: [540, 900] });
CAMS.end = (t) => camOf({ z: 1 + 0.06 * seg(t, ET('end') + 0.5, DURATION - 1), p: [540, 900], to: [540, 900] });   // linear: no slow ease-in at 50–52 s
