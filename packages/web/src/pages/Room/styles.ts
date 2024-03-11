import { Card } from 'antd';

import styled from 'styled-components';

export const CustomHeader = styled(Card)`
  display: block;
  padding: 0.8rem 0;
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
`;
