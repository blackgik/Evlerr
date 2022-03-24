"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appErrors_1 = require("../../lib/appErrors");
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (e) {
        const errors = JSON.parse(e.message);
        for (let err of errors) {
            throw new appErrors_1.NotFoundError(err.message);
        }
        ;
    }
};
exports.default = validate;
