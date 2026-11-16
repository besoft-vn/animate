# Lệnh của lịch chạy hằng ngày (đã nạp vào lịch "Vạn vật vận hành — video hằng ngày", 7:54 sáng giờ VN)

Lịch có repo besoft-vn/animate (nhánh push được chỉ định: `claude/magical-bardeen`), connector ElevenLabs, môi trường có bí mật mạng ElevenLabs và RCLONE_DRIVE_TOKEN. Mỗi lần chạy: lấy nhánh `claude/magical-bardeen` (tạo từ `claude/nifty-keller-b05bpw` nếu chưa có), gộp `claude/nifty-keller-b05bpw` vào (quy tắc/công cụ mới của phiên quản lý), làm theo `channel/DAILY.md`, lưu Drive, push lên `claude/magical-bardeen`, gửi video cho người dùng.

Phiên quản lý (tay) làm việc trên `claude/nifty-keller-b05bpw`; khi cần xem các tập tự động, đọc từ `origin/claude/magical-bardeen`.
