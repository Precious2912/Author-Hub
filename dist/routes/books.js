"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const booksController_1 = require("../controller/booksController");
/* GET books listing. */
router.post("/create", auth_1.auth, booksController_1.createBook);
router.get("/read", auth_1.auth, booksController_1.getAllBooks);
router.get('/read/:id', booksController_1.getBook);
router.put("/update/:id", auth_1.auth, booksController_1.updateBook);
router.delete("/delete/:id", auth_1.auth, booksController_1.deleteBook);
// ejs
// router.get("/read", renderHomePage);
exports.default = router;
