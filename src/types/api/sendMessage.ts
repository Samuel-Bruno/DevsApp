import { ChatInfo } from "../reducers/chatsReducer";

export type SendMessageProps = {
  msgType: 'text';
  msgBody: string;
  chat: ChatInfo;
  userId: string;
}