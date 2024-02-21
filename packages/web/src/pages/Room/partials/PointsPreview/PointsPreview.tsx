import { VoteMapper, VoteType } from '@ee/lib';

import { PointsPreviewWrapper } from './styles';
import { ResultCard } from '../../../../components/ResultCard/ResultCard';
import { Space } from 'antd';

type Props = {
  vote: VoteType;
  areAllSelected: boolean;
};

export const PointsPreview = ({ vote, areAllSelected }: Props) => {
  return (
    <PointsPreviewWrapper>
      {!areAllSelected ? (
        <strong>Select all parameters to see your estimative</strong>
      ) : (
        <Space size={8}>
          <strong>Your estimative:</strong>
          <ResultCard visible={!!vote}>{VoteMapper.mapVoteToStoryPoints(vote)}</ResultCard>
        </Space>
      )}
    </PointsPreviewWrapper>
  );
};
