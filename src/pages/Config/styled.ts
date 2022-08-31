import styled from "styled-components"


export const Container = styled.div`
  min-height:100vh;
  background-color:rgba(17, 27, 33, 1);
  display:flex;
  flex-direction:column;
  color:white;
  
  body > #root > & {
    overflow:auto;
  }
`

export const Header = styled.div`
  display:flex;
  align-items:center;
  padding:25px 30px 0;

  a {
    display:flex;
    align-items:center;
    cursor:pointer;
    color:white;
    text-decoration:none;
  
    span {
      font-size:20px;
      font-weight:500;
      margin-left:10px;
    }
  }
`

export const BackArea = styled.div`
  display:flex;
  align-items:center;
  cursor:pointer;

  span {
    font-size:20px;
    font-weight:500;
    margin-left:10px;
  }
`

export const MainArea = styled.div`
  flex:1;
  display:flex;
  padding:45px 120px 100px 45px;
`

export const Menu = styled.div`
  width:100%;
  max-width:300px;
  border-right:3px solid rgba(222, 108, 43, 1);
`

export const ShowInfoArea = styled.div`
  padding-left:45px;
  width:100%;
`