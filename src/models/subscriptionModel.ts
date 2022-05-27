import mongoose from "mongoose";
import { SubscriptionDocument } from "../interfaces/Isubscription";

const subscriptionSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		plan: { 
            type: String,
            enum: ["none", "premium", "extended_plan", "standard_plan"],
            default: "none",
            trim: true,
            lowercase: true
        },
        duration: String,
        listingsCount: String,
		isActive: { type: Boolean, default: false },
        endDate: { type: Date, default: null }
	},
	{ timestamps: true },
);

subscriptionSchema.methods.toJSON = function () {
	const self = this;
	const selfObject = self.toObject();

	return selfObject;
};

// check subscription status
subscriptionSchema.methods.isActive = function () {
    const expired = this.plan !== "none" && this.endDate < new Date().getTime();
    if (expired){ this.plan = "none"; this.endDate = null; this.isActive = false; return this.isActive };
    return this.isActive;
}

export default mongoose.model< SubscriptionDocument >("Subscription", subscriptionSchema);
