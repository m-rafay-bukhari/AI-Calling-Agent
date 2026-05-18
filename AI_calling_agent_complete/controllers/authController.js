const User = require('../models/User');

// @desc    Show login form
// @route   GET /login
// @access  Public
exports.getLoginForm = (req, res) => {
    if (req.session.user) return res.redirect('/products');
    res.render('login');
};

// @desc    Login user
// @route   POST /login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/login');
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/login');
        }

        // Set session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || '/uploads/default-avatar.png'
        };

        req.flash('success_msg', 'You are now logged in');
        
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/products');
        }

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error during login');
        res.redirect('/login');
    }
};

// @desc    Show signup form
// @route   GET /signup
// @access  Public
exports.getSignupForm = (req, res) => {
    if (req.session.user) return res.redirect('/products');
    res.render('signup');
};

// @desc    Register user
// @route   POST /signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            req.flash('error_msg', 'Email is already registered');
            return res.redirect('/signup');
        }

        if (password.length < 6) {
            req.flash('error_msg', 'Password must be at least 6 characters long');
            return res.redirect('/signup');
        }

        // Create new user (first user becomes admin for testing, others customer)
        const count = await User.countDocuments();
        const role = count === 0 ? 'admin' : 'customer';

        user = new User({
            name,
            email,
            password,
            role
        });

        await user.save();

        req.flash('success_msg', 'Registration successful. Please log in.');
        res.redirect('/login');

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error during registration');
        res.redirect('/signup');
    }
};

// @desc    Logout user
// @route   GET /logout
// @access  Private
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }
        res.redirect('/login');
    });
};

// @desc    Show about page
// @route   GET /about
// @access  Public
exports.getAbout = (req, res) => {
    res.render('about');
};

// @desc    Show user profile
// @route   GET /profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.render('profile', { user });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

// @desc    Update user profile
// @route   POST /profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.session.user.id);
        
        user.name = name;
        user.email = email;
        
        // Handle avatar upload if any
        if (req.file) {
            user.avatar = '/uploads/' + req.file.filename;
        }

        await user.save();
        
        // Update session with all current user data to ensure avatar persists
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        };

        req.flash('success_msg', 'Profile updated successfully');
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error updating profile');
        res.redirect('/profile');
    }
};
