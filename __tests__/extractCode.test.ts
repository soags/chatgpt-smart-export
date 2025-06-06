import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { extractCode } from "../src/parsers/extractCode";

// Helper to create DOM from HTML string
function createDomFromHtml(html: string): HTMLElement {
  const dom = new JSDOM(`<!DOCTYPE html>${html}`);
  return dom.window.document.body;
}

describe("extractCode", () => {
  it("should javascript code strict extract", () => {
    const html = `
<code class="whitespace-pre! language-ts"><span><span><span class="hljs-keyword">function</span></span><span> </span><span><span class="hljs-title function_">greet</span></span><span>(</span><span><span class="hljs-params">name: <span class="hljs-built_in">string</span></span></span><span>): </span><span><span class="hljs-built_in">string</span></span><span> {\n  </span><span><span class="hljs-keyword">return</span></span><span> </span><span><span class="hljs-string">\`Hello, <span class="hljs-subst">\${name}</span></span></span><span>!\`;\n}</span></span></code>
`;
    const expectedText =
      "function greet(name: string): string {\n  return `Hello, ${name}!`;\n}";

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);

    expect(codeText).toEqual(expectedText);
  });

  it("should extract TypeScript function with interpolation", () => {
    const html = `
<code class="whitespace-pre! language-ts"><span><span><span class="hljs-keyword">function</span></span><span> </span><span><span class="hljs-title function_">greet</span></span><span>(</span><span><span class="hljs-params">name: <span class="hljs-built_in">string</span></span></span><span>): </span><span><span class="hljs-built_in">string</span></span><span> {\n  </span><span><span class="hljs-keyword">return</span></span><span> </span><span><span class="hljs-string">\`Hello, <span class="hljs-subst">\${name}</span></span></span><span>!\`;\n}</span></span></code>
`;
    const expectedText =
      "function greet(name: string): string {\n  return `Hello, ${name}!`;\n}";

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract formatted JSON", () => {
    const html = `
<code class="whitespace-pre! language-json"><span>{\n  </span><span><span class="hljs-attr">"name"</span>: </span><span><span class="hljs-string">"Alice"</span></span><span>,\n  </span><span><span class="hljs-attr">"age"</span>: </span><span><span class="hljs-number">30</span></span><span>\n}</span></code>
`;
    const expectedText = `{\n  "name": "Alice",\n  "age": 30\n}`;

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract raw HTML structure", () => {
    const html = `
<code class="whitespace-pre! language-html"><span><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span></span><span>\n  </span><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span><span>Hello</span><span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span><span>\n</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></code>
`;
    const expectedText = "<div>\n  <p>Hello</p>\n</div>";

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract Python function with return", () => {
    const html = `
<code class="whitespace-pre! language-py"><span><span class="hljs-keyword">def</span><span> </span><span class="hljs-title function_">add</span><span>(</span><span class="hljs-params">a, b</span><span>):</span><span>\n    </span><span class="hljs-keyword">return</span><span> a + b</span></code>
`;
    const expectedText = "def add(a, b):\n    return a + b";

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract code with special characters and HTML entities", () => {
    const html = `<code class="whitespace-pre! language-js">\
<span><span class="hljs-keyword">const</span> str = "</span>\
<span>&lt;div&gt;Hello &amp; welcome&lt;/div&gt;"</span>\
<span>;\n</span>\
<span><span class="hljs-keyword">const</span> path = "C:\\\\Users\\\\test";\n</span>\
</code>`;
    const expectedText = `const str = "<div>Hello & welcome</div>";\nconst path = "C:\\\\Users\\\\test";\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract code with emoji and multibyte characters", () => {
    const html = `
<code class="whitespace-pre! language-js"><span><span class="hljs-comment">// この関数は✨重要</span>\n</span><span><span class="hljs-keyword">function</span> star() {\n  </span><span>console.log("✨");\n</span><span>}</span></code>
`;
    const expectedText = `// この関数は✨重要\nfunction star() {\n  console.log("✨");\n}`;

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should decode HTML entities properly", () => {
    const html = `
<code class="whitespace-pre! language-js"><span><span class="hljs-keyword">const</span> html = "&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;";\n</span></code>
`;
    const expectedText = `const html = "<div>Hello & goodbye</div>";\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should handle escape sequences and quotes correctly", () => {
    const html = `
<code class="whitespace-pre! language-js"><span><span class="hljs-keyword">const</span> path = "C:\\\\Program Files\\\\App";\n</span><span><span class="hljs-keyword">const</span> quote = "\\"quoted\\"";\n</span></code>
`;
    const expectedText = `const path = "C:\\\\Program Files\\\\App";\nconst quote = "\\"quoted\\"";\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should preserve emoji and multibyte characters", () => {
    const html = `
<code class="whitespace-pre! language-js"><span><span class="hljs-comment">// ユーザーを歓迎する🎉</span>\n</span><span>console.log("ようこそ🌟");\n</span></code>
`;
    const expectedText = `// ユーザーを歓迎する🎉\nconsole.log("ようこそ🌟");\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract JSX-like code correctly", () => {
    const html = `
<code class="whitespace-pre! language-jsx"><span><span class="hljs-keyword">const</span> element = &lt;div&gt;Hello {name}&lt;/div&gt;;\n</span></code>
`;
    const expectedText = `const element = <div>Hello {name}</div>;\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should reconstruct split template literals across spans", () => {
    const html = `
<code class="whitespace-pre! language-js"><span><span class="hljs-keyword">const</span> greet = \`Hello, </span><span>\${</span><span>name</span><span>}!</span><span>\`;\n</span></code>
`;
    const expectedText = "const greet = `Hello, ${name}!`;\n";

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should retain Windows CRLF line endings if present in content", () => {
    const html = `
<code class="whitespace-pre! language-js"><span>console.log("A");\r\n</span><span>console.log("B");\r\n</span></code>
`;
    const expectedText = `console.log("A");\nconsole.log("B");\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCode(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });
});
