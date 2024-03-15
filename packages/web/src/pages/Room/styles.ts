import { Card } from 'antd';

import styled from 'styled-components';

export const CustomHeader = styled(Card)`
  display: block;
  padding: 1rem;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;

  > .ant-card-body {
    padding: 0;

    > div {
      max-width: 1200px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
    }
  }
`;

export const CustomCard = styled(Card)`
  padding: 2rem;
  border-radius: 4px;

  > .ant-card-head {
    padding: 0;
    border: none;
    min-height: 0;
  }

  > .ant-card-body {
    padding: 2rem 0 0 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const RoomWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  min-height: 90vh;
  padding: 1rem 0;
  @media (max-width: 1230px) {
    padding: 1rem;
  }
`;
