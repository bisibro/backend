var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

const mongoose = require('mongoose')
const cron = require('node-cron')

const db = mongoose.connection

mongoose.connect('mongodb+srv://bisibro:Capital1@cluster0.tclck.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

db.on('error', (error) =>console.error(error))
db.once('open', ()=> console.log('Database connected'))


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/Admin');
const User = require('./Models/user');

var app = express();

app.use(cors({
  origin: '*',
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
  methods: ['POST','PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true,
  enablePreflight: true
  
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter)

 cron.schedule('0 0 0 * * *', async () =>  {
  let earn  =  (Math.floor(Math.random() * 9) + 5).toString()
  console.log(earn)
 return await User.updateMany({block: !"true"}, {"$set":{earnings: earn}}, {"multi": true}).then((res)=>{
    console.log(res)
  } ).catch(err => console.log(err))
});

module.exports = app;
