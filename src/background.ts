chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    const [result] = await chrome.tabs.sendMessage(tab.id, { action: "ping" });

    if (result?.status === "pong") {
      // すでに content.js が注入済み
      console.log("content.js already injected");
    }
  } catch {
    // ping に失敗 → content.js を注入
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  }

  // inject 済み or 直後でも、アクションを送信
  await chrome.tabs.sendMessage(tab.id, { action: "extract_and_download" });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "download") {
    chrome.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: false,
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError.message);
      } else {
        console.log("Download started with ID:", downloadId);
      }
    });
  }
});