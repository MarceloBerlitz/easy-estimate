import { BulbOutlined } from '@ant-design/icons';
import { Modal, Typography } from 'antd';

import { VoteMapper, VoteType } from '@ee/lib';

import { ResultCard } from '../../../../../../components/ResultCard/ResultCard';
import { CriteriaBoard } from '../CriteriaBoard/CriteriaBoard';
import { CriteriaBoardLink, IconWrapper, PointsPreviewLeft, PointsPreviewWrapper } from './styles';

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
            <span>
              Total sum of your votes based on
              <CriteriaBoardLink
                onClick={() =>
                  Modal.info({
                    title: 'Criteria Board',
                    content: <CriteriaBoard />,
                    width: 'fit-content',
                  })
                }
              >
                this criteria board.
              </CriteriaBoardLink>
            </span>
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
