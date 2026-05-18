const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../middleware/apiAuth');

// @route   POST /api/v1/orders
// @desc    Create a new order (Dummy endpoint for API requirement)
// @access  Private (Requires valid JWT)
router.post('/', verifyToken, (req, res) => {
    try {
        // In a real app, you would process req.body.cartItems, calculate total, save to DB
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            user: req.user, // Shows decoded JWT payload
            data: req.body
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
