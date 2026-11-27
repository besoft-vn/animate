// =====================================================================
//  ERAS, CAMERAS, BRIDGES — cầu vồng (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5) on the hero, except "payoff": a hard cut on the payoff (the slam).
// =====================================================================
const ERA_BG = IDS.map(() => '#f2ead8');
const CAMS = {};                                                 // cameras are the director's (this file loads AFTER the scene files)
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], HR / 0.6, 8);                // STYLE.heroPts draws r * 0.6
const BRIDGES = [
  { tc: ET('setup'),   d: 0.5, A: () => HSP(BR.hookSetup.a),    B: () => HSP(BR.hookSetup.b) },
  { tc: ET('white'),   d: 0.5, A: () => HSP(BR.setupWhite.a),   B: () => HSP(BR.setupWhite.b) },
  { tc: ET('enter'),   d: 0.5, A: () => HSP(BR.whiteEnter.a),   B: () => HSP(BR.whiteEnter.b) },
  { tc: ET('reflect'), d: 0.5, A: () => HSP(BR.enterReflect.a), B: () => HSP(BR.enterReflect.b) },
  { tc: ET('angle'),   d: 0.5, A: () => HSP(BR.reflectAngle.a), B: () => HSP(BR.reflectAngle.b) },
  { tc: ET('one'),     d: 0.5, A: () => HSP(BR.angleOne.a),     B: () => HSP(BR.angleOne.b) },
  { tc: ET('circle'),  d: 0.5, A: () => HSP(BR.oneCircle.a),    B: () => HSP(BR.oneCircle.b) },
  { tc: ET('end'),     d: 0.5, A: () => HSP(BR.payoffEnd.a),    B: () => HSP(BR.payoffEnd.b) },
];
// KHUNG HÌNH GỌN: the kit's boiling page grain reads as noise on a phone — keep it faint
STYLE.post = () => grain({ n: 260, dark: 'rgba(60,56,52,0.08)', light: 'rgba(255,253,245,0.10)' });
// KHÔNG ĐƠ: every era breathes (slow push-in and back, ≤ 5 %, small drift; identity within 0.5 s of both boundaries).
// "circle" keeps drifting in THROUGH the silence and payoff opens at the same zoom, so the hard cut changes the
// picture, not the scale.
const BREATHE = (id, z = 0.05, dy = 30, dx = 18) => (t) => {
  const u = seg(t, ET(id) + 0.5, EE(id) - 0.5), k = Math.sin(Math.PI * u);
  return camOf({ z: 1 + z * k, p: [540, 860], to: [540 + dx * Math.sin(3 * Math.PI * u), 860 + dy * Math.sin(2 * Math.PI * u)] });
};
const CI_P = [540, 860];
const CI_Z = (t) => 1 + 0.06 * EZ.io(seg(t, ET('circle') + 0.5, SLAM));
CAMS.circle = (t) => camOf({ z: CI_Z(t), p: CI_P, to: CI_P });
CAMS.payoff = (t) => { const u = seg(t, SLAM, EE('payoff') - 0.5); return camOf({ z: lerp(1.06, 1.0, EZ.io(u)) + 0.02 * Math.sin(Math.PI * u), p: CI_P, to: [CI_P[0] + 18 * Math.sin(2 * Math.PI * u), CI_P[1]] }); };
CAMS.hook = (t) => { const u = seg(t, 0, EE('hook') - 0.5), k = Math.sin(Math.PI * u); return camOf({ z: 1 + 0.05 * k, p: [540, 860], to: [540 + 18 * Math.sin(3 * Math.PI * u), 860 + 30 * Math.sin(2 * Math.PI * u)] }); };
CAMS.end = (t) => { const u = seg(t, ET('end') + 0.5, DURATION); return camOf({ z: 1 + 0.05 * EZ.io(u), p: [540, 860], to: [540 + 18 * Math.sin(2 * Math.PI * u), 860 + 26 * Math.sin(1.5 * Math.PI * u)] }); };
for (const id of IDS) if (!CAMS[id]) CAMS[id] = BREATHE(id);
