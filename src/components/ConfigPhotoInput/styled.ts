import styled from "styled-components"


export const Container = styled.div`
  display:flex;
  flex-direction:column;
  margin-bottom:25px;
  width:100%;
  max-width:200px;
`

export const Label = styled.span`
  font-size:24px;
  font-weight:600;
`

export const Img = styled.div<{src:string}>`
  min-width:60px;
  height:60px;
  border-radius:50%;
  background-image:url(${p => p.src});
  background-size:cover;
  background-position:center;
  margin:20px auto 10px;
`

export const PhotoLabel = styled.label`
  font-size:15px;
  font-weight:300;
  color:white;
  text-decoration:underline;
  cursor:pointer;
  text-align:center;
`

export const Input = styled.input`
  display:none;
`