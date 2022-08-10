import { User } from "firebase/auth";
import { DocumentReference } from "firebase/firestore";

export type GetUserDataRes = {
  success:boolean;
  user?:DocumentReference;
  error?:{
    code:string,
    message?:string
  }
}