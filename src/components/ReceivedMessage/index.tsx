import React from 'react'
import * as S from './styled'
import { ReactComponent as RecBoxDetail } from '../../assets/icons/recBoxDetail.svg'
import { Message } from '../../types/chat/messages';

type Props = {
  msg: Message;
  wDetail: boolean;
}


const ReceivedMessage = ({ msg, wDetail }: Props) => {


  return (msg.type === 'text') ? (
    <S.ContainerText wDetail={wDetail}>
      {wDetail && <RecBoxDetail width={10} height={14} className='detail' />}
      {msg.body}
    </S.ContainerText>
  ) : (
    <S.ContainerPhoto wDetail={wDetail}>
      {wDetail && <RecBoxDetail width={10} height={14} className='detail' />}
      <img src={msg.body} alt="" />
    </S.ContainerPhoto>
  )

}


export default ReceivedMessage