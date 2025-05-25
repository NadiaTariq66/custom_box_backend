const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

router.post('/addBlog', createBlog);
router.get('/getAllBlogs', getAllBlogs);
router.get('/getBlogById', getBlogById);
router.put('/updateBlog', updateBlog);
router.delete('/deleteBlog', deleteBlog);

module.exports = router; 