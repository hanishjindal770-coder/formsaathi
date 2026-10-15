/** Byte-level JPEG helpers. Pure (work on Uint8Array), so they run in tests, workers and browsers. */

const SOI = [0xff, 0xd8];

function isJpeg(b: Uint8Array) {
  return b.length > 4 && b[0] === SOI[0] && b[1] === SOI[1];
}

/** Offset just after SOI and any APP0 (JFIF) segment: where new segments may be inserted. */
function insertionPoint(b: Uint8Array): number {
  let p = 2;
  if (b[p] === 0xff && b[p + 1] === 0xe0) p += 2 + ((b[p + 2] << 8) | b[p + 3]);
  return p;
}

/**
 * Sets the JFIF density to `dpi` (units = dots per inch), adding a JFIF APP0 segment if missing.
 * Some portals and print shops read this to work out the physical (cm) size.
 */
export function setJpegDpi(input: Uint8Array, dpi: number): Uint8Array {
  if (!isJpeg(input)) throw new Error("not a JPEG");
  const d = Math.max(1, Math.min(65535, Math.round(dpi)));
  const b = input;
  const hasJfif =
    b[2] === 0xff && b[3] === 0xe0 && b[6] === 0x4a && b[7] === 0x46 && b[8] === 0x49 && b[9] === 0x46 && b[10] === 0;
  if (hasJfif) {
    const out = b.slice();
    out[13] = 1;
    out[14] = d >> 8;
    out[15] = d & 0xff;
    out[16] = d >> 8;
    out[17] = d & 0xff;
    return out;
  }
  const app0 = [0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 1, d >> 8, d & 0xff, d >> 8, d & 0xff, 0, 0];
  const out = new Uint8Array(b.length + app0.length);
  out.set(b.subarray(0, 2), 0);
  out.set(app0, 2);
  out.set(b.subarray(2), 2 + app0.length);
  return out;
}

export function readJpegDpi(b: Uint8Array): number | null {
  if (!isJpeg(b) || b[2] !== 0xff || b[3] !== 0xe0 || b[13] !== 1) return null;
  return (b[14] << 8) | b[15];
}

const MAX_COM_PAYLOAD = 65533;

/**
 * Grows a JPEG to exactly `targetBytes` by inserting COM (comment) segments. The image data is
 * untouched and every decoder ignores comments; this is how a small, sharp image can satisfy an
 * exam's *minimum* KB rule without making it blurrier or bigger in pixels.
 */
export function padJpeg(input: Uint8Array, targetBytes: number): Uint8Array {
  if (!isJpeg(input)) throw new Error("not a JPEG");
  let extra = targetBytes - input.length;
  if (extra <= 0) return input;
  if (extra < 4) extra = 4; // smallest possible segment; overshoots by at most 3 bytes
  const segments: number[] = [];
  while (extra > 0) {
    let total = Math.min(extra, MAX_COM_PAYLOAD + 4);
    if (extra - total > 0 && extra - total < 4) total -= 4; // never leave a remainder too small for a segment
    segments.push(total);
    extra -= total;
  }
  const added = segments.reduce((a, s) => a + s, 0);
  const at = insertionPoint(input);
  const out = new Uint8Array(input.length + added);
  out.set(input.subarray(0, at), 0);
  let p = at;
  for (const total of segments) {
    const len = total - 2; // length field counts itself plus payload
    out[p] = 0xff;
    out[p + 1] = 0xfe;
    out[p + 2] = len >> 8;
    out[p + 3] = len & 0xff;
    out.fill(0x20, p + 4, p + total); // spaces
    p += total;
  }
  out.set(input.subarray(at), p);
  return out;
}
