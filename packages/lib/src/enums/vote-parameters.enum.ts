export enum VoteParametersEnum {
  COMPLEXITY = 'complexity',
  EFFORT = 'effort',
  RISK = 'risk',
}

export const VOTE_PARAMETERS_OPTIONS = Object.values(VoteParametersEnum);

export const VOTE_PARAMETERS_TOOLTIPS = {
  [VoteParametersEnum.COMPLEXITY]: 'Definition of complexity',
  [VoteParametersEnum.EFFORT]: 'Definition of effort',
  [VoteParametersEnum.RISK]: 'Definition of risk',
};
