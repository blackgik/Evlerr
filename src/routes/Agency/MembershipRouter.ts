import { Router } from "express";
import validateResource from "./../../middlewares/validateResource";
import { authentication, authFunctions } from "./../../middlewares/Auth";
import {
	AddMemberSchema,
	deleteMemberSchema,
	memberSearchSchema
} from "../../schemaValidation/agencyMemebershipValidationSchema";
import membershipController from "../../controllers/Agency/membershipController";

const router = Router();

export = function () {
	router.post(
		"/add-member",
		[validateResource(AddMemberSchema), authentication, authFunctions],
		membershipController.addMemberHandler
	);
	router.get(
		"/search-members",
		[validateResource(memberSearchSchema), authentication, authFunctions],
		membershipController.searchMemberHandler
	);
	router.delete(
		"/delete-member",
		[validateResource(deleteMemberSchema), authentication, authFunctions],
		membershipController.deleteMemeberHandler
	);
	return router;
};
