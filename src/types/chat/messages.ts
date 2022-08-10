import { Timestamp } from "firebase/firestore";

export type Message = {
  body: string;  // file
  date: Timestamp;
  from: string;
  to: string;
  type: string;
}