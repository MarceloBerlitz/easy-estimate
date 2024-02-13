import { VoteOptionEnum } from "../enums/vote-option.enum"
import { VoterType } from "./voter.type"

export type VoteType = {
    complexity: VoteOptionEnum,
    effort: VoteOptionEnum,
    risk: VoteOptionEnum,
    voter: VoterType
}