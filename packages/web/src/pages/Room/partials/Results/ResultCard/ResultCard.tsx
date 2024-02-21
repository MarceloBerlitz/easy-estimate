import React from 'react';
import { ResultCardWrapper } from './styles';

type Props = {
  children: React.ReactNode;
};

export const ResultCard: React.FC<Props> = ({ children }) => {
  return <ResultCardWrapper>{children}</ResultCardWrapper>;
};
