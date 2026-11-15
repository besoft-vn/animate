#!/usr/bin/env bash
# Tải video đầy đủ chất lượng lên thư mục Drive của kênh bằng rclone (không giới hạn dung lượng như connector).
#   bash channel/upload-drive.sh <file.mp4> [<file2.mp4> ...]
# Cần biến môi trường RCLONE_DRIVE_TOKEN = JSON token in ra bởi `rclone authorize "drive"` (chạy một lần trên máy anh).
set -e
FOLDER_ID="${DRIVE_FOLDER_ID:-1LE0di_PWIlfx-bcx94YvDUsvxAXzx41s}"   # "Vạn vật vận hành như thế nào — Video"
[ -n "$RCLONE_DRIVE_TOKEN" ] || { echo "RCLONE_DRIVE_TOKEN chưa có trong môi trường — bỏ qua Drive"; exit 3; }
if ! command -v rclone >/dev/null; then
  T=$(mktemp -d); curl -sSfL https://downloads.rclone.org/rclone-current-linux-amd64.zip -o "$T/rc.zip"
  (cd "$T" && unzip -q rc.zip) && install -m 755 "$T"/rclone-*/rclone /usr/local/bin/rclone
fi
export RCLONE_CONFIG_GD_TYPE=drive RCLONE_CONFIG_GD_SCOPE=drive RCLONE_CONFIG_GD_TOKEN="$RCLONE_DRIVE_TOKEN" RCLONE_CONFIG_GD_ROOT_FOLDER_ID="$FOLDER_ID"
fail=0
for f in "$@"; do
  if rclone copyto "$f" "gd:$(basename "$f")" --progress=false; then echo "Drive: đã tải $(basename "$f")"
  else fail=1; echo "Drive: LỖI khi tải $(basename "$f") — nếu lỗi là 404 notFound trên thư mục: token thuộc tài khoản Google không có quyền sửa thư mục $FOLDER_ID (chia sẻ thư mục cho tài khoản đó, hoặc tạo lại token bằng đúng tài khoản chủ thư mục)" >&2; fi
done
[ "$fail" = 0 ] || exit 1
echo "https://drive.google.com/drive/folders/$FOLDER_ID"
