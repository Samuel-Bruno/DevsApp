import React, { useEffect } from 'react'
import * as S from './styled'
import { ReactComponent as ChatOptionsIcon } from '../../assets/icons/chat-options.svg'

type Props = {
  photoUrl: string;
  chatName: string;
  chatLastMsg: string;
  onClick: () => void;
}


const ChatItem = ({ photoUrl, chatName, chatLastMsg, onClick }: Props) => {

  return (
    <S.Box onClick={onClick}>
      <S.ChatPhoto bgImg={'assets/images/users/' + photoUrl} /> {/* change to storage url */}
      <S.ChatInfo>
        <S.ChatName>{chatName}</S.ChatName>
        <S.ChatLastMessage><p>{chatLastMsg}</p></S.ChatLastMessage>
      </S.ChatInfo>
      <S.OptionsArea className='optionsArea'>
        <ChatOptionsIcon width={8} height={16} />
      </S.OptionsArea>
    </S.Box>
  )

}


export default ChatItem