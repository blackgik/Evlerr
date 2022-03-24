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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const appErrors_1 = require("../../lib/appErrors");
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, trim: true, min: 3 },
    password: {
        type: String,
        required: true,
        min: 3,
        validate(value) {
            if (value.includes("123")) {
                throw new appErrors_1.BadRequestError("password includes hackable characters");
            }
        },
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator_1.default.isEmail(value))
                throw new appErrors_1.BadRequestError("value is not of Email type");
        },
    },
    role: { type: String, default: "user", enum: ["user", "agent", "agency"] },
    companyId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
userSchema.index({ email: "text", username: "text", companyId: "text" });
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = this;
        if (!self.isModified("password"))
            return next();
        const salt = yield bcrypt_1.default.genSalt(config_1.default.get("saltWorkFactor"));
        const hashPassword = yield bcrypt_1.default.hash(self.password, salt);
        self.password = hashPassword;
        return next();
    });
});
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = this;
        return yield bcrypt_1.default.compare(candidatePassword, self.password).catch((e) => false);
    });
};
exports.default = mongoose_1.default.model("User", userSchema);
