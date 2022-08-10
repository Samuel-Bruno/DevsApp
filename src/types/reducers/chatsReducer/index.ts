import { DocumentReference } from "firebase/firestore";
import { ChatData } from "../../api/getChat";
import { Message } from "../../chat/messages";

export type ChatStateType = {
  chats: ChatInfo[];
}

export type ChatInfo = {
  users: string[];
  messages: Message[];
  id?: string;
  ref?: DocumentReference;
}

export type ActionsType = {
  type: 'SET_CHATS';
  payload: {
    chats: ChatInfo[]
  };
} | {
  type: 'UPDATE_CHAT';
  payload: {
    chatData?: ChatData;
    chatId?: string;
    chatRef?: DocumentReference;
  };
}


type actionsTypes = 'SET_CHATS' | 'UPDATE_CHAT_INFO'