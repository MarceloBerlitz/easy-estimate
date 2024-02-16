import React from "react";

import {
  VoteType,
  VoteOptionEnum,
  VOTE_PARAMETERS_OPTIONS,
} from "@ee/lib";

import { VoteOptionSelector } from "../VoteOptionSelector/VoteOptionSelector";
import { PointsPreview } from "../PointsPreview/PointsPreview";

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
    <div>
      {VOTE_PARAMETERS_OPTIONS.map((parameter) => {
        return (
          <div>
            <h2>{parameter}</h2>
            <VoteOptionSelector
              parameter={parameter}
              checked={currentVote[parameter]!}
              onChange={(val: VoteOptionEnum) =>
                onVoteChange({ ...currentVote, [parameter]: val })
              }
            />
          </div>
        );
      })}
      <PointsPreview
        vote={currentVote as VoteType}
        areAllSelected={allParametersSelected}
      />
    </div>
  );
};
