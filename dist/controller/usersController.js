"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersAndBooks = exports.logoutUser = exports.deleteUser = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.loginUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../utils/utils");
const userModel_1 = require("../model/userModel");
const bookModel_1 = require("../model/bookModel");
async function createUser(req, res, next) {
    try {
        const validationResult = utils_1.createUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await userModel_1.User.create({
            author: req.body.author,
            dateRegistered: req.body.dateRegistered,
            age: req.body.age,
            email: req.body.email,
            address: req.body.address,
            password: passwordHash,
        });
        res.status(201).json({
            message: "account created successfully",
            record,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "email already exists",
        });
    }
}
exports.createUser = createUser;
//Login
async function loginUser(req, res, next) {
    try {
        const validationResult = utils_1.loginUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const userDetails = (await userModel_1.User.findOne({
            email: req.body.email,
        }));
        const validUser = await bcryptjs_1.default.compare(req.body.password, userDetails.password);
        if (!validUser) {
            res.status(401).json({
                msg: "Invalid email or password",
            });
        }
        const { _id, author } = userDetails;
        const token = (0, utils_1.generateToken)({ _id });
        if (validUser) {
            res.status(201).json({
                message: "login successful",
                _id,
                author,
                token,
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: "login unsuccessful" });
    }
}
exports.loginUser = loginUser;
async function getAllUsers(req, res, next) {
    try {
        const record = await userModel_1.User.find({});
        res.status(200).json({
            msg: "displaying all users",
            record,
        });
    }
    catch (err) {
        res.status(500).json({ message: "failed to display all users" });
    }
}
exports.getAllUsers = getAllUsers;
async function getSingleUser(req, res, next) {
    try {
        const { _id } = req.params;
        const verified = req.user._id;
        const userBooks = await bookModel_1.Book.find({ userId: verified });
        const record = userModel_1.User.findOne({ _id: verified })
            .populate("books")
            .exec((err, book) => {
            res.status(200).json({
                message: `showing details for user with id ${_id}`,
                record: book,
            });
        });
    }
    catch (err) {
        res.status(500).json({ message: "failed to display user" });
    }
}
exports.getSingleUser = getSingleUser;
async function updateUser(req, res, next) {
    try {
        const id = req.params._id;
        const { author, dateRegistered, age, email, password, address } = req.body;
        const validationResult = utils_1.updateUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await userModel_1.User.findByIdAndUpdate(id, req.body, { new: true });
        if (record) {
            res.status(202).json({
                msg: "successfully updated user info",
                record,
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: "failed to update user info" });
    }
}
exports.updateUser = updateUser;
async function deleteUser(req, res, next) {
    try {
        const id = req.params._id;
        const record = await userModel_1.User.findByIdAndDelete(id);
        console.log("got here");
        if (!record) {
            res.status(404).json({
                msg: "cannot find user",
            });
        }
        else {
            res.status(200).json({
                msg: `Successfully deleted user with id ${id}`,
                record,
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: "failed to delete user" });
    }
}
exports.deleteUser = deleteUser;
//logout
async function logoutUser(req, res, next) {
    res.clearCookie("access_token");
    res.redirect("/users/login");
}
exports.logoutUser = logoutUser;
// //Get all authors and all their books
async function getAllUsersAndBooks(req, res, next) {
    try {
        const record = userModel_1.User.find({})
            .populate("books")
            .exec((err, book) => {
            res.status(200).json({
                message: "displaying all users and books",
                record: book,
            });
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}
exports.getAllUsersAndBooks = getAllUsersAndBooks;
