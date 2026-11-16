#!/usr/bin/env python3
"""Tìm các đoạn video "bị đơ": hình gần như không đổi trong hơn MAX giây (đường nét boil không tính là chuyển động).
   usage: python3 channel/stillcheck.py <video.mp4> [--max 1.5] [--ignore 28.7-29.5 ...]
   Cách đo: thu nhỏ còn 27x48 (xoá nhiễu boil), so mỗi khung với khung 1 giây trước; dưới ngưỡng = đứng yên.
   --ignore: các khoảng im lặng cố ý (vd. nhịp lặng trước cú cắt payoff). Thoát mã 1 nếu có đoạn đơ."""
import subprocess, sys
import numpy as np

args = sys.argv[1:]
if not args:
    sys.exit(__doc__)
video, mx, ignore, thr = args[0], 1.5, [], 0.8
if '--max' in args: mx = float(args[args.index('--max') + 1])
if '--thr' in args: thr = float(args[args.index('--thr') + 1])
for i, a in enumerate(args):
    if a == '--ignore':
        for r in args[i + 1:]:
            if r.startswith('--'): break
            a0, a1 = map(float, r.split('-')); ignore.append((a0, a1))
FPS = 4
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-vf', f'fps={FPS},scale=27:48,format=gray', '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
d = np.frombuffer(raw, dtype=np.uint8).reshape(-1, 48, 27).astype(float)
motion = [(i / FPS, np.abs(d[i] - d[i - FPS]).mean()) for i in range(FPS, len(d))]
runs, r0 = [], None
for t, v in motion:
    still = v < thr and not any(a <= t <= b for a, b in ignore)
    if still and r0 is None: r0 = t - 1.0          # the comparison spans the previous second
    if not still and r0 is not None:
        if t - r0 > mx: runs.append((r0, t))
        r0 = None
if r0 is not None and motion and motion[-1][0] - r0 > mx: runs.append((r0, motion[-1][0]))
for a, b in runs: print(f'  ĐƠ  {a:5.1f}–{b:5.1f}s  ({b - a:.1f}s gần như đứng yên)')
print(f'stillcheck: {"PASS" if not runs else "FAIL"} ({len(runs)} đoạn đơ > {mx}s; bỏ qua {ignore or "không"})')
sys.exit(1 if runs else 0)
