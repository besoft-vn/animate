# LOG — mã QR (2026-11-28, lịch chạy tự động)

- Chủ đề: "Mã QR chứa thông tin như thế nào?" (công nghệ; tập trước "Cầu vồng" là thiên nhiên → bỏ qua "lá cây đổi màu" cùng nhóm). Style **pixel** (lần đầu trên kênh), một độ phân giải 270×480 (4 px/điểm), PAL16. F5 fixed-hero journey: hero cam cầm điện thoại trước poster "MENU" → mã phóng to từng nấc → ô đen = 1, ô trắng = 0 → 8 ô = chữ C (01000011) → 3 ô định vị (xoay 90°) → xếp ngoằn ngoèo theo cặp cột từ góc dưới phải đi lên → mặt nạ đảo ô hàng chẵn → phần còn lại là mã sửa lỗi → SLAM (39,0 s): mã bị hỏng 8/26 từ mã (≈30%) vẫn đọc ra "CHAO!" → kết: poster cũ có logo giữa mã, điện thoại vẫn quét ra lời chào.
- **Mã QR thật** (`src/qrdata.js`): "CHAO!", phiên bản 1 (21×21), mức H, byte mode, mặt nạ 001 (hàng chẵn) — tạo bằng segno; kiểm bằng code: luồng bit giải ra "CHAO!", 8 ô của chữ C đúng 01000011; kiểm bằng OpenCV: che/đảo 64 ô của 8 từ mã đầu (QR_HIT) vẫn đọc được, che 7×7 ô giữa (logo) vẫn đọc được. Cảnh bit/byte/finder/zigzag vẽ mã TRƯỚC khi phủ mặt nạ (ghi chú "(chưa phủ mặt nạ)"), cảnh mặt nạ lật về đúng mã cuối.
- Chữ tiếng Việt trên hình: font pixel của kit không có dấu → `viText` (props.js) rasterise Pangolin theo lưới điểm ảnh, giữ điểm cứng (không khử răng cưa).
- Nghiên cứu (agent) → research.md (DENSO WAVE qrcode.com, Thonky, Wikipedia, Telerik). "30%" là theo từ mã (codeword), không theo diện tích — nhãn ghi "≈30% từ mã".
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 9 câu, 585 ký tự + tạo lại câu hook 1 lần (82 ký tự) vì Whisper nghe "Ma cưa"; lần 2 nghe "Mã Khư A" (≈ "kiu-a", chấp nhận). Tổng ≈ 667 ký tự. 51,75 s.
- 3 agent hoạt hình song song: sc-code (hook, bit, byte), sc-map (finder, zigzag, mask), sc-fix (ecc, payoff, end). Quản lý: head, props (viText, drawQR, phone…), qrdata, bridges, score.

## Review độc lập (6b) — agent mới, không đọc code, chỉ contact sheet + lời
| # | mức | lỗi | cách sửa | re-review |
|---|---|---|---|---|
| 1 | MUST | 14,5 s: thanh highlight dưới dãy bit chỉ phủ 7 chữ số, số "1" cuối như chữ số thứ 9 | mỗi ô một chữ số căn giữa, highlight phủ đủ 8 | FIXED |
| 2 | MUST | 22–26 s: zigzag tô xanh (= chữ) toàn bộ mã, rồi 35 s phần lớn lại thành "mã sửa lỗi" xanh lá → mâu thuẫn | zigzag chỉ tô xanh 72 ô dữ liệu thật; đường đi tiếp qua phần sửa lỗi bằng dấu xám trung tính | FIXED |
| — | NICE (đã sửa) | mặt nạ có hồng + tím không chú thích; vệt quét màu xanh (trùng nghĩa "dữ liệu"); nhãn "hỏng ≈ 30%" bị hiểu là diện tích; tag chạm ghi chú; dãy bit chạy qua ô định vị và hiện thiếu số 0 | chỉ hồng; vệt quét xám/trắng; nhãn "≈30% từ mã"; tag ngắn "đen 1, trắng 0"; dãy bit chỉ trên ô dữ liệu, số 0 hiện sớm 0,3 s | — |
| — | NICE (để lại) | khung "mảng to" là khối 2×6 ô (khối cùng màu lớn nhất có thật), trông hơi mảnh; ghi chú "(chưa phủ mặt nạ)" cỡ 13 hơi nhỏ trên điện thoại | — | NOT FIXED |

## Số đo (renders/share.mp4, 51,75 s)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 39,0 s) |
| morphs | PASS (7 cầu nối trên lưới 8th) |
| narration | PASS (142 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 38,25–39) |
| motioncheck | PASS mọi era (agent tự đo) |
| loudest 100 ms | 39,7 s, trong act payoff 39–41,25 s |
| loudness | −14,1 LUFS, true peak −2,3 dBFS |
| bước RMS quanh cú cắt | ≈ +4 dB (−23 → −19 dB) tại 39,0 s; bước lớn nhất cả bài ở 41,0 s là giọng vào sau khoảng ngắt câu |

- Shot yếu nhất: "mask" (27–33 s) — khối "mảng to" chỉ 2 ô ngang nên ý "mảng quá to" chưa thật rõ; hero khá nhỏ (r 9 điểm ảnh) trong mọi cảnh.
- Chưa kiểm chứng: không nghe được bằng tai (chỉ đo LUFS/Whisper); "QR" đọc kiểu "kiu-a".
- Drive: đã lưu (My Drive / Vạn vật vận hành như thế nào — Video). rclone vẫn cảnh báo client_id dùng chung sắp bị khai tử.
