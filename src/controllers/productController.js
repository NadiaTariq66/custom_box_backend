const Product = require('../models/Product');
const { createProductDto, updateProductDto } = require('../dto/productDto');
const Category = require('../models/Category');
const { createCategoryDto, updateCategoryDto } = require('../dto/categoryDto');
const mongoose = require('mongoose');
const sendNewsletterToAll = require('../utils/sendNewsletter');
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

    await sendNewsletterToAll(
      'Product Added',
      `A new product has been added: ${product.productName}\n\nCheckout on our website: https://custom-boxes-chi.vercel.app/`
    );

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
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
      query.productName = { $regex: search, $options: 'i' }; // case-insensitive search
    }
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("categories")
      .skip(skip)
      .limit(limit);
    const productsWithCategoryCount = products.map(product => ({
      ...product.toObject(),
      categoryCount: product.categories ? product.categories.length : 0
    }));
    const totalPages = Math.ceil(total / limit);
    res.json({
      totalCount: total,
      products: productsWithCategoryCount,
      currentPage: page,
      totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID (using query param)
exports.getProductCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // First get the product
    const product = await Product.findById(req.query.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Build category query
    let categoryQuery = { _id: { $in: product.categories } };
    if (search) {
      categoryQuery.categoryName = { $regex: search, $options: 'i' };
    }

    // Get total count of categories
    const totalCategories = await Category.countDocuments(categoryQuery);

    // Get paginated categories
    const categories = await Category.find(categoryQuery)
      .skip(skip)
      .limit(limit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCategories / limit);

    // Prepare response
    const response = {
      product: {
        ...product.toObject(),
        categories: categories,
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalCategories,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null
      }
    };

    res.json(response);
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

    await sendNewsletterToAll(
      'Product Updated',
      `A new product has been updated: ${product.productName}\n\nCheckout on our website: https://custom-boxes-chi.vercel.app/`
    );

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

    // Include productId from query into request body (if present)
    const categoryData = { ...req.body };
    if (req.query.productId) {
      categoryData.productId = req.query.productId;
    }

    const category = new Category(categoryData);
    await category.save();

    // Push category to Product
    if (req.query.productId) {
      await Product.findByIdAndUpdate(
        req.query.productId,
        { $push: { categories: category._id } }
      );
    }
     await sendNewsletterToAll(
    'New Category Posted!',
    `A new category titled "${category.categoryName}" has been posted.\n\nCheckout on our website: https://custom-boxes-chi.vercel.app/`
  );

    res.status(201).json({
      message: 'Category created',
      category
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllCategories = async (req, res) => {
 try {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.categoryName = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    const total = await Category.countDocuments(query);
    const categories = await Category.find(query).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);

    res.json({
      totalCount: total,
      categories,
      currentPage: page,
      totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Update product (using query param)
exports.updateCategory = async (req, res) => {
  try {
    // Validate request body
    const { error } = updateCategoryDto.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(detail => detail.message) 
      });
    }

    const product = await Category.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Category not found' });
    }
 await sendNewsletterToAll(
    'Category Updated!',
    `A category titled "${product.categoryName}" has been updated.\n\nCheckout on our website: https://custom-boxes-chi.vercel.app/`
  );
    res.json({
      message: 'Category updated successfully',
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
exports.deleteCategory = async (req, res) => {
  try {
    const product = await Category.findByIdAndDelete(req.query.id);
    if (!product) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRelatedCategories = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!categoryId) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    // First get the main category with its relatedCategories
    const mainCategory = await Category.findById(categoryId);
    if (!mainCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Build the query for related categories
    let query = {
      _id: { $in: mainCategory.relatedCategories || [] }, // Only get categories that are in relatedCategories array
      categoryName: { $regex: search, $options: 'i' } // Case-insensitive search
    };

    // Get total count and related categories
    const [total, relatedCategories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      totalCount: total,
      relatedCategories,
      currentPage: page,
      totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add update, get, delete as needed 