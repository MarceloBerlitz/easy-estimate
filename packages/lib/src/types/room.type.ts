import { ComputedVotesType } from "./computed-votes.type"
import { VoteType } from "./vote.type"
import { VoterType } from "./voter.type"

export type RoomType = {
    id: string,
    voters: VoterType[],
    votes: VoteType[],
    computedVotes: ComputedVotesType,
    areVotesVisible: boolean,
}