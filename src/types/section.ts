import { InlineSpan } from "./span";

export type SectionVariant =
  | Paragraph
  | Heading
  | List
  | Quote
  | Table
  | Code
  | Separator
  | Image
  | Math;

export type Section = {
  type: string;
};

export type Paragraph = Section & {
  type: "paragraph";
  text: string;
  spans?: InlineSpan[];
};

export type Heading = Section & {
  type: "heading";
  level: HeadingLevel;
  text: string;
};

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const headingLevels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

export type List = Section & {
  type: "list";
  style: ListStyle;
  items: (string | ChecklistListItem)[];
};

export type ChecklistListItem = {
  text: string;
  checked: boolean;
};

export type ListStyle = "unordered" | "ordered" | "checklist";

export const listStyles: ListStyle[] = ["unordered", "ordered", "checklist"];

export type Quote = Section & {
  type: "quote";
  text: string;
};

export type Table = Section & {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type Code = Section & {
  type: "code";
  language: string;
  content: string;
};

export type Separator = Section & {
  type: "separator";
};

export type Image = Section & {
  type: "image";
  alt: string;
  url: string;
};

export type Math = Section & {
  type: "math";
  content: string;
  display: "inline" | "block";
};
