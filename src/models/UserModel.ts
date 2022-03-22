import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import config from "config";
import { BadRequestError, InvalidError } from "../../lib/appErrors";

export interface UserDocument extends mongoose.Document {
	username: string;
	password: string;
	email: string;
	role: string;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, trim: true, min: 3 },
		password: {
			type: String,
			required: true,
			min: 3,
			validate(value: string) {
				if (value.includes("123")) {
					throw new BadRequestError("password includes hackable characters");
				}
			},
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			validate(value: string) {
				if (!validator.isEmail(value))
					throw new BadRequestError("value is not of Email type");
			},
		},
		role: { type: String, default: "user", enum: ["user", "agent", "agency"] },
	},
	{ timestamps: true },
);

userSchema.pre("save", async function (next) {
	const self = this as UserDocument;

	if (!self.isModified("password")) return next();

	const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
	const hashPassword = await bcrypt.hash(self.password, salt);

	self.password = hashPassword;

	return next();
});

userSchema.methods.comparePasswords = async function (
	candidatePassword: string,
): Promise<Boolean> {
	const self = this as UserDocument;

	return await bcrypt.compare(candidatePassword, self.password).catch((e) => false);
};

export default mongoose.model("User", userSchema);
