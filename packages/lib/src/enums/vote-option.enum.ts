export enum VoteOptionEnum {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const VOTE_OPTIONS = Object.values(VoteOptionEnum);

export const VOTE_OPTIONS_LABELS = {
  [VoteOptionEnum.SMALL]: 'small',
  [VoteOptionEnum.MEDIUM]: 'medium',
  [VoteOptionEnum.LARGE]: 'large',
};
