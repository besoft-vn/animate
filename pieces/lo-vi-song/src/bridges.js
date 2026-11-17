// =====================================================================
//  ERAS, CAMERAS, BRIDGES — lò vi sóng (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5), except "heat": a hard cut on the payoff (the slam).
// =====================================================================
//            hook       magnet     bounce     water      flip       jostle     heat       depth      table      end
const ERA_BG = ['#f4ecd9', '#f4ecd9', '#f4ecd9', '#0c0d1c', '#0c0d1c', '#0c0d1c', '#f4ecd9', '#f4ecd9', '#f4ecd9', '#f4ecd9'];
const CAMS = {};                                                 // scene files may set CAMS.<id> = (t) => null | push(...)
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], HR / 0.6, 8);                // STYLE.heroPts draws r * 0.6
const CIRC = (s, c) => ({ P: ellipsePts(s[0], s[1], s[2], s[2], 0, 64), c });
const cavPts = () => rrectPts(CAV.x, CAV.y, CAV.w, CAV.h, 26, 12);
const BRIDGES = [
  { tc: ET('magnet'), d: 0.5, A: () => ({ P: cavPts(), c: '#3a3530' }), B: () => ({ P: cavPts(), c: '#3a3530' }) },
  { tc: ET('bounce'), d: 0.5, A: () => ({ P: cavPts(), c: '#3a3530' }), B: () => ({ P: cavPts(), c: '#3a3530' }) },
  { tc: ET('water'),  d: 0.5, A: () => HSP(BR.bounceWater.a), B: () => HSP(BR.bounceWater.b) },
  { tc: ET('flip'),   d: 0.5, A: () => HSP(BR.waterFlip.a),   B: () => HSP(BR.waterFlip.b) },
  { tc: ET('jostle'), d: 0.5, A: () => HSP(BR.flipJostle.a),  B: () => HSP(BR.flipJostle.b) },
  { tc: ET('depth'),  d: 0.5, A: () => CIRC(BR.heatDepth.a, C.terra),  B: () => CIRC(BR.heatDepth.b, C.terra) },
  { tc: ET('table'),  d: 0.5, A: () => CIRC(BR.depthTable.a, COL.metal), B: () => CIRC(BR.depthTable.b, COL.metal) },
  { tc: ET('end'),    d: 0.5, A: () => CIRC(BR.tableEnd.a, COL.rice),   B: () => CIRC(BR.tableEnd.b, COL.rice) },
];
// KHUNG HÌNH GỌN: the kit's grain (2600 specks a frame) reads as noise on a phone — keep it faint
STYLE.post = () => grain({ n: 300 });
// KHÔNG ĐƠ: slow push-ins (≤ 5%) on quiet stretches, centred, linear; jostle keeps drifting THROUGH the silence and heat
// opens at the same zoom, so the hard cut changes the picture, not the scale
const DRIFT = (t0, t1, z = 1.04) => (t) => camOf({ z: 1 + (z - 1) * EZ.io(seg(t, t0, t1)), p: [540, 900], to: [540, 900] });

const JO_Z = (t) => 1 + 0.05 * seg(t, ET('jostle') + 0.5, SLAM);
CAMS.jostle = (t) => camOf({ z: JO_Z(t), p: [540, 900], to: [540, 900] });
CAMS.heat = (t) => camOf({ z: lerp(1.05, 1.0, EZ.io(seg(t, SLAM, SLAM + 3.0))), p: [540, 900], to: [540, 900] });
CAMS.end = (t) => camOf({ z: 1 + 0.05 * seg(t, ET('end') + 0.5, DURATION - 1), p: [540, 900], to: [540, 900] });
