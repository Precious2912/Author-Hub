"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBook = exports.getAllBooks = exports.createBook = void 0;
const uuid_1 = require("uuid");
const bookModel_1 = require("../model/bookModel");
const utils_1 = require("../utils/utils");
async function createBook(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const verified = req.user;
        const validationResult = utils_1.createBookSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const record = await bookModel_1.BookInstance.create({ id, ...req.body, userId: verified.id });
        res.status(201).json({
            message: "Book added successfully",
            record
        });
    }
    catch (err) {
        res.status(500).json({ message: "failed to add book", err: err });
    }
}
exports.createBook = createBook;
async function getAllBooks(req, res, next) {
    try {
        const record = await bookModel_1.BookInstance.findAll({ where: {} });
        res.status(200).json({ message: 'getting all books', record });
    }
    catch (err) {
        res.status(500).json({ message: "failed to display books" });
    }
}
exports.getAllBooks = getAllBooks;
async function getBook(req, res, next) {
    try {
        const { id } = req.params;
        const record = await bookModel_1.BookInstance.findOne({ where: { id } });
        res.status(200).json({
            message: `displaying book with id ${id}`,
            record
        });
    }
    catch (err) {
        res.status(500).json({ message: "failed to display book" });
    }
}
exports.getBook = getBook;
async function updateBook(req, res, next) {
    try {
        const { id } = req.params;
        const { name, isPublished, datePublished, serialNumber, imageURL } = req.body;
        const validationResult = utils_1.updateBookSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const record = await bookModel_1.BookInstance.findOne({ where: { id } });
        if (!record) {
            res.status(404).json({
                msg: "cannot find book",
            });
        }
        const updateRecord = await record?.update({
            name,
            isPublished,
            datePublished,
            serialNumber,
            imageURL
        });
        res.status(202).json({
            msg: "successfully updated book info",
            updateRecord
        });
    }
    catch (err) {
        res.status(500).json({ message: "failed to update book info" });
    }
}
exports.updateBook = updateBook;
async function deleteBook(req, res, next) {
    try {
        const { id } = req.params;
        const record = await bookModel_1.BookInstance.findOne({ where: { id } });
        if (!record) {
            res.status(404).json({
                msg: "cannot find book",
            });
        }
        ;
        const deletedRecord = await record?.destroy();
        res.status(200).json({
            msg: `Successfully deleted book with id ${id}`,
            deletedRecord
        });
    }
    catch (err) {
        res.status(500).json({ message: "failed to delete book" });
    }
}
exports.deleteBook = deleteBook;
