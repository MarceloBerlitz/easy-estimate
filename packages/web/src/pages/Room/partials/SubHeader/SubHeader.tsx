import { CopyOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';

import { ButtonsGroup } from '../../../../components/ButtonsGroup';
import { SubHeaderContainer } from './styles';
import { useCallback } from 'react';

type Props = {
  roomId: string;
  onLeave: () => void;
  onLinkCopied: () => void;
};

export const SubHeader = ({ roomId, onLeave, onLinkCopied }: Props) => {
  const copyLinkHandler = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    onLinkCopied();
  }, [onLinkCopied]);

  return (
    <SubHeaderContainer>
      <Typography.Title level={5}>Room ID: {roomId}</Typography.Title>
      <ButtonsGroup>
        <Button onClick={onLeave}>
          Leave <LogoutOutlined />
        </Button>
        <Button type="primary" onClick={copyLinkHandler}>
          Copy Room Link
          <CopyOutlined />
        </Button>
      </ButtonsGroup>
    </SubHeaderContainer>
  );
};
