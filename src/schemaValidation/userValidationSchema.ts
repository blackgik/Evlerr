import { object, string, TypeOf } from "zod";

export const PublicIdValidationSchema = object({
	query: object({
		publicId: string({
			required_error: "public id must be a string",
		}),
	}),
});

export type publicIdString = TypeOf<typeof PublicIdValidationSchema>;