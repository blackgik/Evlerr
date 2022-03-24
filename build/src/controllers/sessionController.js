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
const config_1 = __importDefault(require("config"));
const sessionService_1 = __importDefault(require("../services/sessionService"));
const userServices_1 = __importDefault(require("../services/userServices"));
const appResponse_1 = __importDefault(require("./../../lib/appResponse"));
const jwtUtils_1 = require("../utils/jwtUtils");
class Session {
    createSessionHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // we need to validate the password
            const user = yield userServices_1.default.validatePassword(req.body);
            // create a session;
            const userSession = yield sessionService_1.default.createSession(user._id, req.headers["user-agent"] || "");
            //  create an acess token
            const accessToken = (0, jwtUtils_1.signJwt)(Object.assign(Object.assign({}, user), { session: userSession._id }), { expiresIn: config_1.default.get("accessTokenLT") });
            // create a refresh token
            const refreshToken = (0, jwtUtils_1.signJwt)(Object.assign(Object.assign({}, user), { session: userSession._id }), { expiresIn: config_1.default.get("refreshTokenLT") });
            // return access and refresh token
            res.send((0, appResponse_1.default)("login successfully", { accessToken, refreshToken }));
        });
    }
    getSessionsHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = res.locals.user._id;
            const sessions = yield sessionService_1.default.findSessions({ userId, valid: true });
            res.send((0, appResponse_1.default)("got sessions successfully", sessions));
        });
    }
    deleteSessionHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionId = res.locals.user.session;
            const deleteSession = yield sessionService_1.default.deleteSession({ _id: sessionId }, { valid: false });
            res.send((0, appResponse_1.default)("deleted session", { accessToken: null, refreshToken: null }));
        });
    }
    reIssueAccessToken() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = new Session();
