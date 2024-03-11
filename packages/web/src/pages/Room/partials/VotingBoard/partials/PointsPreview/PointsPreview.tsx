import { Button, Modal, Typography } from 'antd';
import { BulbOutlined } from '@ant-design/icons';

import { VoteMapper, VoteType } from '@ee/lib';

import { IconWrapper, PointsPreviewWrapper, PointsPreviewLeft } from './styles';
import { ResultCard } from '../../../../../../components/ResultCard/ResultCard';
import { CriteriaBoard } from '../CriteriaBoard/CriteriaBoard';

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
        <div>
          <Typography style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            Total sum of your votes based on
            <Button
              type="text"
              size="small"
              style={{ paddingLeft: '3px', paddingRight: '3px', fontSize: 12 }}
              onClick={() =>
                Modal.info({
                  title: 'Criteria Board',
                  content: <CriteriaBoard />,
                  width: 600,
                })
              }
            >
              this criteria board.
            </Button>
          </Typography>
          <Typography>You can update your vote anytime.</Typography>
        </div>
      </PointsPreviewLeft>
      <ResultCard visible={!!areAllSelected}>
        {areAllSelected ? VoteMapper.mapVoteToStoryPoints(vote) : '-'}
      </ResultCard>
    </PointsPreviewWrapper>
  );
};
