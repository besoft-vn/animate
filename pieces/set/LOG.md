# LOG — sét (2026-11-22, lịch chạy tự động)

- Chủ đề: "Sét hình thành như thế nào?" (thiên nhiên; tập trước "màn hình cảm ứng" là công nghệ). Style sketchbook (thay riso gợi ý: riso có lưới chấm + đốm mực dễ "lấm tấm", trái quy tắc 5b), F5 fixed-hero journey (hero "Tia" — từ đồi bay vào mây, nhảy lên hạt mưa đá mềm nhận huy hiệu "−", dẫn tia tiên đạo xuống), 1 SLAM vào "tia chớp" (34,5 s).
- Nghiên cứu (agent) → research.md (NOAA/NWS/NSSL, NASA): tách điện do va chạm tinh thể băng (+, lên đỉnh) ↔ mưa đá mềm/graupel (−, phần dưới) — "giả thuyết được chấp nhận rộng rãi"; tiên đạo bậc ~50 m/bước; tia hồi sáng chói đi TỪ ĐẤT LÊN (~1/3 tốc độ ánh sáng); kênh ~28.000 °C ≈ 5× bề mặt Mặt Trời; giãn nở → sấm. Tránh "8 triệu tia/ngày" (số cũ).
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 10 câu, 698 ký tự, 1 take/câu, không tạo lại. Whisper nghe 134/159 chữ (các chữ còn lại ước lượng; nghe lại bằng Whisper từng câu: đúng nội dung, "dông" → "rồng" là nhầm của Whisper). 60,4 s.
- 3 agent hoạt hình song song: sc-hill (hook, cloud, end — đồi, cây, mây dông), sc-cloud (collide, charge, heat — trong mây, mặt cắt điện tích, kênh sét nóng), sc-bolt (leader, meet, strike, thunder).
- Sửa của quản lý: props hailPellet gọi RNG sai (R() → R.f()); nhãn "từng bước", "tia ngược", "≈ 28.000 °C" lấn mép phải → dời vào; motif mở đầu quá to (loudest 100 ms ở 0,6 s) → giảm một nửa.

## Review độc lập (6b) — agent mới, không đọc code, chỉ contact sheet + lời
| # | mức | lỗi | cách sửa | re-review |
|---|---|---|---|---|
| 1 | MUST | 31–34,5 s: hero đứng đúng chỗ hai tia gặp → không thấy "hai tia chạm nhau" | hero dạt sang phải (về vị trí mở cảnh chớp) từ 29 s; tia ngược dày, rõ; tia lửa + quầng vàng nhạt khi chạm | FIXED |
| 2 | MUST | nhãn "tia ngược" ở góc trên, đọc thành nhãn của tiên đạo | đặt thấp, cạnh tia ngược, có mũi chỉ | FIXED |
| 3 | MUST | tia chớp sáng là đường lượn khác đường tiên đạo vừa thấy | vẽ bằng đoạn thẳng qua đúng các đỉnh của tiên đạo + tia ngược; mặt sáng leo từ cây lên mây 34,5–35,35 s | FIXED |
| 4 | MUST | t≈3 s: mũi tên đi xuống chưa bị gạch khi nói "không lao từ trời xuống" | gạch đỏ bắt đầu trên chữ "không", xong ~2,7 s | FIXED |
| 5 | NICE | kênh sét (heat) đè tag + phụ đề | rút ngắn y 430–1230, dời phải | PARTLY (đáy còn sát dòng phụ đề 1) |
| 6 | NICE | "≈ 2" gõ dở cạnh nhiệt kế rỗng | hiện cả cụm trong 0,2 s cùng cột đỏ | FIXED |
| 7 | NICE | "× 5" cạnh một Mặt Trời đọc thành "5 Mặt Trời" | "gấp 5 lần / bề mặt / Mặt Trời" | FIXED |
| 8 | NICE | điện tích "−" treo lơ lửng dưới mây | đưa vào dải tối đáy mây | FIXED |
| 9 | NICE | cảnh mây: mây nuốt cả cây/đồi | đáy mây chỉ xuống 1000, cây vẫn thấy | FIXED |
| 10 | NICE | tia chớp cuối đánh xuống đất trống sát hero, màu xỉn | đánh vào cây (cùng đường kênh), vàng sáng, hero đứng xa | PARTLY (lúc 55 s còn hơi xỉn) |
| 11 | NICE | cảnh va chạm: ít dấu "+" | 3 tinh thể có "+" sau cú va | FIXED |
| — | NICE (để lại) | vòng morph 53 s cắt qua phụ đề; nhãn gõ dở "ti…"/"từn…" ở 25–27 s | — | NOT FIXED |

## Số đo (renders/share.mp4)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 34,5 s) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (159 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 33,5–34,5) |
| motioncheck (từng agent) | PASS mọi era |
| loudest 100 ms | 34,9 s, trong act payoff 34,5–36,75 s |
| loudness | −14,2 LUFS, true peak −2,2 dBFS |

- Shot yếu nhất: "meet" — tia ngược chỉ dài ~100 px (cây gần chân mây), tiên đạo là nét chì mảnh; nhãn "từng bước"/"sấm" chỉ đứng ~1–1,5 s vì chữ rơi sát cầu nối.
- Chưa kiểm chứng: không nghe được bằng tai (chỉ đo LUFS/Whisper). 60,5 s (vượt mốc 60 s nửa giây).
