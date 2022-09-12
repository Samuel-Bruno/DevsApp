import React from 'react'
import * as S from './styled'
import { ReactComponent as BoxDetail } from '../../assets/icons/sndBoxDetail.svg'
import MessageComponentProps from '../../types/components/MessageComponent';


const SendedMessage = ({ msg, wDetail }: MessageComponentProps) => {


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