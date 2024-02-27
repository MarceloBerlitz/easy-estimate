import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

import {
  ComputedVotesParametersType,
  VOTE_OPTIONS,
  VOTE_OPTIONS_COLORS,
  VOTE_PARAMETERS_OPTIONS,
} from '@ee/lib';
import { ChartWrapper } from './styles';

type Props = {
  computedVotes?: ComputedVotesParametersType;
};

export const ParamsCharts: React.FC<Props> = ({ computedVotes }) => {
  const data = useMemo(() => {
    return {
      labels: VOTE_PARAMETERS_OPTIONS,
      datasets: VOTE_OPTIONS.map((voteOption) => {
        return {
          backgroundColor: VOTE_OPTIONS_COLORS[voteOption],
          borderColor: 'rgba(0,0,0,1)',
          label: voteOption,
          data: Object.values(computedVotes ?? {})
            .map((value) => value[voteOption])
            .filter((value) => value !== undefined),
        };
      }),
    };
  }, [computedVotes]);
  return (
    <ChartWrapper>
      <Bar options={{ responsive: true }} data={data} style={{ width: '100%' }} />
    </ChartWrapper>
  );
};
