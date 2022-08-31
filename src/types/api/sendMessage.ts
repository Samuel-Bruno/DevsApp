import { ChatInfo } from "../reducers/chatsReducer";

export type SendMessageProps = {
  msgType: 'text' | 'photo';
  msgBody: string;
  chat: ChatInfo;
  userId: string;
}