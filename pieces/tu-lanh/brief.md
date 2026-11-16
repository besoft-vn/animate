# Brief — "Tủ lạnh làm lạnh như thế nào?" (Vạn vật vận hành như thế nào, 15/11/2026)

**Idea (one line):** A fridge doesn't make cold — it carries heat out. **Device:** the hero dot (terracotta, asterisk, eyes) *is a bit of heat* ("hạt nhiệt"). We follow it from a warm bowl of soup, through the refrigerant loop, out of the coils into the kitchen. **The end is the start, changed:** the same kitchen, the soup now cold, the hero sitting warm behind the fridge.

**Format:** F5 fixed-hero journey (proven), morph-joined; one hard cut (the slam) on the thermostat click. **Style:** crosshatch — cream paper + wood for the kitchen (outside), navy "inside the machine" for the loop. **9:16, 1080×1920, 24 fps, 120 BPM grid, ~47 s, Vietnamese voice-over** (the voice is the clock — see `src/head.html`).

**Colour means one thing:** TERRACOTTA / warm = heat (hero, hot pipes, the warm back of the fridge). CYAN = cold (cold pipes, frost, the sweat drop). Never use terracotta for decoration, never cyan for something warm. `tempCol(u)` in `src/props.js` gives the colour between them.

## Beats (one per voice line; era = from the 8th after the previous line ends)

| # | id | voice (vi) | picture | bridge out |
|---|---|---|---|---|
| 1 | hook | Tủ lạnh không hề tạo ra hơi lạnh. | Kitchen on wood/paper: a closed fridge (cream, inked, hatched), a steaming bowl of canh on the counter; the hero sits on the bowl (≈700,1010). On "không hề", a red pencil (planInk) crosses out a hand-lettered "máy tạo lạnh" note stuck on the fridge. | hero → hero |
| 2 | turn | Nó làm một việc lạ hơn: bê hơi nóng trong tủ, đổ ra ngoài bếp. | Cut-away fridge (door open / see-through side view): the bowl inside, small heat motes rise off the food, get picked up, carried along the back, dumped out the back coil with warm hatching. Hero rides with them, ends at the back (880,760). | hero → hero |
| 3 | sweat | Bí mật thì bạn đã biết rồi: mồ hôi bay hơi, mang hơi nóng đi, nên da thấy mát. | Extreme close-up of a forearm (skin, pencil hatching), sweat drops (cyan); a drop evaporates into wisps that carry heat motes (and the hero) away; skin goes from warm hatching to calm. Ends on one big cyan drop centred (540,900, rx105 ry140). | drop → loop ring |
| 4 | loop | Trong tủ có một vòng ống kín, chứa chất làm lạnh sôi ở khoảng âm mười hai độ. | Navy world, the loop map: a rounded-rect pipe ring (RING) written on, 4 stations labelled: dàn lạnh (top), máy nén (right), dàn nóng (bottom), ống mao (left). Thermometer reads −12°C on "âm mười hai độ". Hero appears at the dàn lạnh station (540,470). | hero → hero |
| 5 | evap | Ở dàn lạnh, nó sôi lên, hút hơi nóng từ đồ ăn của bạn. | Close-up of the evaporator: a zig-zag cyan pipe inside the fridge; bubbles boil in it on "sôi lên"; the soup bowl below gives up heat motes that leap into the pipe; the hero leaps in on "hút", carried right with the vapour (800,820). | hero → hero |
| 6 | comp | Máy nén ép hơi ấy lại. Bị nén, nó nóng lên, nóng hơn cả căn bếp. | Inside the compressor: a piston/cylinder squeezing the vapour; motes crowd together, the gas colour goes cyan → terracotta on "nóng lên"; a thermometer passes the kitchen temperature. Hero squeezed, centred (540,760). | hero → hero |
| 7 | cond | Nên ở dàn nóng sau lưng tủ, nhiệt tự chảy ra phòng, và hơi ngưng lại thành lỏng. | The back coil (condenser) with fins, glowing warm; heat motes and the hero drift OUT into the kitchen air (arrows "→ phòng"); inside the pipe the gas condenses into cyan-ish liquid drops; one drop ends centred low (540,1080, r90). | drop → drop |
| 8 | valve | Qua một ống mao nhỏ xíu, áp suất tụt mạnh, chất lỏng lạnh buốt trở lại. | The drop enters a very thin capillary tube (300,760); a pressure gauge needle falls on "tụt mạnh"; it bursts out the far end as a frosty cyan spray (puff at 700,800, r170), frost crystals. | puff → loop ring |
| 9 | cycle | Vòng ấy cứ quay mãi, cho tới khi trong tủ chỉ còn bốn độ. | The loop map again, now running fast (flow dashes), motes leaving at the bottom each lap; a thermometer for the fridge falls 25 → 4°C on "bốn độ". Then **silence** (held frame, everything stops but the boil). | **SLAM** hard cut on the click |
| 10 | end | Vì thế sau lưng tủ lạnh luôn ấm: đó chính là hơi nóng từ đồ ăn của bạn. | Kitchen again (same framing as 1), but turned to show the back of the fridge: warm coil, the hero sitting there content beside the heat motes; the soup inside is cold (no steam, a little frost). Tag: "sau lưng tủ = hơi nóng của đồ ăn". | — |

## Sound plan
Thin pad through the kitchen; the loop act adds a pulse; bubbling blips in evap, a compressor thump (low) in comp, a hiss sweep in valve; densest in "cycle"; then near-silence ~0.8 s; the **thermostat click** ("tách") = the loudest hit, on the slam; a flat warm chord under the last line.

## Claims + sources (research.md)
- A fridge moves heat out; boiling refrigerant absorbs heat — Penn State EGEE 102: https://courses.ems.psu.edu/egee102/node/2402
- Sweat cooling by evaporation — HyperPhysics: https://hyperphysics.gsu.edu/hbase/thermo/sweat.html
- Cycle: compressor → condenser → capillary/expansion → evaporator — https://en.wikipedia.org/wiki/Vapor-compression_refrigeration
- R600a (isobutane) boils at −11.7 °C at 1 atm ("khoảng âm mười hai độ") — https://en.wikipedia.org/wiki/Isobutane
- Fridge ≤ 4 °C (40 °F) — FDA: https://www.fda.gov/food/buy-store-serve-safe-food/refrigerator-thermometers-cold-facts-about-food-safety
- Thermostat switches the compressor — https://en.wikipedia.org/wiki/Refrigerator
- The back is warm because the heat taken from inside is released at the condenser — Penn State (above)
