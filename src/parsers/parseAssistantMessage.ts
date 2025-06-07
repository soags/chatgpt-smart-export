import TurndownService from "turndown";
import { gfm } from "@joplin/turndown-plugin-gfm";
import { AssistantMessage } from "../types";
import {
  normalizeKaTeX,
  normalizeListIndent,
} from "../utils/markdownNormalize";
import { normalizePreCodeBlocksAssistant } from "../transforms/normalizePreCodeBlocksAssistant";
import { normalizeTableAssistant } from "../transforms/normalizeTableAssistant";

export function parseAssistantMessage(
  root: Element,
  index: number,
  id?: string,
  model?: string
): AssistantMessage {
  const cloned = root.cloneNode(true) as HTMLElement;

  normalizeKaTeX(cloned);
  normalizeTableAssistant(cloned)
  normalizePreCodeBlocksAssistant(cloned);  

  const markdown = htmlToMarkdown(cloned.innerHTML);
  const normalized = normalizeListIndent(markdown);

  return {
    index,
    id,
    role: "assistant",
    content: normalized,
    model,
  };
}

function htmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });

  turndown.use(gfm);

  turndown.addRule("emphasis", {
    filter: ["em"],
    replacement: (content) => `*${content}*`,
  });

  turndown.addRule("checkbox", {
    filter: (node) =>
      node.nodeName === "INPUT" &&
      (node as HTMLInputElement).type === "checkbox",
    replacement: (_, node) => {
      if (
        node.nodeName === "INPUT" &&
        (node as HTMLInputElement).type === "checkbox"
      ) {
        const input = node as HTMLInputElement;
        return input.checked ? "[x] " : "[ ] ";
      }
      return "";
    },
  });

  return turndown.turndown(html);
}
