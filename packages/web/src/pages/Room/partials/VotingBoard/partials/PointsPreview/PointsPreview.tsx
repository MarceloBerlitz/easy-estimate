import { Typography } from 'antd';
import { BulbOutlined } from '@ant-design/icons';

import { VoteMapper, VoteType } from '@ee/lib';

import { IconWrapper, PointsPreviewWrapper, PointsPreviewLeft } from './styles';
import { ResultCard } from '../../../../../../components/ResultCard/ResultCard';

type Props = {
  vote: VoteType;
  areAllSelected: boolean;
};

export const PointsPreview = ({ vote, areAllSelected }: Props) => {
  return (
    <PointsPreviewWrapper>
      <PointsPreviewLeft>
        <Typography.Title level={5}>
          <IconWrapper>
            <BulbOutlined />
          </IconWrapper>
          Your Estimative
        </Typography.Title>
        <Typography>
          Total sum of your votes based on this criteria board. <br />
          You can update your vote anytime.
        </Typography>
      </PointsPreviewLeft>
      <ResultCard visible={!!vote}>{VoteMapper.mapVoteToStoryPoints(vote)}</ResultCard>
    </PointsPreviewWrapper>
  );
};
