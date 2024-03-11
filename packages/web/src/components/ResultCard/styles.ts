import styled from 'styled-components';

export const ResultCardWrapper = styled.div`
  width: 38px;
  height: 52px;
  box-shadow: 0px 1px 0px #f4f4f4;
  border-radius: 2px;
  border: 1px solid #e1e1e1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: white;

  > * * {
    color: #2e1a7b !important;
  }
`;

export const ResultCardContentWrapper = styled.div`
  display: flex;
  align-self: center;
  font-weight: bold;
  font-size: 14px;
`;

export const TopDot = styled.div<{ $visible: boolean }>`
  display: flex;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  align-self: flex-start;
  margin-top: 5px;
  margin-left: 5px;
  height: 2px;
  width: 2px;
  border-radius: 50%;
  background-color: #2e1a7b;
`;

export const BottomDot = styled.div<{ $visible: boolean }>`
  display: flex;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  align-self: flex-end;
  margin-bottom: 5px;
  margin-right: 5px;
  height: 2px;
  width: 2px;
  border-radius: 50%;
  background-color: #2e1a7b;
`;
