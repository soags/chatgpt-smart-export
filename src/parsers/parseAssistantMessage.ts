import { AssistantMessage } from "../types/chat";
import {
  HeadingLevel,
  headingLevels,
  ListStyle,
  listStyles,
  SectionVariant,
} from "../types/section";
import { minifyText } from "../utils/minify";
import { extractAssistantInlineSpans } from "./extractAssistantInlineSpans";

export function parseAssistantMessage(
  root: Element,
  index: number,
  id?: string,
  model?: string
): AssistantMessage {
  const sections: SectionVariant[] = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

  while (walker.nextNode()) {
    const node = walker.currentNode as HTMLElement;

    if (node.tagName === "HR") {
      // <hr>
      sections.push({ type: "separator" });
    } else if (/^H[1-6]$/.test(node.tagName)) {
      // <h1> ~ <h6>
      const level = parseInt(node.tagName[1]);
      if (!isHeadingLevel(level)) {
        continue;
      }
      sections.push({
        type: "heading",
        level,
        text: minifyText(node),
      });
    } else if (node.tagName === "P") {
      // <p>
      sections.push({ 
        type: "paragraph", 
        text: minifyText(node),
        spans: extractAssistantInlineSpans(node)
      });
    } else if (node.tagName === "BLOCKQUOTE") {
      // <q>
      sections.push({ type: "quote", text: minifyText(node) });
    } else if (node.tagName === "UL" || node.tagName === "OL") {
      // <ul> or <ol>
      const items = [...node.querySelectorAll("li")].map((li) => minifyText(li));
      const listStyle = node.tagName.toLowerCase();
      if (!isListStyle(listStyle)) {
        continue;
      }
      sections.push({ type: "list", style: listStyle, items });
    } else if (node.matches("pre code")) {
      // <code>
      const lang = node.className.match(/language-(\w+)/)?.[1] || "plaintext";

      const rootSpan = node.querySelector("span");
      if (!rootSpan) {
        continue;
      }
      const content = [...rootSpan.querySelectorAll(":scope > span")]
        .map((line) => line.textContent?.trimEnd() ?? "")
        .join("\n");

      sections.push({
        type: "code",
        language: lang,
        content,
      });
    }
  }

  return {
    index,
    id,
    role: "assistant",
    sections,
    model,
  };
}

function isHeadingLevel(value: unknown): value is HeadingLevel {
  return (
    typeof value === "number" && headingLevels.includes(value as HeadingLevel)
  );
}

function isListStyle(value: unknown): value is ListStyle {
  return typeof value === "string" && listStyles.includes(value as ListStyle);
}
