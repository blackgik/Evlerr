import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import sessionsModel, { SessionDocument } from "../models/sessionsModel";
import { signJwt, verifyJwt } from "../utils/jwtUtils";
import userServices from "./userServices";

class Session {
	async createSession(userId: string, userAgent: string) {
		const session = await sessionsModel.create({ user: userId, userAgent });

		return session;
	}

	async findSessions(query: FilterQuery<SessionDocument>) {
		return await sessionsModel.find(query).lean();
	}

	async deleteSession(
		query: FilterQuery<SessionDocument>,
        update:UpdateQuery<SessionDocument>
	) {
        await sessionsModel.updateOne(query, )
		return await sessionsModel.remove(query);
	}

    async reIssueAccessToke({refreshToken}: {refreshToken:string }) {
         const {decoded} = verifyJwt(refreshToken) 

         if(!decoded || !get(decoded, "session")) return false
         
         const session = await sessionsModel.findById(get(decoded, "session"))

         if(!session || !session.valid) return false

         const user = await userServices.findUser({_id: session.user});

         if(!user) return false

         //  create an acess token
		const accessToken = signJwt(
			{ ...user, session: session._id },
			{ expiresIn: config.get("accessTokenLT") },
		);

        return accessToken;
    }
}

export default new Session();
