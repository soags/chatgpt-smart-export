import { JSDOM } from 'jsdom';
import { describe, it, expect } from 'vitest';
import { parseAssistantMessage } from '../src/parsers/parseAssistantMessage';
import type { AssistantMessage } from '../src/types/chat';

function createChatGPTDom(html: string): Element {
  const dom = new JSDOM(`
    <div class="markdown prose dark:prose-invert w-full break-words light">
      ${html}
    </div>
  `);
  return dom.window.document.querySelector(".markdown")!;
}

describe("parseAssistantMessage (full pipeline test)", () => {
  it("parses heading, paragraph and checklist list", () => {
    const root = createChatGPTDom(`
<h2>見出しテスト</h2><p>これは<em>重要</em>なテストです。</p><ul><li><input type="checkbox" checked disabled> 完了項目</li><li><input type="checkbox" disabled> 未完了項目</li></ul>
  `);

    const msg: AssistantMessage = parseAssistantMessage(root, 0);

    // console.log(msg)

    expect(msg.sections).toEqual([
      { type: "heading", level: 2, text: "見出しテスト" },
      {
        type: "paragraph",
        text: "これは重要なテストです。",
        spans: [
          { type: "text", text: "これは" },
          { type: "italic", text: "重要" },
          { type: "text", text: "なテストです。" },
        ]
      },
      {
        type: "list",
        style: "checklist",
        items: [
          { text: "完了項目", checked: true },
          { text: "未完了項目", checked: false }
        ]
      }
    ]);
  });

  it("parses code block with syntax-highlighted spans", () => {
    const root = createChatGPTDom(`
<pre><div><div><code class="language-ts"><span>const</span> <span>value</span> = <span>1</span>;</code></div></div></pre>
    `);
    const msg = parseAssistantMessage(root, 1);
    expect(msg.sections).toEqual([
      {
        type: "code",
        language: "ts",
        content: "const value = 1;"
      }
    ]);
  });

  it("parses table, quote, and separator", () => {
    const root = createChatGPTDom(`
<blockquote><p>これは引用</p></blockquote><table><thead><tr><th>列A</th><th>列B</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table><hr />
    `);
    const msg = parseAssistantMessage(root, 2);
    expect(msg.sections).toEqual([
      { type: "quote", text: "これは引用" },
      {
        type: "table",
        headers: ["列A", "列B"],
        rows: [["1", "2"]]
      },
      { type: "separator" }
    ]);
  });

//   it("parses math block and image", () => {
//     const root = createChatGPTDom(`
// <pre><code class="language-math">a^2 + b^2 = c^2</code></pre><p><img src="https://example.com/pic.png" alt="図の説明"/></p>
//     `);
//     const msg = parseAssistantMessage(root, 3);
//     expect(msg.sections).toEqual([
//       {
//         type: "math",
//         content: "a^2 + b^2 = c^2",
//         display: "block"
//       },
//       {
//         type: "image",
//         alt: "図の説明",
//         url: "https://example.com/pic.png"
//       }
//     ]);
//   });
});