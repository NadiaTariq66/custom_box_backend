const express = require('express');
const router = express.Router();
const blogCategoryController = require('../controllers/blogCategoryController');

router.post('/addBlogCategory', blogCategoryController.addBlogCategory);
router.put('/updateBlogCategory', blogCategoryController.updateBlogCategory);
router.get('/getAllBlogCategory', blogCategoryController.getAllBlogCategories);
router.delete('/deleteBlogCategory', blogCategoryController.deleteBlogCategory);

module.exports = router;