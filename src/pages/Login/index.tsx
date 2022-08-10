import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useApi from '../../api/api';
import getStateProperty from '../../redux/getStateProperty';
import * as S from './styled'

type Props = {
  signup?: boolean;
}


const Login = ({ signup = false }: Props) => {

  const store = useStore()
  const navigation = useNavigate()
  const dispatch = useDispatch()

  const Api = useApi()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  useEffect(() => {
    let userState = getStateProperty(store, 'user')
    if (userState.isLogged) {
      navigation('/')
    }
  }, [])

  const handleEmailInput = (t: string) => {
    // apply mask
    setEmail(t)
  }

  const handlePassInput = (t: string) => {
    // apply mask
    setPassword(t)
  }

  const handleSubmit = async () => {

    if (email && password) {
      const login = await Api.login(email, password)

      if (login.success) {

        // if (login.user?.chats && login.user.chats.length > 0) {
        //   let req = await Api.getUserChats(login.user.id)
        //   if (req.success) {
        //     dispatch({
        //       type: 'SET_CHATS',
        //       payload: {
        //         chats: req.chats
        //       }
        //     })
        //   }
        // }

        dispatch({
          type: 'SET_LOGGED',
          payload: {
            isLogged: true,
            userData: login.user
          }
        })

        Api.saveToken(login.user?.token as string)
        navigation('/')
      } else {
        console.log(login.error)  // switch cases
      }
    }
  }


  return (
    <S.Container>
      <S.Main>
        <h1>DevsApp</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat sapien arcu, eu blandit magna interdum quis. Aenean id eros maximus, interdum nibh non, consequat lacus.
          <br />
          <br />
          Phasellus pellentesque dolor lacus, sit amet consectetur erat vestibulum quis. Nam sit amet consectetur velit. Curabitur pulvinar velit eu eros maximus tincidunt.</p>
      </S.Main>
      <S.Aside>
        <h3>{signup === false ? 'Login' : 'Cadastro'}</h3>
        <S.Form onSubmit={e => e.preventDefault()}>
          <S.FormInput
            placeholder='Digite seu email'
            value={email}
            onChange={e => handleEmailInput(e.target.value)}
          />
          <S.FormInput
            placeholder='Digite sua senha'
            value={password}
            onChange={e => handlePassInput(e.target.value)}
            type={'password'}
          />
          <S.FormBtn onClick={handleSubmit}>Entrar</S.FormBtn>
          <S.LinkArea>{signup === false ? 'Não' : 'Já'} tem uma conta?</S.LinkArea>
        </S.Form>
      </S.Aside>
      <S.Footer>
        <span>Designed and made by Samuel Bruno © 2022</span>
      </S.Footer>
    </S.Container>
  )

}


export default Login