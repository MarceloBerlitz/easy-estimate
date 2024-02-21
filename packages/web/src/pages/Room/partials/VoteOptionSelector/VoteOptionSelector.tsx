import { VOTE_OPTIONS, VoteOptionEnum, VoteParametersEnum } from '@ee/lib';

type Props = {
  parameter: VoteParametersEnum;
  checked: VoteOptionEnum;
  onChange: (value: VoteOptionEnum) => void;
};

export const VoteOptionSelector = ({ parameter, checked, onChange }: Props) => {
  return (
    <div>
      {VOTE_OPTIONS.map((option) => {
        return (
          <div key={`${parameter}-${option}`}>
            <input
              type="radio"
              id={option}
              name={parameter}
              value={option}
              defaultChecked={checked === option}
              onClick={() => onChange(option)}
            />
            <label>{option}</label>
            <br />
          </div>
        );
      })}
    </div>
  );
};
