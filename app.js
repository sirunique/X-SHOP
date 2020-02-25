const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path')
const morgan = require('morgan')
const sessions = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(sessions)
const csrf = require('csurf')
const flash = require('connect-flash')
const config = require('config')
const passport = require('passport')
// require('./config/passport')(passport)
// require('./config/adminPassport')(passport)

const app = express();
const store = new MongoDBStore({
    uri: config.get('db'),
    collection: 'sessions'
})
store.on('error', (err)=>{
    console.log(err)
})
const csrfProtection = csrf();

app.set('views', path.join(__dirname, 'views'));
app.set('views', 'views');
app.set('view engine', 'jade');

const errorController = require('./controllers/error')

const Account = require('./models/account')

const accountRoutes = require('./routes/account')
const shopRoutes = require('./routes/shop')


app.use(morgan('dev'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static(__dirname + '/public/'));
app.use('/images', express.static(path.join(__dirname, '/public/images/')))

// express session
app.use(sessions({
    secret: 'sjhdgsjhdgsjhsds',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 100 * 60 * 1000}
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect flash
app.use(flash());

app.use(csrfProtection);

// GLOBAL Variables
app.use((req, res, next)=>{
    res.locals.csrfToken = req.csrfToken();
    res.locals.session = req.session;
    next();
})

app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})

// app.use((req, res, next)=>{
//     if(!req.session.user){
//         return next();
//     }
//     Account.findById(req.session.user._id)
//     .then(userDoc=>{
//         if(!userDoc){
//             return next();
//         }
//         req.user = userDoc;
//         next();
//     })
//     .catch(err=>{
//         next(new Error(err))
//     })
// })


app.use((req, res, next)=>{
    if(req.isAuthenticated()){
        res.locals.appCart = req.user.cart;
        req.appCart = req.user.cart;
    } else {
        res.locals.appCart = req.session.cart;
        req.appCart = req.session.cart;
    }
    next();
});



// App Routes
app.use('/', shopRoutes)
app.use('/account',  accountRoutes);

// // Error
app.use('/500', errorController.get500)
app.use(errorController.get404)

app.use((error, req, res, next)=>{
    console.log(error)
    res.status(500).render('500',{

    })
})

module.exports = app;