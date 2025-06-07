import { normalizePreCodeBlocksUser } from "../transforms/normalizePreCodeBlocksUser";
import { UserMessage } from "../types";
import { decodeHtmlEntities } from "../utils/markdownNormalize";

export function parseUserMessage(
  root: Element,
  index: number,
  id?: string
): UserMessage {
  const cloned = root.cloneNode(true) as HTMLElement;
  
  normalizePreCodeBlocksUser(cloned);
  
  const content = decodeHtmlEntities(cloned.innerHTML);
  
  return {
    index,
    role: "user",
    content,
    id,
  };
}
