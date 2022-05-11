module.exports.isLoggedIn = (req, res, next) => {
    // console.log('REQ.USER...', req.user);
    // Store the url they are requesting!
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next()
}