import { object, string, TypeOf } from "zod";

export const AddMemberSchema = object({
	body: object({
		memberId: string({
			required_error: "Missing required Member id."
		})
	})
});

export const memberSearchSchema = object({
	query: object({
		name: string({
			required_error: "Missing required field: 'name'"
		})
	})
});

export const deleteMemberSchema = object({
	query: object({
		memberId: string({
			required_error: "Missing required Member id"
		})
	})
});

export const AgencyQuerySchema = object({
	query: object({
		agencyId: string({
			required_error: "Missing required Member id."
		})
	})
});

export type MemberInput = TypeOf<typeof AddMemberSchema>;
export type SearchInput = TypeOf<typeof memberSearchSchema>;
export type deleteInput = TypeOf<typeof deleteMemberSchema>;
export type agencyQuery = TypeOf<typeof AgencyQuerySchema>;
