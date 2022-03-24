"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const appResponse_1 = __importDefault(require("../../lib/appResponse"));
const mongooseValidationError = mongoose_1.default.Error.ValidationError;
const isProduction = process.env.NODE_ENV === "production";
const errorNames = [
	"CastError",
	"JsonWebTokenError",
	"TokenExpiredError",
	"ValidationError",
	"SyntaxError",
	"MongooseError",
	"MongoError",
	"ZodError",
];
const ErrorHandler = function (error, req, res, next) {
	if (error.name === "VobbioError" || error.isOperational) {
		return res
			.status(error.statusCode)
			.send((0, appResponse_1.default)(error.message, null, false));
	}
	if (error instanceof mongooseValidationError) {
		const errorMessages = Object.values(error.errors).map((e) => e.message);
		return res
			.status(400)
			.send(
				(0, appResponse_1.default)(
					"validation error occurred check your inputs for corrections",
					null,
					errorMessages,
				),
			);
	}
	if (error.hasOwnProperty("name") && error.name === "MongoError") {
		const data = error && error.errmsg ? error.errmsg : null;
		return res
			.status(400)
			.send((0, appResponse_1.default)("the entry already exist", data, false));
	}
	if (errorNames.includes(error.name)) {
		if (error.name === "TokenExpiredError") {
			return res
				.status(400)
				.send(
					(0, appResponse_1.default)(
						"Token has expired, Request a reset password again",
						null,
						false,
					),
				);
		}
		return res.status(400).send((0, appResponse_1.default)(error.message, null, false));
	}
	// log error
	// console.error(error);
	const message = isProduction
		? "An unexpected error has occured. Please, contact the administrator"
		: error.message;
	return res.status(500).send((0, appResponse_1.default)(message, null, false));
};
exports.ErrorHandler = ErrorHandler;
