import React from 'react'
import * as S from './styled'
import { ReactComponent as BoxDetail } from '../../assets/icons/sndBoxDetail.svg'
import { Message } from '../../types/chat/messages';

type Props = {
  msg: Message;
  wDetail: boolean;
}


const SendedMessage = ({ msg, wDetail }: Props) => {


  return (
    <S.Container wDetail={wDetail}>
      {wDetail && <BoxDetail width={10} height={14} className='detail' />}
      {msg.body}
    </S.Container>
  )

}


export default SendedMessage