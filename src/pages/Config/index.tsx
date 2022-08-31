import React, { useEffect, useState } from 'react'
import * as S from './styled'
import { ReactComponent as BackIcon } from '../../assets/icons/back.svg'
import ConfigMenuItem from '../../components/ConfigMenuItem'
import PersonalConfig from '../_partials/personalConfig'

import { ReactComponent as PersonalIcon } from '../../assets/icons/user.svg'
import { ReactComponent as SecurityIcon } from '../../assets/icons/security.svg'
import SecurityConfig from '../_partials/securityConfig'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { Link, useNavigate } from 'react-router-dom'


const Config = () => {

  const userData = useSelector((state: RootState) => state.user.data)
  const navigation = useNavigate()

  const [activeMenu, setActiveMenu] = useState('personal')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [actualPass, setActualPass] = useState('')
  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')

  useEffect(() => {
    setName(userData.name)
    setEmail(userData.email)
  }, [])

  const backPage = () => {
    navigation(-1)
  }


  return (
    <S.Container>
      <S.Header>
        <S.BackArea onClick={backPage}>
          <BackIcon width={40} height={40} />
          <span>Voltar</span>
        </S.BackArea>
      </S.Header>
      <S.MainArea>
        <S.Menu>
          <ConfigMenuItem
            Icon={PersonalIcon}
            label="Informações Pessoais"
            active={activeMenu === 'personal'}
            onClick={() => setActiveMenu('personal')}
          />
          <ConfigMenuItem
            Icon={SecurityIcon}
            label="Segurança"
            active={activeMenu === 'security'}
            onClick={() => setActiveMenu('security')}
          />
        </S.Menu>
        <S.ShowInfoArea>
          {activeMenu === 'personal' && <PersonalConfig
            email={email}
            name={name}
            profilePhoto={userData.avatar as string}
            setNameFn={setName}
            setEmailFn={setEmail}
          />}
          {activeMenu === 'security' && <SecurityConfig
            actualPass={actualPass}
            setActualPassFn={setActualPass}
            pass={pass}
            setPassFn={setPass}
            pass2={pass2}
            setPass2Fn={setPass2}
          />}
        </S.ShowInfoArea>
      </S.MainArea>
    </S.Container>
  )

}


export default Config