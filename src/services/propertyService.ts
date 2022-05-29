import { get, sortBy } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import PropertyModel from "../models/PropertyModel";
import { InternalServerError } from "../../lib/appErrors";
import { PropertyDocument } from "./../interfaces/Iproperty";
import { Request, query } from "express";

class Property {
	async submitPropety(
		user: object,
		body: DocumentDefinition<Omit<PropertyDocument, "createdAt" | "agentId" | "updatedAt">> | any
	) {
		try {
			const data = {
				...body,
				agentId: get(user, "_id")
			};
			return await PropertyModel.create(data);
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}

	async deleteProperty(query: FilterQuery<PropertyDocument>) {
		console.log(query);
		try {
			return await PropertyModel.findOneAndDelete(query);
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}

	async viewProperty(query: FilterQuery<PropertyDocument>) {
		try {
			return await PropertyModel.findById(query._id);
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}

	async fetchUserProperties(query: FilterQuery<PropertyDocument>, req: Request) {
		
		try {
			// define pagination options
			const page = req.query?.page || 1,
				  limit = req.query?.limit || 10;

			let orderBy = req.query?.orderBy || "default";
			if (String(orderBy).toLowerCase() === "newest") orderBy = "-createdAt";

			const options = {
				page: Number(page),
				limit: Number(limit),
				sort: orderBy
			};
			// return await PropertyModel.find(query);
			let result = await PropertyModel.paginate({query}, options);
			return result;
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}

	async publicProperties(req: Request) {
		try {
			// return await PropertyModel.find().populate({
			// 	path: "agentId",
			// 	model: "User"
			// });
			// define pagination options
			const page = req.query?.page || 1,
				  limit = req.query?.limit || 10;

			const options = {
				page: Number(page),
				limit: Number(limit),
				populate: {
					path: "agentId",
					model: "User"
				}
			};
			// return await PropertyModel.find(query);
			let result = await PropertyModel.paginate({}, options);
			return result;
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}

	async searchProperty(search: any) {
		console.log(search);
		const property = await PropertyModel.aggregate([
			{
				$lookup: {
					from: "users",
					let: { agent: "$agentId" },
					pipeline: [
						{
							$match: { $expr: { $and: [{ $eq: ["$_id", "$$agent"] }] } }
						}
					],
					as: "agent"
				}
			},
			{ $unwind: "$agent" },
			{
				$match: {
					$or: [
						{ region: { $regex: search } },
						{ rooms: { $regex: search } },
						{ propertyType: { $regex: search } },
						{ propertyTitle: { $regex: search} },
						{propertyType: { $regex: search } }
					]
				}
			}
		]);

		return property;
	}
	
	orderDocument(a: PropertyDocument, b: PropertyDocument): number {
		let ans: number = 0;
		if (a.createdAt && b.createdAt){
			console.log("here")
			ans = b?.createdAt.getTime() - a?.createdAt.getTime();
			console.log(ans)
		}
		
		return ans;
	}
}

export default new Property()
