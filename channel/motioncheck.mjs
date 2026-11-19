#!/usr/bin/env node
// Đo "đơ" thẳng trên bản build (không cần export): render khung ở 4 fps trong một khoảng thời gian, thu nhỏ 27x48,
// so mỗi khung với khung 1 s trước — cùng thước đo với stillcheck.py. Dùng khi đang vẽ cảnh.
//   node channel/motioncheck.mjs pieces/<slug> <t0> <t1> [--max 1.5] [--thr 0.8] [--ignore a-b ...]
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const { chromium } = (() => { try { return require('playwright'); } catch { return require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); } })();

const [dir, a, b, ...rest] = process.argv.slice(2);
if (!dir || a == null || b == null) { console.error('usage: node channel/motioncheck.mjs pieces/<slug> <t0> <t1> [--max 1.5] [--thr 0.8] [--ignore a-b ...]'); process.exit(2); }
const opt = (k, d) => { const i = rest.indexOf(k); return i >= 0 ? Number(rest[i + 1]) : d; };
const MAX = opt('--max', 1.5), THR = opt('--thr', 0.8), FPS = 4;
const ignore = []; { const i = rest.indexOf('--ignore'); if (i >= 0) for (const r of rest.slice(i + 1)) { if (r.startsWith('--')) break; const [x, y] = r.split('-').map(Number); ignore.push([x, y]); } }
const t0 = Math.max(0, Number(a) - 1), t1 = Number(b);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.resolve(dir, 'index.html'));
await page.waitForFunction(() => typeof window.renderFrame === 'function');
const frames = await page.evaluate(({ t0, t1, FPS }) => {
  const W = 1080, H = 1920, big = document.createElement('canvas'); big.width = W; big.height = H;
  const sm = document.createElement('canvas'); sm.width = 27; sm.height = 48; const sx = sm.getContext('2d');
  // the paper grain changes every frame but is smoothed away by video compression — leave it out, like the viewer sees
  try { if (window.STYLE) window.STYLE.post = () => {}; } catch {}
  try { STYLE.post = () => {}; } catch {}
  const out = [];
  for (let t = t0; t <= t1 + 1e-6; t += 1 / FPS) {
    window.renderFrame(t, big);
    // downscale in halving steps (a single 40x drawImage samples a few pixels = noise; ffmpeg averages the area)
    let src = big, w = W, h = H;
    while (w / 2 >= 54) { const c = document.createElement('canvas'); c.width = Math.round(w / 2); c.height = Math.round(h / 2); const g2 = c.getContext('2d'); g2.imageSmoothingQuality = 'high'; g2.drawImage(src, 0, 0, c.width, c.height); src = c; w = c.width; h = c.height; }
    sx.imageSmoothingQuality = 'high'; sx.drawImage(src, 0, 0, 27, 48);
    const d = sx.getImageData(0, 0, 27, 48).data, g = [];
    for (let i = 0; i < d.length; i += 4) g.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    out.push([t, g]);
  }
  return out;
}, { t0, t1, FPS });
await browser.close();
const runs = []; let r0 = null;
for (let i = FPS; i < frames.length; i++) {
  const [t, g] = frames[i], p = frames[i - FPS][1];
  let s = 0; for (let k = 0; k < g.length; k++) s += Math.abs(g[k] - p[k]); const v = s / g.length;
  if (process.env.MC_DEBUG) console.log(t.toFixed(2), v.toFixed(2));
  const still = v < THR && !ignore.some(([x, y]) => x <= t && t <= y);
  if (still && r0 === null) r0 = t - 1;
  if (!still && r0 !== null) { if (t - r0 > MAX) runs.push([r0, t]); r0 = null; }
}
if (r0 !== null && t1 - r0 > MAX) runs.push([r0, t1]);
for (const [x, y] of runs) console.log(`  ĐƠ  ${x.toFixed(1)}–${y.toFixed(1)}s  (${(y - x).toFixed(1)}s)`);
console.log(`motioncheck ${a}–${b}s: ${runs.length ? 'FAIL' : 'PASS'} (${runs.length} đoạn > ${MAX}s)`);
process.exit(runs.length ? 1 : 0);
