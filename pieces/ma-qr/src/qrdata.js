// =====================================================================
//  QR DATA — a REAL version-1 QR code, level H, byte mode, content "CHAO!" (made with segno, mask pattern 001:
//  row % 2 === 0; verified: decodes to "CHAO!", and still decodes with the centre 7x7 modules covered).
//  Director's file (loaded first by props.js); agents never edit it.  1 = dark module, 0 = light.  QR_M[r][c].
// =====================================================================
const QR_N = 21;
const QR_ROWS = ['111111100010101111111', '100000101110001000001', '101110101011101011101', '101110101011001011101', '101110101101101011101', '100000101011101000001', '111111101010101111111', '000000000100000000000', '001001111001010111110', '011100010111001000100', '001011111011101001101', '101100011111101011011', '000100110110011001111', '000000001101000000000', '111111101110010110101', '100000101001111001010', '101110100000100111101', '101110100101010001100', '101110101101110110011', '100000100001101100000', '111111100110101111001'];
const QR_M = QR_ROWS.map((s) => s.split('').map(Number));
// function modules (fixed parts): the 3 finder patterns + separators (8x8 corners), timing row/col 6, the dark
// module, the 2 format-info strips.  QR_KIND(r, c): 'finder' | 'sep' | 'timing' | 'format' | 'dark' | 'data'
function QR_KIND(r, c) {
  const inF = (r0, c0) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
  if (inF(0, 0) || inF(0, 14) || inF(14, 0)) return 'finder';
  if ((r <= 7 && c <= 7) || (r <= 7 && c >= 13) || (r >= 13 && c <= 7)) return 'sep';
  if (r === 13 && c === 8) return 'dark';
  if ((r === 8 && (c <= 8 || c >= 13)) || (c === 8 && (r <= 8 || r >= 13))) return 'format';
  if (r === 6 || c === 6) return 'timing';
  return 'data';
}
const QR_MASKF = (r, c) => r % 2 === 0;                       // the mask actually used (pattern 001)
const QR_RAW = QR_M.map((row, r) => row.map((v, c) => (QR_KIND(r, c) === 'data' && QR_MASKF(r, c) ? 1 - v : v)));   // before masking
// the zigzag placement order of the 208 data modules: column pairs from the right, up then down, skipping column 6
const QR_ORDER = (() => {
  const out = []; let up = true;
  for (let right = QR_N - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let k = 0; k < QR_N; k++) {
      const r = up ? QR_N - 1 - k : k;
      for (const c of [right, right - 1]) if (QR_KIND(r, c) === 'data') out.push([r, c]);
    }
    up = !up;
  }
  return out;
})();
const QR_IDX = (() => { const I = QR_M.map((row) => row.map(() => -1)); QR_ORDER.forEach(([r, c], i) => { I[r][c] = i; }); return I; })();
// bit i of the stream: 0-3 mode (0100 = byte), 4-11 count (5), then C H A O ! (8 bits each, 12-51), terminator,
// pad bytes; codewords 0-8 (bits 0-71) are DATA, codewords 9-25 (bits 72-207) are ERROR CORRECTION (Reed-Solomon).
const QR_BITS = QR_ORDER.map(([r, c]) => QR_RAW[r][c]);
const QR_DATA_BITS = 72;
const QR_CHAR_C = QR_ORDER.slice(12, 20);                      // the 8 modules that spell 'C' = 01000011 (in stream order)
const QR_ISECC = (r, c) => QR_IDX[r][c] >= QR_DATA_BITS;
const QR_ISDATA = (r, c) => QR_IDX[r][c] >= 0 && QR_IDX[r][c] < QR_DATA_BITS;
if (typeof module !== 'undefined') module.exports = { QR_M, QR_RAW, QR_ORDER, QR_BITS, QR_KIND, QR_CHAR_C, QR_IDX };
// THE PAYOFF DAMAGE: the first 8 of the 26 codewords (64 modules, bottom-right blob: cols 15-20) — 8/26 ≈ 31 % of the
// codewords. Verified with OpenCV: covering these with white, black OR inverting them, the code STILL reads "CHAO!".
const QR_HIT = QR_ORDER.slice(0, 64);
const QR_ISHIT = (() => { const S = new Set(QR_HIT.map(([r, c]) => r * 21 + c)); return (r, c) => S.has(r * 21 + c); })();
// THE END LOGO: the centre 7x7 modules (rows 7-13, cols 7-13) — verified: still reads "CHAO!" with them covered.
const QR_LOGO = [7, 7, 7, 7];   // [r0, c0, rows, cols]
