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
  for (const codeEl of cloned.querySelectorAll("pre > code")) {
    const raw = codeEl.textContent || "";
    const [firstLine, ...restLines] = raw.split("\n");

    let lang: string | undefined;
    let code: string;
    if (restLines.length > 0 && knownLanguages.includes(firstLine.trim())) {
      lang = firstLine.trim();
      code = restLines.join("\n");
    } else if(firstLine.length === 0) {
      code = [...restLines].join("\n");
    } else {
      code = [firstLine, ...restLines].join("\n");
    }

    const md = lang ? `\`\`\`${lang}\n${code}\n\`\`\`` : `\`\`\`\n${code}\n\`\`\``;
    const textNode = document.createTextNode(md);
    const pre = codeEl.closest("pre");
    if (pre && pre.parentNode) {
      pre.parentNode.replaceChild(textNode, pre);
    }    
  }

  // エンティティをデコード
  const content = decodeHtmlEntities(cloned.innerHTML);

  return content;
}

function decodeHtmlEntities(html: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}

const knownLanguages = [
  "bash",
  "sh",
  "zsh",
  "c",
  "cpp",
  "csharp",
  "css",
  "scss",
  "less",
  "dart",
  "dockerfile",
  "go",
  "html",
  "xml",
  "java",
  "kotlin",
  "javascript",
  "js",
  "jsx",
  "json",
  "lua",
  "makefile",
  "markdown",
  "md",
  "perl",
  "php",
  "plaintext",
  "text",
  "txt",
  "powershell",
  "ps1",
  "python",
  "py",
  "ruby",
  "rb",
  "rust",
  "rs",
  "sql",
  "swift",
  "toml",
  "yaml",
  "yml",
  "typescript",
  "ts",
  "tsx",
  "vim",
  "vue",
  "wasm",
  "xml",
  "yaml",
  "math", // ← GPT特有
];
