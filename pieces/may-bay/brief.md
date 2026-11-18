# Brief — "Máy bay nặng hàng trăm tấn sao vẫn bay được?" (Vạn vật vận hành như thế nào, 18/11/2026)

**Idea (one line):** the engines only push the plane forward; the wing — slightly curved and tilted — throws a huge stream of air DOWN, and the air pushes the wing UP: that push is lift, and it grows with the square of speed. **Device:** the hero (terracotta sketchbook doodle) IS one small parcel of air. It meets the heavy plane on the runway, rides the airflow over the wing, gets flung down behind it, and is part of the stream that holds the plane up at the end. **The end is the start, changed:** the same plane (same drawing, same size) — now in the sky, gear up, with the air stream under its wing and the hero in it.

**Format:** F5 fixed-hero journey, morph-joined on the hero; one hard cut (SLAM) into "lift" inside the 1.0 s pause after "push". **Style:** sketchbook (graphite + ink on a paper page). 9:16, 1080×1920, 24 fps, 120 BPM grid, 59.25 s, Vietnamese voice-over (Tuan Khang, eleven_v3; the voice is the clock — `src/head.html`).

**The plane always faces LEFT.** In every wing cross-section the leading edge is on the LEFT and the air flows LEFT → RIGHT.

**Colour = one meaning:** TERRACOTTA = the hero (air parcel) only · BLUE `COL.air`/`COL.airL`/`COL.airD` = air & airflow (streamlines, pressure zones, the air pushed down) · YELLOW `COL.lift` = LIFT only (the big up arrow) + the one highlighted caption word · graphite/ink = the plane, thrust, weight, everything else (thrust & weight arrows are graphite `forceArrow` with default col).

## KHUNG HÌNH GỌN / KHÔNG ĐƠ (channel rules 5b, 5c)
- One subject per frame, lots of bare paper (`sketchPage({ grid: 'plain' })`). No fields of dots/specks/motes/stars/clouds of particles. ≤ 6 airflow lines on screen. At most one small particle-type effect per scene.
- Every scene keeps a gentle purposeful motion tied to the words: chevrons riding the flow lines (`flowChevron`), the hero bobbing/drifting along, exhaust shimmer, labels writing on. Only the pause before the payoff (≤ 1 s, 31.5–32.5 s) may stand still. No stretch > 1.5 s where the frame is static.
- Text ≥ 50 px, inside x 60–940; main content y 380–1250; nothing important below y 1260 except the caption (y 1330–1440). Tag top-left via `viTag` (y 340).

## Beats (era ≈ times, from `voice.json`; cue actions on `VW(id, 'word')`)

| # | id | era (s) | voice (vi) | picture | bridge out (BR) |
|---|---|---|---|---|---|
| 1 | hook | 0–6.25 | Một chiếc máy bay nặng hàng trăm tấn, vậy mà thứ nâng nó lên lại là không khí. | The airliner `planeSide(PLANE…)` pencilled → inked on the runway; on "nặng" a big hanging weight tag / scale reading "hàng trăm tấn" (graphite, down arrow); on "không khí" the hero pops up beside the engine (BR.hookEngine.a), looking up at the plane, puzzled → "!" | hero [760,1058] |
| 2 | engine | 6.25–11 | Động cơ chỉ đẩy máy bay lao về phía trước, chứ không hề nhấc nó lên. | Same plane; engine exhaust on "đẩy"; a graphite thrust arrow pointing LEFT (forward) labelled "lực đẩy"; on "không hề nhấc" a pencilled UP arrow from the engine gets crossed out (red marker X once). Plane can creep forward slightly (runway dashes slide). Hero travels to BR.engineWing.a ahead of the nose. | hero [180,700]→[125,700] |
| 3 | wing | 11–16.75 | Việc nhấc là của đôi cánh: hơi cong, và nghiêng lên một góc nhỏ đón gió. | Big wing cross-section `airfoil()` pencilled on → inked; on "cong" a graphite camber line traced inside; on "nghiêng/góc" the chord line + a horizontal dashed line + an angle arc labelled "góc tấn"; on "đón gió" 2–3 blue flow lines write on from the left. Hero floats at BR.wingBend.a in the oncoming air. | hero [125,700] |
| 4 | bend | 16.75–22.75 | Khi máy bay lao nhanh, cánh bẻ cong dòng không khí, hắt nó chúi xuống phía sau. | Up to 6 `flowLine`s (h = −330, −210, −120, 130, 230, 340), chevrons riding them; the hero rides the upper stream over the wing (along `flowPts(-120)`) and on "hắt…chúi xuống" the downwash grows (`down` 0.6 → 1.5) and the hero is flung down behind the trailing edge to BR.bendPressure.a. Label "luồng khí chúi xuống" near the downwash. | hero [930,1060]→[540,640] |
| 5 | pressure | 22.75–27.5 | Phía trên cánh, áp suất giảm; phía dưới cánh, áp suất tăng. | Same wing; on "trên…giảm" a light `airZone` above labelled "áp suất thấp" (hero sits there, BR.pressurePush.a, slightly stretched); on "dưới…tăng" a deeper zone below (col COL.air) labelled "áp suất cao" with 3 short blue arrows pressing UP on the underside. | hero [540,640] |
| 6 | push | 27.5–32.5 | Cánh đẩy không khí xuống, thì không khí cũng đẩy ngược cánh lên. | Same wing (camera drifts in, CAMS.push). On "đẩy không khí xuống" a big BLUE `forceArrow` grows DOWN from behind/below the wing; on "đẩy ngược cánh lên" a graphite ghost of an up arrow starts to pencil on the wing — NOT yellow yet. Hero at [540,640] reacts. After VL('push').t1 (31.67) everything holds (the pause) to the SLAM 32.5. | **SLAM** |
| 7 | lift | 32.5–35.75 | Cú đẩy ngược ấy chính là lực nâng. | Complete on the first frame: the same wing, a HUGE yellow `COL.lift` arrow up from the wing, `viTagNow`, label "LỰC NÂNG" big; blue arrow down stays smaller; the hero cheering beside it, ends at BR.liftSpeed.a. | hero [820,560]→[180,600] |
| 8 | speed | 35.75–42 | Bay nhanh gấp đôi, lực nâng mạnh gấp bốn, nên máy bay phải chạy đà thật nhanh. | A simple chart drawn on the page: left "tốc độ ×1" with a small yellow lift arrow (1 block), right "tốc độ ×2" with a lift arrow 4× as tall (or 4 stacked blocks) on "gấp bốn"; card "×2 → ×4". Hero walks left→right along the bottom of the chart, ends BR.speedTakeoff.a. | hero [860,600]→[760,1058] |
| 9 | takeoff | 42–50.5 | Đủ nhanh, phi công nâng mũi lên, lực nâng vượt trọng lượng, và bánh xe rời đường băng. | The hook's runway & plane again. Runway dashes slide fast (rolling); on "nâng mũi" plane rotates nose-up (rot → 0.12); a yellow lift arrow vs a graphite weight arrow ("trọng lượng"), lift grows past weight on "vượt"; on "rời" the wheels leave the runway, plane climbs a little, gear starts up. Hero rides under the wing (ends at BR.takeoffEnd.a). | hero [600,1080] |
| 10 | end | 50.5–59.25 | Lần tới thấy máy bay trên trời, hãy nhớ: nó đang được cả một dòng không khí đỡ lên. | The same plane drawing in the sky (gear up, tiny pitch), a soft sky wash (`ERA_BG` tinted), the ground line far below; under the wing 3 blue down-flow strokes (the stream) + a modest yellow lift arrow; the hero happy in the stream under the wing; caption "không khí / đỡ máy bay" (highlight "đỡ"). Camera drifts in (CAMS.end). | — |

## Sound plan
Thin pad + low engine hum on the runway; a soft whoosh on "đẩy"; a soft 8th pulse thickening through bend/pressure/push; descending sweep on "hắt"; down/up sweeps on push; the pause keeps a faint bed + a small swell; the payoff chord BLOOMS (0.3 s attack) on the SLAM; ticks ×1 / ×4 on speed; engine spool on the takeoff, a soft chime as the wheels leave; warm pad to the end.

## Claims + sources (research.md)
- Wing turns a large mass of air downward (angle of attack + camber); lower pressure above, higher below; "both Bernoulli and Newton are correct" — NASA Glenn https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/bernoulli-and-newton
- Equal-transit-time is a myth (avoided) — NASA https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/wrong1.html
- Engines give thrust, not lift; level flight lift ≈ weight — FAA PHAK ch. 5
- L = Cl·½ρV²·A → ×2 speed = ×4 lift — NASA https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/
- "Hàng trăm tấn": A380 MTOW 575 t, 747-8I ≈ 448 t — FlightGlobal / Wikipedia list of airliners by MTOW
- Takeoff: accelerate, rotate (raise the nose → bigger angle of attack), lift > weight, lift-off — FAA PHAK; NASA flaps & slats
