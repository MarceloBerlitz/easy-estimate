import { VOTE_OPTIONS, VOTE_OPTIONS_LABELS, VoteOptionEnum, VoteParametersEnum } from '@ee/lib';
import { Radio } from 'antd';

type Props = {
  parameter: VoteParametersEnum;
  checked: VoteOptionEnum;
  onChange: (value: VoteOptionEnum) => void;
};

export const VoteOptionSelector = ({ parameter, checked, onChange }: Props) => {
  return (
    <Radio.Group
      buttonStyle="solid"
      value={checked}
      onChange={(e) => onChange(e.target.value as VoteOptionEnum)}
    >
      {VOTE_OPTIONS.map((option) => {
        return (
          <Radio.Button id={option} key={`${parameter}-${option}`} name={parameter} value={option}>
            {VOTE_OPTIONS_LABELS[option]}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
};
