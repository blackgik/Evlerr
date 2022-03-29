import config from "config";
import { BadRequestError, InternalServerError } from "./appErrors";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: config.get<string>("cloudName"),
	api_key: config.get<string>("apiKey"),
	api_secret: config.get<string>("apiSecret"),
	secure: true,
});

export const uploadToCloud = function (filename: string) {
	const upload = cloudinary.uploader.upload(
		filename,
		{ resource_type: "raw" },
		function (error: any, result: object) {
			if (error) throw new BadRequestError("Invalid file Path");
			return result;
		},
	);

	return upload;
};

export const deleteFromCloud = function (publicId: string) {
	const deletePicture = cloudinary.uploader.destroy(
		publicId,
        { resource_type: "raw" },
		function (err: any, result: object) {
			if (err)
				throw new InternalServerError("Having problems deleting this picture");
			return result;
		},
	);

	return deletePicture;
};
