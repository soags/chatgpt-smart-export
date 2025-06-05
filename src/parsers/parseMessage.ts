import { parseAssistantMessage } from "./parseAssistantMessage";
import { parseUserMessage } from "./parseUserMessage";

export function parseMessage(root: Element, index: number){
  const role = root.getAttribute("data-message-author-role") || "unknown";
  const id = root.getAttribute("data-message-id") || undefined;
  const model = root.getAttribute("data-message-model-slug") || undefined;
      
  if (role === "user") {
    const chatEl = root.querySelector(".whitespace-pre-wrap");
    if(chatEl){
      return parseUserMessage(chatEl, index, id)
    }
  }
  if (role === "assistant") {
    const chatEl = root.querySelector(".markdown");
    if(chatEl){
      return parseAssistantMessage(chatEl, index, id, model)
    }
  }
  
  return null
}