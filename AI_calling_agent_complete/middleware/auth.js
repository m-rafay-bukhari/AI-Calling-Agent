exports.isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error_msg', 'Please log in to access this resource.');
    res.redirect('/login');
};

exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    req.flash('error_msg', 'Access denied. You must be an admin.');
    res.redirect('/');
};
