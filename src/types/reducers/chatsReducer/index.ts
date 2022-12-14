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
  ref?: DocumentReference | string;
}

export type ActionsType = {
  type: 'SET_CHATS';
  payload: {
    chats: ChatInfo[]
  };
} | {
  type: 'ADD_CHAT';
  payload: {
    chat: ChatInfo;
  };
} | {
  type: 'UPDATE_CHAT';
  payload: {
    chatData?: ChatData;
    chatId?: string;
    chatRef?: DocumentReference;
  };
} | {
  type: 'DELETE_CHAT';
  payload: {
    chatId?: string;
    chatRef?: DocumentReference;
  };
} | {
  type: 'CLEAN_CHAT_STATE';
  payload: {
    clean: boolean;
  };
}


type actionsTypes = 'SET_CHATS' | 'DELETE_CHAT' | 'UPDATE_CHAT_INFO' | 'CLEAN_CHAT_STATE'