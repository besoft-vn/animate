// =====================================================================
//  ERAS, CAMERAS, BRIDGES — máy bay (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5) on the hero, except "lift": a hard cut on the payoff (the slam).
// =====================================================================
//            hook       engine     wing       bend       pressure   push       lift       speed      takeoff    end
const ERA_BG = ['#f2ead8', '#f2ead8', '#f2ead8', '#f2ead8', '#f2ead8', '#f2ead8', '#f2ead8', '#f2ead8', '#f2ead8', '#e8eef2'];
const CAMS = {};                                                 // scene files may set CAMS.<id> = (t) => null | push(...)
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], HR / 0.6, 8);                // STYLE.heroPts draws r * 0.6
const BRIDGES = [
  { tc: ET('engine'),   d: 0.5, A: () => HSP(BR.hookEngine.a),   B: () => HSP(BR.hookEngine.b) },
  { tc: ET('wing'),     d: 0.5, A: () => HSP(BR.engineWing.a),   B: () => HSP(BR.engineWing.b) },
  { tc: ET('bend'),     d: 0.5, A: () => HSP(BR.wingBend.a),     B: () => HSP(BR.wingBend.b) },
  { tc: ET('pressure'), d: 0.5, A: () => HSP(BR.bendPressure.a), B: () => HSP(BR.bendPressure.b) },
  { tc: ET('push'),     d: 0.5, A: () => HSP(BR.pressurePush.a), B: () => HSP(BR.pressurePush.b) },
  { tc: ET('speed'),    d: 0.5, A: () => HSP(BR.liftSpeed.a),    B: () => HSP(BR.liftSpeed.b) },
  { tc: ET('takeoff'),  d: 0.5, A: () => HSP(BR.speedTakeoff.a), B: () => HSP(BR.speedTakeoff.b) },
  { tc: ET('end'),      d: 0.5, A: () => HSP(BR.takeoffEnd.a),   B: () => HSP(BR.takeoffEnd.b) },
];
// KHUNG HÌNH GỌN: the kit's boiling page grain reads as noise on a phone — keep it faint
STYLE.post = () => grain({ n: 260, dark: 'rgba(60,56,52,0.08)', light: 'rgba(255,253,245,0.10)' });
// KHÔNG ĐƠ: slow push-ins (≤ 5%), centred, so quiet stretches breathe. push keeps drifting THROUGH the silence and lift
// opens at the same zoom, so the hard cut changes the picture, not the scale.
const DRIFT = (t0, t1, z = 1.04) => (t) => camOf({ z: 1 + (z - 1) * EZ.io(seg(t, t0, t1)), p: [540, 900], to: [540, 900] });
CAMS.hook = (t) => camOf({ z: 1 + 0.04 * Math.sin(Math.PI * seg(t, 0, ET("engine") - 0.5)), p: [540, 900], to: [540, 900] });   // in and back out: identity at the bridge
const PU_Z = (t) => 1 + 0.05 * seg(t, ET('push') + 0.5, SLAM);
CAMS.push = (t) => camOf({ z: PU_Z(t), p: [540, 900], to: [540, 900] });
CAMS.lift = (t) => camOf({ z: lerp(1.05, 1.0, EZ.io(seg(t, SLAM, SLAM + 3.0))), p: [540, 900], to: [540, 900] });
CAMS.end = (t) => camOf({ z: 1 + 0.05 * seg(t, ET('end') + 0.5, DURATION - 1), p: [540, 900], to: [540, 900] });
