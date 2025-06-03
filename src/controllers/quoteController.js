const Quote = require('../models/Quote');
const { createQuoteDto } = require('../dto/quoteDto');
const Category = require('../models/Category');
const Joi = require('joi');


exports.createQuote = async (req, res) => {
  try {
    const { error } = createQuoteDto.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details.map(detail => detail.message) });
    }

    // Check if category exists
    const categoryId = req.query.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Create quote
    const quote = new Quote({ ...req.body, categoryId });
    await quote.save();

    // Push quote ID to category's quotes array
    await Category.findByIdAndUpdate(
      categoryId,
      { $push: { quotes: quote._id } },
      { new: true }
    );

    res.status(201).json({ 
      message: 'Quote request submitted successfully', 
      quote
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.customerList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    let query = {};
    if (search) {
      query.fullName = { $regex: search, $options: 'i' };
    }
    const total = await Quote.countDocuments(query);
    const quotes = await Quote.find(query).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);
    res.json({
      count: total,
      quotes,
      currentPage: page,
      totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 