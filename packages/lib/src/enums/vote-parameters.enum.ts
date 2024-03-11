export enum VoteParametersEnum {
  COMPLEXITY = 'complexity',
  EFFORT = 'effort',
  RISK = 'risk',
}

export const VOTE_PARAMETERS_OPTIONS = Object.values(VoteParametersEnum);

export const VOTE_PARAMETERS_TOOLTIPS = {
  [VoteParametersEnum.COMPLEXITY]: 'Difficulty, interaction with other teams, maintainability.',
  [VoteParametersEnum.EFFORT]: 'Volume of work, number of components involved.',
  [VoteParametersEnum.RISK]: 'Doubts, technical or business uncertainties.',
};

export const VOTE_PARAMETERS_ICONS = {
  [VoteParametersEnum.COMPLEXITY]: 'ApartmentOutlined',
  [VoteParametersEnum.EFFORT]: 'ColumnWidthOutlined',
  [VoteParametersEnum.RISK]: 'RiseOutlined',
};
