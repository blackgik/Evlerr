import { DocumentDefinition } from "mongoose";
import { InternalServerError } from "../../lib/appErrors";
import UserModel, { UserDocument } from "../models/UserModel";

class User {
	async createUser(
		input: DocumentDefinition<
			Omit<UserDocument, "updatedAt" | "createdAt" | "comparePassword">
		>,
	) {
		try {
			return await UserModel.create(input);
		} catch (e: any) {
            throw new InternalServerError(e.message)
        }
	}
}

export default new User();
