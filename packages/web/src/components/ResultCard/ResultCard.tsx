import React from 'react';
import { BottomDot, ResultCardContentWrapper, ResultCardWrapper, TopDot } from './styles';

type Props = {
  children: React.ReactNode;
  visible: boolean;
};

export const ResultCard: React.FC<Props> = ({ children, visible }) => {
  return (
    <ResultCardWrapper>
      <TopDot visible={visible} />
      <ResultCardContentWrapper>{children}</ResultCardContentWrapper>
      <BottomDot visible={visible} />
    </ResultCardWrapper>
  );
};
