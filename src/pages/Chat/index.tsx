import React, { useEffect, useState } from 'react'
import * as S from './styled'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { Link } from 'react-router-dom'

import { ReactComponent as ArrowDownIcon } from '../../assets/icons/arrow-down.svg'
import { ReactComponent as SettingsIcon } from '../../assets/icons/settings.svg'
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg'
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg'
import { ReactComponent as AddIcon } from '../../assets/icons/add.svg'
import { ReactComponent as ConfirmAddIcon } from '../../assets/icons/confirm.svg'
import ChatItem from '../../components/ChatItem'
import ChatArea from '../../components/ChatArea'

import useApi from '../../api/api'

import { UserChatList } from '../../types/chat/UserChatList'

import { ChatInfo } from '../../types/reducers/chatsReducer'


const ChatPage = () => {

  const Api = useApi()
  const dispatch = useDispatch()

  const userData = useSelector((state: RootState) => state.user.data)
  const chatsState = useSelector((state: RootState) => state.chat?.chats)

  const [chatsList, setChatsList] = useState<any[]>([])
  const [chatsData, setChatsData] = useState<ChatInfo[]>([])
  const [openedChat, setOpenedChat] = useState<ChatInfo | null>(null)


  useEffect(() => {
    const getData = async () => {
      setChatsList(userData.chats)
    }

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

    getData()
    getChats()
  }, [])

  useEffect(() => {
    let opnChat = chatsState.find(c => c.id === openedChat?.id)
    if (opnChat !== undefined) setOpenedChat(opnChat)
  }, [chatsState])

  const [userOptionsOpened, setUserOptionsOpened] = useState(false)
  const [addChatOpened, setAddChatOpened] = useState(false)

  const handleChatPick = async (chat: UserChatList) => {

    // let chatInfo = await Api.getChat(chat.chatId)
    let chatItem = chatsState.find(c => c.id === chat.chatId)
    if (chatItem !== undefined) setOpenedChat(chatItem)
  }


  return (
    <S.Container>
      <S.Left>
        <S.UserArea svgInvertion={userOptionsOpened}>

          <S.InfoArea>
            <S.UserPhoto src={'../../assets/images/users/user1.webp'} />
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
          {chatsList.length > 0 &&
            chatsList.map((chat, k) =>
              <ChatItem key={k}
                photoUrl={chat.photoUrl}
                chatName={chat.chatName}
                chatLastMsg={chat.chatLastMsg}
                onClick={() => handleChatPick(chat)}
              />
            )
          }

        </S.ChatsArea>
        <S.AddChatBtn className={addChatOpened ? 'opened' : ''}>

          <S.AddChatBtnInputArea>
            <span>Email</span>
            <S.AddChatBtnEmailInput
              placeholder='Digite o email do contato'
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

            <S.ConfirmBtn className='confirmAddChatBtn'>
              <ConfirmAddIcon width={24} height={24} />
              <span>Add</span>
            </S.ConfirmBtn>

          </S.AddChatBtnBtnsArea>

        </S.AddChatBtn>
      </S.Left>
      {openedChat &&
        <ChatArea
          chat={openedChat}
        />
      }
    </S.Container>
  )

}


export default ChatPage