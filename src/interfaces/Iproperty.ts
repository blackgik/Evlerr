import mongoose from "mongoose";

type Omitt<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omitt<T, K> & Partial<Pick<T, K>>;

export interface PropertyDocument extends mongoose.Document {
	propertyTitle: string | undefined;
	propertyType?: string | undefined;
	propertyDescription?: string | undefined;
	propertyId?: string | undefined;
	parentProperty?: string | undefined;
	status?: string | undefined;
	label?: string | undefined;
	material?: string | undefined;
	rooms?: string | undefined;
	bed?: string | undefined;
	bath?: string | undefined;
	garage?: string | undefined;
	yearBuilt?: string | undefined;
	homeArea?: string | undefined;
	energyClass?: string | undefined;
	energyIndex?: string | undefined;
	price?: string | undefined;
	pricePrefix?: string | undefined;
	priceSuffix?: string | undefined;
	priceCustom?: string | undefined;
	region?: string | undefined;
	friendlyAddress?: string | undefined;
	mapLocation?: string | undefined;
	longtitude?: string | undefined;
	latitude?: string | undefined;
	featuredImage?: {
		url?: string | undefined;
		publicId?: string | undefined;
	};
	gallery?: string[];

	attachment?: {
		url?: string | undefined;
		publicId?: string | undefined;
	}[];

	videoLink?: string | undefined;
	amenities?: string | undefined[];
	facilities?: {
		key?: string | undefined;
		value?: string | undefined;
	}[];

	valuation?: {
		key?: string | undefined;
		value?: string | undefined;
	}[];

	floors?: {
		name?: string | undefined;
		rooms?: string | undefined;
		baths?: string | undefined;
		size?: string | undefined;
		content?: string | undefined;
		previewImage?: {
			url?: string | undefined;
			publicId?: string | undefined;
		};
	}[];
	createdAt?: Date;
	updatedAt?: Date;
	agentId?: mongoose.Types.ObjectId;
}

// export type propertySchemaInput = PartialBy<
// 	PropertyDocument,
// 	| "floors" | "propertyType"
// 	| "propertyDescription"| "propertyId"| "parentProperty"
// 	| "status"| "label"| "material"| "rooms"| "bed"| "bath"| "garage"
// 	| "yearBuilt"| "homeArea"| "energyClass"| "energyIndex"
// 	| "price"| "pricePrefix"| "priceSuffix"| "priceCustom"
// 	| "region"| "friendlyAddress"| "longtitude"| "latitude"
// 	| "featuredImage"| "mapLocation"| "gallery" | "attachment"
//     | "videoLink" | "amenities"| "facilities" | "valuation"
//     | "agentId"| "createdAt"| "updatedAt"
// >;
