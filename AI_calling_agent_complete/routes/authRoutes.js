const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getLoginForm, login, getSignupForm, signup, logout, getAbout, getProfile, updateProfile } = require('../controllers/authController');
const { isLoggedIn } = require('../middleware/auth');

// Multer Config for Avatar Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'AI_calling_agent_complete/public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/login', getLoginForm);
router.post('/login', login);

router.get('/signup', getSignupForm);
router.post('/signup', signup);

router.get('/logout', logout);

router.get('/about', getAbout);

router.get('/profile', isLoggedIn, getProfile);
router.post('/profile', isLoggedIn, upload.single('avatar'), updateProfile);

module.exports = router;
