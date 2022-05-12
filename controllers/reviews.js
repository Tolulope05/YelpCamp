const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id; // To add the user objectId
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new reviews')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, review_id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id)
    req.flash('success', 'Succesfully deleted review !')
    res.redirect(`/campgrounds/${id}`);
}