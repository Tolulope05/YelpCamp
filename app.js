const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utilities/catchAsync') //Asynchronous Error Handler 
const ExpressError = require('./utilities/ExpressError') //Express Error Class
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');

const campgrounds = require('./routes/campground');

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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/campgrounds', campgrounds)


/**CREATING REVIEWS */
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

/**DELETING REVIEWS */
app.delete('/campgrounds/:id/reviews/:review_id', catchAsync(async (req, res) => {
    const { id, review_id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id)
    res.redirect(`/campgrounds/${id}`);
}))

/** ASYNC ERROR HANDLING */

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found'), 404)
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went Wrong' } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!!'
    res.status(statusCode).render('error', { err });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
