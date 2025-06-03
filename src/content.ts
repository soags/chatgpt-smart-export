import { formatNow } from "./utils";
import type { Chat } from "./types";
import { extractChatLog } from "./optimizer";

// ping応答用（backgroundの注入判定）
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "pong" });
  }
});

// 多重登録防止（windowに一時フラグを立てる方法）
if (!(window as any).__CHAT_EXPORT_LISTENER_ADDED__) {
  chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
    if (request.action === "extract_and_download") {
      const chat = extractChatLog(chatId());
      const jsonContent = exportToJSON(chat);
      triggerDownload(jsonContent);
    }
  });

  (window as any).__CHAT_EXPORT_LISTENER_ADDED__ = true;
}

function chatId(): string {
  const match = window.location.href.match(/\/c\/([a-f0-9\-]{36})/);
  return match ? match[1] : "unknown";
}

function exportToJSON(chat: Chat): string {
  return JSON.stringify(chat, null, 2);
}

function triggerDownload(content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const title = document.title;
  const filename = `${title}_${formatNow()}.json`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
