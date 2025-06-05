import { InlineSpan } from "../types/span";

export function extractAssistantInlineSpans(p: HTMLElement): InlineSpan[] {
  const spans: InlineSpan[] = [];

  for (const child of p.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      spans.push({ type: "text", text: child.textContent ?? "" });
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;

      switch (el.tagName) {
        case "CODE":
          spans.push({ type: "code", text: el.textContent ?? "" });
          break;

        case "A":
          spans.push({
            type: "link",
            text: el.textContent ?? "",
            href: el.getAttribute("href") ?? "",
          });
          break;

        case "STRONG":
          spans.push({ type: "bold", text: el.textContent ?? "" });
          break;

        case "EM":
          spans.push({ type: "italic", text: el.textContent ?? "" });
          break;

        default:
          spans.push({ type: "text", text: el.textContent ?? "" });
          break;
      }
    }
  }

  return spans;
}
