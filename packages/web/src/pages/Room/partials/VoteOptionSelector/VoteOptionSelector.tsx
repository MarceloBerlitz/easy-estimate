import { VOTE_OPTIONS, VoteOptionEnum, VoteParametersEnum } from '@ee/lib';
import { Radio } from 'antd';

type Props = {
  parameter: VoteParametersEnum;
  checked: VoteOptionEnum;
  onChange: (value: VoteOptionEnum) => void;
};

export const VoteOptionSelector = ({ parameter, checked, onChange }: Props) => {
  return (
    <Radio.Group defaultValue="a" buttonStyle="solid">
      {VOTE_OPTIONS.map((option) => {
        return (
          <Radio.Button
            id={option}
            key={`${parameter}-${option}`}
            name={parameter}
            value={option}
            checked={checked === option}
            onChange={(e) => onChange(e.target.value as VoteOptionEnum)}
          >
            {option}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
};
