import mongoose, { ObjectId } from "mongoose";
export interface BookType extends mongoose.Document {
  _id: string;
  name: string;
  isPublished: boolean;
  datePublished: number;
  serialNumber: number;
  imageURL: string;
  userId: string;
}

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
    datePublished: { type: Number, required: true },
    serialNumber: { type: Number, required: true },
    imageURL: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model<BookType>("Book", bookSchema);
