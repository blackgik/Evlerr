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
			return await PropertyModel.findById(query._id).populate({
				path: "agentId"
			});
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}

	async fetchUserProperties(query: FilterQuery<PropertyDocument>, req: Request) {
		
		try {
			// define pagination options
			const page = req.query?.page || 1,
				  limit = req.query?.limit || 10;

			let orderBy = req.query?.orderBy || "createdAt";
			if (String(orderBy).toLowerCase() === "newest") orderBy = "-createdAt";

			const options = {
				page: Number(page),
				limit: Number(limit),
				sort: orderBy
			};
			// return await PropertyModel.find(query);
			let result = await PropertyModel.paginate(query, options);
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

			let orderBy = req.query?.orderBy || "createdAt";
			if (String(orderBy).toLowerCase() === "newest") orderBy = "-createdAt";

			const options = {
				page: Number(page),
				limit: Number(limit),
				populate: {
					path: "agentId",
					model: "User"
				},
				sort: orderBy
			};
			// return await PropertyModel.find(query);
			let result = await PropertyModel.paginate({}, options);
			return result;
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}

	async searchProperty(search: any, filter: any, query: any) {
		console.log(search);
		// define pagination options
		const page = Number(query?.page) || 1,
			limit = Number(query?.limit) || 10;

		let orderBy = query?.orderBy || "oldest", sortBy = {};
		if (String(orderBy).toLowerCase() === "newest") sortBy = { createdAt: -1 };
		if (String(orderBy).toLowerCase() === "price-lowest") sortBy = { price: -1 };
		if (String(orderBy).toLowerCase() === "price-highest") sortBy = { price: 1 };
		else sortBy = { createdAt: 1 };

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
					$and: [
						{
							$or: [
								{ region: { $regex: search } },
								{ rooms: { $regex: search } },
								{ propertyType: { $regex: search } },
								{ propertyTitle: { $regex: search} },
								{ propertyType: { $regex: search } }
							]
						},
						{ 
							$or: [
								// advanced filter
								{ amenities: { $regex: filter } },
								{ mapLocation: { $regex: filter } },
								{ bed: { $regex: filter } },
								{ bath: { $regex: filter } },
								{ region: { $regex: filter } },
								{ floors: { $regex: filter } },
								{ rooms: { $regex: filter } },
								{ homeArea: { $regex: filter } },
								{ price: { $regex: filter } },
								{ garage: { $regex: filter } },
								{ status: { $regex: filter } }
							]
						}
					]
				}
			},
			{
				$facet: {
					edges: [
						{ $skip: ( page - 1 ) * limit },
						{ $limit: limit },
						{ $sort: sortBy }
					],
					pageInfo: [
						{
							$group: {
								_id: null,
								count: { $sum: 1 }
							}
						}
					]
				}
			}
		]);
		const total = property[0].pageInfo[0].count,
			pages = Math.ceil(total / limit),
			result = {
				docs: property[0].edges,
				totalDocs: total,
				limit,
				totalPages: pages,
				page,
				hasPrevPage: page > 1,
				hasNextPage: page < pages
			};
		return result;
	}

	async fetchAgentProperties(query: FilterQuery<PropertyDocument>, req: Request) {
		
		try {
			// define pagination options
			const page = req.query?.page || 1,
				  limit = req.query?.limit || 10;

			let orderBy = req.query?.orderBy || "createdAt";
			if (String(orderBy).toLowerCase() === "newest") orderBy = "-createdAt";

			const options = {
				page: Number(page),
				limit: Number(limit),
				sort: orderBy
			};
			// return await PropertyModel.find(query);
			let result = await PropertyModel.paginate(query, options);
			return result;
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}
}

export default new Property()
