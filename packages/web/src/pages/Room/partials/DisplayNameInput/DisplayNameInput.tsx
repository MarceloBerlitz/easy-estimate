import React, { useMemo, useState } from 'react';

import { Button, Input, Space, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import { useRoom } from '../../../../hooks/Room/useRoom';
import { useSocket } from '../../../../hooks/Socket/useSocket';

type Props = {
  onJoin: (name: string) => void;
};

export const DisplayNameInput: React.FC<Props> = ({ onJoin }) => {
  const { voter } = useRoom();
  const { isLoading } = useSocket();
  const [nameState, setNameState] = useState(voter.name);

  const disabled = useMemo(() => {
    return isLoading || !nameState || !nameState.trim();
  }, [isLoading, nameState])

  return (
    <>
      <Typography.Title level={1}>Easy Estimate</Typography.Title>
      <span>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Insert your display name"
            value={nameState}
            onChange={(e) => setNameState(e.currentTarget.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !disabled) onJoin(nameState.trim());
            }}
            size="large"
          />
          <Button
            type="primary"
            disabled={disabled}
            onClick={() => onJoin(nameState.trim())}
            size="large"
            loading={isLoading}
          >
            Join session
            <ArrowRightOutlined />
          </Button>
        </Space.Compact>
      </span>
    </>
  );
};
