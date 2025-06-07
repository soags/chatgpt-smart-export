import { Message } from "../types";
import { cleanupText } from "./creanupText";

export function minifyMessages(message: Message[]): Message[] {
  return message.map(({ role, index, id, content, model }) => {
    const cleaned = cleanupText(content);
    return {
      role,
      index,
      id,
      content: cleaned,
      model,
    };
  });
}
