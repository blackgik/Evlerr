import { get } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import PropertyModel from "../models/PropertyModel";
import { InternalServerError } from "../../lib/appErrors";
import { PropertyDocument } from "./../interfaces/Iproperty";
import { query } from "express";

class Property {
	async submitPropety(
		user: object,
		body:
			| DocumentDefinition<
					Omit<PropertyDocument, "createdAt" | "agentId" | "updatedAt">
			  >
			| any,
	) {
		try {
			const data = {
				...body,
				agentId: get(user, "_id"),
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
}

export default new Property();
