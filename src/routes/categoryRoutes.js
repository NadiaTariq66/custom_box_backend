const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/addCategory', productController.createCategory);
router.get('/getAllCategories', productController.getAllCategories);
router.put('/updateCategory', productController.updateCategory);
router.delete('/deleteCategory', productController.deleteCategory);

module.exports = router; 