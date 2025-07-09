const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
 categoryName: {
    type: String,
    required: true,
    trim: true
  },
  categoryContent: {
    type: String,
    required: true
  },
  categoryImages: [{
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
  metaKeywords: [{
    type: String
  }],
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  relatedCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  quotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote'
  }],
  materialOptions: [{
    image: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String }
  }],
  addOnOptions: [{
    image: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String }
  }],
  finishingOptions: [{
    image: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
 
module.exports = mongoose.model('Category', categorySchema); 