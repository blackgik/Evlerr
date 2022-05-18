import mongoose from "mongoose";
import { UserDocument } from "../interfaces/Iuser";
export interface SubscriptionDocument extends mongoose.Document {
	user: UserDocument["_id"];
    plan: string;
    duration: string;
    listingsCount: string;
    isActive: boolean;
    endDate: Date;
	createdAt: Date;
	updatedAt: Date;
}