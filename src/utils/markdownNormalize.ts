export function decodeHtmlEntities(html: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}

export function normalizeKaTeX(root: HTMLElement): void {
  for (const katex of root.querySelectorAll(".katex-display")) {
    const tex = katex.querySelector(
      'annotation[encoding="application/x-tex"]'
    )?.textContent;
    if (tex) {
      const codeText = `$$\n${tex.trim()}\n$$`;

      const newPre = document.createElement("pre");
      const newCode = document.createElement("code");
      newCode.textContent = codeText;
      newPre.appendChild(newCode);
      katex.replaceWith(newPre);
    }
  }
}

export function normalizeListIndent(md: string): string {
  return md
    .replace(/^([-*+])\s{2,}/gm, "$1 ") // 箇条書き `-   ` → `- `
    .replace(/^(\d+\.)\s{2,}/gm, "$1 ") // 番号付き `1.  ` → `1. `
    .replace(/^([-*+] \[.\])\s{2,}/gm, "$1 "); // チェックリスト `- [ ]  ` → `- [ ] `
}
