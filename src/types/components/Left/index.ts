import { UserData } from "../../api/loginRes";
import { UserChatList } from "../../chat/UserChatList";

type LeftProps = {
  userOptionsOpened: boolean;
  setUserOptionsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  chatFilter: string;
  setChatFilter: (t: string) => void;
  userData: UserData;
  chatsList: UserChatList[];
  pickedChat: null | { id: string, key: number };
  handleChatPick: (chat: UserChatList, k: number) => void;
  getAllChats: (filter?: string) => JSX.Element;
  getOtherChatsEls: (pickedId: string, filter?: string) => JSX.Element;
  newEmailChat: string;
  setNewEmailChat: (t: string) => void;
  handleNewEmailInput: (t: string) => void;
  emailError: { showing: boolean, msg: string };
  addChatOpened: boolean;
  setAddChatOpened: (value: boolean) => void;
  handleNewChat: () => void;
  handleDelChat: (chat: UserChatList) => void;
  leftToggler: boolean;
  setLeftToggler: (value: boolean) => void;
}


export default LeftProps