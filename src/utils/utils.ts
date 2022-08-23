import Joi from 'joi'
import { regex } from 'uuidv4'
import Jwt from 'jsonwebtoken'

export const createBookSchema = Joi.object().keys({
    name: Joi.string().lowercase().required(),
    isPublished: Joi.boolean().required(),
    datePublished: Joi.number().required(),
    serialNumber: Joi.number().required(),
})

export const updateBookSchema = Joi.object().keys({
    name: Joi.string().lowercase(),
    isPublished: Joi.boolean(),
    datePublished: Joi.number(),
    serialNumber: Joi.number(),
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