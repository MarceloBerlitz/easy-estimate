import { FibonacciStoryPointsEnum } from "../enums";
import { VoterType } from "./voter.type";

export type ComputedVotesParametersType = {
    small: number;
    medium: number;
    large: number;
}

export type ComputedVotesType = {
    complexity: ComputedVotesParametersType,
    effort: ComputedVotesParametersType,
    risk: ComputedVotesParametersType,
    votes: {
        voter: VoterType,
        storyPoints: FibonacciStoryPointsEnum
    }
}