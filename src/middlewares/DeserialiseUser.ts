import { get } from "lodash";
import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwtUtils";
import sessionService from "../services/sessionService";
import UserModel from "../models/UserModel";

const authorization = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const accessToken = get(req, "headers.x-access-token");
	const refreshToken = get(req, "headers.x-refresh-token");

	if (!accessToken) {
		return next();
	}

	const { decoded, expired } = await verifyJwt(accessToken);

	if (decoded) {
		const user = await UserModel.findById(get(decoded, "_id"));

		res.locals.user = user;

		return next();
	}

	if (expired && refreshToken) {
		const newAccessToken = await sessionService.reIssueAccessToken({
			refreshToken,
		});

		if (newAccessToken) {
			res.setHeader("x-access-tokn", newAccessToken);

			const { decoded } = await verifyJwt(newAccessToken);

			const user = await UserModel.findById(get(decoded, "_id"));

			res.locals.user = user;

			return next();
		}

		return next();
	}

	return next();
};

export default authorization;
