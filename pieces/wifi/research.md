# Research: Wi‑Fi truyền dữ liệu qua không khí thế nào?

## 1. Ý chính một câu
- Wi‑Fi biến dữ liệu thành các bit 0/1, "khắc" chúng vào một sóng vô tuyến bằng cách đổi rất nhanh độ mạnh (biên độ) và nhịp (pha) của sóng, rồi điện thoại đọc lại những thay đổi đó để dựng lại bit. Không có thứ gì "bay" từ router sang máy bạn, chỉ có hình dạng của sóng thay đổi.

## 2. Các bước theo thứ tự (kèm cách đơn giản hóa mà vẫn đúng)
1. **Dữ liệu → bit 0/1.** Ảnh, chữ, video đều đã là chuỗi bit trong máy.
   - Đơn giản hóa: "mọi thứ chỉ là dãy số 0 và 1". Đúng.
2. **Router điều chế bit lên sóng mang.** Sóng mang là sóng đều đặn ở tần số cố định. Router đổi **biên độ** và **pha** của sóng. Mỗi tổ hợp (biên độ, pha) là một "ký hiệu" ứng với một nhóm bit. Cách này gọi là **QAM**.
   - QAM‑1024 (Wi‑Fi 6) có 1024 trạng thái, nên mỗi ký hiệu mang 10 bit (2^10 = 1024). QAM‑4096 (Wi‑Fi 7) có 4096 trạng thái, nên mỗi ký hiệu mang 12 bit.
   - Đơn giản hóa: "giống bảng mã: mỗi kiểu nhún của sóng ứng với một cụm bit". Đúng. Không nên nói "sóng to là 1, nhỏ là 0", vì đó là kiểu điều chế cũ (ASK/OOK) và Wi‑Fi không dùng.
   - Lưu ý: số bit thực có ích ít hơn một chút, vì một phần là bit sửa lỗi (mã hóa tốc độ 3/4, 5/6). Trong video có thể bỏ qua chi tiết này.
3. **OFDM: chia kênh thành nhiều sóng con.** Wi‑Fi không dùng một sóng mang duy nhất. Kênh được chia thành hàng trăm sóng con sát nhau, và mỗi sóng con chở QAM riêng cùng một lúc. Ví dụ Wi‑Fi 6 kênh 20 MHz có 256 sóng con (234 sóng con mang dữ liệu).
   - Đơn giản hóa: "như một xa lộ hàng trăm làn, mỗi làn chở một ít bit, tất cả chạy song song". Chấp nhận được.
4. **Ăng-ten phát sóng vô tuyến.** Dòng điện dao động trong ăng-ten phát ra **sóng điện từ**. Sóng này cùng họ với ánh sáng (chỉ khác tần số) và đi với tốc độ ánh sáng. Wi‑Fi dùng các băng 2,4 GHz, 5 GHz và 6 GHz (6 GHz có từ Wi‑Fi 6E).
   - Đơn giản hóa: "Wi‑Fi là một loại ánh sáng mà mắt ta không thấy". Về vật lý thì đúng, vì cả hai đều là bức xạ điện từ. Nên nói "cùng họ với ánh sáng", tránh "là ánh sáng" để không gây hiểu lầm.
   - Tốc độ: trong không khí, sóng chậm hơn tốc độ ánh sáng trong chân không chưa đến 0,03 %. Nói "đi với tốc độ ánh sáng" là được.
5. **Ăng-ten điện thoại nhận sóng.** Điện trường của sóng đẩy các electron tự do trong kim loại của ăng-ten dao động qua lại, tạo ra một dòng điện xoay chiều cực nhỏ có cùng nhịp với sóng.
   - Đơn giản hóa: "sóng làm electron trong ăng-ten nhảy theo nhịp". Đúng.
6. **Giải điều chế.** Chip Wi‑Fi đo biên độ và pha trên từng sóng con, tra ngược "bảng mã" QAM để ra bit.
7. **Kiểm tra lỗi và xác nhận.** Gói tin có mã kiểm tra lỗi. Nếu nhận đúng, máy nhận gửi lại một gói **ACK** ("đã nhận") ngay sau một khoảng nghỉ ngắn (SIFS). Nếu bên gửi không nhận được ACK trong thời gian chờ, nó coi gói đã mất và gửi lại. Quá số lần thử thì gói bị bỏ.
8. **Chia sẻ kênh (CSMA/CA).** Mọi thiết bị dùng chung một kênh. Trước khi phát, mỗi thiết bị "nghe" xem kênh có trống không, rồi chờ thêm một khoảng ngẫu nhiên (backoff) mới phát, để tránh hai bên nói cùng lúc. Wi‑Fi 6 thêm OFDMA, cho phép chia các sóng con cho nhiều máy cùng lúc.
   - Đơn giản hóa: "giống một phòng họp lịch sự: nghe trước, ai im thì mới nói, lần lượt từng người". Đúng với CSMA/CA. Với Wi‑Fi 6 có thể nói thêm "và đôi khi chia làn cho nhiều người".
- **Bỏ qua được trong 60 giây:** MIMO (nhiều ăng-ten), mã hóa sửa lỗi LDPC, mã hóa bảo mật WPA, beamforming.

## 3. Số liệu kèm nguồn
- **Tốc độ ánh sáng:** c = 299 792 458 m/s, là giá trị chính xác theo định nghĩa (≈ 300 000 km/s). https://physics.nist.gov/cuu/Constants/Value/c.html
- **Tần số:** 2,4 GHz = 2,4 tỷ dao động/giây (1 Hz = 1 dao động/giây). Đây là phép đổi đơn vị theo định nghĩa SI. https://www.bipm.org/en/si-base-units (hertz = s⁻¹)
- **Bước sóng** (λ = c/f, tự tính từ giá trị NIST ở trên):
  - 2,4 GHz → ~12,5 cm
  - 5 GHz → ~6 cm
  - 6 GHz → ~5 cm
  - Nguồn c: https://physics.nist.gov/cuu/Constants/Value/c.html
- **Băng 6 GHz:** FCC (Mỹ) mở 1200 MHz ở băng 6 GHz năm 2020. Châu Âu chỉ mở phần dưới (5945–6425 MHz). https://arubanetworking.hpe.com/techdocs/aos/wifi-design-deploy/generations/wifi6e/feature-benefit/ ; trang của Wi‑Fi Alliance: https://www.wi-fi.org/node/37285
- **QAM‑1024 (Wi‑Fi 6) = 10 bit/ký hiệu:** khảo sát IEEE 802.11ax trên arXiv ghi "a symbol carries 10 bits". https://arxiv.org/pdf/1806.05908
- **QAM‑4096 (Wi‑Fi 7) = 12 bit/ký hiệu**, tăng thông lượng khoảng 20 % so với QAM‑1024. https://www.tp-link.com/uk/blog/733/ ; MathWorks: https://www.mathworks.com/help/wlan/ug/overview-of-wifi-7-or-ieee-802-11-be.html
  - Wi‑Fi Alliance gọi tính năng này là "4K QAM". https://www.wi-fi.org/system/files/Wi-Fi_CERTIFIED_7_Highlights_202401.pdf
- **Sóng con OFDM:**
  - Wi‑Fi cũ (802.11a/g/n/ac), kênh 20 MHz: 64 sóng con, cách nhau 312,5 kHz.
  - Wi‑Fi 6, kênh 20 MHz: 256 sóng con, cách nhau 78,125 kHz, gồm 234 sóng con dữ liệu và 8 sóng con dẫn đường (pilot).
  - Nguồn: https://arxiv.org/pdf/1806.05908
- **Thời lượng ký hiệu OFDM:**
  - Wi‑Fi 6: 12,8 µs + khoảng bảo vệ (guard interval) 0,8 / 1,6 / 3,2 µs, tức tổng 13,6 / 14,4 / 16 µs. Hiệu suất cao nhất 12,8/13,6 ≈ 94 %.
  - Wi‑Fi cũ: 3,2 µs + 0,8 µs.
  - Nguồn: https://arxiv.org/pdf/1806.05908
  - Hình dung: ~13,6 µs nghĩa là khoảng 73 000 ký hiệu mỗi giây trên mỗi sóng con.
- **Công suất phát:**
  - Châu Âu (ETSI EN 300 328): giới hạn 20 dBm EIRP = 100 mW cho băng 2,4 GHz. https://www.intertek.com/ict/etsi-en-300-328/
  - Mỹ (FCC): cho phép đến 30 dBm (1 W) công suất dẫn ở 2,4 GHz, nên **không** nói "100 mW ở mọi nơi". https://www.qorvo.com/design-hub/blog/connectivity-q-and-a-whats-next-wi-fi-6-6e-in-european-union
  - Cách nói an toàn: "khoảng 0,1 W, giới hạn ở châu Âu và nhiều nước".
- **Lò vi sóng:**
  - Magnetron phát ở khoảng 2450 MHz. https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/cooking-safely-microwave-oven
  - Công suất ra phổ biến 600–1650 W, khoảng 1000 W là mức thường gặp. https://hypertextbook.com/facts/2007/TatyanaNektalova.shtml (nguồn tổng hợp, mức độ vừa phải)
  - FDA giới hạn rò rỉ ≤ 5 mW/cm² ở khoảng 5 cm (2 inch) từ vỏ lò. https://www.fda.gov/radiation-emitting-products/resources-you-radiation-emitting-products/microwave-ovens
  - Bức xạ vi sóng là không ion hóa (không đủ năng lượng bứt electron khỏi nguyên tử). https://www.epa.gov/radtown/non-ionizing-radiation-used-microwave-ovens
- **ACK / gửi lại / backoff:** bài giảng UCSB CS176C về CSMA/CA. https://sites.cs.ucsb.edu/~arpitgupta/cs176c/spring26/assets/slides/week03_lecture06_contention_breaks.html ; slide của ĐH Baltimore "CSMA/CA + ACK". https://home.ubalt.edu/abento/650/otherlan/tsld051.htm
- **Ăng-ten nhận:** sóng điện từ tới làm gia tốc các electron trong ăng-ten (OpenStax College Physics 24.2). https://openstax.org/books/college-physics-2e/pages/24-2-production-of-electromagnetic-waves

## 4. Ngộ nhận phổ biến
- **"Dữ liệu bay như những hạt nhỏ / dây vô hình"**: Sai. Không có vật chất nào đi từ router sang điện thoại. Chỉ có trường điện từ dao động, và dữ liệu nằm ở **hình dạng** của sóng (biên độ, pha). Xem OpenStax ở trên.
- **"Wi‑Fi = Internet"**: Sai. Wi‑Fi chỉ là đoạn không dây vài mét đến vài chục mét giữa thiết bị và router. Ra Internet còn phải qua modem, cáp hoặc cáp quang. Có Wi‑Fi "đầy vạch" mà vẫn mất mạng là chuyện bình thường. https://www.techtarget.com/searchnetworking/answer/Whats-the-difference-between-Wi-Fi-and-the-internet ; Cisco: https://www.cisco.com/c/en/us/products/wireless/what-is-wifi.html
- **"Wi‑Fi cùng tần số lò vi sóng nên nguy hiểm"**: Cùng vùng 2,4 GHz là thật. Nhưng lò khoảng 1000 W, dồn trong hộp kim loại kín, còn router khoảng 0,1 W và tỏa ra mọi hướng, tức yếu hơn cỡ 10 000 lần ngay tại nguồn. Cả hai đều là bức xạ không ion hóa. (Nguồn: USDA, FDA, EPA, ETSI ở mục 3.) Chi tiết thú vị có thật: lò vi sóng rò rỉ có thể **gây nhiễu** Wi‑Fi 2,4 GHz.
  - Tránh nói "hoàn toàn vô hại" một cách tuyệt đối. Nói "công suất nhỏ hơn hàng nghìn lần, dưới các giới hạn an toàn" là đủ.
- **"Wi‑Fi = Wireless Fidelity"**: Sai, đã kiểm chứng. Tên do công ty thương hiệu Interbrand đặt, chơi chữ theo "hi‑fi". Phil Belanger, thành viên sáng lập Wi‑Fi Alliance, nói: "Wi‑Fi doesn't stand for anything. It is not an acronym." Khẩu hiệu "The Standard for Wireless Fidelity" được thêm vào sau và ông gọi đó là "a mistake". Từ điển Oxford (OED) cũng coi cách hiểu "wireless fidelity" là suy diễn về sau, không có cơ sở.
  - Nguồn: https://boingboing.net/2005/11/08/wifi-isnt-short-for.html (phỏng vấn gốc năm 2005, trang có thể chặn bot) ; https://www.merriam-webster.com/wordplay/what-does-wi-fi-really-mean
- **"Sóng to là 1, sóng nhỏ là 0"**: Quá đơn giản tới mức sai với Wi‑Fi hiện đại. Một "nhịp" sóng mang tới 10–12 bit, chứ không phải 1 bit.

## 5. Thuật ngữ tiếng Việt và cách đọc số
- **Thuật ngữ:**
  - sóng mang (carrier)
  - điều chế (modulation) / giải điều chế (demodulation)
  - biên độ (amplitude)
  - pha (phase)
  - tần số (frequency)
  - bước sóng (wavelength)
  - ăng-ten (antenna)
  - bộ định tuyến / router
  - điểm truy cập (access point)
  - sóng vô tuyến / sóng radio
  - sóng điện từ
  - ký hiệu (symbol)
  - sóng con / sóng mang con (subcarrier)
  - kênh (channel)
  - băng tần (band)
  - điều chế biên độ cầu phương (QAM, đọc "kiu-ây-em" hoặc "quam")
  - ghép kênh phân chia theo tần số trực giao (OFDM)
  - khoảng bảo vệ (guard interval)
  - xác nhận / báo nhận (ACK)
  - truyền lại (retransmission)
  - đa truy cập cảm nhận sóng mang tránh xung đột (CSMA/CA)
  - bức xạ không ion hóa
- **Cách đọc số:**
  - 2,4 GHz: "hai phẩy bốn gi-ga-héc", tức "hai tỷ bốn trăm triệu lần mỗi giây"
  - 5 GHz: "năm gi-ga-héc", tức "năm tỷ lần mỗi giây"
  - 6 GHz: "sáu gi-ga-héc"
  - 12,5 cm: "mười hai phẩy năm xen-ti-mét" (≈ "dài bằng một cây bút bi ngắn")
  - 6 cm: "sáu xen-ti-mét"
  - 300 000 km/s: "ba trăm nghìn ki-lô-mét mỗi giây"
  - 100 mW: "một trăm mi-li-oát", tức "một phần mười oát"
  - 1000 W: "một nghìn oát"
  - QAM‑1024: "kiu-ây-em một nghìn không trăm hai mươi tư", mang "mười bit"
  - QAM‑4096: "bốn nghìn không trăm chín mươi sáu", mang "mười hai bit"
  - 12,8 µs: "mười hai phẩy tám micro giây", tức "khoảng một phần tám mươi nghìn giây"

## 6. Gợi ý "cú lật" cho câu mở đầu (đã kiểm chứng)
1. "Không có gì bay từ router sang điện thoại của bạn cả. Thứ duy nhất truyền đi là… một cái rung." Dữ liệu nằm ở biên độ và pha của trường điện từ (OpenStax, arXiv 1806.05908).
2. "Wi‑Fi thực chất là một loại ánh sáng mà mắt bạn không nhìn thấy, rung hai tỷ bốn trăm triệu lần mỗi giây." Cùng họ sóng điện từ, đi với vận tốc c (NIST).
3. "Router nhà bạn dùng cùng tần số với lò vi sóng, nhưng yếu hơn khoảng mười nghìn lần." Khoảng 0,1 W so với khoảng 1000 W (ETSI/Intertek, hypertextbook, USDA).
- Phụ (dùng ở câu kết): "Và nhân tiện: Wi‑Fi chẳng viết tắt của chữ gì cả." (Belanger/Boing Boing, Merriam‑Webster)
