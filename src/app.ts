import createError from 'http-errors';
import express, {Response, Request, NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser'
import logger from 'morgan';
// import db from './config/database.config'
import cors from 'cors'

import usersRouter from './routes/users'
import booksRouter from './routes/books';

// //db sync sequelize
// db.sync().then(() => {
//   console.log('database connected succesfully')
// }).catch((err) => {
//   console.log(err)
// })

const app = express();
// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

//this line

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

app.use('/users', usersRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: createError.HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




export default app;
