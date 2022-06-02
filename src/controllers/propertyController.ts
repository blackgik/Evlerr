import { Request, Response } from "express";
import { BadRequestError } from "../../lib/appErrors";
import {
	agentQuery,
	mediaProp,
	propertyIdInput,
	propertyInput,
	searchString,
	updateInput
} from "../schemaValidation/propertyVallidationSchema";
import propertyService from "../services/propertyService";
import appResponse from "./../../lib/appResponse";

class Property {
	async submitPropetyHandler(
		req: Request<{}, {}, propertyInput["body"]>,
		res: Response
	) {
		const user = res.locals.user;
		const body = req.body;
		const submittedProperty = await propertyService.submitPropety(user, body);

		res.send(appResponse("submitted propert successfuly", submittedProperty));
	}

	async deletePropertyHandler(
		req: Request<propertyIdInput["params"]>,
		res: Response
	) {
		const { propertyId } = req.params;

		const deletedProperty = await propertyService.deleteProperty({
			_id: propertyId
		});

		res.send(appResponse("deleted property successfully", deletedProperty));
	}

	async viewPropertyHandler(
		req: Request<propertyIdInput["params"]>,
		res: Response
	) {
		const { propertyId } = req.params;

		const property = await propertyService.viewProperty({ _id: propertyId });

		res.send(appResponse("viewing property successfully", property));
	}

	async viewAllProperties(req: Request, res: Response) {
		const user = res.locals.user;
		const getUserProperties = await propertyService.fetchUserProperties(
			{
				agentId: user._id
			},
			req
		);

		res.send(appResponse("fetched properties successfully", getUserProperties));
	}

	async publicPropertiesHandler(req: Request, res: Response) {
		const properties = await propertyService.publicProperties(req);

		res.send(appResponse("fetched properties successfully", properties));
	}

	async searchPropertyHandler(req: Request<{}, {},{}, searchString["query"]>, res: Response) {
		const { search, status }= req.query;
		delete req.query?.search; delete req.query?.status;
		let advSearch:any = req.query,
			queryPattern: string = "";

		// preprocess advanced search queries
		if (
			Object.keys(advSearch).includes("filter-amenity") &&
			Array.isArray(advSearch["filter-amenity"])
		) {
			advSearch["filter-amenity"] = advSearch["filter-amenity"]?.join("|");

			let advSearchValues = Object.values(advSearch);
			if (Array.isArray(advSearchValues)) {
				advSearchValues = advSearchValues.filter((e) => {
					return e !== "";
				});
				queryPattern = advSearchValues.join("|").trim().toLowerCase();
			}
		}

		const query =
			typeof search !== "undefined" ? search.trim().toLowerCase() : ".*(?:)",
			statusQuery = typeof status !== "undefined" ? status.trim().toLowerCase() : "rent";
		queryPattern = queryPattern === "" ? ".*(?:)" : queryPattern;
		const rgx = (pattern: string) => new RegExp(`${pattern}`, `gi`);
		const searchRgx = rgx(query),
			filterRgx = rgx(queryPattern),
			statusRgx = rgx(statusQuery);

		const foundProperties = await propertyService.searchProperty(
			searchRgx,
			filterRgx,
			req.query,
			statusRgx
		);

		res.send(
			appResponse("fetched property in city successfully", foundProperties)
		);
	}

	async viewAgentProperties(req: Request<agentQuery["query"]>, res: Response) {
		const { agentId } = req.query;
		const getUserProperties = await propertyService.fetchAgentProperties(
			{
				agentId
			},
			req
		);
		res.send(appResponse("fetched properties successfully", getUserProperties));
	}

	async mediaUploader(req: Request<{}, {}, mediaProp["query"]>, res: Response) {
		if (!req.files) throw new BadRequestError("Missing required photo(s) type");
		const { propertyField, propertyId } = req.query, files = req.files;

		const data = await propertyService.editMedia(files, propertyField, propertyId);
		let medField = typeof propertyField !== "undefined" ? String(propertyField) : "";

		res.send(appResponse("uploaded media file successfully", data?.get(medField)));
	}

	async updatePropertyHander(req: Request<propertyIdInput["params"], updateInput["body"]>, res: Response) {
		const { propertyId } = req.params;
		const updatedProperty = await propertyService.updateProperty(propertyId, req.body);

		res.send(appResponse("updated profile successfully", updatedProperty));
	}
}

export default new Property();
