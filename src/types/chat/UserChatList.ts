import { Timestamp } from "firebase/firestore";

export type UserChatList = {
  chatId: string;
  chatLastMsg: string;
  chatName: string;
  lastMessageDate: string | Timestamp;
  photoUrl: string;
}