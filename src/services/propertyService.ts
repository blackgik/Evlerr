import { get } from "lodash";
import { DocumentDefinition } from "mongoose";
import PropertyModel from "../models/PropertyModel";
import { InternalServerError } from "../../lib/appErrors";
import { PropertyDocument } from "./../interfaces/Iproperty";

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
}

export default new Property();
