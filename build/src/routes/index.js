"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const UserRouter_1 = __importDefault(require("./UserRouter"));
module.exports = (router) => {
    router.use((0, UserRouter_1.default)());
    return router;
};
