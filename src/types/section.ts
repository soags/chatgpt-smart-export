export type Section = {
  type: string;
};

export type Paragraph = Section & {
  type: "paragraph";
  text: string;
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
  items: string[];
};

export type ListStyle = "ul" | "ol";

export const listStyles: ListStyle[] = ["ul", "ol"];

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

export type SectionVariant =
  | Paragraph
  | Heading
  | List
  | Quote
  | Table
  | Code
  | Separator;
