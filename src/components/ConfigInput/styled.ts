import styled from "styled-components"


export const Container = styled.div<{ errorAlert: boolean }>`
  display:flex;
  flex-direction:column;
  margin-bottom:25px;
  height:95px;

  .errorMessage {
    opacity:${p => p.errorAlert ? 1 : 0};
    font-size:12px;
    font-weight:300;
    margin-left:10px;
    color:red;
    transition:opacity .3s;
  }
`

export const Label = styled.span`
  font-size:22px;
  font-weight:600;
`

export const Input = styled.input<{ errorAlert: boolean; disabledStyle: boolean }>`
  width:100%;
  max-width:300px;
  font-size:16px;
  font-weight:400;
  color:${p => p.errorAlert ? 'red' : 'white'};
  background:rgba(21, 45, 58, 0.5);
  outline:none;
  border:1px solid ${p => p.errorAlert ? 'red' : 'transparent'};
  border-radius:5px;
  padding:8px 10px 8px 9px;
  opacity:${p => p.disabledStyle === true ? '.6' : '1'};
`