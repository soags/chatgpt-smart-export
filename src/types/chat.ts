import { SectionVariant } from "./section";

export type ChatLog = {
  id: string;
  title: string;
  messages: Message[];
};

export type Message = {
  index: number;
  role: string;  
  id?: string;  
};

export type UserMessage = Message & {
  role: "user",
  sections: SectionVariant[]
}

export type AssistantMessage = Message & {
  role: "assistant",
  sections: SectionVariant[]
  model?: string;
}

export type MessageVariant = UserMessage | AssistantMessage