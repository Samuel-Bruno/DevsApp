import styled from "styled-components"


export const Container = styled.div<{ wDetail: boolean }>`
  position:relative;
  background-color:rgba(17, 27, 33, 1);
  padding:8px 15px;
  color:white;
  border-radius:${p => p.wDetail === true ? '0' : '5'}px 5px 5px 5px;
  font-size:16px;
  font-weight:400;
  max-width:535px;
  width:fit-content;

  align-self:flex-start;
  margin-top:${p => p.wDetail === true ? '10' : '5'}px;

  .detail {
    display:${p => p.wDetail ? 'block' : 'none'};
    position:absolute;
    top:0;
    left:-9px;
  }
`