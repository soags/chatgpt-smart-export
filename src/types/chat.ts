export type ChatLog = {
  id: string;
  title: string;
  messages: Message[];
};

type Message = {
  index: number;
  role: string;  
  content: string;
  id?: string;  
};

export type MessageVariant = UserMessage | AssistantMessage

export type UserMessage = Message & {
  role: "user"
}

export type AssistantMessage = Message & {
  role: "assistant",
  model?: string;
}