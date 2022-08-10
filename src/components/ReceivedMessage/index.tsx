import React from 'react'
import * as S from './styled'
import { ReactComponent as RecBoxDetail } from '../../assets/icons/recBoxDetail.svg'
import { Message } from '../../types/chat/messages';

type Props = {
  msg: Message;
  wDetail: boolean;
}


const ReceivedMessage = ({ msg, wDetail }: Props) => {


  return (
    <S.Container wDetail={wDetail}>
      {wDetail && <RecBoxDetail width={10} height={14} className='detail' />}
      {msg.body}
    </S.Container>
  )

}


export default ReceivedMessage