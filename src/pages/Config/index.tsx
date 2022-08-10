import React, { useState } from 'react'
import * as S from './styled'
import { ReactComponent as BackIcon } from '../../assets/icons/back.svg'
import ConfigMenuItem from '../../components/ConfigMenuItem'
import PersonalConfig from '../_partials/personalConfig'

import { ReactComponent as PersonalIcon } from '../../assets/icons/user.svg'
import { ReactComponent as SecurityIcon } from '../../assets/icons/security.svg'
import SecurityConfig from '../_partials/securityConfig'


const Config = () => {

  const [activeMenu, setActiveMenu] = useState('personal')


  return (
    <S.Container>
      <S.Header>
        <S.BackArea>
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
            onClick={()=>setActiveMenu('personal')}
          />
          <ConfigMenuItem
            Icon={SecurityIcon}
            label="Segurança"
            active={activeMenu === 'security'}
            onClick={()=>setActiveMenu('security')}
          />
        </S.Menu>
        <S.ShowInfoArea>
          {activeMenu === 'personal' && <PersonalConfig />}
          {activeMenu === 'security' && <SecurityConfig />}
        </S.ShowInfoArea>
      </S.MainArea>
    </S.Container>
  )

}


export default Config