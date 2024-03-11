import { Radio } from 'antd';

import styled from 'styled-components';

export const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: row;
`;

export const StyledRadioButton = styled(Radio.Button)`
  min-width: 5.6rem;
  /* flex: 1 1 0px; */
  text-align: center;
  text-transform: capitalize;
  background-color: #f5f5f5;
  border: 1px solid #f0f0f0;
  border-left: 1px solid #d9d9d9;

  &:first-child {
    border-start-start-radius: 4px !important;
    border-end-start-radius: 4px !important;
    border-left: 1px solid #f0f0f0;
  }

  &:last-child {
    border-start-end-radius: 4px !important;
    border-end-end-radius: 4px !important;
  }

  &.ant-radio-button-wrapper-checked {
    /* box-shadow: inset 0px 0px 4px 1px #f5f5f5 !important; */
  }
`;
