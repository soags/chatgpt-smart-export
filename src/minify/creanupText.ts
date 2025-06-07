export function cleanupText(raw: string): string {
  return raw
    // 絵文字（基本的なUnicode範囲）
    .replace(
      /([\u231A-\u231B\u23E9-\u23EF\u23F0-\u23F4\u25FD-\u25FE\u2614-\u2615\u2648-\u2653\u267B\u26A0-\u26FD\u2700-\u27BF\u2B05-\u2B07\u2934\u2935\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDFFF])/gu,
      ''
    )
    // ゼロ幅スペース（ZWSP、ZWNBSP、ZWJ、ZWNJなど）
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, '');    
}