export function normalizeTableAssistant(root: HTMLElement): void {
  for (const table of root.querySelectorAll("div > table")) {
    const wrapper = table.parentElement;
    const outer = wrapper?.parentElement;
    if (wrapper?.childElementCount === 1 && outer?.childElementCount === 1) {
      outer.replaceWith(table);
    }
  }
}