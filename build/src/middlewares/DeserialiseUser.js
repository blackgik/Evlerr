"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const jwtUtils_1 = require("../utils/jwtUtils");
const sessionService_1 = __importDefault(require("../services/sessionService"));
const authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (0, lodash_1.get)(req, "headers.x-access-token");
    const refreshToken = (0, lodash_1.get)(req, "headers.x-refresh-token");
    if (!accessToken) {
        return next();
    }
    const { decoded, expired } = (0, jwtUtils_1.verifyJwt)(accessToken);
    if (decoded) {
        res.locals.user = decoded;
        return next();
    }
    if (expired && refreshToken) {
        const newAccessToken = yield sessionService_1.default.reIssueAccessToke({ refreshToken });
        if (newAccessToken) {
            res.setHeader("x-access-tokn", newAccessToken);
            const { decoded } = (0, jwtUtils_1.verifyJwt)(newAccessToken);
            res.locals.user = decoded;
            return next();
        }
        return next();
    }
    return next();
});
exports.default = authorization;
