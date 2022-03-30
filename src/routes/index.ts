import { Router } from "express";
import AuthRouter from "./AuthRouter";
import UserRouter from "./UserRouter";
import PropertyRouter from "./PropertyRouter";

export = (router:Router) => {
	router.use(AuthRouter());
	router.use(UserRouter());
	router.use(PropertyRouter());
	return router;
};