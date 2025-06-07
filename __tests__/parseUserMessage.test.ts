import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { parseUserMessage } from "../src/parsers/parseUserMessage";

describe("parseUserMessage", () => {
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
`
    });
  });
});
