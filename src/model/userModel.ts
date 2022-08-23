import { DataTypes, Model, ModelStatic} from "sequelize";
// const { DataTypes, Model } =  require("sequelize")
// import {DataTypes, Model} from 'Sequelize';
import db from "../config/database.config";
import { BookInstance } from './bookModel'

interface UserAttributes {
    id: string
    author: string,
    dateRegistered: number,
    age: number,
    email: string,
    password: string,
    address: string,
}

export class UserInstance extends Model<UserAttributes>{
    // static associate: (models: any) => void;
}


UserInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateRegistered: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    age: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    } 
}, 
{
    sequelize: db,
    tableName: 'users'
});

//Link db tables

UserInstance.hasMany(BookInstance, {foreignKey: "userId", as: "books"})

BookInstance.belongsTo(UserInstance, {foreignKey: 'userId', as: 'users'})

