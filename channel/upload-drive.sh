#!/usr/bin/env bash
# Tải video đầy đủ chất lượng lên thư mục Drive của kênh bằng rclone (không giới hạn dung lượng như connector).
#   bash channel/upload-drive.sh <file.mp4> [<file2.mp4> ...]
# Cần biến môi trường RCLONE_DRIVE_TOKEN = JSON token tạo một lần trên máy anh, quyền hẹp "drive.file"
# (rclone chỉ thấy và sửa được file/thư mục do chính nó tạo — không đọc được phần còn lại của Drive):
#   rclone authorize "drive" "eyJzY29wZSI6ImRyaXZlLmZpbGUifQ"      # = {"scope":"drive.file"}
# Mặc định tải vào thư mục DRIVE_FOLDER_NAME ở gốc My Drive (rclone tự tạo lần đầu).
# Đặt DRIVE_FOLDER_ID để dùng một thư mục có sẵn (chỉ được khi token có quyền "drive" đầy đủ).
set -e
FOLDER_ID="${DRIVE_FOLDER_ID:-}"
FOLDER_NAME="${DRIVE_FOLDER_NAME:-Vạn vật vận hành như thế nào — Video}"
[ -n "$RCLONE_DRIVE_TOKEN" ] || { echo "RCLONE_DRIVE_TOKEN chưa có trong môi trường — bỏ qua Drive"; exit 3; }
if ! command -v rclone >/dev/null; then
  T=$(mktemp -d); curl -sSfL https://downloads.rclone.org/rclone-current-linux-amd64.zip -o "$T/rc.zip"
  (cd "$T" && unzip -q rc.zip) && install -m 755 "$T"/rclone-*/rclone /usr/local/bin/rclone
fi
export RCLONE_CONFIG_GD_TYPE=drive RCLONE_CONFIG_GD_TOKEN="$RCLONE_DRIVE_TOKEN"
if [ -n "$FOLDER_ID" ]; then export RCLONE_CONFIG_GD_SCOPE=drive RCLONE_CONFIG_GD_ROOT_FOLDER_ID="$FOLDER_ID"; DEST="gd:"
else export RCLONE_CONFIG_GD_SCOPE=drive.file; DEST="gd:$FOLDER_NAME/"; fi
fail=0
for f in "$@"; do
  if rclone copyto "$f" "$DEST$(basename "$f")" --progress=false; then echo "Drive: đã tải $(basename "$f")"
  else fail=1; echo "Drive: LỖI khi tải $(basename "$f") — nếu lỗi là 404 notFound trên thư mục: token thuộc tài khoản Google không có quyền sửa thư mục đích (với DRIVE_FOLDER_ID cần token quyền drive đầy đủ của tài khoản có quyền sửa thư mục đó)" >&2; fi
done
[ "$fail" = 0 ] || exit 1
[ -n "$FOLDER_ID" ] && echo "https://drive.google.com/drive/folders/$FOLDER_ID" || echo "Drive: My Drive / $FOLDER_NAME"
