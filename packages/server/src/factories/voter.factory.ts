import { VoterRolesEnum, VoterType } from "@ee/lib";

export class VoterFactory {
    public static create(id: string, name: string, role: VoterRolesEnum): VoterType {
        return ({
            id,
            name,
            role
        })
    }
}