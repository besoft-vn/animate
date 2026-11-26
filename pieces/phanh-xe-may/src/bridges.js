// =====================================================================
//  ERAS, CAMERAS, BRIDGES — phanh xe máy (director's file; read by kit/morph.js; loads AFTER the scene files)
//  Every boundary is a 1.0s bridge (d = 0.5) on a circle object (BR in head.html), except "payoff": the slam.
// =====================================================================
const ERA_BG = IDS.map(() => '#f4ecd9');
const CAMS = {};
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const CIRC = (s, c) => ({ P: ellipsePts(s[0], s[1], s[2], s[2], 0, 64), c });
const BRIDGES = [
  { tc: ET('lever'),   d: 0.5, A: () => CIRC(BR.hookLever.a, COL.bodyD),    B: () => CIRC(BR.hookLever.b, COL.bodyD) },
  { tc: ET('fluid'),   d: 0.5, A: () => CIRC(BR.leverFluid.a, COL.oil),     B: () => CIRC(BR.leverFluid.b, COL.oil) },
  { tc: ET('caliper'), d: 0.5, A: () => CIRC(BR.fluidCaliper.a, COL.steelD), B: () => CIRC(BR.fluidCaliper.b, COL.steelD) },
  { tc: ET('clamp'),   d: 0.5, A: () => CIRC(BR.caliperClamp.a, COL.steelD), B: () => CIRC(BR.caliperClamp.b, COL.steelD) },
  { tc: ET('heat'),    d: 0.5, A: () => CIRC(BR.clampHeat.a, COL.steelD),   B: () => CIRC(BR.clampHeat.b, COL.steelD) },
  { tc: ET('tyre'),    d: 0.5, A: () => CIRC(BR.heatTyre.a, C.terra),       B: () => CIRC(BR.heatTyre.b, C.terra) },
  { tc: ET('front'),   d: 0.5, A: () => CIRC(BR.payoffFront.a, COL.tyre),   B: () => CIRC(BR.payoffFront.b, COL.tyre) },
  { tc: ET('end'),     d: 0.5, A: () => CIRC(BR.frontEnd.a, COL.tyre),      B: () => CIRC(BR.frontEnd.b, COL.tyre) },
];
// KHUNG HÌNH GỌN: the kit's grain (2600 specks a frame) reads as noise on a phone — keep it faint
STYLE.post = () => grain({ n: 260 });
// KHÔNG ĐƠ: every era breathes (slow push-in and back, ≤ 5 %, small drift; identity within 0.5 s of both boundaries)
// unless set below. "tyre" keeps drifting in THROUGH the silence and payoff opens at the same zoom (hard cut changes the
// picture, not the scale).
const BREATHE = (id, z = 0.045, dy = 30, dx = 18) => (t) => {
  const u = seg(t, ET(id) + 0.5, EE(id) - 0.5), k = Math.sin(Math.PI * u);
  return camOf({ z: 1 + z * k, p: [540, 860], to: [540 + dx * Math.sin(3 * Math.PI * u), 860 + dy * Math.sin(2 * Math.PI * u)] });
};
const TY_P = [540, 860];
const TY_Z = (t) => 1 + 0.05 * EZ.io(seg(t, ET('tyre') + 0.5, SLAM));
CAMS.tyre = (t) => camOf({ z: TY_Z(t), p: TY_P, to: TY_P });
CAMS.payoff = (t) => { const u = seg(t, SLAM, EE('payoff') - 0.5); return camOf({ z: lerp(1.05, 1.0, EZ.io(u)) + 0.02 * Math.sin(Math.PI * u), p: TY_P, to: [TY_P[0] + 16 * Math.sin(2 * Math.PI * u), TY_P[1]] }); };
CAMS.hook = (t) => { const u = seg(t, 0, EE('hook') - 0.5), k = Math.sin(Math.PI * u); return camOf({ z: 1 + 0.04 * k, p: [540, 860], to: [540, 860 + 24 * Math.sin(2 * Math.PI * u)] }); };
CAMS.end = (t) => { const u = seg(t, ET('end') + 0.5, DURATION); return camOf({ z: 1 + 0.05 * EZ.io(u), p: [600, 900], to: [600 + 14 * Math.sin(2 * Math.PI * u), 900] }); };
for (const id of IDS) if (!CAMS[id]) CAMS[id] = BREATHE(id);
