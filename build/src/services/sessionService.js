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
const config_1 = __importDefault(require("config"));
const sessionsModel_1 = __importDefault(require("../models/sessionsModel"));
const jwtUtils_1 = require("../utils/jwtUtils");
const userServices_1 = __importDefault(require("./userServices"));
class Session {
    createSession(userId, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield sessionsModel_1.default.create({ user: userId, userAgent });
            return session;
        });
    }
    findSessions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sessionsModel_1.default.find(query).lean();
        });
    }
    deleteSession(query, update) {
        return __awaiter(this, void 0, void 0, function* () {
            yield sessionsModel_1.default.updateOne(query);
            return yield sessionsModel_1.default.remove(query);
        });
    }
    reIssueAccessToke({ refreshToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { decoded } = (0, jwtUtils_1.verifyJwt)(refreshToken);
            if (!decoded || !(0, lodash_1.get)(decoded, "session"))
                return false;
            const session = yield sessionsModel_1.default.findById((0, lodash_1.get)(decoded, "session"));
            if (!session || !session.valid)
                return false;
            const user = yield userServices_1.default.findUser({ _id: session.user });
            if (!user)
                return false;
            //  create an acess token
            const accessToken = (0, jwtUtils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("accessTokenLT") });
            return accessToken;
        });
    }
}
exports.default = new Session();
