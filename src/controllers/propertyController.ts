import { Request, Response } from "express";
import { propertyInput } from "../schemaValidation/propertyVallidationSchema";
import propertyService from "../services/propertyService";
import appResponse from "./../../lib/appResponse"

class Property {
    async submitPropetyHandler(req:Request<{},{}, propertyInput["body"]>, res:Response,) {
        const user = res.locals.user;
        const body = req.body;
        const submittedProperty = await propertyService.submitPropety(user, body)

        res.send(appResponse("submitted propert successfuly", submittedProperty))
    }

}

export default new Property();