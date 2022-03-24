import { Router } from "express";
import { sessionSchema, userSchema } from "../schemaValidation/user.ValidationSchema";
import validateResource from "../middlewares/validateResource";
import userController from "../controllers/userController";
import sessionController from "../controllers/sessionController";
import { authentication } from "../middlewares/Auth";

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
	router.get("/auth/get-sessions", authentication, sessionController.getSessionsHandler);
	router.delete("/auth/delete-session", authentication, sessionController.deleteSessionHandler)

	return router;
};
