import express, { Request, Response, NextFunction } from 'express'
import Jwt from'jsonwebtoken'
const secret = process.env.JWT_SECRETKEY as string
import { UserInstance } from '../model/userModel'

export async function auth(req: Request | any, res: Response, next: NextFunction){
    try{
        // console.log(req.headers.authorization)
        const authorization: string = req.headers.authorization.split(' ')[1];
        // console.log(req.headers)
        // console.log(authorization)
        if(!authorization){
            // res.render('error404')
            res.status(401).json({
                Error: 'kindly sign in as a user'
            });
        }
    
        const token = authorization;
        const verified = Jwt.verify(token, secret);
    
        if (!verified){
            // res.render('error404')
            return res.status(401).json({
                Error: "User not verified, you can't access this route"
            });
        }
    
        const { id } = verified as {[key:string]: string}
    
        const user = await UserInstance.findOne({where: {id}}) 
    
        if(!user){
            // res.render('error404')
            return res.status(404).json({
                Error: 'User not verified'
            })
        }

        req.user  = verified
        next()

    } catch(err) {
        // res.redirect('/users/login')
        res.status(403).json({
            Error: 'User not logged in'
        });
    }
}