const Product = require('../models/Product');
const { createProductDto, updateProductDto } = require('../dto/productDto');
const Category = require('../models/Category');
const { createCategoryDto, updateCategoryDto } = require('../dto/categoryDto');
const mongoose = require('mongoose');

// Create new product
exports.createProduct = async (req, res) => {
  try {
    // Validate request body
    const { error } = createProductDto.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(detail => detail.message) 
      });
    }

    // Create product
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate value error' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categories");
    const productsWithCategoryCount = products.map(product => ({
      ...product.toObject(),
      categoryCount: product.categories ? product.categories.length : 0
    }));
    res.json(productsWithCategoryCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID (using query param)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id).populate('productName categories productContent productSpecification productImage' );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product (using query param)
exports.updateProduct = async (req, res) => {
  try {
    // Validate request body
    const { error } = updateProductDto.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(detail => detail.message) 
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate value error' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete product (using query param)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.query.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { error } = createCategoryDto.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const category = new Category(req.body);
    await category.save();

    // If productId is provided, push category id to product's categories array
    if (req.query.productId) {
      await Product.findByIdAndUpdate(
        req.query.productId,
        { $push: { categories: category._id } },
        { new: true }
      );
    }

    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add update, get, delete as needed 