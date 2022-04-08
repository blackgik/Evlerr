import { Router } from "express";
import validateResource from "../middlewares/validateResource";
import userController from "../controllers/userController";
import { authentication, authFunctions } from "../middlewares/Auth";
import { upload } from "../../lib/multer";
import {
	PublicIdValidationSchema,
	UpdateProfileValidationSchema,
} from "../schemaValidation/userValidationSchema";
import  XcelReader  from "../utils/seeder";

const router = Router();

export = function () {
	router.get(
		"/user/me",
		authentication,
		authFunctions,
		userController.MyProfileHandler,
	);
	router.post(
		"/user/photo-uploader",
		[upload.single("photo"), authentication, authFunctions],
		userController.uploadProfilePicsHandler,
	);
	router.delete(
		"/user/delete-profile",
		[validateResource(PublicIdValidationSchema), authentication, authFunctions],
		userController.deletePhotoHandler,
	);
	router.patch(
		"/user/update-profile",
		[
			validateResource(UpdateProfileValidationSchema),
			authentication,
			authFunctions,
		],
		userController.updateProfileHander,
	);

	router.post("/xcel", upload.single("file"), XcelReader.XcelReader)
	return router;
};
