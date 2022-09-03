import { doc, DocumentData, DocumentSnapshot, Firestore, getDoc, updateDoc } from "firebase/firestore"
import { ChatData } from "../../types/api/getChat"
import { Message } from "../../types/chat/messages"
import { UserChatList } from "../../types/chat/UserChatList"

const ChatSnap = (
  snapShot: DocumentSnapshot<DocumentData>, 
  dispatch: ({ type, payload }: { type: string, payload: any }) => void, 
  userId: string, 
  db: Firestore
) => {
  if (snapShot.exists()) {
    const chatData = snapShot.data() as ChatData
    const lastMsg: Message = chatData.messages[chatData.messages.length - 1]

    if (chatData.users.includes(userId)) {
      dispatch({
        type: 'UPDATE_CHAT',
        payload: { chatData: chatData, chatId: snapShot.id }
      })
    }

    chatData.users.forEach(async (u: string) => {
      const userDoc = doc(db, "users", u)
      const userInfo = await getDoc(userDoc)

      if (userInfo.exists()) {
        const userChats: UserChatList[] = userInfo.get('chats')
        const chatItemToChange = userChats.findIndex(c => c.chatId === snapShot.id)

        if (chatItemToChange > -1) {
          const modifiedChat: UserChatList = {
            chatLastMsg: lastMsg.body ?? '',
            chatLastMsgType: lastMsg.type,
            lastMessageDate: lastMsg.date,
            chatId: userChats[chatItemToChange].chatId,
            chatName: userChats[chatItemToChange].chatName,
            photoUrl: userChats[chatItemToChange].photoUrl,
          }

          await updateDoc(userDoc, {
            chats: [
              modifiedChat,
              ...userChats.filter((c, k) => k !== chatItemToChange),
            ]
          })
        }
      }
    })

  }
}


export default ChatSnap