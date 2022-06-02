import { DocumentDefinition, FilterQuery } from "mongoose";
import UserModel from "../models/UserModel";
import { InternalServerError } from "../../lib/appErrors";
import { PasswordChangeDocument, UserDocument } from "../interfaces/Iuser";
import { deleteFromCloud, uploadToCloud } from "../../lib/cloudinary";
import { BadRequestError, InvalidError } from "../../lib/appErrors";
import { Request } from "express";
class User {
	async uploadPicture(path: string, user: any) {
		const { secure_url, public_id } = await uploadToCloud(path);
		if (secure_url && public_id) {
			(user.profilePicture.url = secure_url), (user.profilePicture.publicId = public_id);

			await user.save();
		}

		return user;
	}

	async deletePicture(id: string) {
		const response = await deleteFromCloud(id);
		if (response.result === "ok") {
			return { deleted: true };
		} else {
			return { deleted: false };
		}
	}

	async updateProfile(user: any, body: any) {
		const updates = Object.keys(body);
		updates.forEach((update: any) => (user[update] = body[update]));

		await user.save();

		return user;
	}

	async MediaUploader(path: string) {
		const { secure_url, public_id }: { secure_url: string; public_id: string } =
			await uploadToCloud(path);
		if (secure_url && public_id) {
			return { secure_url, public_id };
		}
	}

	async updatePassword(user: UserDocument, body: PasswordChangeDocument) {
		// confirm that passwords is correct first
		const isMatch = await user.comparePassword(body.oldPassword);

		if (!isMatch) throw new InvalidError("Old password is wrong");
		if(await user.comparePassword(body.newPassword)) throw new BadRequestError("old password cannot be new password")
		user.password = body.newPassword;
		await user.save();

		return user;
	}

	async getUsers(role: any, req: Request) {
		try {
			// define pagination options
			let page = Number(req.query?.page) || 1,
				  limit = Number(req.query?.limit) || 10,
				  sort = {}

			let orderBy = req.query?.orderBy || "default";
			if (String(orderBy).toLowerCase() === "newest") sort = { createdAt: -1 };
			else sort = { createdAt: 1 };


			let total: number = await UserModel.find({ role }).countDocuments(),
				pages = Math.ceil(total / limit) || 0,
				docs = await UserModel.find({ role })
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
}

export default new User();
