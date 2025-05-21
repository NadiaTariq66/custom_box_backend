const Joi = require('joi');

const createCategoryDto = Joi.object({
  name: Joi.string().required().min(2).max(50),
  description: Joi.string().required().min(10),
  isActive: Joi.boolean().default(true)
});

const updateCategoryDto = Joi.object({
  name: Joi.string().min(2).max(50),
  description: Joi.string().min(10),
  isActive: Joi.boolean()
});

module.exports = {
  createCategoryDto,
  updateCategoryDto
}; 