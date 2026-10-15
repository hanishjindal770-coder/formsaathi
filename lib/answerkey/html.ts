/**
 * A minimal DOM-like tree used by the response-sheet parser. In the browser we build it from
 * DOMParser (the most tolerant HTML parser there is); elsewhere (tests, no DOM) we fall back to a
 * tiny tokenizer below that is good enough for saved exam pages, which are machine-generated tables.
 */
export interface ANode {
  tag: string; // lower-case element name, or "#text"
  cls: string[]; // lower-cased class names
  text: string; // only for "#text"; img alt text is stored here too for <img>
  children: ANode[];
  parent: ANode | null;
}

const el = (tag: string, cls: string[], parent: ANode | null): ANode => ({ tag, cls, text: "", children: [], parent });

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const SKIP_CONTENT = new Set(["script", "style", "noscript", "template", "title"]);
// Elements whose end tag is often omitted: an open of the same kind closes the previous one.
const AUTO_CLOSE: Record<string, string[]> = { td: ["td", "th"], th: ["td", "th"], tr: ["tr", "td", "th"], li: ["li"], p: ["p"], option: ["option"] };
const SCOPE = new Set(["table", "tbody", "thead", "tfoot", "ul", "ol", "div", "select"]);

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'" };
export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (m, e: string) => {
    const k = e.toLowerCase();
    if (k in ENTITIES) return ENTITIES[k];
    if (k.startsWith("#x")) return String.fromCodePoint(parseInt(k.slice(2), 16) || 32);
    if (k.startsWith("#")) return String.fromCodePoint(Number(k.slice(1)) || 32);
    return m;
  });
}

function attr(attrs: string, name: string): string {
  const m = new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i").exec(attrs);
  return m ? decodeEntities(m[1] ?? m[2] ?? m[3] ?? "") : "";
}
const classes = (s: string) => s.toLowerCase().split(/\s+/).filter(Boolean);

/** String-based HTML parser (no DOM needed). */
export function parseHtmlString(html: string): ANode {
  const root = el("#root", [], null);
  let cur = root;
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<![^>]*>|<\/\s*([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|[^<]+|</g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const [tok, closeTag, openTag, attrs] = m;
    if (openTag) {
      const tag = openTag.toLowerCase();
      if (SKIP_CONTENT.has(tag) && !tok.endsWith("/>")) {
        const end = html.toLowerCase().indexOf(`</${tag}`, re.lastIndex);
        re.lastIndex = end < 0 ? html.length : html.indexOf(">", end) + 1 || html.length;
        continue;
      }
      const closes = AUTO_CLOSE[tag];
      if (closes) {
        for (let n: ANode | null = cur; n && n !== root && !SCOPE.has(n.tag); n = n.parent) {
          if (closes.includes(n.tag)) { cur = n.parent!; break; }
        }
      }
      const node = el(tag, classes(attr(attrs, "class")), cur);
      if (tag === "img") node.text = attr(attrs, "alt");
      cur.children.push(node);
      if (!VOID.has(tag) && !/\/\s*$/.test(attrs)) cur = node;
    } else if (closeTag) {
      const tag = closeTag.toLowerCase();
      // Pop to the matching open element; ignore stray end tags.
      for (let n: ANode | null = cur; n && n !== root; n = n.parent) {
        if (n.tag === tag) { cur = n.parent!; break; }
      }
    } else if (!tok.startsWith("<!") && !tok.startsWith("<!--")) {
      const t = decodeEntities(tok);
      if (t) cur.children.push({ tag: "#text", cls: [], text: t, children: [], parent: cur });
    }
  }
  return root;
}

/** Converts a real DOM tree (from DOMParser) into ANode. */
export function fromDom(node: Node, parent: ANode | null = null): ANode {
  if (node.nodeType === 3) return { tag: "#text", cls: [], text: node.textContent ?? "", children: [], parent };
  const e = node as Element;
  const tag = e.tagName ? e.tagName.toLowerCase() : "#root";
  const out = el(tag, classes(e.getAttribute?.("class") ?? ""), parent);
  if (tag === "img") out.text = e.getAttribute("alt") ?? "";
  if (SKIP_CONTENT.has(tag)) return out;
  node.childNodes.forEach((c) => {
    if (c.nodeType === 1 || c.nodeType === 3) out.children.push(fromDom(c, out));
  });
  return out;
}

export function parseHtml(html: string): ANode {
  if (typeof DOMParser !== "undefined") {
    try {
      return fromDom(new DOMParser().parseFromString(html, "text/html").documentElement);
    } catch {}
  }
  return parseHtmlString(html);
}

const BLOCK = new Set(["td", "th", "tr", "div", "p", "br", "li", "table", "img"]);
/** Visible text, with a space between cells/blocks so "Status :" and "Answered" don't glue. */
export function textOf(n: ANode): string {
  if (n.tag === "#text") return n.text;
  if (n.tag === "img") return n.text ? ` ${n.text} ` : " ";
  const inner = n.children.map(textOf).join("");
  return BLOCK.has(n.tag) ? ` ${inner} ` : inner;
}
export const clean = (s: string) => s.replace(/[\s\u00a0\u200b]+/g, " ").trim();

export function findAll(n: ANode, pred: (x: ANode) => boolean, out: ANode[] = []): ANode[] {
  for (const c of n.children) {
    if (c.tag === "#text") continue;
    if (pred(c)) out.push(c);
    findAll(c, pred, out);
  }
  return out;
}
export const hasClass = (re: RegExp) => (n: ANode) => n.cls.some((c) => re.test(c));
export function closest(n: ANode, pred: (x: ANode) => boolean): ANode | null {
  for (let p = n.parent; p; p = p.parent) if (pred(p)) return p;
  return null;
}
