import express, { Response, Request, NextFunction } from "express";
import { auth } from "../middleware/auth";
const router = express.Router();
import { pagination } from "../utils/utils"
import { Book } from "../model/bookModel"
import {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBook
} from "../controller/booksController"

// /* GET books listing. */
router.post("/create", auth, createBook);
router.get("/read", auth, pagination(Book), getAllBooks);
router.get('/read/:_id', auth, getBook);
router.put("/update/:_id", auth, updateBook);
router.delete("/delete/:_id", auth, deleteBook);


export default router;
