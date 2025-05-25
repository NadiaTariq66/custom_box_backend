const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productContent: {
    type: String,
    required: true
  },
  productImages: [{
    type: String,
    required: true
  }],
  metaTitle: {
    type: String
  },
  metaDescription: {
    type: String
  },
  customSlug: {
    type: String
  },
  metaKeywords: {
    type: String
  },
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
 
module.exports = mongoose.model('Category', categorySchema); 