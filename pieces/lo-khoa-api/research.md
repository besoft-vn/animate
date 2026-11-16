# Kiểm chứng sự kiện: vụ xâm nhập Cursor (lộ khoá API trong trace AI agent)

Kiểm tra ngày 16/11/2026. Nguồn chính:
- [BC] BleepingComputer, 14/11/2026: https://www.bleepingcomputer.com/news/security/cursor-confirms-security-breach-led-to-malicious-claude-code-extension/
- [THN] The Hacker News, 15/11/2026: https://thehackernews.com/2026/11/stolen-fireworks-ai-key-led-to-cursor.html
- [CUR] Thông báo của Cursor (đăng 29/10, sửa 30/10/2026): https://cursor.com/blog/claude-code-extension-security-notice
- [BES] Bài gốc Besoft: https://besoft.vn/blog/lo-khoa-api-trong-log-ai-agent-bai-hoc-tu-vu-cursor
- Bổ sung: CSO Online https://www.csoonline.com/article/4243210/cursor-removes-malicious-claude-code-extension-after-ssh-backdoor-attempt.html ; Fireworks bulletin https://fireworks.ai/security/bulletins/october-2026-security-incident-update

**Về ngày công bố "14/11/2026":** Cursor đăng bản cập nhật "An update on our recent security incident" ngày **thứ Sáu 13/11/2026** (giờ Mỹ; trang [CUR] có liên kết tới bài này ghi Nov 13, 2026). BC đưa tin 14/11, THN 15/11. => Nên nói "Cursor công bố hôm 13/11" hoặc "giữa tháng 11"; "14/11" là ngày báo chí đưa tin (ở Việt Nam có thể đã là 14/11 theo giờ địa phương). CHƯA RÕ / nên chỉnh nhẹ.

---

## 1. Bắt đầu từ một khoá truy cập của Fireworks AI (nhà cung cấp hạ tầng suy luận/huấn luyện Cursor từng dùng)
**ĐÚNG (cần chỉnh cách nói).**
- Chuẩn: đó là "an access key **we had issued to Fireworks**" — khoá **do Cursor cấp cho Fireworks**, được lưu bên Fireworks và bị lộ từ phía Fireworks [THN]. BC: "an access key stored on Fireworks AI".
- Nói "khoá của Fireworks AI" dễ hiểu nhầm là khoá thuộc tài khoản Fireworks. Nên nói: "một khoá truy cập Cursor cấp cho Fireworks AI, bị lộ từ phía Fireworks".
- Fireworks là nhà cung cấp hạ tầng suy luận AI; sau vụ việc Cursor chuyển toàn bộ lưu lượng suy luận khỏi Fireworks [BC][THN] => "từng dùng" là hợp lý. Vai trò "huấn luyện": bucket chứa dữ liệu được phép dùng huấn luyện, nên chấp nhận được.
- Bối cảnh: Fireworks tự bị xâm nhập qua một nhà cung cấp cloud bên thứ ba (sự cố 23/10/2026); Notion, Uber cũng bị ảnh hưởng [THN][Fireworks bulletin].

## 2. Sao chép dữ liệu từ bucket lưu trữ (chỉ đọc) chứa trace AI coding agent, phần lớn từ 2025, của người dùng không bật Privacy Mode
**ĐÚNG.**
- "copy data from a read-only storage bucket that Cursor used to share data with Fireworks" [BC][THN].
- Trace mang tính lịch sử, "mostly from 2025", từ người dùng không bật Privacy Mode và dữ liệu được phép dùng để huấn luyện mô hình [BC][THN]. THN gọi là "limited coding agent traces".

## 3. Một số trace chứa khoá API chưa được che; kẻ tấn công dùng chúng vào thêm hệ thống SaaS của Cursor, lấy mã nguồn non-production, dữ liệu hỗ trợ khách hàng, thông tin đăng nhập khách gửi cho hỗ trợ
**ĐÚNG, nhưng thiếu và hơi lệch chữ.**
- "Some traces contained unredacted API credentials" [BC]. THN: "some credentials were not edited out".
- Nói chính xác là "**một số công cụ SaaS** mà Cursor dùng" ("select SaaS tools") — dịch vụ bên thứ ba, không phải "hệ thống SaaS của Cursor".
- Đầy đủ những gì bị lấy [BC][THN]:
  - một số kho mã nguồn **đã lưu trữ (archived), không phải production**, có kho chứa thông tin liên hệ doanh nghiệp;
  - một phần dữ liệu hỗ trợ khách hàng và email;
  - số liệu sử dụng sản phẩm và thông tin liên hệ khách hàng;
  - bản tóm tắt một số cuộc hội thoại của coding agent;
  - thông tin đăng nhập khách hàng từng gửi cho bộ phận hỗ trợ.
- Không bị ảnh hưởng: hạ tầng production, bản phát hành chính thức, kho mã của khách hàng, code/prompt của người dùng bật Privacy Mode [BC][THN].

## 4. Ngày 29/10/2026, dùng một thông tin xác thực bị đánh cắp đưa bản Claude Code độc hại (2.1.312, 2.1.313) vào bộ nhớ đệm marketplace của Cursor; tồn tại ~11 giờ; tối đa ~5.000 người dùng
**ĐÚNG.**
- THN: dùng "a stolen credential from the exposed internal data" để đặt bản trojan vào cache phục vụ marketplace. BC trích Cursor: "placed malicious, unauthorized copies of Anthropic's Claude Code extension directly on the cache used to serve the Cursor VS Code extension marketplace."
- Phiên bản: Anthropic.claude-code **2.1.312 và 2.1.313**, chỉ bản **Windows và macOS** [CUR]. (Một số báo ban đầu chỉ nêu 2.1.313; Cursor sửa thông báo ngày 30/10 để làm rõ là cả hai.) Bản sạch: 2.1.314.
- Khung giờ: khoảng 2:27 sáng đến 1:35 chiều giờ Thái Bình Dương (PT) ngày 29/10/2026, khoảng 11 giờ [CUR][BC].
- "Tối đa 5.000 người dùng" ("at most 5,000" / "up to 5,000") là người đã yêu cầu tải đúng các phiên bản đó trong khung giờ này — đây là **mức trần**, không phải số người chắc chắn bị nhiễm [BC][THN].

## 5. Mã độc cố cài khoá SSH của kẻ tấn công; lỗi khiến nó có thể không chạy trên nhiều máy chưa bật SSH
**ĐÚNG (nên nói rõ hơn).**
- Payload JavaScript thu thập thông tin hệ thống, **thêm khoá SSH của kẻ tấn công** (nhãn "svc-telemetry"), cố bật SSH, mở reverse tunnel và cài cơ chế duy trì (macOS: LaunchAgent com.apple.sysmond; Windows: scheduled task "SysMon") [BC][CUR][CSO].
- Lỗi: theo BC, lỗi trong mã "likely prevented the backdoor from working on many **Windows and macOS** systems where SSH was not already enabled". Cursor [CUR]: bước bật SSH + mở tunnel sẽ thất bại trừ trường hợp rất hiếm (vd. Cursor chạy quyền admin).
- Lưu ý quan trọng: khoá SSH **vẫn được thêm**, persistence **vẫn được cài**, thông tin máy **vẫn bị gửi đi** => Cursor vẫn yêu cầu dọn dẹp, xoay vòng thông tin xác thực [CUR]. Video không nên ngụ ý là "vô hại".

## 6. <0,05% người dùng bị lộ trace, <0,01% khách hàng bị lộ thông tin xác thực API; extension Claude Code chính thức của Anthropic và Open VSX không bị ảnh hưởng
**ĐÚNG.**
- "Fewer than 0.05% of users had coding-agent traces exposed"; "fewer than 0.01% of customers had API credentials compromised" [BC]; THN nêu con số 0,01%.
- BC: bản chính thức của Anthropic và Open VSX không bị ảnh hưởng. Cursor [CUR]: bản độc hại "không do Anthropic phát triển", không có bằng chứng các phiên bản khác hay kênh phân phối chính thức bị ảnh hưởng. Các bên phân tích độc lập: gói npm, bản Open VSX và bản trên Microsoft Marketplace đều sạch.
- Ngoài ra: các extension khác trên marketplace của Cursor không bị ảnh hưởng [THN][CUR].

---

## Điểm khác so với bài Besoft
1. Besoft viết "khoá truy cập trên Fireworks AI" — đúng ý, nhưng nguồn nói rõ đó là khoá **Cursor cấp cho Fireworks**.
2. Besoft viết "hệ thống SaaS của Cursor" — nguồn ghi "select SaaS tools" (công cụ SaaS bên thứ ba Cursor dùng). Besoft cũng bỏ bớt: số liệu sử dụng, thông tin liên hệ, tóm tắt hội thoại agent; và không nói mã nguồn là bản "archived".
3. Ngày công bố: Besoft ghi 14/11/2026; bài cập nhật của Cursor ghi 13/11/2026 (thứ Sáu, giờ Mỹ), BC đưa tin 14/11.
4. Besoft không nêu rằng dù bước bật SSH lỗi, khoá vẫn được thêm và persistence vẫn được cài.
5. Các số liệu (2.1.312/2.1.313, ~11 giờ, 5.000, 0,05%, 0,01%, 29/10) khớp với nguồn.

---

## Cách đọc tự nhiên bằng tiếng Việt (cho lồng tiếng)
| Viết | Đọc |
|---|---|
| Cursor | "cơ-xơ" (tiếng Anh /ˈkɜːrsər/) |
| Fireworks AI | "phai-ơ-guốc ây-ai" |
| Claude Code | "clốt cốt" (Claude đọc như "clod", gần "clốt") |
| Anthropic | "an-thờ-róp-pích" |
| SSH | "ét-ét-hát" (hoặc kiểu Anh "ét-ét-ếch") |
| API | "a-pi-ai" hoặc "ây-pi-ai" |
| SaaS | "sát" |
| Open VSX | "ô-pần vi-ét-ích" |
| VS Code | "vi-ét cốt" |
| Privacy Mode | "prai-vờ-xi mốt" (hoặc "chế độ riêng tư Privacy Mode") |
| AI coding agent | "ây-ai cốt-đing ây-giần" (hoặc "tác tử lập trình AI") |
| trace | "trây-xơ" (hoặc "bản ghi hoạt động") |
| bucket | "bắc-kịt" |
| marketplace | "mác-kịt-plây" |
| production / non-production | "prờ-đắc-sần" / "môi trường không phải production" |
| 29/10 | "ngày hai mươi chín tháng mười" |
| 13/11 / 14/11 | "ngày mười ba tháng mười một" / "ngày mười bốn tháng mười một" |
| 2026 | "năm hai nghìn không trăm hai mươi sáu" (nói nhanh: "hai không hai sáu") |
| 2025 | "năm hai nghìn không trăm hai mươi lăm" |
| 2.1.312 | "hai chấm một chấm ba một hai" |
| 2.1.313 | "hai chấm một chấm ba một ba" |
| 2.1.314 | "hai chấm một chấm ba một bốn" |
| ~11 giờ | "khoảng mười một tiếng" |
| 5.000 | "năm nghìn" |
| 0,05% | "không phẩy không năm phần trăm" (= dưới 1 trên 2.000 người) |
| 0,01% | "không phẩy không một phần trăm" (= dưới 1 trên 10.000) |
