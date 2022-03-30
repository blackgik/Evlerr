import mongoose from "mongoose";
import { UserDocument } from "../interfaces/Iuser";
import { SessionDocument } from "../interfaces/Isession";

const sessionSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		valid: { type: Boolean, default: true },
		userAgent: { type: String },
	},
	{ timestamps: true },
);

sessionSchema.methods.toJSON = function () {
	const self = this;
	const selfObject = self.toObject();

	return selfObject;
};

export default mongoose.model<SessionDocument>("Session", sessionSchema);
