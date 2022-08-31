import React from 'react'
import * as S from './styled'

type Props = {
  title: string;
  img: string;
  choosedPhotoFile: File | null;
  setChoosedPhotoFile: (f: File) => void
  choosedPhotoUrl: string | null;
  setChoosedPhotoUrl: (t: string) => void;
}


const ConfigPhotoInput = ({
  title,
  img,
  choosedPhotoFile,
  setChoosedPhotoFile,
  choosedPhotoUrl,
  setChoosedPhotoUrl,
}: Props) => {

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