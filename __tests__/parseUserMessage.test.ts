import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { parseUserMessage } from "../src/parsers/parseUserMessage";

describe("parseUserMessage", () => {
  it("parses headings", () => {
    const dom = new JSDOM(
      `<div class="whitespace-pre-wrap">## 見出しテスト</div>`
    );
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("## 見出しテスト");
  });

  it("parses checklist items", () => {
    const html = `<div class="whitespace-pre-wrap">
- [x] 完了項目
- [ ] 未完了項目
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("- [x] 完了項目");
    expect(content).toContain("- [ ] 未完了項目");
  });

  it("parses code block with language", () => {
    const html = `<div class="whitespace-pre-wrap">
<pre class="overflow-x-auto"><code>ts
const x = 1;</code></pre>
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("```ts\nconst x = 1;\n```");
  });

  it("parses code block with no language", () => {
    const html = `<div class="whitespace-pre-wrap">
<pre class="overflow-x-auto"><code>
const x = 1;</code></pre>
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("```\nconst x = 1;\n```");
  });

  it("parses math block", () => {
    const html = `<div class="whitespace-pre-wrap">
<pre class="overflow-x-auto"><code>math
a^2 + b^2 = c^2</code></pre>
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("```math\na^2 + b^2 = c^2\n```");
  });

  it("parses blockquote from &gt;", () => {
    const html = `<div class="whitespace-pre-wrap">&gt; これは引用です。</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("> これは引用です。");
  });

  it("preserves markdown table", () => {
    const html = `<div class="whitespace-pre-wrap">
| 列A | 列B |
|-----|-----|
| 1   | 2   |
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("| 列A | 列B |");
    expect(content).toContain("| 1   | 2   |");
  });

  it("preserves markdown image", () => {
    const html = `<div class="whitespace-pre-wrap">
![図の説明](https://example.com/math.png)
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("![図の説明](https://example.com/math.png)");
  });

  it("converts DOM with various elements into markdown content", () => {
    const html = `
<div class="whitespace-pre-wrap">## 見出しテスト

これは*強調*されたテキストです。次のリストはチェックリストです：

- [x] 完了項目
- [ ] 未完了項目

以下はTypeScriptのコード例です：

<pre class="overflow-x-auto"><code>ts
const x = 1;</code></pre>

&gt; これは引用です。

| 列A | 列B |
|-----|-----|
| 1   | 2   |

次は数式ブロックです：

<pre class="overflow-x-auto"><code>math
a^2 + b^2 = c^2</code></pre>

そして画像です：

![図の説明](https://example.com/math.png)
</div>`;

    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const result = parseUserMessage(root, 0, "test-id");

    expect(result).toEqual({
      index: 0,
      role: "user",
      id: "test-id",
      content: `## 見出しテスト

これは*強調*されたテキストです。次のリストはチェックリストです：

- [x] 完了項目
- [ ] 未完了項目

以下はTypeScriptのコード例です：

\`\`\`ts
const x = 1;
\`\`\`

> これは引用です。

| 列A | 列B |
|-----|-----|
| 1   | 2   |

次は数式ブロックです：

\`\`\`math
a^2 + b^2 = c^2
\`\`\`

そして画像です：

![図の説明](https://example.com/math.png)
`,
    });
  });

  it("parses normal paragraph and line breaks", () => {
    const html = `<div class="whitespace-pre-wrap">
これは1つ目の段落です。

これは2つ目の段落です。
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("これは1つ目の段落です。");
    expect(content).toContain("これは2つ目の段落です。");
  });

  it("preserves inline markdown syntax", () => {
    const html = `<div class="whitespace-pre-wrap">
**太字**、*斜体*、~~取り消し線~~、\`コード\`
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("**太字**");
    expect(content).toContain("*斜体*");
    expect(content).toContain("~~取り消し線~~");
    expect(content).toContain("`コード`");
  });

  it("preserves links", () => {
    const html = `<div class="whitespace-pre-wrap">
[リンク](https://example.com)
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("[リンク](https://example.com)");
  });

  it("preserves inline math expressions", () => {
    const html = `<div class="whitespace-pre-wrap">
これは $a^2 + b^2 = c^2$ のようなインライン数式です。
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("$a^2 + b^2 = c^2$");
  });

  it("parses math block as code block with lang", () => {
    const html = `<div class="whitespace-pre-wrap">
<pre class="overflow-x-auto"><code>math
e^{i\\pi} + 1 = 0</code></pre>
</div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("```math\ne^{i\\pi} + 1 = 0\n```");
  });

  it("preserves <hr> as is", () => {
    const html = `<div class="whitespace-pre-wrap"><hr></div>`;
    const dom = new JSDOM(html);
    const root = dom.window.document.querySelector("div")!;
    const { content } = parseUserMessage(root, 0);
    expect(content).toContain("<hr>");
  });
});
