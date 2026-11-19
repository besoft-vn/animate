SCENES.hook = function () { cookerIso({ cook: 1, steam: 0.6 }); heroDrop(...BR.hookMagnet.a, HR); viTag('01', 'nồi cơm điện'); viCaption(['không hẹn giờ'], [0, 'hẹn giờ']); };
SCENES.warm = function () { cookerIso({ warm: 1, knobUp: 1 }); heroDrop(...BR.warmEnd.a, HR, { steam: 1 }); };
SCENES.end = SCENES.warm;
