import React from 'react'
import * as S from './styled'
import { ReactComponent as BoxDetail } from '../../assets/icons/sndBoxDetail.svg'
import { Message } from '../../types/chat/messages';

type Props = {
  msg: Message;
  wDetail: boolean;
}


const SendedMessage = ({ msg, wDetail }: Props) => {


  return (msg.type === 'text') ? (
    <S.ContainerText wDetail={wDetail}>
      {wDetail && <BoxDetail width={10} height={14} className='detail' />}
      {msg.body}
    </S.ContainerText>
  ) : (msg.type === 'photo') ? (
    <S.ContainerPhoto wDetail={wDetail}>
      {wDetail && <BoxDetail width={10} height={14} className='detail' />}
      <img src={msg.body} alt="" />
    </S.ContainerPhoto>
  ) : (
    <></>
  )

}


export default SendedMessage