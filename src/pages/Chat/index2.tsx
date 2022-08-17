import React, { useEffect, useRef, useState } from 'react'
import * as S from './styled'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { Link } from 'react-router-dom'

import { ReactComponent as ArrowDownIcon } from '../../assets/icons/arrow-down.svg'
import { ReactComponent as SettingsIcon } from '../../assets/icons/settings.svg'
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg'
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg'
import { ReactComponent as OpenedChatIndicator } from '../../assets/icons/opened-chat-indicator.svg'
import { ReactComponent as AddIcon } from '../../assets/icons/add.svg'
import { ReactComponent as ConfirmAddIcon } from '../../assets/icons/confirm.svg'
import ChatItem from '../../components/ChatItem'
import ChatArea from '../../components/ChatArea'

import useApi from '../../api/api'

import { UserChatList } from '../../types/chat/UserChatList'

import { ChatInfo } from '../../types/reducers/chatsReducer'
import { UserChatList as Chat } from '../../types/chat/UserChatList'
import { Message } from '../../types/chat/messages'


const ChatPage = () => {

  const Api = useRef(useApi()).current
  const dispatch = useRef(useDispatch()).current

  const userData = useSelector((state: RootState) => state.user.data)
  const chatsState = useSelector((state: RootState) => state.chat?.chats)

  const [userOptionsOpened, setUserOptionsOpened] = useState(false)
  const [addChatOpened, setAddChatOpened] = useState(false)
  const [chatsList, setChatsList] = useState<any[]>([])
  const [pickedChat, setPickedChat] = useState<null | { id: string, key: number }>(null)
  const [openedChat, setOpenedChat] = useState<ChatInfo | null>(null)
  const [newEmailChat, setNewEmailChat] = useState('')


  useEffect(() => {

    const getChats = async () => {
      let req = await Api.getUserChats(userData.id)
      if (req.success) {
        dispatch({
          type: 'SET_CHATS',
          payload: {
            chats: req.chats
          }
        })
      }
    }

    getChats()
    // let teste = parseToChatList(userData.id, chatsState)
    // setChatsList(teste)
    setChatsList(userData.chats)
  }, [userData, Api, dispatch])

  useEffect(() => {
    let opnChat = chatsState.find(c => c.id === openedChat?.id)
    if (opnChat !== undefined) setOpenedChat(opnChat)
  }, [chatsState, openedChat])


  const parseToChatList = (loggedUserId: string, chatState: ChatInfo[]): Chat[] => {

    let res: Chat[] = []

    chatState.forEach(async chat => {
      let chatWith = chat.users.filter(user => user !== loggedUserId)[0]
      const userName = await Api.getUserName(chatWith)
      const chatPhoto = await Api.getChatPhoto(loggedUserId, chat.id as string)
      const lastMsg: Message = chat.messages[chat.messages.length - 1]

      let chatObj: Chat = {
        chatId: chat.id as string,
        chatLastMsg: lastMsg.body,
        chatName: userName,
        lastMessageDate: lastMsg.date,
        photoUrl: chatPhoto
      }
      res.push(chatObj)
    })

    return res
  }

  const handleChatPick = (chat: UserChatList, k: number) => {
    updateChatView(chat)
    setPickedChat({
      id: chat.chatId,
      key: k
    })
  }

  const updateChatView = (chat?: UserChatList) => {
    let chatItem = (chat) ?
      chatsState.find(c => c.id === chat?.chatId) :
      chatsState.find(c => c.id === openedChat?.id)
    if (chatItem !== undefined) setOpenedChat(chatItem)
  }

  const handleNewEmailInput = (t: string) => {
    // apply mask
    setNewEmailChat(t)
  }

  const handleNewChat = async () => {
    if (newEmailChat) {
      const add = await Api.addChat(
        userData.id,
        userData.avatar as string,
        userData.name,
        newEmailChat
      )

      if (add.success) {
        console.log("SUCCESS")
      } else {
        console.log("Erro")
      }
    }
  }

  const getOtherChatsEls = (pickedId: string) => {
    let chats = chatsList.slice().filter(c => c.chatId !== pickedId)

    return (
      <>
        {chats.map((chat: UserChatList, k) => {
          let key = chatsList.findIndex(c => c.chatId === chat.chatId)
          return (
            <ChatItem key={key}
              active={false}
              photoUrl={chat.photoUrl}
              chatName={chat.chatName}
              chatLastMsg={chat.chatLastMsg}
              onClick={() => handleChatPick(chat, key)
              }
            />
          )
        })}
      </>
    )
  }


  return (
    <S.Container>
      <S.Left>
        <S.UserArea svgInvertion={userOptionsOpened}>

          <S.InfoArea>
            <S.UserPhoto src={`../../assets/images/users/${userData.avatar}`} />
            <S.UserInfo>
              <S.UserName>{userData.name ?? ''}</S.UserName>
              <S.UserEmail>{userData.email ?? ''}</S.UserEmail>
            </S.UserInfo>
          </S.InfoArea>

          <ArrowDownIcon width={24} height={24} onClick={() => setUserOptionsOpened(!userOptionsOpened)} />

          <S.UserOptions className={userOptionsOpened ? 'active' : ''}>
            <S.UserOptionsOption>
              <SettingsIcon width={24} height={24} />
              <span>Configurações</span>
            </S.UserOptionsOption>

            <Link to={'/logout'}>
              <LogoutIcon width={24} height={24} />
              <span>Sair</span>
            </Link>
          </S.UserOptions>

        </S.UserArea>

        <S.SearchArea>
          <S.SearchInput
            placeholder='Pesquisar...'
          />
          <SearchIcon width={24} height={24} />
        </S.SearchArea>

        <S.ChatsArea>
          {chatsList.length > 0 && pickedChat !== null &&
            <OpenedChatIndicator
              width={40} height={40}
              id="chatIndicator"
            />
          }
          <S.OpenedChatArea>
            {chatsList.length > 0 && pickedChat !== null &&
              <ChatItem
                active={true}
                photoUrl={chatsList[pickedChat.key].photoUrl}
                chatName={chatsList[pickedChat.key].chatName}
                chatLastMsg={chatsList[pickedChat.key].chatLastMsg}
                onClick={() => handleChatPick(chatsList[pickedChat.key], pickedChat.key)}
              />
            }
          </S.OpenedChatArea>
          {chatsList.length > 0 && pickedChat == null &&
            chatsList.map((chat: UserChatList, k) => (
              <ChatItem key={k}
                active={false}
                photoUrl={chat.photoUrl}
                chatName={chat.chatName}
                chatLastMsg={chat.chatLastMsg}
                onClick={() => handleChatPick(chat, k)}
              />
            ))
          }
          {chatsList.length > 0 && pickedChat !== null &&
            <S.OthersChatsArea>
              <h3>Outros chats</h3>
              {getOtherChatsEls(pickedChat.id)}
            </S.OthersChatsArea>
          }


        </S.ChatsArea>
        <S.AddChatBtn className={addChatOpened ? 'opened' : ''}>

          <S.AddChatBtnInputArea>
            <span>Email</span>
            <S.AddChatBtnEmailInput
              placeholder='Digite o email do contato'
              value={newEmailChat}
              onChange={e => handleNewEmailInput(e.target.value)}
            />
          </S.AddChatBtnInputArea>

          <S.AddChatBtnBtnsArea>

            <S.CancelBtn
              className='addChatBtn'
              onClick={() => setAddChatOpened(!addChatOpened)}
            >
              <AddIcon width={24} height={24} className='addChatIcon' />
              <span>Cancelar</span>
            </S.CancelBtn>

            <S.ConfirmBtn
              className='confirmAddChatBtn'
              onClick={handleNewChat}
            >
              <ConfirmAddIcon width={24} height={24} />
              <span>Add</span>
            </S.ConfirmBtn>

          </S.AddChatBtnBtnsArea>

        </S.AddChatBtn>
      </S.Left>
      {openedChat &&
        <ChatArea chat={openedChat} />
      }
    </S.Container>
  )

}


export default ChatPage
