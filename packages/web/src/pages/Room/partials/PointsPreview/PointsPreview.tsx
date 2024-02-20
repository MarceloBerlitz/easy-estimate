import { VoteMapper, VoteType } from '@ee/lib';

type Props = {
  vote: VoteType;
  areAllSelected: boolean;
};

export const PointsPreview = ({ vote, areAllSelected }: Props) => {
  if (!areAllSelected) {
    return <>Select all parameters</>;
  }

  return <strong>{VoteMapper.mapVoteToStoryPoints(vote)}</strong>;
};
