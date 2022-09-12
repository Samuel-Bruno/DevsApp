import React from "react"
import LeftProps from "../../types/components/Left"

import * as S from './styled'

import { ReactComponent as ArrowDownIcon } from '../../assets/icons/arrow-down.svg'
import { ReactComponent as SettingsIcon } from '../../assets/icons/settings.svg'
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg'
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg'
import { ReactComponent as OpenedChatIndicator } from '../../assets/icons/opened-chat-indicator.svg'
import { ReactComponent as AddIcon } from '../../assets/icons/add.svg'
import { ReactComponent as ConfirmAddIcon } from '../../assets/icons/confirm.svg'

import { Link } from "react-router-dom"
import ChatItem from "../ChatItem"


const Left = ({
  userOptionsOpened, setUserOptionsOpened,
  chatFilter, setChatFilter,
  userData, chatsList,
  pickedChat, handleChatPick,
  getAllChats, getOtherChatsEls,
  newEmailChat, handleNewEmailInput,
  emailError,
  addChatOpened, setAddChatOpened,
  handleDelChat, handleNewChat, setNewEmailChat,
  leftToggler, setLeftToggler,
}: LeftProps) => {


  return (
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
  )

}


export default Left