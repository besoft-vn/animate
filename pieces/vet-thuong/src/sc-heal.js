SCENES.fill = function () { skinSlice({ blood: 1, scab: 1, fill: 0.8, collagen: 1, capil: 1 }); fibroblast(540, 940, 46); heroCell(290, 650, 60); };
SCENES.crawl = function () { skinSlice({ blood: 1, scab: 1, fill: 1, collagen: 1, capil: 1, epiL: 455, epiR: 625, partner: [625, 712, 50], partnerO: { stretch: 1 } }); heroCell(455, 712, 50, { stretch: 1 }); };
SCENES.meet = function () { skinSlice({ blood: 1, scab: 1, fill: 1, collagen: 1, capil: 1, epiL: 500, epiR: 580, lift: 0.4, partner: [580, 712, 50], partnerO: { mood: 'happy' } }); heroCell(500, 712, 50, { mood: 'happy' }); };
SCENES.scar = function () { skinSlice({ closed: 1, scar: 1, heroX: 490 }); heroCell(490, 650, 60); };
