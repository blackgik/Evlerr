import { Router } from "express";
import AuthRouter from "./AuthRouter";
import UserRouter from "./UserRouter";
import MembershipRouter from "./Agency/MembershipRouter"
import PropertyRouter from "./PropertyRouter";

export = (router:Router) => {
	router.use(AuthRouter());
	router.use(UserRouter());
	router.use(PropertyRouter());
	router.use("/agency", MembershipRouter())
	return router;
};