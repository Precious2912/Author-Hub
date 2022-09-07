"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const usersController_1 = require("../controller/usersController");
// /* GET home page. */
router.post("/signup", usersController_1.createUser);
router.post("/login", usersController_1.loginUser);
router.get("/read", auth_1.auth, usersController_1.getAllUsers);
router.get("/read/:_id", auth_1.auth, usersController_1.getSingleUser);
router.put("/update/:_id", auth_1.auth, usersController_1.updateUser);
router.delete("/delete/:_id", auth_1.auth, usersController_1.deleteUser);
// // router.get("/allusers", auth, getAllUsersAndBooks);
router.get("/allusers", usersController_1.getAllUsersAndBooks);
router.get('/logout', usersController_1.logoutUser);
exports.default = router;
