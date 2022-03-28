import { Request, Response } from "express";
import appResponse from "./../../lib/appResponse";

class User {
    async MyProfileHandler(req:Request, res:Response) {
        let user = res.locals.user;

        res.send(appResponse("got my profile successfully", user))
    }
}

export default new User();