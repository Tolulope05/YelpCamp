const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync')
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to YELP CAMP!');
        res.redirect('/campgrounds');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}));

module.exports = router;