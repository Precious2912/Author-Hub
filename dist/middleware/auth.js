"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRETKEY;
const userModel_1 = require("../model/userModel");
async function auth(req, res, next) {
    try {
        const authorization = req.headers.authorization.split(' ')[1];
        if (!authorization) {
            res.status(401).json({
                Error: 'kindly sign in as a user'
            });
        }
        const token = authorization;
        const verified = jsonwebtoken_1.default.verify(token, secret);
        if (!verified) {
            return res.status(401).json({
                Error: "User not verified, you can't access this route"
            });
        }
        const { _id } = verified;
        const user = await userModel_1.User.findOne({ _id });
        if (!user) {
            return res.status(404).json({
                Error: 'User not verified'
            });
        }
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(403).json({
            Error: 'User not logged in'
        });
    }
}
exports.auth = auth;
