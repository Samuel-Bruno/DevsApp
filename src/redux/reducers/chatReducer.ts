import produce from "immer";
import { Message } from "../../types/chat/messages";
import { ActionsType, ChatInfo, ChatStateType } from "../../types/reducers/chatsReducer";

const initialState: ChatStateType = {
  chats: [{
    users: [],
    messages: []
  }]
}

const chatReducer = (state: ChatStateType = initialState, action: ActionsType) => {


  switch (action.type) {
    case "SET_CHATS":
      return {
        ...state,
        chats: action.payload.chats
      }
      break;
    case 'UPDATE_CHAT':
      const chatUsers = action.payload.chatData?.users as string[]
      const chatMessages = action.payload.chatData?.messages as Message[]
      const stateChats = state.chats.slice()

      const changedChatId = action.payload.chatId

      let changedChat: ChatInfo = {
        users: chatUsers,
        messages: chatMessages,
        id: changedChatId,
        ref: action.payload.chatRef
      }

      let othersChatsList = stateChats.filter(c => c.id !== changedChatId)

      return {
        ...state,
        chats: [
          changedChat,
          ...othersChatsList
        ]
      }

      return state
      break;
    default:
      return state
      break;
  }

}

export default chatReducer