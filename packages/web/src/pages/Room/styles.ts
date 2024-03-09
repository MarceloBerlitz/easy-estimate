import { Card } from 'antd';
import styled from 'styled-components';

export const CustomHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
`;

export const CustomCard = styled(Card)`
  padding: 2rem;
  > .ant-card-head {
    padding: 0;
    border: none;
    min-height: 0;
  }

  > .ant-card-body {
    padding: 2rem 0 0 0;
  }
`;
