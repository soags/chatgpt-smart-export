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

  // 正規化されたDOMから Markdown互換の innerHTML を取得
  const markdownInput = normalized.innerHTML;

  // HTML->markdown->AST->構造化セクションに変換
  const sections: SectionVariant[] = parseMdastToSections(markdownInput);

  return {
    index,
    id,
    role: "assistant",
    sections,
    model,
  };
}
