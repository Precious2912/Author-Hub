"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
    datePublished: { type: Number, required: true },
    serialNumber: { type: Number, required: true },
    imageURL: { type: String, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true,
});
exports.Book = mongoose_1.default.model("Book", bookSchema);
