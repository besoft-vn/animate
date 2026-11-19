# Brief — "Vì sao nồi cơm điện tự nhảy nút giữ ấm?" (Vạn vật vận hành như thế nào, 19/11/2026)

**Idea (one line):** a mechanical rice cooker has no timer: a magnet holds the switch on by sticking to a ferrite disc under the pot; while there is water the pot bottom is stuck at ~100 °C; when the last water is gone the bottom heats past ~103 °C, the ferrite stops being magnetic, the magnet drops, and the switch pops to "giữ ấm".
**Device:** the hero is ONE DROP OF WATER (blue teardrop with two dark eyes, `heroDrop` in props.js). It is literally "giọt nước cuối cùng": it sits on the cooker, dives into the pot, boils at 100 °C, is the last drop to turn into steam (it becomes a little steam cloud, `steam: 1`) — and that is the moment the cooker clicks. **The end is the start, changed:** the same cooker from the outside, now on "giữ ấm" (knob up, warm lamp lit), the hero as a steam cloud above the vent.

**Format:** F5 fixed-hero journey, morph-joined on the hero; one hard cut (SLAM 40.0 s) into "click" inside the pause after "curie". **Style:** isometric (white ground, constant hairlines, white faces, springs; Pangolin text). 9:16, 1080×1920, 24 fps, 120 BPM grid, 55.75 s, Vietnamese voice-over (Tuan Khang, eleven_v3).

**Colour = one meaning:** BLUE `COL.water/waterL/waterM` = water, steam, the hero · ORANGE `COL.heat/heatL/heatM` = heat / hot (plate glow, heat arrows, hot readouts, lit lamps) · DARK accent `PAL.accent` = the magnet + its pull (dashed field lines) · grey hairlines = everything else.

## KHUNG HÌNH GỌN / KHÔNG ĐƠ (channel rules 5b, 5c)
- One subject per frame, white ground. No fields of dots. Bubbles ≤ 5 (r ≥ 14). Steam = 2–3 soft wisps, not particles.
- Every scene keeps gentle purposeful motion tied to the words (water surface waves, bubbles, heat arrows waving, current dashes running, hero bob/look, labels springing in). Only the pause 39.0–40.0 s may be still. No stretch > 1.5 s static.
- Text ≥ 50 px, inside x 60–940; main content y 380–1250; nothing important below y 1260 except the caption (`viCaption`, y 1290–1440). Tag top-left via `viTag` (y ≈ 330).

## Geometry (props.js)
- `cookerIso(o)` — the cooker outside (hook, warm, end). `cutaway(o)` — the front-on section (magnet … click): body x 170–910, y 410–1190; pot bottom y 1000; plate y 1008–1040; ferrite (540, 1019); magnet under it; lever pivot (390, 1118), knob on the left (≈ 173, 1110); lamps "nấu" (640, 1150) and "giữ ấm" (780, 1150). `thermoLens(cx, cy, R, z, o)` — a magnified round callout of the thermostat (use it whenever the magnet/ferrite matters). `tempCard(x, y, °C, {hot, fill})` — temperature readout; standard place (290, 392) top-left over the lid.
- Mechanism direction (CHECK!): pressing the knob DOWN tips the lever so its right end pushes the magnet UP against the ferrite (mag 1). When the ferrite loses magnetism the magnet FALLS (mag 0) and the knob pops UP. Heat flows UP from the plate into the pot. Steam goes UP and out of the vent.

## Beats (era times from voice.json; cue actions on `VW(id, 'word')`)

| # | id | era (s) | voice (vi) | picture | bridge out (BR) |
|---|---|---|---|---|---|
| 1 | hook | 0–6.25 | Nồi cơm điện không hề hẹn giờ, vậy mà nó biết đúng lúc cơm vừa cạn nước. | Cooker outside drops in on a spring (cook lamp on, knob down, steam wisps). On "hẹn giờ" a clock/timer icon springs in beside it and gets crossed out (grey X). On "cạn nước" the hero drop pops up on the lid, looks down at the cooker, "?" | hero [540,468] |
| 2 | magnet | 6.25–12.5 | Ấn nút nấu, một nam châm được đẩy lên, hít chặt vào miếng ferit dưới đáy nồi. | Cutaway (water full). On "ấn" the knob is pressed DOWN (mag 0→1 spring), lens opens on the thermostat; on "nam châm" label "nam châm", "đẩy lên" small up arrow, on "hít" dashed pull lines + label "ferit". Hero in the water above, watching. | hero [540,720] |
| 3 | heat | 12.5–17.5 | Lực hút ấy giữ cho mạch điện đóng, và mâm nhiệt bắt đầu nóng lên. | Same cutaway; contacts close (cook 0→1), current dashes run along the wire, "nấu" lamp lights; on "mâm nhiệt" plate glows orange (heat 0→1), 3 wavy heat arrows rise into the pot; label "mâm nhiệt". | hero [540,720] |
| 4 | boil | 17.5–23.25 | Nước sôi ở một trăm độ, và chừng nào còn nước, đáy nồi cứ đứng quanh mức đó. | Same cutaway, water boiling (bubbles), tempCard climbs to 100°C and HOLDS (needle wobble only) on "đứng quanh mức đó"; a small flat line graph optional. Hero bobs in the bubbling water. | hero [540,720] |
| 5 | steam | 23.25–28.75 | Nhiệt cấp thêm chỉ biến nước thành hơi, chứ không làm đáy nồi nóng hơn. | Heat arrows go into the water → turn into 2–3 steam wisps leaving through the vent; water level slowly falls; tempCard stays 100°C (label "vẫn 100°C"). | hero [540,720] |
| 6 | dry | 28.75–34.5 | Khi gạo hút hết nước và hơi bay đi, đáy nồi khô lại, nhiệt độ vọt lên. | Water level falls to 0, rice swells; on "hơi bay đi" the hero turns into steam (steam 0→1) and rises out through the vent to [760,360]; on "vọt lên" tempCard jumps 100→102 and turns orange (hot). | hero [760,360] (steam) |
| 7 | curie | 34.5–40.0 | Đến khoảng một trăm linh ba độ, miếng ferit bỗng mất từ tính. | Cutaway dry; lens on the thermostat; tempCard 102→103°C on "một trăm linh ba"; ferrite turns orange (ferHot 1); on "mất từ tính" the dashed pull lines fade out, label "mất từ tính". Camera drifts in (CAMS.curie). The pause 39.0–40.0: hold, the magnet trembles very slightly. | **SLAM** |
| 8 | click | 40.0–44.0 | Nam châm rơi xuống, và nút nhảy sang giữ ấm. | Complete on the first frame (`viTagNow`, caption `now: true`): magnet FALLS (mag 1→0 spring right at 40.0), lever tips, knob pops UP, "nấu" lamp off, "giữ ấm" lamp on; big label "cạch!" ; current dashes stop; plate glow fades. Hero (steam) cheers at [760,360]. | hero [760,360] |
| 9 | warm | 44.0–48.5 | Mạch nấu ngắt, chỉ còn chút nhiệt nhỏ giữ cho cơm ấm. | Cooker outside again, knob up, "giữ ấm" lamp lit; a faint small orange warmth glow/2 short soft heat wisps; label "giữ ấm". Hero steam cloud drifts above the vent. | hero [690,400] |
| 10 | end | 48.5–55.75 | Vậy đấy: nồi cơm không đếm phút, nó chờ giọt nước cuối cùng biến mất. | Same cooker (camera drifts in, CAMS.end); the crossed-out clock returns faintly on "không đếm phút"; on "giọt nước cuối cùng" the hero (steam) shows a ghost outline of its old drop shape, waves goodbye; caption "chờ giọt nước / cuối cùng". | — |

## Sound plan
Light pad; knob press = soft low blip; magnet catch = a small chime; low hum while heating; soft 8th pulse thickening through boil/steam/dry; airy up-sweeps for steam; the pause keeps a faint bed + small swell; payoff chord BLOOMS (0.3 s attack) on the SLAM with a gentle chime (no click/noise hit); warm low pad to the end; hero motif to close.

## Claims + sources (research.md)
- Magnet + temperature-sensitive ferrite thermostat; attraction holds the switch; ferrite loses magnetism near ~103 °C; magnet drops by gravity/spring, cook circuit opens — bimetalfuse.com explainer, Toshiba patent US4241288A, Wikipedia "Rice cooker".
- Water clamps the temperature at ~100 °C at sea level (latent heat) — see research.md.
- Keep-warm differs by model (bimetal switch / warming heater / resistor) → script says only "chút nhiệt nhỏ giữ cho cơm ấm".
- "Nồi cơm điện cơ / loại nút gạt" — electronic (micom/IH) cookers use sensors + a chip (not claimed in the video).
