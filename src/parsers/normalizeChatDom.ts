export function normalizeChatDom(root: HTMLElement): HTMLElement {
  const clone = root.cloneNode(true) as HTMLElement;

  // ▼ Codeブロック（<pre><div><div><code><span>...</span></code></div></div></pre>）
  for (const pre of clone.querySelectorAll("pre")) {
    const code = pre.querySelector("code");
    if (code) {
      const codeText = extractCodeText(code);
      
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

  return clone;
}

export function extractCodeText(codeEl: HTMLElement): string {
  let result = "";

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += nodeValue(node);
    }
    node.childNodes.forEach(walk);
  }

  walk(codeEl);

  return result;
}

function nodeValue(node: Node): string {
  return (node.nodeValue ?? "").replace(/\r\n/g, "\n");
}
