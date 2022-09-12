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
    if (chat.chatId === openedChat?.id) setOpenedChat(null)
    if (chat.chatId === pickedChat?.id) setPickedChat(null)

    dispatch({ type: 'DELETE_USER_CHAT', payload: { chatId: chat.chatId } })

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
      setPickedChat({ id: openedChat.id as string, key: userData.chats.findIndex(c => c.chatId === openedChat?.id) })
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

/*

  return (
    <S.Container className={`${!leftToggler ? 'mobileClosed' : ''}`}>
      {inMobile &&
        <S.BgLeft>
          <S.Left>
            <S.UserArea svgInvertion={userOptionsOpened}>

              <S.InfoArea>
                <S.UserPhoto src={`${userData.avatar}`} />
                <S.UserInfo>
                  <S.UserName>{userData.name ?? ''}</S.UserName>
                  <S.UserEmail>{userData.email ?? ''}</S.UserEmail>
                </S.UserInfo>
              </S.InfoArea>
              <ArrowDownIcon width={24} height={24} onClick={() => setUserOptionsOpened(!userOptionsOpened)} />

              <S.UserOptions className={userOptionsOpened ? 'active' : ''}>

                <Link to={'/config'}>
                  <SettingsIcon width={24} height={24} />
                  <span>Configurações</span>
                </Link>

                <Link to={'/logout'}>
                  <LogoutIcon width={24} height={24} />
                  <span>Sair</span>
                </Link>
              </S.UserOptions>
            </S.UserArea>

            <S.SearchArea>
              <S.SearchInput
                placeholder='Pesquisar...'
                value={chatFilter}
                onChange={e => setChatFilter(e.target.value)}
              />
              <SearchIcon width={24} height={24} />
            </S.SearchArea>

            <S.ChatsArea>
              {chatsList.length > 0 && pickedChat !== null &&
                <OpenedChatIndicator
                  width={40} height={40}
                  id="chatIndicator"
                  fillOpacity={inMobile ? 0 : 1}
                />
              }
              <S.OpenedChatArea>
                {chatsList.length > 0 && pickedChat !== null &&
                  <ChatItem
                    active={true}
                    photoUrl={chatsList[pickedChat.key].photoUrl}
                    chatName={chatsList[pickedChat.key].chatName}
                    chatLastMsg={chatsList[pickedChat.key].chatLastMsg}
                    chatLastMsgType={chatsList[pickedChat.key].chatLastMsgType}
                    onClick={() => handleChatPick(chatsList[pickedChat.key], pickedChat.key)}
                    delChat={() => handleDelChat(chatsList[pickedChat.key])}
                  />
                }
              </S.OpenedChatArea>

              <S.OthersChatsArea>
                {chatsList.length > 0 &&
                  (pickedChat == null) ?
                  (chatFilter) ? getAllChats(chatFilter) : getAllChats() :
                  (pickedChat !== null) && chatsList.length > 1 &&
                  <S.OthersChatsArea>
                    <h3>Outros chats</h3>
                    {chatFilter === '' &&
                      getOtherChatsEls(pickedChat.id)
                    } {chatFilter !== '' &&
                      getOtherChatsEls(pickedChat.id, chatFilter)
                    }
                  </S.OthersChatsArea>
                }
                {chatsList.length === 0 &&
                  <>Você não tem nenhum chat em aberto</>
                }
              </S.OthersChatsArea>
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
                  onClick={() => { setAddChatOpened(!addChatOpened); setNewEmailChat('') }}
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

            <S.AreaToggler className={leftToggler ? 'active' : ''} onClick={() => setLeftToggler(!leftToggler)}>
              <span></span>
              <span></span>
              <span></span>
            </S.AreaToggler>

          </S.Left>
        </S.BgLeft>
      }
      {!inMobile &&
        <S.Left>
          <S.UserArea svgInvertion={userOptionsOpened}>

            <S.InfoArea>
              <S.UserPhoto src={`${userData.avatar}`} />
              <S.UserInfo>
                <S.UserName>{userData.name ?? ''}</S.UserName>
                <S.UserEmail>{userData.email ?? ''}</S.UserEmail>
              </S.UserInfo>
            </S.InfoArea>
            <ArrowDownIcon width={24} height={24} onClick={() => setUserOptionsOpened(!userOptionsOpened)} />

            <S.UserOptions className={userOptionsOpened ? 'active' : ''}>

              <Link to={'/config'}>
                <SettingsIcon width={24} height={24} />
                <span>Configurações</span>
              </Link>

              <Link to={'/logout'}>
                <LogoutIcon width={24} height={24} />
                <span>Sair</span>
              </Link>
            </S.UserOptions>
          </S.UserArea>

          <S.SearchArea>
            <S.SearchInput
              placeholder='Pesquisar...'
              value={chatFilter}
              onChange={e => setChatFilter(e.target.value)}
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
                  chatLastMsgType={chatsList[pickedChat.key].chatLastMsgType}
                  onClick={() => handleChatPick(chatsList[pickedChat.key], pickedChat.key)}
                  delChat={() => handleDelChat(chatsList[pickedChat.key])}
                />
              }
            </S.OpenedChatArea>

            <S.OthersChatsArea>
              {chatsList.length > 0 &&
                (pickedChat == null) ?
                (chatFilter) ? getAllChats(chatFilter) : getAllChats() :
                (pickedChat !== null) && chatsList.length > 1 &&
                <S.OthersChatsArea>
                  <h3>Outros chats</h3>
                  {chatFilter === '' &&
                    getOtherChatsEls(pickedChat.id)
                  } {chatFilter !== '' &&
                    getOtherChatsEls(pickedChat.id, chatFilter)
                  }
                </S.OthersChatsArea>
              }
              {chatsList.length === 0 &&
                <>Você não tem nenhum chat em aberto</>
              }
            </S.OthersChatsArea>
          </S.ChatsArea>

          <S.AddChatBtn className={addChatOpened ? 'opened' : ''}>

            <S.AddChatBtnInputArea>
              <span>Email</span>
              <S.AddChatBtnEmailInput
                placeholder='Digite o email do contato'
                value={newEmailChat}
                onChange={e => handleNewEmailInput(e.target.value)}
              />
              <S.NewChatErrorText
                style={{ opacity: emailError.showing ? 1 : 0 }}
              >
                {emailError.msg}
              </S.NewChatErrorText>
            </S.AddChatBtnInputArea>

            <S.AddChatBtnBtnsArea>

              <S.CancelBtn
                className='addChatBtn'
                onClick={() => { setAddChatOpened(!addChatOpened); setNewEmailChat('') }}
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

          <S.AreaToggler className={leftToggler ? 'active' : ''} onClick={() => setLeftToggler(!leftToggler)}>
            <span></span>
            <span></span>
            <span></span>
          </S.AreaToggler>

        </S.Left>
      }

      {openedChat && pickedChat &&
        <ChatArea chat={openedChat} chatName={chatsList[pickedChat.key]?.chatName ?? ''} />
      }
    </S.Container>
  )
*/