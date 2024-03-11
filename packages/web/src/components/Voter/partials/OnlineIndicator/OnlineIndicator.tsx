import React from 'react';

import { Tooltip } from 'antd';

import { Circle, IndicatorContainer } from './styles';

type OnlineIndicatorProps = {
  isOnline: boolean;
};

export const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({ isOnline }) => {
  return (
    <IndicatorContainer>
      <Tooltip title={isOnline ? 'online' : 'offline'}>
        <Circle $isOnline={isOnline} />
      </Tooltip>
    </IndicatorContainer>
  );
};
