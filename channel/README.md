# Kênh "Vạn vật vận hành như thế nào" — quy trình sản xuất của team agents

Video ngắn tiếng Việt (9:16, 45–60 s) giải thích nguyên nhân, nguyên lý, cách hoạt động của sự vật, sự việc, hiện tượng quanh ta. Mỗi ngày một video, làm bằng skill **Animate** trong repo này (`plugins/animate/skills/animate/`), lồng tiếng **ElevenLabs**.

## Đội hình

| vai | ai | việc | đầu ra |
|---|---|---|---|
| Quản lý / đạo diễn | phiên chính | chọn chủ đề (`topics.md`), duyệt nghiên cứu, viết kịch bản + beat table, chọn style, viết phần dùng chung (`src/head.html`, `bridges.js`, `props.js`, `score.js`), duyệt khung hình, review cuối | `brief.md`, `voice/script.json`, `LOG.md` |
| Nghiên cứu | 1 agent | web-check mọi sự thật, số liệu kèm nguồn, thuật ngữ tiếng Việt, cách đọc số | `research.md` |
| Hoạt hình | 2–3 agent song song | mỗi agent sở hữu **một** file cảnh `src/sc-*.js`, theo hợp đồng vị trí nhân vật ở chỗ chuyển cảnh (`BR` trong head) | cảnh vẽ xong + ảnh kiểm tra |
| Lồng tiếng | quản lý (connector ElevenLabs) | một take/câu, lưu `voice/<id>.mp3`, chạy `voice.mjs` để căn thời gian từng chữ | `voice.wav`, `voice.json` |
| QA | quản lý | `review.mjs` + xem contact sheet, bảng PASS trong `LOG.md` | `renders/share.mp4` |

## Quy trình mỗi ngày

0. `bash channel/setup.sh` (font Pangolin có dấu tiếng Việt, espeak-ng, faster-whisper + model `large-v3-turbo`).
1. **Chọn chủ đề** trong `topics.md` → tạo `pieces/<slug>/`.
2. **Nghiên cứu** (agent) → `research.md` có nguồn. Không nói "đầu tiên" nếu không có nguồn.
3. **Kịch bản**: 8–10 câu, mỗi câu = một beat; số viết bằng chữ ("âm mười hai độ"); một câu mở đầu "lật ngược" điều người xem tưởng; kết thúc quay về hình ảnh mở đầu nhưng đã đổi khác. Chọn format (thường F5 fixed-hero journey hoặc F2 chronology) và style (xem gợi ý trong `topics.md`).
4. **Giọng tạm** `node <skill>/tools/voice.mjs pieces/<slug> --scratch` (espeak-ng tiếng Việt) để dựng timeline ngay.
5. **Khung dùng chung** (quản lý) rồi **giao cảnh** cho 2–3 agent hoạt hình song song.
6. **Giọng thật**: connector ElevenLabs, `creative_generate_speech`, `model_id: eleven_v3` (multilingual_v2 phát âm sai thanh điệu tiếng Việt — đã kiểm chứng bằng Whisper), `generations_count: 1`, giọng mặc định **Tuan Khang – Emotional Narrator** (nam miền Bắc, truyền cảm; chọn 15/11/2026 sau khi so 5 giọng — mẫu ở `channel/voice-samples/`) (`GaEEAHHYlbueVlFfyrPr`). Tải từng take về `voice/<id>.mp3`, đặt `"file"` trong `script.json`, chạy lại `voice.mjs` (không `--scratch`) → hình tự khớp theo chữ.
   - Không có connector: đặt `ELEVENLABS_API_KEY` trong môi trường rồi `node <skill>/tools/tts-elevenlabs.mjs lines pieces/<slug>`.
7. **Build, export, review**: `build.mjs` → `export.mjs --share` → `review.mjs`; sửa tới khi đạt; video giao là `renders/final-captions.mp4` (phụ đề tiếng Việt cháy sẵn) và `renders/share.mp4`.
8. **Ghi log + commit** lên nhánh làm việc; đánh dấu chủ đề trong `topics.md`.

## Ghi chú kỹ thuật tiếng Việt
- Font chữ trên hình: `Pangolin` (OFL, `channel/fonts/`), có đủ dấu tiếng Việt. Phụ đề cháy sẵn cũng dùng Pangolin (`piece.json` → `captions.font`).
- `voice.mjs` nhận `"lang": "vi"` trong `script.json`: giọng tạm espeak-ng tiếng Việt, nhận dạng đa ngôn ngữ, chuẩn hoá chữ có dấu khi so khớp.
- `review.wpsMax: 5.0` — tiếng Việt đơn âm tiết nên số "từ"/giây cao hơn tiếng Anh.
- Gói ElevenLabs Starter (~40.000 ký tự/tháng, ~1 video ≈ 750 ký tự, cho phép thương mại). Tạo cả 10 câu song song được. (Gói Free chỉ cho 1 lượt/lần và không cho dùng thương mại.)
