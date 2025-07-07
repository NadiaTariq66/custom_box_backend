const BlogCategory = require('../models/blogCategory');
const { createBlogCategoryDto, updateBlogCategoryDto } = require('../dto/blogCategoryDto');
const sendNewsletterToAll = require('../utils/sendNewsletter');
exports.addBlogCategory = async (req, res) => {
  try {
    const { error } = createBlogCategoryDto.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const blogCategory = new BlogCategory(req.body);
    await blogCategory.save();
    await sendNewsletterToAll(
      'New Blog Category Posted',
      `A new blog category has been added: ${req.body.categoryName}\n\nCheckout on our website: https://custom-boxes-chi.vercel.app/`
    );
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

    await sendNewsletterToAll(
      'Blog Category Updated',
      `A new blog category has been updated: ${req.body.categoryName}\n\nCheckout on our website: https://custom-boxes-chi.vercel.app/`
    );
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    let query = {};
    if (search) {
      query.categoryName = { $regex: search, $options: 'i' };
    }
    const total = await BlogCategory.countDocuments(query);
    const blogCategories = await BlogCategory.find(query)
      .populate('blogs')
      .skip(skip)
      .limit(limit);
    const totalPages = Math.ceil(total / limit);
    res.json({
      totalCount: total,
      blogCategories,
      currentPage: page,
      totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBlogCategory = async (req, res) => {
  try {
    const blogCategory = await BlogCategory.findByIdAndDelete(req.query.id).populate('blogs');
    if (!blogCategory) return res.status(404).json({ message: 'Blog category not found' });
    res.json({ message: 'Blog category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};