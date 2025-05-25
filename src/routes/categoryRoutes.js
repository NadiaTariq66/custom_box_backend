const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/addCategory', productController.createCategory);
router.get('/getAllCategories', productController.getAllCategories);

module.exports = router; 