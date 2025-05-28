const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product routes
router.post('/addProduct', productController.createProduct);
router.get('/getAllProducts', productController.getAllProducts);
router.get('/getProductCategories', productController.getProductCategories);
router.put('/updateProduct', productController.updateProduct);
router.delete('/deleteProduct', productController.deleteProduct);



module.exports = router; 