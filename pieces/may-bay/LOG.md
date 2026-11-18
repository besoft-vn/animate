# LOG — máy bay (2026-11-18, lịch chạy tự động)

- Chủ đề: "Máy bay nặng hàng trăm tấn sao vẫn bay được?" (giao thông; tập trước là đồ gia dụng). Style sketchbook, F5 fixed-hero journey (hero = một túi không khí), 1 SLAM vào "lực nâng".
- Nghiên cứu (agent) → research.md: tránh "equal transit time", "động cơ nâng máy bay", "chỉ Bernoulli/chỉ Newton mới đúng"; không đưa số "bao nhiêu tấn khí/giây" (không có nguồn cho máy bay lớn). "Hàng trăm tấn" (A380 575 t, 747-8I ≈ 448 t); "nhanh gấp đôi → nâng gấp bốn" (L ∝ v², NASA).
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 10 câu, 701 ký tự, 1 take/câu, không phải tạo lại. Whisper nghe 148/154 chữ. 59,25 s. (faster-whisper phải cài `python3 -m pip install faster-whisper`.)
- 3 agent hoạt hình song song: sc-plane (hook, engine, takeoff, end), sc-wing (wing, bend, pressure), sc-lift (push, lift, speed).
- Sửa sau review: cảnh pressure đơ 24,0–25,8 s → hero được "hút" lên vùng áp thấp khi đọc "giảm", vùng áp thấp thở chậm; nền nhịp lặng dày hơn (0,016 → 0,022, vào sớm 0,2 s); vùng áp thấp đầu cảnh push khớp với cảnh pressure.

## Số đo (renders/share.mp4)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 32,5 s) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (154 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 31,6–32,5) |
| loudest 100 ms | 32,9 s, trong act payoff 32,5–34,75 s |
| nhảy RMS quanh cú cắt | tối đa 9,5 dB / 0,2 s |
| loudness | −14,0 LUFS, true peak −2,2 dBFS |
| deterministic | true |

- Shot yếu nhất: "speed" — biểu đồ ×1/×2 khá nhỏ, nửa trên khung trống lúc đầu; "takeoff" mũi tên lực nâng đặt ở đầu thân chứ không ngay trên cánh; đuôi máy bay lấn vào vùng phải (x > 940) ở hook/engine/takeoff (không có chữ ở đó).
- Chưa kiểm chứng: không nghe được bằng tai (chỉ đo RMS/LUFS và Whisper).
- Drive: đã lưu (My Drive / Vạn vật vận hành như thế nào — Video).
