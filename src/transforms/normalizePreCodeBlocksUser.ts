export function normalizePreCodeBlocksUser(root: HTMLElement): void {
  // pre > code を ```lang ... ``` に書き換える
  for (const codeEl of root.querySelectorAll("pre > code")) {
    const raw = (codeEl.textContent || "").trimStart();
    const [firstLine, ...restLines] = raw.split("\n");
    const first = firstLine.trim();

    let lang: string | undefined;
    let code: string;

    console.log(raw.split("\n"));

    if (restLines.length > 0 && knownLanguages.includes(first)) {
      lang = first;
      code = restLines.join("\n");
    } else {
      code = [firstLine, ...restLines].join("\n");
    }

    const md = lang
      ? `\`\`\`${lang}\n${code}\n\`\`\``
      : `\`\`\`\n${code}\n\`\`\``;

    const textNode = document.createTextNode(md);
    const pre = codeEl.closest("pre");
    if (pre && pre.parentNode) {
      pre.parentNode.replaceChild(textNode, pre);
    }
  }
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
