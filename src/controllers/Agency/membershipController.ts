import { Request, Response } from "express";
import { get } from "lodash";
import {
    deleteInput,
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

    async deleteMemeberHandler(	req: Request<{}, {}, {}, deleteInput["query"]>,
    res: Response) {
        const {memberId} = req.query;

        const deletedAgent =  await membershipService.deleteMember({memberId})

        res.send(appResponse("deleted agent successfully", deletedAgent))
    }
}

export default new Membership();
