const Joi = require('joi');

const createStyleDto = Joi.object({
  styleName: Joi.string().required(),
  styleCode: Joi.string().allow(''),
  slug: Joi.string().allow(''),
  images: Joi.array().items(Joi.string()).max(5),
  category: Joi.string().allow(''),
  tags: Joi.array().items(Joi.string()),
  isFeatured: Joi.boolean(),
  seoTitle: Joi.string().allow(''),
  seoDescription: Joi.string().allow(''),
  shortDescription: Joi.string().allow(''),
  fullDescription: Joi.string().allow(''),
  status: Joi.string().valid('draft', 'published').default('draft'),
});

const updateStyleDto = Joi.object({
  styleName: Joi.string(),
  styleCode: Joi.string().allow(''),
  slug: Joi.string().allow(''),
  images: Joi.array().items(Joi.string()).max(5),
  category: Joi.string().allow(''),
  tags: Joi.array().items(Joi.string()),
  isFeatured: Joi.boolean(),
  seoTitle: Joi.string().allow(''),
  seoDescription: Joi.string().allow(''),
  shortDescription: Joi.string().allow(''),
  fullDescription: Joi.string().allow(''),
  status: Joi.string().valid('draft', 'published'),
});

module.exports = { createStyleDto, updateStyleDto }; 