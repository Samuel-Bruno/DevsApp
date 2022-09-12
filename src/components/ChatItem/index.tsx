import React from 'react'
import * as S from './styled'
import { ReactComponent as ChatOptionsIcon } from '../../assets/icons/chat-options.svg'
import { ReactComponent as ImageIcon } from '../../assets/icons/image.svg'
import ChatItemProps from '../../types/components/ChatItem'


const ChatItem = ({ active, photoUrl, chatName, chatLastMsg, chatLastMsgType, onClick, delChat }: ChatItemProps) => {

  const handleChatOption = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const optionsArea = e.currentTarget.parentElement
    optionsArea?.querySelector(".optionsList")?.classList.toggle('active')
  }

  const handleBoxClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let togglerIcon = e.currentTarget.querySelector(".optionsArea svg")
    if (togglerIcon && (e.target !== togglerIcon)) onClick()
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let optionsArea = e.currentTarget.parentElement
    let optionsList = optionsArea?.querySelector('.optionsList')
    if (optionsList?.classList.contains('active')) {
      optionsList.classList.remove('active')
    }
  }


  return (
    <S.Box
      onClick={(e) => handleBoxClick(e)}
      className={active ? 'active' : ''}
      onMouseLeave={(e) => handleMouseLeave(e)}
    >
      <S.ChatPhoto bgImg={`${photoUrl}`} />
      <S.ChatInfo>
        <S.ChatName>{chatName}</S.ChatName>
        <S.ChatLastMessage>
          {chatLastMsgType === 'fm' &&
            <p></p>
          }
          {chatLastMsgType === 'text' &&
            <p>{chatLastMsg}</p>
          }
          {chatLastMsgType === 'photo' &&
            <p>{<ImageIcon width={24} height={24} />}</p>
          }
        </S.ChatLastMessage>
      </S.ChatInfo>
      <S.OptionsArea className='optionsArea'>
        <ChatOptionsIcon width={8} height={16} onClick={(e) => handleChatOption(e)} />
        <S.ChatOptionsList className='optionsList'>
          <S.ChatOption onClick={delChat}>
            <span>Sair do chat</span>
          </S.ChatOption>
        </S.ChatOptionsList>
      </S.OptionsArea>
    </S.Box>
  )

}


export default ChatItem