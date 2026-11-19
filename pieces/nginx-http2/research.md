# Kiểm chứng sự kiện: NGINX HTTP/2 "nginx2root" (CVE-2026-123007)

Ngày kiểm chứng: 19/11/2026. Chú thích: ĐÚNG = có nguồn sơ cấp/uy tín xác nhận; SAI = nguồn nói khác; CHƯA RÕ = chỉ một nguồn thứ cấp, hoặc các nguồn mâu thuẫn.

Nguồn chính:
- [THN] https://thehackernews.com/2026/11/10-year-old-nginx-http2-flaw-lets.html
- [UBU] https://ubuntu.com/security/CVE-2026-123007
- [BESOFT] https://besoft.vn/blog/lo-hong-nginx-http2-ton-tai-10-nam-cach-kiem-tra-va-va
- [NGX-ADV] https://nginx.org/en/security_advisories.html
- [NGX-CHG] https://nginx.org/en/CHANGES
- [WIZ] https://www.wiz.io/blog/nginx-http2-rce-vulnerabilities
- [XINT] https://xint.io/blog/nginx2root-remote-code-execution (trang chủ: https://nginx2root.com)
- [CIRCL-VL] https://cve.circl.lu/vuln/CVE-2026-123007 (trang Vulnerability-Lookup của CIRCL, tổng hợp bản ghi CVE, F5, CERT-FR)
- [DEB] https://security-tracker.debian.org/tracker/CVE-2026-123007
- F5 K000163926 (https://my.f5.com/manage/s/article/K000163926): không tải được nội dung, chỉ dẫn lại qua UBU/CIRCL-VL.
- Không tìm được bài khuyến cáo (TR) riêng của CIRCL. Các ý "theo CIRCL" dưới đây chỉ có THN trích lại. Rapid7: không tìm được bài blog hay repo GitHub qua tìm kiếm; CIRCL-VL có liệt kê "Rapid7 blog on the CVE-2026-123007 integer underflow" trong phần tham chiếu.

---

## 1. CVE-2026-123007, biệt danh nginx2root; CVSS 4.0 = 9.2; Ubuntu priority High
**ĐÚNG.**
- Biệt danh "nginx2root" do Xint đặt (trang nginx2root.com, mục "Found by" dẫn tới xint.io). Trang này gom chung 5 CVE: 123007, 123634, 123633, 121810, 113425. Tức là "nginx2root" là tên chuỗi khai thác, không riêng một CVE. [XINT], [THN]
- CVSS 4.0 = 9.2 (Critical), vector `AV:N/AC:H/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N`. CVSS 3.1 = 8.1 (High). [UBU], [CIRCL-VL]
- Ubuntu Priority: High, lý do ghi trên trang là "this is an RCE". [UBU]
- Lưu ý: nginx.org xếp mức "Major" (thang riêng của nginx.org). [NGX-ADV]

## 2. Có từ 1.9.5 (22/9/2015); ảnh hưởng 1.9.5 → 1.31.8; bản sửa 1.31.9 (mainline) và 1.30.7 (stable), phát hành 18/11/2026
**ĐÚNG.**
- nginx.org ghi: vulnerable 1.9.5–1.31.8; not vulnerable 1.31.9+, 1.30.7+. [NGX-ADV]
- Mục 1.31.9 trong CHANGES đề ngày 18 Nov 2026. [NGX-CHG]
- Wiz gọi 1.30.7 là "stable", 1.31.9 là "mainline". [WIZ]
- THN: 1.9.5 phát hành ngày 22/9/2015. Dải ảnh hưởng gồm cả các bản vá tháng 10: 1.31.7 và 1.30.6 (14/10), 1.31.8 (21/10). [THN]
- NGINX Plus: bản sửa là 37.3.0.1 và 37.0.8.1. Các bản R34–R36 bị ảnh hưởng nhưng chưa có bản sửa. [THN], [WIZ]

## 3. Cơ chế, tác động, ASLR, Wiz & Xint, không cần xác thực
**ĐÚNG về cơ bản. Có một chi tiết kỹ thuật nên diễn đạt cẩn thận.**
- Mô tả chính thức (F5/CVE, trích trên UBU và CIRCL-VL): khi xử lý một số lưu lượng HTTP/2 nhất định, cửa sổ điều khiển luồng (flow control window) vượt ngưỡng cho phép, dẫn tới tràn bộ đệm heap. Thường kéo theo lỗi segmentation fault ở worker. Có thể chạy mã nếu ASLR bị tắt hoặc bị vượt qua. Đây là lỗi mặt phẳng dữ liệu (data plane), không ảnh hưởng mặt phẳng điều khiển (control plane). [UBU], [CIRCL-VL]
- CWE: CWE-191 (integer underflow) và CWE-787 (ghi ngoài biên). [CIRCL-VL]
- Chi tiết kỹ thuật:
  - Wiz: send_window bị tràn số âm (integer underflow), sinh ra độ dài sai, rồi một lệnh sao chép bộ nhớ ra ngoài biên trên đường gửi TLS. [WIZ]
  - Xint: dữ liệu trong hàng đợi được cộng trả lại vào send window hai lần, đẩy cửa sổ vượt mức tối đa. [XINT]
  - Câu "một luồng HTTP/2 đặc biệt" của Besoft dễ gây hiểu sai. Mô tả gốc chỉ nói "certain traffic" (một số lưu lượng nhất định), và theo Rapid7 cần tới hàng trăm GB, không phải một luồng đơn lẻ.
- Wiz xác nhận chạy được mã và vượt được ASLR trên bản chính thức 1.31.7 và 1.31.8 (HTTP/2 qua TLS, hệ 64-bit). [WIZ]
- Xint: bản khai thác làm lộ địa chỉ image và heap của nginx ngay trong lệnh sao chép lỗi, nhờ đó vượt được ASLR. [XINT]
- Không cần xác thực: ĐÚNG. Vector CVSS có PR:N/UI:N; Wiz ghi "unauthenticated". [UBU], [WIZ]
- Ghi chú: THN không nói gì về cơ chế flow-control. Phần cơ chế lấy từ UBU/F5.

## 4. Khai thác thực tế, KEV, PoC, quyền worker, SCTP/Docker, Rapid7 128 GB
- Chưa thấy khai thác thực tế: **ĐÚNG**. F5, Wiz và Rapid7 đều chưa ghi nhận (THN). Theo đánh giá SSVC của CISA (hiển thị trên CIRCL-VL): Exploitation = none. [THN], [WIZ], [CIRCL-VL]
- Chưa có trong CISA KEV (tính đến 18/11/2026): **ĐÚNG**. [THN]
- PoC công khai trên GitHub: **ĐÚNG, nhưng phải ghi rõ là PoC của Rapid7.** Ghi chú trong repo nói PoC chỉ phù hợp để trình diễn với một container Docker vừa khởi động trên cùng máy. CERT-FR cũng xác nhận có PoC công khai. Về Wiz và Xint: THN viết cả hai đã công bố PoC, nhưng blog của Wiz nói chưa phát hành PoC "at this time", còn Xint giữ lại các bước cuối của exploit và chi tiết lỗi nhân, chỉ đăng video demo. → Không nên nói Wiz hay Xint công bố PoC. [THN], [CIRCL-VL], [WIZ], [XINT]
- Mã chạy với quyền của worker: **ĐÚNG**. [THN], [XINT]
- Xint lên được root nhờ lỗi SCTP của nhân Linux, kể cả khi nginx chạy trong Docker: **ĐÚNG**. Lỗi là use-after-free/double free trên đường gửi SCTP, có từ Linux v4.15 (2018). Nó cho phép vượt KASLR và gọi hàm tùy ý trong nhân. Vì mọi container dùng chung nhân của máy chủ, kẻ tấn công lấy được shell root trên host. Điều kiện: máy phải dùng được SCTP. [XINT], [THN]
- PoC của Rapid7 cần khoảng 128 GB lưu lượng HTTP/2: **ĐÚNG** (theo THN; không tìm được bài gốc của Rapid7). Thêm chi tiết: bản demo mất 2,5 phút. Với đường truyền chậm hơn khoảng 300 Mbit/s, việc truyền sẽ vượt giới hạn kết nối mặc định 1 giờ của nginx và thất bại. Phương pháp còn phụ thuộc vào hàm sao chép bộ nhớ của glibc trên CPU x86-64 có `avx512f` và `avx512vl`. [THN]

## 5. Ubuntu, Debian, cách tắt HTTP/2
- Ubuntu: nginx Vulnerable từ 16.04 đến 26.10 (gồm 18.04, 20.04, 22.04, 24.04, 26.04): **ĐÚNG**. 14.04 trusty: Not affected (nginx 1.4.6 chưa có HTTP/2). [UBU]
- Debian chưa có gói sửa: **ĐÚNG MỘT PHẦN, cần cập nhật.** bookworm, trixie và forky vẫn Vulnerable, nhưng sid (unstable) đã có bản sửa 1.30.6-4. Lúc viết bài THN chưa có. Bullseye không được liệt kê. [DEB], [THN]
- CIRCL khuyên tạm tắt HTTP/2: **ĐÚNG theo THN.** Không tìm được văn bản gốc của CIRCL. Wiz và CERT-FR cũng khuyên tắt. [THN], [WIZ], [CIRCL-VL]
  - Từ 1.25.1 trở lên: đặt `http2 off;` trong từng `server` bị ảnh hưởng, và bỏ `http2` khỏi `listen`. Từ 1.9.5 đến 1.25.0: bỏ `http2` khỏi dòng `listen` (ví dụ `listen 443 ssl;`). [THN]
  - Kiểm tra lại bằng `openssl s_client -alpn h2`. Nếu vẫn thấy `ALPN protocol: h2` thì HTTP/2 vẫn đang bật. [THN]
  - Cẩn thận: tóm tắt CERT-FR trên CIRCL-VL ghi ngược mốc phiên bản (gán `http2 off;` cho ≤1.25.0). Không dùng bản đó. Chỉ thị `http2` có từ 1.25.1.
- Tắt HTTP/2 chặn được CVE-2026-123007 và CVE-2026-123633, không chặn 3 lỗi còn lại: **ĐÚNG**. [THN], [XINT]

## 6. Bốn lỗi khác được vá trong 1.31.9/1.30.7
**ĐÚNG về danh sách và điểm CVSS 9.2 (theo THN). Mô tả CVE-2026-123634 của Besoft SAI. Nên bổ sung: bản vá còn sửa thêm 5 CVE khác.**
- THN: cả 5 lỗi đều có CVSS 4.0 = 9.2. Lưu ý nginx.org xếp mức khác nhau theo thang riêng: 123007 và 113425 "Major", còn 121810, 123633, 123634 "Medium". [THN], [NGX-ADV]
- CVE-2026-121810: use-after-free trong HTTP/3 khi `worker_connections` không đủ. Ảnh hưởng 1.25.0–1.31.8. **ĐÚNG**. [NGX-CHG], [NGX-ADV]
- CVE-2026-113425: use-after-free trong mail proxy (cấu hình `proxy on` + `auth_http`). Ảnh hưởng 0.5.33–1.31.8. **ĐÚNG**. [NGX-CHG], [XINT]
- CVE-2026-123634: use-after-free trong `resolver` khi cùng một tên được phân giải đồng thời trong các subrequest. Điều kiện: tên máy chủ trong proxy_pass được ghép từ biến (lấy từ request), cộng thêm subrequest SSI hoặc `mirror` tới location tra cùng tên đó. Ảnh hưởng 0.6.18–1.31.8. → Câu của Besoft "tên máy chủ proxy được ghép từ biến SSI hoặc mirror" là **SAI**: SSI/mirror là loại subrequest, không phải nguồn của biến. [NGX-CHG], [THN], [XINT]
- CVE-2026-123633: use-after-free trong HTTP/2 khi `worker_connections` không đủ và request được chuyển về backend (upstream). Ảnh hưởng 1.19.7–1.31.8. **ĐÚNG**. [NGX-CHG], [WIZ]
- Bổ sung: 1.31.9 còn vá CVE-2026-125283, -118899, -120967, -120993 và -123640 (mức Major/Medium/Minor theo nginx.org). [NGX-CHG]

## 7. reload không đủ; Docker tag
- `reload` không đủ, cần restart hoặc binary upgrade: **ĐÚNG**. Reload không thay file thực thi đang chạy. Các phiên HTTP/2 hoặc mail cũ vẫn nằm trên worker cũ ("worker process is shutting down"). Nên `systemctl restart nginx` hoặc nâng cấp binary trực tiếp (live binary upgrade). [XINT], [THN]
  - Besoft chỉ nói "khởi động lại hẳn", không nhắc phương án binary upgrade.
  - Wiz chỉ nói reload sau khi tắt HTTP/2 rồi kiểm tra worker cũ đã thoát hết. [WIZ]
- Image Docker chính thức có tag 1.31.9 và 1.30.7, kể cả bản Alpine: **ĐÚNG** (theo THN; chưa đối chiếu Docker Hub). Cần tạo lại container. [THN], [BESOFT]

## 8. Dấu hiệu bị tấn công theo CIRCL; randomize_va_space
- 4 dấu hiệu theo CIRCL (THN trích): worker chạy chương trình lạ; worker thoát bất thường hoặc để lại core dump; kết nối HTTP/2 sống lâu, nhận nhiều dữ liệu nhưng ít request được ghi log; kết nối ra ngoài hoặc truy vấn DNS bất thường. **ĐÚNG**, nhưng nguyên văn là "kết nối ra ngoài *hoặc* truy vấn DNS bất thường", rộng hơn "DNS ra ngoài". Kèm theo hai lưu ý: access log sạch không loại trừ bị tấn công, và mỗi dấu hiệu riêng lẻ chưa phải bằng chứng. [THN]
  - Xint gợi ý thêm: dùng `ss` tìm kết nối dài từ một IP, nhận vào nhiều nhưng gửi ra ít; đặt rule auditd `execve` theo UID của worker; tìm "signal 11" và core dump trong error log. [XINT]
- `randomize_va_space` nên bằng 2: **CHƯA RÕ về nguồn.** Về kỹ thuật thì đúng: 2 là ASLR đầy đủ trên Linux, 0 là tắt. Nhưng THN, Ubuntu, Wiz, Xint và CIRCL-VL đều không nhắc tới tham số này. Đây là khuyến nghị riêng của Besoft. Nếu dùng trong video, không nên gán cho CIRCL. Lưu ý thêm: Wiz và Xint đã vượt được ASLR, nên ASLR bật chỉ làm khó hơn chứ không chặn được.

---

## Cách đọc tự nhiên bằng tiếng Việt (cho lồng tiếng)

| Viết | Đọc |
|---|---|
| NGINX | "en-gin-ích" (cách đọc gốc "engine-x"); tránh đánh vần "en-gi-ích" |
| nginx2root | "en-gin-ích tu rút" |
| HTTP/2 | "hát tê tê pê hai" (hoặc "ết tê tê pê hai") |
| HTTP/3 | "hát tê tê pê ba" |
| HTTP/1.1 | "hát tê tê pê một chấm một" |
| CVE | "xê vê e" |
| CVE-2026-123007 | "xê vê e hai không hai sáu, một hai ba không không bảy" (có thể nói gọn: "mã lỗi một hai ba không không bảy") |
| CVE-2026-123633 | "... một hai ba sáu ba ba" |
| CVE-2026-123634 | "... một hai ba sáu ba bốn" |
| CVE-2026-121810 | "... một hai một tám một không" |
| CVE-2026-113425 | "... một một ba bốn hai lăm" |
| CVSS 9.2 | "xê vê ét ét chín phẩy hai" |
| ASLR | "ây ét eo a" hoặc "a ét lờ rờ"; có thể giải thích: "cơ chế xáo trộn địa chỉ bộ nhớ" |
| SCTP | "ét xê tê pê" |
| CISA KEV | "xi-sa kép" |
| PoC | "pốc" hoặc "bản khai thác mẫu" |
| Docker / Alpine | "đốc-cơ" / "an-pai" |
| Wiz / Xint / Rapid7 / CIRCL | "uýt" / "xin" / "ra-pít xe-vần" / "xơ-cồ" (hoặc "xi-ếc-cơ-lờ") |
| 1.9.5 | "một chấm chín chấm năm" |
| 1.31.8 | "một chấm ba mốt chấm tám" |
| 1.31.9 | "một chấm ba mốt chấm chín" |
| 1.30.7 | "một chấm ba mươi chấm bảy" |
| 1.25.1 | "một chấm hai lăm chấm một" |
| 16.04 / 22.04 / 24.04 / 26.10 | "mười sáu không bốn" / "hai hai không bốn" / "hai tư không bốn" / "hai sáu mười" |
| 22/9/2015 | "hai mươi hai tháng chín năm hai nghìn không trăm mười lăm" |
| 18/11/2026 | "mười tám tháng mười một năm hai nghìn không trăm hai mươi sáu" |
| 128 GB | "một trăm hai mươi tám gi-ga-bai" |
| `http2 off` | "hát tê tê pê hai óp" |
| worker | "uốc-cơ" hoặc "tiến trình worker" |
| randomize_va_space | "răn-đơ-mai vê a xpây-xơ" (nên tránh đọc trong video, chỉ hiện chữ) |
