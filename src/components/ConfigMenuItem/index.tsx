import React from 'react'
import ConfigMenuItemProps from '../../types/components/ConfigMenuItem'
import * as S from './styled'


const ConfigMenuItem = ({ Icon, label, active, onClick }: ConfigMenuItemProps) => {


  return (
    <S.Container active={active} onClick={onClick}>
      <Icon width={24} height={24} />
      <span>{label}</span>
    </S.Container>
  )

}


export default ConfigMenuItem