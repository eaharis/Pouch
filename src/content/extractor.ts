// Self-contained function. Must not capture outer scope when injected.
export function extractReadable(): {
  url: string; title: string; html: string; text: string;
} {
  const doc = document.cloneNode(true) as Document;

  // strip scripts/styles
  doc.querySelectorAll("script, style, noscript, iframe").forEach(n => n.remove());
  // obvious chrome
  doc.querySelectorAll("header, footer, nav, aside").forEach(n => n.remove());

  // pick main node
  const candidates = Array.from(doc.querySelectorAll("article, main, [role='main']"));
  let node: Element | null = candidates[0] || null;

  if (!node) {
    // heuristic: largest text block
    let best: { el: Element; score: number } | null = null;
    const walker = doc.createTreeWalker(doc.body || doc, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode as Element;
      const tag = el.tagName.toLowerCase();
      if (["p", "div", "section"].includes(tag)) {
        const text = el.textContent?.trim() || "";
        const score = text.length;
        if (score > (best?.score ?? 0)) best = { el, score };
      }
    }
    node = best?.el || doc.body || doc.documentElement;
  }

  const title = (doc.querySelector("meta[property='og:title']") as HTMLMetaElement)?.content
    || doc.title || location.href;

  // sanitize links to absolute
  node!.querySelectorAll("a[href]").forEach(a => {
    try { a.setAttribute("href", new URL((a as HTMLAnchorElement).href).toString()); }
    catch {}
  });

  const html = node!.innerHTML;
  const text = node!.textContent || "";

  return { url: location.href, title, html, text };
}
