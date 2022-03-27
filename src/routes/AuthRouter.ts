import { Router } from "express";
import {
	forgotPasswordSchema,
	resetPasswordSchema,
	sessionSchema,
	userSchema,
	verificationTokenSchema,
} from "../schemaValidation/user.ValidationSchema";
import validateResource from "../middlewares/validateResource";
import userController from "../controllers/authController";
import sessionController from "../controllers/sessionController";
import { authentication } from "../middlewares/Auth";
import { valuesIn } from "lodash";

const router = Router();
export = function () {
	router.post(
		"/auth/create-user",
		validateResource(userSchema),
		userController.createUserHandler,
	);
	router.post(
		"/auth/createSession",
		validateResource(sessionSchema),
		sessionController.createSessionHandler,
	);
	router.get(
		"/auth/get-sessions",
		authentication,
		sessionController.getSessionsHandler,
	);
	router.delete(
		"/auth/delete-session",
		authentication,
		sessionController.deleteSessionHandler,
	);
	router.get(
		"/auth/verfity-token",
		validateResource(verificationTokenSchema),
		userController.validateTokenHandler,
	);

	router.post(
		"/auth/forgot-password",
		validateResource(forgotPasswordSchema),
		userController.forgotPasswordHandler,
	);
	router.get(
		"/auth/reset-password",
		// validateResource(resetPasswordSchema),
		userController.resetPasswordHandler,
	);

	return router;
};
