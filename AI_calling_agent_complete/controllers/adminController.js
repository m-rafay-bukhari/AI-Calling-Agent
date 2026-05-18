const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// @desc    Get admin dashboard
// @route   GET /admin
// @access  Private/Admin
exports.getAdminDashboard = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('admin/dashboard', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// @desc    Show form to create product
// @route   GET /admin/products/new
// @access  Private/Admin
exports.getNewProductForm = (req, res) => {
    res.render('admin/newProduct');
};

// @desc    Create new product
// @route   POST /admin/products/new
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;
        
        let image = '/uploads/default.jpg'; // default
        if (req.file) {
            image = '/uploads/' + req.file.filename;
        }

        const newProduct = new Product({
            name,
            price,
            description,
            category,
            stock,
            image
        });

        await newProduct.save();
        req.flash('success_msg', 'Product created successfully');
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error creating product');
        res.redirect('/admin/products/new');
    }
};

// @desc    Show form to edit product
// @route   GET /admin/products/edit/:id
// @access  Private/Admin
exports.getEditProductForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.redirect('/admin');
        }
        res.render('admin/editProduct', { product });
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
};

// @desc    Update product
// @route   POST /admin/products/edit/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.redirect('/admin');
        }

        product.name = name;
        product.price = price;
        product.description = description;
        product.category = category;
        product.stock = stock;

        if (req.file) {
            // Delete old image if it exists and is not a default or external link
            if (product.image && product.image.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', 'public', product.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            product.image = '/uploads/' + req.file.filename;
        }

        await product.save();
        req.flash('success_msg', 'Product updated successfully');
        res.redirect('/admin');

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error updating product');
        res.redirect(`/admin/products/edit/${req.params.id}`);
    }
};

// @desc    Delete product
// @route   POST /admin/products/delete/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.redirect('/admin');
        }

        // Delete image file if local
        if (product.image && product.image.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', 'public', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Product.deleteOne({ _id: req.params.id });
        req.flash('success_msg', 'Product deleted successfully');
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error deleting product');
        res.redirect('/admin');
    }
};

// @desc    Get all user scripts (Admin)
// @route   GET /admin/scripts
// @access  Private/Admin
exports.getAllScripts = async (req, res) => {
    try {
        const Script = require('../models/Script');
        const scripts = await Script.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.render('admin/scripts', { scripts });
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
};
