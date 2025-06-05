import { parseChatLog } from "./parsers/parseChatLog";
import { timestamp } from "./utils/date";

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
      const chatLog = parseChatLog();
      const jsonContent = JSON.stringify(chatLog, null, 2);
      triggerDownload(jsonContent);
    }
  });

  (window as any).__CHAT_EXPORT_LISTENER_ADDED__ = true;
}

function triggerDownload(content: string) {
  const title = document.title;
  const filename = `${title}_${timestamp()}.json`;

  const blob = new Blob([content], { type: "application/json" });
  const blobUrl = URL.createObjectURL(blob);

  chrome.runtime.sendMessage({
    type: "download",
    filename,
    url: blobUrl,
  });

  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

