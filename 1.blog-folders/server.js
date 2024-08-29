require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const userRoutes = require('./routes/users/users')
const postRoutes = require('./routes/posts/posts')
const commentRoutes = require('./routes/comments/comments');
const globalErrHandler = require('./middlewares/globalHandler');
require('./config/dbConnect')


//instance of app
const app = express();

//middleware

//config ejs
app.set("view engine", "ejs");

//serve static files
app.use(express.static(__dirname, +"/public"))

//pass api data from postman
app.use(express.json());

//pass form data from UI
app.use(express.urlencoded({ extended: true }));

//method config
app.use(methodOverride("_method"))


//session config
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        ttl: 24 * 60 * 60 //1 day
    })
})
);


//save the login user into locals
app.use((req, res, next) => {
    if (req.session.userAuth) {
        res.locals.userAuth = req.session.userAuth
    } else {
        res.locals.userAuth = null;
    }
    next()
})


//render Home page
app.get('/', (req, res) => {
    res.render('index')
})


//route
//-----------
//Users Route
//-----------

app.use('/api/v1/users', userRoutes);

//--------------
//Posts Route
//---------------

app.use('/api/v1/posts', postRoutes);

//-------------
//Commets Route
//-------------
app.use('/api/v1/comments', commentRoutes);

//Error handler middleware

app.use(globalErrHandler);



//listen server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server Listening on port : ${PORT}`);
})