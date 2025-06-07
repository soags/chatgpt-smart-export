export function cleanupText(raw: string): string {
  return (
    raw
      // 絵文字（基本的なUnicode範囲）
      .replace(
        /(\s*)[\p{Extended_Pictographic}]\uFE0F?(\s*)/gu,
        (match, before, after) => (before && after ? " " : "")
      )
      // ゼロ幅スペース（ZWSP、ZWNBSP、ZWJ、ZWNJなど）
      .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, "")
  );
}
