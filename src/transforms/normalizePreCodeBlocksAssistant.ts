export function normalizePreCodeBlocksAssistant(root: HTMLElement): void {
  for (const pre of root.querySelectorAll("pre")) {
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
}

function extractCodeText(codeEl: HTMLElement): string {
  let result = "";

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += (node.nodeValue ?? "").replace(/\r\n/g, "\n");
    }
    node.childNodes.forEach(walk);
  }

  walk(codeEl);

  return result;
}