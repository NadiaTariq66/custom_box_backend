const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  shortDescription: { type: String },
  fullContent: { type: String },
  authorName: { type: String },
  publishDate: { type: Date },
  tags: [{ type: String }],
  category: { type: String },
  description: {type: String},
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema); 