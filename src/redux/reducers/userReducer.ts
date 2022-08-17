import { Chat, UserData } from "../../types/api/loginRes";
import { Message } from "../../types/chat/messages";
import { ChatInfo } from "../../types/reducers/chatsReducer";
import { ActionsType, UserStateType } from "../../types/reducers/userReducer";

const initialState: UserStateType = {
  isLogged: false,
  data: {
    avatar: '',
    email: '',
    id: '',
    name: '',
    photoUrl: '',
    token: '',
    chats: []
  }
}


const userReducer = (state: UserStateType = initialState, action: ActionsType) => {

  let res: UserStateType

  switch (action.type) {
    case 'SET_LOGGED':
      res = (action.payload.isLogged === true) ?
        {
          ...state,
          isLogged: action.payload.isLogged as boolean,
          data: action.payload.userData as UserData
        } : {
          ...state,
          isLogged: action.payload.isLogged as boolean
        }
      break
    case 'LOGOUT_USER':
      res = { ...state, isLogged: false, data: initialState.data }
      break
    case 'UPDATE_USER_INFO':
      res = {
        ...state,
        data: action.payload.userData as UserData
      }
      break
    case 'UPDATE_USER_CHAT':
      const chats = action.payload.chats
      const chatId = action.payload.chatId

      const chat: Chat = chats.find((c: Chat) => c.chatId === chatId)

      if (chat !== undefined) {
        const stateChats = state.data.chats
        const chatInState = stateChats.find((c: Chat) => c.chatId === chatId)
        console.log(stateChats)

        let changedChat: Chat = {
          chatName: chatInState?.chatName as string,
          chatLastMsg: chat.chatLastMsg,
          lastMessageDate: chat.lastMessageDate,
          photoUrl: chatInState?.photoUrl as string,
          chatId: chatId
        }

        let othersChatsList = stateChats.filter(c => c.chatId !== chatId)

        console.log([
          changedChat,
          ...othersChatsList
        ])

        return {
          ...state,
          data: {
            ...state.data,
            chats: [
              changedChat,
              ...othersChatsList
            ]
          },
        }
      } else {
        alert("HEREEqweE")
      }
      return state
      break
    default:
      res = state
      break
  }

  return res

}


export default userReducer