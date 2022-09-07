import express, { Request, Response, NextFunction } from 'express'
import Jwt from'jsonwebtoken'
const secret = process.env.JWT_SECRETKEY as string
import { User } from "../model/userModel"

export async function auth(req: Request | any, res: Response, next: NextFunction){
    try{
        const authorization: string = req.headers.authorization.split(' ')[1];
        if(!authorization){
            res.status(401).json({
                Error: 'kindly sign in as a user'
            });
        }
    
        const token = authorization;
        const verified = Jwt.verify(token, secret);
    
        if (!verified){
            return res.status(401).json({
                Error: "User not verified, you can't access this route"
            });
        }
    
        const { _id } = verified as {[key:string]: string}
    
        const user = await User.findOne({_id}) 
    
        if(!user){
            return res.status(404).json({
                Error: 'User not verified'
            })
        }

        req.user  = verified
        next()

    } catch(err) {
        res.status(403).json({
            Error: 'User not logged in'
        });
    }
}