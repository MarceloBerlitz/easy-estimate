import styled from 'styled-components';

export const VotesHelperWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ParameterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0 0 1rem 0;

  > * {
    flex: 1 1;
  }

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: start;
  }
`;

export const ParameterTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* align-items: baseline; */
  justify-content: start;
  padding: 0;

  & > h5 {
    margin: 0;
    text-transform: capitalize;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
  }

  & > article {
    color: #8c8c8c;
    font-size: 12px;
  }
`;

export const IconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  background-color: #5636ff33;
  > * {
    color: #5636ff;
  }
`;
