import { application, Request, Response } from "express";
import { BadRequestError, InternalServerError } from "../../lib/appErrors";
import {
	agentSupportInput,
	newPasswordInput,
	publicIdString,
	updateInput,
	userSearchInput
} from "../schemaValidation/userValidationSchema";
import userService from "../services/userService";
import appResponse from "./../../lib/appResponse";
import { agentSupportMail } from "./../utils/mailer";

class User {
	async MyProfileHandler(req: Request, res: Response) {
		let user = res.locals.user;

		res.send(appResponse("got my profile successfully", user));
	}

	async uploadProfilePicsHandler(req: Request, res: Response) {
		if (!req.file?.path) throw new BadRequestError("Missing required photo type");

		const path = req.file.path;
		const user = res.locals.user;

		const data = await userService.uploadPicture(path, user);

		res.send(appResponse("uploaded file successfully", data));
	}

	async deletePhotoHandler(req: Request<{}, {}, {}, publicIdString["query"]>, res: Response) {
		const { publicId } = req.query;

		let deletePicture = await userService.deletePicture(publicId);

		res.send(appResponse("deleted Image successfully", deletePicture));
	}

	async updateProfileHander(req: Request<{}, {}, updateInput["body"]>, res: Response) {
		const user = res.locals.user;
		const updatedProfile = await userService.updateProfile(user, req.body);

		res.send(appResponse("updated profile successfully", updatedProfile));
	}

	async MediaUploader(req: Request, res: Response) {
		if (!req.file?.path) throw new BadRequestError("Missing required photo type");

		const path = req.file.path;

		const data = await userService.MediaUploader(path);

		res.send(appResponse("uploaded file successfully", data));
	}
	async updatePasswordHandler(req: Request<{}, {}, newPasswordInput["body"]>, res: Response) {
		const user = res.locals.user;

		const changePassword = await userService.updatePassword(user, req.body);

		res.send(appResponse("updated password correctly", changePassword));
	}

	async agentSupportHandler(req: Request<{}, {}, agentSupportInput["body"]>, res: Response) {
		const { emailtTo, message, phone, name, emailFrom } = req.body;

		const sent = await agentSupportMail(emailtTo, "Support", phone, message, name, emailFrom)
		if (!sent) throw new InternalServerError("could not deliver message, try again")

		res.send(appResponse("sent message successfully", sent))
	}

	async getUserHandler(
		req: Request<userSearchInput["query"]>,
		res: Response
	) {
		const role = req.query?.role || "user";

        const result = await userService.getUsers(role, req);

        res.send(appResponse(`found ${role} successfully`, result));
	}
}

export default new User();
