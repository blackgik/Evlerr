import { Schema, model } from "mongoose";
import { MembershipDocument } from "../../interfaces/IAgencyMembership";

const MembershipSchema = new Schema({
	memberId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	agencyId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
});

MembershipSchema.index({
    memberId: "text"
})

export default model<MembershipDocument>("Member", MembershipSchema);
