import { DocumentDefinition, FilterQuery } from "mongoose";
import { UserDocument } from "../interfaces/Iuser";
import { deleteFromCloud, uploadToCloud } from "../../lib/cloudinary";
class User {
	async uploadPicture(path: string, user: any) {
		const { secure_url, public_id } = await uploadToCloud(path);
		if (secure_url && public_id) {
			(user.profilePicture.url = secure_url),
				(user.profilePicture.publicId = public_id);

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
}

export default new User();
