import { Typography } from 'antd';

import { VoteType } from '@ee/lib';

import { BulbOutlined } from '@ant-design/icons';
import { IconWrapper, PointsPreviewWrapper } from './styles';

type Props = {
  vote: VoteType;
  areAllSelected: boolean;
};

export const PointsPreview = ({ vote, areAllSelected }: Props) => {
  return (
    <PointsPreviewWrapper>
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

      {/* {!areAllSelected ? (
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
      )} */}
    </PointsPreviewWrapper>
  );
};
