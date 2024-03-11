import { CopyOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';

import { ButtonsGroup } from '../../../../components/ButtonsGroup';
import { SubHeaderContainer } from './styles';

type Props = {
  roomId: string;
  onLeave: () => void;
};

export const SubHeader = ({ roomId, onLeave }: Props) => {
  return (
    <SubHeaderContainer>
      <Typography.Title level={5}>Room ID: {roomId}</Typography.Title>
      <ButtonsGroup>
        <Button onClick={onLeave}>
          Leave <LogoutOutlined />
        </Button>
        <Button type="primary" onClick={() => navigator.clipboard.writeText(window.location.href)}>
          Copy Room Link
          <CopyOutlined />
        </Button>
      </ButtonsGroup>
    </SubHeaderContainer>
  );
};
