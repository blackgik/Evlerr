"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const appErrors_1 = require("../../lib/appErrors");
const authentication = (req, res, next) => {
    const user = res.locals.user;
    if (!user)
        throw new appErrors_1.UnAuthorizedError("User is unauthorized");
    return next();
};
exports.authentication = authentication;
