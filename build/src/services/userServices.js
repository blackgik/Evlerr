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
const appErrors_1 = require("../../lib/appErrors");
const UserModel_1 = __importDefault(require("../models/UserModel"));
class User {
	createUser(input) {
		return __awaiter(this, void 0, void 0, function* () {
			try {
				return yield UserModel_1.default.create(input);
			} catch (e) {
				throw new appErrors_1.InternalServerError(e.message);
			}
		});
	}
	validatePassword({ email, password }) {
		return __awaiter(this, void 0, void 0, function* () {
			// we need to first find if the user exist;
			const user = yield UserModel_1.default.findOne({ email });
			if (!user) throw new appErrors_1.InvalidError("Invalid User");
			const isValid = yield user.comparePassword(password);
			if (!isValid) throw new appErrors_1.InvalidError("Invalid User ");
			return user.toJSON();
		});
	}
}
exports.default = new User();
