import styled from 'styled-components';

export const ResultCardWrapper = styled.div`
  width: 25px;
  height: 35px;
  box-shadow: 1px 1px 3px grey;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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
  margin-top: 3px;
  margin-left: 3px;
  height: 3px;
  width: 3px;
  border-radius: 50%;
  background-color: black;
`;

export const BottomDot = styled.div<{ $visible: boolean }>`
  display: flex;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  align-self: flex-end;
  margin-bottom: 3px;
  margin-right: 3px;
  height: 3px;
  width: 3px;
  border-radius: 50%;
  background-color: black;
`;
