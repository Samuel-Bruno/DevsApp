import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useStore } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../../api/api';
import getStateProperty from '../../redux/getStateProperty';
import * as S from './styled'


const SignUp = () => {

  const store = useStore()
  const navigation = useRef(useNavigate()).current
  const dispatch = useRef(useDispatch()).current

  const Api = useApi()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({ showing: false, msg: '' })


  useEffect(() => {
    let userState = getStateProperty(store, 'user')
    if (userState.isLogged) navigation('/')
  }, [store, navigation, dispatch])

  const handleNameInput = (t: string) => {
    if (error.showing) setError({ showing: false, msg: '' })
    setName(t)
  }

  const handleEmailInput = (t: string) => {
    if (error.showing) setError({ showing: false, msg: '' })
    setEmail(t)
  }

  const handlePassInput = (t: string, field: 'p1' | 'p2') => {
    if (error.showing) setError({ showing: false, msg: '' })
    switch (field) {
      case 'p1':
        setPassword(t)
        break
      case 'p2':
        setConfirmPassword(t)
        break
    }
  }

  const handleSubmit = async () => {

    if (name && email && confirmPassword && password) {
      if (password === confirmPassword) {
        setLoading(true)
        const subscribe = await Api.signup({ name, email, password })

        if (subscribe.success) {
          dispatch({
            type: 'SET_LOGGED',
            payload: { isLogged: true, userData: subscribe.user }
          })

          Api.saveToken(subscribe.user?.token as string)
          navigation('/')
        } else {
          let msg = ''

          switch (subscribe.error?.code) {
            case 'auth/email-already-in-use':
              msg = 'Este e-mail já está cadastrado'
              break
            case 'auth/invalid-email':
              msg = 'Digite um e-mail válido'
              break
            default:
              msg = 'Erro no cadastro. Tente novamente mais tarde'
              break
          }
          setError({ showing: true, msg })
          setLoading(false)
        }
      } else {
        setError({ showing: true, msg: 'Senhas não coincidem' })
      }
    } else {
      setError({ showing: true, msg: 'Preencha todos os campos' })
    }
  }


  return (
    <S.Container>
      <S.Main>
        <h1>DevsApp</h1>
        <p>
          Seu chat simples e objetivo, para se conectar com seus amigos.😁
        </p>
      </S.Main>
      <S.Aside>
        <h3>Cadastro</h3>
        <S.ErrorArea style={{ opacity: error.showing ? 1 : 0 }}>
          <span>{error.msg}</span>
        </S.ErrorArea>
        <S.Form onSubmit={e => e.preventDefault()}>
          <S.FormInput
            placeholder='Digite seu nome'
            value={name}
            onChange={e => handleNameInput(e.target.value)}
          />
          <S.FormInput
            placeholder='Digite seu email'
            value={email}
            onChange={e => handleEmailInput(e.target.value)}
          />
          <S.FormInput
            placeholder='Digite sua senha'
            value={password}
            onChange={e => handlePassInput(e.target.value, 'p1')}
            type={'password'}
          />
          <S.FormInput
            placeholder='Confirme sua senha'
            value={confirmPassword}
            onChange={e => handlePassInput(e.target.value, 'p2')}
            type={'password'}
          />
          <S.FormBtn
            onClick={handleSubmit}
            disabled={loading}
            style={{ opacity: !loading ? 1 : .5 }}
          >Cadastrar</S.FormBtn>
          <Link to={'/login'} id="link" >Já tem uma conta?</Link>
        </S.Form>
      </S.Aside>
      <S.Footer>
        <span>Designed and made by Samuel Bruno © 2022</span>
      </S.Footer>
    </S.Container>
  )

}


export default SignUp