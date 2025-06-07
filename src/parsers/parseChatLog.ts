import { ChatLog, MessageVariant } from "../types";
import { parseMessage } from "./parseMessage";

export function parseChatLog(): ChatLog {
    const chatElements = document.querySelectorAll("[data-message-author-role]");
  
    const messages: MessageVariant[] = [];
  
    chatElements.forEach((el, index) => {
      const message = parseMessage(el, index);
      if (message) {
        messages.push(message);
      }
    });
  
    return {
      id: chatId(),
      title: document.title || "unknown",
      messages,
    };
}

function chatId(): string {
  const match = window.location.href.match(/\/c\/([a-f0-9\-]{36})/);
  return match ? match[1] : "unknown";
}