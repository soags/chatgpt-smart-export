export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export type Message = {
  index: number;
  role: string;
  content: string;
  codes: Code[];
  id?: string;
  model?: string;
};

export type Code = {
  id: string;
  language: string;
  content: string;
};
