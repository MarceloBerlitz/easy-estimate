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
          <>
            <input
              type="radio"
              id={option}
              name={parameter}
              value={option}
              checked={checked === option}
              onClick={() => onChange(option)}
            />
            <label>{option}</label>
            <br />
          </>
        );
      })}
    </div>
  );
};
