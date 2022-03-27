import { DocumentDefinition, FilterQuery } from "mongoose";
import { InternalServerError, InvalidError } from "../../lib/appErrors";
import UserModel, { UserDocument } from "../models/UserModel";

class User {
	async createUser(
		input: DocumentDefinition<
			Omit<UserDocument, "updatedAt" | "createdAt" | "comparePassword" | "companyId" | "isVerified">
		>,
	) {
		try {
			return await UserModel.create(input);
		} catch (e: any) {
			throw new InternalServerError(e.message);
		}
	}

	async validatePassword({ email, password }: { email: string; password: string }) {
		// we need to first find if the user exist;
		const user = await UserModel.findOne({ email });

		if (!user) throw new InvalidError("Invalid User");

		const isValid = await user.comparePassword(password);
		if (!isValid) throw new InvalidError("Invalid User ");

		return user.toJSON();
	}

	async findUser(query: FilterQuery<UserDocument>) {
		return await UserModel.findOne(query).lean();
	}
}

export default new User();
