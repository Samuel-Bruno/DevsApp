import styled from "styled-components"


export const Container = styled.div<{active:boolean}>`
  display:flex;
  align-items:center;
  color:${p => p.active === true ? 'white' : 'rgba(255, 255, 255, .5)'};
  margin-top:15px;
  cursor:pointer;
  transition:color .4s;
  
  span {
    margin-left:15px;
    font-size:20px;
  }

  &:hover {
    color:white;
  }
`