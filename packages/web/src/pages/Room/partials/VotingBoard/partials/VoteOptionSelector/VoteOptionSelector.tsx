import { Radio } from 'antd';

import { VOTE_OPTIONS, VOTE_OPTIONS_LABELS, VoteOptionEnum, VoteParametersEnum } from '@ee/lib';

import { StyledRadioButton } from './styles';

type Props = {
  parameter: VoteParametersEnum;
  checked: VoteOptionEnum;
  onChange: (value: VoteOptionEnum) => void;
};

export const VoteOptionSelector = ({ parameter, checked, onChange }: Props) => {
  return (
    <Radio.Group
      buttonStyle="solid"
      size="large"
      value={checked}
      onChange={(e) => onChange(e.target.value as VoteOptionEnum)}
    >
      {VOTE_OPTIONS.map((option) => {
        return (
          <StyledRadioButton
            id={option}
            key={`${parameter}-${option}`}
            name={parameter}
            value={option}
          >
            {VOTE_OPTIONS_LABELS[option]}
          </StyledRadioButton>
        );
      })}
    </Radio.Group>
  );
};
