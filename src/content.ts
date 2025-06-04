import type { Chat } from "./types";
import { extractChatLog } from "./extractor";

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
      const chat = extractChatLog();
      const jsonContent = exportToJSON(chat);
      triggerDownload(jsonContent);
    }
  });

  (window as any).__CHAT_EXPORT_LISTENER_ADDED__ = true;
}

function exportToJSON(chat: Chat): string {
  return JSON.stringify(chat, null, 2);
}

function triggerDownload(content: string) {
  const title = document.title;
  const filename = `${title}_${formatNow()}.json`;

  const blob = new Blob([content], { type: "application/json" });
  const blobUrl = URL.createObjectURL(blob);

  chrome.runtime.sendMessage({
    type: "download",
    filename,
    url: blobUrl,
  });

  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

function formatNow(): string {
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}
