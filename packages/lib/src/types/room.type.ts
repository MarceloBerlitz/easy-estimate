import { VoteType } from "./vote.type"
import { VoterType } from "./voter.type"

export type RoomType = {
    id: string,
    voters: VoterType[],
    areVotesVisible: boolean,
}