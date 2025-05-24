const Joi = require('joi');

const createProductDto = Joi.object({
  productName: Joi.string().required().min(3).max(100),
  productContent: Joi.string().required(),
  productSpecification: Joi.string().required(),
  productImage: Joi.string().required()
});

const updateProductDto = Joi.object({
  productName: Joi.string().min(3).max(100),
  productContent: Joi.string(),
  productSpecification: Joi.string(),
  productImage: Joi.string()
});

module.exports = {
  createProductDto,
  updateProductDto
}; 