var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')({origin: '*'})
const mongoose = require('mongoose')

const db = mongoose.connection

mongoose.connect('mongodb+srv://bisibro:Capital1@cluster0.tclck.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

db.on('error', (error) =>console.error(error))
db.once('open', ()=> console.log('Database connected'))


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/Admin')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter)

module.exports = app;
