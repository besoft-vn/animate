# Chạy hằng ngày — một video "Vạn vật vận hành như thế nào"

Bạn là **quản lý team agents** của kênh. Lần chạy này tự động, không có người duyệt giữa chừng: bạn tự quyết các check-in của skill Animate (story, look, storyboard) với vai trò người duyệt, nhưng vẫn làm đủ các bước kiểm tra. Không dùng AskUserQuestion. Đọc `channel/README.md` (đội hình, quy trình, ghi chú tiếng Việt) và `pieces/tu-lanh/` (tập mẫu đã đạt: brief, script, head/bridges/props/score, LOG) trước khi bắt đầu.

## 0. Chuẩn bị
1. Repo `besoft-vn/animate`. Code kênh nằm trên nhánh `claude/nifty-keller-b05bpw` (chưa merge vào main): `git fetch origin claude/nifty-keller-b05bpw && git checkout claude/nifty-keller-b05bpw && git pull`. Làm việc và push lên chính nhánh này (`git push origin claude/nifty-keller-b05bpw`, thử lại tối đa 4 lần nếu lỗi mạng).
2. `bash channel/setup.sh` (font Pangolin, espeak-ng, faster-whisper + large-v3-turbo; lần đầu tải model mất vài phút).
3. Giọng: dùng connector ElevenLabs nếu phiên có (`account_get_usage`, còn ≥ 1.500 ký tự); lịch tự động thường KHÔNG có connector → dùng API (key nằm trong "bí mật mạng" của môi trường: proxy tự gắn vào request tới api.elevenlabs.io, nên biến `ELEVENLABS_API_KEY` trống là bình thường) với `node plugins/animate/skills/animate/tools/tts-elevenlabs.mjs lines pieces/<slug> --voice GaEEAHHYlbueVlFfyrPr --model eleven_v3` (chạy được nhiều câu, tự đặt "file"). Nếu cả hai đều không có hoặc hết ký tự: vẫn làm video với giọng tạm (`--scratch`) KHÔNG giao bản đó như bản chính — báo rõ trong tin nhắn cuối.

## 1. Chọn chủ đề
Lấy chủ đề `[ ]` đầu tiên trong `channel/topics.md` mà khác nhóm với tập liền trước (đồ gia dụng / cơ thể / thiên nhiên / công nghệ / giao thông). Slug không dấu, ví dụ `bau-troi-xanh`. Tạo `pieces/<slug>/`. Khi còn < 5 chủ đề chờ, bổ sung thêm 10 chủ đề mới vào hàng chờ.

## 2. Nghiên cứu (agent)
Giao 1 agent (general-purpose) web-check: ý chính một câu, các bước của quá trình theo đúng thứ tự, số liệu kèm URL nguồn uy tín, ngộ nhận phổ biến, thuật ngữ tiếng Việt chuẩn và cách đọc số. Ghi `pieces/<slug>/research.md`. Không nói "đầu tiên/duy nhất" nếu không có nguồn.

## 3. Kịch bản + brief (bạn)
- 8–10 câu, mỗi câu một beat, ≤ ~20 âm tiết/câu; câu đầu lật ngược điều người xem tưởng; câu cuối quay về hình mở đầu nhưng đã đổi khác. Số viết bằng chữ. `voice/script.json` với `"lang": "vi"`, `"tts": { "provider": "elevenlabs-connector", "voice": "GaEEAHHYlbueVlFfyrPr", "model": "eleven_v3" }`.
- Chọn style theo gợi ý trong topics.md (hoặc phù hợp hơn: crosshatch cho máy móc, cut-paper cho cơ thể/sinh vật, riso/sketchbook cho thiên nhiên, math cho sóng/tín hiệu, isometric cho thiết bị, pixel cho kỹ thuật số). Format: ưu tiên F5 fixed-hero journey hoặc F2 chronology (đã chứng minh). Một màu = một nghĩa cho cả video.
- `brief.md`: idea, device, format, style, bảng beat (id, câu thoại, hình, cầu nối), sound plan, claims + nguồn.

## 4. Giọng thật trước (khác với tập 1)
Gói Starter tạo song song được: gọi `creative_generate_speech` cho TẤT CẢ các câu cùng lúc (`model_id: eleven_v3`, voice `GaEEAHHYlbueVlFfyrPr`, `generations_count: 1`, cùng một flow tạo bằng `creative_create_flow`), poll `creative_get_flow_run_status`, tải ngay từng `content_url` về `voice/<id>.mp3` (link hết hạn sau vài giờ), đặt `"file"` cho mỗi câu, rồi `node plugins/animate/skills/animate/tools/voice.mjs pieces/<slug>`. Đọc lại bằng Whisper: nếu một câu nghe sai rõ rệt, tạo lại riêng câu đó một lần. KHÔNG dùng eleven_multilingual_v2 (sai thanh điệu tiếng Việt).

## 5. Khung dùng chung + hoạt hình (agents)
- Bạn viết `src/head.html` (sao chép cấu trúc của `pieces/tu-lanh/src/head.html`: era từ VOICE, `snap8`, `IDS`, `BR` hợp đồng vị trí ở cầu nối, SLAM cắt cứng trên payoff trong khoảng lặng trước câu cuối, acts, narration), `src/bridges.js`, `src/props.js` (helper riêng của chủ đề), `src/score.js` (mẫu ở tu-lanh: payoff = stab + hợp âm phẳng ~2s mức 0.04, pad cuối ~0.016), `piece.json` (style, `"scenes"`, voice music −14, `captions.font: "Pangolin"`, `captions.size: 62`, `review.wpsMax: 5.0`).
- Giao 2–3 agent hoạt hình chạy song song, mỗi agent sở hữu đúng một file `src/sc-*.js`, brief như ở tập tủ lạnh: đọc brief.md, head.html, props.js, STYLE.md + kit.js + demo của style; hợp đồng BR bắt buộc; nội dung chính y 380–1250, không gì quan trọng dưới y 1260 (phụ đề), chữ ≥ 50px trong x 60–940; tiền tố biến toàn cục riêng; build + still để tự xem; không sửa file của người khác.

## 5b. Khung hình gọn (góp ý của anh, 16/11/2026: "nhiều hạt nhìn rối mắt")
- Mỗi khung chỉ một điểm nhìn chính; nền phẳng, yên. KHÔNG rải hàng chục/hàng trăm hạt, chấm, phân tử, bụi, sao, mote nhỏ.
- Khi cần diễn tả "rất nhiều" (phân tử, hạt nhiệt...): tối đa ~8–12 vật thể, mỗi cái đủ lớn (r ≥ 18px trên khung 1080) và cách nhau rõ; phần còn lại gợi bằng một mảng màu/hình khối, không bằng chấm.
- Tắt hoặc giảm mạnh các lớp nhiễu trang trí: bụi `darkWorld` (`dust: 40`), `grain` nhẹ, lưới halftone riso thô ở mảng nền lớn → dùng tông phẳng.
- Chuyển động phụ (mote bay, tia lấp lánh) chỉ ở vùng nhân vật đang được nói tới; tối đa 1 hiệu ứng hạt mỗi cảnh.
- Agent hoạt hình phải tự xem still ở 360px rộng (`review/phone.jpg`) và hỏi: "có chỗ nào lấm tấm/rối không?" — có thì bớt.

## 5c. Không để cảnh đơ (góp ý 16/11/2026)
- Mỗi cảnh luôn có chuyển động nhẹ, có chủ đích, gắn với lời đọc: sóng trôi, tia sáng chảy, nhân vật nhìn/đi/phản ứng, chú thích viết dần. Chỉ nhịp lặng trước payoff (≤ 1 s) được đứng yên.
- Cảnh minh hoạ hiện tượng thiên nhiên: ưu tiên khung cảnh thật, dễ hình dung (vd. hoàng hôn trên biển) hơn sơ đồ trừu tượng; sơ đồ chỉ để chú thích thêm.

- Đo trong lúc vẽ (không cần export): `node channel/motioncheck.mjs pieces/<slug> <t0> <t1> [--ignore a-b]` — cùng thước đo với stillcheck. Mỗi agent hoạt hình PHẢI chạy nó cho khoảng thời gian của mình và đạt PASS trước khi báo xong (tập NGINX 19/11: 16 đoạn đơ lọt qua vì agent không tự đo).
- Chữ quan trọng (lệnh, kết quả, ghi chú) phải nằm trên màn hình ≥ 2 s sau khi gõ xong và ≥ 0,5 s trước cầu nối.

- Chữ KHÔNG rung (góp ý 19/11/2026: "nét chữ cứ rung rung"): kit giờ mặc định `TEXT_BOIL = false` — chữ giữ nét tay lệch nhẹ nhưng đứng yên; chỉ hình vẽ còn boil. Thẻ giao diện (terminal, chip) nên vẽ với `B = 0` để không boil. Đừng bật lại TEXT_BOIL.

## 5d. Âm thanh mềm (góp ý 16/11/2026: "âm thanh to đột ngột")
- Nhịp lặng trước payoff KHÔNG im bặt: giữ một lớp nền mỏng (~−30 dB trong bản mix) + một âm dâng nhỏ báo trước.
- Payoff là hợp âm nở mềm (attack ~0,3 s), không dùng tiếng "tách"/noise hit sắc, sub nhẹ. Đo RMS bản mix quanh cú cắt: không bước nhảy > ~12 dB trong 0,2 s.
- Giọng: `voice.mjs` tự cân mọi câu về −16 LUFS (script.json `"level"`).
- Review sẽ báo FAIL quy tắc "silence median ≤ peak − 15 dB": đó là chủ ý, bỏ qua.
- Cú cắt cứng: camera liền mạch qua cú cắt (cùng độ zoom), cảnh mới hoàn chỉnh từ khung đầu (cả tag và caption).

## 6. Build, export, review, sửa
`build.mjs` → `tile.mjs` (deterministic: true) → xem still các beat và mọi cầu nối → `export.mjs --share --no-captions` (KHÔNG làm bản phụ đề) → `review.mjs` → `python3 channel/stillcheck.py pieces/<slug>/renders/share.mp4 --ignore <đầu>-<cuối nhịp lặng>` (KHÔNG đoạn nào đứng yên > 1,5 s ngoài nhịp lặng cố ý — góp ý "có vài cảnh bị đơ"). Sửa tới khi: cuts/morphs on grid PASS, narration PASS, STORY ARC PASS, TEXT PASS (0 cắt/chồng, 0 dưới UI), dead beats PASS, loudest 100ms trong act payoff. Lặp nhạc bằng `--only-audio`. Xem `review/phone.jpg`.

## 6b. Review độc lập (bắt buộc — góp ý 18/11/2026: "máy bay bay ngược", không ai review)
Các kiểm tra tự động chỉ đo kỹ thuật (thời gian, chữ, âm thanh, đơ); chúng KHÔNG biết hình có đúng vật lý/logic. Sau khi export:
1. Tạo contact sheet ~1 khung / 2 s: `still.mjs pieces/<slug> <t1,t2,...> <dir>/sheet.png --scale 0.33` và file lời đọc kèm thời gian (từ voice.json).
2. Giao cho MỘT agent MỚI (không phải agent hoạt hình, KHÔNG được đọc source code, chỉ nhìn hình + nghe lời) với checklist: hướng chuyển động (vật đi đúng chiều, mũi/đầu đi trước, nền trượt ngược chiều), mũi tên lực (đúng chiều, đúng chỗ, đúng độ lớn theo lời), hướng/tư thế (lộn ngược, soi gương, ngóc/chúc sai), lời ↔ hình (nhãn đúng vật, con số khớp), khẳng định khoa học gây hiểu nhầm, nhất quán giữa các cảnh. Agent trả danh sách MUST-FIX / NICE-TO-HAVE kèm thời điểm và cách sửa.
3. Sửa mọi MUST-FIX, export lại, cho agent review xem lại đúng các chỗ đó. Ghi danh sách + cách sửa vào LOG.md.
4. Lưu ý code: nhiều helper vẽ dùng `rotate(-rot)` hoặc vật quay mặt TRÁI — luôn kiểm tra dấu góc bằng một still trước khi tin.

## 7. Giao (chỉ MỘT video, không có bản phụ đề)
- `pieces/<slug>/deliver/YYYY-MM-DD — <Tiêu đề>.mp4` (= renders/share.mp4). Video không commit (deliver/ và renders/ đã gitignore).
- `LOG.md` với bảng PASS từng shot, các số đo, shot yếu nhất, điều chưa kiểm chứng (không nghe được bằng tai). Đánh dấu `[x]` chủ đề trong topics.md (ngày, slug, style, thời lượng).
- **Drive:** `bash channel/upload-drive.sh "pieces/<slug>/deliver/YYYY-MM-DD — <Tiêu đề>.mp4"` → My Drive / "Vạn vật vận hành như thế nào — Video" (token quyền hẹp drive.file: rclone chỉ thấy thư mục nó tự tạo). Script trả exit ≠ 0 nếu lỗi: ghi rõ trong tin nhắn báo là chưa lưu được lên Drive và lỗi gì.
- Commit + push lên `claude/nifty-keller-b05bpw`.
- **Báo cho anh khi xong (bắt buộc):** gửi video bằng SendUserFile với `status: "proactive"` (để thông báo đến điện thoại), kèm tin nhắn tiếng Việt ngắn: ✅ đã xong video ngày nào, chủ đề, ý chính, style, độ dài, đã lưu Drive hay chưa, các số đo review, điều đã sửa, shot yếu nhất, credit ElevenLabs đã dùng / còn lại, chủ đề ngày mai.
- Nếu một bước hỏng không cứu được (thiếu giọng, export lỗi): vẫn commit những gì có và vẫn gửi tin nhắn (`status: "proactive"`) nói rõ ❌ đã dừng ở đâu và cần anh làm gì.
