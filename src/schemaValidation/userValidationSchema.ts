import { object, string, TypeOf } from "zod";

export const PublicIdValidationSchema = object({
	query: object({
		publicId: string({
			required_error: "public id must be a string"
		})
	})
});

export const UpdateProfileValidationSchema = object({
	body: object({
		fullName: string().optional(),
		description: string().optional(),
		profilePicture: object({
			url: string().optional(),
			publicId: string().optional()
		}).optional(),
		web: string().optional(),
		phone: string().optional(),
		fax: string().optional(),
		friendlyAddress: string().optional(),
		mapLocation: string().optional(),
		socials: object({
			name: string().optional(),
			url: string().optional(),
		})
			.array()
			.optional(),
		country: string().optional(),
		isVerified: string().optional()
	})
});

export const userSearchSchema = object({
	query: object({
		role: string().optional()
	})
});

export const passwordUpdate = object({
	body: object({
		oldPassword: string({
			required_error: "Must be string or alpha Numberic characters"
		}).min(6, "password too short, should be 6 characters minimum"),
		newPassword: string({
			required_error: "password is required"
		}).min(6, "password too short, should be 6 characters minimum"),
		confirmPassword: string({
			required_error: "confirm password is required"
		})
	}).refine((data) => data.newPassword === data.confirmPassword, {
		message: "passwords do not match",
		path: ["confirmPassword"],
	}),
});

export const agentSupportSchema = object({
	body: object({
		name: string({
			required_error: "name is required"
		}),
		emailtTo: string({
			required_error: "email to  is required"
		}),
		phone: string({
			required_error: "phone is required"
		}),
		message: string({
			required_error: "Phone is required"
		}),
		emailFrom: string({
			required_error: "Email from is required"
		}),
	})
})

export type newPasswordInput = TypeOf<typeof passwordUpdate>
export type publicIdString = TypeOf<typeof PublicIdValidationSchema>;
export type updateInput = TypeOf<typeof UpdateProfileValidationSchema>;
export type agentSupportInput = TypeOf<typeof agentSupportSchema>;
export type userSearchInput = TypeOf<typeof userSearchSchema>;

