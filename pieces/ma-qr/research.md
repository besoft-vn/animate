# Research: Mã QR chứa thông tin như thế nào?

## 1. Ý chính (một câu)
Mã QR là một bảng ô vuông đen/trắng, trong đó mỗi ô là một bit (đen = 1, trắng = 0). Chữ được đổi thành dãy số nhị phân (mỗi ký tự trong chế độ byte chiếm 8 ô), rồi xếp theo đường ziczac trong khung có 3 ô vuông định vị ở góc. Mã còn được thêm phần sửa lỗi Reed–Solomon, nên vẫn đọc được khi bị bẩn, rách hay có logo che một phần.

## 2. Quy trình theo thứ tự

### A. Tạo mã
1. **Chọn chế độ mã hoá.** Có bốn chế độ: số (0001), chữ-số (0010), byte (0100) và Kanji (1000). Ở chế độ byte, mỗi ký tự là 1 byte, tức 8 bit; bảng mã mặc định là ISO-8859-1, tương thích ASCII cho chữ Latin. (Thonky: data-encoding, byte-mode-encoding)
2. **Ghép chuỗi bit.** Chuỗi gồm: mã chế độ (4 bit), số ký tự (8 bit ở phiên bản 1–9 với chế độ byte), các byte dữ liệu, bit kết thúc (tối đa bốn số 0), rồi các byte đệm 11101100 và 00010001 lặp lại cho đến khi đầy. (Thonky: data-encoding)
3. **Thêm mã sửa lỗi Reed–Solomon.** Có bốn mức: L ≈ 7%, M ≈ 15%, Q ≈ 25%, H ≈ 30% số codeword (từ mã) có thể khôi phục. Muốn sửa được bao nhiêu codeword thì phải thêm gấp đôi chừng đó codeword sửa lỗi. (qrcode.com; Wikipedia)
4. **Vẽ các mẫu chức năng.** Thứ tự như sau. (Thonky: module-placement-matrix)
   - **3 mẫu định vị** (finder pattern) kích thước 7×7 ở các góc trên-trái, trên-phải và dưới-trái. Góc dưới-phải bỏ trống. Mỗi mẫu có tỉ lệ đen:trắng:đen:trắng:đen = 1:1:3:1:1, được chọn vì đây là tỉ lệ "hiếm gặp nhất" trên tờ rơi, tạp chí và bao bì, nhờ vậy máy không nhầm và xác định được hướng ở mọi góc quét. (qrcode.com/en/history)
   - **Dải phân cách** trắng rộng 1 ô bao quanh mẫu định vị.
   - **Mẫu căn chỉnh** (alignment pattern) 5×5, có từ phiên bản 2 trở lên, giúp bù độ méo và cong của ảnh. (Thonky; Telerik)
   - **Mẫu thời gian** (timing pattern): hàng 6 và cột 6 gồm các ô đen trắng xen kẽ, giúp máy đếm toạ độ từng ô. (Thonky; Telerik)
   - **Một ô tối cố định** và **vùng thông tin định dạng** (format info). Vùng này ghi mức sửa lỗi và mẫu mặt nạ, được bảo vệ bằng mã BCH và có 2 bản sao. Từ phiên bản 7 trở lên có thêm vùng thông tin phiên bản. (Thonky; Wikipedia)
5. **Xếp bit dữ liệu theo đường ziczac.** Bắt đầu ở góc dưới-phải, đi lên theo cột rộng 2 ô. Chạm mép trên thì dịch sang 2 cột bên trái và đi xuống, cứ thế lặp lại như con rắn. Những ô thuộc mẫu chức năng thì bỏ qua, và cột thời gian dọc cũng được nhảy qua. Quy tắc là "ô trắng cho 0, ô đen cho 1". (Thonky: module-placement-matrix)
6. **Áp mặt nạ** (mask). Có 8 mẫu mặt nạ, mỗi mẫu đảo màu một số ô dữ liệu theo một quy tắc hình học. Máy thử cả 8 và chấm điểm phạt theo 4 luật: (1) có từ 5 ô cùng màu liền nhau; (2) có khối 2×2 cùng màu; (3) có dãy giống mẫu định vị 1:1:3:1:1, phạt +40 điểm mỗi lần; (4) tỉ lệ ô đen lệch xa 50%. Mẫu nào ít điểm phạt nhất thì được chọn. Mục đích là tránh mảng đen hoặc trắng lớn và tránh "mẫu định vị giả". Mặt nạ không áp lên các mẫu chức năng. (Thonky: data-masking)
7. **Chừa vùng yên tĩnh** (lề trắng) rộng 4 ô ở cả 4 cạnh. (qrcode.com/en/howto/code.html)

### B. Điện thoại đọc mã
1. Camera tìm 3 dấu vuông có tỉ lệ 1:1:3:1:1. Ba điểm này cho biết vị trí, kích thước, góc xoay và độ nghiêng của mã. (qrcode.com history; Telerik)
2. **Vì sao 3 mà không phải 4?** Nếu cả 4 góc giống nhau thì mã xoay 90°, 180° hay 270° trông vẫn y hệt, máy không biết đâu là "đầu". Góc trống duy nhất cho biết chiều của mã. Ba điểm cũng đã đủ để xác định một mặt phẳng nghiêng. *(Đây là lập luận hình học. Nguồn chỉ nói thẳng rằng mẫu định vị giúp đọc mã "từ mọi hướng 360°" và cho biết hướng: qrcode.com/en/about, qrcode.com/en/history.)*
3. Mẫu căn chỉnh giúp nắn lại ảnh bị phối cảnh hoặc cong. Mẫu thời gian giúp chia lưới, tức xác định ô nào ở hàng nào, cột nào.
4. Máy đọc vùng định dạng để biết mức sửa lỗi và mặt nạ, rồi gỡ mặt nạ (đảo lại màu các ô).
5. Máy đọc các ô theo đúng đường ziczac để lấy lại chuỗi bit. Reed–Solomon sửa những ô sai hoặc bị che.
6. Máy tách thành từng byte và đổi sang ký tự: được văn bản, đường link, số điện thoại… Việc này không cần mạng. Chỉ khi nội dung là một đường link thì điện thoại mới cần mạng để mở trang đó.

## 3. Con số và nguồn
| Thông tin | Giá trị | Nguồn |
|---|---|---|
| Ra đời | 1994, DENSO WAVE (Nhật). Nhóm do Masahiro Hara dẫn dắt (2 người), phát triển trong khoảng 1,5 năm | https://www.qrcode.com/en/history/ |
| Mục đích ban đầu | Theo dõi loại và số lượng phụ tùng ô tô, thay nhiều nhãn mã vạch trên mỗi thùng bằng một nhãn. Dùng trong "Kanban điện tử" của ngành ô tô | https://en.wikipedia.org/wiki/QR_code ; qrcode.com/en/history |
| "QR" | Quick Response (phản hồi nhanh) | qrcode.com/en/history |
| So với mã vạch | Mã vạch chứa khoảng 20 ký tự chữ-số | qrcode.com/en/history |
| Bằng sáng chế | DENSO WAVE công bố đặc tả và tuyên bố không thực thi quyền sáng chế | qrcode.com/en/history |
| Tiêu chuẩn | AIM 1997, JIS 1999, ISO 2000 (ISO/IEC 18004) | qrcode.com/en/history |
| Phiên bản | 40 phiên bản: V1 = 21×21 ô, V40 = 177×177 ô, mỗi bậc thêm 4 ô mỗi cạnh (cạnh = 17 + 4×V) | https://www.qrcode.com/en/about/version.html |
| Dung lượng tối đa (V40-L) | 7.089 chữ số, 4.296 ký tự chữ-số, 2.953 byte, 1.817 Kanji | https://www.thonky.com/qr-code-tutorial/character-capacities ; Wikipedia |
| Dung lượng V40-H | 3.057 chữ số, 1.852 chữ-số, 1.273 byte, 784 Kanji | Thonky character-capacities |
| V1, chế độ byte | L 17, M 14, Q 11, H 7 ký tự | Thonky character-capacities |
| Mức sửa lỗi | L ~7%, M ~15%, Q ~25%, H ~30% | https://en.wikipedia.org/wiki/QR_code ; https://www.qrcode.com/en/about/error_correction.html (M 15%, Q 25% trong văn bản) |
| Mẫu định vị | 7×7 ô, tỉ lệ 1:1:3:1:1 | https://www.thonky.com/qr-code-tutorial/module-placement-matrix ; qrcode.com/en/history |
| Mẫu căn chỉnh | 5×5 ô, từ V2 trở lên | Thonky module-placement-matrix |
| Mặt nạ | 8 mẫu, 4 luật phạt, chọn tổng điểm thấp nhất | https://www.thonky.com/qr-code-tutorial/data-masking |
| Vùng yên tĩnh | 4 ô mỗi cạnh | https://www.qrcode.com/en/howto/code.html |
| Mã chế độ | số 0001, chữ-số 0010, byte 0100, Kanji 1000 | https://www.thonky.com/qr-code-tutorial/data-encoding |
| Byte đệm | 11101100, 00010001 (236, 17) | Thonky data-encoding |
| Reed–Solomon | Cần số codeword sửa lỗi gấp đôi số codeword muốn sửa. Ban đầu dùng chống nhiễu cho tín hiệu vệ tinh và tàu thăm dò | qrcode.com/en/about/error_correction.html |
| Phổ biến đại chúng | Từ 2002, khi điện thoại ở Nhật có sẵn trình đọc QR | qrcode.com/en/history |
| Logo giữa mã | Thường dùng mức H; máy coi phần bị che là "hư hỏng" và tự khôi phục. Đổi lại, mã chịu hư hỏng thật kém hơn | Wikipedia QR_code |

Lưu ý: phần trăm sửa lỗi tính theo **codeword** (khối 8 bit), không phải theo diện tích hình. Nói "khoảng ba mươi phần trăm" là an toàn.

## 4. Hiểu lầm thường gặp
- **"Mã QR chỉ là chìa khoá trỏ tới một cơ sở dữ liệu."** Sai. Dữ liệu nằm ngay trong các ô đen trắng, và quét mã không cần mạng (một mã QR chứa văn bản vẫn đọc được khi tắt mạng). *Sắc thái:* nhiều mã chứa một đường link, và một số dịch vụ "QR động" dùng link rút gọn chuyển hướng tới trang khác. Khi đó cái được mã hoá vẫn chỉ là chuỗi ký tự của link, phần còn lại nằm trên web chứ không nằm trong mã.
- **"Hoa văn QR là ngẫu nhiên hoặc trang trí."** Sai. Mỗi ô là một bit, nằm đúng vị trí trên đường ziczac. Các khối lớn là mẫu định vị, mẫu căn chỉnh và mẫu thời gian, có chức năng riêng. Trông "lộn xộn" là do mặt nạ cố tình trộn cho đều.
- **"Rách hay bẩn một góc là hỏng."** Sai. Ở mức H vẫn khôi phục được khoảng 30% codeword. Đó là lý do có thể đặt logo ở giữa mã. Tuy vậy, nếu che mất mẫu định vị thì máy khó tìm thấy mã.
- **"Mã nào cũng như nhau."** Không phải. Có 40 cỡ, từ 21×21 đến 177×177 ô. Dữ liệu càng nhiều thì càng nhiều ô và ô càng nhỏ.
- **"Mỗi chữ là một ô."** Không. Ở chế độ byte, 1 chữ cần 8 ô. Ngoài ra còn có các ô cho tiêu đề, sửa lỗi và mẫu chức năng.

## 5. Thuật ngữ tiếng Việt
| Tiếng Anh | Tiếng Việt nên dùng |
|---|---|
| module | mô-đun (ô vuông) |
| finder / position detection pattern | mẫu định vị (ô vuông định vị ở góc) |
| separator | dải phân cách |
| alignment pattern | mẫu căn chỉnh |
| timing pattern | mẫu thời gian (đường ô xen kẽ) |
| format information | thông tin định dạng |
| version | phiên bản (cỡ mã) |
| data / codeword | dữ liệu / từ mã |
| error correction (Reed–Solomon) | mã sửa lỗi Reed–Solomon ("Rít–Xô-lô-môn") |
| error correction level L/M/Q/H | mức sửa lỗi L/M/Q/H (thấp, trung bình, khá, cao) |
| mask pattern | mặt nạ (mẫu mặt nạ) |
| quiet zone | vùng yên tĩnh (lề trắng) |
| bit / byte | bit / byte ("bai") |
| binary | nhị phân |

**Đọc số thành chữ:**
- 21×21: "hai mươi mốt nhân hai mươi mốt"
- 177×177: "một trăm bảy mươi bảy nhân một trăm bảy mươi bảy"
- 1994: "năm một nghìn chín trăm chín mươi tư"
- 7.089: "bảy nghìn không trăm tám mươi chín"
- 4.296: "bốn nghìn hai trăm chín mươi sáu"
- 2.953: "hai nghìn chín trăm năm mươi ba"
- 30%: "ba mươi phần trăm"; 7%: "bảy phần trăm"
- 1:1:3:1:1: "một – một – ba – một – một"
- 8 mặt nạ: "tám mặt nạ"; 40 phiên bản: "bốn mươi phiên bản"; 4 ô lề: "bốn ô"
- 01000001: đọc từng chữ số, "không một không không không không không một", hoặc chỉ nói "tám ô đen trắng"

## 6. Gợi ý cho video
**Câu mở "lật ngược":**
- "Bạn nghĩ quét mã QR là điện thoại đi tra một kho dữ liệu ở đâu đó? Không. Thông tin nằm ngay trong những ô đen trắng này."
- Phương án khác: "Xé mất một góc mã QR, nó vẫn quét được. Vì sao?"

**Ví dụ nhỏ, dễ hình dung: mã hoá chữ "HI"** (ASCII, đã kiểm tra bằng máy)
- H = 72 = `01001000` → trắng đen trắng trắng đen trắng trắng trắng
- I = 73 = `01001001` → trắng đen trắng trắng đen trắng trắng đen
- (A = 65 = `01000001`, để thay thế nếu cần)
- Chuỗi đầy đủ ở phiên bản 1: `0100` (chế độ byte) + `00000010` (2 ký tự) + `01001000` + `01001001` + `0000` (kết thúc) + byte đệm, rồi thêm mã sửa lỗi.
- Hình minh hoạ: 8 ô một hàng lật sang đen hoặc trắng theo từng bit, sau đó "con rắn" 2 cột đặt chúng vào góc dưới-phải của lưới 21×21.
- Lưu ý khi dựng hình: trong mã thật, các bit còn bị mặt nạ đảo màu nên sẽ không thấy y nguyên `01001000` trên mã. Nên dựng như một sơ đồ đơn giản hoá và ghi chú "trước khi áp mặt nạ".

**Trình tự hình gợi ý (45–60 giây):** câu mở → phóng to 1 ô (đen = 1, trắng = 0) → chữ H thành 8 ô → con rắn ziczac điền lưới → 3 ô vuông góc, xoay mã để thấy góc trống chỉ hướng → mặt nạ trộn màu → che 30% hoặc đặt logo mà vẫn quét được → chốt: 1994, Denso Wave, phụ tùng ô tô.

## Nguồn
- https://www.qrcode.com/en/history/
- https://www.qrcode.com/en/about/
- https://www.qrcode.com/en/about/version.html
- https://www.qrcode.com/en/about/error_correction.html
- https://www.qrcode.com/en/howto/code.html
- https://www.thonky.com/qr-code-tutorial/data-encoding
- https://www.thonky.com/qr-code-tutorial/byte-mode-encoding
- https://www.thonky.com/qr-code-tutorial/module-placement-matrix
- https://www.thonky.com/qr-code-tutorial/data-masking
- https://www.thonky.com/qr-code-tutorial/character-capacities
- https://en.wikipedia.org/wiki/QR_code
- https://www.telerik.com/winui/documentation/controls/radbarcode/2d-barcodes/barcode-qrcode-overview (mẫu thời gian và mẫu căn chỉnh)
