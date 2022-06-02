import { get } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import PropertyModel from "../models/PropertyModel";
import { InternalServerError } from "../../lib/appErrors";
import { PropertyDocument } from "./../interfaces/Iproperty";
import { Request, query } from "express";
import { uploadToCloud } from "../../lib/cloudinary";

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
			let page = Number(req.query?.page) || 1,
				  limit = Number(req.query?.limit) || 10,
				  sort = {}

			let orderBy = req.query?.orderBy || "default";
			if (String(orderBy).toLowerCase() === "newest") sort = { createdAt: -1 };
			else sort = { createdAt: 1 };


			let total: number = await PropertyModel.find(query).countDocuments(),
				pages = Math.ceil(total / limit) || 0,
				docs = await PropertyModel.find(query)
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
			throw new InternalServerError(err.message);
		}
	}

	async publicProperties(req: Request) {
		try {
			// define pagination options
			let page = Number(req.query?.page) || 1,
				  limit = Number(req.query?.limit) || 10,
				  sort = {}

			let orderBy = req.query?.orderBy || "default";
			if (String(orderBy).toLowerCase() === "newest") sort = { createdAt: -1 };
			else sort = { createdAt: 1 };


			let total: number = await PropertyModel.find().countDocuments(),
				pages = Math.ceil(total / limit) || 0,
				docs = await PropertyModel.find()
					.populate({
						path: "agentId",
						model: "User"
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
			throw new InternalServerError(err.message);
		}
	}

	async searchProperty(search: any, filter: any, query: any, status: any) {
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
							$or: [ { status: { $regex: status } } ]
						},
						{
							$or: [
								{ region: { $regex: search } },
								{ rooms: { $regex: search } },
								{ propertyType: { $regex: search } },
								{ propertyTitle: { $regex: search} }
							]
						},
						{ 
							$or: [
								// advanced filter
								{ amenities : { $regex: filter } },
								{ mapLocation: { $regex: filter } },
								{ bed: { $regex: filter } },
								{ bath: { $regex: filter } },
								{ region: { $regex: filter } },
								{ floors: { $regex: filter } },
								{ rooms: { $regex: filter } },
								{ homeArea: { $regex: filter } },
								{ price: { $regex: filter } },
								{ garage: { $regex: filter } }
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
		const total = property[0]?.pageInfo[0]?.count,
			pages = Math.ceil(total / limit) || 0,
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
			let page = Number(req.query?.page) || 1,
				  limit = Number(req.query?.limit) || 10,
				  sort = {}

			let orderBy = req.query?.orderBy || "default";
			if (String(orderBy).toLowerCase() === "newest") sort = { createdAt: -1 };
			else sort = { createdAt: 1 };


			let total: number = await PropertyModel.find(query).countDocuments(),
				pages = Math.ceil(total / limit) || 0,
				docs = await PropertyModel.find(query)
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
			throw new InternalServerError(err.message);
		}
	}

	async editMedia(files: any, propField: any, propId: any) {
		const property: any = await PropertyModel.findById({ _id: propId });
		for (let i=0; i<files.length; i++) {
			if (Array.isArray(files)){
				if (propField === "featuredImage"){
					const { secure_url, public_id } = await uploadToCloud(files[i].path);
					if (secure_url && public_id && property) {
						(property.featuredImage.url = secure_url), (property.featuredImage.publicId = public_id);
					}
				} else {
					const { secure_url, public_id } = await uploadToCloud(files[i].path);
					if (secure_url && public_id){
						const currImg = { 
							url: String(secure_url),
							publicId: String(public_id)
						};
						property[propField].push(currImg);
					}
				}
				await property.save();
			}
		}
		return property;
	}

	async updateProperty(propId: any, body: any) {
		const property: any = await PropertyModel.findById({ _id: propId });
		const updates = Object.keys(body);
		updates.forEach( (update: any) =>  ( property[update] = body[update]) );

		await property.save();
		return property;
	}
}

export default new Property();
