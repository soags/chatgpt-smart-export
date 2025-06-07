import { UserMessage } from "../types/chat";

export function parseUserMessage(
  root: Element,
  index: number,
  id?: string
): UserMessage {
  const markdown = normalizeUserMarkdown(root as HTMLElement);

  return {
    index,
    role: "user",
    content: markdown,
    id,
  };
}

function normalizeUserMarkdown(root: HTMLElement): string {
  const cloned = root.cloneNode(true) as HTMLElement;

  // pre > code を ```lang ... ``` に書き換える
  for (const codeElem of cloned.querySelectorAll("pre > code")) {
    const raw = codeElem.textContent || "";
    const [lang, ...lines] = raw.trim().split("\n");
    const code = lines.join("\n");
    const md = `\`\`\`${lang}\n${code}\n\`\`\``;

    const textNode = document.createTextNode(md);
    const pre = codeElem.closest("pre");
    if (pre && pre.parentNode) {
      pre.parentNode.replaceChild(textNode, pre);
    }
  }

  // エンティティをデコード
  const content = decodeHtmlEntities(cloned.innerHTML)

  return content;
}

function decodeHtmlEntities(html: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}