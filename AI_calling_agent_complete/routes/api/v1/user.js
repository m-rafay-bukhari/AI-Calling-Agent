const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../middleware/apiAuth');
const User = require('../../../models/User');

// @route   GET /api/v1/user/profile
// @desc    Get logged in user profile
// @access  Private (Requires valid JWT)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // req.user has user_id from the decoded token
        const user = await User.findById(req.user.user_id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
