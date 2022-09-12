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

import Picker from 'emoji-picker-react'
import ChatAreaProps from "../../types/components/ChatArea"


const ChatArea = ({ chat, chatName }: ChatAreaProps) => {

  const Api = useApi()

  const userData = useSelector((state: RootState) => state.user.data)
  const { messages } = chat ?? { messages: [] }

  const [msgInput, setMsgInput] = useState<string>('')
  const [emojiAreaOpen, setEmojiAreaOpen] = useState(false)
  const [photosPreSend, setPhotosPreSend] = useState(false)
  const [selectedFile, setSelectedFile] = useState<null | File>(null)

  const chatUsable = chat.users.length > 1 && chat.users.includes(userData.id)


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

  const handleEmojiAreaToggler = () => {
    if (chatUsable) {
      setEmojiAreaOpen(!emojiAreaOpen)
      updateScroll()
    }
  }

  const handleEmojiPick = (emojiObj: any) => {
    setMsgInput(`${msgInput}${emojiObj.emoji as string}`)
  }

  const handleMsgInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsgInput(e.target.value)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.code === "Enter" || e.code === "NumpadEnter") && chat && userData) {
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

  const handlePhotoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const file = formData.get("images") as File

    if (file && file.size > 0) {
      setPhotosPreSend(true)
      let res = await Api.uploadPhoto(file)

      if (res instanceof Error) {
        alert("Erro ao enviar arquivo. Tente novamente mais tarde.")
      } else {
        Api.sendMessage({
          chat: chat,
          msgType: 'photo',
          userId: userData.id,
          msgBody: res.url
        })
        setPhotosPreSend(false)
      }
    }
  }

  const cancelImage = () => {
    setPhotosPreSend(false)
    setSelectedFile(null)
  }

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmojiAreaOpen(false)
    e.preventDefault()

    if (e.target.files && e.target.files?.length > 0) {
      setSelectedFile(e.target.files[0])
      setPhotosPreSend(true)
    }
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
      <>
        <S.EmojiArea
          style={{
            height: emojiAreaOpen ? '200px' : '0'
          }}
        >
          <Picker
            onEmojiClick={(e, emojiObj) => handleEmojiPick(emojiObj)}
            disableAutoFocus
            disableSearchBar
            groupNames={{
              smileys_people: 'Carinhas',
              animals_nature: 'Animais e natureza',
              food_drink: 'Bebidas e comidas',
              travel_places: 'Pontos turísticos',
              activities: 'Esportes',
              objects: 'Objetos',
              symbols: 'Símbolos',
              flags: 'Bandeiras',
              recently_used: 'Usados recentemente',
            }}
            pickerStyle={{
              boxShadow: 'none',
              background: 'rgba(17,27,33,1)',
              border: 'none',
            }}
          />
        </S.EmojiArea>
        <S.NewMessageArea style={{ opacity: chatUsable ? 1 : .5 }}>
          {chat.users.length > 1 &&
            <>
              <SmileIcon width={30} height={30} onClick={handleEmojiAreaToggler} />
              <S.MediaForm method="POST" onSubmit={handlePhotoSubmit} id="photoForm">
                <label htmlFor="photoPick" id="mediaArea">
                  <MediaIcon
                    width={30} height={30}
                    style={{ marginLeft: 15 }}
                  />
                  <input
                    id="photoPick"
                    type={"file"} name="images"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={e => handleImages(e)}
                    disabled={!chatUsable}
                  />
                </label>
                <S.PhotosPreview show={photosPreSend}>
                  {selectedFile
                    ? <img src={URL.createObjectURL(selectedFile)} width={400} height={"auto"} alt="" />
                    : "Nenhuma imagem selecionada"
                  }
                  <S.ButtonsArea>
                    <S.CancelPhotoBtn type="button" onClick={cancelImage}>Cancelar</S.CancelPhotoBtn>
                    <S.SendPhotoBtn type="submit">Enviar</S.SendPhotoBtn>
                  </S.ButtonsArea>
                </S.PhotosPreview>
              </S.MediaForm>
              <S.Input
                autoFocus
                placeholder="Digite sua mensagem..."
                value={msgInput}
                onChange={e => handleMsgInput(e)}
                onKeyUp={e => handleKeyDown(e)}
                disabled={!chatUsable}
              />
              <SendIcon width={30} height={30} onClick={() => { if (msgInput !== "") sendMessage() }} />
            </>
          }
          {
            chat.users.length === 1 &&
            <>
              {`Chat desativado pois ${chatName} saiu do chat.`}
            </>
          }
        </S.NewMessageArea>
      </>

    </S.Container >
  )

}


export default ChatArea