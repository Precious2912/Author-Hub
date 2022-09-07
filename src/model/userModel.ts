import mongoose, { ObjectId } from "mongoose";
export interface UserType extends mongoose.Document {
  _id: string;
  author: string;
  dateRegistered: number;
  age: number;
  email: string;
  password: string;
  address: string;
  books: { [key: string]: string | number | boolean | ObjectId }[];
}

const userSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    dateRegistered: { type: Number, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<UserType>("User", userSchema);
