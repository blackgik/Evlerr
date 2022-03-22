import { Router } from "express";
import UserRouter from "./UserRouter";

export = (router:Router) => {
	router.use(UserRouter());
	return router;
};