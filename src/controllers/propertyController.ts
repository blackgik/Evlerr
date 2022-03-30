import { Request, Response } from "express";
import { propertyIdInput, propertyInput } from "../schemaValidation/propertyVallidationSchema";
import propertyService from "../services/propertyService";
import appResponse from "./../../lib/appResponse";

class Property {
	async submitPropetyHandler(
		req: Request<{}, {}, propertyInput["body"]>,
		res: Response,
	) {
		const user = res.locals.user;
		const body = req.body;
		const submittedProperty = await propertyService.submitPropety(user, body);

		res.send(appResponse("submitted propert successfuly", submittedProperty));
	}

	async deletePropertyHandler(req: Request<propertyIdInput["params"]>, res: Response) {
		const { propertyId } = req.params;

        const deletedProperty = await propertyService.deleteProperty({_id: propertyId})

        res.send(appResponse("deleted property successfully", deletedProperty))
	}
}

export default new Property();
