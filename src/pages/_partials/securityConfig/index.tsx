import { EmailAuthProvider, getAuth, reauthenticateWithCredential, User } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useApi from '../../../api/api'
import ConfigInput from '../../../components/ConfigInput'
import * as S from './styled'

type Props = {
  actualPass: string;
  setActualPassFn: (t: string) => void;
  pass: string;
  setPassFn: (t: string) => void;
  pass2: string;
  setPass2Fn: (t: string) => void;
}

const SecurityConfig = ({ actualPass, setActualPassFn, pass, setPassFn, pass2, setPass2Fn }: Props) => {

  const Api = useApi()
  const Auth = getAuth()
  const navigation = useNavigate()

  const [showingFields, setShowingFields] = useState(false)
  const [fieldsErrors, setFieldsErrors] = useState({
    actual: { status: false, message: 'Senha incorreta' },
    new: { status: false, message: 'Novas senhas não coincidem' },
    confirmNew: { status: false, message: 'Novas senhas não coincidem' },
  })

  const handlePassChange = async () => {
    resetErrors()

    const credential = EmailAuthProvider.credential(
      Auth.currentUser?.email as string,
      actualPass
    )
    reauthenticateWithCredential(Auth.currentUser as User, credential).then(() => {

      if (pass !== pass2) {
        setFieldsErrors({
          actual: { ...fieldsErrors.actual, status: false },
          new: { ...fieldsErrors.new, status: true },
          confirmNew: { ...fieldsErrors.confirmNew, status: true }
        })
        return
      }

      resetPassword(pass)
      navigation('/')
      return
    }).catch(error => {
      setFieldsErrors({
        ...fieldsErrors,
        actual: {
          ...fieldsErrors.actual, status: true
        }
      })
    })
  }

  const resetErrors = () => {
    setFieldsErrors({
      actual: { ...fieldsErrors.actual, status: false },
      new: { ...fieldsErrors.new, status: false },
      confirmNew: { ...fieldsErrors.confirmNew, status: false }
    })
  }

  const resetPassword = async (password: string) => {
    await Api.updatePassword(password)
    navigation('/')
  }


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
            value={actualPass}
            onChange={setActualPassFn}
          />
          <ConfigInput
            type={'password'}
            title="Nova senha"
            placeholder="Digite sua nova senha"
            error={fieldsErrors.new}
            value={pass}
            onChange={setPassFn}
          />
          <ConfigInput
            type={'password'}
            title="Confirme nova senha"
            placeholder="Repita a nova senha"
            error={fieldsErrors.confirmNew}
            value={pass2}
            onChange={setPass2Fn}
          />
          <S.SaveBtn onClick={handlePassChange}>Alterar senha</S.SaveBtn>
        </>
      }
    </S.Container>
  )

}


export default SecurityConfig