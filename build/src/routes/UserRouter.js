"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const user_ValidationSchema_1 = require("../schemaValidation/user.ValidationSchema");
const validateResource_File_1 = __importDefault(require("../middlewares/validateResource-File"));
const userController_1 = __importDefault(require("../controllers/userController"));
const sessionController_1 = __importDefault(require("../controllers/sessionController"));
const Auth_1 = require("../middlewares/Auth");
const router = (0, express_1.Router)();
module.exports = function () {
    router.post("/auth/create-user", (0, validateResource_File_1.default)(user_ValidationSchema_1.userSchema), userController_1.default.createUserHandler);
    router.post("/auth/createSession", (0, validateResource_File_1.default)(user_ValidationSchema_1.sessionSchema), sessionController_1.default.createSessionHandler);
    router.get("/auth/get-sessions", Auth_1.authentication, sessionController_1.default.getSessionsHandler);
    router.delete("/auth/delete-session", Auth_1.authentication, sessionController_1.default.deleteSessionHandler);
    return router;
};
