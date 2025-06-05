export type InlineSpan =
  | InlineCodeSpan
  | LinkSpan
  | BoldSpan
  | ItalicSpan
  | PlainTextSpan;

export type PlainTextSpan = {
  type: "text";
  text: string;
};

export type InlineCodeSpan = {
  type: "code";
  text: string;
};

export type LinkSpan = {
  type: "link";
  text: string;
  href: string;
};

export type BoldSpan = {
  type: "bold";
  text: string;
};

export type ItalicSpan = {
  type: "italic";
  text: string;
};
