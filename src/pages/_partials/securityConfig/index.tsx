import React, { useState } from 'react'
import ConfigInput from '../../../components/ConfigInput'
import ConfigPhotoInput from '../../../components/ConfigPhotoInput'
import * as S from './styled'


const SecurityConfig = () => {

  const [showingFields, setShowingFields] = useState(false)
  const [fieldsErrors, setFieldsErrors] = useState({
    actual: { status: false, message: 'Senha incorreta' },
    new: { status: false, message: 'Novas senhas não coincidem' },
    confirmNew: { status: false, message: 'Novas senhas não coincidem' },
  })


  return (
    <S.Container>
      {showingFields === false &&
        <S.ShowFieldsToggler
          onClick={() => setShowingFields(!showingFields)}
        >Alterar senha</S.ShowFieldsToggler>
      }

      {showingFields &&
        <>
          <ConfigInput
            type={'password'}
            title="Senha atual"
            placeholder="Digite sua senha"
            error={fieldsErrors.actual}
          />
          <ConfigInput
            type={'password'}
            title="Nova senha"
            placeholder="Digite sua nova senha"
            error={fieldsErrors.new}
          />
          <ConfigInput
            type={'password'}
            title="Confirme nova senha"
            placeholder="Repita a nova senha"
            error={fieldsErrors.confirmNew}
          />
          <S.SaveBtn>Alterar senha</S.SaveBtn>
        </>
      }
    </S.Container>
  )

}


export default SecurityConfig