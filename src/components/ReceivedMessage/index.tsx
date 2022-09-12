import React from 'react'
import * as S from './styled'
import { ReactComponent as RecBoxDetail } from '../../assets/icons/recBoxDetail.svg'
import MessageComponentProps from '../../types/components/MessageComponent';


const ReceivedMessage = ({ msg, wDetail }: MessageComponentProps) => {


  return (msg.type === 'text') ? (
    <S.ContainerText wDetail={wDetail}>
      {wDetail && <RecBoxDetail width={10} height={14} className='detail' />}
      {msg.body}
    </S.ContainerText>
  ) : (msg.type === 'photo') ? (
    <S.ContainerPhoto wDetail={wDetail}>
      {wDetail && <RecBoxDetail width={10} height={14} className='detail' />}
      <img src={msg.body} alt="" />
    </S.ContainerPhoto>
  ) : (
    <></>
  )

}


export default ReceivedMessage