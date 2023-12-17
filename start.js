const express=require('express')
const app=express();
const expressLayouts=require('express-ejs-layouts');
const bodyParser=require('body-parser');
const methodOverride=require('method-override')
const passport = require('passport');
const session = require('express-session');
const initializeDB = require('./scripts/initializeDB');

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport');

const indexRouter=require('./routes/about');
const alumniRouter=require('./routes/alumni');
const eventRouter=require('./routes/events');
const aboutRouter=require('./routes/about');


app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.set('layout','layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit:'10mb',extended: false}));

const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/myapp',{
    useNewUrlParser:true})
const db=mongoose.connection;
db.on('error',error=>console.error('error'));
db.once('open',()=>console.log('Connected to Mongoose'));

// Initialize the database with default users
initializeDB();

app.use('/',indexRouter);
app.use('/alumni',alumniRouter);
app.use('/events',eventRouter);
app.use('/about', aboutRouter);

app.listen(process.env.PORT || 3000);
 