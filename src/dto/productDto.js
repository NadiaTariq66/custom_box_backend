const Joi = require('joi');

const createProductDto = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10),
  price: Joi.number().required().min(0),
  category: Joi.string().required().valid('Electronics', 'Clothing', 'Books', 'Other'),
  stock: Joi.number().min(0).default(0)
});

const updateProductDto = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(10),
  price: Joi.number().min(0),
  category: Joi.string().valid('Electronics', 'Clothing', 'Books', 'Other'),
  stock: Joi.number().min(0)
});

module.exports = {
  createProductDto,
  updateProductDto
}; 