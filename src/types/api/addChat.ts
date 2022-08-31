import { ChatInfo } from "../reducers/chatsReducer";
import { Chat } from "./loginRes";

export type AddChatRes = {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
  userChatsList?: Chat[];
  chatDoc?: ChatInfo
}

export type OtherUser = {
  chats: Chat[];
  id: string;
  email: string;
  avatar: string;
  name: string;
}