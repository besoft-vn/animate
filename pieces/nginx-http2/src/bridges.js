// =====================================================================
//  ERAS, CAMERAS, BRIDGES — nginx-http2 (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5) on the server's outline at SRV, except "root": a hard cut (the slam).
// =====================================================================
const PAPER = '#f4ecd9', NAVY = '#0c0d1c';
const ERA_BG_MAP = { hook: PAPER, cve: NAVY, since: PAPER, how: NAVY, impact: NAVY, risk: NAVY, root: NAVY, barrier: NAVY, check: PAPER, version: PAPER, disable: PAPER, trade: PAPER, upgrade: PAPER, four: PAPER, defend: NAVY, today: PAPER };
const ERA_BG = IDS.map((id) => ERA_BG_MAP[id]);
const CAMS = {};
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const SRVP = () => ({ P: rrectPts(SRV[0] - SW / 2, SRV[1] - SH / 2, SW, SH, 18, 8), c: '#e9e2d2' });
const BRIDGES = IDS.slice(1).filter((id) => id !== SLAM_ID).map((id) => ({ tc: ET(id), d: 0.5, A: SRVP, B: SRVP }));
STYLE.post = () => grain({ n: 700 });
