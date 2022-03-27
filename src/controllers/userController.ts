import { Request, Response } from "express";
import config from "config";
import logger from "../utils/logger";
import appResponse from "../../lib/appResponse";
import userService from "./../services/userServices";
import emailVerification from "../utils/mailer";

import {
	createUserInput,
	tokenString,
} from "../schemaValidation/user.ValidationSchema";
import { signJwt } from "../utils/jwtUtils";
import sessionService from "../services/sessionService";

class User {
	async createUserHandler(
		req: Request<{}, {}, createUserInput["body"]>,
		res: Response,
	) {
		try {
			const createdUser = await userService.createUser(req.body);

			const token = await signJwt({...createdUser.toJSON()}, {
				expiresIn: config.get("accessTokenLT"),
			});

			// send email with token
			await emailVerification(createdUser.email, "Verfiy Email", token);

			res.send(appResponse("successfully registered user", createdUser));
		} catch (e: any) {
			logger.error(e);
			res.status(409).send(appResponse(e.message));
		}
	}

	async validateToken(
		req: Request<{}, {}, {}, tokenString["query"]>,
		res: Response,
	) {
		const { token } = req.query;
		const validateSuccess = await sessionService.validateToken(token);
		res.send(appResponse("validated User successfully", validateSuccess));
	}
}

export default new User();
