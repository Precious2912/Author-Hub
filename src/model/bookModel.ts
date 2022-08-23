// import { DataTypes, Sequelize } from "sequelize/types";
import {DataTypes, Model} from 'sequelize';
import db from "../config/database.config";

interface BookAttributes {
    id: string
    name: string,
    isPublished: boolean,
    datePublished: number,
    serialNumber: number,
    userId: string,
}

export class BookInstance extends Model<BookAttributes>{}

BookInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "name is required"
            },
            notEmpty: {
                msg: "please provide a name"
            }
        }
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: "option required"
            },
            notEmpty: {
                msg: "please tick an option"
            }
        }
    },
    datePublished: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    serialNumber: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        // references: {
        //     model: 'users', 
        //     key: 'id', 
        //  }
    }
   
}, 
{
    sequelize: db,
    tableName: 'books'
});




// 'fathers' refers to table name
// 'id' refers to column name in fathers table