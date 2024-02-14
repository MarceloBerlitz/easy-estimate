import { VoteType } from "./vote.type"

export type VoterType = {
    id: string,
    name: string,
    currentVote?: VoteType
}