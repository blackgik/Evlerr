"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidError = exports.DuplicateError = exports.NotFoundError = exports.ExpectationFailedError = exports.ForbiddenError = exports.UnAuthorizedError = exports.InternalServerError = exports.BadRequestError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = "EvlerrError";
        this.statusCode = statusCode;
        this.isOperational = true;
        this.date = new Date();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
class BadRequestError extends AppError {
    constructor(message = "Bad Request", statusCode = 400) {
        super(message, statusCode);
    }
}
exports.BadRequestError = BadRequestError;
class InternalServerError extends AppError {
    constructor(message = "Something wrong happened.", statusCode = 500) {
        super(message, statusCode);
    }
}
exports.InternalServerError = InternalServerError;
class UnAuthorizedError extends AppError {
    constructor(message = "Not Authorized access", statusCode = 401) {
        super(message, statusCode);
    }
}
exports.UnAuthorizedError = UnAuthorizedError;
class ForbiddenError extends AppError {
    constructor(message = "Forbidden", statusCode = 403) {
        super(message, statusCode);
    }
}
exports.ForbiddenError = ForbiddenError;
class ExpectationFailedError extends AppError {
    constructor(message = "Expected inputs were not supplied", statusCode = 417) {
        super(message, statusCode);
    }
}
exports.ExpectationFailedError = ExpectationFailedError;
class NotFoundError extends AppError {
    constructor(message = "Resource not found", statusCode = 404) {
        super(message, statusCode);
    }
}
exports.NotFoundError = NotFoundError;
class DuplicateError extends AppError {
    constructor(message = "Resource Already Exists", statusCode = 422) {
        super(message, statusCode);
    }
}
exports.DuplicateError = DuplicateError;
class InvalidError extends AppError {
    constructor(message = "Invalid Input", statusCode = 422) {
        super(message, statusCode);
    }
}
exports.InvalidError = InvalidError;
