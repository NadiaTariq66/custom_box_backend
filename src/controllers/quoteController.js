const Quote = require('../models/Quote');
const { createQuoteDto } = require('../dto/quoteDto');

exports.createQuote = async (req, res) => {
  try {
    const { error } = createQuoteDto.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details.map(detail => detail.message) });
    }
    const quote = new Quote(req.body);
    await quote.save();
    res.status(201).json({ message: 'Quote request submitted successfully', quote });
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