import React from 'react';

import { Divider, Typography } from 'antd';
import * as Icons from '@ant-design/icons';

import {
  VOTE_PARAMETERS_ICONS,
  VOTE_PARAMETERS_OPTIONS,
  VOTE_PARAMETERS_TOOLTIPS,
  VoteOptionEnum,
  VoteType,
} from '@ee/lib';

import { PointsPreview } from '../PointsPreview/PointsPreview';
import { VoteOptionSelector } from '../VoteOptionSelector/VoteOptionSelector';
import { IconWrapper, ParameterTitleWrapper, ParameterWrapper, VotesHelperWrapper } from './styles';

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
          const Icon = (Icons as any)[VOTE_PARAMETERS_ICONS[parameter]];
          return (
            <ParameterWrapper key={parameter}>
              <ParameterTitleWrapper>
                <Typography.Title level={5}>
                  <IconWrapper>
                    <Icon color="primary" />
                  </IconWrapper>
                  {parameter}
                </Typography.Title>
                <Typography>{VOTE_PARAMETERS_TOOLTIPS[parameter]}</Typography>
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
      <Divider />
      <PointsPreview vote={currentVote as VoteType} areAllSelected={allParametersSelected} />
    </span>
  );
};
