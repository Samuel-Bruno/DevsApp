import styled from "styled-components"


export const Container = styled.div`
  flex:1;
  position:relative;
  display:flex;
  flex-direction:column;
  width:100%;
  padding:0 10px 15px 15px;

  color:white;

  body < .root < & {
    background-color:rgba(21, 45, 58, 1);
  }
`

export const MessagesArea = styled.div`
  flex:1;
  display:flex;
  flex-direction:column;
  overflow-y:auto;
  padding:0 10px;
  margin-top:10px;
`

export const EmojiArea = styled.div`
  margin-top:10px;
  overflow:hidden;
  transition:all ease .3s;

  aside.emoji-picker-react {
    width:auto;

    nav.emoji-categories {
      margin:5px 22px 5px 15px;
      padding:0;
      background-color:rgba(21,45,58,1);

      button svg {
        fill: white;
      }
    }
    
    .content-wrapper-epr::before {
      content:'';
    }
    
    .emoji-group::before {
      background:rgba(21,45,58,1);
      padding-left:5px;
    }
  }
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

  #mediaArea input {
    display:none;
  }
`

export const MediaForm = styled.form`
  display:flex;
  justify-content:center;
  align-items:center;

  label {
    display:flex;
    align-items:center;
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

export const PhotosPreview = styled.div<{ show: boolean }>`
  display:${p => p.show ? 'flex' : 'none'};
  flex-direction:column;
  justify-content:center;
  align-items:center;
  background:rgba(21, 45, 58, 1);
  position:absolute;
  top:0;
  bottom:0;
  right:0;
  width:100%;
`

export const ButtonsArea = styled.div`
  display:flex;
  margin-top:100px;
  gap:60px;
`

export const CancelPhotoBtn = styled.button`
  font-size:18px;
  padding: .5em 2em;
  border-radius:5px;
  background-color:rgba(255,255,255,.2);
  color:white;
  border:none;
  outline:none;
  cursor:pointer;
`

export const SendPhotoBtn = styled.button`
  font-size:18px;
  padding: .5em 2em;
  border-radius:5px;
  background-color:rgba(0,0,0,.4);
  color:white;
  border:none;
  outline:none;
  cursor:pointer;
`