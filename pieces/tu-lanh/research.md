# Nghiên cứu: Tủ lạnh làm lạnh như thế nào?

Ký hiệu: [ĐÃ KIỂM CHỨNG] = đã đọc trực tiếp trên trang nguồn (WebFetch). [CHỈ QUA TÌM KIẾM] = chỉ thấy trong đoạn trích kết quả tìm kiếm, chưa mở được trang. [CHƯA KIỂM CHỨNG] = suy luận/kiến thức chung, chưa có nguồn đọc trực tiếp.

## 1. Ý chính một câu

Tủ lạnh không "tạo ra lạnh": nó **bơm nhiệt** từ trong tủ ra ngoài phòng. Nó làm vậy nhờ cho một chất lỏng (môi chất lạnh) **bay hơi** bên trong tủ, và chất lỏng bay hơi thì hút nhiệt, giống mồ hôi bay hơi làm mát da. Sau đó máy nén ép hơi đó lại để xả nhiệt ra phía sau tủ.

- Mồ hôi bay hơi lấy "nhiệt hoá hơi" từ cơ thể: [ĐÃ KIỂM CHỨNG qua tìm kiếm, nguồn HyperPhysics] https://hyperphysics.gsu.edu/hbase/thermo/sweat.html
- Môi chất "lấy trộm" nhiệt từ không khí và thực phẩm trong tủ khi sôi ở dàn bay hơi: [ĐÃ KIỂM CHỨNG] Penn State EGEE 102 https://courses.ems.psu.edu/egee102/node/2402
- Khác biệt so với mồ hôi: mồ hôi bay đi mất (hệ hở). Tủ lạnh là vòng kín, dùng lại cùng một lượng môi chất mãi mãi.

## 2. Chu trình 4 bước (theo đúng chiều dòng môi chất)

Nguồn chính: [ĐÃ KIỂM CHỨNG] Penn State https://courses.ems.psu.edu/egee102/node/2402 ; Wikipedia "Vapor-compression refrigeration" https://en.wikipedia.org/wiki/Vapor-compression_refrigeration

| # | Bộ phận | Môi chất vào → ra | Điều gì xảy ra với nhiệt |
|---|---------|-------------------|--------------------------|
| 1 | **Máy nén** (lốc, compressor), thường ở góc dưới phía sau | Khí, áp suất thấp, lạnh → **khí áp suất cao, rất nóng** | Nén khí làm nó nóng lên, **nóng hơn không khí trong bếp**. Đây là bộ phận ăn điện nhiều nhất. |
| 2 | **Dàn nóng / dàn ngưng** (condenser), ống xoắn sau lưng hoặc dưới đáy tủ; nhiều tủ đời mới giấu ống trong vách hai bên hông | Khí nóng áp cao → **lỏng áp cao** (còn ấm) | Nhiệt chảy từ môi chất nóng ra không khí trong phòng; môi chất **ngưng tụ** thành lỏng. Đây là lý do sau lưng/hông tủ ấm. |
| 3 | **Ống mao / van tiết lưu** (capillary tube / expansion valve), ống đồng rất nhỏ | Lỏng áp cao → **hỗn hợp lỏng–hơi, áp thấp, rất lạnh** | Áp suất tụt đột ngột, một phần lỏng bay hơi ngay ("tự làm lạnh"), nhiệt độ môi chất xuống **thấp hơn nhiệt độ trong tủ**. Tủ gia đình thường dùng ống mao (rẻ, đơn giản). |
| 4 | **Dàn lạnh / dàn bay hơi** (evaporator), trong ngăn đông hoặc sau tấm ốp lưng trong tủ | Lỏng–hơi áp thấp → **khí áp thấp** | Môi chất **sôi** và hút nhiệt từ không khí và thực phẩm trong tủ. Xong, khí quay về máy nén, chu trình lặp lại. |

Lưu ý khi diễn giải:
- Máy nén tạo ra chênh lệch áp suất, và chính chênh lệch đó đẩy môi chất chạy vòng (Penn State, Wikipedia).
- Vì sao môi chất sôi được ở nhiệt độ âm: ở áp suất thấp, môi chất có điểm sôi rất thấp (xem mục 3). Ở áp suất cao, nó ngưng tụ được dù vẫn nóng hơn phòng.
- Vị trí dàn ngưng: Penn State ghi "on the back or bottom of your fridge" [ĐÃ KIỂM CHỨNG]. Ống ngưng nằm trong vách hông (gây nóng hông tủ): Samsung/Haier nói điều này là bình thường [CHỈ QUA TÌM KIẾM, không mở được trang].

## 3. Số liệu kiểm chứng được

| Sự thật | Giá trị | Trạng thái | Nguồn |
|---------|---------|-----------|-------|
| Ngăn mát (FDA, Mỹ) | ≤ 40 °F (≈ 4 °C) | ĐÃ KIỂM CHỨNG | https://www.fda.gov/food/buy-store-serve-safe-food/refrigerator-thermometers-cold-facts-about-food-safety |
| Ngăn đông (FDA) | 0 °F (≈ −18 °C) | ĐÃ KIỂM CHỨNG | như trên; Wikipedia "Refrigerator" ghi rõ "4 °C (40 °F)" và "−18 °C (0 °F)" https://en.wikipedia.org/wiki/Refrigerator |
| Ngăn mát (FSA, Anh) | ≤ 5 °C; khoảng khuyến nghị 0–5 °C | CHỈ QUA TÌM KIẾM | https://www.food.gov.uk/print/pdf/node/20821 |
| → Có thể nói trong video: "ngăn mát khoảng ba đến năm độ, ngăn đông âm mười tám độ" | | dựa trên FDA + FSA | |
| Điểm sôi R600a (isobutane) ở 1 atm | −11,7 °C (Wikipedia infobox: −11,78 °C) | ĐÃ KIỂM CHỨNG | https://en.wikipedia.org/wiki/Isobutane |
| Điểm sôi R134a ở áp suất khí quyển | −26,3 °C | ĐÃ KIỂM CHỨNG | https://en.wikipedia.org/wiki/1,1,1,2-Tetrafluoroethane |
| R134a thay R-12 trong tủ lạnh gia đình từ đầu thập niên 1990 | | ĐÃ KIỂM CHỨNG | như trên |
| Tủ lạnh dùng isobutane có từ 1993 (dự án Greenfreeze của Greenpeace + hãng Foron); R600a dễ cháy, gần như không phá tầng ozone | | ĐÃ KIỂM CHỨNG | https://en.wikipedia.org/wiki/Isobutane |
| Thermostat: khi tủ ấm quá thì khởi động làm lạnh (bật máy nén); đủ lạnh thì tắt | | ĐÃ KIỂM CHỨNG (Wikipedia) | https://en.wikipedia.org/wiki/Refrigerator |
| Sau lưng/hông tủ ấm vì nhiệt lấy từ trong tủ được xả ra ở dàn ngưng | | ĐÃ KIỂM CHỨNG (Penn State) | https://courses.ems.psu.edu/egee102/node/2402 |
| Nhiệt xả ra phòng = nhiệt lấy từ trong tủ + điện năng máy nén tiêu thụ (Q_nóng = Q_lạnh + W) | | CHƯA KIỂM CHỨNG trực tiếp (định luật I nhiệt động lực học, kiến thức chuẩn sách giáo khoa) | — |

Ghi chú: với R600a, nói "ở áp suất bình thường nó sôi ở âm mười hai độ" là an toàn (làm tròn −11,7). Ngăn đông ở −18 °C nên áp suất trong dàn lạnh thực tế còn thấp hơn khí quyển để môi chất sôi được ở nhiệt độ thấp hơn nữa [CHƯA KIỂM CHỨNG con số áp suất cụ thể, không nên nêu số].

## 4. Chi tiết lịch sử (tuỳ chọn)

- [ĐÃ KIỂM CHỨNG, Wikipedia "Refrigerator"] Tủ lạnh gia đình thực dụng xuất hiện từ thập niên 1910 và **được dùng rộng rãi ở Mỹ trong thập niên 1930**, khi giá giảm và môi chất tổng hợp (Freon) ra đời. "The introduction of Freon in the 1920s expanded the refrigerator market during the 1930s." Mẫu "Monitor-Top" của General Electric (1927) là mẫu đầu tiên được dùng rộng rãi (theo Wikipedia).
- Câu an toàn cho video: "Khoảng thập niên 1930, tủ lạnh điện mới bắt đầu phổ biến trong các gia đình Mỹ." Không dùng chữ "đầu tiên".
- Số liệu tỷ lệ hộ gia đình Mỹ sở hữu tủ lạnh năm 1930/1940: các nguồn **mâu thuẫn** (10%→56% so với 8%→44%), nên **không dùng**.
- Britannica: không truy cập được (403), nên không trích.

## 5. Ngộ nhận phổ biến nên tránh

1. **"Mở cửa tủ lạnh làm mát phòng."** Sai. Tủ chỉ chuyển nhiệt từ chỗ này sang chỗ khác trong cùng căn phòng, cộng thêm nhiệt từ điện năng của máy nén, nên phòng **ấm lên** theo thời gian (có thể mát nhẹ ngay trước cửa tủ). [ĐÃ KIỂM CHỨNG] Physics Van, ĐH Illinois: "the fridge will still be heating the room more than cooling it" https://van.physics.illinois.edu/ask/listing/1790
2. **"Tủ lạnh tạo ra hơi lạnh / bơm khí lạnh vào."** Sai. Nó **lấy nhiệt đi**. "Lạnh" chỉ là thiếu nhiệt.
3. **"Gas tủ lạnh bị tiêu hao, phải nạp lại định kỳ."** Môi chất chạy trong vòng kín và được dùng lại [ĐÃ KIỂM CHỨNG về vòng kín]. Chỉ phải nạp khi bị rò rỉ [CHƯA KIỂM CHỨNG bằng nguồn riêng].
4. **"Sau lưng tủ nóng là tủ hỏng."** Thường là bình thường: đó là nhiệt được xả ra. Nóng bỏng tay bất thường, hoặc tủ chạy liên tục mà không lạnh, mới là dấu hiệu lỗi [CHỈ QUA TÌM KIẾM: Haier, Sears].
5. **"Máy nén chạy liên tục."** Bình thường nó bật/tắt theo thermostat [ĐÃ KIỂM CHỨNG, Wikipedia]. Tủ inverter chạy biến tốc (đừng khái quát quá).

## 6. Thuật ngữ tiếng Việt chuẩn và cách đọc khi lồng tiếng

| Tiếng Anh | Thuật ngữ chuẩn | Cách nói tự nhiên |
|-----------|-----------------|-------------------|
| Refrigerant | môi chất lạnh (dân gian: "gas tủ lạnh") | "môi chất lạnh", lần đầu có thể nói thêm "hay còn gọi là gas" |
| Compressor | máy nén (dân gian: "lốc", "block") | "máy nén" |
| Condenser | dàn ngưng (tụ), dàn nóng | "dàn nóng sau lưng tủ" |
| Capillary tube | ống mao (ống mao dẫn) | "một ống đồng nhỏ như sợi tóc" / "ống mao" |
| Expansion valve | van tiết lưu | "van tiết lưu" (tủ gia đình chủ yếu dùng ống mao) |
| Evaporator | dàn bay hơi, dàn lạnh | "dàn lạnh trong tủ" |
| Thermostat | bộ điều nhiệt, rơ-le nhiệt (thermostat) | "bộ điều nhiệt" |
| Vapor-compression cycle | chu trình nén hơi | "chu trình nén hơi" |
| Isobutane R600a | isobutan, R600a | "R sáu trăm a" hoặc "isobutan" |

Đọc số:
- −18 °C → "âm mười tám độ"
- 3–5 °C → "từ ba đến năm độ"
- −11,7 °C → "khoảng âm mười hai độ" (làm tròn khi nói)
- −26,3 °C → "khoảng âm hai mươi sáu độ"
- 4 °C → "bốn độ"
- thập niên 1930 → "những năm một nghìn chín trăm ba mươi" / "thập niên ba mươi của thế kỷ trước"

## 7. Nguồn

Đã đọc trực tiếp:
- Penn State EGEE 102, 6.4 Refrigerators: https://courses.ems.psu.edu/egee102/node/2402
- FDA, Refrigerator Thermometers – Cold Facts about Food Safety: https://www.fda.gov/food/buy-store-serve-safe-food/refrigerator-thermometers-cold-facts-about-food-safety
- Wikipedia, Refrigerator: https://en.wikipedia.org/wiki/Refrigerator
- Wikipedia, Vapor-compression refrigeration: https://en.wikipedia.org/wiki/Vapor-compression_refrigeration
- Wikipedia, Isobutane: https://en.wikipedia.org/wiki/Isobutane
- Wikipedia, 1,1,1,2-Tetrafluoroethane (R134a): https://en.wikipedia.org/wiki/1,1,1,2-Tetrafluoroethane
- Physics Van, University of Illinois, Open Refrigerator: https://van.physics.illinois.edu/ask/listing/1790

Chỉ qua đoạn trích tìm kiếm (chưa mở được trang):
- UK Food Standards Agency: https://www.food.gov.uk/print/pdf/node/20821
- HyperPhysics, Perspiration Cooling of Body: https://hyperphysics.gsu.edu/hbase/thermo/sweat.html
- Haier, warm refrigerator sides/back: https://www.haierappliances.com/support/support-content/34690
- Samsung, Why side walls of the refrigerator are hot: https://ushl.samsung.com/in/support/home-appliances/why-side-walls-of-the-samsung-refrigerator-are-very-hot
- University of Sydney, Bar Fridge tutorial: https://www.physics.usyd.edu.au/super/physics_tut/activities/Thermal_Physics/Bar_Fridge.pdf

Không truy cập được: Britannica (403), HowStuffWorks (trang trống), Danfoss (403).
