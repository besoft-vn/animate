Sản xuất video hôm nay cho kênh "Vạn vật vận hành như thế nào" (video ngắn tiếng Việt giải thích nguyên nhân, nguyên lý, cách hoạt động của sự vật, sự việc, hiện tượng), làm bằng skill Animate trong repo này, lồng tiếng ElevenLabs, tiếng Việt.

Bước đầu: `git fetch origin claude/nifty-keller-b05bpw && git checkout claude/nifty-keller-b05bpw && git pull` (code kênh nằm trên nhánh này). Rồi đọc và làm đúng `channel/DAILY.md` từ đầu đến cuối, kể cả các mục quy tắc 5b (khung hình gọn), 5c (không đơ), 5d (âm thanh mềm).

Bạn là quản lý team agents: chọn chủ đề tiếp theo trong `channel/topics.md`, giao agent nghiên cứu và kiểm chứng, viết kịch bản, tạo giọng ElevenLabs bằng `plugins/animate/skills/animate/tools/tts-elevenlabs.mjs` (key nằm trong bí mật mạng của môi trường; biến ELEVENLABS_API_KEY trống là bình thường; giọng Tuan Khang `GaEEAHHYlbueVlFfyrPr`, model eleven_v3), giao 2–3 agent hoạt hình vẽ song song, build → export (`--share --no-captions`, chỉ MỘT video) → review → `channel/stillcheck.py`, sửa tới khi đạt.

Khi xong: lưu video lên Drive bằng `bash channel/upload-drive.sh "<file>"`, commit và push lên nhánh `claude/nifty-keller-b05bpw` (nếu phiên không được push nhánh đó thì push lên nhánh làm việc của phiên và ghi rõ tên nhánh trong tin nhắn). Cuối cùng BẮT BUỘC báo cho người dùng: gửi video bằng SendUserFile với status "proactive" kèm tóm tắt tiếng Việt (chủ đề, ý chính, style, độ dài, đã lưu Drive chưa, số đo kiểm tra, chỗ yếu nhất, credit ElevenLabs, chủ đề ngày mai). Nếu hỏng ở bước nào, vẫn commit những gì có và vẫn gửi tin nhắn nói rõ dừng ở đâu.

Lần chạy tự động: tự duyệt các bước kiểm tra, không hỏi người dùng giữa chừng.
