import React, { useEffect, useState } from "react"
import * as S from './styled'
import { ReactComponent as SmileIcon } from '../../assets/icons/smile.svg'
import { ReactComponent as MediaIcon } from '../../assets/icons/media.svg'
import { ReactComponent as SendIcon } from '../../assets/icons/send.svg'
import SendedMessage from "../SendedMessage"
import ReceivedMessage from "../ReceivedMessage"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import useApi from "../../api/api"
import { ChatInfo } from "../../types/reducers/chatsReducer"

type Props = {
  chat: ChatInfo
}


const ChatArea = ({ chat }: Props) => {

  const Api = useApi()

  const userData = useSelector((state: RootState) => state.user.data)
  const { messages } = chat ?? { messages: [] }

  const [msgInput, setMsgInput] = useState<string>('')


  useEffect(() => {
    updateScroll()
  }, [])

  useEffect(() => {
    updateScroll()
  }, [chat])

  const updateScroll = () => {
    let messagesArea = document.getElementById("messagesArea")
    if (messagesArea) {
      let totalScroll = messagesArea.scrollHeight ?? 0
      messagesArea.scrollTo(0, totalScroll)
    }
  }

  const handleMsgInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsgInput(e.target.value)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && chat && userData) {
      if (msgInput !== "") sendMessage()
    }
  }

  const sendMessage = async () => {
    const body = msgInput
    setMsgInput('')
    await Api.sendMessage({
      msgType: "text",
      msgBody: body,
      chat: chat,
      userId: userData?.id,
    })
    updateScroll()
  }


  return (
    <S.Container>
      <S.MessagesArea id="messagesArea">
        {messages.map((msg, k) => {
          let lastMessage = messages[k - 1]

          return (msg.from === userData?.id) ?
            <SendedMessage
              msg={msg}
              key={k}
              wDetail={lastMessage === undefined || lastMessage.from !== userData.id}
            />
            :
            <ReceivedMessage
              msg={msg}
              key={k}
              wDetail={lastMessage === undefined || lastMessage.from === userData?.id}
            />
        })}
      </S.MessagesArea>
      <S.NewMessageArea>
        <SmileIcon width={30} height={30} />
        <MediaIcon width={30} height={30} style={{ marginLeft: 15 }} />
        <S.Input
          placeholder="Digite sua mensagem..."
          value={msgInput}
          onChange={e => handleMsgInput(e)}
          onKeyUp={e => handleKeyDown(e)}
        />
        <SendIcon width={30} height={30} />
      </S.NewMessageArea>
    </S.Container>
  )

}


export default ChatArea