import express, { Response, Request, NextFunction } from "express";
import { auth } from "../middleware/auth";
const router = express.Router();
import {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBook
} from "../controller/booksController";
import {
  // renderHomePage,
  // renderAdminPage,
  getSingleUser,
} from "../controller/usersController";

/* GET books listing. */
router.post("/create", auth, createBook);
router.get("/read", auth, getAllBooks);
router.get('/read/:id', getBook);
router.put("/update/:id", auth, updateBook);
router.delete("/delete/:id", auth, deleteBook);

// ejs
// router.get("/read", renderHomePage);


export default router;
