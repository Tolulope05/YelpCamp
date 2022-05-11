const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync') //Asynchronous Error Handler 
const ExpressError = require('../utilities/ExpressError') //Express Error Class
const { isLoggedIn } = require('../middleware'); //Middleware
const Campground = require('../models/campground');

const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})); //index page

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
}); //new page

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Congrats, You\'ve successfully made a new Campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}));


router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'Ops...We cant find that Campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
})); // show page

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Ops...You cant edit a Campground that doesnt exist!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
})) //update page
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Congrats, You\'ve successfully updated Campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted campground!')
    res.redirect('/campgrounds')
}))

module.exports = router;