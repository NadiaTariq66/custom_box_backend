const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/addCategory', productController.createCategory);

module.exports = router; 