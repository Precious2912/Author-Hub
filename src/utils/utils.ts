import Joi from 'joi'
import { regex } from 'uuidv4'
import Jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from "express";

export const createBookSchema = Joi.object().keys({
    name: Joi.string().lowercase().required(),
    isPublished: Joi.boolean().required(),
    datePublished: Joi.number().required(),
    serialNumber: Joi.number().required(),
    imageURL: Joi.string().required()
})

export const updateBookSchema = Joi.object().keys({
    name: Joi.string().lowercase(),
    isPublished: Joi.boolean(),
    datePublished: Joi.number(),
    serialNumber: Joi.number(),
    imageURL: Joi.string().required()
})

export const createUserSchema = Joi.object().keys({
    author: Joi.string().lowercase().required(),
    dateRegistered: Joi.number().required(),
    age: Joi.number().required(),
    email: Joi.string().lowercase().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password: Joi.ref('password'),
    address: Joi.string().lowercase().required()
}).with('password', 'confirm_password')

export const updateUserSchema = Joi.object().keys({
    author: Joi.string().lowercase(),
    dateRegistered: Joi.number(),
    age: Joi.number(),
    email: Joi.string().lowercase(),
    password: Joi.string(),
    address: Joi.string().lowercase()
})

export const loginUserSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
})

//Generate token
export const generateToken = (user: {[key: string]: unknown}) => {
    const password = process.env.JWT_SECRETKEY as string
    const token = Jwt.sign(user, password, {expiresIn: '7d'})
    return token;
}

export const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
}

export function pagination(model: any){
    return async function paginate(req: Request, res: any, next: NextFunction){
        const params: string = req.query.page as string;
        const params__: string = req.query.limit as string;
        const page = parseInt(params);
        const limit = parseInt(params__);
        if (!page && !limit) {
          const result = await model.find().exec();
          // console.log(result)
          if(result.length === 0){
            res.status(404).send({
              status: "Failed",
              result
            });
            return;
          }
          res.status(200).send({
            status: "success",
            result,
          });
          return;
        }
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result: { [key: string]: { [key: string]: number } } = {};
        if (endIndex < (await model.countDocuments().exec())) {
          result.next = {
            page: page + 1,
            limit: limit,
          };
        }
        if (startIndex > 0) {
          result.previous = {
            page: page - 1,
            limit: limit,
          };
        }
        try {
          result.users = await model.find().limit(limit).skip(startIndex);
        //   res.status(200).send(result);
            res.paginatedResult = result
            next()
        } catch (err) {
          res.status(404).json({
            status: "fail",
            message: err,
          });
        }
    }
}