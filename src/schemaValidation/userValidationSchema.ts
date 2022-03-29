import { object, string, TypeOf } from "zod";

export const PublicIdValidationSchema = object({
	query: object({
		publicId: string({
			required_error: "public id must be a string",
		}),
	}),
});

export const UpdateProfileValidationSchema = object({
	body: object({
		fullName: string().optional(),
		description: string().optional(),
		profilePicture: object({
			url: string().optional(),
			publicId: string().optional(),
		}).optional(),
		web: string().optional(),
		phone: string().optional(),
		fax: string().optional(),
		friendlyAddress: string().optional(),
		mapLocation: string().optional(),
		socials: string().array().optional(),
		country: string().optional(),
		isVerified: string().optional(),
	}),
});

export type publicIdString = TypeOf<typeof PublicIdValidationSchema>;
export type updateInput = TypeOf<typeof UpdateProfileValidationSchema>;
