import { User, UserCredential } from "firebase/auth";
import { UserData } from "./loginRes";

export type SignUpProps = {
  name: string;
  email: string;
  password: string;
}

export type SignUpRes = {
  success: boolean;
  user?: UserData;
  error?: {
    message: string;
    code: string;
  }
}