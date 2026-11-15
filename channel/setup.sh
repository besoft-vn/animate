#!/usr/bin/env bash
# Chuẩn bị môi trường cho một phiên sản xuất (cloud session mới): font tiếng Việt, giọng tạm, nhận dạng giọng.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p ~/.fonts && cp "$HERE"/fonts/*.ttf ~/.fonts/ && fc-cache -f >/dev/null
command -v espeak-ng >/dev/null || (apt-get install -y espeak-ng >/dev/null 2>&1 || (apt-get update >/dev/null 2>&1 && apt-get install -y espeak-ng >/dev/null 2>&1)) || true
python3 -c "import faster_whisper" 2>/dev/null || pip install -q faster-whisper
python3 -c "import av, sys; sys.exit(0 if int(av.__version__.split('.')[0]) < 16 else 1)" 2>/dev/null || pip install -q --only-binary=:all: "av>=13,<16"
python3 -c "from faster_whisper import WhisperModel; WhisperModel('large-v3-turbo', device='cpu', compute_type='int8')" 2>/dev/null
fc-list :lang=vi family | grep -q Pangolin && echo "setup ok: Pangolin, espeak-ng, faster-whisper large-v3-turbo"
