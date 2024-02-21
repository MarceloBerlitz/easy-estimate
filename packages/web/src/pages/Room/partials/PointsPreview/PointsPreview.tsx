import { VoteMapper, VoteType } from '@ee/lib';
import { PointsPreviewWrapper } from './styles';

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
        <strong>Your estimative: {VoteMapper.mapVoteToStoryPoints(vote)}</strong>
      )}
    </PointsPreviewWrapper>
  );
};
