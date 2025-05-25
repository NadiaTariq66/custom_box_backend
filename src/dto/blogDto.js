const Joi = require('joi');

const createBlogDto = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  image: Joi.string().allow(''),
  shortDescription: Joi.string().allow(''),
  fullContent: Joi.string().allow(''),
  authorName: Joi.string().allow(''),
  publishDate: Joi.date().allow(''),
  tags: Joi.array().items(Joi.string()),
  category: Joi.string().allow(''),
  status: Joi.string().valid('draft', 'published').default('draft'),
});

const updateBlogDto = Joi.object({
  title: Joi.string(),
  slug: Joi.string(),
  image: Joi.string().allow(''),
  shortDescription: Joi.string().allow(''),
  fullContent: Joi.string().allow(''),
  authorName: Joi.string().allow(''),
  publishDate: Joi.date().allow(''),
  tags: Joi.array().items(Joi.string()),
  category: Joi.string().allow(''),
  status: Joi.string().valid('draft', 'published'),
});

module.exports = { createBlogDto, updateBlogDto }; 