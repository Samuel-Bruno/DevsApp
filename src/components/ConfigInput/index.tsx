import React from 'react'
import * as S from './styled'

type Props = {
  type: string;
  title: string;
  placeholder: string;
  error?: {
    status: boolean;
    message: string;
  } | null;
  value: string;
  onChange: (t: string) => void;
  disabled?: boolean
}


const ConfigInput = ({ type, title, placeholder, error, value, onChange, disabled }: Props) => {


  return (
    <S.Container errorAlert={error?.status ?? false} >
      <S.Label>{title}</S.Label>
      <S.Input
        placeholder={placeholder}
        errorAlert={error?.status ?? false}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled ?? false}
        disabledStyle={disabled ?? false}
      />
      {error?.status === true &&
        <span className='errorMessage'>{error.message}</span>
      }
    </S.Container>
  )

}


export default ConfigInput