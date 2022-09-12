import { Timestamp } from "firebase/firestore"
import { Chat, UserData } from "../../types/api/loginRes"
import { ActionsType, UserStateType } from "../../types/reducers/userReducer"

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
    case 'UPDATE_USER_NAME':
      res = {
        ...state,
        data: {
          ...state.data,
          name: action.payload.newName as string
        }
      }
      break
    case 'UPDATE_USER_PHOTO':
      res = {
        ...state,
        data: {
          ...state.data,
          avatar: action.payload.photoUrl as string
        }
      }
      break
    case 'ADD_USER_CHAT':
      res = {
        ...state,
        data: {
          ...state.data,
          chats: action.payload.chats
        }
      }
      break
    case 'UPDATE_USER_CHAT':
      const chats = action.payload.chats
      const chatId = action.payload.chatId

      const chat: Chat = chats.find((c: Chat) => c.chatId === chatId)

      if (chat !== undefined) {
        const stateChats = state.data.chats
        const chatInState = stateChats.find((c: Chat) => c.chatId === chatId)

        let changedChat: Chat = {
          chatName: chatInState?.chatName as string,
          chatLastMsg: chat.chatLastMsg,
          chatLastMsgType: chat.chatLastMsgType,
          lastMessageDate: chat.lastMessageDate,
          photoUrl: chatInState?.photoUrl as string,
          chatId: chatId
        }

        let othersChatsList = stateChats.filter(c => c.chatId !== chatId)

        res = {
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
        res = state
      }
      break
    case 'UPDATE_USER_CHATS_LIST':
      const list = action.payload.chats as {
        chatId: string,
        chatLastMsg: string,
        chatLastMsgType: string,
        lastMessageDate: Timestamp
      }[]

      const stateList = state.data.chats
      let finalList: Chat[] = []

      list.forEach(item => {
        let i = stateList.findIndex(c => c.chatId === item.chatId)
        if (i > -1) {
          let obj: Chat = {
            chatName: stateList[i].chatName as string,
            chatLastMsg: item.chatLastMsg,
            chatLastMsgType: item.chatLastMsgType,
            lastMessageDate: item.lastMessageDate,
            photoUrl: stateList[i].photoUrl as string,
            chatId: item.chatId
          }
          finalList.push(obj)
        }
      })

      res = {
        ...state,
        data: {
          ...state.data,
          chats: finalList
        }
      }
      break
    case 'DELETE_USER_CHAT':
      res = {
        ...state,
        data: {
          ...state.data,
          chats: state.data.chats.filter(c => c.chatId !== action.payload.chatId)
        }
      }
      break
    case 'CLEAN_USER_STATE':
      res = (action.payload.clean) ? initialState : state
      break
    default:
      res = state
      break
  }

  return res

}


export default userReducer