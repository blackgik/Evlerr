import { Request } from "express";
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

	async getAllMembers(agencyId: any, req: Request) {
		try {
			// define pagination options
			let page = Number(req.query?.page) || 1,
				  limit = Number(req.query?.limit) || 10,
				  sort = {}

			let orderBy = req.query?.orderBy || "default";
			if (String(orderBy).toLowerCase() === "newest") sort = { createdAt: -1 };
			else sort = { createdAt: 1 };


			let total: number = await MembershipModel.find({ agencyId }).countDocuments(),
				pages = Math.ceil(total / limit) || 0,
				docs = await MembershipModel.find({ agencyId })
					.populate({
						path: "memberId"
					})
					.limit(limit)
					.skip( (page -1 ) * limit )
					.sort( sort ),
				result = {
				docs,
				totalDocs: total,
				limit,
				totalPages: pages,
				page,
				hasPrevPage: page > 1,
				hasNextPage: page < pages
			};
			return result;
		} catch (err: any) {
			throw new InternalServerError(err.message)
		}
	}
}

export default new Membership();
