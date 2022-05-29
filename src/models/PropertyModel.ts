import mongoose from "mongoose";
import { PaginateModel } from "mongoose";
import config from "config";
import { PropertyDocument } from "../interfaces/Iproperty";
import paginate from "mongoose-paginate-v2";

const propertySchema = new mongoose.Schema(
	{
		propertyTitle: { type: String, required: true, trim: true },
		propertyType: { type: String, trim: true },
		propertyDescription: { type: String, trim: true },
		propertyId: { type: String, trim: true },
		parentProperty: { type: String, trim: true },
		status: { type: String, trim: true },
		label: { type: String, trim: true },
		material: { type: String, trim: true },
		rooms: { type: String, trim: true },
		bed: { type: String, trim: true },
		bath: { type: String, trim: true },
		garage: { type: String, trim: true },
		yearBuilt: { type: String, trim: true },
		homeArea: { type: String, trim: true },
		energyClass: { type: String, trim: true },
		energyIndex: { type: String, trim: true },
		price: { type: String, trim: true },
		pricePrefix: { type: String, trim: true },
		priceSuffix: { type: String, trim: true },
		priceCustom: { type: String, trim: true },
		region: { type: String, trim: true },
		friendlyAddress: { type: String, trim: true },
		mapLocation: { type: String, trim: true },
		longtitude: { type: String, trim: true },
		latitude: { type: String, trim: true },
		featuredImage: {
			url: { type: String, trim: true },
			publicId: { type: String, trim: true }
		},
		gallery: {
			type: Array
		},
		attachment: [
			{
				url: { type: String, trim: true },
				publicId: { type: String, trim: true }
			}
		],
		videoLink: { type: String, trim: true },
		amenities: [{ type: String, trim: true }],
		facilities: [
			{
				key: { type: String, trim: true },
				value: { type: String, trim: true }
			}
		],
		valuation: [
			{
				key: { type: String, trim: true },
				value: { type: String, trim: true }
			}
		],
		floors: [
			{
				name: { type: String, trim: true },
				rooms: { type: String, trim: true },
				baths: { type: String, trim: true },
				size: { type: String, trim: true },
				content: { type: String, trim: true },
				previewImage: {
					url: { type: String, trim: true },
					publicId: { type: String, trim: true }
				}
			}
		],
		agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
	},
	{ timestamps: true }
);

// plugin paginate
propertySchema.plugin(paginate);


propertySchema.index({
	_id: "text",
	propertyType: "text",
	label: "text",
	price: "text"
});

// add pagination to exported model
export default mongoose.model<
	PropertyDocument,
	PaginateModel<PropertyDocument>>("Property", propertySchema);
