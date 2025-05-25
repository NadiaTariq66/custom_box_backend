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