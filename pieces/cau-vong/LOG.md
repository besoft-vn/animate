# LOG — cầu vồng (2026-11-27, lịch chạy tự động)

- Chủ đề: "Cầu vồng xuất hiện ra sao?" (thiên nhiên; tập trước "Phanh xe máy" là giao thông). Style sketchbook (gợi ý là riso, nhưng riso từng bị chê nhiều hạt → sketchbook nền phẳng; phổ màu vẽ bằng scribble màu). F5 fixed-hero journey: hero đi tìm chân cầu vồng (cầu vồng trượt theo) → nhìn ngang: nắng thấp sau lưng, mưa trước mặt → nắng trắng = mọi màu → cận cảnh MỘT giọt mưa: khúc xạ (tím cong nhiều), phản xạ mặt sau, ló ra; đỏ ~42°, tím ~40° → mỗi giọt gửi mắt một màu (giọt cao đỏ, giọt thấp tím) → mọi giọt quanh bóng đầu thành một vòng → SLAM (51,5 s): nhìn từ máy bay, cầu vồng là vòng tròn trọn vẹn quanh bóng máy bay, mặt đất chỉ che phần dưới → kết: hai người, hai cầu vồng, "của riêng bạn".
- Nghiên cứu (agent) → research.md (WMO Cloud Atlas, NWS, HyperPhysics, Met Office, OpenStax, ASU, NASA APOD, USGS, atoptics). Không nói "7 màu".
- Đường tia trong giọt tính bằng `dropTrace()` (Descartes, h = −0,86R; kiểm số: đỏ n 1,331 → 42,4°). Độ tán sắc vẽ phóng đại ~5× (tím vẽ ≈ 32°) — ghi chú "(vẽ phóng đại)" trên hình; nhãn vẫn ghi đúng 42°/40°.
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 10 câu, 708 ký tự, 1 lần, không tạo lại. Whisper nghe đúng nội dung (chỉ lỗi nhận dạng nhẹ "cầu vòng", "rội", "tiên nắng"). 65,25 s.
- 3 agent hoạt hình song song: sc-world (hook, setup, white, end), sc-drop (enter, reflect, angle), sc-ring (one, circle, payoff). Quản lý: props (dropTrace, raindrop, sunBeam, lightRay, rainbowArc, heroBack, heroSide…), head, bridges, score.

## Review độc lập (6b) — agent mới, không đọc code, chỉ contact sheet + lời
| # | mức | lỗi | cách sửa | re-review |
|---|---|---|---|---|
| 1 | MUST | 62–65 s: hero quay mặt ra máy quay (lưng về cầu vồng, mặt về mặt trời) đúng lúc nói "cầu vồng của riêng bạn" | giữ hero nhìn từ sau lưng (heroBack), vui bằng giơ tay + nhảy + lấp lánh | FIXED |
| 2 | MUST | 6–17 s, 39–45 s (và cận cảnh giọt): hero nhìn thẳng máy quay nên "nắng sau lưng" thành nắng bên hông | thêm `heroSide` (nhìn nghiêng, mắt/miệng/chân hướng PHẢI về phía mưa/giọt); dùng cho mọi cảnh nhìn ngang và cận cảnh giọt | FIXED |
| — | NICE (đã sửa) | cung góc 40°/42° màu xám như nét thừa; "(vẽ phóng đại)", "kho báu?", "bạn ấy" nhỏ/nhạt; "bạn ấy" nằm trong cầu vồng của hero | cung góc tô màu tia; chữ đậm hơn, to 56px; "bạn ấy" dời cạnh người bạn | — |
| — | NICE (để lại) | bóng đầu trông như "mũ đầu bếp" trong cảnh nhìn sau lưng; tia nắng vàng nhạt dù nói "trắng"; mặt trời sát đất mà tia tới giọt cao (tia song song — đúng); nhãn gõ dở "tí m" thoáng qua; 6–9 s chưa có mưa tới chữ "màn mưa" | — | NOT FIXED |

## Số đo (renders/share.mp4, 65,25 s)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 51,5 s) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (163 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 50,75–51,5) |
| motioncheck | PASS mọi era (agent tự đo) |
| loudest 100 ms | 51,8 s, trong act payoff 51,5–53,75 s |
| loudness | −14,4 LUFS, true peak −2,1 dBFS |
| bước RMS quanh cú cắt | +9,5 dB (−27,8 → −18,3) tại 51,5 s; bước 11,2 dB ở 52,3 s là giọng vào |

- Shot yếu nhất: "circle" (45–51 s) — bóng đầu nhìn sau lưng hơi giống "mũ" (cột xám trên đầu hero); các đoạn cầu vồng nối lại hơi vuông đầu trước khi liền.
- Video dài 65,25 s (dài hơn mục tiêu ~60 s vì 10 câu khá dài).
- Chưa kiểm chứng: không nghe được bằng tai (chỉ đo LUFS/Whisper).
- Drive: đã lưu (My Drive / Vạn vật vận hành như thế nào — Video). rclone vẫn cảnh báo client_id dùng chung sắp bị khai tử.
