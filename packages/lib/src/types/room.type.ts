import { VoterType } from "./voter.type"

export type RoomType = {
    voters: VoterType[],
    areVotesVisible: boolean,
}