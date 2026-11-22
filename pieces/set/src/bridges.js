// =====================================================================
//  ERAS, CAMERAS, BRIDGES — sét (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5) on the hero, except "strike": a hard cut on the payoff (the slam).
// =====================================================================
const ERA_BG = IDS.map(() => '#f2ead8');
const CAMS = {};                                                 // cameras are the director's (this file loads AFTER the scene files)
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const HSP = (p) => SP(p[0], p[1], HR / 0.6, 8);                // STYLE.heroPts draws r * 0.6
const BRIDGES = [
  { tc: ET('cloud'),   d: 0.5, A: () => HSP(BR.hookCloud.a),     B: () => HSP(BR.hookCloud.b) },
  { tc: ET('collide'), d: 0.5, A: () => HSP(BR.cloudCollide.a),  B: () => HSP(BR.cloudCollide.b) },
  { tc: ET('charge'),  d: 0.5, A: () => HSP(BR.collideCharge.a), B: () => HSP(BR.collideCharge.b) },
  { tc: ET('leader'),  d: 0.5, A: () => HSP(BR.chargeLeader.a),  B: () => HSP(BR.chargeLeader.b) },
  { tc: ET('meet'),    d: 0.5, A: () => HSP(BR.leaderMeet.a),    B: () => HSP(BR.leaderMeet.b) },
  { tc: ET('heat'),    d: 0.5, A: () => HSP(BR.strikeHeat.a),    B: () => HSP(BR.strikeHeat.b) },
  { tc: ET('thunder'), d: 0.5, A: () => HSP(BR.heatThunder.a),   B: () => HSP(BR.heatThunder.b) },
  { tc: ET('end'),     d: 0.5, A: () => HSP(BR.thunderEnd.a),    B: () => HSP(BR.thunderEnd.b) },
];
// KHUNG HÌNH GỌN: the kit's boiling page grain reads as noise on a phone — keep it faint
STYLE.post = () => grain({ n: 260, dark: 'rgba(60,56,52,0.08)', light: 'rgba(255,253,245,0.10)' });
// KHÔNG ĐƠ: every era breathes (slow push-in and back, ≤ 6 %, small drift; identity within 0.5 s of both boundaries)
// unless set below. meet keeps drifting in THROUGH the silence and strike opens at the same
// zoom, so the hard cut changes the picture, not the scale.
const BREATHE = (id, z = 0.06, dy = 40, dx = 22) => (t) => {
  const u = seg(t, ET(id) + 0.5, EE(id) - 0.5), k = Math.sin(Math.PI * u);
  return camOf({ z: 1 + z * k, p: [540, 860], to: [540 + dx * Math.sin(3 * Math.PI * u), 860 + dy * Math.sin(2 * Math.PI * u)] });
};
const ME_Z = (t) => 1 + 0.06 * EZ.io(seg(t, ET('meet') + 0.5, SLAM));
CAMS.meet = (t) => camOf({ z: ME_Z(t), p: MEET, to: MEET });
CAMS.strike = (t) => { const u = seg(t, SLAM, EE('strike') - 0.5); return camOf({ z: lerp(1.06, 1.0, EZ.io(u)) + 0.02 * Math.sin(Math.PI * u), p: MEET, to: [MEET[0] + 18 * Math.sin(2 * Math.PI * u), MEET[1]] }); };
CAMS.hook = (t) => { const u = seg(t, 0, EE('hook') - 0.5), k = Math.sin(Math.PI * u); return camOf({ z: 1 + 0.06 * k, p: [540, 860], to: [540 + 22 * Math.sin(3 * Math.PI * u), 860 + 40 * Math.sin(2 * Math.PI * u)] }); };
CAMS.end = (t) => { const u = seg(t, ET('end') + 0.5, DURATION); return camOf({ z: 1 + 0.06 * EZ.io(u), p: [540, 860], to: [540 + 20 * Math.sin(2 * Math.PI * u), 860 + 30 * Math.sin(1.5 * Math.PI * u)] }); };
for (const id of IDS) if (!CAMS[id]) CAMS[id] = BREATHE(id);
