const Blog = require('../models/Blog');
const { createBlogDto, updateBlogDto } = require('../dto/blogDto');

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { error } = createBlogDto.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const blogData = {
      ...req.body,
      category: req.body.categoryId // Map categoryId to category field
    };
    delete blogData.categoryId; // Remove categoryId from the data
    
    const blog = new Blog(blogData);
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
    const categoryId = req.query.categoryId;
    
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } }
      ];
    }
    if (categoryId) {
      query.category = categoryId;
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('category', 'categoryName')
      .skip(skip)
      .limit(limit);
      
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
    const blog = await Blog.findById(req.query.id).populate('category', 'categoryName');
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
    
    const updateData = {
      ...req.body,
      category: req.body.categoryId // Map categoryId to category field
    };
    delete updateData.categoryId; // Remove categoryId from the data
    
    const blog = await Blog.findByIdAndUpdate(req.query.id, updateData, { new: true })
      .populate('category', 'categoryName');
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