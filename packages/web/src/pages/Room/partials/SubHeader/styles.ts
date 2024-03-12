import styled from 'styled-components';

export const SubHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1rem 0;
  gap: 1rem;

  > * {
    margin: 0;
    width: fit-content;
  }

  @media (max-width: 700px) {
    flex-direction: column-reverse;
    align-items: center;
    /* > div {
      align-self: end;
    } */
  }
`;
