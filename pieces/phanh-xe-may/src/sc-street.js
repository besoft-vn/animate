// sc-street.js — stub (hook, tyre, front, end); owned by one animation agent
SCENES.hook = function () { paperSheet('hook', { ruled: false }); road(GROUND_Y, TT * 400); scooter({ spin: TT * 4, speed: 1, heat: seg(TT, 3, 5) }); inkTag('hook'); };
SCENES.tyre = function () { paperSheet('tyre', { ruled: false }); inkTag('tyre'); };
SCENES.front = function () { paperSheet('front', { ruled: false }); road(GROUND_Y, 0); scooter({ pitch: 0.04, squeeze: 1 }); };
SCENES.end = function () { paperSheet('end', { ruled: false }); road(GROUND_Y, 0); scooter({ heat: 0.6 }); };
