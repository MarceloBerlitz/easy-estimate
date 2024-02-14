import { FibonacciStoryPointsEnum, VoteOptionEnum } from "../enums";
import { VoterType } from "./voter.type";

export type ComputedVotesParametersType = {
    [VoteOptionEnum.SMALL]: number;
    [VoteOptionEnum.MEDIUM]: number;
    [VoteOptionEnum.LARGE]: number;
}

export type ComputedVotesType = {
    complexity: ComputedVotesParametersType,
    effort: ComputedVotesParametersType,
    risk: ComputedVotesParametersType,
    votes: {
        voter: VoterType,
        storyPoints: FibonacciStoryPointsEnum
    }[]
}