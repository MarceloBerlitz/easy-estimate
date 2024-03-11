import { Typography } from 'antd';

import { ComputedVotesType } from '@ee/lib';

import { CustomCard } from '../../styles';
import { ParamsCharts } from './partials/ParamsCharts/ParamsCharts';

type Props = {
  computedVotes?: ComputedVotesType;
};

export const VoteDetails = ({ computedVotes }: Props) => {
  return (
    <CustomCard
      title={
        <Typography.Title level={4} style={{ margin: 'auto' }}>
          Details
        </Typography.Title>
      }
    >
      <ParamsCharts computedVotes={computedVotes} />
    </CustomCard>
  );
};
