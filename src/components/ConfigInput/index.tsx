import React from 'react'
import ConfigInputProps from '../../types/components/ConfigInput'
import * as S from './styled'


const ConfigInput = ({ type, title, placeholder, error, value, onChange, disabled }: ConfigInputProps) => {


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