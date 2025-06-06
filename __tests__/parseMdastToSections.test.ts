import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { parseMdastToSections } from "../src/parsers/parseMdastToSections";

// Markdownファイルの読み込み
const markdownPath = path.resolve(
  __dirname,
  "./markdown_all_cases_for_sections.md"
);
const markdown = fs.readFileSync(markdownPath, "utf-8");

function mdToSections(md: string) {
  return parseMdastToSections(md);
}

describe("parseMdastToSections", () => {
  const sections = mdToSections(markdown);
  
  it("should parse sections without error", () => {
    expect(sections.length).toBeGreaterThan(0);
  });

  it("should parse h1", () => {
    const h1 = sections.find((s) => s.type === "heading" && s.level === 1);
    expect(h1).toBeDefined();
    if (h1?.type === "heading") {
      expect(h1?.text).toBe("見出しレベル1");
    }
  });

  it("should parse h2", () => {
    const h2 = sections.find((s) => s.type === "heading" && s.level === 2);
    expect(h2).toBeDefined();
    if (h2?.type === "heading") {
      expect(h2?.text).toBe("見出しレベル2");
    }
  });

  it("should parse h3", () => {
    const h3 = sections.find((s) => s.type === "heading" && s.level === 3);
    expect(h3).toBeDefined();
    if (h3?.type === "heading") {
      expect(h3?.text).toBe("見出しレベル3");
    }
  });

  it("should parse separator (thematicBreak)", () => {
    const sep = sections.find((s) => s.type === "separator");
    expect(sep).toBeDefined();
  });

  it("should parse paragraph with inline spans", () => {
    const para = sections.find(
      (s) =>
        s.type === "paragraph" && s.spans?.some((span) => span.type === "bold")
    );
    expect(para).toBeDefined();
    if (para && para?.type === "paragraph") {
      expect(para.spans?.some((s) => s.type === "bold")).toBe(true);
      expect(para.spans?.some((s) => s.type === "italic")).toBe(true);
      expect(para.spans?.some((s) => s.type === "strikethrough")).toBe(true);
      expect(para.spans?.some((s) => s.type === "code")).toBe(true);
      expect(para.spans?.some((s) => s.type === "link")).toBe(true);
    }
  });

  it("should parse unordered list", () => {
    const ul = sections.find(
      (s) => s.type === "list" && s.style === "unordered"
    );
    expect(ul).toBeDefined();
    if (ul?.type === "list") {
      expect(ul.items).toEqual(["箇条書き1", "箇条書き2"]);
    }
  });

  it("should parse ordered list", () => {
    const ol = sections.find((s) => s.type === "list" && s.style === "ordered");
    expect(ol).toBeDefined();
    if (ol?.type === "list") {
      expect(ol.items).toEqual(["番号付き1", "番号付き2"]);
    }
  });

  it("should parse checklist", () => {
    const checklist = sections.find(
      (s) => s.type === "list" && s.style === "checklist"
    );
    expect(checklist).toBeDefined();
    if (checklist?.type === "list") {
      expect(checklist.items).toEqual([
        { text: "未完了タスク", checked: false },
        { text: "完了タスク", checked: true },
      ]);
    }
  });

  it("should parse blockquote", () => {
    const quote = sections.find((s) => s.type === "quote");
    expect(quote).toBeDefined();
    if (quote?.type === "quote") {
      expect(quote.text).toContain("これは引用です");
    }
  });

  it("should parse code block", () => {
    const code = sections.find((s) => s.type === "code");
    expect(code).toBeDefined();
    if (code?.type === "code") {
      expect(code.language).toBe("ts");
      expect(code.content).toContain('console.log("コードブロック");');
    }
  });

  it("should parse table", () => {
    const table = sections.find((s) => s.type === "table");
    expect(table).toBeDefined();
    if (table?.type === "table") {
      expect(table.headers).toEqual(["見出し1", "見出し2"]);
      expect(table.rows).toEqual([
        ["セル1", "セル2"],
        ["セル3", "セル4"],
      ]);
    }
  });

  it("should parse image section", () => {
    const para = sections.find(
      (s) =>
        s.type === "paragraph" && s.spans?.some((span) => span.type === "image")
    );
    expect(para).toBeDefined();
    if (para && para?.type === "paragraph") {
      const image = para.spans?.find((s) => s.type === "image");
      expect(image).toBeDefined();
      expect(image?.alt).toBe("代替テキスト");
      expect(image?.url).toContain("example.com");
    }
  });

  it("should parse inline math", () => {
    const para = sections.find(
      (s) =>
        s.type === "paragraph" && s.spans?.some((span) => span.type === "math")
    );
    expect(para).toBeDefined();
    if (para && para?.type === "paragraph") {
      const mathInline = para.spans?.find(s => s.type === "math")
      expect(mathInline).toBeDefined();
      expect(mathInline?.content).toContain("a^2 + b^2");      
    }
  });

  it("should parse block math", () => {
    const mathBlock = sections.find(
      (s) => s.type === "math" && s.display === "block"
    );
    expect(mathBlock).toBeDefined();
    if (mathBlock?.type === "math") {
      expect(mathBlock?.content).toContain("e^{i\\pi}");
    }
  });
});
