# LOG — lò vi sóng (2026-11-17, lịch chạy tự động)

- Chủ đề: "Lò vi sóng làm nóng thức ăn ra sao?" (đồ gia dụng; tập trước là thiên nhiên). Style crosshatch, F5 fixed-hero journey (hero = một phân tử nước), 1 SLAM.
- Nghiên cứu (agent) → research.md: tránh "nóng từ trong ra", "2,45 GHz là tần số cộng hưởng của nước"; dùng "hàng tỷ lần mỗi giây" (an toàn), "thấm vào lớp ngoài chừng một xăng-ti-mét".
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs). 10 câu, 696 + 78 ký tự (tạo lại câu "end" một lần: Whisper nghe "Lạnh tới hầm cơm"). Whisper 137/155 chữ. 57,0 s.
- Sự cố công cụ: ffmpeg 6.1 loudnorm treo vô hạn trên take water.mp3 → giảm 0,25 dB (volume 0.97) thì chạy. faster-whisper phải cài cho python3 (3.11): `python3 -m pip install faster-whisper`.
- 3 agent hoạt hình song song: sc-oven (hook, magnet, bounce, end), sc-molecule (water, flip, jostle), sc-heat (heat, depth, table).
- Sửa sau review: chữ "0:00" dưới UI (thu nhỏ màn hiển thị + tâm zoom cảnh end về x 880); cảnh depth đơ 39,8–41,8 s → mặt nóng bắt đầu lấn vào sớm + mũi tên; cú cắt nhảy 13 dB → hợp âm nở mềm hơn, nền nhịp lặng dày hơn (nhảy tối đa 9,1 dB/0,2 s).

## Số đo (renders/share.mp4)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 34,0 s) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (155 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d: nhịp lặng giữ nền mỏng) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 33,0–34,0) |
| loudest 100 ms | 35,4 s, trong act payoff 34–36,25 s |
| loudness | −13,8 LUFS, true peak −1,7 dBFS |
| deterministic | true |

- Shot yếu nhất: "water"/"flip" — 6 phân tử phụ khá nhỏ so với khung, nửa dưới hơi trống; dấu +/− của phân tử phụ không hiện (chỉ hero).
- Chưa kiểm chứng: không nghe được bằng tai (chỉ đo RMS/LUFS và Whisper).
