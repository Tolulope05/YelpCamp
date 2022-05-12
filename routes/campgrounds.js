const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utilities/catchAsync') //Asynchronous Error Handler 
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware'); //Middleware
const Campground = require('../models/campground');

router.get('/', catchAsync(campgrounds.index)); //index page

router.get('/new', isLoggedIn, campgrounds.renderNewForm); //new form

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)); // create campground

router.get('/:id', catchAsync(campgrounds.showCampground)); // show campground by id

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditform)) //edit form

router.put('/:id',
    isLoggedIn,
    isAuthor,
    validateCampground,
    isAuthor,
    catchAsync(campgrounds.updateCampground)
) //update campground

router.delete('/:id', isLoggedIn, catchAsync(campgrounds.deleteCampground)) // delete campground

module.exports = router;