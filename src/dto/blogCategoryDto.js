const Joi = require('joi');

const createBlogCategoryDto = Joi.object({
  categoryName: Joi.string().required().min(2).max(100),
  metaTitle: Joi.string().allow(''),
  metaDescription: Joi.string().allow(''),
  metaKeywords: Joi.array().items(Joi.string()).allow('')
});

const updateBlogCategoryDto = Joi.object({
  categoryName: Joi.string().min(2).max(100),
  metaTitle: Joi.string().allow(''),
  metaDescription: Joi.string().allow(''),
  metaKeywords: Joi.array().items(Joi.string()).allow('')
});

module.exports = {
  createBlogCategoryDto,
  updateBlogCategoryDto
};