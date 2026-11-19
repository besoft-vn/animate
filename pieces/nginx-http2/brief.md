# Brief — "Lỗ hổng NGINX HTTP/2 tồn tại 10 năm: cách kiểm tra và vá" (Besoft, 19/11/2026)

Source: https://besoft.vn/blog/lo-hong-nginx-http2-ton-tai-10-nam-cach-kiem-tra-va-va — facts cross-checked in `research.md` (nginx.org, Ubuntu, THN, Wiz, Xint). The owner asked: **show the article's content fully** — every section, the commands and config exactly.

**Constant:** THE SERVER (`serverProp(x, y, { state, h2, dark, s })`): lamp RED = vulnerable, GREEN = fixed. **Terminal cards** (`termCard`) show commands typed out. **Chips** (`chip`) for CVE ids / versions (red = vulnerable, green = fixed, yellow = HTTP/2).
**Style:** crosshatch. Paper (`paperSheet`/`woodSurface`) = the ops team & advice; navy (`darkWorld(id, { dust: 40 })`) = inside the server / attack. 9:16, 24 fps, ~2 min, voice Tuan Khang.

## Channel rules (mandatory)
- KHUNG HÌNH GỌN (few big shapes, ≤ 1 particle effect/scene, low dust), KHÔNG ĐƠ (no still stretch > 1.5 s; typing, lamps, arrows keep moving), text ≥ 46 px for Vietnamese labels (terminal mono text ≥ 30 px), inside x 60–940, y 250–1460. One `inkTag` per scene.
- Bridge contract: at every boundary except into "root", the server (s = 1, unrotated, not shaking) sits exactly at `SRV` = (540, 860) during [tc − 0.5, tc + 0.5]. Between, move/scale it freely (e.g. shrink it to a corner to make room for a terminal).
- "root" begins on a HARD CUT: complete on its first frame (tag drawn without pop). "risk" freezes (only the line boil) from VL('risk').t1 until the cut.
- Correctness (an independent reviewer will check): arrows/flows point the right way; labels on the right objects; never imply the bug is harmless; numbers exactly as below.

## Facts & exact on-screen text
- CVE-2026-123007 · CVSS 4.0 **9,2** · Ubuntu: High. "nginx2root" = the researchers' (Xint) name for the **chain of 5 bugs**.
- Since **1.9.5 (22/9/2015)**; affected **1.9.5 → 1.31.8**; fixed **1.31.9** (mainline) & **1.30.7** (stable), 18/11/2026.
- Mechanism: certain HTTP/2 traffic → flow-control window miscounted → **heap overflow** → usually the **worker crashes**; code runs only if **ASLR** is off or bypassed (Wiz & Xint did, in tests); **no login needed**.
- Not seen exploited yet; not in CISA KEV; **PoC public on GitHub** (Rapid7). Code runs as the **worker**, not root; Xint reached **root** via a separate **Linux kernel SCTP** bug, **even in Docker** → a container is not a reliable barrier. Rapid7's test needs **~128 GB** of HTTP/2 traffic: a barrier, not a reason to wait.
- Check config: `grep -rnE "http2" /etc/nginx/` → `listen 443 ssl http2;` or `http2 on;` means HTTP/2 on.
- Check from outside: `openssl s_client -alpn h2 -connect example.com:443 </dev/null 2>/dev/null | grep "ALPN"` → `ALPN protocol: h2`. Behind a CDN: test the **origin** directly.
- Version: `nginx -v` · `dpkg -l nginx | tail -n 1` — Ubuntu backports keep the number: compare the **full package version** with the Ubuntu notice.
- Ubuntu (16.04 → 26.10, incl. 22.04/24.04 LTS) and Debian stable releases: **no fixed package yet** (Debian sid has 1.30.6-4). Temporarily disable HTTP/2:
  - NGINX ≥ 1.25.1: `listen 443 ssl;` + `http2 off;`
  - 1.9.5 – 1.25.0: change `listen 443 ssl http2;` → `listen 443 ssl;`
  - then `sudo nginx -t && sudo systemctl restart nginx`, re-run the openssl check: no `h2` = done.
  - Blocks CVE-2026-123007 and CVE-2026-123633, **not** the other three; browsers fall back to HTTP/1.1, slightly slower.
- Upgrade: `docker pull nginx:1.30.7` · `docker compose up -d --force-recreate` (tags 1.31.9 / 1.30.7, incl. Alpine). From nginx.org packages: update then **restart** (or binary upgrade) — **`reload` alone leaves old workers running**.
- The two releases also fix 4 more (each needs its own config): HTTP/3 → CVE-2026-121810 · mail proxy → CVE-2026-113425 · resolver (proxy host from variables + SSI/mirror subrequest) → CVE-2026-123634 · HTTP/2 + worker_connections to backend → CVE-2026-123633.
- Extra defence: `echo 'install sctp /bin/false' | sudo tee /etc/modprobe.d/disable-sctp.conf` (doesn't unload a loaded module; useless if SCTP is built into the kernel). Signs to watch: worker starts unknown programs; worker exits abnormally / core dumps; long-lived high-traffic HTTP/2 connections with few logged requests; unusual outbound connections or DNS queries. A clean access log doesn't rule out an attack.
- Today: 1) list every server/container running NGINX (incl. reverse proxies in front of Next.js); 2) find which have HTTP/2 or HTTP/3 on; 3) Ubuntu packages: disable HTTP/2, watch USN, update when the package lands; 4) Docker: pull 1.30.7 / 1.31.9 and recreate; 5) check SCTP and ASLR: `cat /proc/sys/kernel/randomize_va_space` → **2**. End card: "besoft.vn".

## Beats (one per voice line; era times from the voice — print them with the snippet in the agent prompt)
| id | voice (summary) | picture |
|---|---|---|
| hook | lỗ hổng 10 năm; máy chủ có thể đang bật HTTP/2 mà không ai nhớ | paper: an ops desk; the server with a yellow "HTTP/2" chip that nobody notices (dusty sticky note "bật từ bao giờ?"); lamp turns red on "lỗ hổng" |
| cve | nginx to root, 9,2/10 | navy: big chip CVE-2026-123007, a 0–10 gauge needle to 9,2; small note "nginx2root = chuỗi 5 lỗi" |
| since | từ 2015, mọi bản tới bản vá 18/11 | paper: a timeline 2015 → 2026, version chips 1.9.5 … 1.31.8 red, then 1.31.9 / 1.30.7 green at 18/11 |
| how | lưu lượng HTTP/2 → cửa sổ tính sai → tràn heap | navy: inside the server: an HTTP/2 stream of frames, a "window" counter that goes past its limit, a heap box overflowing (red) |
| impact | worker sập; vượt ASLR → chạy mã, không cần đăng nhập | navy: a worker falls over (crash); then an "ASLR" shield cracks and a red cursor runs code; "không cần đăng nhập" (no login form) |
| risk | chưa thấy tấn công; PoC công khai trên GitHub | navy: a calm world map / "0 vụ tấn công", "chưa có trong KEV", then a GitHub-like repo card "PoC" appears; freeze after the line |
| root | lỗi SCTP nhân Linux → root, kể cả Docker | HARD CUT: a container box; the red key climbs from "worker" through "SCTP (nhân Linux)" to "root"; "container ≠ lá chắn" |
| barrier | ~128 GB: rào cản, không phải lý do chờ | navy: a big data meter filling to 128 GB; a hurdle; text "rào cản, không phải lý do để chờ" |
| check | grep http2 + openssl -alpn h2; CDN → kiểm tra origin | paper: two termCards (grep → the listen line; openssl → "ALPN protocol: h2"); a CDN cloud with an arrow bypassing to the origin |
| version | nginx -v, dpkg -l; Ubuntu: so cả chuỗi gói | paper: termCard with both commands + outputs; a magnifier on the package version string |
| disable | Ubuntu/Debian chưa có gói; tạm tắt HTTP/2, nginx -t, restart | paper: Ubuntu/Debian badges "chưa có gói vá"; config card editing `http2 on` → `http2 off;` (and the older listen form), then the restart command; the HTTP/2 chip falls off the server |
| trade | chặn 2 lỗi (123007, 123633), chậm hơn chút | paper: two red chips crossed green-checked, three others untouched; a tiny speedometer dipping slightly (HTTP/1.1) |
| upgrade | nâng 1.31.9 / 1.30.7, restart hẳn; reload thì worker cũ vẫn chạy | paper: docker pull / compose commands; the lamp turns GREEN; side panel: "reload" → an old worker still running (ghost), "restart" → all new |
| four | 4 lỗi khác: HTTP/3, mail proxy, resolver, worker_connections | paper: four cards with the CVE ids and their trigger config, each ticked by the upgrade |
| defend | chặn SCTP; dấu hiệu: chương trình lạ, sập, kết nối ra ngoài lạ | navy: the modprobe command; a checklist of 4 warning signs lighting one by one; note "access log sạch ≠ an toàn" |
| today | liệt kê, tìm HTTP/2/3, tắt tạm hoặc nâng cấp, ASLR = 2 | paper: a 5-item checklist ticking with the voice; `cat /proc/sys/kernel/randomize_va_space` → `2`; final: server lamp green, "besoft.vn" |
