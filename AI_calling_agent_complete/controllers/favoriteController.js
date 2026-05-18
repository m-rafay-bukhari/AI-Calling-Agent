const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's favorite products
// @route   GET /favorites
// @access  Private
exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).populate('favorites');
        res.render('favorites', { favorites: user.favorites });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to load favorites');
        res.redirect('/products');
    }
};

// @desc    Toggle favorite product
// @route   POST /favorites/toggle/:productId
// @access  Private
exports.toggleFavorite = async (req, res) => {
    try {
        const productId = req.params.productId;
        
        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const user = await User.findById(req.session.user.id);
        
        // Use string comparison for reliability with Mongoose ObjectIds
        const favIndex = user.favorites.findIndex(id => id.toString() === productId);
        
        if (favIndex > -1) {
            user.favorites.splice(favIndex, 1);
            await user.save();
            return res.json({ success: true, favorited: false, message: 'Removed from favorites' });
        } else {
            user.favorites.push(productId);
            await user.save();
            return res.json({ success: true, favorited: true, message: 'Added to favorites' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
