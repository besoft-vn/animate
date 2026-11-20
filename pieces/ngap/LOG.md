# LOG — ngáp (2026-11-20, lịch chạy tự động)

- Chủ đề: "Vì sao ta ngáp — và vì sao ngáp lây?" (cơ thể; tập trước là đồ gia dụng). Style cut-paper (đã làm gọn: grain nhẹ, không chấm), F5 fixed-hero journey (hero = bộ não màu hồng), 1 SLAM vào "ngáp theo!" (42,5 s). 61,25 s.
- Nghiên cứu (agent) → research.md: thuyết "thiếu ô xi" bị bác (Provine 1987); làm mát não là GIẢ THUYẾT mạnh nhất → kịch bản nói "giả thuyết", câu cuối "có lẽ"; Arizona 45 % (đông, 22 °C) vs 24 % (hè, 37 °C); ngáp lây ~41–68 % → "một nửa đến hai phần ba"; người thân > bạn bè > người lạ; trẻ từ khoảng 4 tuổi.
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 10 câu (691 ký tự) + tạo lại câu "end" một lần (thêm "có lẽ", 83 ký tự). Whisper nghe 143/156 chữ.
- Môi trường: `channel/setup.sh` cài faster-whisper bằng `pip` (python 3.13) trong khi `python3` là 3.11 → cài lại bằng `python3 -m pip`. Nên sửa setup.sh dùng `python3 -m pip`.
- 3 agent hoạt hình song song: sc-people (hook, lay, payoff, end), sc-head (warm, jaw, air, cool — đầu nhìn nghiêng cắt lớp), sc-charts (season, social). Tất cả motioncheck PASS trước khi báo xong.

## Review độc lập (6b) — agent mới, không đọc code, chỉ contact sheet + lời
| # | mức | lỗi | cách sửa | re-review |
|---|---|---|---|---|
| 1 | MUST | 5–7 s: mặt nạ ô xi tụt xuống ngực trước khi ngáp → trái với lời "thở ô xi vẫn ngáp" | mặt nạ giữ nguyên trên mặt, ngáp sau lớp nhựa trong | FIXED |
| 2 | MUST | 35–44 s: không thấy ngáp truyền từ người này sang người kia | Minh ngáp to rõ 37,2–39,3 s, Lan nhìn; Lan ngáp theo ở payoff | FIXED |
| 3 | MUST | 25–27 s: não đã mát nhưng vẫn còn 3 sóng nhiệt cam | heroWarmAt nguội hẳn trong 1,2 s sau "lên"; nhiệt kế cùng nhịp | FIXED |
| 4 | MUST | cuối: "ngáp = não tự hạ nhiệt" thành sự thật | lời cuối thêm "có lẽ" (tạo lại giọng), tiêu đề "có lẽ: …", caption có "?", thẻ "giả thuyết" | FIXED |
| 5 | MUST | "bạn?" + mũi tên xanh đen chỉ vào Lan, che mặt | bỏ mũi tên; thẻ "còn bạn?" đặt trên mặt bàn, không che ai | sửa sau re-review (đã xem still) |
| 6 | NICE | nhiệt từ máu sang khí không có hướng | 3 mũi tên sóng cam từ mạch máu vào luồng khí | FIXED |
| 7 | NICE | mạch máu vẽ xuyên qua miệng | đi sau cổ họng | FIXED |
| 8 | NICE | hàm dưới khi khép trông lệch | vẽ lại hàm khép liền mặt | PARTLY (còn hơi lệch) |
| 9 | NICE | thanh 45 % gần đầy | rãnh = 100 % | FIXED |
| 11–14 | NICE | thiếu thẻ "đọc", tay cầm điện thoại gãy, nhãn đè cửa sổ, thẻ "làm mát" che đầu | sửa cả | FIXED |
| 10 | NICE (để lại) | cảnh Arizona nói "ngáp lây" trước khi cảnh 07 giới thiệu | — | — |

## Số đo (renders/share.mp4)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 42,5 s) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (156 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng); 1 khung (32,25 s) "37°C" chạm mép vùng UI phải lúc camera thở to nhất |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 41,7–42,5) |
| loudest 100 ms | 42,8 s, trong act payoff 42,5–44,75 s |
| loudness | −14,1 LUFS, true peak −1,6 dBFS |

- Shot yếu nhất: đầu nhìn nghiêng (7,75–29 s) — giải phẫu đơn giản hoá, hàm dưới khi khép vẫn hơi lệch; các khung chuyển cảnh qua giấy trống ~1 s chỉ có bộ não.
- Chưa kiểm chứng: không nghe được bằng tai (chỉ đo LUFS và Whisper). 61,25 s (hơi quá mốc 60 s).
- Drive: đã lưu (My Drive / Vạn vật vận hành như thế nào — Video).
