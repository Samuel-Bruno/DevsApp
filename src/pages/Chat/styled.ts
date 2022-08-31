import styled from "styled-components"


export const Container = styled.div`
  display:flex;
  background-color:rgba(21, 45, 58, 1);
  height:100vh;
  width:100%;
  transition:margin-left .3s, left .3s;


  @media (max-width:840px) {
    & {
      width:auto;
      margin-left:0;
    }

    &.mobileClosed {
      margin-left:-370px;
    }
  }

  body > #root > & {
    overflow: hidden;
  }
`

export const BgLeft = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,.7);
  position: absolute;
  z-index: 10;
  margin-left: 0;
  
  transition:background-color 1s;

  div.mobileClosed > & {
    position:relative;
    max-width:370px;
    background-color:rgba(0,0,0,0);
  }
  
  div.mobileClosed > & > div > div > #chatIndicator > path {
    fill:transparent;
  }
  
`

export const Left = styled.div`
  width:100%;
  max-width:370px;
  background-color:rgba(17, 27, 33, 1);
  position:relative;

  @media (max-width:840px) {
    & {
      z-index:99;
      width:370px;
      height:100%;
      position:absolute;
      display:flex;
      flex-direction:column;
    }

    div.mobileClosed > & {
      position:relative;
    }
  }
`

export const UserArea = styled.div<{ svgInvertion: boolean }>`
  color:white;
  margin:15px;
  padding:0 15px 15px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid rgba(222, 108, 43, 1);
  position:relative;
  
  svg {
    transition:transform .4s;
    cursor:pointer;
    transform:rotate(${p => p.svgInvertion ? 180 : 0}deg);
  }
`

export const InfoArea = styled.div`
  display:flex;
  align-items:center;
`

export const UserPhoto = styled.div<{ src: string }>`
  width:60px;
  height:60px;
  border-radius:50%;
  background-image:url(${p => p.src});
  background-size:cover;
  background-position:center;
`

export const UserInfo = styled.div`
  margin-left:15px;
  display:flex;
  flex-direction:column;
`

export const UserName = styled.span`
  font-size:18px;
  font-weight:500;
  margin:0;
`

export const UserEmail = styled.span`
  font-size:14px;
  font-weight:400;
  font-style:italic;
  margin:0;
`


export const SearchArea = styled.div`
  width:100%;
  max-width:320px;
  background-color:rgba(222, 108, 43, 1);
  margin:auto;
  border-radius:10px;
  display:flex;
  align-items:center;
  padding:8px 15px;

  svg {
    cursor:pointer;
    margin-left:15px;
  }
`

export const SearchInput = styled.input`
  height:24px;
  background:none;
  border:none;
  outline:none;
  flex:1;

  color:white;

  &::placeholder {
    color:rgba(255, 255, 255, .8);
  }
`

export const ChatsArea = styled.div`
  display:flex;
  flex-direction:column;
  width:100%;
  max-width:calc(100% - 20px);
  margin:30px 10px;
  flex:1;
  overflow-y:auto;
  overflow-x:visible;

  color:white;
  
  svg#chatIndicator {
    position:absolute;
    z-index:10;
    right:-20px;
    margin-top:15px;
  }

`

export const OpenedChatArea = styled.div`
  margin-bottom:30px;
`

export const OthersChatsArea = styled.div``

export const UserOptions = styled.div`
  width:215px;
  display:none;
  flex-direction:column;
  background-color:rgba(21, 45, 58, 1);
  box-shadow:0 5px 14px rgba(0, 0, 0, .5);
  position:absolute;
  border-radius:5px;
  overflow:hidden;
  
  right:25px;
  top:50px;
  color:white;

  &.active {
    display:flex;
  }

  a {
    width:100%;
    display:flex;
    align-items:center;
    padding:8px 10px;
    cursor:pointer;
    transition: background-color .3s;
    text-decoration:none;
    color:currentColor;
    
  
    span {
      margin-left:10px;
    }
  
    &:hover {
      background-color:rgba(57, 89, 110, .43);
    }
  }
`

export const UserOptionsOption = styled.div`
  width:100%;
  display:flex;
  align-items:center;
  padding:8px 10px;
  cursor:pointer;
  transition: background-color .3s;

  span {
    margin-left:10px;
  }

  &:hover {
    background-color:rgba(57, 89, 110, .43);
  }
`

export const AddChatBtn = styled.div`
  position:absolute;
  bottom:15px;
  right:30px;
  background-color:rgba(222, 108, 43, 1);
  width:50px;
  height:50px;
  border-radius:25px;
  box-shadow:0 5px 14px rgba(0, 0, 0, .5);
  overflow:hidden;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  transition:width .5s, height .5s;
  transition-delay: 0s;
  padding:15px;

  &.opened {
    width:280px;
    height:145px;
    transition-delay: 0;

    .addChatBtn {
      left:15px;

      svg {
        transform: rotate(135deg);
      }

      span {
        width:80px;
      }
    }

    .confirmAddChatBtn {
      height:30px;
      padding:0 2em;
      transition-delay:unset;
    }
  }
`

export const AddChatBtnInputArea = styled.div`
  width:100%;
  color:white;
  font-size:16px;
  position:absolute;
  bottom:80px;
  padding:0 15px;
`

export const AddChatBtnEmailInput = styled.input`
  background: rgba(255, 255, 255, .2);
  border:none;
  outline:none;
  padding:5px;
  border-radius:5px;
  width:100%;
  
  font-size:13px;
  font-weight:300;
  color:white;

  &::placeholder {
    color:white;
  }
`

export const AddChatBtnBtnsArea = styled.div`
  width:100%;
  height:40px;
  display:flex;
  align-items:center;
  justify-content:flex-end;
  position:absolute;
  bottom:6px;
  padding:0 15px;
`

export const CancelBtn = styled.div`
  color:white;
  display:flex;
  align-items:center;

  position:absolute;
  transition:left .3s;
  left:13px;
  cursor:pointer;

  svg {
    transition:transform .9s;
  }

  span {
    margin-left: 5px;
    overflow:hidden;
    width:0;

    transition:width .5s;
  }
`
export const ConfirmBtn = styled.div`
  font-size:13px;
  font-weight:500;
  color:white;
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:5px;
  background-color:rgba(21, 45, 58, 1);
  cursor:pointer;
  overflow:hidden;

  height:0;
  padding:0;

  transition: height .2s, padding .2s;

  span {
    margin-left: 5px;
  }
`

export const AreaToggler = styled.div`
  display:none;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  position:absolute;
  right:-40px;
  top:10px;
  gap:5px;
  cursor:pointer;

  span {
    width:30px;
    height:5px;
    border-radius:3px;
    background-color:rgba(222, 108, 43, 1);
    
    transition:transform .3s, opacity .3s;
  }
  
  &.active span:nth-child(1) {
    transform: rotate(45deg) translateY(8px) translateX(9px);
  }

  &.active span:nth-child(2) {
    opacity:0;
  }
  
  &.active span:nth-child(3) {
    transform: rotate(-45deg) translateY(-6px) translateX(6px);
  }


  @media (max-width: 840px) {
    display:flex;
  }
`