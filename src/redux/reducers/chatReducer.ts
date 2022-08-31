import { Message } from "../../types/chat/messages";
import { ActionsType, ChatInfo, ChatStateType } from "../../types/reducers/chatsReducer";

const initialState: ChatStateType = {
  chats: [{
    users: [],
    messages: []
  }]
}

const chatReducer = (state: ChatStateType = initialState, action: ActionsType) => {
  let res: ChatStateType = state

  switch (action.type) {
    case "SET_CHATS":
      res = {
        ...state,
        chats: action.payload.chats
      }
      break;
    case "DELETE_CHAT":
      res = {
        ...state,
        chats: state.chats.filter(c => c.id !== action.payload.chatId)
      }
      break;
    case 'UPDATE_CHAT':
      const chatUsers = action.payload.chatData?.users as string[]
      const chatMessages = action.payload.chatData?.messages as Message[]
      const stateChats = state.chats.slice()

      const changedChatId = action.payload.chatId
      if (stateChats.findIndex(c => c.id === changedChatId) > -1) {
        let changedChat: ChatInfo = {
          users: chatUsers,
          messages: chatMessages,
          id: changedChatId,
          ref: action.payload.chatRef
        }

        let othersChatsList = stateChats.filter(c => c.id !== changedChatId)

        res = {
          ...state,
          chats: [
            changedChat,
            ...othersChatsList
          ]
        }

      }
      break;
    default:
      res = state
      break;
  }

  return res
}

export default chatReducer