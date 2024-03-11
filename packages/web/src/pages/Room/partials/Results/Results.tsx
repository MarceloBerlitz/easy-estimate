import React, { useMemo } from 'react';

import {
  CheckOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Table, Typography } from 'antd';

import { VoterType } from '@ee/lib';

import { ButtonsGroup } from '../../../../components/ButtonsGroup';
import { ResultCard } from '../../../../components/ResultCard/ResultCard';
import { useRoom } from '../../../../hooks/Room/useRoom';
import { CustomCard } from '../../styles';
import { OnlineIndicator } from './partials/OnlineIndicator/OnlineIndicator';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string, other: VoterType) => (
      <OnlineIndicator isOnline={!!other.clientId}> {name}</OnlineIndicator>
    ),
  },
  {
    title: 'Story points',
    dataIndex: 'storyPoints',
    key: 'storyPoints',
    render: (points: React.ReactNode, other: VoterType) => (
      <ResultCard visible={typeof points === 'number'}>{other.hasVoted ? points : '-'}</ResultCard>
    ),
  },
];

type Props = {
  hasVotes: boolean;
  onReveal: () => void;
  onHide: () => void;
  onDelete: () => void;
};

export const Results: React.FC<Props> = ({ hasVotes, onReveal, onHide, onDelete }: Props) => {
  const { room } = useRoom();

  const data = useMemo(() => {
    return (room?.voters ?? []).map((voter) => ({
      key: voter.id,
      id: voter.id,
      name: voter.name,
      clientId: voter.clientId,
      hasVoted: voter.hasVoted,
      storyPoints: room?.computedVotes?.votes.find((vote) => vote.voter.id === voter.id)
        ?.storyPoints ?? <CheckOutlined />,
    }));
  }, [room?.voters, room?.computedVotes]);

  return (
    <CustomCard
      title={
        <Typography.Title level={2} style={{ margin: 'auto' }}>
          Results
        </Typography.Title>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Table columns={columns} dataSource={data} pagination={{ hideOnSinglePage: true }} />
        <ButtonsGroup>
          {!room?.computedVotes ? (
            <Button disabled={!hasVotes} onClick={onReveal} type="primary" icon={<EyeOutlined />}>
              Reveal
            </Button>
          ) : (
            <Button onClick={onHide} icon={<EyeInvisibleOutlined />}>
              Hide
            </Button>
          )}
          <Button onClick={onDelete} type="link" icon={<DeleteOutlined />}>
            Clear all votes
          </Button>
        </ButtonsGroup>
      </div>
    </CustomCard>
  );
};
