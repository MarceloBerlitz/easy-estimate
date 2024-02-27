import React, { PropsWithChildren } from 'react';

import { ContainerWrapper } from './styles';

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return <ContainerWrapper>{children}</ContainerWrapper>;
};
