export type ChatLog = {
  id: string;
  title: string;
  messages: Message[];
};

export type Message = {
  index: number;
  role: "user" | "assistant";
  content: string;
  id?: string;
  model?: string;
};
