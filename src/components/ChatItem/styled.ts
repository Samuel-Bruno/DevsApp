import styled from "styled-components"


export const Box = styled.div`
  display:flex;
  position:relative;
  padding:10px 15px;
  margin-bottom:5px;
  border-radius:5px;
  margin-right:10px;
  overflow:hidden;

  flex-wrap:nowrap;
  min-width:0;

  cursor:pointer;

  transition: background-color .3s;
  
  &:hover,
  &.active {
    background-color:rgba(21, 45, 58, 0.5);
  }

  &:hover {
    .optionsArea {
      display:flex;
    }
  }
`

export const ChatPhoto = styled.div<{ bgImg: string }>`
  min-width:50px;
  height:50px;
  border-radius:50%;
  background-image:url(${p => p.bgImg});
  background-size:cover;
  background-position:center;
`

export const ChatInfo = styled.div`
  margin-left:15px;
  width:100%;
  max-width:calc(100% - 50px);
  padding-right:15px;
`

export const ChatName = styled.div`
  font-size:18px;
  font-weight:600;
`

export const ChatLastMessage = styled.div`
  font-size:14px;
  font-weight:300;
  width:100%;

  p {
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    margin:0;

    svg path {
      fill:rgba(200,200,200,.8);
    }
  }
`

export const OptionsArea = styled.div`
  justify-content:center;
  align-items:flex-start;
  flex-direction:row-reverse;
  display:none;
  position:absolute;
  padding:5px 2px;
  right:5px;
  top:5px;
  z-index:20;

  svg {
    transition:background-color .3s;
  
    &:hover {
      background-color:rgba(57, 89, 110, .43);
    }
  }
  
`

export const ChatOptionsList = styled.div`
  display:none;
  flex-direction:column;
  margin-right:10px;
  position:relative;

  &.active {
    display:flex;
  }
`

export const ChatOption = styled.div`
  position:absolute;
  width:120px;
  display:flex;
  align-items:center;
  padding:4px 2px;
  cursor:pointer;
  transition: background-color .3s;
  box-shadow:0 5px 14px rgba(0, 0, 0, .5);
  background-color:rgba(57, 89, 110, .43);
  right:0;

  span {
    margin-left:10px;
  }

  &:hover {
    background-color:rgba(57, 89, 110, .43);
  }
`