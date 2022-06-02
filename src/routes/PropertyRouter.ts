import { Router } from "express";
import validateResource from "../middlewares/validateResource";
import { authentication, authFunctions } from "../middlewares/Auth";
import propertyController from "../controllers/propertyController";
import {
	AgentQuerySchema,
	MediaPropSchema,
	NewPropertySchema,
	PropertyIdSchemaValidation,
	PropertySearchStringSchema,
	UpdatePropertyValidationSchema
} from "../schemaValidation/propertyVallidationSchema";
import { upload } from "./../../lib/multer";
import userController from "../controllers/userController";

const router = Router();

export = function () {
	router.post(
		"/user/pproperty/new",
		[validateResource(NewPropertySchema), authentication, authFunctions],
		propertyController.submitPropetyHandler
	);
	router.post("/media-uploader", upload.single("photo"), userController.MediaUploader);
	router.get(
		"/user/view-property/:propertyId",
		validateResource(PropertyIdSchemaValidation),
		propertyController.viewPropertyHandler
	);
	router.delete(
		"/user/delete-property/:propertyId",
		[validateResource(PropertyIdSchemaValidation), authentication, authFunctions],
		propertyController.deletePropertyHandler
	);
	router.get(
		"/user/view-properties",
		[authentication, authFunctions],
		propertyController.viewAllProperties
	);

	router.get("/user/properties", propertyController.publicPropertiesHandler);
	router.get("/search-property", validateResource(PropertySearchStringSchema),propertyController.searchPropertyHandler)
	router.get(
		"/user/get-agent-properties",
		[validateResource(AgentQuerySchema), authentication, authFunctions],
		propertyController.viewAgentProperties
	);

	router.post(
		"/user/media-upload",
		[validateResource(MediaPropSchema), upload.array("photo", 5), authentication, authFunctions],
		propertyController.mediaUploader
	);

	router.patch(
		"/user/update-property/:propertyId",
		[
			validateResource(PropertyIdSchemaValidation),
			validateResource(UpdatePropertyValidationSchema),
			authentication, authFunctions
		],
		propertyController.updatePropertyHander
	);
	return router;
};
