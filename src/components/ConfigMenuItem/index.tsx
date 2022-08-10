import React from 'react'
import * as S from './styled'

type Props = {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  label: string;
  active: boolean;
  onClick: () => void
}


const ConfigMenuItem = ({ Icon, label, active, onClick }: Props) => {



  return (
    <S.Container active={active} onClick={onClick}>
      <Icon width={24} height={24} />
      <span>{label}</span>
    </S.Container>
  )

}


export default ConfigMenuItem