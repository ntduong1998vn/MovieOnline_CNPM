const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport');
// const MongoStore = require('connect-mongo')(session)
const app = express()
const PORT = 8080

// Thiết lập kết nối tới Mongoose
const { mongoUri } = require('./config')
mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose
    .connect(mongoUri)
    .then(() => console.log('Ket noi thanh cong'))
    .catch(err => console.log(err))
// Route requires

// MIDDLEWARE
app.use(cookieParser())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// config our app
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Method', '*')
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    next()
})
app.options('*', cors());
// Sessions
app.use(
    session({
        secret: 'NguyenTrieuDuong', //pick a random string to make the hash that is generated secure
        // store: new MongoStore({ mongooseConnection: mongoose.connection }),
        resave: false, //required
        saveUninitialized: false, //required
        cookie: {
            maxAge: 60 * 60
        }
    })
)

app.use((req, res, next) => {
    console.log(req.session)
    return next();
})

// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser
require('./config/passport')(passport)


// Routes
app.use('/authenticate', require('./routes/authenticate'))
app.use('/auth', require('./routes/auth'))
app.use('/api/movies', require('./routes/movies'))
app.use('/api/genres', require('./routes/genres'))
// app.use('/user', user)

// Starting Server 
app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`)
})