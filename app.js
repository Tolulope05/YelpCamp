const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError'); //Express Error Class
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

/**ROUTES */
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true
}) //creates a database Yelp-Camp with some options 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
}); // logic to check if there is an error & successfully opened

const app = express();
const port = 3000;

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); //for post request.
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))) //For serving static files like the pure script files
const sessionConfig = {
    secret: 'secretissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        HttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7 // A week from now in milliseconds
    }
};

app.use(session(sessionConfig)); // Always ensure session() is before passport.session()
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // How do we store the user in the session
passport.deserializeUser(User.deserializeUser()); // How do we get the user from the session

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}); // This is a middleware that will be executed for every request.

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

/** ASYNC ERROR HANDLING */
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found'), 404)
})

/**ERROR HANDLER */
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went Wrong' } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!!'
    res.status(statusCode).render('error', { err });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})