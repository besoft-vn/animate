# Brief — "Lò vi sóng làm nóng thức ăn ra sao?" (Vạn vật vận hành như thế nào, 17/11/2026)

**Idea (one line):** A microwave has no fire: it makes the water in the food spin back and forth billions of times a second, and that jostling *is* the heat. **Device:** the hero dot (terracotta, asterisk, eyes) *is one water molecule* — dotHero as the O plus two small H "ears" (`heroMol`). We meet it cold in a bowl of rice inside a closed oven, watch the waves arrive, dive into the rice (navy close-up), spin and jostle, then — hard cut — the rice steams. **The end is the start, changed:** the same oven framing, the same bowl, now steaming, the hero warm and happy.

**Format:** F5 fixed-hero journey (proven), morph-joined; one hard cut (SLAM) inside the pause after "jostle". **Style:** crosshatch — cream paper for the oven/kitchen, navy "inside the rice" for the molecules. **9:16, 1080×1920, 24 fps, 120 BPM grid, 57 s, Vietnamese voice-over** (Tuan Khang, eleven_v3; the voice is the clock — `src/head.html`).

**Colour means one thing:** TERRACOTTA = the hero AND heat (glow, steam, hot spots). YELLOW `COL.wave` = microwaves / the electric field only. COLD blue `COL.cold` = cold. Other water molecules: periwinkle/cream, warming via `tempCol(u)`.

## Beats (era = from the 8th after the previous line ends; ≈ times)

| # | id | ≈ t | voice (vi) | picture | bridge out |
|---|---|---|---|---|---|
| 1 | hook | 0–7 | Lò vi sóng không có lửa, cũng chẳng có dây đốt nóng, vậy mà thức ăn tự nóng lên. | `ovenFront('door')` on a wood counter; cold rice, a cold thermometer; red-pencil plan crosses out a flame and a glowing coil ("lửa?", "dây nóng?"); on "tự nóng lên" the cavity lamp comes on, plate turns. | CAV rect |
| 2 | magnet | 7–12.5 | Ở góc lò, ống magnetron phát ra vi sóng, một loại sóng vô tuyến. | Cut-away (`'cut'`): the magnetron in the panel corner (`magnetron()`), label "magnetron"; on "phát ra" one yellow wave writes on through the waveguide into the cavity; small card "sóng vô tuyến" | CAV rect |
| 3 | bounce | 12.5–16.75 | Vi sóng dội qua lại giữa các vách kim loại, tràn khắp khoang lò. | Same cut-away: one wave bouncing off walls (a zig-zag path written on, 3–4 bounces), then the cavity fills with a few faint wave bands; the hero pops up out of the rice at (440,960) at the end. | hero |
| 4 | water | 16.75–22.75 | Thức ăn chứa nhiều nước, mà mỗi phân tử nước có một đầu hơi dương, một đầu hơi âm. | Navy close-up: the hero large at centre with H ears; on "dương" a big "+" by the H side, on "âm" a big "−" by the O side; 4–6 other molecules float calmly. | hero |
| 5 | flip | 22.75–28.25 | Điện trường của vi sóng đổi chiều hàng tỷ lần mỗi giây, kéo chúng xoay theo. | A big yellow field arrow flipping up/down (fieldArrow), molecules (≤ 8, big) rotate to follow it, the hero too; tag "hàng tỷ lần / giây". | hero |
| 6 | jostle | 28.25–34 | Vô số phân tử nước xoay qua xoay lại, chen lấn, va vào nhau. | Molecules (≤ 10, r ≥ 40) spin back and forth faster, bump each other (small ink impact marks), slowly tinting toward terracotta; camera drifts in; through the pause it keeps drifting. | **SLAM** |
| 7 | heat | 34–37.5 | Sự rung lắc hỗn loạn ấy chính là nhiệt. | Hard cut: the rice mound big and close (circle (540,900,300)), steam rising (terracotta), warm hatching blooms; tag "rung lắc = nhiệt"; hero sits on top glowing. | disc |
| 8 | depth | 37.5–44 | Vi sóng chỉ thấm vào lớp ngoài chừng một xăng-ti-mét, phần lõi nóng dần nhờ nhiệt lan vào. | Cross-section of the food (disc (540,900,300)): an outer ring warms first (≈ "1 cm" label), then warmth creeps inward (terracotta front moving to the core); arrows inward. | disc |
| 9 | table | 44–49.25 | Sóng có chỗ mạnh chỗ yếu, nên đĩa xoay đưa món ăn đi khắp lượt. | Top-down cavity: turntable plate disc (540,900,300) with 3–4 soft yellow "strong spots" fixed in the cavity; the plate rotates so the bowl passes through them. | disc → bowl |
| 10 | end | 49.25–57 | Lần tới hâm cơm, hãy nhớ: hơi nóng sinh ra từ chính những giọt nước trong cơm. | Same as hook (door closed), display "0:00", the bowl steaming, hero sits on the rice warm & happy; tag "hơi nóng từ chính giọt nước". | — |

## Sound plan
Thin pad in the kitchen; oven hum from "phát"; a soft pulse thickening through water/flip/jostle; tiny ticks on the flips; soft knocks on the bumps; the pause after jostle keeps a faint bed + a small swell; the payoff chord **blooms** (0.3 s attack) on the SLAM; warm flat pad to the end; a soft "ding" chime on the last line.

## Claims + sources (research.md)
- Magnetron → waveguide → metal cavity; waves reflect off the walls; 2.45 GHz — FDA https://www.fda.gov/radiation-emitting-products/resources-you-radiation-emitting-products/microwave-ovens ; Wikipedia "Microwave oven"
- Microwaves are radio waves (radio-frequency) — FDA (above)
- Water molecules are electric dipoles that rotate to follow the alternating field; collisions turn it into heat — Wikipedia "Dielectric heating", "Microwave oven"
- Field oscillates 2.45 billion times/s → "hàng tỷ lần mỗi giây" (safe)
- Penetration ~1 cm in most foods; the inside heats by conduction (not "inside out") — Wikipedia "Microwave oven"; FDA
- Standing waves → hot/cold spots → turntable — Wikipedia "Microwave oven"; schoolphysics
