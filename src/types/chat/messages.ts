import { Timestamp } from "firebase/firestore";

export type Message = {
  body: string;
  date: Timestamp;
  from: string;
  to: string;
  type: string;
}