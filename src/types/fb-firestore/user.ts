import { Chat } from "../api/loginRes";

type UserInFirestore = {
  name:string;
  email:string;
  avatar:string;
  chats:Chat[];
}


export default UserInFirestore