# Research: Màn hình cảm ứng biết ngón tay bạn ở đâu? (PCAP, điện dung tương hỗ)
Checked 2026-11-21. Sources in [brackets] listed at the bottom.

## 1. Main idea
- VI: Dưới mặt kính là một lưới điện cực trong suốt; ngón tay "lấy bớt" điện trường ở các điểm giao gần nó, và chip điều khiển dò từng điểm giao hàng trăm lần mỗi giây để tìm ra chỗ điện dung bị giảm.
- EN: A transparent electrode grid under the glass forms a tiny capacitor at every row–column crossing; a finger steals some of the field, lowering the capacitance nearby, and the controller scans every crossing ~100+ times a second to find where.

## 2. Process (ordered)
1. Under the cover glass: transparent conductor, typically ITO (indium tin oxide), patterned into rows and columns (often diamond shapes) [WIKI-TS][MCHP]. Hedge: some panels use metal mesh/silver instead of ITO [WIKI-TS].
2. Rows = drive/transmit (TX, "X"), columns = sense/receive (RX, "Y") [MCHP][INF].
3. Each row–column crossing is a small capacitor (a "node"); part of its electric field fringes up through the glass [MCHP][US10353521].
4. Controller sends a small AC/pulse signal on a TX line and measures the charge arriving on each RX line; received charge ∝ mutual capacitance [INF]. Conceptually rows are driven one after another (sequential scan) [WIKI-TS]; real controllers may drive several at once with coded signals — say "lần lượt" safely as a simplification.
5. Finger (conductive, coupled to body/earth) intercepts part of the fringe field and shunts charge to ground → less charge reaches RX → mutual capacitance at nearby nodes drops [MCHP][INF][WIKI-TS].
6. Controller compares each node to its no-touch baseline and makes a "capacitance image" of the whole panel; it repeats this many times per second [WIKI-TS].
7. A fingertip covers several nodes; interpolating/centroid of neighbouring node values gives position much finer than the electrode pitch [MOUSER][US10120447].
8. Multi-touch: every crossing is measured separately, so two fingers give two distinct blobs. Self-capacitance (whole row/column read alone) sees only 2 X + 2 Y projections → 4 candidates, 2 are "ghost points" [RIVERDI][US9645674][WIKI-TS].

### Typical numbers
| Quantity | Value | Source |
|---|---|---|
| Electrode/cell pitch | ~4–6 mm; patent example cells 4.6 mm, range 3–7 mm; another patent prefers ~4 mm (≈ fingertip) | [US9075484][DCU] |
| Node mutual capacitance Cm | ~0.3–3.6 pF (FEM simulations, pitch 4–5 mm, various stack-ups) | [DCU] Tab 3.1–3.3 |
| Touch change ΔCm | ~0.2–0.37 pF (i.e. ~10–30 % of node; can be tens of %) | [DCU] |
| Charge change per touch | ~5–500 fC | [INF-noise] (Cypress paper, via search) |
| Full-panel scan rate | 20–200 Hz frame rate (Walker/Intel); ISSCC AFE 85–385 Hz | [MSOE][ARXIV ref 5] |
| Phone touch sampling | 120 Hz common; Samsung lists 240 Hz in Game Mode (Galaxy S22) | [SAMSUNG-S22][SAMSUNG-MX] |
| Human body capacitance | 100–200 pF (body model) | [MCHP] |
Safe phrasing: "khoảng 4–5 mm", "dưới một pi-cô-fara", "từ 120 đến 240 lần mỗi giây trên nhiều điện thoại".

## 3. Misconceptions
- "It senses pressure": No. Resistive screens need pressure to press two layers together [WIKI-TS]; capacitive needs a conductive object changing the field, a light touch works (hover just above can even register).
- Gloves / plastic stylus fail: insulators don't couple to the field enough; thin gloves sometimes work on PCAP, thick ones don't; touch gloves have conductive threads [WIKI-TS]. Conductive (rubber-tipped) styli work.
- Sausage works: 2010 South Korea, people used CJ snack sausages as iPhone styluses in cold weather — salty, moist meat is conductive [POPSCI][REGISTER]. Fun hook; say "người ta từng dùng xúc xích".
- Water drops: water is conductive and can cause false touches/disturb mutual sensing; controllers use self-cap modes to reject water [RIVERDI][US11023075]. Say "giọt nước có thể làm màn hình 'tưởng' có ngón tay" (hedged "có thể").
- "It feels heat": No — heat is irrelevant; cold fingers still work, a warm plastic pen does not. (Some press in 2010 wrongly said heat [POPSCI-search note].)

## 4. Sources
- [WIKI-TS] https://en.wikipedia.org/wiki/Touchscreen (PCAP, mutual vs self, ITO, gloves, resistive pressure)
- [MCHP] Microchip, Mutual Capacitance Measurement: https://onlinedocs.microchip.com/oxy/GUID-A8A0085D-58D1-4E41-A07D-B93BFDE11AFE-en-US-4/GUID-F186B556-F266-4585-830D-1CCE04045D0E.html
- [INF] Infineon/Cypress CE228931 CSX tuning: https://www.infineon.com/assets/row/public/documents/30/416/infineon-ce228931---psoc-4-capsense-csx-tuning-code-example-en.pdf
- [INF-noise] Cypress/Infineon noise-immunity whitepaper (5–500 fC): https://www.eenewseurope.com/download_whitepaper/25442 (seen via search snippet only — hedge)
- [ADI] Analog Devices, "Projected-Capacitive Touch Systems from the Controller Point of View": https://www.analog.com/en/resources/technical-articles/projectedcapacitive-touch-systems-from-the-controller-point-of-view.html (page 503 at check time; background only)
- [DCU] M.Eng thesis, Dublin City Univ., TSP sensor design FEM: https://doras.dcu.ie/20201/1/MastersCorrectionsFinal.pdf
- [US9075484] Sensor patterns for mutual capacitance touchscreens: https://patents.google.com/patent/US9075484
- [US10353521] fringe vs overlap Cm: https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10353521
- [US10120447] interpolate Tx-Rx values to finger centroids: https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10120447
- [US9645674] self-cap ghost points: https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9645674
- [US11023075] mutual has no ghosting; water handling: https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11023075
- [RIVERDI] https://riverdi.com/?p=100023 (ghost points; mutual disturbed by water)
- [MOUSER] https://www.mouser.com/applications/touch_touchscreen_technology/ (interpolation → higher resolution)
- [MSOE] course slides citing Intel/Geoff Walker, "20–200 Hz full screen cycle rate": https://faculty-web.msoe.edu/johnsontimoj/ELE4142/files4142/touch_screens_capacitive.pdf
- [ARXIV] Overview of mobile capacitive touch trends: https://arxiv.org/pdf/1612.08227 (cites 85–385 Hz AFE)
- [SAMSUNG-S22] https://www.samsungmobilepress.com/media-assets/galaxy-s22?tab=specs ; [SAMSUNG-MX] https://news.samsung.com/mx/descubre-lo-que-son-las-tasas-de-refresco-y-de-respuesta-tactil
- [POPSCI] https://www.popsci.com/technology/article/2010-02/meat-iphone-sausage-stylus ; [REGISTER] https://www.theregister.co.uk/2010/02/12/korean_sausage_stylus

## 5. Vietnamese terminology & number reading
- capacitive touchscreen = màn hình cảm ứng điện dung; PCAP = cảm ứng điện dung phóng chiếu (optional)
- mutual capacitance = điện dung tương hỗ; self-capacitance = điện dung riêng / tự điện dung
- transparent electrode = điện cực trong suốt; ITO layer = lớp ITO (ô-xít thiếc in-đi; đọc "i-tê-ô")
- grid = lưới; row/column = hàng/cột; crossing/node = điểm giao / nút
- drive line = đường phát (TX); sense line = đường thu (RX)
- capacitor = tụ điện; electric field = điện trường; charge = điện tích
- controller = bộ điều khiển / chip điều khiển cảm ứng; scan = quét; baseline = mức nền
- interpolation = nội suy; centroid = trọng tâm; ghost point = điểm ma; multi-touch = đa điểm
- Numbers: 60 Hz "sáu mươi lần mỗi giây"; 120 Hz "một trăm hai mươi lần mỗi giây"; 240 Hz "hai trăm bốn mươi lần mỗi giây"; 4–5 mm "bốn đến năm mi-li-mét"; 1 pF "một pi-cô-fara" = "một phần nghìn tỷ fara"; 0.2 pF "không phẩy hai pi-cô-fara"; 4.6 mm "bốn phẩy sáu mi-li-mét".

## 6. Script guidance (~9 sentences)
Safe to say:
- Dưới kính có lưới điện cực trong suốt (thường là ITO) xếp thành hàng và cột.
- Mỗi điểm giao là một tụ điện tí hon; điện trường của nó "trồi" lên qua mặt kính.
- Ngón tay dẫn điện, nối với cơ thể, lấy bớt điện trường → điện dung ở điểm đó giảm.
- Chip quét lần lượt các hàng, đo từng điểm giao, hàng chục đến hàng trăm lần mỗi giây (nhiều máy 120, chơi game tới 240).
- Các điểm giao cách nhau khoảng 4–5 mm, nhưng nhờ nội suy giữa các điểm lân cận, vị trí tìm được mịn hơn nhiều.
- Mỗi điểm giao đo riêng nên nhận được nhiều ngón cùng lúc.
- Thay đổi rất nhỏ: dưới một pi-cô-fara.
- Không phải lực nhấn, không phải nhiệt; găng tay thường cách điện nên không ăn, còn xúc xích thì từng được dùng thay bút.
Avoid / hedge:
- Exact sub-mm accuracy figures (unsourced) — say "mịn hơn khoảng cách lưới".
- "Every phone scans 240 Hz" — say "nhiều điện thoại 120 Hz, chế độ game có máy 240 Hz".
- Claiming all screens use ITO (metal mesh exists) or strictly one-row-at-a-time (parallel/coded drive exists) — keep "thường", "lần lượt" as simplification.
- Exact ΔCm percentages; "first touchscreen/first multi-touch" claims; water "always" triggering touches.
- Saying the finger "adds" capacitance — in mutual sensing it DEcreases (self-cap increases).
