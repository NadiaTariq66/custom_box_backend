const Blog = require('../models/Blog');
const { createBlogDto, updateBlogDto } = require('../dto/blogDto');

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { error } = createBlogDto.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Blogs (paginated)
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);
    res.json({
      totalCount: total,
      blogs,
      currentPage: page,
      totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.query.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { error } = updateBlogDto.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const blog = await Blog.findByIdAndUpdate(req.query.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.query.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 