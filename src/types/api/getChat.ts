import { DocumentData } from "firebase/firestore";
import { Message } from "../chat/messages";

export type GetChatRes = {
  success: boolean;
  chat?: DocumentData;
  error?: {
    message?: string;
    code: string;
  }
}

export type ChatData = {
  messages: Message[];
  users: string[]
}