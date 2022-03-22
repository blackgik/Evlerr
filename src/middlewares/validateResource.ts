import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import appResponse from "./../../lib/appResponse"
import { NotFoundError } from "../../lib/appErrors";

const validate =
	(schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
            next();
		} catch (e: any) {
            throw new NotFoundError(e.message)
		}
	};

export default validate;
