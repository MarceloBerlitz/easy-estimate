import styled from 'styled-components';

export const VotesHelperWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ParameterWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ParameterTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  align-items: baseline;
  justify-content: start;
  padding: 0 0 1rem 0;

  & > h3 {
    margin: 0;
  }
`;
