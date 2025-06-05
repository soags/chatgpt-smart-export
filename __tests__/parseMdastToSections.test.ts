import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { parseMdastToSections } from "../src/parsers/parseMdastToSections";
import { SectionVariant } from "../src/types/section";

// Markdownファイルの読み込み
const markdownPath = path.resolve(__dirname, "./markdown_all_structures.md");
const markdown = fs.readFileSync(markdownPath, "utf-8");

function mdToSections(md: string) {
  return parseMdastToSections(md);
}

describe("parseMdastToSections", () => {
  const sections = mdToSections(markdown);

  it("should parse sections without error", () => {
    expect(sections.length).toBeGreaterThan(0);
  });

  it("should contain at least one of each common section type", () => {
    const types = new Set(sections.map(s => s.type));
    expect(types.has("heading")).toBe(true);
    expect(types.has("paragraph")).toBe(true);
    expect(types.has("list")).toBe(true);
    expect(types.has("quote")).toBe(true);
    expect(types.has("code")).toBe(true);
    expect(types.has("table")).toBe(true);
    expect(types.has("separator")).toBe(true);
  });

  it("should preserve code language and content", () => {
    const code = sections.find(s => s.type === "code");
    expect(code).toBeDefined();
    if (code?.type === "code") {
      expect(code.language).toBe("ts");
      expect(code.content).toContain("function hello()");
    }
  });
});
