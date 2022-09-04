"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookInstance = void 0;
// import { DataTypes, Sequelize } from "sequelize/types";
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class BookInstance extends sequelize_1.Model {
}
exports.BookInstance = BookInstance;
BookInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.BOOLEAN,
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
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    serialNumber: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    imageURL: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
    }
}, {
    sequelize: database_config_1.default,
    tableName: 'books'
});
