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