const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError') //Express Error Class
const methodOverride = require('method-override');

/**ROUTES */
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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



app.get('/', (req, res) => {
    res.render('home');
});

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

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
