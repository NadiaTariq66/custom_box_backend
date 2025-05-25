const Joi = require('joi');

const createCategoryDto = Joi.object({
  productName: Joi.string().required().min(2).max(100),
  productContent: Joi.string().required().min(10),
  productImages: Joi.array().items(Joi.string().uri()).min(1).required(),
  metaTitle: Joi.string().allow(''),
  metaDescription: Joi.string().allow(''),
  customSlug: Joi.string().allow(''),
  metaKeywords: Joi.string().allow(''),
  faqs: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required()
    })
  ),
  relatedProducts: Joi.array().items(Joi.string().hex().length(24)),
});

const updateCategoryDto = Joi.object({
  productName: Joi.string().min(2).max(100),
  productContent: Joi.string().min(10),
  productImages: Joi.array().items(Joi.string().uri()),
  metaTitle: Joi.string().allow(''),
  metaDescription: Joi.string().allow(''),
  customSlug: Joi.string().allow(''),
  metaKeywords: Joi.string().allow(''),
  faqs: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required()
    })
  ),
  relatedProducts: Joi.array().items(Joi.string().hex().length(24)),
});

module.exports = {
  createCategoryDto,
  updateCategoryDto
}; 