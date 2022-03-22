import { Router } from "express";
import { userSchema } from "../schemaValidation/user.ValidationSchema";
import validateResource from "../middlewares/validateResource";
import userController from "../controllers/userController";

const router = Router();
export = function () {
	router.post(
		"/auth/create-user",
		validateResource(userSchema),
		userController.createUserHandler,
	);

	return router;
};
