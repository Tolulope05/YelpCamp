const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utilities/catchAsync') //Asynchronous Error Handler 
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware'); //Middleware
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)); // multer gets everything and send us the parsed data before we validate 


router.get('/new', isLoggedIn, campgrounds.renderNewForm); //new form

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(
        isLoggedIn,
        isAuthor,
        validateCampground,
        isAuthor,
        catchAsync(campgrounds.updateCampground)
    )
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditform)) //edit form

module.exports = router;