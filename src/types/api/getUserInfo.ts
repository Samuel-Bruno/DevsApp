import { UserData } from "./loginRes";

export type GetUserInfoRes = {
  success: boolean;
  data?: UserData;
}