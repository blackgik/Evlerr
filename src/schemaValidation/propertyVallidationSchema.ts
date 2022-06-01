import { object, optional, string, tuple, TypeOf } from "zod";

export const NewPropertySchema = object({
	body: object({
		propertyTitle: string(),
		propertyType: string().optional(),
		propertyDescription: string().optional(),
		propertyId: string().optional(),
		parentProperty: string().optional(),
		status: string().optional(),
		label: string().optional(),
		material: string().optional(),
		rooms: string().optional(),
		bed: string().optional(),
		bath: string().optional(),
		garage: string().optional(),
		yearBuilt: string().optional(),
		homeArea: string().optional(),
		energyClass: string().optional(),
		energyIndex: string().optional(),
		price: string().optional(),
		pricePrefix: string().optional(),
		priceSuffix: string().optional(),
		priceCustom: string().optional(),
		region: string().optional(),
		friendlyAddress: string().optional(),
		mapLocation: string().optional(),
		longtitude: string().optional(),
		latitude: string().optional(),
		featuredImage: object({
			url: string().optional(),
			publicId: string().optional(),
		}).optional(),
		gallery: object({
			url: string().optional(),
			publicId: string().optional(),
		})
			.array()
			.optional(),
		attachment: object({
			url: string().optional(),
			publicId: string().optional(),
		})
			.array()
			.optional(),
		videoLink: string().optional(),
		amenities: string().array(),
		facilities: object({ key: string().optional(), value: string().optional() })
			.array()
			.optional(),
		valuation: object({ key: string().optional(), value: string().optional() })
			.array()
			.optional(),
		floors: object({
			name: string().optional(),
			rooms: string().optional(),
			baths: string().optional(),
			size: string().optional(),
			content: string().optional(),
			previewImage: object({
				url: string().optional(),
				publicId: string().optional(),
			}),
		})
			.array()
			.optional(),
	}),
});

export const PropertyIdSchemaValidation = object({
    params: object({ 
        propertyId: string({
            required_error: "property id is required"
        })
    })
})

export const PropertySearchStringSchema = object({
	query:object({
		search: string().optional()
	})
})

export const AgentQuerySchema = object({
	query: object({
		agentId: string({
			required_error: "Agent Id is required!"
		})
	})
})

export type propertyIdInput = TypeOf<typeof PropertyIdSchemaValidation>;
export type propertyInput = TypeOf<typeof NewPropertySchema>;
export type searchString = TypeOf<typeof PropertySearchStringSchema>;
export type agentQuery = TypeOf<typeof AgentQuerySchema>;
