"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersAndBooks = exports.loginUser = exports.deleteUser = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.createUser = void 0;
const uuid_1 = require("uuid");
const userModel_1 = require("../model/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../utils/utils");
const bookModel_1 = require("../model/bookModel");
async function createUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.createUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await userModel_1.UserInstance.create({
            id: id,
            author: req.body.author,
            dateRegistered: req.body.dateRegistered,
            age: req.body.age,
            email: req.body.email,
            address: req.body.address,
            password: passwordHash,
        });
        // res.redirect('/users/login');
        res.status(201).json({
            message: "account created successfully",
            record
        });
    }
    catch (err) {
        // res.render('error404');
        res.status(500).json({
            message: "email already exists"
        });
    }
}
exports.createUser = createUser;
async function getAllUsers(req, res, next) {
    try {
        const limit = req.query.limit;
        const offset = req.query.offset;
        const record = await userModel_1.UserInstance.findAll({ where: {}, limit, offset });
        res.status(200).json({
            msg: "displaying all users",
            record
        });
    }
    catch (err) {
        res.status(500).json({ message: "failed to display all users" });
    }
}
exports.getAllUsers = getAllUsers;
async function getSingleUser(req, res, next) {
    try {
        const { id } = req.params;
        const record = await userModel_1.UserInstance.findAll({ where: { id },
            include: [{
                    model: bookModel_1.BookInstance,
                    as: 'books'
                }] });
        res.status(200).json({
            message: `showing details for user with id ${id}`,
            record
        });
        // .then((data) => {
        //      res.render('author', {data: data})
        // })
    }
    catch (err) {
        res.status(500).json({ message: "failed to display user" });
    }
}
exports.getSingleUser = getSingleUser;
async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        const { author, dateRegistered, age, email, password, address } = req.body;
        const validationResult = utils_1.updateUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const record = await userModel_1.UserInstance.findOne({ where: { id } });
        if (!record) {
            res.status(404).json({
                msg: "cannot find user",
            });
        }
        const updateRecord = await record?.update({
            author,
            dateRegistered,
            age,
            email,
            password,
            address
        });
        res.status(202).json({
            msg: "successfully updated user info",
            updateRecord
        });
    }
    catch (err) {
        res.status(500).json({ message: "failed to update user info" });
    }
}
exports.updateUser = updateUser;
async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;
        const record = await userModel_1.UserInstance.findOne({ where: { id } });
        if (!record) {
            res.status(404).json({
                msg: "cannot find user",
            });
        }
        const deletedRecord = await record?.destroy();
        res.status(200).json({
            msg: `Successfully deleted user with id ${id}`,
            deletedRecord
        });
    }
    catch (err) {
        res.status(500).json({ message: "failed to delete user" });
    }
}
exports.deleteUser = deleteUser;
//Login
async function loginUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.loginUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const userDetails = await userModel_1.UserInstance.findOne({ where: { email: req.body.email } });
        const validUser = await bcryptjs_1.default.compare(req.body.password, userDetails.password);
        if (!validUser) {
            res.status(401).json({
                msg: "Invalid email or password"
            });
            // res.render('login', {msg: 'Invalid email or password'})
        }
        const { id, author } = userDetails;
        const token = (0, utils_1.generateToken)({ id });
        if (validUser) {
            // res.cookie('access_token',token, { httpOnly: true});
            // res.redirect('/books/read');
            res.status(201).json({
                message: 'login successful',
                id,
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
//logout
// export async function logoutUser(req: Request, res: Response, next: NextFunction) {
//     res.clearCookie('access_token');
//     res.redirect('/users/login');
// }
//Get all authors and all their books
async function getAllUsersAndBooks(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await TodoInstance.findAll({where: {},limit, offset})
        const record = await userModel_1.UserInstance.findAndCountAll({
            include: [{
                    model: bookModel_1.BookInstance,
                    as: 'books'
                }]
            //   }).then((book) => {
            //     res.render('author', {data: book})
        });
        res.status(200).json({
            message: 'displaying all users and books',
            record
        });
        //   const record = await BookInstance.findAll().then((book) => {
        //     res.render('home', {data: book})
        // })
    }
    catch (error) {
        res.status(500).json(error);
    }
}
exports.getAllUsersAndBooks = getAllUsersAndBooks;
