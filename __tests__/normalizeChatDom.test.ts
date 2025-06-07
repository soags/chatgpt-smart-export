import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { normalizeChatDom, extractCodeText } from "../src/parsers/normalizeChatDom";

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
    const codeText = extractCodeText(root.querySelector("code")!);

    expect(codeText).toEqual(expectedText);
  });

  it("should extract TypeScript function with interpolation", () => {
    const html = `
<code class="whitespace-pre! language-ts"><span><span><span class="hljs-keyword">function</span></span><span> </span><span><span class="hljs-title function_">greet</span></span><span>(</span><span><span class="hljs-params">name: <span class="hljs-built_in">string</span></span></span><span>): </span><span><span class="hljs-built_in">string</span></span><span> {\n  </span><span><span class="hljs-keyword">return</span></span><span> </span><span><span class="hljs-string">\`Hello, <span class="hljs-subst">\${name}</span></span></span><span>!\`;\n}</span></span></code>
`;
    const expectedText =
      "function greet(name: string): string {\n  return `Hello, ${name}!`;\n}";

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract formatted JSON", () => {
    const html = `
<code class="whitespace-pre! language-json"><span>{\n  </span><span><span class="hljs-attr">"name"</span>: </span><span><span class="hljs-string">"Alice"</span></span><span>,\n  </span><span><span class="hljs-attr">"age"</span>: </span><span><span class="hljs-number">30</span></span><span>\n}</span></code>
`;
    const expectedText = `{\n  "name": "Alice",\n  "age": 30\n}`;

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract raw HTML structure", () => {
    const html = `
<code class="whitespace-pre! language-html"><span><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span></span><span>\n  </span><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span><span>Hello</span><span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span><span>\n</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></code>
`;
    const expectedText = "<div>\n  <p>Hello</p>\n</div>";

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract Python function with return", () => {
    const html = `
<code class="whitespace-pre! language-py"><span><span class="hljs-keyword">def</span><span> </span><span class="hljs-title function_">add</span><span>(</span><span class="hljs-params">a, b</span><span>):</span><span>\n    </span><span class="hljs-keyword">return</span><span> a + b</span></code>
`;
    const expectedText = "def add(a, b):\n    return a + b";

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
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
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract code with emoji and multibyte characters", () => {
    const html = `
<code class="whitespace-pre! language-js"><span><span class="hljs-comment">// この関数は✨重要</span>\n</span><span><span class="hljs-keyword">function</span> star() {\n  </span><span>console.log("✨");\n</span><span>}</span></code>
`;
    const expectedText = `// この関数は✨重要\nfunction star() {\n  console.log("✨");\n}`;

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should decode HTML entities properly", () => {
    const html = `
<code class="whitespace-pre! language-js"><span><span class="hljs-keyword">const</span> html = "&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;";\n</span></code>
`;
    const expectedText = `const html = "<div>Hello & goodbye</div>";\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should handle escape sequences and quotes correctly", () => {
    const html = `
<code class="whitespace-pre! language-js"><span><span class="hljs-keyword">const</span> path = "C:\\\\Program Files\\\\App";\n</span><span><span class="hljs-keyword">const</span> quote = "\\"quoted\\"";\n</span></code>
`;
    const expectedText = `const path = "C:\\\\Program Files\\\\App";\nconst quote = "\\"quoted\\"";\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should preserve emoji and multibyte characters", () => {
    const html = `
<code class="whitespace-pre! language-js"><span><span class="hljs-comment">// ユーザーを歓迎する🎉</span>\n</span><span>console.log("ようこそ🌟");\n</span></code>
`;
    const expectedText = `// ユーザーを歓迎する🎉\nconsole.log("ようこそ🌟");\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should extract JSX-like code correctly", () => {
    const html = `
<code class="whitespace-pre! language-jsx"><span><span class="hljs-keyword">const</span> element = &lt;div&gt;Hello {name}&lt;/div&gt;;\n</span></code>
`;
    const expectedText = `const element = <div>Hello {name}</div>;\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should reconstruct split template literals across spans", () => {
    const html = `
<code class="whitespace-pre! language-js"><span><span class="hljs-keyword">const</span> greet = \`Hello, </span><span>\${</span><span>name</span><span>}!</span><span>\`;\n</span></code>
`;
    const expectedText = "const greet = `Hello, ${name}!`;\n";

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });

  it("should retain Windows CRLF line endings if present in content", () => {
    const html = `
<code class="whitespace-pre! language-js"><span>console.log("A");\r\n</span><span>console.log("B");\r\n</span></code>
`;
    const expectedText = `console.log("A");\nconsole.log("B");\n`;

    const root = createDomFromHtml(html);
    const codeText = extractCodeText(root.querySelector("code")!);
    expect(codeText).toEqual(expectedText);
  });
});

describe("normalizeChatDom", () => {
  it("should normalize code block wrapped in multiple divs", () => {
    const html = `
<pre class="overflow-visible!" data-start="1540" data-end="1617"><div class="contain-inline-size rounded-2xl border-[0.5px] border-token-border-medium relative bg-token-sidebar-surface-primary"><div class="flex items-center text-token-text-secondary px-4 py-2 text-xs font-sans justify-between h-9 bg-token-sidebar-surface-primary dark:bg-token-main-surface-secondary select-none rounded-t-2xl">ts</div><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-sidebar-surface-primary text-token-text-secondary dark:bg-token-main-surface-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"><button class="flex gap-1 items-center select-none py-1" aria-label="コピーする"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xs"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="currentColor"></path></svg>コピーする</button><span class="" data-state="closed"><button class="flex items-center gap-1 py-1 select-none"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xs"><path d="M2.5 5.5C4.3 5.2 5.2 4 5.5 2.5C5.8 4 6.7 5.2 8.5 5.5C6.7 5.8 5.8 7 5.5 8.5C5.2 7 4.3 5.8 2.5 5.5Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.66282 16.5231L5.18413 19.3952C5.12203 19.7678 5.09098 19.9541 5.14876 20.0888C5.19933 20.2067 5.29328 20.3007 5.41118 20.3512C5.54589 20.409 5.73218 20.378 6.10476 20.3159L8.97693 19.8372C9.72813 19.712 10.1037 19.6494 10.4542 19.521C10.7652 19.407 11.0608 19.2549 11.3343 19.068C11.6425 18.8575 11.9118 18.5882 12.4503 18.0497L20 10.5C21.3807 9.11929 21.3807 6.88071 20 5.5C18.6193 4.11929 16.3807 4.11929 15 5.5L7.45026 13.0497C6.91175 13.5882 6.6425 13.8575 6.43197 14.1657C6.24513 14.4392 6.09299 14.7348 5.97903 15.0458C5.85062 15.3963 5.78802 15.7719 5.66282 16.5231Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.5 7L18.5 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>編集する</button></span></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-ts"><span><span><span class="hljs-keyword">function</span></span><span> </span><span><span class="hljs-title function_">greet</span></span><span>(</span><span><span class="hljs-params">name: <span class="hljs-built_in">string</span></span></span><span>): </span><span><span class="hljs-built_in">string</span></span><span> {
  </span><span><span class="hljs-keyword">return</span></span><span> </span><span><span class="hljs-string">\`Hello, <span class="hljs-subst">\${name}</span></span></span><span>\`;
}
</span></span></code></div></div></pre>`;

    const root = createDomFromHtml(html);
    const normalized = normalizeChatDom(root);

    const copyButton = normalized.querySelector(".copy-button");
    expect(copyButton).toBeNull();

    const receivedText = normalized.querySelector("code")?.textContent;
    const expectedText =
      "function greet(name: string): string {\n  return `Hello, ${name}`;\n}\n";
    expect(receivedText).toBe(expectedText);
  });

  it("should preserve table content but remove wrappers", () => {
    const html = `
<div class="tableWrapper">
  <table>
    <thead><tr><th>Head</th></tr></thead>
    <tbody><tr><td>Body</td></tr></tbody>
  </table>
</div>
`;
    const root = createDomFromHtml(html);
    const normalized = normalizeChatDom(root);

    const table = normalized.querySelector("table");
    expect(table).toBeDefined();
    const th = table?.querySelector("th");
    const td = table?.querySelector("td");
    expect(th?.textContent).toBe("Head");
    expect(td?.textContent).toBe("Body");
  });
});
