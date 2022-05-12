const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync') //Asynchronous Error Handler 
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware'); //Middleware
const Campground = require('../models/campground');

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
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Ops...We cant find that Campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
})); // show page

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Ops...You cant edit a Campground that doesnt exist!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
})) //update page

router.put('/:id', isLoggedIn, isAuthor, validateCampground, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Congrats, You\'ve successfully updated Campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted campground!')
    res.redirect('/campgrounds');
}))

module.exports = router;