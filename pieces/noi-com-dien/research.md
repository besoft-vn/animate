# Research: Vì sao nồi cơm điện tự nhảy nút "giữ ấm"?

Scope: classic **mechanical** cookers ("nồi cơm điện cơ", the kind with a lever/push switch). Checked 2026-11-19.

## 1. Core idea (one sentence)
Under the pot sits a magnetic limiter: a permanent magnet held by a temperature-sensitive soft ferrite. While free water remains, boiling keeps the pot bottom at about 100 °C. Once the water is used up, the temperature climbs past that. At about 103 °C the ferrite stops attracting the magnet, the magnet drops and the cook contacts open. The cooker then runs only a low "keep-warm" heat.
- Magnet held by temperature-sensitive soft magnet, loses magnetism at 103 °C, drops by gravity and opens the contacts; water holds the pot at ≤100 °C: https://bimetalfuse.com/Working_Principle_of_Temperature_Control_Switch_for_Electric_Iron_and_Rice_Cooker
- Parts maker's spec: "strontium barium ferrite permanent magnet" + "nickel zinc ferrite temperature sensitive soft magnetic steel"; trigger = local boiling point + 0.5–4.0 °C: https://www.ayzeze.co.nl/en/products/66d7d3a0c65bb7010e441da5
- Toshiba patent US4241288A: holding member with a permanent magnet + magnetic member that "loses its magnetic property at the magnetic transformation point", worked by a lever: https://patents.google.com/patent/US4241288A/en
- Wikipedia: "When the water has all been absorbed, the temperature can rise above boiling point, which trips the thermostat": https://en.wikipedia.org/wiki/Rice_cooker

### Corrections and nuances to the brief
- **The ferrite has the Curie point, not the permanent magnet.** The permanent magnet stays magnetic. The soft ferrite (Ni-Zn type) loses its ferromagnetism above its Curie point, and it is reversible: it attracts again once it cools. Keep "nam châm" (the permanent magnet) separate from "ferit cảm nhiệt" (the temperature-sensitive ferrite). Curie definition: https://en.wikipedia.org/wiki/Curie_temperature
- **103 °C is typical, not universal.** The trip point is set slightly above the boiling point (TS + 0.5–4 °C, ayzeze above). Vietnamese retail pages give about 102 °C (https://meta.vn/hotro/top-noi-com-dien-gia-re-ban-chay-nhat-2370) and about 103 °C (https://fptshop.com.vn/tin-tuc/dien-may/co-nen-nau-nuoc-soi-bang-noi-com-dien-168586). The Toshiba patent gives "for example 130 °C" as T1. Script wording: "khoảng một trăm lẻ ba độ" or "hơi quá một trăm độ". **Do not say 105.**
- **Keep-warm is a separate element in the circuit, and designs vary.** Three are documented:
  - A bimetal keep-warm switch S2 that closes at about 60 °C and opens at about 80 °C (bimetalfuse link above).
  - A separate "warming heater" (Toshiba patent above).
  - A series resistor that cuts the heater to about 35 W (hobby teardown, weak source: https://eessential.blogspot.com/2026/05/).
  - Safe script wording: "chỉ còn một dòng nhiệt nhỏ để giữ ấm". Do not claim that every cooker has a separate keep-warm heater.
- **Latching is magnetic.** Pressing the button pushes the magnet up against the cold ferrite, and their attraction holds it there so you can let go. No mechanical latch holds it. At the trip temperature the attraction disappears and the magnet falls by gravity, helped by a spring or lever. That is the "cạch". (bimetalfuse link above)
- **Pressing again right after it trips won't hold**, because the ferrite is still above its Curie point. You have to wait for it to cool. This is an inference from the reversible Curie behaviour: present it as a hint, not as a sourced fact.

## 2. Process in order
1. Press/lower the switch ("nút gạt" down to Nấu/Cook). This lifts the permanent magnet against the ferrite, which is cold and magnetic, so the magnet sticks and holds the contacts closed (bimetalfuse).
2. The main heater (mâm nhiệt) gets full power. Water and rice heat up.
3. The water boils at 100 °C. While liquid water remains, the extra heat goes into making steam (latent heat), so the pot bottom stays at about 100 °C (sciencelearn, section 3).
4. The rice absorbs water and steam escapes. The bottom of the pot dries out.
5. With no water left to soak up heat, the bottom temperature rises quickly past 100 °C (Wikipedia; a Japanese patent describes "炊飯が終了すると、鍋の温度が急激に上昇する": https://patents.google.com/patent/JPS6064726U/en).
6. At about 103 °C the ferrite passes its Curie point and stops attracting the magnet.
7. The magnet drops by gravity, with a spring or lever helping. The switch pops up ("cạch") and the cook circuit opens.
8. Keep-warm takes over: the pot is held at about 60–80 °C by a bimetal switch (bimetalfuse), or at about 65 °C according to Wikipedia: https://en.wikipedia.org/wiki/Rice_cooker

## 3. Numbers
| Quantity | Value | Source |
|---|---|---|
| Boiling point of water at sea level | 100 °C | https://www.sciencelearn.org.nz/resources/237-hidden-heat |
| Latent heat of vaporisation | 2260 kJ/kg ("water at 100 °C into steam at 100 °C"; "no change in temperature" during the change) | https://www.sciencelearn.org.nz/resources/237-hidden-heat |
| Trip point (ferrite Curie point) | about 103 °C typical; spec = boiling point + 0.5–4 °C | bimetalfuse; ayzeze (above) |
| Keep-warm temperature | about 60–80 °C (bimetal cycling); about 65 °C (Wikipedia) | bimetalfuse; Wikipedia |
| Heater power (optional) | Patent embodiments use 300–1000 W elements. Household cookers are usually a few hundred W (exact figure varies by model; check a label if needed) | https://patents.google.com/patent/US4241288A/en |
| Ideal cooking (context) | about 98 °C for 20 min (Wikipedia, citing research) | https://en.wikipedia.org/wiki/Rice_cooker |

Why water "clamps" the temperature: while water is boiling, the heater's energy goes into turning water into steam instead of raising the temperature. The sensor cannot pass about 100 °C until the free water is gone. This is also why boiling plain water does not trip the cooker until the pot boils dry (fptshop 168586 above). The boiling point is lower at high altitude, and some limiters are specified relative to the local boiling point (ayzeze).

## 4. Misconceptions and modern cookers
- "It uses a timer": **false** for mechanical cookers. The switch reacts to temperature only, which is why less water means a shorter cook.
- "It weighs the rice or water / measures doneness": **false**. It senses only the pot-bottom temperature, and "dry bottom" equals "rice done".
- "The magnet is permanently ruined": **false**. The ferrite's change is reversible.
- Modern "micom"/fuzzy-logic and IH (induction, since 1988) cookers use thermistors and a microcontroller to adjust heat and time. Wikipedia: "may use fuzzy logic for more detailed temperature control"; induction from 1988: https://en.wikipedia.org/wiki/Rice_cooker. Digital cookers use thermistor sensors instead of magnetic switches (parts listing, weak source): https://www.manomano.co.uk/p/electric-rice-cooker-with-magnetic-steel-temperature-limiter-round-magnetic-steel-temperature-control-for-rice-cookers-universal-for-2500-3000w-218599539
- In the video, say "nồi cơm điện cơ / loại nút gạt" and add one line that "nồi điện tử dùng cảm biến và chip".

## 5. Vietnamese terms
- **lòng nồi**: inner pot. **mâm nhiệt**: heating plate (https://fptshop.com.vn/tin-tuc/dien-may/mam-nhiet-noi-com-dien-157413)
- **nam châm vĩnh cửu**: the permanent magnet. **ferit cảm nhiệt / "nam châm nhiệt"**: the temperature-sensitive ferrite. In repair jargon the whole unit is the "cục từ" or "bộ hạn nhiệt từ tính", and fptshop calls it the "bộ giới hạn nhiệt" (fptshop 168586).
- **điểm Curie / nhiệt độ Curie** ("Quy-ri").
- **rơ le nhiệt**: Vietnamese retail sites use this for the thermostat in the middle of the mâm nhiệt, and often describe it as a bimetal ("tấm kim loại"). That is inconsistent and blurs the magnet with the bimetal (https://www.dienmayxanh.com/vao-bep/ro-le-nhiet-noi-com-dien-va-tat-ca-nhung-dieu-can-biet-20583; https://fptshop.com.vn/tin-tuc/dien-may/ro-le-nhiet-noi-com-dien-160046). For the magnetic trip unit, prefer "công tắc từ / bộ hạn nhiệt nam châm". For the keep-warm part, use "công tắc lưỡng kim giữ ấm".
- **thanh nhiệt / điện trở giữ ấm**: the keep-warm heater or resistor. **lò xo**: spring. **cần gạt / nút gạt "Nấu" (Cook) – "Giữ ấm" (Warm)**.
- Numbers read aloud:
  - 100 °C = "một trăm độ"
  - 103 °C = "một trăm lẻ ba độ" (South) or "một trăm linh ba độ" (North)
  - 60–80 °C = "sáu mươi đến tám mươi độ"
  - 2260 kJ/kg = "hai nghìn hai trăm sáu mươi ki-lô-jun mỗi ki-lô-gam" (optional)

## 6. Claims to avoid or qualify
- History: Toshiba ER-4, launched 10 Dec 1955, is called "the world's first automatic electric rice cooker for home use" by Wikipedia, with some sources saying 1956: https://en.wikipedia.org/wiki/Rice_cooker. Toshiba's own museum says only "Japan's First Automatic Electric Rice Cooker" (1955): https://toshiba-mirai-kagakukan.jp/a-guide/en/history-zone/ichigoki/cooker.htm. **Safe wording: "năm 1955, Toshiba (Nhật) tung ra nồi cơm điện tự động đầu tiên của Nhật".** Avoid "đầu tiên thế giới". The ER-4 used an indirect double/triple pot with water in the outer pot, so do not claim it used the ferrite-magnet switch.
- Do not claim one exact Curie temperature for all cookers. Use "khoảng 103 °C".
- Do not say every cooker has a separate warming heater. Do not say the magnet itself "melts" or is destroyed.
- Most mechanism sources are parts-maker or retail pages, not peer-reviewed. The overall mechanism is consistent across the patent, the parts spec and Wikipedia.
