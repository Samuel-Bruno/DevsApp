import { Message } from "./messages"

export type Chat = {
  messages: Message[];
  users: string[];
}