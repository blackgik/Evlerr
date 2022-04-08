import mongoose from "mongoose";
import { StringifyOptions } from "querystring";

export interface UserDocument extends mongoose.Document {
	username: string;
	isVerified: boolean;
	password: string;
	email: string;
	fullName: string;
	description: string;
	profilePicture: object;
	job:string;
	web: string;
	phone: string;
	fax: string;
	friendlyAddress: string;
	mapLocation: string;
	socials: string[];
	country: string;
	role: string;
	companyId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<Boolean>;
}

export interface PasswordChangeDocument {
	oldPassword: string;
	newPassword: string;
	confirmPassword:string
}