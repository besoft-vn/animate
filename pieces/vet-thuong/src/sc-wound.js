SCENES.plug = function () { skinSlice({ squash: 1, bleed: 0.6, blood: 0.4 }); heroCell(290, 650, 60); platelet(520, 900, 22, { stick: 1, face: true }); redCell(560, 960, 22); };
SCENES.clot = function () { skinSlice({ blood: 1, scab: 1, scabDry: 0.4 }); fibrinNet(360, 680, 720, 1000, 1); heroCell(290, 650, 60, { mood: 'wow' }); };
SCENES.clean = function () { skinSlice({ blood: 1, scab: 1, redness: 1 }); wbc(540, 880, 60, { eat: 0.8 }); germ(620, 820, 24); heroCell(290, 650, 60); };
