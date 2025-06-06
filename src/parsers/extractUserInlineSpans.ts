import { PhrasingContent } from "mdast";
import { InlineSpan } from "../types/span";
import { toString } from "mdast-util-to-string";

export function extractUserInlineSpans(
  children: PhrasingContent[]
): InlineSpan[] {
  const spans: InlineSpan[] = [];

  for (const node of children) {
    switch (node.type) {
      case "text":
        spans.push({ type: "text", text: node.value });
        break;

      case "inlineCode":
        spans.push({ type: "code", text: node.value });
        break;

      case "delete":
        spans.push({
          type: "strikethrough",
          text: toString(node),
        });
        break;

      case "link":
        spans.push({
          type: "link",
          text: node.children
            .map((c) => (c.type === "text" ? c.value : ""))
            .join(""),
          href: node.url,
        });
        break;

      case "strong":
        spans.push({
          type: "bold",
          text: node.children
            .map((c) => (c.type === "text" ? c.value : ""))
            .join(""),
        });
        break;

      case "emphasis":
        spans.push({
          type: "italic",
          text: node.children
            .map((c) => (c.type === "text" ? c.value : ""))
            .join(""),
        });
        break;

      
      case "image": {
        const img = node;
        spans.push({
          type: "image",
          alt: img.alt ?? "",
          url: img.url,
        });
        break;
      }

      case "inlineMath": {
        const m = node as any;
        spans.push({
          type: "math",
          content: m.value,
          display: "inline",
        });
        break;
      }

      default:
        console.warn("未対応ノード", node.type);
        break;
    }
  }

  return spans;
}
