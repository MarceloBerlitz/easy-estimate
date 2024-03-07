import { VOTE_OPTIONS, VOTE_PARAMETERS_OPTIONS } from '../enums';
import { ComputedVotesType, ComputedVotesParametersType } from '../types';

const createParameter = () => {
  return VOTE_OPTIONS.reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {});
};

export class ComputedVotesFactory {
  public static create(): ComputedVotesType {
    const parameters = VOTE_PARAMETERS_OPTIONS.reduce(
      (acc, cur) => ({ ...acc, [cur]: createParameter() }),
      {} as Partial<ComputedVotesParametersType>
    );
    return {
      ...(parameters as ComputedVotesParametersType),
      votes: [],
    };
  }
}
