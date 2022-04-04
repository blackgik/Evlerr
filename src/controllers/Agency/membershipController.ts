import { Request, Response } from "express";
import { get } from "lodash";
import {
	MemberInput,
	SearchInput
} from "../../schemaValidation/agencyMemebershipValidationSchema";
import membershipService from "../../services/Agency/membershipService";
import appResponse from "./../../../lib/appResponse";

class Membership {
	async addMemberHandler(
		req: Request<{}, {}, MemberInput["body"]>,
		res: Response
	) {
		const agencyId = get(res.locals.user, "_id");
		const { memberId } = req.body;

		const addedMember = await membershipService.addMembers({
			agencyId,
			memberId
		});
		res.send(appResponse("added members successfully", addedMember));
	}

	async searchMemberHandler(
		req: Request<{}, {}, SearchInput["body"]>,
		res: Response
	) {
		const { name } = req.body;

        const searchResult = await membershipService.searchMember(name)

        res.send(appResponse("found member successfully", searchResult));
	}
}

export default new Membership();
