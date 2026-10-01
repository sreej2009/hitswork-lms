/**
 * Allow-list sanitiser for rich text written in the course builder. Anything not listed is unwrapped
 * (its text kept) or dropped, so stored HTML is safe to render with dangerouslySetInnerHTML.
 */
const ALLOWED_TAGS = new Set([
  'P',
  'BR',
  'H2',
  'H3',
  'STRONG',
  'B',
  'EM',
  'I',
  'U',
  'UL',
  'OL',
  'LI',
  'A',
  'PRE',
  'CODE',
  'BLOCKQUOTE',
  'DIV',
]);
const DROP_WITH_CONTENT = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'NOSCRIPT']);
const SAFE_URL = /^(https?:|mailto:)/i;

function clean(node: Node, doc: Document): Node[] {
  if (node.nodeType === Node.TEXT_NODE) return [doc.createTextNode(node.textContent ?? '')];
  if (node.nodeType !== Node.ELEMENT_NODE) return [];
  const element = node as Element;
  const tag = element.tagName;
  if (DROP_WITH_CONTENT.has(tag)) return [];
  const children = [...element.childNodes].flatMap((child) => clean(child, doc));
  if (!ALLOWED_TAGS.has(tag)) return children;

  // Browsers' contenteditable wraps lines in <div>; store them as paragraphs.
  const out = doc.createElement(tag === 'DIV' ? 'p' : tag === 'B' ? 'strong' : tag === 'I' ? 'em' : tag.toLowerCase());
  if (tag === 'A') {
    const href = element.getAttribute('href') ?? '';
    if (!SAFE_URL.test(href.trim())) return children;
    out.setAttribute('href', href.trim());
    out.setAttribute('target', '_blank');
    out.setAttribute('rel', 'noopener noreferrer');
  }
  children.forEach((child) => out.appendChild(child));
  return [out];
}

export function sanitizeHtml(html: string): string {
  if (!html.trim()) return '';
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const container = doc.createElement('div');
  [...doc.body.childNodes].flatMap((node) => clean(node, doc)).forEach((node) => container.appendChild(node));
  return container.innerHTML;
}

/** Visible text of an HTML string (for length checks and summaries). */
export function htmlToText(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}
