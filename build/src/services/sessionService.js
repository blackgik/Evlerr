"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const sessionsModel_1 = __importDefault(require("../models/sessionsModel"));
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
}
exports.default = new Session();
