import { Request, Response } from "express";
import { propertyIdInput, propertyInput } from "../schemaValidation/propertyVallidationSchema";
import propertyService from "../services/propertyService";
import appResponse from "./../../lib/appResponse";

class Property {
	async submitPropetyHandler(req: Request<{}, {}, propertyInput["body"]>, res: Response) {
		const user = res.locals.user;
		const body = req.body;
		const submittedProperty = await propertyService.submitPropety(user, body);

		res.send(appResponse("submitted propert successfuly", submittedProperty));
	}

	async deletePropertyHandler(req: Request<propertyIdInput["params"]>, res: Response) {
		const { propertyId } = req.params;

		const deletedProperty = await propertyService.deleteProperty({
			_id: propertyId
		});

		res.send(appResponse("deleted property successfully", deletedProperty));
	}

	async viewPropertyHandler(req: Request<propertyIdInput["params"]>, res: Response) {
		const { propertyId } = req.params;

		const property = await propertyService.viewProperty({ _id: propertyId });

		res.send(appResponse("viewing property successfully", property));
	}

	async viewAllProperties(req: Request, res: Response) {
		const user = res.locals.user;
		const getUserProperties = await propertyService.fetchUserProperties({
			agentId: user._id
		}, req);

		res.send(appResponse("fetched properties successfully", getUserProperties));
	}

	async publicPropertiesHandler(req: Request, res: Response) {
		const properties = await propertyService.publicProperties(req);

		res.send(appResponse("fetched properties successfully", properties));
	}

	async searchPropertyHandler(req: Request, res: Response) {
		const { search } = req.body;
		const query = typeof search !== "undefined" ? search.trim().toLowerCase() : false;
		const rgx = (pattern: string) => new RegExp(`${pattern}`, `gi`);
		const searchRgx = rgx(query);

		const foundProperties = await propertyService.searchProperty(searchRgx)

		res.send(appResponse("fetched property in city successfully", foundProperties))
	}
}

export default new Property();