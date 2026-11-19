# LOG — nồi cơm điện (2026-11-19, lịch chạy tự động)

- Chủ đề: "Vì sao nồi cơm điện tự nhảy nút giữ ấm?" (đồ gia dụng; tập trước là giao thông). Style isometric, F5 fixed-hero journey (hero = một giọt nước — "giọt nước cuối cùng"), 1 SLAM vào "cạch!" (40,0 s).
- Nghiên cứu (agent) → research.md: ferit cảm nhiệt (Curie) chứ không phải nam châm mất từ tính; "khoảng 103 °C" (không nói 105); giữ ấm khác nhau theo model → kịch bản chỉ nói "chút nhiệt nhỏ"; Tuan Khang đọc giọng Bắc → "một trăm linh ba".
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 10 câu, 658 ký tự, 1 take/câu. Whisper nghe 127/149 chữ (thiếu chủ yếu "ferit" và số "một trăm linh ba" — Whisper viết thành chữ số). 55,75 s.
- Sửa công cụ: `voice.mjs` treo vô hạn trên end.mp3 (ffmpeg 6.1: loudnorm + aresample trong cùng một graph) → giải mã 2 bước (lọc ra wav float, rồi resample ở tiến trình thứ hai), có timeout.
- 3 agent hoạt hình song song: sc-cooker (hook, warm, end), sc-switch (magnet, heat, curie, click — kính lúp phóng to bộ hạn nhiệt), sc-water (boil, steam, dry).
- Sửa của quản lý: thành nồi vẽ sai thứ tự cung; tiếp điểm không chạm khi đóng; stillcheck ban đầu FAIL 12 đoạn đơ (nét mảnh trên nền trắng gần như không đổi ảnh) → camera "thở" (zoom ≤ 7%, trôi dọc) ở mọi cảnh, identity ±0,5 s quanh cầu nối; nền nhịp lặng nhỏ lại (pad 0,022→0,009, riser 0,013→0,007).

## Review độc lập (6b) — agent mới, không đọc code, chỉ contact sheet + lời
| # | mức | lỗi | cách sửa | re-review |
|---|---|---|---|---|
| 1 | MUST | "nhiệt độ vọt lên" nhưng đồng hồ đứng 100 °C tới ~34 s | nhiệt độ leo 100→102 ngay khi nồi khô (từ ~30,2 s), chuyển cam khi > 100,4 | FIXED |
| 2 | MUST | mũi tên ↑ xám cạnh "100°C" lúc nói "không nóng hơn" → đọc thành "đang tăng" | bỏ mũi tên | FIXED |
| 3 | MUST | nhãn cảnh chồng lên thẻ nhiệt độ (camera zoom đẩy thẻ lên) | thẻ vẽ trong không gian màn hình (DEFER) ở (290, 404) dưới nhãn, mọi cảnh | FIXED |
| 4 | MUST (lần 2) | khung gần trống ở 34,5 s (cầu nối dry→curie co về hero ở góc) | cầu nối đó d 0,3 / m 0,04: khoảng trống ~0,2 s thay vì ~0,6 s | sửa, chưa re-review lần 3 |
| 5 | NICE | phụ đề curie vào muộn | vào lúc ~34,85 s | FIXED |
| — | NICE (để lại) | khung cắt "lục giác" ở cầu nối (ngữ pháp morph của skill), đồng hồ gạch chéo nhỏ, hook đã ở trạng thái nấu trước khi ấn nút, hai đèn chỉ khác vị trí | — | — |

## Số đo (renders/share.mp4)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 40,0 s) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (149 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 39,0–40,0) |
| loudest 100 ms | 40,3 s, trong act payoff 40–42,25 s |
| nhảy RMS quanh cú cắt | tối đa 11,5 dB / 0,2 s |
| loudness | −14,0 LUFS, true peak −2,5 dBFS |
| deterministic | true |

- Shot yếu nhất: cầu nối dry→curie (34,5 s) vẫn có ~0,2 s gần trống vì hero ở góc trên phải; cảnh hook/warm/end ngoài vỏ nồi khá nhạt (nét xám mảnh), đồng hồ gạch chéo nhỏ.
- Chưa kiểm chứng: không nghe được bằng tai (chỉ đo RMS/LUFS và Whisper).
- Drive: đã lưu (My Drive / Vạn vật vận hành như thế nào — Video).
