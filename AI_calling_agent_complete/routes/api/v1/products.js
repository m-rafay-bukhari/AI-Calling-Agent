const express = require('express');
const router = express.Router();
const Product = require('../../../models/Product');

// @route   GET /api/v1/products
// @desc    Get all products (with pagination, search, filter)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const resPerPage = 8;
        const page = parseInt(req.query.page) || 1;
        
        let query = {};
        
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        const products = await Product.find(query)
            .skip(resPerPage * (page - 1))
            .limit(resPerPage);

        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total: totalProducts,
            page: page,
            pages: Math.ceil(totalProducts / resPerPage),
            data: products
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   GET /api/v1/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
