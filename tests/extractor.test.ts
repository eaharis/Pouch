import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { extractReadable } from "../src/content/extractor";

function runOn(html: string) {
  const dom = new JSDOM(html, { url: "https://example.com/x" });
  // @ts-ignore swap globals to simulate tab
  global.document = dom.window.document;
  // @ts-ignore
  global.location = dom.window.location;
  return extractReadable();
}

describe("extractReadable", () => {
  it("picks article/main and returns html+text", () => {
    const out = runOn(`
      <html><head><title>T1</title></head>
      <body><nav>nav</nav><article><h2>Head</h2><p>Body text.</p></article></body></html>
    `);
    expect(out.title).toBe("T1");
    expect(out.url).toMatch("example.com");
    expect(out.html).toContain("Body text.");
    expect(out.text).toContain("Body text.");
  });

  it("falls back to largest text block", () => {
    const out = runOn(`<div><div>short</div><div>${"x".repeat(400)}</div></div>`);
    expect(out.text.length).toBeGreaterThan(100);
  });
});
