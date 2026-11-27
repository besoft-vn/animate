// director's fallback: any era not registered by a scene file draws a blank page (removed at the end)
for (const id of IDS) if (!SCENES[id]) SCENES[id] = function () { sketchPage({ grid: 'plain' }); };
