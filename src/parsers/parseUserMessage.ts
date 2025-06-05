import { unified } from "unified";
import remarkParse from "remark-parse";
import { Root, Paragraph, Heading, Code, List, Blockquote, Table, TableRow, TableCell } from 'mdast';
import { UserMessage } from "../types/chat";
import { SectionVariant } from "../types/section";
import { toString } from 'mdast-util-to-string';
import { extractUserInlineSpans } from "./extractUserInlineSpans";

export function parseUserMessage(
  root: Element,
  index: number,
  id?: string
): UserMessage {
  const tree = unified().use(remarkParse).parse(root.innerHTML);

  const sections: SectionVariant[] = [];

  for (const node of tree.children) {
    switch (node.type) {
      case "heading": {
        const h = node as Heading;
        sections.push({
          type: "heading",
          level: h.depth,
          text: toString(h),
        });
        break;
      }

      case "paragraph": {
        const p = node as Paragraph;
        sections.push({
          type: "paragraph",
          text: toString(p),
          spans: extractUserInlineSpans(p.children),
        });
        break;
      }

      case "code": {
        const c = node as Code;
        sections.push({
          type: "code",
          language: c.lang ?? "plaintext",
          content: c.value,
        });
        break;
      }

      case "list": {
        const l = node as List;
        const items = l.children.map((li) => {
          const firstParagraph = li.children.find(
            (n) => n.type === "paragraph"
          ) as Paragraph | undefined;
          return firstParagraph ? toString(firstParagraph) : "(list item)";
        });
        sections.push({
          type: "list",
          style: l.ordered ?  "ol" : "ul",
          items,
        });
        break;
      }

      case "blockquote": {
        const bq = node as Blockquote;
        const blockText = bq.children.map(c => toString(c)).join("\n");
        sections.push({
          type: "quote",
          text: blockText,
        });
        break;
      }

      case 'table': {
        const t = node as Table;
        const headers = t.children[0]?.children.map((cell) => toString(cell as TableCell)) ?? [];
        const rows = t.children.slice(1).map((row: TableRow) =>
          row.children.map((cell) => toString(cell as TableCell)),
        );
        sections.push({
          type: 'table',
          headers,
          rows,
        });
        break;
      }

      default:
        // 無視 or ログ出力など（html, thematicBreak 等）
        break;
    }
  }

  return {
    index,
    role: "user",
    id,
    sections,
  };
}
