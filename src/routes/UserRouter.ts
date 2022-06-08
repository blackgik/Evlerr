import { Router } from "express";
import validateResource from "../middlewares/validateResource";
import userController from "../controllers/userController";
import { authentication, authFunctions } from "../middlewares/Auth";
import { upload } from "../../lib/multer";
import {
	agentSupportSchema,
	passwordUpdate,
	PublicIdValidationSchema,
	UpdateProfileValidationSchema,
	userSearchSchema
} from "../schemaValidation/userValidationSchema";
import XcelReader from "../utils/seeder";

const router = Router();

export = function () {
	router.get("/user/me", authentication, authFunctions, userController.MyProfileHandler);
	router.post(
		"/user/photo-uploader",
		[upload.single("photo"), authentication, authFunctions],
		userController.uploadProfilePicsHandler
	);
	router.delete(
		"/user/delete-profile",
		[validateResource(PublicIdValidationSchema), authentication, authFunctions],
		userController.deletePhotoHandler
	);
	router.patch(
		"/user/update-profile",
		[validateResource(UpdateProfileValidationSchema), authentication, authFunctions],
		userController.updateProfileHander
	);

	router.patch(
		"/user/update-password",
		[validateResource(passwordUpdate), authentication, authFunctions],
		userController.updatePasswordHandler
	);

	router.post(
		"/agent/support",
		validateResource(agentSupportSchema),
		userController.agentSupportHandler
	);

	router.post("/xcel", upload.single("file"), XcelReader.XcelReader);
	router.get(
		"/user/get-users",
		validateResource(userSearchSchema),
		userController.getUserHandler
	);

	router.get(
		"/user/dashboard",
		[authentication, authFunctions],
		userController.getDashboardHandler
	);
	
	return router;
};
