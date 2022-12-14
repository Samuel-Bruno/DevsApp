import { Timestamp } from "firebase/firestore";

export type LoginRes = {
  success: boolean;
  error?: {
    message: string;
    code: string
  } | undefined;
  user?: UserData;
}

export type Chat = {
  chatName: string;
  chatLastMsg: string;
  chatLastMsgType: string;
  lastMessageDate: Timestamp;
  photoUrl: string;
  chatId: string;
}

export type UserData = {
  avatar: string | null;
  chats: Chat[];
  email: string;
  id: string;
  name: string;
  photoUrl: string | null;
  token: string;
};