# LOG — wifi (2026-11-24, lịch chạy tự động)

- Chủ đề: "Wi‑Fi truyền dữ liệu qua không khí thế nào?" (công nghệ; tập trước "vết thương" là cơ thể). Style **math** (lần đầu trên kênh; chữ serif hiển thị đủ dấu tiếng Việt), F5 fixed-hero journey: hero = sinh vật pi ở góc dưới phải (HOME), theo dõi hành trình của một bức ảnh: ảnh → bit → sóng → không khí → điện thoại → ảnh; 1 SLAM vào "read" (41,75 s).
- Nghiên cứu (agent) → research.md (NIST c, arXiv survey 802.11ax: QAM‑1024 = 10 bit; Wi‑Fi 6 kênh 20 MHz: 256 sóng con, 234 dữ liệu; ETSI/FCC công suất; ACK/gửi lại). Chỉnh theo nghiên cứu: nói "cùng họ với ánh sáng" (không nói "là ánh sáng"); không vẽ "sóng to = 1, nhỏ = 0".
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 10 câu, 750 ký tự gửi đi, bộ đếm tài khoản 5.217 → 5.519 (302 credit); còn ~34.200 / 39.717. Whisper nghe đúng gần hết; lệch thanh nhỏ ("rung"→"dùng"/"rùng", "bit"→"beat") — đã gặp ở các tập trước, không tạo lại. 63,5 s. CHƯA nghe bằng tai.
- Khung dùng chung (quản lý): head.html (BR: hero đứng HOME ở mọi cầu nối), bridges.js (camera đẩy ≤ 4 %, fly đẩy qua nhịp lặng, read mở cùng zoom), props.js (COL: vàng = bit, xanh = sóng, đỏ = độ cao, xanh lá = độ lệch, tím = electron, vàng kim = ảnh, teal = đã nhận; router, phone, sineWave có điều chế, wifiArcs, wall, photoCard, bitRow, viTag), score.js (payoff nở mềm 0,3 s, nền mỏng + âm dâng trong nhịp lặng).
- 3 agent hoạt hình song song: sc-room (hook, fly, read, end), sc-wave (bits, wave, mod), sc-code (qam, ofdm, ack). Tất cả motioncheck PASS.
- Quản lý sửa: tag cảnh "read" hoàn chỉnh từ khung đầu SLAM (viTagNow); đoạn đơ 11,2–13,2 s (stillcheck) → khung vàng bước qua từng chữ số + ô ảnh tương ứng sáng lên; nhãn "hơn 200 / sóng con" sát mép phải → dời trái; nhóm bit rơi xuyên qua nhau ở 46,5 s (TEXT FAIL) → xếp hàng đợi (nhóm mới vào trên cùng, đẩy nhóm cũ xuống).

## Review độc lập (6b) — agent mới, không đọc code, chỉ contact sheet + lời (2 vòng)
| # | mức | lỗi | cách sửa | re-review |
|---|---|---|---|---|
| 1 | MUST (nâng từ "important") | 26–30 s: "độ cao"/"độ lệch" ở hai góc trên trên một vạch xanh → đọc như tên trục ngang/dọc (đúng kiểu hiểu sai QAM) | bỏ vạch xanh, tắt trục dọc; "độ cao" cạnh bán kính đỏ, "độ lệch" cạnh cung góc xanh lá | FIXED |
| 2 | MUST | 33 s: mỗi sóng con gắn 3 bit ngay sau câu "mỗi kiểu chở mười bit" (mâu thuẫn) | nhãn "10 bit" cho mỗi sóng con | FIXED |
| 3 | MUST | 44–47 s: bit hiện NGOÀI điện thoại, mũi tên chỉ VÀO máy (như "bơm bit vào") | nhóm bit sinh ra ở chân ăng-ten, trôi xuống vào màn hình, ảnh dựng bên dưới | FIXED |
| 4 | NICE | 55,4 s: hộp "110" mờ còn sót | sửa lỗi alpha, hộp mờ hẳn; ✓ teal về router sớm hơn (55,4) | FIXED |
| 5 | NICE | 21–25 s: "độ cao" dùng ngoặc ngang | mũi tên đỏ hai đầu thẳng đứng | FIXED |
| 6 | NICE | dải phổ không rõ chiều | nhãn "tần số →" | FIXED |
| — | NICE (để lại) | cả video dồn ~60 % trên khung, dưới trống; chữ nhỏ (50–54 px); mũi tên đỏ "độ cao" hơi ngắn; nhóm bit mới hơi lệch trái lúc đang bay (46,5 s) | — | NOT FIXED |

## Số đo (renders/share.mp4, 63,5 s)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 41,75 s, f1002) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (163 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 41–41,75) |
| motioncheck (từng agent) | PASS mọi era (sc-room sát ngưỡng ~0,7/0,8 vài điểm) |
| loudest 100 ms | 43,2 s, trong act payoff 41,75–44 s |
| bước nhảy RMS | ~8,7 dB/0,2 s tại cú cắt; 13,7 dB lúc giọng vào ("Electron", 42,4 s) — là giọng, không phải nhạc |
| loudness | −14,0 LUFS, true peak −2,3 dBFS |

- Shot yếu nhất: cả video dùng ~60 % trên của khung (y 380–1170), nửa dưới trống, chữ 50–54 px nhỏ trên điện thoại; trong từng cảnh: "mod" (21–25 s) — sóng mờ (ghost) chồng sóng thật, mũi tên độ cao/độ lệch ngắn.
- Chưa kiểm chứng: không nghe được bằng tai (chỉ LUFS/Whisper); dài 63,5 s (vượt mốc 60 s 3,5 s); ăng-ten điện thoại vẽ nhô ra ngoài (sơ đồ hóa, thật ra nằm trong máy).
- Drive: đã lưu (My Drive / Vạn vật vận hành như thế nào — Video). rclone vẫn báo client_id dùng chung sắp bị khai tử trong 2026.
