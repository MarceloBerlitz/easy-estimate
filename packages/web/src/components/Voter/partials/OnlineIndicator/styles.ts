import styled from 'styled-components';

export const Circle = styled.div<{ $isOnline: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $isOnline }) => ($isOnline ? '#71bb71' : 'grey')};
  margin-left: -32px;
  margin-top: 22px;
  z-index: 100;
`;

export const IndicatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  margin: 10px;
`;
