import styled from 'styled-components'


export const Container = styled.div`
  display:flex;
  height:100vh;
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
`

export const Form = styled.form`
  display:flex;
  flex-direction:column;
  align-items:center;
  margin-top:45px;
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

export const LinkArea = styled.div`
  font-size:15px;
  text-decoration:underline;
  cursor:pointer;
`

export const Footer = styled.footer`
  position:absolute;
  bottom:0;
  left:0;
  margin:0 0 15px 45px;

  span {
    font-size:16px;
  }
`