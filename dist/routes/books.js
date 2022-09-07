"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const utils_1 = require("../utils/utils");
const bookModel_1 = require("../model/bookModel");
const booksController_1 = require("../controller/booksController");
// /* GET books listing. */
router.post("/create", auth_1.auth, booksController_1.createBook);
router.get("/read", auth_1.auth, (0, utils_1.pagination)(bookModel_1.Book), booksController_1.getAllBooks);
router.get('/read/:_id', auth_1.auth, booksController_1.getBook);
router.put("/update/:_id", auth_1.auth, booksController_1.updateBook);
router.delete("/delete/:_id", auth_1.auth, booksController_1.deleteBook);
exports.default = router;
