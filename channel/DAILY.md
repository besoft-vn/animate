# Chạy hằng ngày — một video "Vạn vật vận hành như thế nào"

Bạn là **quản lý team agents** của kênh. Lần chạy này tự động, không có người duyệt giữa chừng: bạn tự quyết các check-in của skill Animate (story, look, storyboard) với vai trò người duyệt, nhưng vẫn làm đủ các bước kiểm tra. Không dùng AskUserQuestion. Đọc `channel/README.md` (đội hình, quy trình, ghi chú tiếng Việt) và `pieces/tu-lanh/` (tập mẫu đã đạt: brief, script, head/bridges/props/score, LOG) trước khi bắt đầu.

## 0. Chuẩn bị
1. Repo `besoft-vn/animate`. Code kênh nằm trên nhánh `claude/nifty-keller-b05bpw` (chưa merge vào main): `git fetch origin claude/nifty-keller-b05bpw && git checkout claude/nifty-keller-b05bpw && git pull`. Làm việc và push lên chính nhánh này (`git push origin claude/nifty-keller-b05bpw`, thử lại tối đa 4 lần nếu lỗi mạng).
2. `bash channel/setup.sh` (font Pangolin, espeak-ng, faster-whisper + large-v3-turbo; lần đầu tải model mất vài phút).
3. Kiểm tra connector ElevenLabs (`account_get_usage`): còn ≥ 1.500 ký tự. Nếu không có connector hoặc hết ký tự: vẫn làm video với giọng tạm (`--scratch`) KHÔNG giao bản đó như bản chính — báo rõ trong tin nhắn cuối.

## 1. Chọn chủ đề
Lấy chủ đề `[ ]` đầu tiên trong `channel/topics.md` mà khác nhóm với tập liền trước (đồ gia dụng / cơ thể / thiên nhiên / công nghệ / giao thông). Slug không dấu, ví dụ `bau-troi-xanh`. Tạo `pieces/<slug>/`. Khi còn < 5 chủ đề chờ, bổ sung thêm 10 chủ đề mới vào hàng chờ.

## 2. Nghiên cứu (agent)
Giao 1 agent (general-purpose) web-check: ý chính một câu, các bước của quá trình theo đúng thứ tự, số liệu kèm URL nguồn uy tín, ngộ nhận phổ biến, thuật ngữ tiếng Việt chuẩn và cách đọc số. Ghi `pieces/<slug>/research.md`. Không nói "đầu tiên/duy nhất" nếu không có nguồn.

## 3. Kịch bản + brief (bạn)
- 8–10 câu, mỗi câu một beat, ≤ ~20 âm tiết/câu; câu đầu lật ngược điều người xem tưởng; câu cuối quay về hình mở đầu nhưng đã đổi khác. Số viết bằng chữ. `voice/script.json` với `"lang": "vi"`, `"tts": { "provider": "elevenlabs-connector", "voice": "1vQIxPxX4lsNi2g3Z4cF", "model": "eleven_v3" }`.
- Chọn style theo gợi ý trong topics.md (hoặc phù hợp hơn: crosshatch cho máy móc, cut-paper cho cơ thể/sinh vật, riso/sketchbook cho thiên nhiên, math cho sóng/tín hiệu, isometric cho thiết bị, pixel cho kỹ thuật số). Format: ưu tiên F5 fixed-hero journey hoặc F2 chronology (đã chứng minh). Một màu = một nghĩa cho cả video.
- `brief.md`: idea, device, format, style, bảng beat (id, câu thoại, hình, cầu nối), sound plan, claims + nguồn.

## 4. Giọng thật trước (khác với tập 1)
Gói Starter tạo song song được: gọi `creative_generate_speech` cho TẤT CẢ các câu cùng lúc (`model_id: eleven_v3`, voice `1vQIxPxX4lsNi2g3Z4cF`, `generations_count: 1`, cùng một flow tạo bằng `creative_create_flow`), poll `creative_get_flow_run_status`, tải ngay từng `content_url` về `voice/<id>.mp3` (link hết hạn sau vài giờ), đặt `"file"` cho mỗi câu, rồi `node plugins/animate/skills/animate/tools/voice.mjs pieces/<slug>`. Đọc lại bằng Whisper: nếu một câu nghe sai rõ rệt, tạo lại riêng câu đó một lần. KHÔNG dùng eleven_multilingual_v2 (sai thanh điệu tiếng Việt).

## 5. Khung dùng chung + hoạt hình (agents)
- Bạn viết `src/head.html` (sao chép cấu trúc của `pieces/tu-lanh/src/head.html`: era từ VOICE, `snap8`, `IDS`, `BR` hợp đồng vị trí ở cầu nối, SLAM cắt cứng trên payoff trong khoảng lặng trước câu cuối, acts, narration), `src/bridges.js`, `src/props.js` (helper riêng của chủ đề), `src/score.js` (mẫu ở tu-lanh: payoff = stab + hợp âm phẳng ~2s mức 0.04, pad cuối ~0.016), `piece.json` (style, `"scenes"`, voice music −14, `captions.font: "Pangolin"`, `captions.size: 62`, `review.wpsMax: 5.0`).
- Giao 2–3 agent hoạt hình chạy song song, mỗi agent sở hữu đúng một file `src/sc-*.js`, brief như ở tập tủ lạnh: đọc brief.md, head.html, props.js, STYLE.md + kit.js + demo của style; hợp đồng BR bắt buộc; nội dung chính y 380–1250, không gì quan trọng dưới y 1260 (phụ đề), chữ ≥ 50px trong x 60–940; tiền tố biến toàn cục riêng; build + still để tự xem; không sửa file của người khác.

## 6. Build, export, review, sửa
`build.mjs` → `tile.mjs` (deterministic: true) → xem still các beat và mọi cầu nối → `export.mjs --share` → `review.mjs`. Sửa tới khi: cuts/morphs on grid PASS, narration PASS, STORY ARC PASS, TEXT PASS (0 cắt/chồng, 0 dưới UI), dead beats PASS, loudest 100ms trong act payoff. Lặp nhạc bằng `--only-audio`. Sau `--only-audio`, ghép lại bản phụ đề: `ffmpeg -i renders/final-captions.mp4 -i renders/final.mp4 -map 0:v -map 1:a -c copy` rồi thay file. Xem `review/phone.jpg`.

## 7. Giao
- `pieces/<slug>/deliver/<slug>-phude.mp4` (nén lại bản phụ đề: libx264 crf 24, aac 160k, +faststart) và `<slug>.mp4` (= renders/share.mp4). Video không commit (deliver/ và renders/ đã gitignore).
- `LOG.md` với bảng PASS từng shot, các số đo, shot yếu nhất, điều chưa kiểm chứng (không nghe được bằng tai). Đánh dấu `[x]` chủ đề trong topics.md (ngày, slug, style, thời lượng).
- Commit + push lên `claude/nifty-keller-b05bpw`.
- Gửi hai file video bằng SendUserFile (`status: "proactive"`), kèm tin nhắn tiếng Việt ngắn: chủ đề, ý chính, style, độ dài, các số đo review, điều đã sửa, shot yếu nhất, credit ElevenLabs đã dùng / còn lại, chủ đề ngày mai.
- Nếu một bước hỏng không cứu được (thiếu connector, export lỗi): vẫn commit những gì có, gửi tin nhắn nói rõ đã dừng ở đâu và cần anh làm gì.
