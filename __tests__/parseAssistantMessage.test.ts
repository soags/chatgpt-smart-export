import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { parseAssistantMessage } from "../src/parsers/parseAssistantMessage";
import fs from "fs";

describe("parseAssistantMessage", () => {
  it("parses full assistant DOM output into markdown", () => {
    const domHtml = fs.readFileSync("__fixtures__/assistant_dom.html", "utf-8"); 
    const dom = new JSDOM(domHtml);
    const root = dom.window.document.querySelector("div.markdown")!;
    const result = parseAssistantMessage(root, 0, "test-id", "gpt-4");

    const md = result.content;

    // 見出し
    expect(md).toContain("# 見出しレベル1");
    expect(md).toContain("## 見出しレベル2");
    expect(md).toContain("### 見出しレベル3");

    // 段落・インライン
    expect(md).toContain("通常の段落です。");
    expect(md).toContain("**太字**");
    expect(md).toContain("*斜体*");
    expect(md).toContain("~~取り消し線~~");
    expect(md).toContain("`インラインコード`");
    expect(md).toContain("[リンク](https://example.com)");

    // リスト
    expect(md).toContain("- 箇条書き1");
    expect(md).toContain("1. 番号付き1");

    // 引用
    expect(md).toContain("> これは引用です。");
    expect(md).toContain("> 複数行の引用です。");

    // コードブロック
    expect(md).toContain("```ts\nfunction hello()");

    // 表
    expect(md).toContain("| 見出し1 | 見出し2 |");
    expect(md).toContain("| セル1 | セル2 |");

    // チェックリスト
    expect(md).toContain("- [ ] 未完了タスク");
    expect(md).toContain("- [x] 完了タスク");

    // 画像
    expect(md).toContain("![代替テキスト](https://example.com/image.png)");

    // インライン数式
    expect(md).toContain("$a^2 + b^2 = c^2$");

    // ブロック数式（変換されないことの確認）
    expect(md).toContain("$$\ne^{i\\pi} + 1 = 0\n$$");

    // 最終確認文
    expect(md).toContain("これらをJSONやYAMLに構造化して出力することも可能です。");
  });
});
