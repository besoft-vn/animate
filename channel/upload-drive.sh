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
# token: JSON ({"access_token":...}) như rclone cũ in ra, hoặc chuỗi base64 như rclone ≥ 1.7x in ra
TOKEN_JSON=$(python3 - <<'PY'
import base64, json, os, sys
raw = os.environ["RCLONE_DRIVE_TOKEN"].strip()
def tok(v):
    if isinstance(v, str):
        try: v = json.loads(v)
        except Exception: return None
    if isinstance(v, dict):
        if "access_token" in v or "refresh_token" in v: return v
        for k in ("token", "Token"):
            if k in v: return tok(v[k])
        for x in v.values():
            t = tok(x)
            if t: return t
    return None
t = tok(raw)
if not t:
    for dec in (base64.urlsafe_b64decode, base64.b64decode):
        try:
            t = tok(dec(raw + "=" * (-len(raw) % 4)).decode("utf-8")); 
            if t: break
        except Exception: pass
if not t: sys.exit("RCLONE_DRIVE_TOKEN: không đọc được (không phải JSON token hay base64 của nó)")
print(json.dumps(t))
PY
)
export RCLONE_CONFIG_GD_TYPE=drive RCLONE_CONFIG_GD_TOKEN="$TOKEN_JSON"
# rclone đọc mọi biến RCLONE_DRIVE_* làm tuỳ chọn của backend drive: RCLONE_DRIVE_TOKEN (chuỗi base64 thô) sẽ đè lên
# token đã giải mã ở trên — bỏ nó khỏi môi trường của rclone
unset RCLONE_DRIVE_TOKEN
if [ -n "$FOLDER_ID" ]; then export RCLONE_CONFIG_GD_SCOPE=drive RCLONE_CONFIG_GD_ROOT_FOLDER_ID="$FOLDER_ID"; DEST="gd:"
else export RCLONE_CONFIG_GD_SCOPE=drive.file; DEST="gd:$FOLDER_NAME/"; fi
fail=0
for f in "$@"; do
  if rclone copyto "$f" "$DEST$(basename "$f")" --progress=false; then echo "Drive: đã tải $(basename "$f")"
  else fail=1; echo "Drive: LỖI khi tải $(basename "$f") — nếu lỗi là 404 notFound trên thư mục: token thuộc tài khoản Google không có quyền sửa thư mục đích (với DRIVE_FOLDER_ID cần token quyền drive đầy đủ của tài khoản có quyền sửa thư mục đó)" >&2; fi
done
[ "$fail" = 0 ] || exit 1
[ -n "$FOLDER_ID" ] && echo "https://drive.google.com/drive/folders/$FOLDER_ID" || echo "Drive: My Drive / $FOLDER_NAME"
