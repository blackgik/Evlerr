import { get } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import PropertyModel from "../models/PropertyModel";
import { InternalServerError } from "../../lib/appErrors";
import { PropertyDocument } from "./../interfaces/Iproperty";
import { query } from "express";

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

	async fetchUserProperties(query: FilterQuery<PropertyDocument>) {
		try {
			return await PropertyModel.find(query);
		} catch (err: any) {
			throw new InternalServerError(err.message);
		}
	}

	async publicProperties() {
		try {
			return await PropertyModel.find().populate({
				path: "agentId",
				model: "User"
			});
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
						{ region: search },
						{ rooms: search },
						{ propertyType: search },
						{ propertyTitle: search },
						{propertyType:search}
					]
				}
			}
		]);

		return property;
	}
}

export default new Property();
