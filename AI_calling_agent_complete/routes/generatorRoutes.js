const express = require('express');
const router = express.Router();
const { getGeneratorPage, generateScript } = require('../controllers/generatorController');
const { isLoggedIn } = require('../middleware/auth');

router.get('/', isLoggedIn, getGeneratorPage);
router.post('/', isLoggedIn, generateScript);

module.exports = router;
