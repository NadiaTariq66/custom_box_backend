const Joi = require('joi');

const createCategoryDto = Joi.object({
  categoryName: Joi.string().required().min(2).max(100),
  categoryContent: Joi.string().required().min(10),
  categoryImages: Joi.array().items(Joi.string().uri()).min(1).required(),
  metaTitle: Joi.string().allow(''),
  metaDescription: Joi.string().allow(''),
  customSlug: Joi.string().allow(''),
  metaKeywords: Joi.array().allow(''),
  faqs: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required()
    })
  ),
  relatedProducts: Joi.array().items(Joi.string().hex().length(24)),
  productId:Joi.string()
});

const updateCategoryDto = Joi.object({
  categoryName: Joi.string().min(2).max(100),
  categoryContent: Joi.string().min(10),
  categoryImages: Joi.array().items(Joi.string().uri()),
  metaTitle: Joi.string().allow(''),
  metaDescription: Joi.string().allow(''),
  customSlug: Joi.string().allow(''),
  metaKeywords: Joi.array().allow(''),
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