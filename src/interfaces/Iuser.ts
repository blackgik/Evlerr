import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
	username: string;
	isVerified: boolean;
	password: string;
	email: string;
	fullName: string;
	description: string;
	profilePicture: object;
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