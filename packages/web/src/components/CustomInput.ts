import styled from 'styled-components';

export const CustomInput = styled.input<{ size?: 'small' | 'big' }>`
  padding: ${({ size }) => (size === 'big' ? '0.6rem' : '0.3rem')};
  height: ${({ size }) => (size === 'big' ? '3rem' : '2rem')};

  border-radius: 0;

  border: 1px solid grey;
  box-sizing: border-box;

  &:focus-visible {
    outline: 1px solid grey;
  }
`;
