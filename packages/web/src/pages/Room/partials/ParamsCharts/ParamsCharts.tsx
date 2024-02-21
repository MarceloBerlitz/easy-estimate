import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

import { ComputedVotesParametersType, VOTE_OPTIONS, VOTE_PARAMETERS_OPTIONS } from '@ee/lib';

type Props = {
  computedVotes?: ComputedVotesParametersType;
};

export const ParamsCharts: React.FC<Props> = ({ computedVotes }) => {
  const data = useMemo(() => {
    return {
      labels: VOTE_PARAMETERS_OPTIONS,
      datasets: VOTE_OPTIONS.map((voteOption) => {
        return {
          label: voteOption,
          data: Object.values(computedVotes ?? {})
            .map((value) => value[voteOption])
            .filter((value) => value !== undefined),
        };
      }),
    };
  }, [computedVotes]);
  return (
    <>
      <h2>Details</h2>
      <Bar data={data} />
    </>
  );
};
