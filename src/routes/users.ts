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
  // logoutUser,
  // renderSignUpPage,
  // renderLoginPage,
  getAllUsersAndBooks,
  // renderAdminPage
} from "../controller/usersController";


/* GET home page. */
router.get("/read", getAllUsers);
router.post("/signup", createUser);
router.post("/login", loginUser);
router.put("/update/:id", auth, updateUser);
router.delete("/delete/:id", auth, deleteUser);
// router.get("/allusers", auth, getAllUsersAndBooks);
router.get("/allusers", getAllUsersAndBooks);
// router.get('/logout', logoutUser);
router.get("/read/:id", getSingleUser);

//ejs routes
// router.get("/signup", renderSignUpPage);
// router.get("/login", renderLoginPage);
// router.get("/read/:id", renderAdminPage);


export default router;
