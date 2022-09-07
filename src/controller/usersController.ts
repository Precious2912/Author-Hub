import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import {
  createUserSchema,
  options,
  updateUserSchema,
  loginUserSchema,
  generateToken,
} from "../utils/utils";
import { User } from "../model/userModel";
import { Book } from "../model/bookModel";
import { getAllBooks } from "./booksController";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validationResult = createUserSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);
    const record = await User.create({
      author: req.body.author,
      dateRegistered: req.body.dateRegistered,
      age: req.body.age,
      email: req.body.email,
      address: req.body.address,
      password: passwordHash,
    });
    res.status(201).json({
      message: "account created successfully",
      record,
    });
  } catch (err) {
    res.status(500).json({
      message: "email already exists",
    });
  }
}

//Login
export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validationResult = loginUserSchema.validate(req.body, options);

    if (validationResult.error) {
      res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const userDetails = (await User.findOne({
      email: req.body.email,
    })) as unknown as { [key: string]: string };

    const validUser = await bcrypt.compare(
      req.body.password,
      userDetails.password
    );

    if (!validUser) {
      res.status(401).json({
        msg: "Invalid email or password",
      });
    }

    const { _id, author } = userDetails;

    const token = generateToken({ _id });

    if (validUser) {
      res.status(201).json({
        message: "login successful",
        _id,
        author,
        token,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "login unsuccessful" });
  }
}

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const record = await User.find({});
    res.status(200).json({
      msg: "displaying all users",
      record,
    });
  } catch (err) {
    res.status(500).json({ message: "failed to display all users" });
  }
}

export async function getSingleUser(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id } = req.params;

    const verified = req.user._id;

    const userBooks = await Book.find({ userId: verified });

    const record = User.findOne({ _id: verified })
      .populate("books")
      .exec((err, book) => {
        res.status(200).json({
          message: `showing details for user with id ${_id}`,
          record: book,
        });
      });
  } catch (err) {
    res.status(500).json({ message: "failed to display user" });
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params._id;
    const { author, dateRegistered, age, email, password, address } = req.body;
    const validationResult = updateUserSchema.validate(req.body, options);

    if (validationResult.error) {
      res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const record = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (record) {
      res.status(202).json({
        msg: "successfully updated user info",
        record,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "failed to update user info" });
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params._id;
    const record = await User.findByIdAndDelete(id);
    console.log("got here")

    if (!record) {
      res.status(404).json({
        msg: "cannot find user",
      });
    } else {
      res.status(200).json({
        msg: `Successfully deleted user with id ${id}`,
        record,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "failed to delete user" });
  }
}

//logout
export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.clearCookie("access_token");
  res.redirect("/users/login");
}

// //Get all authors and all their books
export async function getAllUsersAndBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const record = User.find({})
      .populate("books")
      .exec((err, book) => {
        res.status(200).json({
          message: "displaying all users and books",
          record: book,
        });
      });
  } catch (error) {
    res.status(500).json(error);
  }
}
