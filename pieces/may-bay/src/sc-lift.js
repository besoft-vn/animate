// stub (agent replaces)
for (const id of ['push', 'lift', 'speed']) SCENES[id] = function () { sketchPage({ grid: 'plain' }); airfoil(); forceArrow(540, 860, 540, 450, { col: COL.lift, w: 70 }); forceArrow(820, 1050, 900, 1300, { col: COL.air }); heroAir(...BR.pressurePush.a, HR); viTag(id); };
