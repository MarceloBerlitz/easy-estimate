import { VoterType } from "@ee/lib";

export class VoterFactory {
    public static create(id: string, name: string): VoterType {
        return ({
            id,
            name
        })
    }
}