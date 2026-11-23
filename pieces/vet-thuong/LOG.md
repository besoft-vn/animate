# LOG — vết thương (2026-11-23, lịch chạy tự động)

- Chủ đề: "Vết thương tự lành ra sao?" (cơ thể; tập trước "sét" là thiên nhiên). Style cut-paper (khung gọn: tông phẳng, grain nhẹ, ≤ 12 vật nhỏ/khung), F5 fixed-hero journey: hero = MỘT tế bào da ở mép TRÁI vết cắt, bạn đồng hành ở mép PHẢI (kẹp tóc teal); 1 SLAM vào "gặp nhau" (37,25 s).
- Nghiên cứu (agent) → research.md (PMC reviews Gonzalez 2016, Wilkinson & Hardman 2020, Xue & Jackson 2015, Guo & DiPietro 2010; Cleveland Clinic, NHS, AAD, MSD). Không nói tốc độ bò của tế bào (chỉ có số trong đĩa nuôi); "chừng 80%" là mức tối đa; "thường lành nhanh hơn" (AAD, Winter 1962 trên lợn). StatPearls/PubMed bị captcha → dùng PMC.
- Giọng: Tuan Khang, eleven_v3 qua API (tts-elevenlabs.mjs), 10 câu, 696 ký tự + tạo lại 2 câu (moist, end: ~167 ký tự) vì Whisper nghe "ẩm"→"ấm", "vá"→"vãi"; bản mới đổi "tự vá" → "tự dệt nên", "đủ ẩm". Whisper vẫn nghe "ẩm" thành "ấm", "dệt" thành "diệt" — nhiều khả năng do Whisper yếu thanh điệu (đã gặp các tập trước); hình hiển thị rõ "đủ ẩm" + giọt nước xanh. CHƯA nghe bằng tai. 61,4 s, lead 0,7 s, khoảng nghỉ 0,35 s.
- Khung dùng chung (quản lý): head.html (BR), bridges.js (camera thở, crawl trôi qua nhịp lặng), props.js (heroCell, skinSlice — sân khấu lát cắt da chung cho 7 era, cast: tiểu cầu, hồng cầu, bạch cầu, vi khuẩn, nguyên bào sợi, sợi huyết, giọt nước), score.js (payoff nở mềm 0,3 s).
- 3 agent hoạt hình song song: sc-knee (hook, moist, end — đầu gối, sân chơi), sc-wound (plug, clot, clean), sc-heal (fill, crawl, meet, scar). Tất cả motioncheck PASS.

## Review độc lập (6b) — agent mới, không đọc code, chỉ contact sheet + lời (3 vòng)
| # | mức | lỗi | cách sửa | re-review |
|---|---|---|---|---|
| 1 | MUST | 56 s: hero ngồi TRÊN vảy (ngược thông điệp "da mới mọc dưới vảy") | vảy vẽ đè lên, hero + bạn ló ra dưới mép vảy; vảy rơi xuống mới lộ ra | FIXED |
| 2 | MUST | 27–29 s: nhãn "cô-la-gen" chỉ vào nguyên bào sợi | nhãn "nguyên bào sợi" chỉ tế bào; "cô-la-gen" hiện cùng mũi tên khi sợi đã có, chỉ vào sợi | FIXED |
| 3 | MUST | 41–42,5 s: "đẩy vảy bong ra" không thấy; để lại hõm xanh (xanh = ẩm) | vảy nâng + nghiêng rõ, khe lấp da mới hồng, ngang mặt da | FIXED |
| 4 | MUST | 1–5 s, 56–60 s: chân trông như ngón tay | đầu gối to hơn ống chân, giày sneaker thật, hộp băng cá nhân rõ | FIXED |
| 5 | MUST (vòng 2) | 41,8–42,2 s: vảy rơi XUYÊN qua lớp bì/mỡ trong lát cắt | vảy trượt sang phải, bay ra khỏi khung phía trên mặt da | FIXED |
| 6 | NICE | gạch chân "co lại" sót; mũi tên "tiểu cầu", "sợi huyết" lệch; "bạch cầu" không có mũi tên | sửa/đổi đích mũi tên | FIXED |
| 7 | NICE | "sưng" không thấy; bạch cầu co thành "trái tim"; mạch như liền lại ở 25 s | đường viền phồng cam trong mô; bạch cầu rút vào đầu mạch; nắp đầu mạch đứt | FIXED (sưng: PARTLY) |
| 8 | NICE | giọt nước nằm TRÊN băng; kính lúp đè tag; mũi tên "da mới" trúng kẹp tóc; bạn đồng hành mất ở scar/end; "->" | sửa vị trí; thêm bạn đồng hành ở scar + end; "→" | FIXED |
| 9 | NICE (vòng 2) | vảy chạm tag "liền rồi!"; viền sưng cắt qua mặt; mũi tên "mạch máu mới" | nâng tag; dời viền xuống mô; chỉ vào vòng mạch đỏ | FIXED |
| — | NICE (để lại) | hero lơ lửng trên hai thẻ khô/ẩm (vai người dẫn); tiểu cầu tụ ở mặt máu chứ không ở chỗ mạch đứt | — | NOT FIXED |

## Số đo (renders/share.mp4, 61,5 s)
| kiểm tra | kết quả |
|---|---|
| cuts on grid | PASS (1 cut, 37,25 s, f894) |
| morphs | PASS (8 cầu nối trên lưới 8th) |
| narration | PASS (164 chữ, ≤ 5 chữ/s) |
| STORY ARC | 5/6 — FAIL "silence ≤ peak −15 dB" là chủ ý (5d) |
| TEXT | PASS (0 cắt/chồng, 0 dưới UI) |
| dead beats | PASS |
| stillcheck | PASS (0 đoạn đơ > 1,5 s, bỏ qua nhịp lặng 36,5–37,25) |
| motioncheck (từng agent) | PASS mọi era |
| loudest 100 ms | 37,7 s, trong act payoff 37,25–39,5 s |
| bước nhảy RMS quanh cú cắt | ~10 dB/0,2 s tại cắt; 13,5 dB lúc giọng vào ("Rồi", 37,9 s) — là giọng, không phải nhạc |
| loudness | −14,2 LUFS, true peak −2,4 dBFS |

- Shot yếu nhất: "moist" — hai thẻ khô/ẩm nhỏ so với khung, hero dẫn chuyện lơ lửng phía trên không làm gì nhiều; tế bào bò trong thẻ nhỏ khó thấy ở cỡ điện thoại. Thứ nhì: hook → plug, lát cắt trong kính lúp (đã có vảy) chuyển sang vết cắt mới tinh (giấu bằng morph trên giấy trắng).
- Chưa kiểm chứng: không nghe được bằng tai (chỉ LUFS/Whisper); dài 61,5 s (vượt mốc 60 s 1,5 s).
- Drive: đã lưu (My Drive / Vạn vật vận hành như thế nào — Video). rclone vẫn báo client_id dùng chung sắp bị khai tử trong 2026.
- ElevenLabs: ~863 ký tự gửi đi; bộ đếm tài khoản tăng 4.878 → 5.217 (339 credit); còn ~34.500 / 39.717.
