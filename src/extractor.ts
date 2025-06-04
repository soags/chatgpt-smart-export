import TurndownService from "turndown";
import { Chat, Code, Message } from "./types";

export function extractChatLog(): Chat {
  const chatElements = document.querySelectorAll("[data-message-author-role]");

  const messages: Message[] = [];

  chatElements.forEach((el, index) => {
    const message = extractMessage(el, index);
    if (message) {
      messages.push(message);
    }
  });

  return {
    id: chatId(),
    title: document.title || "Untitled Chat",
    messages,
  };
}

export function extractMessage(el: Element, index: number) {
  const role = el.getAttribute("data-message-author-role") || "unknown";
  const id = el.getAttribute("data-message-id") || undefined;
  const model = el.getAttribute("data-message-model-slug") || undefined;

  const clonedEl = el.cloneNode(true) as HTMLElement;

  let chatEl: Element | null = null;
  if (role === "user") {
    chatEl = clonedEl.querySelector(".whitespace-pre-wrap");
  } else if (role === "assistant") {
    chatEl = clonedEl.querySelector(".markdown");
  }
  if (!chatEl) {
    return null;
  }

  const codes: Code[] = [];
  const preEls = chatEl.querySelectorAll("pre");

  preEls.forEach((preEl, i) => {
    const codeEl = preEl.querySelector("code");

    if (!codeEl) return;

    const id = `CODE_BLOCK_${codes.length + 1}`;

    const className = codeEl.className || "";
    const match = className.match(/language-(\w+)/);
    const language = match ? match[1] : "plaintext";

    const content = codeEl.textContent ?? "";
    
    codes.push({ id, language, content });

    const placeholder = document.createTextNode(`[${id}]`);
    preEl.replaceWith(placeholder);
  });

  const html = chatEl.innerHTML;
  const markdown = optimizedMarkdown(html);

  const message: Message = {
    index,
    role,
    content: markdown,
    codes,
    id,
    model,
  };

  return message;
}

function optimizedMarkdown(html: string): string {
  const turndownService = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });
  turndownService.remove("style");
  turndownService.remove("script");
  turndownService.remove("noscript");
  turndownService.addRule("removeEmptyDivs", {
    filter: (node) => node.nodeName === "DIV" && node.innerHTML.trim() === "",
    replacement: () => "",
  });

  const markdown = turndownService.turndown(html);

  let cleaned = markdown
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // ゼロ幅スペースを削除
    .replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}]/gu,
      ""
    ) // 絵文字を削除
    .replace(/[\r\n]/g, "") // 改行を削除
    .replace(/\s+/g, " ") // 複数の空白を単一の空白に置換
    .trim();

  return cleaned;
}

function chatId(): string {
  const match = window.location.href.match(/\/c\/([a-f0-9\-]{36})/);
  return match ? match[1] : "unknown";
}