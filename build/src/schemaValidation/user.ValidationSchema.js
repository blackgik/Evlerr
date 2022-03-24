"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        username: (0, zod_1.string)({
            required_error: "username is required",
        }),
        password: (0, zod_1.string)({
            required_error: "password is required",
        }).min(6, "password too short, should be 6 characters minimum"),
        email: (0, zod_1.string)({
            required_error: "email is required",
        }).email("Not a valid email"),
        confirmPassword: (0, zod_1.string)({
            required_error: "confirm password is required",
        }),
        role: (0, zod_1.string)({
            required_error: "role is required",
        }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "passwords do not match",
        path: ["confirmPassword"],
    }),
});
exports.sessionSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "email is required",
        }),
        password: (0, zod_1.string)({
            required_error: "password is required",
        }).min(6, "password too short, should be 6 characters minimum"),
    }),
});
