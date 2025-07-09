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
  relatedCategories: Joi.array().items(Joi.string().hex().length(24)),
  quotes: Joi.array().items(Joi.string().hex().length(24)),
  productId: Joi.string(),
  materialOptions: Joi.array().items(
    Joi.object({
      image: Joi.string().uri().required(),
      name: Joi.string().required(),
      description: Joi.string().required()
    })
  ),
  addOnOptions: Joi.array().items(
    Joi.object({
      image: Joi.string().uri().required(),
      name: Joi.string().required(),
      description: Joi.string().required()
    })
  ),
  finishingOptions: Joi.array().items(
    Joi.object({
      image: Joi.string().uri().required(),
      name: Joi.string().required(),
      description: Joi.string().required()
    })
  )
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
  relatedCategories: Joi.array().items(Joi.string().hex().length(24)),
  quotes: Joi.array().items(Joi.string().hex().length(24)),
  materialOptions: Joi.array().items(
    Joi.object({
      image: Joi.string().uri().required(),
      name: Joi.string().required(),
      description: Joi.string().required()
    })
  ),
  addOnOptions: Joi.array().items(
    Joi.object({
      image: Joi.string().uri().required(),
      name: Joi.string().required(),
      description: Joi.string().required()
    })
  ),
  finishingOptions: Joi.array().items(
    Joi.object({
      image: Joi.string().uri().required(),
      name: Joi.string().required(),
      description: Joi.string().required()
    })
  )
});

module.exports = {
  createCategoryDto,
  updateCategoryDto
};

exports.toCategoryDto = (category) => ({
  id: category._id,
  categoryName: category.categoryName,
  categoryContent: category.categoryContent,
  categoryImages: category.categoryImages,
  metaTitle: category.metaTitle,
  metaDescription: category.metaDescription,
  customSlug: category.customSlug,
  metaKeywords: category.metaKeywords,
  faqs: category.faqs,
  relatedCategories: category.relatedCategories,
  quotes: category.quotes,
  productId: category.productId,
  materialOptions: category.materialOptions?.map(opt => ({
    image: opt.image,
    name: opt.name,
    description: opt.description
  })),
  addOnOptions: category.addOnOptions?.map(opt => ({
    image: opt.image,
    name: opt.name,
    description: opt.description
  })),
  finishingOptions: category.finishingOptions?.map(opt => ({
    image: opt.image,
    name: opt.name,
    description: opt.description
  }))
}); 