import { unified } from "unified";
import remarkParse from "remark-parse";
import {
  Root,
  Paragraph,
  Heading,
  Code,
  List,
  Blockquote,
  Table,
  TableRow,
  TableCell,
  Image,
  ListItem,
} from "mdast";
import { ChecklistListItem, ListStyle, SectionVariant } from "../types/section";
import { toString } from "mdast-util-to-string";
import { extractUserInlineSpans } from "./extractUserInlineSpans";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export function parseMdastToSections(html: string): SectionVariant[] {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .parse(html);

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

        const checklistItems: ChecklistListItem[] = [];
        const regularItems: string[] = [];

        for (const item of l.children) {
          const li = item as ListItem;
          const text = toString(li);

          if (typeof li.checked === "boolean") {
            checklistItems.push({
              text,
              checked: li.checked,
            });
          } else {
            regularItems.push(text);
          }
        }

        let items;
        let style: ListStyle;
        if (checklistItems.length > 0) {
          style = "checklist";
          items = checklistItems;
        } else {
          style = l.ordered ? "ordered" : "unordered";
          items = regularItems;
        }

        sections.push({
          type: "list",
          style,
          items,
        });
        break;
      }

      case "blockquote": {
        const bq = node as Blockquote;
        const blockText = bq.children.map((c) => toString(c)).join("\n");
        sections.push({
          type: "quote",
          text: blockText,
        });
        break;
      }

      case "table": {
        const t = node as Table;
        const headers =
          t.children[0]?.children.map((cell) => toString(cell as TableCell)) ??
          [];
        const rows = t.children
          .slice(1)
          .map((row: TableRow) =>
            row.children.map((cell) => toString(cell as TableCell))
          );
        sections.push({
          type: "table",
          headers,
          rows,
        });
        break;
      }

      case "thematicBreak": {
        sections.push({
          type: "separator",
        });
        break;
      }

      case "math": {
        const m = node as any;
        sections.push({
          type: "math",
          content: m.value,
          display: "block",
        });
        break;
      }      

      default:
        console.warn("未対応ノード", node.type);
        break;
    }
  }

  return sections;
}
