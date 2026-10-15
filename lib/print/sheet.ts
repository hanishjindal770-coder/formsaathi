/** Layout for printable photo sheets (pure maths, tested). All values in cm. */

export const A4_CM = { width: 21, height: 29.7 };

export type SheetLayout = { cols: number; rows: number; x0: number; y0: number; gap: number; cells: { x: number; y: number }[] };

/**
 * Places `count` photos of w×h cm on A4 in a centred grid with `gap` cm between them and at
 * least `margin` cm of paper around (printers can't print to the edge). Null if they don't fit.
 */
export function layoutSheet(count: number, w: number, h: number, gap = 0.3, margin = 0.8): SheetLayout | null {
  const usableW = A4_CM.width - 2 * margin;
  const usableH = A4_CM.height - 2 * margin;
  const maxCols = Math.floor((usableW + gap) / (w + gap));
  const maxRows = Math.floor((usableH + gap) / (h + gap));
  if (maxCols < 1 || maxRows < 1 || maxCols * maxRows < count) return null;
  const cols = Math.min(maxCols, count);
  const rows = Math.ceil(count / cols);
  const gridW = cols * w + (cols - 1) * gap;
  const gridH = rows * h + (rows - 1) * gap;
  const x0 = (A4_CM.width - gridW) / 2;
  const y0 = Math.min(margin + 0.5, (A4_CM.height - gridH) / 2); // keep near the top: saves paper if they cut it
  const cells = Array.from({ length: count }, (_, i) => ({
    x: x0 + (i % cols) * (w + gap),
    y: y0 + Math.floor(i / cols) * (h + gap),
  }));
  return { cols, rows, x0, y0, gap, cells };
}

export const PHOTO_SIZES = {
  passport: { w: 3.5, h: 4.5 },
  stamp: { w: 2.5, h: 3.0 },
} as const;
export type PhotoSize = keyof typeof PHOTO_SIZES;
