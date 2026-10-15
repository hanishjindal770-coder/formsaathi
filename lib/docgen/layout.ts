/**
 * Tiny page-layout engine for the document makers. It only produces a list of draw operations
 * per page; painting happens on a canvas (lib/docgen/render.ts) because the browser shapes
 * Devanagari correctly and pdf-lib does not. Text width comes from an injected `measure` so
 * the whole thing runs in Node tests without a canvas.
 */

export type Font = { size: number; weight?: 400 | 600 };
export type Measure = (text: string, font: Font) => number;
export type Align = "left" | "center" | "right";

export type Op =
  /** `y` is the vertical centre of the line (painted with textBaseline "middle"). */
  | { kind: "text"; x: number; y: number; text: string; font: Font; color?: string; align?: Align }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; width: number; color?: string }
  | { kind: "rect"; x: number; y: number; w: number; h: number; stroke?: string; fill?: string; width?: number }
  | { kind: "image"; x: number; y: number; w: number; h: number; key: string };

export type Page = { ops: Op[] };

/** A4 at 150 DPI. */
export const PAGE = { width: 1240, height: 1754 } as const;

const DEVANAGARI = /[ऀ-ॿ꣠-ꣿ]/;
export const BLANK = "________";

/**
 * Greedy word wrap. Breaks only on spaces, so Devanagari conjuncts and matras stay together.
 * A Latin token wider than the line (a long email or URL) is split by characters; an
 * over-long Devanagari word is left whole on its own line rather than broken mid-cluster.
 * Explicit newlines are kept; empty lines come back as "".
 */
export function wrapText(text: string, maxWidth: number, font: Font, measure: Measure): string[] {
  const out: string[] = [];
  for (const para of text.split(/\r?\n/)) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) {
      out.push("");
      continue;
    }
    let line = "";
    for (const w of words) {
      const cand = line ? `${line} ${w}` : w;
      if (measure(cand, font) <= maxWidth) {
        line = cand;
        continue;
      }
      if (line) out.push(line);
      line = "";
      if (measure(w, font) <= maxWidth || DEVANAGARI.test(w)) {
        line = w;
        continue;
      }
      let chunk = "";
      for (const ch of Array.from(w)) {
        if (chunk && measure(chunk + ch, font) > maxWidth) {
          out.push(chunk);
          chunk = ch;
        } else chunk += ch;
      }
      line = chunk;
    }
    out.push(line);
  }
  return out;
}

/** Source rectangle for drawing an image "object-fit: cover" into a box. Biased upwards so faces stay in frame. */
export function coverCrop(iw: number, ih: number, bw: number, bh: number) {
  const s = Math.max(bw / iw, bh / ih);
  const sw = bw / s;
  const sh = bh / s;
  return { sx: (iw - sw) / 2, sy: (ih - sh) * 0.3, sw, sh };
}

export type Margins = { top: number; right: number; bottom: number; left: number };

export type LayoutOptions = {
  measure: Measure;
  margin: Margins | number;
  width?: number;
  height?: number;
  /** Line height as a multiple of font size. Devanagari needs about 1.6. */
  lineHeight?: number;
  /** Called for every new page (borders, running decorations). */
  onNewPage?: (page: Page, index: number) => void;
};

type Float = { x: number; y: number; w: number; h: number; page: number };

export class Layout {
  readonly pages: Page[] = [];
  y = 0;
  readonly width: number;
  readonly height: number;
  readonly margin: Margins;
  readonly measure: Measure;
  lineHeight: number;
  private float: Float | null = null;
  private readonly onNewPage?: LayoutOptions["onNewPage"];

  constructor(o: LayoutOptions) {
    this.measure = o.measure;
    this.width = o.width ?? PAGE.width;
    this.height = o.height ?? PAGE.height;
    this.margin = typeof o.margin === "number" ? { top: o.margin, right: o.margin, bottom: o.margin, left: o.margin } : o.margin;
    this.lineHeight = o.lineHeight ?? 1.5;
    this.onNewPage = o.onNewPage;
    this.newPage();
  }

  get left() { return this.margin.left; }
  get right() { return this.width - this.margin.right; }
  get bottom() { return this.height - this.margin.bottom; }
  get contentWidth() { return this.right - this.left; }
  get page() { return this.pages[this.pages.length - 1]; }

  lh(font: Font) { return Math.round(font.size * this.lineHeight); }

  newPage() {
    const page: Page = { ops: [] };
    this.pages.push(page);
    this.y = this.margin.top;
    this.float = null;
    this.onNewPage?.(page, this.pages.length - 1);
  }

  /** Starts a new page unless `h` more pixels fit. A block taller than a whole page is placed anyway. */
  ensure(h: number) {
    if (this.y + h > this.bottom && this.y > this.margin.top) this.newPage();
  }

  space(h: number) {
    this.y += h;
  }

  push(op: Op) {
    this.page.ops.push(op);
  }

  /** Usable right edge for content spanning y..y+h (narrower beside a floated photo). */
  rightAt(h: number) {
    const f = this.float;
    if (f && f.page === this.pages.length - 1 && this.y < f.y + f.h && this.y + h > f.y) return f.x - 24;
    return this.right;
  }

  /** Moves below the floated box, if any. */
  clearFloat() {
    const f = this.float;
    if (f && f.page === this.pages.length - 1) this.y = Math.max(this.y, f.y + f.h + 16);
    this.float = null;
  }

  /**
   * Reserves a photo box at the top right of the current position; following content wraps
   * beside it. With no image key a dashed-looking placeholder box is drawn with `placeholder` text.
   */
  photo(key: string | null, w: number, h: number, opts: { placeholder?: string; border?: string } = {}) {
    this.ensure(h);
    const x = this.right - w;
    const y = this.y;
    if (key) this.push({ kind: "image", x, y, w, h, key });
    this.push({ kind: "rect", x, y, w, h, stroke: opts.border ?? "#555", width: 2 });
    if (!key && opts.placeholder) {
      this.push({ kind: "text", x: x + w / 2, y: y + h / 2, text: opts.placeholder, font: { size: 20 }, color: "#888", align: "center" });
    }
    this.float = { x, y, w, h, page: this.pages.length - 1 };
  }

  /** Wrapped paragraph. Lines break across pages one by one. */
  text(str: string, o: { font: Font; color?: string; align?: Align; indent?: number; gapAfter?: number } = { font: { size: 23 } }) {
    const lh = this.lh(o.font);
    const x0 = this.left + (o.indent ?? 0);
    const right = this.rightAt(lh);
    const lines = wrapText(str, right - x0, o.font, this.measure);
    for (const line of lines) {
      this.ensure(lh);
      if (line) {
        const r = this.rightAt(lh);
        const x = o.align === "center" ? (x0 + r) / 2 : o.align === "right" ? r : x0;
        this.push({ kind: "text", x, y: this.y + lh / 2, text: line, font: o.font, color: o.color, align: o.align });
      }
      this.y += lh;
    }
    this.y += o.gapAfter ?? 0;
  }

  /** Section heading with an optional rule below. Keeps at least `keep` px of the following content on the same page. */
  heading(str: string, o: { font: Font; color?: string; align?: Align; rule?: string; gapBefore?: number; gapAfter?: number; keep?: number; bar?: string }) {
    const lh = this.lh(o.font);
    if (this.y > this.margin.top) this.y += o.gapBefore ?? 18;
    this.ensure(lh + (o.keep ?? lh * 2));
    const indent = o.bar ? 18 : 0;
    if (o.bar) this.push({ kind: "rect", x: this.left, y: this.y + lh * 0.18, w: 8, h: lh * 0.64, fill: o.bar });
    const r = this.rightAt(lh);
    const x = o.align === "center" ? (this.left + r) / 2 : this.left + indent;
    this.push({ kind: "text", x, y: this.y + lh / 2, text: str, font: o.font, color: o.color, align: o.align });
    this.y += lh;
    if (o.rule) {
      this.push({ kind: "line", x1: this.left, y1: this.y + 2, x2: r, y2: this.y + 2, width: 2, color: o.rule });
      this.y += 8;
    }
    this.y += o.gapAfter ?? 6;
  }

  rule(o: { color?: string; width?: number; gapBefore?: number; gapAfter?: number } = {}) {
    this.y += o.gapBefore ?? 8;
    this.ensure(4);
    const r = this.rightAt(2);
    this.push({ kind: "line", x1: this.left, y1: this.y, x2: r, y2: this.y, width: o.width ?? 2, color: o.color ?? "#999" });
    this.y += o.gapAfter ?? 12;
  }

  /** "Label : value" row; both columns wrap and the row never splits across pages. */
  kv(label: string, value: string, o: { font: Font; labelFont?: Font; labelWidth: number; color?: string; labelColor?: string; sep?: string; gapAfter?: number }) {
    const lf = o.labelFont ?? o.font;
    const lh = this.lh(o.font);
    const sep = o.sep ?? ":";
    const sepW = sep ? this.measure(`${sep} `, o.font) : 0;
    const labelW = o.labelWidth - 12;
    const labels = wrapText(label, labelW, lf, this.measure);
    // Estimate height with the current (possibly narrowed) width, then re-wrap after a page break.
    let vx = this.left + o.labelWidth + sepW;
    let values = wrapText(value, this.rightAt(lh) - vx, o.font, this.measure);
    const h = Math.max(labels.length, values.length) * lh;
    const before = this.pages.length;
    this.ensure(h);
    if (this.pages.length !== before) values = wrapText(value, this.rightAt(h) - vx, o.font, this.measure);
    labels.forEach((l, i) => this.push({ kind: "text", x: this.left, y: this.y + i * lh + lh / 2, text: l, font: lf, color: o.labelColor ?? o.color }));
    if (sep) this.push({ kind: "text", x: this.left + o.labelWidth, y: this.y + lh / 2, text: sep, font: o.font, color: o.color });
    vx = this.left + o.labelWidth + sepW;
    values.forEach((v, i) => v && this.push({ kind: "text", x: vx, y: this.y + i * lh + lh / 2, text: v, font: o.font, color: o.color }));
    this.y += Math.max(labels.length, values.length) * lh + (o.gapAfter ?? 4);
  }

  /**
   * Bordered table. `widths` are fractions of the content width. The header row repeats on
   * every page the table continues onto.
   */
  table(headers: string[], rows: string[][], o: { widths: number[]; font: Font; headerFont?: Font; border?: string; headerFill?: string; pad?: number; align?: Align[] }) {
    const pad = o.pad ?? 10;
    const hf = o.headerFont ?? { ...o.font, weight: 600 as const };
    const border = o.border ?? "#888";
    this.clearFloat();
    const total = this.contentWidth;
    const xs: number[] = [];
    let acc = this.left;
    for (const w of o.widths) {
      xs.push(acc);
      acc += w * total;
    }
    const cw = o.widths.map((w) => w * total);
    const rowLines = (cells: string[], font: Font) => cells.map((c, i) => wrapText(c, cw[i] - 2 * pad, font, this.measure));
    const drawRow = (cells: string[][], font: Font, fill?: string) => {
      const lh = this.lh(font);
      const h = Math.max(1, ...cells.map((c) => c.length)) * lh + pad;
      if (fill) this.push({ kind: "rect", x: this.left, y: this.y, w: total, h, fill });
      cells.forEach((lines, i) => {
        const a = o.align?.[i] ?? "left";
        const x = a === "center" ? xs[i] + cw[i] / 2 : a === "right" ? xs[i] + cw[i] - pad : xs[i] + pad;
        lines.forEach((l, j) => l && this.push({ kind: "text", x, y: this.y + pad / 2 + j * lh + lh / 2, text: l, font, align: a }));
      });
      this.push({ kind: "rect", x: this.left, y: this.y, w: total, h, stroke: border, width: 1.5 });
      xs.slice(1).forEach((x) => this.push({ kind: "line", x1: x, y1: this.y, x2: x, y2: this.y + h, width: 1.5, color: border }));
      this.y += h;
    };
    const head = rowLines(headers, hf);
    const headH = Math.max(...head.map((c) => c.length)) * this.lh(hf) + pad;
    const bodies = rows.map((r) => rowLines(r, o.font));
    const bodyH = (b: string[][]) => Math.max(1, ...b.map((c) => c.length)) * this.lh(o.font) + pad;
    this.ensure(headH + (bodies[0] ? bodyH(bodies[0]) : 0));
    drawRow(head, hf, o.headerFill);
    for (const b of bodies) {
      const h = bodyH(b);
      if (this.y + h > this.bottom) {
        this.newPage();
        drawRow(head, hf, o.headerFill);
      }
      drawRow(b, o.font);
    }
    this.y += 8;
  }

  /** Two text blocks side by side (place/date on the left, signature on the right). */
  columns(leftLines: string[], rightLines: string[], o: { font: Font; color?: string; topGap?: number }) {
    const lh = this.lh(o.font);
    const n = Math.max(leftLines.length, rightLines.length);
    this.clearFloat();
    this.ensure((o.topGap ?? 0) + n * lh);
    this.y += o.topGap ?? 0;
    const half = this.contentWidth / 2;
    // Both blocks are bottom-aligned so "Date" sits level with the signer's name.
    const lo = n - leftLines.length;
    leftLines.forEach((l, i) => wrapText(l, half, o.font, this.measure).slice(0, 1).forEach((t) => t && this.push({ kind: "text", x: this.left, y: this.y + (i + lo) * lh + lh / 2, text: t, font: o.font, color: o.color })));
    const off = n - rightLines.length;
    rightLines.forEach((l, i) => l && this.push({ kind: "text", x: this.right, y: this.y + (i + off) * lh + lh / 2, text: l, font: o.font, color: o.color, align: "right" }));
    this.y += n * lh;
  }
}

/** Text strings per page, in drawing order (used by tests and the print fallback). */
export const pageTexts = (pages: Page[]) => pages.map((p) => p.ops.flatMap((o) => (o.kind === "text" ? [o.text] : [])));
