import { Request, Response, NextFunction } from "express";
import { createBookSchema, options, updateBookSchema } from "../utils/utils";
import { Book } from "../model/bookModel";
import { User } from "../model/userModel";

export async function createBook(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    const verified = req.user._id;
    console.log(verified)

    const validationResult = createBookSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const user = await User.findById(verified);

    if (user) {
      const record = await Book.create({
        ...req.body,
        userId: verified,
      }) as unknown as { [key: string]: string };
      user.books.push(record);
      user.save();
      res.status(201).json({
        message: "Book added successfully",
        record,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "failed to add book", err: err });
  }
}

export async function getAllBooks(
  req: Request,
  res: Response | any,
  next: NextFunction
) {

  res.send(res.paginatedResult)
  // try {
  //   const record = await Book.find({});

  //   res.status(200).json({ message: "getting all books", record });
  // } catch (err) {
  //   res.status(500).json({ message: "failed to display books" });
  // }
}

export async function getBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { _id } = req.params;
    const record = await Book.findById({ _id });
    res.status(200).json({
      message: `displaying book with id ${_id}`,
      record,
    });
  } catch (err) {
    res.status(500).json({ message: "failed to display book" });
  }
}

export async function updateBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id } = req.params;
    const { name, isPublished, datePublished, serialNumber, imageURL } =
      req.body;
    const validationResult = updateBookSchema.validate(req.body, options);

    if (validationResult.error) {
      res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const record = await Book.findByIdAndUpdate(_id, req.body, { new: true });

    if (record) {
      res.status(202).json({
        msg: "successfully updated book info",
        record,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "failed to update book info" });
  }
}

export async function deleteBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id } = req.params;
    const record = await Book.findByIdAndDelete(_id);

    if (!record) {
      res.status(404).json({
        msg: "cannot find book",
      });
    } else {
      res.status(200).json({
        msg: `Successfully deleted book with id ${_id}`,
        record,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "failed to delete book" });
  }
}
