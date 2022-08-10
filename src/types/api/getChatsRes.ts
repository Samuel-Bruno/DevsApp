import { ChatInfo } from "../reducers/chatsReducer";

export type GetChatsRes = {
  success: boolean;
  chats: ChatInfo[];
}