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

import { ChatInfo } from '../../types/reducers/chatsReducer'
import { UserChatList as Chat } from '../../types/chat/UserChatList'
import { Message } from '../../types/chat/messages'
import { UserData } from '../../types/api/loginRes'


const ChatPage = () => {
  console.log("Rendered")

  const Api = useRef(useApi()).current
  const dispatch = useRef(useDispatch()).current

  const userData = useSelector((state: RootState) => state.user.data)
  const chatsData = useSelector((state: RootState) => state.chat.chats)

  const [userOptionsOpened, setUserOptionsOpened] = useState(false)
  const [chatsList, setChatsList] = useState<Chat[]>([])
  const [pickedChat, setPickedChat] = useState<null | { id: string, key: number }>(null)
  const [openedChat, setOpenedChat] = useState<null | ChatInfo>(null)

  const handleChatPick = (chat: Chat, k: number) => {
    setPickedChat({ id: chat.chatId as string, key: k })
    updateChatView(chat)
  }

  const parseChatsToChatsList = ({ chats, fromUserData }:
    { chats: ChatInfo[], fromUserData: false } |
    { chats: Chat[], fromUserData: true }
  ) => {

    let list: any[] = []

    if (fromUserData === false) {
      chats.forEach((chat) => {
        // const chatName = await Api.getUserName(chat.users.filter(u => u !== userData.id)[0])
        // const chatPhoto = await Api.getChatPhoto(userData.id, chat.id as string)
        const lastMsg = chat.messages[chat.messages.length - 1]

        list.push({
          chatId: chat.id as string,
          chatLastMsg: lastMsg.body,
          // chatName: chatName,
          lastMessageDate: lastMsg.date,
          // photoUrl: chatPhoto,
        })
      })
    } else {
      chats.forEach((c) => {
        // const chatPhoto = await Api.getChatPhoto(userData.id, c.chatId as string)

        list.push({
          chatId: c.chatId,
          chatLastMsg: c.chatLastMsg,
          // chatName: c.chatName,
          lastMessageDate: c.lastMessageDate,
          // photoUrl: chatPhoto,
        })
      })
    }

    return list
  }

  const updateChatView = (chat?: Chat) => {
    let chatItem = (chat) ?
      chatsData.find(c => c.id === chat?.chatId) :
      chatsData.find(c => c.id === openedChat?.id)
    if (chatItem !== undefined) setOpenedChat(chatItem)
  }



  const getOtherChatsEls = (pickedId: string) => {
    let chats = chatsList.slice().filter(c => c.chatId !== pickedId)

    return (
      <>
        {chats.map((chat: Chat, k) => {
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

  useEffect(() => { // 1
    console.log("1")
    const getChats = async () => {
      let req = await Api.getUserChats(userData.id)
      if (req.success) {
        dispatch({
          type: 'SET_CHATS',
          payload: { chats: req.chats }
        })
      }
    }
    getChats()
  }, [])

  useEffect(() => {

    if (openedChat) {
      const chats = parseChatsToChatsList({ chats: chatsData, fromUserData: false })

      // update last messages in userData
      dispatch({
        type: 'UPDATE_USER_CHAT',
        payload: {
          chats: chats,
          chatId: openedChat.id
        }
      })
    }
  }, [chatsData])

  useEffect(() => {
    setChatsList(userData.chats)
    if (openedChat) {
      setPickedChat({ id: openedChat.id as string, key: userData.chats.findIndex(c => c.chatId === openedChat?.id) })
    }
  }, [userData.chats])

  // useEffect(() => {
  //   console.log("1")
  //   if (openedChat) {
  //     const updateUserChatInfo = async () => {
  //       const chats = await Api.getUserInfo(userData.id) as UserData
  //       dispatch({
  //         type: 'UPDATE_USER_CHAT',
  //         payload: {
  //           chats: chats.chats,
  //           chatId: openedChat?.id
  //         }
  //       })
  //     }
  //     updateUserChatInfo()
  //     updateChatView()
  //   }
  // }, [chatsData])



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

          <S.OthersChatsArea>
            {chatsList.length > 0 && pickedChat == null &&
              chatsList.map((chat: Chat, k) => (
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
          </S.OthersChatsArea>
        </S.ChatsArea>
        {/*
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
        */}
      </S.Left>

      {openedChat &&
        <ChatArea chat={openedChat} />
      }
    </S.Container>
  )

}


export default ChatPage