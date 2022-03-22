import { object, string, TypeOf } from "zod";

export const userSchema = object({
	body: object({
		username: string({
			required_error: "username is required",
		}),
		password: string({
			required_error: "password is required",
		}).min(6, "password too short, should be 6 characters minimum"),
		email: string({
			required_error: "email is required",
		}).email("Not a valid email"),
		confirmPassword: string({
			required_error: "confirm password is required",
		}),
		role: string({
			required_error: "role is required",
		}),
	}).refine((data) => data.password === data.confirmPassword, {
		message: "passwords do not match",
		path: ["confirmPassword"],
	}),
});

export type createUserInput = Omit<TypeOf<typeof userSchema>, "body.confirmPassword">;
