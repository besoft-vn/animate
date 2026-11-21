# LOG — màn hình cảm ứng (2026-11-21, lịch chạy tự động)

- Chủ đề: "Màn hình cảm ứng biết ngón tay bạn ở đâu?" (công nghệ; tập trước "ngáp" là cơ thể). Style isometric, F5 fixed-hero journey (hero = một đầu ngón tay có mặt), 1 SLAM vào "chỗ chạm" (43,0 s).
- Nghiên cứu (agent) → research.md: cảm ứng điện dung tương hỗ (hàng phát / cột nhận), ngón tay kéo một phần điện trường xuống đất → điện dung tương hỗ GIẢM (không nói "thêm điện dung"); "lần lượt từng hàng" là đơn giản hoá; tần số quét 120 Hz là con số phổ biến (Samsung), dải 20–240 Hz → kịch bản nói "chừng một trăm hai mươi lần mỗi giây"; găng len cách điện.
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 10 câu, 756 ký tự, 1 take/câu; Whisper nghe 158/170 chữ. 61,5 s.
- 3 agent hoạt hình song song: sc-phone (hook, grid, end — điện thoại iso, kính nhấc lên lộ lưới), sc-field (cap, finger, glove — mặt cắt kính + 2 điện cực, đường sức xanh), sc-grid (scan, drop, sweep, locate — lưới nhìn từ trên + chip).
- Sửa của quản lý trước review: crosshair vẽ đè mặt hero → vẽ sau lưng hero, vòng lớn quanh đầu ngón; nhãn "hụt" đè vạch quét; bó dây hàng rối ở góc → 2 trục bus; găng len: đường sức bị che sau găng (đọc thành "đi vào găng") → vẽ đường sức đè lên găng, xuyên qua nguyên vẹn. stillcheck trên mp4 FAIL 7 đoạn đơ (motioncheck lúc vẽ PASS nhưng nét mảnh trên nền trắng mất khi nén) → camera "thở" mạnh hơn (zoom ≤ 8 %, trôi dọc ±50, lắc ngang ±26).

## Review độc lập (6b) — agent mới, không đọc code, chỉ contact sheet + lời
| # | mức | lỗi | cách sửa | re-review |
|---|---|---|---|---|
| 1 | MUST | lưới (hàng/cột) hiện muộn, cột mờ, nhãn "cột" chỉ ra mép khung | hàng xong ~8 s, cột ~9,8 s cùng độ đậm; nhãn "cột" đậm, chỉ đúng một cột | FIXED |
| 2 | MUST | cảnh cuối không có phụ đề 54–57 s | dòng 1 hiện từ 54,4 s | FIXED |
| 3 | MUST | vùng "hụt" ở cảnh cuối là đĩa xanh đậm → đọc thành "nhiều tín hiệu" | vẽ thành "lỗ" trắng nhạt, viền xanh nhạt đứt nét | FIXED |
| 4 | NICE | đồng hồ "lực" chưa bị gạch | gạch X dày ngay khi hiện | FIXED |
| 5 | NICE | nhãn bị cắt nửa trong cầu nối ("bình th…") | mọi nhãn tắt trước cửa sổ cầu nối | FIXED |
| 6 | NICE | đầu câu 6 không có phụ đề | phụ đề vào 0,1 s sau đầu cảnh | FIXED |
| 8 | NICE | chấm giao điểm xuất hiện đột ngột ở cảnh 06 | hiện đầy, đều nhau từ cảnh 04 | FIXED |
| 9 | NICE | mũi tên ↑ lơ lửng | thêm nhãn "nhô lên" | FIXED |
| 10 | NICE | nhãn "chỗ chạm" trùng phụ đề, vạch quét kẹt ở hàng 1 | bỏ nhãn, bỏ vạch quét sau cú cắt | FIXED |
| 11 | NICE | "len không dẫn điện" sát mép trái | căn giữa | FIXED |
| 12 | NICE | nhãn nhỏ nhạt màu | PAL.text | FIXED |
| 13 | NICE | đường sức vẽ đè ngón tay | (đã ở sau hero; lúc 27 s hero đã chạm) | — |
| 7 | NICE (để lại) | ngón tay đậu sát mép trên lưới khi giải thích quét | nổi lên y 440 giữa cảnh; vẫn gần mép | PARTLY |
| — | NICE (để lại) | nhãn "bình thường" nhạt/khó hiểu; phụ đề 31 s & 49 s đang mờ dần khi đổi dòng | — | — |

## Số đo (renders/share.mp4)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 43,0 s) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (170 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 42,0–43,0) |
| loudest 100 ms | 43,3 s, trong act payoff 43–45,25 s |
| loudness | −14,2 LUFS, true peak −1,8 dBFS |
| deterministic | true |

- Shot yếu nhất: cảnh 04 (quét) — ngón tay đậu sát mép trên lưới, nhãn "bình thường" nhạt; cảnh cuối chuyển động chủ yếu nhờ camera + chữ hiện dần (nét mảnh).
- Chưa kiểm chứng: không nghe được bằng tai (chỉ đo LUFS/Whisper). 61,5 s (hơi quá mốc 60 s).
- Drive: đã lưu (My Drive / Vạn vật vận hành như thế nào — Video).
