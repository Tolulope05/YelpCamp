const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync') //Asynchronous Error Handler 
const ExpressError = require('../utilities/ExpressError') //Express Error Class
const { validateReview } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');

/**CREATING REVIEWS */
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new reviews')
    res.redirect(`/campgrounds/${campground._id}`);
}))

/**DELETING REVIEWS */
router.delete('/:review_id', catchAsync(async (req, res) => {
    const { id, review_id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id)
    req.flash('success', 'Succesfully deleted review !')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
