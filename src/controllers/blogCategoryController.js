const BlogCategory = require('../models/blogCategory');
const { createBlogCategoryDto, updateBlogCategoryDto } = require('../dto/blogCategoryDto');

exports.addBlogCategory = async (req, res) => {
  try {
    const { error } = createBlogCategoryDto.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const blogCategory = new BlogCategory(req.body);
    await blogCategory.save();
    res.status(201).json({ message: 'Blog category created', blogCategory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBlogCategory = async (req, res) => {
  try {
    const { error } = updateBlogCategoryDto.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const blogCategory = await BlogCategory.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!blogCategory) return res.status(404).json({ message: 'Blog category not found' });

    res.json({ message: 'Blog category updated', blogCategory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBlogCategory = async (req, res) => {
  try {
    const blogCategory = await BlogCategory.findById(req.query.id);
    if (!blogCategory) return res.status(404).json({ message: 'Blog category not found' });
    res.json(blogCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBlogCategories = async (req, res) => {
  try {
    const blogCategories = await BlogCategory.find();
    res.json(blogCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBlogCategory = async (req, res) => {
  try {
    const blogCategory = await BlogCategory.findByIdAndDelete(req.query.id);
    if (!blogCategory) return res.status(404).json({ message: 'Blog category not found' });
    res.json({ message: 'Blog category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};