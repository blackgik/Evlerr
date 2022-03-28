import { Router } from "express";
import validateResource from "../middlewares/validateResource";
import userController from "../controllers/userController";
import { authentication, authFunctions } from "../middlewares/Auth";

const router = Router();

export = function () {
	router.get(
		"/user/me",
		authentication,
		authFunctions,
		userController.MyProfileHandler,
	);
	return router;
};
