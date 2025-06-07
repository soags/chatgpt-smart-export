import TurndownService from "turndown";
import { gfm } from '@joplin/turndown-plugin-gfm';
import { AssistantMessage } from "../types/chat";
import { SectionVariant } from "../types/section";
import { normalizeChatDom } from "./normalizeChatDom";
import { parseMdastToSections } from "./parseMdastToSections";

export function parseAssistantMessage(
  root: Element,
  index: number,
  id?: string,
  model?: string
): AssistantMessage {
  // DOM正規化（ChatGPT UIの構造 → Markdown構文に近づける）
  const normalized = normalizeChatDom(root as HTMLElement);  

  // HTML->markdown
  const markdown = htmlToMarkdown(normalized);  

  // markdown->AST->構造化セクションに変換
  const sections: SectionVariant[] = parseMdastToSections(markdown);  

  return {
    index,
    id,
    role: "assistant",
    sections,
    model,
  };
}

function htmlToMarkdown(element: HTMLElement): string {
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
    replacement: (content, node) => {
      if (
        node.nodeName === "INPUT" &&
        (node as HTMLInputElement).type === "checkbox"
      ) {
        const input = node as HTMLInputElement;
        return input.checked ? "[x] " : "[ ] ";
      }
      return ''
    },
  });

  return turndown.turndown(element.innerHTML);
}
