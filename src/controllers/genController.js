// src/controllers/gencontroller.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const Style = require('../models/Style');
const Admin = require('../models/Admin');
const Blog = require('../models/Blog');

exports.uploadFiles = (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const fileInfos = req.files.map(file => ({
      url: file.path, // Cloudinary URL
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    }));
    res.json({ files: fileInfos });
};

// Generic search API with pagination
exports.genericSearch = async (req, res) => {
  try {
    const { type, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    if (!search) {
      return res.status(400).json({ message: 'search query param is required' });
    }
    if (type === 'product') {
      const [results, total] = await Promise.all([
        Product.find({ productName: { $regex: search, $options: 'i' } }).skip(skip).limit(limit),
        Product.countDocuments({ productName: { $regex: search, $options: 'i' } })
      ]);
      return res.json({
        products: {
          results,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      });
    } else if (type === 'category') {
      const [results, total] = await Promise.all([
        Category.find({ categoryName: { $regex: search, $options: 'i' } }).skip(skip).limit(limit),
        Category.countDocuments({ categoryName: { $regex: search, $options: 'i' } })
      ]);
      return res.json({
        categories: {
          results,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      });
    } else if (type === 'style') {
      const [results, total] = await Promise.all([
        Style.find({ styleName: { $regex: search, $options: 'i' } }).skip(skip).limit(limit),
        Style.countDocuments({ styleName: { $regex: search, $options: 'i' } })
      ]);
      return res.json({
        styles: {
          results,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      });
    } else if (type === 'user') {
      const [results, total] = await Promise.all([
        Admin.find({ email: { $regex: search, $options: 'i' } }).skip(skip).limit(limit),
        Admin.countDocuments({ email: { $regex: search, $options: 'i' } })
      ]);
      return res.json({
        users: {
          results,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      });
    } else if (type === 'blog') {
      const [results, total] = await Promise.all([
        Blog.find({ title: { $regex: search, $options: 'i' } }).skip(skip).limit(limit),
        Blog.countDocuments({ title: { $regex: search, $options: 'i' } })
      ]);
      return res.json({
        blogs: {
          results,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      });
    } else if (!type) {
      // Search all with pagination for each
      const [products, productsTotal, categories, categoriesTotal, styles, stylesTotal, users, usersTotal, blogs, blogsTotal] = await Promise.all([
        Product.find({ productName: { $regex: search, $options: 'i' } }).skip(skip).limit(limit),
        Product.countDocuments({ productName: { $regex: search, $options: 'i' } }),
        Category.find({ categoryName: { $regex: search, $options: 'i' } }).skip(skip).limit(limit),
        Category.countDocuments({ categoryName: { $regex: search, $options: 'i' } }),
        Style.find({ styleName: { $regex: search, $options: 'i' } }).skip(skip).limit(limit),
        Style.countDocuments({ styleName: { $regex: search, $options: 'i' } }),
        Admin.find({ email: { $regex: search, $options: 'i' } }).skip(skip).limit(limit),
        Admin.countDocuments({ email: { $regex: search, $options: 'i' } }),
        Blog.find({ title: { $regex: search, $options: 'i' } }).skip(skip).limit(limit),
        Blog.countDocuments({ title: { $regex: search, $options: 'i' } })
      ]);
      return res.json({
        products: {
          results: products,
          total: productsTotal,
          page,
          totalPages: Math.ceil(productsTotal / limit)
        },
        categories: {
          results: categories,
          total: categoriesTotal,
          page,
          totalPages: Math.ceil(categoriesTotal / limit)
        },
        styles: {
          results: styles,
          total: stylesTotal,
          page,
          totalPages: Math.ceil(stylesTotal / limit)
        },
        users: {
          results: users,
          total: usersTotal,
          page,
          totalPages: Math.ceil(usersTotal / limit)
        },
        blogs: {
          results: blogs,
          total: blogsTotal,
          page,
          totalPages: Math.ceil(blogsTotal / limit)
        }
      });
    } else {
      return res.status(400).json({ message: 'Invalid type. Use "product", "category", "style", "user", or "blog".' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};