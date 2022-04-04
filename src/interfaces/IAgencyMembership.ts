import {Document, Types} from "mongoose"

export interface MembershipDocument extends Document {
    memberId: Types.ObjectId | string;
    agencyId: Types.ObjectId | string;
}