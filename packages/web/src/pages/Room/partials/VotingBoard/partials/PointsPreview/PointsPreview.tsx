import { Space, Typography } from 'antd';

import { VoteMapper, VoteType } from '@ee/lib';

import { PointsPreviewWrapper } from './styles';
import { ResultCard } from '../../../../../../components/ResultCard/ResultCard';

type Props = {
  vote: VoteType;
  areAllSelected: boolean;
};

export const PointsPreview = ({ vote, areAllSelected }: Props) => {
  return (
    <PointsPreviewWrapper>
      {!areAllSelected ? (
        <Typography>
          <strong>Select all parameters to see your estimative</strong>
        </Typography>
      ) : (
        <Space size={8}>
          <Typography>
            <strong>Your estimative:</strong>
          </Typography>
          <ResultCard visible={!!vote}>{VoteMapper.mapVoteToStoryPoints(vote)}</ResultCard>
        </Space>
      )}
    </PointsPreviewWrapper>
  );
};
