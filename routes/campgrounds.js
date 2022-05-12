const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utilities/catchAsync') //Asynchronous Error Handler 
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware'); //Middleware
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
    .post(upload.array('image'), (req, res) => { console.log(req.body, req.files); res.send('Uploaded'); });

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