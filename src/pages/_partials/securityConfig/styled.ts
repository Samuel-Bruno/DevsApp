import styled from "styled-components"


export const Container = styled.div`
  display:flex;
  flex-direction:column;
  height:100%;
  position:relative;
  margin-top:5px;
`

export const ShowFieldsToggler = styled.div`
  font-size:15px;
  font-weight:300;
  color:white;
  text-decoration:underline;
  cursor:pointer;
`

export const SaveBtn = styled.div`
  font-size:22px;
  font-weight:600;
  background-color:rgba(41, 190, 47, 1);
  border-radius:10px;
  display:flex;
  align-items:center;
  justify-content:center;
  width:fit-content;
  padding:.25em 1.5em;
  cursor:pointer;
  
  position:absolute;
  bottom:0;
  right:0;
`