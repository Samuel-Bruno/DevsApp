import styled from "styled-components"


export const Container = styled.div<{wDetail:boolean}>`
  position:relative;
  background-color:rgba(48, 55, 59, 1);
  padding:8px 15px;
  color:white;
  border-radius:5px;
  border-top-right-radius:${p => p.wDetail ? 0 : 5};
  font-size:16px;
  font-weight:400;
  max-width:535px;
  width:fit-content;

  align-self:flex-end;
  margin-top:${p => p.wDetail === true ? '10' : '5'}px;

  .detail {
    display:${p => p.wDetail ? 'block': 'none'};
    position:absolute;
    top:0px;
    right:-9px;
  }
`