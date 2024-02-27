import React from 'react';
import { Circle, IndicatorContainer } from './styles';
import { Tooltip } from 'antd';

type OnlineIndicatorProps = {
  isOnline: boolean;
  children: React.ReactNode;
};

export const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({ isOnline, children }) => {
  return (
    <IndicatorContainer>
      <Tooltip title={isOnline ? 'online' : 'offline'}>
        <Circle $isOnline={isOnline} />
      </Tooltip>
      <div>{children}</div>
    </IndicatorContainer>
  );
};
