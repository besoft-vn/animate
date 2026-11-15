# LOG — tủ lạnh (2026-11-15)

## Run 1
- Team: 1 nghiên cứu (research.md), 3 hoạt hình song song (sc-kitchen / sc-loop / sc-machine), quản lý: head, bridges, props, score, giọng, review.
- Giọng: ElevenLabs connector, eleven_v3, Quyet Nguyen (1vQIxPxX4lsNi2g3Z4cF), 1 take/câu, ~780 credit. multilingual_v2 phát âm sai thanh điệu (Whisper large-v3-turbo nghe "Tù lăn con hẹt tàu ràu lăn") → không dùng.
- Word timing: large-v3-turbo nghe 136/156 chữ (small chỉ ~10%).
- Review lần 1: STORY ARC 3/6 (cảnh kết to hơn tiếng tách; nhãn nhiệt kế máy nén nằm dưới UI điện thoại). Sửa: hợp âm phẳng giữ suốt act "Tách!" (0.04), pad cuối 0.016, act silence kết thúc trước SLAM 0.125s; nhiệt kế dời trái 50px.
- Review cuối: cuts on grid PASS; 8 morphs on 8th grid PASS; narration density PASS (≤5 w/s); STORY ARC PASS 6/6; TEXT PASS (0 cắt/chồng, 0 dưới UI); loudest 100ms 45.3s trong act payoff, 0.9s im lặng trước đó; −13.9 LUFS, true peak −1.5 dBFS; dead beats PASS; deterministic true.

| shot | PASS | ghi chú |
|---|---|---|
| 1 hook | ✓ | nửa dưới chỉ là sàn gỗ (vùng phụ đề) |
| 2 turn | ✓ | |
| 3 sweat | ✓ | |
| 4 loop | ✓ | nhân vật sát mép thẻ tag ở điểm cầu nối |
| 5 evap | ✓ | |
| 6 comp | ✓ | |
| 7 cond | ✓ | |
| 8 valve | ✓ | không có nhân vật (giọt lỏng là hằng số) |
| 9 cycle | ✓ | |
| 10 end | ✓ | |

**Shot yếu nhất:** hook — khung tĩnh, ít chuyển động trong 3 giây đầu; lần sau mở bằng một hành động (tay đặt bát canh vào tủ).
**Chưa kiểm chứng:** không nghe được bản mix bằng tai — cần người nghe lại giọng + nhạc.
**Rule đề xuất (craft.md):** với giọng tiếng Việt dùng eleven_v3 + whisper large-v3-turbo; payoff dưới voice cần hợp âm giữ ~2s để act "gift" thắng p90.

## Run 2 — đổi giọng sang Tuan Khang (theo yêu cầu)
- 10 câu tạo lại song song (eleven_v3, GaEEAHHYlbueVlFfyrPr), ~650 credit; bản Quyet Nguyen lưu ở voice/quyet/.
- 58.4s; Whisper 138/156 chữ. Hình tự căn lại theo VOICE, không sửa cảnh nào.
- Review: cuts/morphs on grid PASS, narration PASS, STORY ARC 6/6, TEXT PASS, dead beats PASS, loudest 100ms 50.5s trong act payoff sau 0.7s im lặng, −13.9 LUFS.
