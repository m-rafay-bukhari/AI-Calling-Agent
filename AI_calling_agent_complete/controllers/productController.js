const Product = require('../models/Product');

// @desc    Get all products (with pagination, search, filter)
// @route   GET /products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const resPerPage = 8;
        const page = parseInt(req.query.page) || 1;
        
        // Search & Filter Logic
        let query = {};
        
        // Search by name
        if (req.query.search) {
            query.name = {
                $regex: req.query.search,
                $options: 'i'
            };
        }

        // Filter by category
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }

        // Filter by price
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // Fetch products
        const products = await Product.find(query)
            .skip(resPerPage * (page - 1))
            .limit(resPerPage);

        // Count total products matching query
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / resPerPage);

        // Get unique categories for dropdown
        const categories = await Product.distinct('category');

        let userFavorites = [];
        if (req.session && req.session.user) {
            const User = require('../models/User');
            const user = await User.findById(req.session.user.id);
            if(user) {
                userFavorites = user.favorites.map(f => f.toString());
            }
        }

        res.render('products', {
            products,
            currentPage: page,
            totalPages,
            totalProducts,
            searchQuery: req.query.search || '',
            selectedCategory: req.query.category || 'All',
            minPrice: req.query.minPrice || '',
            maxPrice: req.query.maxPrice || '',
            categories,
            userFavorites
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// @desc    Get single product
// @route   GET /products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).render('404'); // To be handled
        }
        res.render('product_detail', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
