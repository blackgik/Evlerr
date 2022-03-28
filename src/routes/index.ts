import { Router } from "express";
import AuthRouter from "./AuthRouter";
import UserRouter from "./UserRouter";

export = (router:Router) => {
	router.use(AuthRouter());
	router.use(UserRouter());
	return router;
};