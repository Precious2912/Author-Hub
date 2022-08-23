"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
// const { DataTypes, Model } =  require("sequelize")
// import {DataTypes, Model} from 'Sequelize';
const database_config_1 = __importDefault(require("../config/database.config"));
const bookModel_1 = require("./bookModel");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    author: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    dateRegistered: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    age: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_config_1.default,
    tableName: 'users'
});
//Link db tables
UserInstance.hasMany(bookModel_1.BookInstance, { foreignKey: "userId", as: "books" });
bookModel_1.BookInstance.belongsTo(UserInstance, { foreignKey: 'userId', as: 'users' });
