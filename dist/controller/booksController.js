"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBook = exports.getAllBooks = exports.createBook = void 0;
const utils_1 = require("../utils/utils");
const bookModel_1 = require("../model/bookModel");
const userModel_1 = require("../model/userModel");
async function createBook(req, res, next) {
    try {
        const verified = req.user._id;
        console.log(verified);
        const validationResult = utils_1.createBookSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const user = await userModel_1.User.findById(verified);
        if (user) {
            const record = await bookModel_1.Book.create({
                ...req.body,
                userId: verified,
            });
            user.books.push(record);
            user.save();
            res.status(201).json({
                message: "Book added successfully",
                record,
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: "failed to add book", err: err });
    }
}
exports.createBook = createBook;
async function getAllBooks(req, res, next) {
    res.send(res.paginatedResult);
    // try {
    //   const record = await Book.find({});
    //   res.status(200).json({ message: "getting all books", record });
    // } catch (err) {
    //   res.status(500).json({ message: "failed to display books" });
    // }
}
exports.getAllBooks = getAllBooks;
async function getBook(req, res, next) {
    try {
        const { _id } = req.params;
        const record = await bookModel_1.Book.findById({ _id });
        res.status(200).json({
            message: `displaying book with id ${_id}`,
            record,
        });
    }
    catch (err) {
        res.status(500).json({ message: "failed to display book" });
    }
}
exports.getBook = getBook;
async function updateBook(req, res, next) {
    try {
        const { _id } = req.params;
        const { name, isPublished, datePublished, serialNumber, imageURL } = req.body;
        const validationResult = utils_1.updateBookSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await bookModel_1.Book.findByIdAndUpdate(_id, req.body, { new: true });
        if (record) {
            res.status(202).json({
                msg: "successfully updated book info",
                record,
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: "failed to update book info" });
    }
}
exports.updateBook = updateBook;
async function deleteBook(req, res, next) {
    try {
        const { _id } = req.params;
        const record = await bookModel_1.Book.findByIdAndDelete(_id);
        if (!record) {
            res.status(404).json({
                msg: "cannot find book",
            });
        }
        else {
            res.status(200).json({
                msg: `Successfully deleted book with id ${_id}`,
                record,
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: "failed to delete book" });
    }
}
exports.deleteBook = deleteBook;
