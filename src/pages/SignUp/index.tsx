import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../../api/api';
import getStateProperty from '../../redux/getStateProperty';
import * as S from './styled'


const SignUp = () => {

  const store = useStore()
  const navigation = useNavigate()
  const dispatch = useDispatch()

  const Api = useApi()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  useEffect(() => {
    let userState = getStateProperty(store, 'user')
    if (userState.isLogged) {
      navigation('/')
    }
  }, [])

  const handleNameInput = (t: string) => {
    // apply mask
    setName(t)
  }
  const handleEmailInput = (t: string) => {
    // apply mask
    setEmail(t)
  }

  const handlePassInput = (t: string, field: 'p1' | 'p2') => {
    // apply mask
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

    if (name && email && confirmPassword && password === confirmPassword) {
      const subscribe = await Api.signup({ name, email, password })

      if (subscribe.success) {
        dispatch({
          type: 'SET_LOGGED',
          payload: {
            isLogged: true,
            userData: subscribe.user
          }
        })

        Api.saveToken(subscribe.user?.token as string)
        navigation('/')
      } else {
        console.log("Erro no cadastro — ", subscribe.error)
      }
    } else {
      alert("Preencha todos os campos")
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
        <h3>Cadastro</h3>
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
          <S.FormBtn onClick={handleSubmit}>Cadastrar</S.FormBtn>
          <Link
            to={'/login'}
            id="link"
          >Já tem uma conta?</Link>
        </S.Form>
      </S.Aside>
      <S.Footer>
        <span>Designed and made by Samuel Bruno © 2022</span>
      </S.Footer>
    </S.Container>
  )

}


export default SignUp