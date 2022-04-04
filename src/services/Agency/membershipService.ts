import {FilterQuery, Types } from "mongoose";
import { InternalServerError } from "../../../lib/appErrors";
import { MembershipDocument } from "../../interfaces/IAgencyMembership";
import MembershipModel from "../../models/Agency/MembershipModel";
import UserModel from "../../models/UserModel";

class Membership {
	async addMembers({
		agencyId,
		memberId
	}: {
		agencyId: string | Types.ObjectId;
		memberId: string | Types.ObjectId;
	}) {
		try {
			return await MembershipModel.create({ agencyId, memberId });
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}

	async searchMember(search: any) {
		try {
			return await UserModel.aggregate([
				{ $match: { $or: [{ fullName: search }, { username: search }] } }
			]);
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}

    async deleteMember(query: FilterQuery<MembershipDocument>) {
        try{
            return await MembershipModel.findOneAndDelete(query)
        }catch(err:any) {
            throw new InternalServerError(err.message)
        }
    }
}

export default new Membership();
