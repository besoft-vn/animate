# LOG — bầu trời xanh (2026-11-16)

## Run 1 (lịch chạy 7:54, style riso) — bị loại
Người dùng: "nhiều hạt nhìn rối mắt" (110 phân tử, nền lưới chấm riso). Phiên lịch chạy không push được (không gắn repo) nên code không lấy lại được.

## Run 2 — làm lại, sketchbook, khung hình gọn
- Nghiên cứu (agent) → sửa 2 câu: "gần sáu lần" ((700/450)^4 ≈ 5,9), "phần lớn màu xanh bị hất đi".
- Giọng: Tuan Khang, eleven_v3, qua API (key trong bí mật mạng) — tts-elevenlabs.mjs sửa: v3 không nhận previous/next_text; chạy 3 take song song. 58,6s; Whisper 138/147 chữ.
- 3 agent hoạt hình song song (sc-sky / sc-light / sc-eye); luật: ≤ 8–10 phân tử r ≥ 22, ≤ 8 mũi tên, nền giấy trơn, grain giảm 1800 → 260.
- Review: cuts/morphs on grid PASS; narration PASS; STORY ARC 6/6; TEXT PASS (sau khi dời "!" và "lớp khí" khỏi mép phải); dead beats PASS; loudest 100ms 29,5s (cú cắt vào vòm trời xanh) sau 0,7s im lặng; −13,7 LUFS; deterministic.
- Shot yếu nhất: "waves" — nửa dưới khung trống, sóng dồn lên trên. Chưa kiểm chứng: không nghe được bằng tai.

## Run 3 — theo góp ý "có vài cảnh bị đơ" + "hoàng hôn trên biển trực quan hơn"
- channel/stillcheck.py mới: bản run 2 có 9 đoạn đơ > 1,5s (dài nhất 5,2s ở cuối) → 3 agent thêm chuyển động có chủ đích; thêm camera đẩy chậm ≤ 4–6% (hook, scatter, end).
- Sunset vẽ lại thành hoàng hôn trên biển (seaHorizon/seaGlitter dùng chung), end cùng mặt biển.
- Kết quả: stillcheck PASS (0 đoạn > 1,5s, trừ nhịp lặng 28,7–29,5s và 1s giữ khung cuối); review như run 2 (STORY ARC 6/6, TEXT PASS, loudest 29,5s, −13,7 LUFS).
