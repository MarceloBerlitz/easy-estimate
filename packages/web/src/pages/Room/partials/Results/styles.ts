import { Table } from 'antd';

import styled from 'styled-components';

export const StyledTable = styled(Table)<any>`
  th {
    color: #7e7e7e !important;
    background: none !important;
    font-weight: normal !important;
    &::before {
      background: none !important;
    }
  }

  * > tbody :last-child > * {
    border-bottom: none !important;
  }

  * > .ant-table-cell {
    padding: 0.5rem 1rem !important;
  }
`;
