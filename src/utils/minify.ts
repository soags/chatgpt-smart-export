type MinifyOption = {
  removeZeroWidthSpace: boolean;
  removeEmoji: boolean;
  removeLinebreak: boolean;
  normalizeSpace: boolean;
};

export function minifyText(
  node: Element,
  option: MinifyOption = {
    removeZeroWidthSpace: true,
    removeEmoji: true,
    removeLinebreak: true,
    normalizeSpace: true,
  }
): string {
  let cleaned = node.textContent ?? "";

  if (option.removeZeroWidthSpace) {
    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");
  }

  if (option.removeEmoji) {
    cleaned = cleaned.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}]/gu,
      ""
    );
  }

  if (option.removeLinebreak) {
    cleaned = cleaned.replace(/[\r\n]/g, "");
  }

  if (option.normalizeSpace) {
    cleaned = cleaned.replace(/\s+/g, " ");
  }

  return cleaned.trim();
}
