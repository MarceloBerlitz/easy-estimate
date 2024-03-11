import React from 'react';

import { Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import {
  VoteType,
  VoteOptionEnum,
  VOTE_PARAMETERS_OPTIONS,
  VOTE_PARAMETERS_TOOLTIPS,
} from '@ee/lib';

import { ParameterTitleWrapper, ParameterWrapper, VotesHelperWrapper } from './styles';
import { VoteOptionSelector } from '../VoteOptionSelector/VoteOptionSelector';
import { PointsPreview } from '../PointsPreview/PointsPreview';

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
    <span>
      <VotesHelperWrapper>
        {VOTE_PARAMETERS_OPTIONS.map((parameter) => {
          return (
            <ParameterWrapper key={parameter}>
              <ParameterTitleWrapper>
                <Typography.Title level={3}>{parameter}</Typography.Title>
                <Tooltip title={VOTE_PARAMETERS_TOOLTIPS[parameter]}>
                  <InfoCircleOutlined />
                </Tooltip>
              </ParameterTitleWrapper>
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
    </span>
  );
};
