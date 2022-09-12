type ChatItemProps = {
  active: boolean;
  photoUrl: string;
  chatName: string;
  chatLastMsg: string;
  chatLastMsgType: string;
  onClick: () => void;
  delChat: () => void;
}


export default ChatItemProps