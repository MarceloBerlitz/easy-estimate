import { useMemo } from 'react';

import { Button, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

import { VOTE_PARAMETERS_OPTIONS, VoteType } from '@ee/lib';

import { CustomCard } from '../../styles';
import { VoteHelper } from './partials/VoteHelper/VoteHelper';
import { ButtonsGroup } from '../../../../components/ButtonsGroup';

type Props = {
  currentVote: Partial<VoteType>;
  hasVoted: boolean;
  onVoteChange: (vote: Partial<VoteType>) => void;
  onVote: () => void;
};

export const VotingBoard = ({ currentVote, hasVoted, onVoteChange, onVote }: Props) => {
  const allParametersSelected = useMemo(() => {
    return VOTE_PARAMETERS_OPTIONS.every((param) => !!currentVote[param]);
  }, [currentVote]);

  return (
    <CustomCard
      title={
        <Typography.Title level={4} style={{ margin: 'auto' }}>
          Voting Board
        </Typography.Title>
      }
    >
      <VoteHelper
        currentVote={currentVote}
        onVoteChange={onVoteChange}
        allParametersSelected={allParametersSelected}
      />
      <ButtonsGroup>
        <Button
          disabled={!allParametersSelected}
          onClick={onVote}
          type="primary"
          icon={<SaveOutlined />}
        >
          {hasVoted ? 'Update Vote' : 'Vote'}
        </Button>
        <Button disabled={false} type="link" onClick={() => onVoteChange({})}>
          Reset
        </Button>
      </ButtonsGroup>
    </CustomCard>
  );
};
