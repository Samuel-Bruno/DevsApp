import { DocumentChange, DocumentData } from "firebase/firestore";
import { ChatInfo } from "../reducers/chatsReducer";

export type GetChatsRes = {
  success: boolean;
  chats: ChatInfo[];
  chatsDocs: DocumentChange<DocumentData>[]
}