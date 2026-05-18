const express = require('express');
const router = express.Router();
const { getFavorites, toggleFavorite } = require('../controllers/favoriteController');
const { isLoggedIn } = require('../middleware/auth');

router.get('/', isLoggedIn, getFavorites);
router.post('/toggle/:productId', isLoggedIn, toggleFavorite);

module.exports = router;
