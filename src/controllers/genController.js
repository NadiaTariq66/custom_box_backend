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

exports.genericSearch = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: 'search query param is required' });
    }

    // 1. Search by product name
    const products = await Product.find({ productName: { $regex: search, $options: 'i' } })
      .populate('categories');

    if (products.length > 0) {
      // If products found, return products with their categories populated
      return res.json({ products });
    }

    // 2. If no products found, search by category name
    const categories = await Category.find({ categoryName: { $regex: search, $options: 'i' } })
      .populate('productId');
      

    if (categories.length > 0) {
      // If categories found, return categories (each with productId field)
      return res.json({ categories });
    }

    // If nothing found
    return res.json({ products: [], categories: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};