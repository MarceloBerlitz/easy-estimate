import styled from 'styled-components';

export const CustomButton = styled.button<{ size?: 'small' | 'big' }>`
  padding: ${({ size }) => (size === 'big' ? '0.6rem' : '0.3rem')};
  height: ${({ size }) => (size === 'big' ? '3rem' : '2rem')};

  border-radius: 0;

  border: 1px solid grey;
  box-sizing: border-box;
  cursor: pointer;
  background-color: #737beb;
  color: white;

  &:hover {
    background-color: #6970d6;
  }

  &:active {
    background-color: #5f66c2;
  }
`;
