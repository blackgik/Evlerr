import { application, Request, Response } from "express";
import { BadRequestError } from "../../lib/appErrors";
import {
	publicIdString,
	updateInput,
} from "../schemaValidation/userValidationSchema";
import userService from "../services/userService";
import appResponse from "./../../lib/appResponse";

class User {
	async MyProfileHandler(req: Request, res: Response) {
		let user = res.locals.user;

		res.send(appResponse("got my profile successfully", user));
	}

	async uploadProfilePicsHandler(req: Request, res: Response) {
		if (!req.file?.path)
			throw new BadRequestError("Missing required photo type");

		const path = req.file.path;
		const user = res.locals.user;

		const data = await userService.uploadPicture(path, user);

		res.send(appResponse("uploaded file successfully", data));
	}

	async deletePhotoHandler(
		req: Request<{}, {}, {}, publicIdString["query"]>,
		res: Response,
	) {
		const { publicId } = req.query;

		let deletePicture = await userService.deletePicture(publicId);

		res.send(appResponse("deleted Image successfully", deletePicture));
	}

	async updateProfileHander(
		req: Request<{}, {}, updateInput["body"]>,
		res: Response,
	) {
		const user = res.locals.user;
		const updatedProfile = await userService.updateProfile(user, req.body);

		res.send(appResponse("updated profile successfully", updatedProfile));
	}
}

export default new User();
