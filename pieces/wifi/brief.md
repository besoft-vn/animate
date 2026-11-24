# Brief — Wi‑Fi truyền dữ liệu qua không khí thế nào? (2026-11-24)

- **Idea (một câu):** Wi‑Fi không gửi "hạt dữ liệu": nó biến ảnh thành bit, rồi khắc các nhóm bit vào HÌNH DẠNG (độ cao + độ lệch) của một sóng vô tuyến — cùng họ với ánh sáng — và điện thoại đọc ngược hình dạng ấy ra 0/1.
- **Device:** một bức ảnh (vàng kim) đi một vòng: ảnh → bit → sóng → không khí → điện thoại → ảnh. Hero = sinh vật pi (piHero) đứng ở góc dưới phải (HOME = [820, 1100, 90]) theo dõi, phản ứng.
- **Format:** F5 fixed-hero journey, 9 cầu nối morph trên hero, 1 SLAM (cắt cứng) vào payoff "read" tại 41,75 s.
- **Style:** math (manim): nền gần đen phẳng, nét vector sạch, chữ serif được "Written", không grain/boil. Chữ ≥ 50 px, x 60–940, nội dung y 380–1250.
- **Màu = nghĩa** (props.js COL): vàng = bit/dữ liệu; xanh dương = sóng vô tuyến; đỏ = độ cao (biên độ); xanh lá = độ lệch (pha); tím = electron; vàng kim = bức ảnh; teal = "đã nhận"; xám = thiết bị/trục; xanh pi = hero. Cầu vồng chỉ trong dải phổ (hook/end).

## Beat table (thời gian từ voice.json; era bắt đầu)
| id | era | câu thoại | hình | owner |
|---|---|---|---|---|
| hook | 0–7,25 | Wi‑Fi cùng một họ với ánh sáng, chỉ là loại sóng mà mắt ta không nhìn thấy. | Router (trái dưới) phát 3 cung sóng xanh tới điện thoại (phải). "ánh sáng" → dải phổ điện từ hiện ra ngang màn hình: vùng sóng vô tuyến (xanh, nhãn "Wi‑Fi") … một dải cầu vồng HẸP ("mắt thấy"). Hero nhìn, ngạc nhiên. | sc-room |
| bits | 7,25–13,5 | Bức ảnh bạn gửi trước hết được biến thành một dãy số không và số một. | Ảnh vàng kim (mặt trời + đồi) trên điện thoại/khung; tách thành hàng 8–12 ô; mỗi ô thành chữ số vàng 0/1 viết dần: "01101001…" | sc-wave |
| wave | 13,5–19,75 | Router làm electron trong ăng-ten rung hai tỷ bốn trăm triệu lần mỗi giây, tỏa ra sóng. | Ăng-ten lớn (xám, dọc) bên trái; MỘT electron tím chạy lên xuống trong đó; sóng sin xanh tỏa sang phải, trôi; readout "f = 2,4 GHz" và "2 400 000 000 lần/giây"; ngoặc bước sóng "λ ≈ 12,5 cm". | sc-wave |
| mod | 19,75–25,75 | Nó khẽ đổi độ cao và độ lệch của sóng; mỗi kiểu sóng là một nhóm bit. | Sóng chia 4 đoạn; đoạn 2 cao/thấp khác (ngoặc đỏ "độ cao"), đoạn 3 lệch nhịp (vạch xanh lá "độ lệch"); dưới mỗi đoạn một nhóm bit vàng "00" "01" "11" "10". KHÔNG nói/vẽ "sóng to = 1, nhỏ = 0". | sc-wave |
| qam | 25,75–30,5 | Wi‑Fi sáu có một nghìn không trăm hai mươi bốn kiểu, mỗi kiểu chở mười bit. | Mặt phẳng: trục ngang = độ lệch? → dùng chuẩn: mỗi kiểu sóng = một điểm (khoảng cách từ tâm = độ cao đỏ, góc = độ lệch xanh lá). 4 điểm → lưới 4×4 = 16 điểm to (r ≥ 18) → phóng to thành ô vuông mờ "32 × 32 = 1024" (không vẽ 1024 chấm!) → "2¹⁰ → 10 bit" + nhóm bit vàng "1011001110". | sc-code |
| ofdm | 30,5–35,75 | Hơn hai trăm sóng con như thế chạy song song, cùng lúc chở rất nhiều bit. | 6 sóng con xếp chồng (tần số khác nhau, mỗi sóng có nhóm bit vàng nhỏ ở đầu), ngoặc "234 sóng con (Wi‑Fi 6, kênh 20 MHz)" hoặc "hơn 200"; chúng cùng trôi sang phải. | sc-code |
| fly | 35,75–41,75 | Sóng lao đi với tốc độ ánh sáng, xuyên qua tường, chạm vào ăng-ten điện thoại... | Toàn cảnh căn phòng: router trái, bức tường giữa, điện thoại phải. Cung sóng xanh lao từ router qua tường (yếu đi một chút) tới ăng-ten điện thoại. Readout "300 000 km/s". Nhịp lặng ~41,0–41,6 s: sóng vừa chạm ăng-ten, đứng chờ (động nhẹ). | sc-room |
| read | 41,75–50,0 (SLAM) | Electron trong đó rung theo, và điện thoại dịch ngược ra số không, số một! | Cắt cứng: cận điện thoại; electron tím trong ăng-ten điện thoại rung lên xuống cùng nhịp sóng; các nhóm bit vàng hiện ra; trên màn hình, ảnh vàng kim dựng lại từng hàng. Hero vui. | sc-room |
| ack | 50,0–56,0 | Mỗi gói đến nơi, điện thoại báo lại đã nhận; gói nào hỏng, router gửi lại. | Hàng 4 gói (khối nhỏ chứa bit) bay router → điện thoại; điện thoại trả mũi tên teal "đã nhận ✓"; một gói vỡ/xám "✗" → router gửi lại gói đó → "✓". | sc-code |
| end | 56,0–63,5 | Vậy đấy: bức ảnh của bạn vừa bay qua căn phòng, trên một làn sóng vô hình. | Lại căn phòng của hook, nhưng đã khác: ảnh hiện trên điện thoại; cung sóng xanh mang nhóm bit vàng nhỏ; hero vẫy tay/vui. | sc-room |

## Sound plan
Pad mát + motif hero; blip nhỏ khi bit viết ra; pluck đều (sóng mang) đổi cao độ theo kiểu sóng; arpeggio nhiều lớp ở ofdm; bậc thang đi lên ở fly, nền mỏng + âm dâng nhỏ trong nhịp lặng; payoff = hợp âm nở mềm (attack 0,3 s) + sub nhẹ; chime "đã nhận"; motif kết.

## Claims + nguồn (research.md)
- Sóng vô tuyến và ánh sáng nhìn thấy đều là sóng điện từ (cùng họ) — NASA/Britannica.
- 2,4 GHz = 2,4 tỷ dao động/giây; λ = c/f ≈ 12,5 cm (NIST c).
- Điều chế QAM thay đổi biên độ + pha; QAM‑1024 (Wi‑Fi 6, 802.11ax) = 10 bit/ký hiệu (arXiv survey 802.11ax).
- Wi‑Fi 6 kênh 20 MHz: 256 sóng con, 234 sóng con dữ liệu → "hơn hai trăm".
- ACK + gửi lại khi không có ACK (802.11 MAC; slide UCSB). Đơn giản hóa: "gói hỏng" = không có ACK.
- Không nói "sóng to = 1, nhỏ = 0"; không nói Wi‑Fi "là" ánh sáng.
