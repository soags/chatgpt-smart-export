import { UserMessage } from "../types/chat";
import { SectionVariant } from "../types/section";
import { parseMdastToSections } from "./parseMdastToSections";

export function parseUserMessage(
  root: Element,
  index: number,
  id?: string
): UserMessage {
  // <div class=".whitespace-pre-wrap">をinnerHTML->markdown->AST->構造化セクションに変換
  const sections: SectionVariant[] = parseMdastToSections(root.innerHTML);

  return {
    index,
    role: "user",
    id,
    sections,
  };
}
