import React from 'react'
import * as S from './styled'

type Props = {
  type: string;
  title: string;
  placeholder: string;
  error?: {
    status: boolean;
    message: string;
  } | null
}


const ConfigInput = ({ type, title, placeholder, error }: Props) => {


  return (
    <S.Container errorAlert={error?.status ?? false} >
      <S.Label>{title}</S.Label>
      <S.Input
        placeholder={placeholder}
        errorAlert={error?.status ?? false}
        type={type}
      />
      {error?.status === true &&
        <span className='errorMessage'>{error.message}</span>
      }
    </S.Container>
  )

}


export default ConfigInput