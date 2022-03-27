import { Request, Response } from "express";
import config from "config";
import logger from "../utils/logger"
import appResponse from "../../lib/appResponse"
import userService from "./../services/userServices"
import emailVerification from "../utils/mailer";

import { createUserInput } from "../schemaValidation/user.ValidationSchema";
import { signJwt } from "../utils/jwtUtils";


class User {
    async createUserHandler(req:Request<{}, {}, createUserInput["body"]>, res:Response) {
        try {
            const createdUser = await userService.createUser(req.body)
            
            const token = signJwt(
                { ...createdUser },
                { expiresIn: config.get("accessTokenLT") },
            );

            // send email with token
            emailVerification(createdUser.email, "Verfiy Email", token)

            res.send(appResponse("successfully registered user", createdUser))
        }catch(e:any) {
            logger.error(e)
            res.status(409).send(appResponse(e.message))
        }
    }
}

export default new User();