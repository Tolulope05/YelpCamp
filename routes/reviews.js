const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync') //Asynchronous Error Handler 
const ExpressError = require('../utilities/ExpressError') //Express Error Class
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

/**CREATING REVIEWS */
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview)) // create review

/**DELETING REVIEWS */
router.delete('/:review_id', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview)) // delete review

module.exports = router;
