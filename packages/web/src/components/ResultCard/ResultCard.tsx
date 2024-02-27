import React from 'react';
import { BottomDot, ResultCardContentWrapper, ResultCardWrapper, TopDot } from './styles';
import Typography from 'antd/es/typography/Typography';

type Props = {
  children: React.ReactNode;
  visible: boolean;
};

export const ResultCard: React.FC<Props> = ({ children, visible }) => {
  return (
    <ResultCardWrapper>
      <TopDot $visible={visible} />
      <ResultCardContentWrapper>
        <Typography>{children}</Typography>
      </ResultCardContentWrapper>
      <BottomDot $visible={visible} />
    </ResultCardWrapper>
  );
};
