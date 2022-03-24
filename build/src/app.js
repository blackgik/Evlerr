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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("config"));
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const connect_1 = __importDefault(require("./database/connect"));
const logger_1 = __importDefault(require("./utils/logger"));
const DeserialiseUser_1 = __importDefault(require("./middlewares/DeserialiseUser"));
const ErrorHandler_1 = require("./middlewares/ErrorHandler");
const appErrors_1 = require("../lib/appErrors");
const router = express_1.default.Router();
const rootRouter = (0, index_1.default)(router);
const app = (0, express_1.default)();
/**
 * Middlewares go here for the application.
 * if it gets to cumbersome then we can move to seperate file
 *
 */
app.use(express_1.default.json()); //for parsing application/json
app.use(express_1.default.urlencoded({ extended: false })); //for parsing application/x-www-form-urlencoded
app.use((0, cors_1.default)());
app.use(DeserialiseUser_1.default);
//  defining the port
const port = config_1.default.get("port");
app.get("/status", (req, res, next) => {
    res.status(200).json({
        message: "Server is up and running",
    });
});
app.use("/api/v1", rootRouter);
// if route is not handled to the point, return a 404 error
app.use((req, res, next) => {
    next(new appErrors_1.NotFoundError());
});
// handle Errors Centrally in the error Middleware
app.use(ErrorHandler_1.ErrorHandler);
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`server is up on port  ${port}`);
    yield (0, connect_1.default)();
}));
