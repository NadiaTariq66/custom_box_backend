const Joi = require('joi');

const createQuoteDto = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  colour: Joi.string().allow(''),
  height: Joi.string().allow(''),
  width: Joi.string().allow(''),
  depth: Joi.string().allow(''),
  units: Joi.string().allow(''),
  boxStyle: Joi.string().allow(''),
  paperType: Joi.string().allow(''),
  quantity: Joi.string().allow(''),
  finishing: Joi.array().items(Joi.string()),
  additionalInfo: Joi.string().allow(''),
  uploadFile: Joi.string().allow(''),
});

module.exports = { createQuoteDto }; 