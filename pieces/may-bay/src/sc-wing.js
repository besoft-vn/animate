// stub (agent replaces)
for (const id of ['wing', 'bend', 'pressure']) SCENES[id] = function () { sketchPage({ grid: 'plain' }); airZone(540, 700, 280, 90); airfoil(); for (const h of [-330, -200, -120, 130, 230, 340]) { const P = flowPts(h); flowLine(h); flowChevron(P, (TT * 0.3) % 1, { key: 'c' + h }); } heroAir(...BR.wingBend.a, HR, { wind: 1 }); viTag(id); };
