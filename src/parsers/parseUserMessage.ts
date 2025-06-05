import { UserMessage } from "../types/chat";
import { minifyText } from "../utils/minify";

export function parseUserMessage(
  root: Element,
  index: number,
  id?: string 
): UserMessage {
  const content = minifyText(root, {
    removeZeroWidthSpace: true,
    removeEmoji: true,
    removeLinebreak: false,
    normalizeSpace: true
  })

  const rawTextContent = root.textContent ?? "";

  const rawHtml = root.innerHTML

  return {
    index,
    role: "user",
    id,
    content,
    rawTextContent,
    rawHtml
  };
}
