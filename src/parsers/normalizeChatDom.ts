import { extractCode } from "./extractCode";

export function normalizeChatDom(root: HTMLElement): HTMLElement {
  const clone = root.cloneNode(true) as HTMLElement;

  // ▼ Codeブロック（<pre><div><div><code><span>...</span></code></div></div></pre>）
  for (const pre of clone.querySelectorAll("pre")) {
    const code = pre.querySelector("code");
    if (code) {
      const codeText = extractCode(code);
      
      const newPre = document.createElement("pre");
      const newCode = document.createElement("code");
      newCode.textContent = codeText;
      newCode.className = code.className || "";
      newPre.appendChild(newCode);
      pre.replaceWith(newPre);
    }
  }

  // ▼ Table（<div><div><table>...</table></div></div> → <table>）
  for (const table of clone.querySelectorAll("div > table")) {
    const wrapper = table.parentElement;
    const outer = wrapper?.parentElement;
    if (wrapper?.childElementCount === 1 && outer?.childElementCount === 1) {
      outer.replaceWith(table);
    }
  }

  // 他にも必要があればここに追加

  return clone;
}