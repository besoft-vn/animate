// =====================================================================
//  ERAS, CAMERAS, BRIDGES — lộ khoá API (director's file; read by kit/morph.js)
//  Every boundary is a 1.0s bridge (d = 0.5) on the red key's ring, except "fake": a hard cut (the slam).
// =====================================================================
const ERA_BG = ['#f4ecd9', '#f4ecd9', '#0c0d1c', '#0c0d1c', '#0c0d1c', '#0c0d1c', '#0c0d1c', '#0c0d1c', '#f4ecd9', '#f4ecd9'];
const CAMS = {};
function pieceCam(era, t) { const f = CAMS[IDS[era]]; return f ? f(t) : null; }
const KEYP = (p) => ({ P: ellipsePts(p[0], p[1], 46 * KS, 46 * KS, 0, 64), c: C.red });
const BRIDGES = [
  { tc: ET('intro'), d: 0.5, A: () => KEYP(BR.hookIntro.a),  B: () => KEYP(BR.hookIntro.b) },
  { tc: ET('link1'), d: 0.5, A: () => KEYP(BR.introLink1.a), B: () => KEYP(BR.introLink1.b) },
  { tc: ET('link2'), d: 0.5, A: () => KEYP(BR.link1Link2.a), B: () => KEYP(BR.link1Link2.b) },
  { tc: ET('link3'), d: 0.5, A: () => KEYP(BR.link2Link3.a), B: () => KEYP(BR.link2Link3.b) },
  { tc: ET('link4'), d: 0.5, A: () => KEYP(BR.link3Link4.a), B: () => KEYP(BR.link3Link4.b) },
  { tc: ET('harm'),  d: 0.5, A: () => KEYP(BR.fakeHarm.a),   B: () => KEYP(BR.fakeHarm.b) },
  { tc: ET('lesson'),d: 0.5, A: () => KEYP(BR.harmLesson.a), B: () => KEYP(BR.harmLesson.b) },
  { tc: ET('fix'),   d: 0.5, A: () => KEYP(BR.lessonFix.a),  B: () => KEYP(BR.lessonFix.b) },
];
// KHUNG HÌNH GỌN: lighter grain than the kit default
STYLE.post = () => grain({ n: 700 });
