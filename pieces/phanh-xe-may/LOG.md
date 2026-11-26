# LOG — phanh xe máy (2026-11-26, lịch chạy tự động)

- Chủ đề: "Phanh xe máy dừng xe như thế nào?" (giao thông; tập trước "Nước biển mặn" là thiên nhiên). Style crosshatch (đúng gợi ý), F2 chronology nối bằng morph hình tròn: phố (xe tay ga phanh, đĩa trước ấm lên) → tay phanh đẩy pít-tông nhỏ → dầu không nén được, chuỗi bi xanh chạy xuống bánh trước → cùm phanh: pít-tông to, lực nhân lên → má phanh kẹp đĩa đang quay → ma sát: động năng → nhiệt → lốp bám mặt đường kéo xe dừng → lặng → SLAM (35,75 s): dừng từ 50 km/h = rơi gần 10 m → bánh trước gánh ~7/10 → đèn đỏ, đĩa còn ấm.
- Nghiên cứu (agent) → research.md: Honda (trình tự phanh đĩa), sổ tay Honda NHX110 (xi lanh chính 12,7 mm, cùm 27 mm → ≈ 4,5× → nói "vài lần"), Wikipedia Motorcycle brakes + US Air Force + Pirelli (bánh trước ≥ 70 %), ifz (quãng phanh 50 km/h ≈ 16 m). Đổi góc: KHÔNG nói "đĩa nóng vài trăm độ" (chỉ đúng khi đua/phanh dài). 10 m = v²/2g tự tính (không phụ thuộc khối lượng).
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 10 câu 685 ký tự + tạo lại 3 câu (hook "Phần", caliper "Cầm Phan", tyre "lớp") 201 ký tự = 886. Lần 2 caliper/tyre nghe đúng; hook Whisper vẫn nghe "Phân" (chữ đầu câu, giữ). 56,25 s.
- 3 agent hoạt hình song song: sc-street (hook, tyre, front, end), sc-hydro (lever, fluid, caliper), sc-disc (clamp, heat, payoff). Quản lý: head/bridges/props (scooter, brakeDisc, forceArrow, heatWisps, road)/score.
- Sửa của quản lý sau export 1: 3 nhãn lấn vùng UI phải ("→ nhiệt", "tốc độ → hơi ấm", "đĩa") → dời vào.

## Review độc lập (6b) — agent mới, không đọc code, chỉ contact sheet + lời
| # | mức | lỗi | cách sửa | re-review |
|---|---|---|---|---|
| 1 | MUST | 49–55 s: đèn giao thông ở SAU lưng xe | dời đèn ra trước bánh trước (x ≈ 905); đỏ suốt lời đọc, xanh từ 54,7 s | FIXED |
| 2 | MUST | 22–28 s: cùm phanh ở trên-phải đĩa, trong khi cảnh nhìn ngang xe nó ở trên-trái | dời cùm/má/hơi nóng lên trên-trái (−2,25 rad, như scooter()), inset sang phải | FIXED |
| 3 | MUST | 7–9 s: nhãn "tay phanh" chỉ vào quả nặng đầu ghi-đông | đường dẫn kết thúc trên tay phanh | FIXED |
| 4 | MUST | 36–41 s: xe "rơi" trên mái bị thẻ tiêu đề che, đường rơi không bắt đầu từ xe | hạ mái (y 640), xe đầy đủ màu + người lái ở mép mái, đường rơi bắt đầu ngay dưới xe | FIXED |
| 5 | NICE | nhãn "tốc độ" như nhãn tòa nhà; trọng tâm không neo; khớp tay phanh như gập; sơ đồ cùm chưa gắn với đĩa; "đĩa phanh" hiện muộn; nhãn nhỏ; đèn xanh hút mắt | nền giấy + mũi tên tới vệt tốc độ; chấm trọng tâm trượt ra trước; tay đòn chữ L một khối; thêm cạnh đĩa trên má phanh; "đĩa phanh" từ 21 s; nhãn +20–35 %; đèn xanh sau lời | FIXED |
| 6 | MUST (vòng 2, mới) | 17,5–19,5 s: "đĩa", "lực × vài lần", đầu mũi tên đỏ chồng nhau | tách nhãn, mũi tên dừng dưới má phanh, má ép vào cạnh đĩa | FIXED |
| 7 | NICE (vòng 2) | "sức nặng" khó đọc; vệt mờ trên tòa nhà 37 s; đường dẫn "hơi ấm" chỉ vào chắn bùn | nền giấy; bỏ vòng xe ma; đường dẫn vào mặt đĩa | FIXED |
| — | NICE (để lại) | đường dẫn "tốc độ → hơi ấm" gần song song phuộc nên khó thấy; nhãn "sức nặng" hơi xa mũi tên | — | NOT FIXED |

## Số đo (renders/share.mp4, 56,25 s)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 35,75 s) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (152 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 34,75–35,75) |
| motioncheck | PASS mọi era (agent tự đo) |
| loudest 100 ms | 36,2 s, trong act payoff 35,75–38 s |
| loudness | −14,2 LUFS, true peak −1,7 dBFS |
| RMS quanh cú cắt | nền lặng −22…−28 dB; không bước > 12 dB/0,2 s ngoài lúc giọng vào (36,4 s) |

- Shot yếu nhất: "caliper" — ống chữ U khá trừu tượng (dù đã thêm cạnh đĩa); "payoff" nhiều thứ trong một khung (tòa nhà, xe trên mái, "=", đồng hồ, xe dưới đất).
- Chưa kiểm chứng: không nghe được bằng tai (chỉ đo LUFS/Whisper); tỉ lệ đòn bẩy tay phanh không có nguồn (kịch bản chỉ nói "vài lần").
- Drive: đã lưu (My Drive / Vạn vật vận hành như thế nào — Video). rclone vẫn cảnh báo client_id dùng chung sắp bị khai tử.
