"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = exports.options = exports.generateToken = exports.loginUserSchema = exports.updateUserSchema = exports.createUserSchema = exports.updateBookSchema = exports.createBookSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.createBookSchema = joi_1.default.object().keys({
    name: joi_1.default.string().lowercase().required(),
    isPublished: joi_1.default.boolean().required(),
    datePublished: joi_1.default.number().required(),
    serialNumber: joi_1.default.number().required(),
    imageURL: joi_1.default.string().required()
});
exports.updateBookSchema = joi_1.default.object().keys({
    name: joi_1.default.string().lowercase(),
    isPublished: joi_1.default.boolean(),
    datePublished: joi_1.default.number(),
    serialNumber: joi_1.default.number(),
    imageURL: joi_1.default.string().required()
});
exports.createUserSchema = joi_1.default.object().keys({
    author: joi_1.default.string().lowercase().required(),
    dateRegistered: joi_1.default.number().required(),
    age: joi_1.default.number().required(),
    email: joi_1.default.string().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password: joi_1.default.ref('password'),
    address: joi_1.default.string().lowercase().required()
}).with('password', 'confirm_password');
exports.updateUserSchema = joi_1.default.object().keys({
    author: joi_1.default.string().lowercase(),
    dateRegistered: joi_1.default.number(),
    age: joi_1.default.number(),
    email: joi_1.default.string().lowercase(),
    password: joi_1.default.string(),
    address: joi_1.default.string().lowercase()
});
exports.loginUserSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
});
//Generate token
const generateToken = (user) => {
    const password = process.env.JWT_SECRETKEY;
    const token = jsonwebtoken_1.default.sign(user, password, { expiresIn: '7d' });
    return token;
};
exports.generateToken = generateToken;
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
function pagination(model) {
    return async function paginate(req, res, next) {
        const params = req.query.page;
        const params__ = req.query.limit;
        const page = parseInt(params);
        const limit = parseInt(params__);
        if (!page && !limit) {
            const result = await model.find().exec();
            // console.log(result)
            if (result.length === 0) {
                res.status(404).send({
                    status: "Failed",
                    result
                });
                return;
            }
            res.status(200).send({
                status: "success",
                result,
            });
            return;
        }
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};
        if (endIndex < (await model.countDocuments().exec())) {
            result.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        try {
            result.users = await model.find().limit(limit).skip(startIndex);
            //   res.status(200).send(result);
            res.paginatedResult = result;
            next();
        }
        catch (err) {
            res.status(404).json({
                status: "fail",
                message: err,
            });
        }
    };
}
exports.pagination = pagination;
