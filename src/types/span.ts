export type InlineSpan =
  | PlainTextSpan
  | InlineCodeSpan
  | LinkSpan
  | BoldSpan
  | ItalicSpan  
  | StrikethroughSpan
  | MathSpan
  | ImageSpan;

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

export type StrikethroughSpan = {
  type: "strikethrough";
  text: string;
};

export type MathSpan = {
  type: "math";
  content: string;
  display: "inline";
};

export type ImageSpan = {
  type: "image";
  alt: string;
  url: string;
};
