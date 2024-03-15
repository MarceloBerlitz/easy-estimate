import styled from 'styled-components';

export const ContainerWrapper = styled.div`
  margin: 0 auto;
  /* max-width: 1200px; */
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  /* padding: 1rem; */
  display: flex;

  & > * {
    width: 100%;
  }
`;
