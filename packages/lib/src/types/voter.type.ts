import { VoterRolesEnum } from "../enums/voter-roles.enum"
import { VoteType } from "./vote.type"

export type VoterType = {
    id: string,
    name: string,
    role: VoterRolesEnum,
    currentVote: VoteType
}