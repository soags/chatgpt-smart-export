import { PhrasingContent } from "mdast";
import { InlineSpan } from "../types/span";

export function extractUserInlineSpans(children: PhrasingContent[]): InlineSpan[] {
  const spans: InlineSpan[] = [];

  for (const node of children) {
    switch (node.type) {
      case "text":
        spans.push({ type: "text", text: node.value });
        break;

      case "inlineCode":
        spans.push({ type: "code", text: node.value });
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

      default:
        // fallback: attempt to extract text if unknown type
        spans.push({ type: "text", text: (node as any).value || "" });
        break;
    }
  }

  return spans;
}
