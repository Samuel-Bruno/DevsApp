import styled from "styled-components"


export const Container = styled.div`
  flex:1;
  display:flex;
  flex-direction:column;
  width:100%;
  padding:0 10px 15px 15px;

  color:white;
`

export const MessagesArea = styled.div`
  flex:1;
  display:flex;
  flex-direction:column;
  overflow-y:auto;
  padding:0 10px;
  margin-top:10px;
`

export const NewMessageArea = styled.div`
  width:100%;
  display:flex;
  align-items:center;
  padding:5px 20px;
  background-color:rgba(17, 27, 33, 1);
  margin-top:15px;

  svg {
    cursor:pointer;
  }
`

export const Input = styled.input`
  flex:1;
  background:rgba(21, 45, 58, 0.5);
  border:none;
  outline:none;
  color:white;
  padding:10px;
  margin:0 20px 0 15px;

  font-size:15px;
  font-weight:300;
`