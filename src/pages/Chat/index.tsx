import React, { useEffect, useRef, useState } from 'react'
import * as S from './styled'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

import ChatItem from '../../components/ChatItem'
import ChatArea from '../../components/ChatArea'

import useApi from '../../api/api'

import { ChatInfo } from '../../types/reducers/chatsReducer'
import { UserChatList as Chat } from '../../types/chat/UserChatList'
import { Message } from '../../types/chat/messages'
import { Timestamp } from 'firebase/firestore'
import Left from '../../components/Left'


const ChatPage = () => {

  const Api = useRef(useApi()).current
  const dispatch = useRef(useDispatch()).current

  const userData = useSelector((state: RootState) => state.user.data)
  const chatsData = useSelector((state: RootState) => state.chat.chats)

  const [inMobile, setInMobile] = useState(false)

  const [userOptionsOpened, setUserOptionsOpened] = useState(false)
  const [chatsList, setChatsList] = useState<Chat[]>([])
  const [pickedChat, setPickedChat] = useState<null | { id: string, key: number }>(null)
  const [openedChat, setOpenedChat] = useState<null | ChatInfo>(null)
  const [chatFilter, setChatFilter] = useState('')
  const [addChatOpened, setAddChatOpened] = useState(false)
  const [newEmailChat, setNewEmailChat] = useState('')
  const [emailError, setEmailError] = useState({ showing: false, msg: '' })

  const [leftToggler, setLeftToggler] = useState(true)


  const handleNewEmailInput = (t: string) => {
    setEmailError({ showing: false, msg: '' })
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
        dispatch({ type: 'ADD_USER_CHAT', payload: { chats: add.userChatsList } })
        dispatch({ type: 'ADD_CHAT', payload: { chat: add.chatDoc } })
        setNewEmailChat('')
      } else {
        setEmailError({ showing: true, msg: add.error?.message as string })
      }
    }
  }

  const handleChatPick = (chat: Chat, k: number) => {
    setPickedChat({ id: chat.chatId as string, key: k })
    updateChatView(chat)
    if (inMobile) setLeftToggler(false)
  }

  const updateChatView = (chat?: Chat) => {
    let chatItem = (chat) ?
      chatsData.find(c => c.id === chat?.chatId) :
      chatsData.find(c => c.id === openedChat?.id)
    if (chatItem !== undefined) setOpenedChat(chatItem)
  }

  const parseChatsToChatsList = (chats: ChatInfo[]) => {
    let list: any[] = []

    if (chats && chats.length > 0) {
      chats.forEach((chat) => {
        let obj = {
          chatId: chat.id as string,
          chatLastMsg: '',
          chatLastMsgType: 'fm',
          lastMessageDate: Timestamp.now(),
        }
        if (chat.messages.length > 0) {
          const lastMsg: Message = chat.messages[chat.messages.length - 1]

          obj = {
            ...obj,
            chatLastMsg: lastMsg.body ?? '',
            chatLastMsgType: lastMsg.type,
            lastMessageDate: lastMsg.date,
          }
        }
        list.push(obj)
      })
    }

    return list
  }

  const getAllChats = (filter?: string) => {
    let chats = chatsList.slice()

    if (filter) {
      chats = chats.filter(c => c.chatName.includes(filter))
    }

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
              chatLastMsgType={chat.chatLastMsgType}
              onClick={() => handleChatPick(chat, key)}
              delChat={() => handleDelChat(chat)}
            />
          )
        })}
      </>
    )
  }

  const handleDelChat = async (chat: Chat) => {
    dispatch({ type: 'DELETE_USER_CHAT', payload: { chatId: chat.chatId } })

    if (chat.chatId === pickedChat?.id) {
      setPickedChat(null)
      setOpenedChat(null)
    }

    await Api.delChat(chat.chatId, userData.id)
  }

  const getOtherChatsEls = (pickedId: string, filter?: string) => {
    let chats = chatsList.slice().filter(c => c.chatId !== pickedId)

    if (filter) {
      chats = chats.filter(c => c.chatName.includes(filter))
    }

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
              chatLastMsgType={chat.chatLastMsgType}
              onClick={() => handleChatPick(chat, key)}
              delChat={() => handleDelChat(chat)}
            />
          )
        })}
      </>
    )
  }


  useEffect(() => {
    const getChats = async () => {
      let req = await Api.getUserChats(userData.id)
      if (req.success) {
        dispatch({ type: 'SET_CHATS', payload: { chats: req.chats } })
      }
    }
    getChats()

    window.addEventListener('resize', () => {
      let docSize = window.document.defaultView?.innerWidth
      if (window.screen.width <= 840 || (docSize && docSize <= 840)) {
        if (inMobile === false) setInMobile(true)
      } else if (window.screen.width >= 840 || (docSize && docSize >= 840)) {
        setInMobile(false)
      }
    })
    if (
      window.document.defaultView?.innerWidth &&
      window.document.defaultView?.innerWidth <= 840
    ) {
      setInMobile(true)
    }
  }, [userData.id, Api, dispatch, inMobile])

  useEffect(() => {
    if (openedChat) {
      if (chatsData.length > 0) {
        dispatch({
          type: 'UPDATE_USER_CHAT',
          payload: {
            chats: parseChatsToChatsList(chatsData),
            chatId: openedChat?.id
          }
        })
      }
    } else {
      if (chatsData.length === userData.chats.length) {
        dispatch({
          type: 'UPDATE_USER_CHATS_LIST',
          payload: {
            chats: parseChatsToChatsList(chatsData)
          }
        })
      }
    }

  }, [chatsData, dispatch, openedChat, userData.chats.length])

  useEffect(() => {

    setChatsList(userData.chats)
    if (openedChat) {
      let i = userData.chats.findIndex(c => c.chatId === openedChat?.id)
      if (i > -1) setPickedChat({ id: openedChat.id as string, key: i })
      
      const updateViewInChat = (chat?: Chat) => {
        let chatItem = (chat) ?
          chatsData.find(c => c.id === chat?.chatId) :
          chatsData.find(c => c.id === openedChat?.id)
        if (chatItem !== undefined) setOpenedChat(chatItem)
      }
      updateViewInChat()
    }

  }, [userData.chats, openedChat, chatsData])


  return (
    <S.Container className={`${!leftToggler ? 'mobileClosed' : ''}`}>
      {inMobile &&
        <S.BgLeft>
          <Left
            userOptionsOpened={userOptionsOpened}
            setUserOptionsOpened={setUserOptionsOpened}
            chatFilter={chatFilter}
            setChatFilter={setChatFilter}
            userData={userData}
            chatsList={chatsList}
            pickedChat={pickedChat}
            handleChatPick={handleChatPick}
            getAllChats={getAllChats}
            getOtherChatsEls={getOtherChatsEls}
            newEmailChat={newEmailChat}
            handleNewEmailInput={handleNewEmailInput}
            emailError={emailError}
            addChatOpened={addChatOpened}
            setAddChatOpened={setAddChatOpened}
            handleDelChat={handleDelChat}
            handleNewChat={handleNewChat}
            setNewEmailChat={setNewEmailChat}
            leftToggler={leftToggler}
            setLeftToggler={setLeftToggler}
          />
        </S.BgLeft>
      }
      {!inMobile &&
        <Left
          userOptionsOpened={userOptionsOpened}
          setUserOptionsOpened={setUserOptionsOpened}
          chatFilter={chatFilter}
          setChatFilter={setChatFilter}
          userData={userData}
          chatsList={chatsList}
          pickedChat={pickedChat}
          handleChatPick={handleChatPick}
          getAllChats={getAllChats}
          getOtherChatsEls={getOtherChatsEls}
          newEmailChat={newEmailChat}
          handleNewEmailInput={handleNewEmailInput}
          emailError={emailError}
          addChatOpened={addChatOpened}
          setAddChatOpened={setAddChatOpened}
          handleDelChat={handleDelChat}
          handleNewChat={handleNewChat}
          setNewEmailChat={setNewEmailChat}
          leftToggler={leftToggler}
          setLeftToggler={setLeftToggler}
        />
      }

      {openedChat && pickedChat &&
        <ChatArea chat={openedChat} chatName={chatsList[pickedChat.key]?.chatName ?? ''} />
      }
    </S.Container>
  )

}


export default ChatPage