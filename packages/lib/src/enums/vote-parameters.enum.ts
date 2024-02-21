export enum VoteParametersEnum {
  COMPLEXITY = 'complexity',
  EFFORT = 'effort',
  RISK = 'risk',
}

export const VOTE_PARAMETERS_OPTIONS = Object.values(VoteParametersEnum);

export const VOTE_PARAMETERS_TOOLTIPS = {
  [VoteParametersEnum.COMPLEXITY]: 'Dificuldade, interação com outros times, manutenibilidade.',
  [VoteParametersEnum.EFFORT]: 'Volume de trabalho, número de componentes envolvidos.',
  [VoteParametersEnum.RISK]: 'Dúvidas, incertezas técnicas ou de negócio.',
};
