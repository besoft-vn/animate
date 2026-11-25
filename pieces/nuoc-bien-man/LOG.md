# LOG — nước biển mặn (2026-11-25, lịch chạy tự động)

- Chủ đề: "Vì sao nước biển mặn?" (thiên nhiên; tập trước "Wi‑Fi" là công nghệ). Style sketchbook (đúng gợi ý), F5 fixed-hero journey: hero "Giọt" đi theo vòng tuần hoàn nước — từ bãi biển lên mây, rơi thành giọt mưa hơi chua (CO₂), gặm đá, nhặt một hạt muối (huy hiệu tím), theo sông ra biển, xuống miệng phun dưới đáy, bốc hơi và BỎ hạt muối lại trong biển; vòng lặp hàng trăm triệu năm → SLAM (38,75 s): muối rải lên đất liền dày > 160 m ≈ tòa nhà 40 tầng; cân bằng ~3,5 %; kết: cùng bãi biển, hero nếm nước biển, bong bóng nghĩ về đá núi.
- Nghiên cứu (agent) → research.md (USGS, NOAA, Britannica, Open University, White *Geochemistry*): độ mặn ~35 g/kg (3,5 %); sông ~0,12 g/L → biển mặn ~300 lần; muối rải lên đất liền > 500 ft ≈ 166 m (USGS); natri chủ yếu từ đá phong hóa, clorua phần lớn từ khí núi lửa → câu kết nói "một phần trong đó từng là đá núi", câu mở không nói "phần lớn".
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 10 câu, 675 ký tự. Whisper: câu "end" nghe "vị mạnh" → tạo lại 1 lần (73 ký tự), lần 2 nghe đúng "vị mặn". Các nhầm còn lại của Whisper ("liềm", "đầy biển", "lãng") là lỗi nhận dạng nhẹ, nội dung đúng. 58,25 s.
- 3 agent hoạt hình song song: sc-coast (hook, rain, time, end), sc-land (rock, river, vents), sc-sea (evap, payoff, balance). Quản lý: props (coast/sea/river/mountain/saltGrain/co2Bubble/heroGiot), head, bridges, score.
- Sửa của quản lý sau export 1: 5 nhãn lấn vùng UI phải ("phong hóa", "núi lửa", "≈ tòa nhà/40 tầng", "lắng xuống đáy", bóng CO₂) → dời vào; TEXT 0 trong safe zone.

## Review độc lập (6b) — agent mới, không đọc code, chỉ contact sheet + lời
| # | mức | lỗi | cách sửa | re-review |
|---|---|---|---|---|
| 1 | MUST | 29,5 s: hero bay lên vẫn cầm hạt muối, hạt muối lơ lửng trên sườn núi → như muối bay hơi theo | hero trôi ra biển (680,1072), hạt muối tách ra khi còn trong nước (28,15 s) và chìm thẳng xuống; hero chỉ bay lên sau đó; tia vapour + nhãn "bốc hơi" dời ra trên biển | FIXED |
| 2 | MUST | 25 s: nhãn "núi lửa" lơ lửng, gần hero, không chỉ vào nón núi lửa | đặt cạnh nón + mũi tên chì chỉ miệng | FIXED |
| 3 | MUST | 13 s: "ph" gõ dở cạnh giọt xanh đọc thành "pH" | "phong hóa" hiện gần như tức thì, dời lên cao, xa hero | FIXED (vòng 2) |
| 4 | MUST | 37 s: "100…200" không có đơn vị | "triệu năm" viết cùng lúc với bộ đếm; dời phải để hero không che | FIXED |
| 5 | MUST | 47–49 s: mũi tên "từ sông" đi từ trời xuống | thêm cửa sông ở bờ trái, mũi tên nằm ngang ở mặt nước; nhãn dời lên bờ | FIXED |
| — | NICE (để lại) | 5 s mũi tên "muối" chỉ lên sông thay vì hạt; 9 s CO₂ chưa nhập giọt rõ; 15 s "khoáng chất" giữ < 2 s; 19–21 s hero kéo 2–3 hạt vs 1 hạt; "~300 lần" chữ nhỏ trên nền nước; tòa nhà ~13 hàng cửa sổ; 57 s đường nét đứt lệch khỏi dòng sông | — | NOT FIXED |

## Số đo (renders/share.mp4, 58,25 s)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 38,75 s) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (149 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 37,9–38,75) |
| motioncheck | PASS mọi era |
| loudest 100 ms | 39,3 s, trong act payoff 38,75–41 s |
| loudness | −14,0 LUFS, true peak −1,6 dBFS |
| bước RMS quanh cú cắt | +8 dB (−32 → −24) tại 38,75 s; bước 12,4 dB ở 39,5 s là giọng vào |

- Shot yếu nhất: "rain" — hero bay lên mây rồi rơi trong ~4 s, CO₂ nhập giọt chưa thật rõ; "river" nhãn "~300 lần" nhỏ trên nền nước.
- Chưa kiểm chứng: không nghe được bằng tai (chỉ đo LUFS/Whisper).
- Drive: đã lưu (My Drive / Vạn vật vận hành như thế nào — Video). rclone vẫn cảnh báo client_id dùng chung sắp bị khai tử.
