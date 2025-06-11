const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, trim: true },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }],
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlogCategory', blogCategorySchema);