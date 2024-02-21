import styled from 'styled-components';

export const VotesHelperWrapper = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
  }
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
  align-items: center;
  justify-content: start;
`;
