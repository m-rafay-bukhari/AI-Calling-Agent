const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
    getAdminDashboard, 
    getNewProductForm, 
    createProduct, 
    getEditProductForm, 
    updateProduct, 
    deleteProduct,
    getAllScripts
} = require('../controllers/adminController');

// Multer Config for Image Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'AI_calling_agent_complete/public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

// Admin Routes
router.get('/', getAdminDashboard);

// CREATE
router.get('/products/new', getNewProductForm);
router.post('/products/new', upload.single('image'), createProduct);

// UPDATE
router.get('/products/edit/:id', getEditProductForm);
router.post('/products/edit/:id', upload.single('image'), updateProduct);

// DELETE
router.post('/products/delete/:id', deleteProduct);

// Scripts Management
router.get('/scripts', getAllScripts);

module.exports = router;
