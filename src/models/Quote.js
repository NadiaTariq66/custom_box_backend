const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  colour: { type: String },
  height: { type: String },
  width: { type: String },
  depth: { type: String },
  units: { type: String },
  boxStyle: { type: String },
  paperType: { type: String },
  quantity: { type: String },
  finishing: [{ type: String }],
  additionalInfo: { type: String },
  uploadFile: { type: String },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema); 