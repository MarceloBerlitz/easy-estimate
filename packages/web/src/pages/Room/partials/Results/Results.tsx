import React, { useMemo } from 'react';

import { CheckOutlined } from '@ant-design/icons';
import { Table } from 'antd';

import { VoterType } from '@ee/lib';

import { useRoom } from '../../../../hooks/Room/useRoom';
import { ResultCard } from '../../../../components/ResultCard/ResultCard';

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Story points',
    dataIndex: 'storyPoints',
    key: 'storyPoints',
    render: (points: React.ReactNode, other: VoterType) => (
      <ResultCard visible={typeof points === 'number'}>{other.hasVoted ? points : '-'}</ResultCard>
    ),
  },
];

export const Results: React.FC = () => {
  const { room } = useRoom();

  const data = useMemo(() => {
    return (room?.voters ?? []).map((voter) => ({
      key: voter.id,
      id: voter.id,
      name: voter.name,
      hasVoted: voter.hasVoted,
      storyPoints: room?.computedVotes?.votes.find((vote) => vote.voter.id === voter.id)
        ?.storyPoints ?? <CheckOutlined />,
    }));
  }, [room?.voters, room?.computedVotes]);

  return (
    <div>
      <h2>Results</h2>
      <Table columns={columns} dataSource={data} pagination={{ hideOnSinglePage: true }} />
    </div>
  );
};
