// stub (agent replaces)
for (const id of ['hook', 'engine', 'takeoff', 'end']) SCENES[id] = function () { sketchPage({ grid: 'plain' }); runway(); planeSide(PLANE.x, PLANE.y, 1, { exhaust: 1 }); heroAir(...BR.hookEngine.a, HR, { wind: 1 }); forceArrow(300, 700, 300, 450, { col: COL.lift }); viTag(id); pageCaption(['máy bay', 'hàng trăm tấn'], [[1, 'tấn']], { at: 0.5 }); };
