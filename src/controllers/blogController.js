const Blog = require('../models/Blog');
const { createBlogDto, updateBlogDto } = require('../dto/blogDto');
const BlogCategory = require('../models/blogCategory');
const sendNewsletterToAll = require('../utils/sendNewsletter');
// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { error } = createBlogDto.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Check if category exists
    const blogCategoryId = req.query.blogCategoryId;
    const blogCategory = await BlogCategory.findById(blogCategoryId);
    if (!blogCategory) return res.status(404).json({ message: 'Blog category not found' });

    // Create blog with category reference
    const blog = new Blog({ ...req.body, blogCategoryId: blogCategoryId });
    await blog.save();

    // Push blog id to blogCategory's blogs array
    await BlogCategory.findByIdAndUpdate(
      blogCategoryId,
      { $push: { blogs: blog._id } },
      { new: true }
    );

    await sendNewsletterToAll(
      'New Blog Posted',
      `A new blog has been added: ${blog.title}`
    );

    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.query.id).populate("blogCategoryId");
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
    const newCategoryId = req.query.blogCategoryId;

    // If category is being changed
    if (newCategoryId && newCategoryId !== String(blog.blogCategoryId)) {
      const newCategory = await BlogCategory.findById(newCategoryId);
      if (!newCategory) return res.status(404).json({ message: 'New blog category not found' });

      // Remove blog from old category
      await BlogCategory.findByIdAndUpdate(blog.blogCategoryId, {
        $pull: { blogs: blog._id }
      });

      // Add blog to new category
      await BlogCategory.findByIdAndUpdate(newCategoryId, {
        $push: { blogs: blog._id }
      });

      blog.blogCategoryId = newCategoryId;
    }

    // Update other blog fields
    Object.assign(blog, req.body);
    await blog.save();

    await sendNewsletterToAll(
      'Blog Updated',
      `A new blog has been updated: ${blog.title}`
    );

    res.status(200).json({ message: 'Blog updated successfully', blog });
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

// Get All Blogs (paginated)
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const blogCategoryId = req.query.blogCategoryId;
    
    let query = {};
    
    // Add blogCategoryId to query if provided
    if (blogCategoryId) {
      query.blogCategoryId = blogCategoryId;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query).populate("blogCategoryId").skip(skip).limit(limit);
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