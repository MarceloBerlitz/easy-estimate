import React from 'react';
import { Circle, IndicatorContainer } from './styles';

type OnlineIndicatorProps = {
  isOnline: boolean;
  children: React.ReactNode;
};

export const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({ isOnline, children }) => {
  return (
    <IndicatorContainer>
      <Circle $isOnline={isOnline} />
      <div>{children}</div>
    </IndicatorContainer>
  );
};
