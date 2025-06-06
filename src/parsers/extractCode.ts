export function extractCode(codeEl: HTMLElement): string {
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
  const value = (node.nodeValue ?? "").replace(/\r\n/g, "\n"); // CRLF→LF

  return value;
}
