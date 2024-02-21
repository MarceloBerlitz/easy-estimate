import React from 'react';

import { VoteType, VoteOptionEnum, VOTE_PARAMETERS_OPTIONS } from '@ee/lib';

import { VoteOptionSelector } from '../VoteOptionSelector/VoteOptionSelector';
import { PointsPreview } from '../PointsPreview/PointsPreview';
import { ParameterWrapper, VotesHelperWrapper } from './styles';

type Props = {
  currentVote: Partial<VoteType>;
  onVoteChange: (value: Partial<VoteType>) => void;
  allParametersSelected: boolean;
};

export const VoteHelper: React.FC<Props> = ({
  currentVote,
  onVoteChange,
  allParametersSelected,
}) => {
  return (
    <>
      <VotesHelperWrapper>
        {VOTE_PARAMETERS_OPTIONS.map((parameter) => {
          return (
            <ParameterWrapper key={parameter}>
              <h2>{parameter}</h2>
              <VoteOptionSelector
                parameter={parameter}
                checked={currentVote[parameter]!}
                onChange={(val: VoteOptionEnum) =>
                  onVoteChange({ ...currentVote, [parameter]: val })
                }
              />
            </ParameterWrapper>
          );
        })}
      </VotesHelperWrapper>
      <PointsPreview vote={currentVote as VoteType} areAllSelected={allParametersSelected} />
    </>
  );
};
