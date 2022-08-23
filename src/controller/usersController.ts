import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid'
import { UserInstance } from "../model/userModel";
import bcrypt from "bcryptjs"
import { createUserSchema, options, updateUserSchema, loginUserSchema, generateToken } from "../utils/utils";
import { BookInstance } from "../model/bookModel";

export async function createUser(req: Request, res: Response, next: NextFunction) {
    const id = uuidv4();

    try {
        const validationResult = createUserSchema.validate(req.body, options)
        if (validationResult.error){
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            })
        }

        const passwordHash = await bcrypt.hash(req.body.password, 8)
        const record = await UserInstance.create({ 
            id: id,
            author: req.body.author,
            dateRegistered: req.body.dateRegistered, 
            age: req.body.age, 
            email: req.body.email, 
            address: req.body.address, 
            password: passwordHash, 
        });
        // res.redirect('/users/login');
        res.status(201).json({
            message: "account created successfully",
            record
        })
    } catch(err) {
        // res.render('error404');
        res.status(500).json({
            message: "email already exists"
        });
       
    }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {

    try {
        const limit = req.query.limit as number | undefined 
        const offset = req.query.offset as number | undefined 
        const record = await UserInstance.findAll({where: {}, limit, offset});
        res.status(200).json({
            msg: "displaying all users",
            record
        })
    } catch(err) {
        res.status(500).json({message: "failed to display all users"});
    }
}

export async function getSingleUser(req: Request, res: Response, next: NextFunction) {

    try {
        const {id} = req.params;
        const record = await UserInstance.findAll({where: {id},
            include:[{
                model: BookInstance,
                as:'books'
            }]})

            res.status(200).json({
                message: `showing details for user with id ${id}`,
                record
            })
            
            // .then((data) => {
            //      res.render('author', {data: data})
            // })
       
    } catch(err) {
        res.status(500).json({message: "failed to display user"});
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {

    try {
        const {id} = req.params;
        const { author, dateRegistered, age, email, password, address } = req.body;
        const validationResult = updateUserSchema.validate(req.body, options)

        if (validationResult.error){
            res.status(400).json({
                Error: validationResult.error.details[0].message
            })
        }

        const record = await UserInstance.findOne({where: {id}});

        if (!record){
            res.status(404).json({
                msg: "cannot find user",
            })
        }
        const updateRecord = await record?.update({
            author,
            dateRegistered,
            age,
            email,
            password,
            address
        })

        res.status(202).json({
            msg: "successfully updated user info",
            updateRecord
        })  
       
    } catch(err) {
        res.status(500).json({message: "failed to update user info"});
    }
}


export async function deleteUser(req: Request, res: Response, next: NextFunction) {

    try {
        const {id} = req.params;
        const record = await UserInstance.findOne({where: {id}});

        if (!record){
            res.status(404).json({
                msg: "cannot find user",
            })
        }

        const deletedRecord = await record?.destroy()
        res.status(200).json({
            msg: `Successfully deleted user with id ${id}`,
            deletedRecord
        })
       
    } catch(err) {
        res.status(500).json({message: "failed to delete user"});
    }
}

//Login
export async function loginUser(req: Request, res: Response, next: NextFunction) {
    const id = uuidv4()
    try {
        const validationResult = loginUserSchema.validate(req.body, options);

        if (validationResult.error){
            res.status(400).json({
                Error: validationResult.error.details[0].message
            })
        }

        const userDetails = await UserInstance.findOne({where: {email: req.body.email}}) as unknown as {[key: string]: string}
     
        const validUser = await bcrypt.compare(req.body.password, userDetails.password)

        if(!validUser){
            res.status(401).json({
                msg: "Invalid email or password"
            })
            // res.render('login', {msg: 'Invalid email or password'})

        }

        const { id, author } = userDetails

        const token = generateToken({id})

        if (validUser){
            
            // res.cookie('access_token',token, { httpOnly: true});

            // res.redirect('/books/read');
            res.status(201).json({
                message: 'login successful',
                id,
                author,
                token,
            })
        }
       
    } catch(err) {
        res.status(500).json({message: "login unsuccessful"})
    }
}

//logout
// export async function logoutUser(req: Request, res: Response, next: NextFunction) {
//     res.clearCookie('access_token');
//     res.redirect('/users/login');
// }

//Get all authors and all their books
export async function getAllUsersAndBooks(req: Request, res: Response, next: NextFunction) {
    
    try {
      const limit = req.query?.limit as number | undefined;
      const offset = req.query?.offset as number | undefined;
      //  const record = await TodoInstance.findAll({where: {},limit, offset})
      const record = await UserInstance.findAndCountAll({
      include:[{
       model: BookInstance,
       as:'books'
      }]

    //   }).then((book) => {
    //     res.render('author', {data: book})
    })
    res.status(200).json({
        message: 'displaying all users and books',
        record
    })


    //   const record = await BookInstance.findAll().then((book) => {
    //     res.render('home', {data: book})
    // })
    } catch (error) {
      res.status(500).json(error)
    }
  }

