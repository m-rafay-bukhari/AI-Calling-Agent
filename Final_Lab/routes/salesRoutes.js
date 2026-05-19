const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { isAdmin } = require('../../AI_calling_agent_complete/middleware/auth');

// @route   GET /sales
// @desc    Render Sales Dashboard
// @access  Admin
router.get('/sales', isAdmin, salesController.getSalesDashboard);

// @route   GET /api/sales-data
// @desc    Get live sales data
// @access  Admin
router.get('/api/sales-data', isAdmin, salesController.getSalesDataAPI);

module.exports = router;
