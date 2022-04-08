import { Request, Response } from "express";
import XLSX from "xlsx";
import authController from "../controllers/authController";
import PropertyModel from "../models/PropertyModel";
import UserModel from "../models/UserModel";
import authService from "../services/authService";
import appResponse from "./../../lib/appResponse";

class Xcless {
	async XcelReader(req: Request, res: Response) {
		const file = req.file!.path;
		const workbook = XLSX.readFile(file);
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];
		const header = [
			"index",
			"url",
			"property_title",
			"price",
			"gallery",
			"propDescription",
			"propertyAgent",
			"propertycity",
			"propAddress",
			"propDetails"
		];

		let result: any[] = XLSX.utils.sheet_to_json(worksheet, {
			header,
			raw: true
		});

		result = result.slice(1);
	let main = []
        for(let props of result) {
            // find agents
            const agent = await UserModel.findOne({username: props.propertyAgent.trim()})
            if(agent) {
                let gallery = props.gallery.slice(1, props.gallery.length-1)
                let gallerya = gallery.split(",")
        
                const data = {
                    propertyTitle: props.property_title,
                    propertyDescription: props.propDescription,
                    price: props.price,
                    gallery: gallerya,
                    friendlyAddress: props.propAddress,
                    region: props.propertycity,
                    agentId: agent._id
                }

                const createdProperty = await PropertyModel.create(data)

                main.push(createdProperty)
            }
            
        }
		res.send(appResponse("created fine", main));
	}
}

export default new Xcless();