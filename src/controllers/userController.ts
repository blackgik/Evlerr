import { Request, Response } from "express";
import logger from "../utils/logger"
import appResponse from "../../lib/appResponse"
import userService from "./../services/userServices"
import { createUserInput } from "../schemaValidation/user.ValidationSchema";

class User {
    async createUserHandler(req:Request<{}, {}, createUserInput["body"]>, res:Response) {
        try {
            const createdUser = await userService.createUser(req.body)

            res.send(appResponse("successfully registered user", createdUser))
        }catch(e:any) {
            logger.error(e)
            res.status(409).send(appResponse(e.message))
        }
    }
}

export default new User();