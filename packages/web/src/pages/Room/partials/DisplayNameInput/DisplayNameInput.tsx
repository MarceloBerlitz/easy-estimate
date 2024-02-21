import React, { useState } from 'react';

import { useRoom } from '../../../../hooks/Room/useRoom';
import { Button, Input, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

type Props = {
  onJoin: (name: string) => void;
};

export const DisplayNameInput: React.FC<Props> = ({ onJoin }) => {
  const { getSavedName } = useRoom();
  const [nameState, setNameState] = useState(getSavedName());

  return (
    <>
      <h1>Easy Estimate</h1>
      <span>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Insert your display name"
            value={nameState}
            onChange={(e) => setNameState(e.currentTarget.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') onJoin(nameState);
            }}
            size="large"
          />
          <Button
            type="primary"
            disabled={!nameState}
            onClick={() => onJoin(nameState)}
            size="large"
          >
            Join session
            <ArrowRightOutlined />
          </Button>
        </Space.Compact>
      </span>
    </>
  );
};
