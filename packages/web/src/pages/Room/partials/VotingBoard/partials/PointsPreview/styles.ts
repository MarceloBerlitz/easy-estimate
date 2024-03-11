import styled from 'styled-components';

export const PointsPreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* align-items: baseline; */
  justify-content: start;
  padding: 0 0 1rem 0;

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
  background-color: #fef8ec;
  > * {
    color: #ffbb36;
  }
`;
