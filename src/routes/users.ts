import express, { Response, Request, NextFunction } from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getAllUsersAndBooks,
} from "../controller/usersController";


// /* GET home page. */
router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/read", auth, getAllUsers);
router.get("/read/:_id", auth, getSingleUser);
router.put("/update/:_id", auth, updateUser);
router.delete("/delete/:_id", auth, deleteUser);
// // router.get("/allusers", auth, getAllUsersAndBooks);
router.get("/allusers", getAllUsersAndBooks);
router.get('/logout', logoutUser);




export default router;
