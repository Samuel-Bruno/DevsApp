import styled from 'styled-components'


export const Container = styled.div`
  display:flex;
  height:100vh;
  

  @media (max-width:840px) {
    flex-direction:column;

    body > #root > & {
      background-color:rgba(17, 27, 33, 1);
    }
  }
`

export const Main = styled.div`
  flex:1;
  
  h1 {
    margin:60px auto 0;

    text-align:center;
    font-size:48px;
    font-weight:bold;
  }

  p {
    width:100%;
    max-width:67%;
    margin:65px auto 0;
    white-space:pre-wrap;

    font-size:18px;
  }

  @media (max-width:840px) {
    display:none;

    p {
      max-width:80%;
      font-size:16px;
    }
  }

  @media (max-width:1000px) {
    p {
      max-width:80%;
      font-size:16px;
    }
  }
`

export const Aside = styled.aside`
  width:455px;
  background-color:rgba(17, 27, 33, 1);
  color:white;
  display:flex;
  flex-direction:column;
  justify-content:center;

  h3 {
    text-align:center;
    font-size:36px;
    font-weight:600;
    margin:0;
  }

  @media (max-width:840px) {
    flex:1;
    width:100%;
  }
`

export const Form = styled.form`
  display:flex;
  flex-direction:column;
  align-items:center;
  margin-top:45px;
  color:white;

  a#link {
    color:currentColor;
    font-size:15px;
    text-decoration:underline;
    cursor:pointer;
  }
`

export const FormInput = styled.input`
  width:355px;
  height:55px;
  background:none;
  outline:none;
  border:none;
  border-bottom:1px solid rgba(222, 108, 43, 1);
  margin-bottom:30px;

  text-indent:15px;
  font-size:18px;
  line-height:40px;
  color:white;
`

export const FormBtn = styled.button`
  padding:.5em 2.5em;
  margin:15px 0;
  background-color:rgba(222, 108, 43, 1);
  border:none;
  outline:none;
  
  font-size:24px;
  font-weight:600;
  color:white;

  cursor:pointer;
`

export const Footer = styled.footer`
  position:absolute;
  bottom:0;
  left:0;
  margin:30px 0 15px 45px;

  span {
    font-size:16px;
  }

  @media (max-width:1000px) {
    margin-left:5vw;
    
    span {
      font-size:15px;
    }
  }
  
  @media (max-width:840px) {
    color:white;
    position:relative;

    margin:0;
    padding:60px 0 15px 45px;
    background-color:rgba(17, 27, 33, 1);
  }
`