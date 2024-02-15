import { VoteOptionEnum } from "@ee/lib";

type Props = {
  parameter: "complexity" | "effort" | "risk";
  onChange: (value: VoteOptionEnum) => void;
};

export const VoteOptionSelector = ({ parameter, onChange }: Props) => {
  return (
    <div>
       {" "}
      <input
        type="radio"
        id="s"
        name={parameter}
        value={VoteOptionEnum.SMALL}
        onClick={(e: any) => onChange(e.target.value)}
      />
        <label>S</label>
      <br /> {" "}
      <input
        type="radio"
        id="m"
        name={parameter}
        value={VoteOptionEnum.MEDIUM}
        onClick={(e: any) => onChange(e.target.value)}
      />
        <label>M</label>
      <br /> {" "}
      <input
        type="radio"
        id="l"
        name={parameter}
        value={VoteOptionEnum.LARGE}
        onClick={(e: any) => onChange(e.target.value)}
      />
        <label>L</label>
    </div>
  );
};
