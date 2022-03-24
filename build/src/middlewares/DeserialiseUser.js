"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const jwtUtils_1 = require("../utils/jwtUtils");
const authorization = (req, res, next) => {
	const accessToken = (0, lodash_1.get)(req, "headers.x-access-token");
	if (!accessToken) {
		return next();
	}
	const { decoded, expired } = (0, jwtUtils_1.verifyJwt)(accessToken);
	if (decoded) {
		res.locals.user = decoded;
		return next();
	}
	return next();
};
exports.default = authorization;
