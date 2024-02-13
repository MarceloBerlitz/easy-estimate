import { VoteOptionEnum } from "../enums/vote-option.enum"

export type VoteType = {
    complexity: VoteOptionEnum,
    effort: VoteOptionEnum,
    risk: VoteOptionEnum,
}