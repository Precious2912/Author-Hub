import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid'
import { BookInstance } from "../model/bookModel";
import { createBookSchema, options, updateBookSchema } from "../utils/utils";

export async function createBook(req: Request | any, res: Response, next: NextFunction) {
    const id = uuidv4();

    try {
        const verified = req.user;

        const validationResult = createBookSchema.validate(req.body, options)
        if (validationResult.error){
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }

        const record = await BookInstance.create({ id, ...req.body, userId: verified.id})
        res.status(201).json({
            message: "Book added successfully",
            record
        })
    } catch(err) {
        res.status(500).json({message: "failed to add book", err: err});
    }
}


export async function getAllBooks(req: Request, res: Response, next: NextFunction) {

    try {
        const record = await BookInstance.findAll({where: {}})

        res.status(200).json({message: 'getting all books', record})

    } catch(err) {
        res.status(500).json({message: "failed to display books"});
    }
}

export async function getBook(req: Request, res: Response, next: NextFunction) {

    try {
        const {id} = req.params;
        const record = await BookInstance.findOne({where: {id}});
        res.status(200).json({
            message: `displaying book with id ${id}`,
            record
        })
       
    } catch(err) {
        res.status(500).json({message: "failed to display book"});
    }
}

export async function updateBook(req: Request, res: Response, next: NextFunction) {

    try {
        const {id} = req.params;
        const {name, isPublished, datePublished, serialNumber, imageURL} = req.body;
        const validationResult = updateBookSchema.validate(req.body, options);

        if (validationResult.error){
            res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }

        const record = await BookInstance.findOne({where: {id}});

        if (!record){
            res.status(404).json({
                msg: "cannot find book",
            });
        }
        const updateRecord = await record?.update({
            name, 
            isPublished, 
            datePublished, 
            serialNumber,
            imageURL
        });

        res.status(202).json({
            msg: "successfully updated book info",
            updateRecord
        }) ; 
       
    } catch(err) {
        res.status(500).json({message: "failed to update book info"});
    }
}


export async function deleteBook(req: Request, res: Response, next: NextFunction) {

    try {
        const {id} = req.params;
        const record = await BookInstance.findOne({where: {id}});

        if (!record){
            res.status(404).json({
                msg: "cannot find book",
            });
        };

        const deletedRecord = await record?.destroy()
        res.status(200).json({
            msg: `Successfully deleted book with id ${id}`,
            deletedRecord
        });
       
    } catch(err) {
        res.status(500).json({message: "failed to delete book"});
    }
}