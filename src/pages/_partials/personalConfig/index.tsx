import React from 'react'
import ConfigInput from '../../../components/ConfigInput'
import ConfigPhotoInput from '../../../components/ConfigPhotoInput'
import * as S from './styled'

import UserPhoto from '../../../assets/images/users/user1.webp'


const PersonalConfig = () => {


  return (
    <S.Container>
      <ConfigInput
        type={'text'}
        title="Nome"
        placeholder="Digite seu nome..."
      />
      <ConfigInput
        type={'text'}
        title="Email"
        placeholder="Digite seu email..."
      />
      <ConfigPhotoInput
        title="Foto de perfil"
        img={UserPhoto}
      />
      <S.SaveBtn>Salvar</S.SaveBtn>
    </S.Container>
  )
  
}


export default PersonalConfig