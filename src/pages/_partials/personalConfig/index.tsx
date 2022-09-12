import React, { useState } from 'react'
import ConfigInput from '../../../components/ConfigInput'
import ConfigPhotoInput from '../../../components/ConfigPhotoInput'
import * as S from './styled'

import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import useApi from '../../../api/api'
import { useNavigate } from 'react-router-dom'
import PersonalConfigProps from '../../../types/pages/_partials/PersonalConfig'


const PersonalConfig = ({ name, setNameFn, email, setEmailFn, profilePhoto }: PersonalConfigProps) => {

  const Api = useApi()
  const navigation = useNavigate()
  const userData = useSelector((state: RootState) => state.user.data)

  const [choosedPhotoFile, setChoosedPhotoFile] = useState<File | null>(null)
  const [choosedPhotoUrl, setChoosedPhotoUrl] = useState<string | null>(null)


  const handleSaveChanges = async () => {
    if (name.trim().length > 0 && name !== userData.name && choosedPhotoFile !== null) {
      const reader = new FileReader()
      reader.addEventListener('load', e => {
        setChoosedPhotoUrl(e.target?.result as string)
      })
      reader.readAsDataURL(choosedPhotoFile)

      await Api.updateUser(userData.id, name, choosedPhotoFile)
    } else if (name.trim().length > 0 && name !== userData.name && choosedPhotoFile === null) {
      await Api.updateUser(userData.id, name)
    } else if (choosedPhotoFile !== null && (name.trim().length === 0 || name === userData.name)) {
      await Api.updateUser(userData.id, '', choosedPhotoFile)
    }

    navigation('/')
  }


  return (
    <S.Container>
      <ConfigInput
        type={'text'}
        title="Nome"
        placeholder="Digite seu nome..."
        value={name}
        onChange={setNameFn}
      />
      <ConfigInput
        type={'text'}
        title="Email"
        placeholder="Digite seu email..."
        value={email}
        onChange={setEmailFn}
        disabled
      />
      <ConfigPhotoInput
        title="Foto de perfil"
        img={profilePhoto}
        setChoosedPhotoFile={setChoosedPhotoFile}
        choosedPhotoUrl={choosedPhotoUrl}
        setChoosedPhotoUrl={setChoosedPhotoUrl}
      />
      <S.SaveBtn onClick={handleSaveChanges}>Salvar</S.SaveBtn>
    </S.Container>
  )

}


export default PersonalConfig