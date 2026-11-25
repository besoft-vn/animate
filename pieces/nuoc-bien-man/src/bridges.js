// =====================================================================
//  ERAS, CAMERAS, BRIDGES — nước biển mặn (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5) on the hero, except "payoff": a hard cut on the payoff (the slam).
// =====================================================================
const ERA_BG = IDS.map(() => '#f2ead8');
const CAMS = {};                                                 // cameras are the director's (this file loads AFTER the scene files)
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], HR / 0.6, 8);                // STYLE.heroPts draws r * 0.6
const BRIDGES = [
  { tc: ET('rain'),    d: 0.5, A: () => HSP(BR.hookRain.a),      B: () => HSP(BR.hookRain.b) },
  { tc: ET('rock'),    d: 0.5, A: () => HSP(BR.rainRock.a),      B: () => HSP(BR.rainRock.b) },
  { tc: ET('river'),   d: 0.5, A: () => HSP(BR.rockRiver.a),     B: () => HSP(BR.rockRiver.b) },
  { tc: ET('vents'),   d: 0.5, A: () => HSP(BR.riverVents.a),    B: () => HSP(BR.riverVents.b) },
  { tc: ET('evap'),    d: 0.5, A: () => HSP(BR.ventsEvap.a),     B: () => HSP(BR.ventsEvap.b) },
  { tc: ET('time'),    d: 0.5, A: () => HSP(BR.evapTime.a),      B: () => HSP(BR.evapTime.b) },
  { tc: ET('balance'), d: 0.5, A: () => HSP(BR.payoffBalance.a), B: () => HSP(BR.payoffBalance.b) },
  { tc: ET('end'),     d: 0.5, A: () => HSP(BR.balanceEnd.a),    B: () => HSP(BR.balanceEnd.b) },
];
// KHUNG HÌNH GỌN: the kit's boiling page grain reads as noise on a phone — keep it faint
STYLE.post = () => grain({ n: 260, dark: 'rgba(60,56,52,0.08)', light: 'rgba(255,253,245,0.10)' });
// KHÔNG ĐƠ: every era breathes (slow push-in and back, ≤ 6 %, small drift; identity within 0.5 s of both boundaries)
// unless set below. "time" keeps drifting in THROUGH the silence and payoff opens at the same zoom, so the hard cut
// changes the picture, not the scale.
const BREATHE = (id, z = 0.05, dy = 36, dx = 20) => (t) => {
  const u = seg(t, ET(id) + 0.5, EE(id) - 0.5), k = Math.sin(Math.PI * u);
  return camOf({ z: 1 + z * k, p: [540, 860], to: [540 + dx * Math.sin(3 * Math.PI * u), 860 + dy * Math.sin(2 * Math.PI * u)] });
};
const TI_P = [560, 860];
const TI_Z = (t) => 1 + 0.06 * EZ.io(seg(t, ET('time') + 0.5, SLAM));
CAMS.time = (t) => camOf({ z: TI_Z(t), p: TI_P, to: TI_P });
CAMS.payoff = (t) => { const u = seg(t, SLAM, EE('payoff') - 0.5); return camOf({ z: lerp(1.06, 1.0, EZ.io(u)) + 0.02 * Math.sin(Math.PI * u), p: TI_P, to: [TI_P[0] + 18 * Math.sin(2 * Math.PI * u), TI_P[1]] }); };
CAMS.hook = (t) => { const u = seg(t, 0, EE('hook') - 0.5), k = Math.sin(Math.PI * u); return camOf({ z: 1 + 0.05 * k, p: [540, 860], to: [540 + 20 * Math.sin(3 * Math.PI * u), 860 + 36 * Math.sin(2 * Math.PI * u)] }); };
CAMS.end = (t) => { const u = seg(t, ET('end') + 0.5, DURATION); return camOf({ z: 1 + 0.05 * EZ.io(u), p: [540, 860], to: [540 + 20 * Math.sin(2 * Math.PI * u), 860 + 30 * Math.sin(1.5 * Math.PI * u)] }); };
for (const id of IDS) if (!CAMS[id]) CAMS[id] = BREATHE(id);
