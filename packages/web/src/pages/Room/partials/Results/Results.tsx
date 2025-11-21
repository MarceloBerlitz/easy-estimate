import React, { useMemo } from 'react';

import {
  CheckOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Typography } from 'antd';

import { VoterType } from '@ee/lib';

import { ButtonsGroup } from '../../../../components/ButtonsGroup';
import { ResultCard } from '../../../../components/ResultCard/ResultCard';
import { Voter } from '../../../../components/Voter/Voter';
import { useRoom } from '../../../../hooks/Room/useRoom';
import { CustomCard } from '../../styles';
import { StyledTable } from './styles';

const columns = [
  {
    title: 'Participant Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string, other: VoterType) => (
      <Voter name={name} isOnline={!!other.clientId} showStatus={true} />
    ),
  },
  {
    title: 'Story Points',
    dataIndex: 'storyPoints',
    key: 'storyPoints',
    align: 'right' as any,
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
    return (room?.voters ?? [])
      .map((voter) => ({
        key: voter.id,
        id: voter.id,
        name: voter.name,
        clientId: voter.clientId,
        hasVoted: voter.hasVoted,
        storyPoints: room?.computedVotes?.votes.find((vote) => vote.voter.id === voter.id)
          ?.storyPoints ?? <CheckOutlined />,
      }))
      .sort((a, b) => {
        // Ordena por votacao
        if (a.hasVoted && !b.hasVoted) return -1;
        if (b.hasVoted && !a.hasVoted) return 1;

        // Se foi revelado
        if (room.computedVotes) {
          // Ordena por nota
          if (a.storyPoints > b.storyPoints) return -1;
          if (b.storyPoints > a.storyPoints) return 1;
        }

        // Ordena alfabeticamente
        const aName = a.name.toLowerCase()
        const bName = b.name.toLowerCase()
        if (aName > bName) return 1
        if (bName > aName) return -1

        // Iguais, nao deve acontecer
        return 0
      });
  }, [room?.voters, room?.computedVotes]);

  return (
    <CustomCard
      title={
        <Typography.Title level={4} style={{ margin: 'auto' }}>
          Results
        </Typography.Title>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <StyledTable columns={columns} dataSource={data} pagination={{ hideOnSinglePage: true }} />
        <ButtonsGroup>
          {!room?.computedVotes ? (
            <Button disabled={!hasVotes} onClick={onReveal} type="primary" icon={<EyeOutlined />}>
              Reveal
            </Button>
          ) : (
            <Button onClick={onHide} type="primary" icon={<EyeInvisibleOutlined />}>
              Hide
            </Button>
          )}
          <Button onClick={onDelete} type="link" icon={<DeleteOutlined />}>
            Clear All Votes
          </Button>
        </ButtonsGroup>
      </div>
    </CustomCard>
  );
};
