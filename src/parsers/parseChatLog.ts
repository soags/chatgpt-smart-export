import { minifyMessages } from "../minify/minifyMessages";
import { ChatLog, Message } from "../types";
import { parseMessage } from "./parseMessage";

export function parseChatLog(): ChatLog {
  const chatElements = document.querySelectorAll("[data-message-author-role]");

  const messages: Message[] = [];

  chatElements.forEach((el, index) => {
    const message = parseMessage(el, index);
    if (message) {
      messages.push(message);
    }
  });

  const minified = minifyMessages(messages);

  return {
    id: chatId(),
    title: document.title || "unknown",
    messages: minified,
  };
}

function chatId(): string {
  const match = window.location.href.match(/\/c\/([a-f0-9\-]{36})/);
  return match ? match[1] : "unknown";
}
