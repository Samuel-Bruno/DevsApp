import React from 'react'
import ConfigPhotoInputProps from '../../types/components/ConfigPhotoInput'
import * as S from './styled'


const ConfigPhotoInput = ({
  title,
  img,
  setChoosedPhotoFile,
  choosedPhotoUrl,
  setChoosedPhotoUrl,
}: ConfigPhotoInputProps) => {

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target
    if (el.files !== null) {
      const file = el.files[0]
      if (file) {
        setChoosedPhotoFile(file)
        const reader = new FileReader()

        reader.addEventListener('load', e => {
          setChoosedPhotoUrl(e.target?.result as string)
        })

        reader.readAsDataURL(file)
      }
    }
  }


  return (
    <S.Container>
      <S.Label>{title}</S.Label>
      <S.Img src={choosedPhotoUrl === null ? img : choosedPhotoUrl} />
      <S.PhotoLabel htmlFor="photoInput">Escolher outra foto</S.PhotoLabel>
      <S.Input type={'file'} accept="image/*" id="photoInput" onChange={pickPhoto} />
    </S.Container>
  )

}


export default ConfigPhotoInput