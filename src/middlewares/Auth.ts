import { NextFunction, Request, Response } from "express";
import { UnAuthorizedError } from "../../lib/appErrors";

export const authentication = (req: Request, res: Response, next: NextFunction) => {
	const user = res.locals.user;
	if (!user) throw new UnAuthorizedError("User is unauthorized");

	return next();
};
