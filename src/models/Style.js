const mongoose = require('mongoose');

const styleSchema = new mongoose.Schema({
  styleName: { type: String, required: true },
  styleCode: { type: String },
  slug: { type: String },
  images: [{ type: String }], // max 5 images, handle in validation
  category: { type: String },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  seoTitle: { type: String },
  seoDescription: { type: String },
  shortDescription: { type: String },
  fullDescription: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Style', styleSchema); 