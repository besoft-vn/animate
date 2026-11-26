# Research: Phanh xe máy dừng xe như thế nào?

Checked 2026-11-26. Scope: xe tay ga / xe số phổ thông ở VN (phanh đĩa thủy lực trước, phanh cơ tang trống sau).

## 1. Ý chính (một câu)
Phanh không "xóa" chuyển động: má phanh cọ vào đĩa (hoặc guốc phanh cọ vào trống) biến **động năng** thành **nhiệt năng** qua ma sát, để bánh xe quay chậm lại; còn lực thật sự hãm cả chiếc xe lại là **ma sát giữa lốp và mặt đường** (lực bám).
- Phanh ma sát "converting kinetic energy into thermal energy": https://en.wikipedia.org/wiki/Brake
- VnExpress cũng viết phanh chuyển "động năng" thành "nhiệt năng": https://vnexpress.net/phanh-xe-may-de-khong-bi-nga-2196266.html
- "Lốp – đường mới hãm xe": đây là suy luận vật lý (định luật 2 Newton: lực ngoài nằm ngang duy nhất đáng kể tác dụng lên xe là ma sát mặt đường lên lốp, cộng thêm lực cản gió). Không cần nguồn riêng, nhưng nên nói đúng như vậy. Bằng chứng gián tiếp: khi bánh bị bó cứng (lực bám kém hơn) thì quãng phanh dài ra (xem mục 3, ABS).

## 2. Quy trình theo đúng thứ tự

### (a) Phanh đĩa thủy lực (thường ở bánh trước)
1. Bóp tay phanh. Tay phanh là đòn bẩy, đẩy piston trong **xi lanh chính / tổng phanh** (master cylinder), gắn liền bình dầu trên tay lái.
2. Dầu phanh (DOT 3 / DOT 4) gần như không nén được, nên áp suất truyền nguyên vẹn qua ống dầu tới **cùm phanh / heo dầu** (caliper). Đây là **nguyên lý Pascal**. Honda: "the pressure of the brake fluid inside the master cylinder is transmitted to the brake caliper": https://global.honda/en/motorcycle-aftersales/maintenance/brakepads_shoes.html
3. Piston trong cùm phanh to hơn piston tổng phanh, nên **lực được nhân lên** (cùng áp suất × diện tích lớn hơn).
   - **Số liệu có nguồn:** Honda NHX110 (dòng Lead 110), sách hướng dẫn sửa chữa, phanh đĩa trước: đường kính trong xi lanh chính 12,70 mm, đường kính trong xi lanh cùm phanh 27,00 mm, dầu DOT 3/DOT 4: https://www.bike-parts-honda.be/thumbs/pdf_url/img/sav/SAV_NHX110WH8_9_A/2500_2500/0346.pdf
   - **Tự tính:** (27,0 / 12,7)² ≈ **4,5 lần** (cho một piston cùm). Đòn bẩy tay phanh nhân thêm vài lần nữa, nhưng tỉ lệ đòn bẩy **chưa xác minh** cho model này. Đổi lại, piston cùm chỉ đi được khoảng 1/4,5 quãng đường của piston tổng phanh, nên má phanh chỉ dịch chuyển rất ít.
   - Tinhte cũng giải thích lực ép tăng nhờ piston heo dầu và tổng phanh khác kích thước, theo nguyên lý áp suất chất lỏng chứ không phải đòn bẩy: https://tinhte.vn/thread/3187708 (trang chặn fetch, nội dung lấy qua đoạn trích kết quả tìm kiếm).
4. Piston đẩy **má phanh** (brake pads) kẹp hai mặt **đĩa phanh** (disc/rotor) đang quay cùng bánh xe. Honda: "the two brake pads inside the caliper grip the disc which is turning with the wheel" (link Honda ở trên).
5. Ma sát má phanh với đĩa tạo mômen hãm, làm bánh quay chậm lại. Động năng biến thành nhiệt, và đĩa nóng lên rồi tỏa nhiệt ra không khí.
6. Bánh quay chậm hơn tốc độ xe, nên lốp "níu" mặt đường. Ma sát lốp–đường kéo lùi cả xe lẫn người, và xe chậm lại.
7. Nhả tay phanh thì áp suất giảm, piston lùi và má phanh nhả.

### (b) Phanh cơ / tang trống (đùm), thường ở bánh sau xe phổ thông
1. Bóp tay phanh trái (xe ga) hoặc đạp bàn đạp (xe số). Dây cáp hoặc thanh kéo kéo **càng phanh** (brake arm).
2. Càng phanh xoay **cam phanh** nằm giữa hai đầu **guốc phanh** hình bán nguyệt.
3. Cam xoay làm hai guốc bung ra ngoài, và lớp **bố / má phanh** trên guốc ép vào mặt trong của **trống phanh** đang quay cùng bánh xe.
   - Cycle World: cam nằm giữa hai guốc, cam xoay đẩy guốc vào thành trống, và mômen hãm truyền qua mâm phanh vào khung xe: https://issues.cycleworld.com/article/1981/10/1/braking-basics
   - Honda: "the brake arm in turn pushes the brake shoes against the drum from inside" (link Honda ở trên).
4. Ma sát biến động năng thành nhiệt. Khi nhả phanh, lò xo hồi kéo guốc về: https://en.wikipedia.org/wiki/Drum_brake
5. Nhược điểm: trống kín nên tản nhiệt kém, dễ bị "mất phanh" do nóng (brake fade) khi xuống dốc dài: https://en.wikipedia.org/wiki/Drum_brake, https://fptshop.com.vn/tin-tuc/danh-gia/brake-la-gi-189336
6. Ghi chú: NHX110 dùng trống sau có đường kính trong 130 mm, kèm cơ cấu "equalizer" (CBS), theo PDF Honda ở trên.

## 3. Số liệu

| Đại lượng | Giá trị | Nguồn / ghi chú |
|---|---|---|
| Động năng ½mv², 120 kg (xe + người), 50 km/h (13,9 m/s) | **≈ 11,6 kJ** | Tự tính |
| 120 kg, 40 km/h (11,1 m/s) | ≈ 7,4 kJ | Tự tính |
| 100 kg, 40 km/h / 100 kg, 50 km/h | ≈ 6,2 kJ / ≈ 9,6 kJ | Tự tính |
| So sánh 1: độ cao tương đương h = v²/2g | 50 km/h ≈ **9,8 m** (khoảng nhà 3 tầng); 40 km/h ≈ 6,3 m | Tự tính, không phụ thuộc khối lượng. Phanh gấp từ 50 km/h phải "tiêu" lượng năng lượng bằng cú rơi từ độ cao gần 10 m |
| So sánh 2: đun nước (c = 4,186 kJ/kg·K) | 11,6 kJ làm 1 lít nước nóng thêm ≈ 2,8 °C, hoặc đun ≈ 35 ml nước từ 20 °C lên 100 °C | Tự tính. Kém "ấn tượng" hơn so sánh 1 |
| Quãng phanh thuần (không tính phản xạ) từ 50 km/h, xe có ABS, 50 người lái | Trung bình **15,96 m** (trung vị ≈ 16 m); 70 km/h: 22,35 m; 80 km/h: 25,54 m. Công thức truyền thống của Đức cho 12,5 m | Nghiên cứu ifz (Đức), đo 2024: https://www.motorcycles.news/en/motorcycle-braking-distance-ifz-study/ và https://www.visordown.com/news/fema-research-suggests-one-two-bikers-miscalculates-motorcycle-braking-distances |
| Suy ra từ ifz | Gia tốc hãm ≈ 6 m/s² (≈ 0,6 g), thời gian phanh ≈ 2,3 s, công suất nhiệt trung bình ≈ 5 kW | Tự tính |
| Quãng phanh từ 40 km/h | ≈ 10 m (ngoại suy theo v² từ số ifz) | **Ước tính, chưa có nguồn đo trực tiếp** |
| Phản xạ | Cộng thêm quãng đi trong thời gian phản xạ (≈ 1 s đi ≈ 14 m ở 50 km/h) | Thời gian 1 s là giả định, **chưa xác minh** |
| Tỉ lệ lực phanh trước | "at least 70% of the stopping power" | https://en.wikipedia.org/wiki/Motorcycle_brakes; USAF "minimum of 70%": https://www.safety.af.mil/Portals/71/documents/Occupational/Resources/DSOC%20Modules/28_High_Speed_Emergency_Stops%20(Rev).pdf; quy tắc 70/30: https://jalopnik.com/2206482/what-70-30-motorcycle-brake-rule-means/; Pirelli khuyên 70–80% cho bánh trước: https://www.pirelli.com/global/en-ww/road/motorcycles/tips/how-to-brake-with-motorbike-184589/ |
| Nhiệt độ đĩa: một lần phanh xe ga từ 50 km/h | Tăng khoảng vài chục °C | **Ước tính** (8 kJ dồn vào đĩa thép khoảng 0,5 kg, c ≈ 0,46 kJ/kg·K → +35 °C). Khối lượng đĩa **chưa xác minh**. Không nói "hàng trăm độ" cho một lần phanh xe ga |
| Đĩa phanh ô tô đi đường bình thường / xe đua | ≈ 130 °C / ≈ 500 °C | https://www.kwik-fit.com/blog/should-brake-discs-get-hot (nguồn bán lẻ, độ tin cậy vừa phải) |
| Đĩa carbon MotoGP | 600 đến hơn 1000 °C | https://www.motogp.com/en/news/2017/03/13/why-do-motogp-bikes-use-carbon-brakes/1020533 |
| Nhựa trong má phanh xuống cấp | 400–500 °C, có thể mất phanh đột ngột | Borawski và cộng sự 2020, JACM (DOI 10.22055/JACM.2020.35533.2679), https://jacm.scu.ac.ir/article_16050.html. Chỉ đọc được đoạn trích, chưa đọc toàn văn |
| ABS rút ngắn quãng dừng | "up to 17%" | Chính phủ Nam Úc: https://mylicence.sa.gov.au/safe-driving-tips/safer-vehicles/motorcycleabs |

**Kết luận dùng cho kịch bản:** "Hàng trăm độ" chỉ đúng với xe đua hoặc khi phanh liên tục (đổ đèo). Một lần phanh xe ga trong phố chỉ làm đĩa ấm lên vài chục độ. Nếu muốn hình ảnh mạnh thì dùng phép so "rơi từ gần 10 mét".

**Vì sao đĩa trước to hơn:** khi phanh, quán tính dồn tải ra bánh trước, nên bánh trước bám đường hơn và chịu được lực phanh lớn hơn. Bánh sau nhẹ đi, dễ bó cứng, nên đĩa sau nhỏ hơn và kẹp yếu hơn: https://tech.zingnews.vn/vi-sao-dia-phanh-truoc-luon-lon-hon-dia-phanh-sau-post1275853.html. Nguồn này cũng nói một lý do khác là để tối ưu giá bán. Wikipedia: đĩa lớn hơn thì lực phanh lớn hơn, nhưng nặng hơn: https://en.wikipedia.org/wiki/Motorcycle_brakes

**ABS (chống bó cứng phanh):**
- Khi lốp còn lăn, chỗ tiếp xúc với đường đứng yên tương đối, nên lốp bám bằng **ma sát nghỉ** (static friction), có giới hạn cao hơn. Khi bánh bó cứng và trượt, lực hãm chỉ còn **ma sát trượt** (kinetic friction), thấp hơn. Bằng sáng chế Mỹ: "maximum braking force achievable with wheels locked up is substantially smaller": https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4962972. Đây là bằng sáng chế, không phải sách giáo khoa, nhưng đúng vật lý chuẩn.
- ABS đo tốc độ bánh. Khi bánh sắp ngừng quay, ABS nhả rồi siết áp suất liên tục để bánh vẫn lăn, giữ độ trượt quanh khoảng 20%: https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4989922
- Trên xe máy, bánh bó cứng thường làm mất thăng bằng và đổ xe: https://mylicence.sa.gov.au/safe-driving-tips/safer-vehicles/motorcycleabs. Bosch: https://bosch-mobility.com/en/solutions/driving-safety/antilock-braking-system-2w/
- Bánh trước bó thì mất khả năng lái, và đuôi xe có thể vượt lên hoặc xe đổ. Bánh sau bó ở tốc độ cao thì xe "vẫy đuôi cá": https://vnexpress.net/phanh-xe-may-de-khong-bi-nga-2196266.html

**CBS (phanh kết hợp):** Honda Combi Brake ra mắt năm 1999 trên Giorno Crea 50cc: tay phanh trái (sau) liên kết với cả phanh trước lẫn phanh sau. Sách hướng dẫn ghi: "applies the rear brake and a portion of the front brake. For full braking effectiveness, use both… levers simultaneously": https://global.honda/en/tech/Tech_Views_Vol2_Advanced_Brake_System/, https://en.wikipedia.org/wiki/Combined_braking_system

## 4. Hiểu lầm phổ biến
1. **"Phanh làm bánh dừng nên xe dừng."** Chỉ đúng một nửa. Phanh chỉ hãm bánh, còn xe dừng nhờ lốp bám đường. Đường ướt hoặc có cát thì cũng bóp phanh như vậy mà xe trượt dài. Bánh bó cứng (ngừng quay hẳn) lại phanh **kém** hơn bánh còn lăn sát ngưỡng (ma sát trượt nhỏ hơn ma sát nghỉ).
2. **"Phanh trước dễ lộn đầu / ngã, chỉ nên dùng phanh sau."** Nhiều người VN ngại phanh trước. VnExpress: "Nhiều người thấy khó khăn khi dùng phanh trước, nhưng thực tế nếu dùng phanh sau, bánh sau cũng sẽ bị khóa cứng" (link ở trên). Thực tế bánh trước gánh ≥70% lực hãm (Wikipedia, USAF). Nên dùng **cả hai phanh**, bóp phanh trước **tăng dần** chứ không giật mạnh, để tải kịp dồn lên bánh trước: https://www.safety.af.mil/Portals/71/documents/Occupational/Resources/DSOC%20Modules/28_High_Speed_Emergency_Stops%20(Rev).pdf. Siết phanh trước thật gắt khi đang ôm cua hoặc trên đường trơn mới thật sự nguy hiểm.
3. **"Phanh tiêu hủy năng lượng."** Sai. Năng lượng được bảo toàn và biến thành nhiệt ở đĩa, má phanh, lốp, đường. Xe điện có thể thu hồi một phần năng lượng (phanh tái sinh): https://en.wikipedia.org/wiki/Brake
4. **"Có CBS/ABS thì chỉ cần bóp một tay."** Honda khuyên dùng cả hai tay để có hiệu quả đầy đủ (mục CBS ở trên).
5. **"ABS luôn làm quãng phanh ngắn hơn."** Không hẳn. Nguồn Nam Úc nói ABS rút ngắn "tới 17%", và trong điều kiện thử nghiệm, tay lái chuyên nghiệp có thể phanh ngắn hơn ABS. Lợi ích chính của ABS là giữ lái và thăng bằng.

## 5. Thuật ngữ tiếng Việt
| Thuật ngữ | English | Ghi chú |
|---|---|---|
| phanh / thắng | brake | "phanh" dùng ở miền Bắc và là từ chuẩn. "thắng" dùng ở miền Nam |
| phanh đĩa | disc brake | chuẩn |
| phanh cơ, phanh tang trống, phanh đùm | drum brake | "phanh tang trống" là từ kỹ thuật chuẩn. "phanh cơ" chỉ cách dẫn động bằng dây cáp, dùng phổ biến. "phanh đùm" là khẩu ngữ |
| đĩa phanh | disc / rotor | chuẩn |
| má phanh, bố thắng | brake pad (đĩa) / lining | "má phanh" chuẩn. "bố thắng" là khẩu ngữ miền Nam |
| guốc phanh | brake shoe | chuẩn. Oto.com.vn phân biệt guốc phanh với má phanh: https://oto.com.vn/cham-soc-va-bao-duong-o-to/su-khac-biet-giua-giay-phanh-ma-phanh-articleid-hw806ja |
| trống phanh / tang trống | drum | chuẩn |
| cam phanh, càng phanh | brake cam, brake arm | dùng trong thợ và sách sửa chữa |
| cùm phanh, kẹp phanh / heo dầu | caliper | "cùm phanh", "kẹp phanh" chuẩn hơn (Zing dùng "kẹp phanh"). "heo dầu" là khẩu ngữ thợ, rất phổ biến (VnExpress dùng) |
| xi lanh chính, tổng phanh, bình dầu phanh | master cylinder (+ reservoir) | "xi lanh chính" là từ kỹ thuật. "tổng phanh / tổng thắng" là từ thợ. "bình dầu" thực ra chỉ là bầu chứa dầu |
| piston | piston | |
| dầu phanh | brake fluid (DOT 3/4) | chuẩn |
| ma sát nghỉ / ma sát trượt | static / kinetic friction | thuật ngữ SGK Vật lý |
| động năng / nhiệt năng | kinetic / thermal energy | SGK |
| lực bám (đường) | grip / traction | |
| bó cứng phanh, khóa bánh | wheel lock | |
| ABS: hệ thống chống bó cứng phanh | Anti-lock Braking System | chuẩn |
| CBS: hệ thống phanh kết hợp | Combined (Combi) Brake System | chuẩn |
| nguyên lý Pascal | Pascal's principle | SGK. Tinhte gọi là "bình thông nhau", cách gọi này lỏng hơn |

## 6. Đọc số
- 50 km/h: "năm mươi ki-lô-mét một giờ" (hoặc "năm mươi cây số giờ", khẩu ngữ)
- 40 km/h: "bốn mươi ki-lô-mét một giờ"
- 120 kg: "một trăm hai mươi ký" / "một trăm hai mươi ki-lô-gam"
- 11,6 kJ: "khoảng mười một nghìn sáu trăm jun" hoặc "gần mười hai nghìn jun" (miền Nam: "ngàn"). "Jun" đọc như "giun"
- 9,8 m / ~10 m: "gần mười mét"
- 16 m: "khoảng mười sáu mét"
- 70%: "bảy mươi phần trăm"
- 4,5 lần: "bốn phẩy năm lần" / "hơn bốn lần"
- 12,7 mm / 27 mm: "mười hai phẩy bảy mi-li-mét" / "hai mươi bảy mi-li-mét"
- 500 °C: "năm trăm độ C"; 1000 °C: "một nghìn độ"
- 17%: "mười bảy phần trăm"
- 1999: "năm một nghìn chín trăm chín mươi chín" / "năm một chín chín chín"

## Không nói / cần thận trọng
- Không nói "một lần phanh làm đĩa nóng hàng trăm độ" cho xe ga đi phố.
- Không gán con số 70% cho MSF (chưa tìm thấy). Dùng "khoảng 70%, có khi hơn".
- Tỉ lệ đòn bẩy tay phanh, khối lượng đĩa và thời gian phản xạ 1 s: chưa xác minh.
- Không có tuyên bố "đầu tiên / duy nhất" nào, trừ mốc CBS 1999 của Honda và ABS xe máy đầu tiên của BMW năm 1989 (Wikipedia). Không cần dùng hai mốc này.
